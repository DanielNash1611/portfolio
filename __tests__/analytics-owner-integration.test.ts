import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { POST as portfolioPost } from "../app/api/analytics/route";
import { POST as productPost } from "../app/api/analytics/events/route";
import { getDatabaseClient } from "../lib/db";

test(
  "isolated owner registration is atomic with ingestion, idempotent and scoped; arbitrary properties stay dropped",
  { skip: !process.env.ANALYTICS_TEST_HOST },
  async () => {
    assert.equal(
      new URL(process.env.DATABASE_URL!).hostname,
      process.env.ANALYTICS_TEST_HOST,
    );
    assert.equal(
      process.env.DATABASE_BRANCH_NAME,
      "owner-traffic-validation-20261014",
    );
    assert.equal(process.env.APP_ENV, "validation");
    try {
      const sql = getDatabaseClient();
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
    }
  },
);
