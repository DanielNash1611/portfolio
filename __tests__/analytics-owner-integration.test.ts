import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { neonConfig } from "@neondatabase/serverless";
import { ownerEventStatement, ownerExclusionClause } from "../lib/analytics-owner-policy";
import { NextRequest } from "next/server";
import { POST as portfolioPost } from "../app/api/analytics/route";
import { POST as productPost } from "../app/api/analytics/events/route";
import { getDatabaseClient } from "../lib/db";

test(
  "isolated owner registration is atomic with ingestion, idempotent and scoped; arbitrary properties stay dropped",
  { skip: process.env.ANALYTICS_DISPOSABLE_LOCAL_TEST !== "1" },
  async () => {
    assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(new URL(process.env.DATABASE_URL!).hostname), "Disposable localhost database required; hosted/shared targets are forbidden.");
    assert.equal(process.env.ANALYTICS_OWNER_TRAFFIC_ENABLED, "true");
    assert.equal(
      new URL(process.env.DATABASE_URL!).hostname,
      process.env.ANALYTICS_TEST_HOST,
    );
    assert.equal(
      process.env.DATABASE_BRANCH_NAME,
      "owner-traffic-validation-20261014",
    );
    assert.equal(process.env.APP_ENV, "validation");
    assert.match(new URL(process.env.DATABASE_URL!).pathname, /^\/owner_traffic_validation_[a-zA-Z0-9_]+$/, "Use a dedicated disposable test database.");
    const proxy = new URL(process.env.ANALYTICS_TEST_HTTP_ENDPOINT!);
    assert.equal(proxy.protocol, "http:");
    assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(proxy.hostname));
    assert.equal(proxy.pathname, "/sql");
    assert.equal(proxy.username + proxy.password + proxy.search + proxy.hash, "");
    const previousEndpoint = neonConfig.fetchEndpoint;
    neonConfig.fetchEndpoint = proxy.href;
    try {
      const sql = getDatabaseClient();
      // Fixed repository SQL, applied only after all disposable-loopback guards.
      for (const name of ["004_daniel_analytics.sql", "007_analytics_owner_identities.sql", "007_analytics_owner_identities.sql"]) {
        const text = await readFile(new URL("../migrations/" + name, import.meta.url), "utf8");
        const statements = text.split(/;\s*(?:\r?\n|$)/).map(value => value.trim()).filter(Boolean);
        await sql.transaction(statements.map(statement => sql.query(statement)));
      }
      const failedVisitor = "visitor_" + randomUUID();
      const failed = ownerEventStatement(
        "INSERT INTO analytics_events (id,client_event_id,occurred_at,app,app_env,database_branch_name,visitor_id,session_id,event_name) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
        [randomUUID(), randomUUID(), new Date().toISOString(), "portfolio", "validation", "owner-traffic-validation-20261014", failedVisitor, "", "page_viewed"], true, true,
      );
      await assert.rejects(async () => await sql.query(failed.query, failed.params), error => (error as {code?: string}).code === "23514");
      const rolledBack = await sql.query("SELECT (SELECT count(*)::int FROM analytics_owner_identities WHERE visitor_id=$1) AS owners, (SELECT count(*)::int FROM analytics_events WHERE visitor_id=$1) AS events", [failedVisitor]) as Array<{owners:number;events:number}>;
      assert.deepEqual(rolledBack[0], {owners:0,events:0});
      for (const app of ["portfolio", "gravity"]) {
        const visitor = "visitor_" + randomUUID(),
          clientId = randomUUID();
        const payload = {
          app,
          visitorId: visitor,
          sessionId: "session_" + randomUUID(),
          clientEventId: clientId,
          occurredAt: new Date().toISOString(),
          eventName: "page_viewed",
          pagePath: "/",
          trafficType: "owner",
          properties: {
            message: "Dropped synthetic private field",
            trafficType: "ignore-me",
          },
        };
        const send = (value: unknown, dnt = false) =>
          app === "portfolio"
            ? portfolioPost(
                new NextRequest("http://localhost:3000/api/analytics", {
                  method: "POST",
                  headers: {
                    origin: "http://localhost:3000",
                    host: "localhost:3000",
                    "content-type": "application/json",
                  },
                  body: JSON.stringify(value),
                }),
              )
            : productPost(
                new NextRequest("http://localhost:3000/api/analytics/events", {
                  method: "POST",
                  headers: {
                    origin: "https://gravity.danielnash.co",
                    "content-type": "application/json",
                    ...(dnt ? { dnt: "1" } : {}),
                  },
                  body: JSON.stringify(value),
                }),
              );
        assert.equal((await send(payload)).status, 200);
        assert.equal((await send(payload)).status, 200);
        const result = (await sql.query(
          `SELECT (SELECT count(*)::int FROM analytics_owner_identities WHERE app=$1 AND app_env='validation' AND visitor_id=$2) AS owners,
        count(*)::int AS events,count(*) FILTER (WHERE properties<>'{}'::jsonb)::int AS private_properties
        FROM analytics_events WHERE app=$1 AND app_env='validation' AND visitor_id=$2`,
          [app, visitor],
        )) as Array<{
          owners: number;
          events: number;
          private_properties: number;
        }>;
        assert.equal(result[0].owners, 1);
        assert.equal(result[0].events, 1);
        assert.equal(result[0].private_properties, 0);
        const ordinaryVisitor = "visitor_" + randomUUID();
        assert.equal(
          (
            await send({
              ...payload,
              visitorId: ordinaryVisitor,
              clientEventId: randomUUID(),
              trafficType: "anything",
            })
          ).status,
          200,
        );
        assert.equal(
          (
            (await sql.query(
              `SELECT count(*)::int AS count FROM analytics_owner_identities WHERE app=$1 AND visitor_id=$2`,
              [app, ordinaryVisitor],
            )) as Array<{ count: number }>
          )[0].count,
          0,
        );
        const report = await sql.query(
          `SELECT count(*)::int AS count FROM analytics_events WHERE app=$1 AND app_env='validation' AND visitor_id IN ($2,$3) ${ownerExclusionClause(false, true)}`,
          [app, visitor, ordinaryVisitor],
        ) as Array<{count:number}>;
        assert.equal(report[0].count, 1);
        const included = await sql.query(
          `SELECT count(*)::int AS count FROM analytics_events WHERE app=$1 AND app_env='validation' AND visitor_id IN ($2,$3) ${ownerExclusionClause(true, true)}`,
          [app, visitor, ordinaryVisitor],
        ) as Array<{count:number}>;
        assert.equal(included[0].count, 2);
        await sql.query("INSERT INTO analytics_owner_identities(app,app_env,visitor_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING", [app === "portfolio" ? "gravity" : "portfolio", "validation", ordinaryVisitor]);
        await sql.query("INSERT INTO analytics_owner_identities(app,app_env,visitor_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING", [app, "other-validation", ordinaryVisitor]);
        const scoped = await sql.query(
          `SELECT count(*)::int AS count FROM analytics_events WHERE app=$1 AND app_env='validation' AND visitor_id=$2 ${ownerExclusionClause(false, true)}`,
          [app, ordinaryVisitor],
        ) as Array<{count:number}>;
        assert.equal(scoped[0].count, 1, "Other app/environment registrations cannot exclude this visitor.");
        if (app === "gravity") {
          const disabledVisitor = "visitor_" + randomUUID();
          await send(
            {
              ...payload,
              visitorId: disabledVisitor,
              clientEventId: randomUUID(),
            },
            true,
          );
          assert.equal(
            (
              (await sql.query(
                `SELECT count(*)::int AS count FROM analytics_events WHERE app=$1 AND visitor_id=$2`,
                [app, disabledVisitor],
              )) as Array<{ count: number }>
            )[0].count,
            0,
          );
        }
      }
    } catch (error) {
      if (error instanceof assert.AssertionError) throw error;
      throw new Error(
        "Isolated analytics owner ingestion failed. Check the validation branch configuration.",
      );
    } finally {
      neonConfig.fetchEndpoint = previousEndpoint;
    }
  },
);
