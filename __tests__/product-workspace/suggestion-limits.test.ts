import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { NextRequest } from "next/server";
import { createDatabaseClient, type DatabaseClient } from "../../lib/db";
import {
  createDurableSuggestionLimiter,
  hashSuggestionClient,
  SUGGESTION_CLIENT_LIMIT,
  SUGGESTION_GLOBAL_LIMIT,
  SUGGESTION_WINDOW_SECONDS,
} from "../../lib/product-workspace/suggestion-limits";
import { emptyDraft } from "../../lib/product-workspace/model";
import { suggestionInput } from "../../lib/product-workspace/suggestions";
import { POST } from "../../app/api/product-workspace/suggest/route";

test("durable client identifiers are scoped HMACs and require a secret", () => {
  const first = hashSuggestionClient("192.0.2.1", "first test secret");
  assert.match(first, /^[a-f0-9]{64}$/);
  assert.equal(first, hashSuggestionClient("192.0.2.1", "first test secret"));
  assert.notEqual(
    first,
    hashSuggestionClient("192.0.2.2", "first test secret"),
  );
  assert.notEqual(
    first,
    hashSuggestionClient("192.0.2.1", "other test secret"),
  );
  assert.throws(() => hashSuggestionClient("192.0.2.1", " "));
});

test("database errors and unverifiable admission results fail closed", async () => {
  const unavailable = {
    transaction: async () => {
      throw new Error("Unavailable database");
    },
  } as unknown as DatabaseClient;
  await assert.rejects(
    createDurableSuggestionLimiter(unavailable, "test secret")("192.0.2.1"),
  );
  for (const retry_after of [undefined, -1, "0", 0.5, 601]) {
    const invalid = {
      transaction: async () => [[], [], [{ retry_after }]],
    } as unknown as DatabaseClient;
    await assert.rejects(
      createDurableSuggestionLimiter(invalid, "test secret")("192.0.2.1"),
    );
  }
});

test("production API refuses paid calls when the durable limiter is unavailable", async () => {
  const env = process.env as Record<string, string | undefined>;
  const names = [
    "NODE_ENV",
    "OPENAI_API_KEY",
    "PRODUCT_WORKSPACE_PRIVACY_SALT",
    "PORTFOLIO_GUIDE_PRIVACY_SALT",
    "FEEDBACK_RATE_LIMIT_SECRET",
  ] as const;
  const previous = new Map(names.map((name) => [name, env[name]]));
  try {
    env.NODE_ENV = "production";
    env.OPENAI_API_KEY = "test-placeholder-never-sent";
    delete env.PRODUCT_WORKSPACE_PRIVACY_SALT;
    delete env.PORTFOLIO_GUIDE_PRIVACY_SALT;
    delete env.FEEDBACK_RATE_LIMIT_SECRET;
    const draft = emptyDraft();
    draft.fields.idea = "Add voice commands.";
    const response = await POST(
      new NextRequest(
        "https://www.danielnash.co/api/product-workspace/suggest",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            origin: "https://www.danielnash.co",
          },
          body: JSON.stringify(suggestionInput(draft)),
        },
      ),
    );
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.match((await response.json()).error, /draft is still editable/);
  } finally {
    for (const [name, value] of previous) {
      if (value === undefined) delete env[name];
      else env[name] = value;
    }
  }
});

// Explicit opt-in: use an isolated, already-migrated nonproduction branch.
// These tests never create schema or run migrations. Cleanup removes only this
// run's HMAC identifiers; an occupied quota table is rejected before testing.
const integrationUrl = process.env.PRODUCT_WORKSPACE_LIMIT_TEST_DATABASE_URL;
const integrationOptions = { skip: !integrationUrl };

async function withQuotaDatabase(
  run: (
    sql: DatabaseClient,
    otherInstance: DatabaseClient,
    secret: string,
    registerClient: (ip: string) => string,
  ) => Promise<void>,
) {
  const sql = createDatabaseClient(integrationUrl!);
  const otherInstance = createDatabaseClient(integrationUrl!);
  const [baseline] = (await sql.query(
    "SELECT COUNT(*)::int AS count FROM product_workspace_suggestion_limits",
  )) as { count: number }[];
  assert.equal(
    baseline?.count,
    0,
    "Use an isolated branch with an empty suggestion quota table",
  );
  const secret = `test-only:${randomUUID()}`;
  const clientHashes = new Set<string>();
  const registerClient = (ip: string) => {
    const hash = hashSuggestionClient(ip, secret);
    clientHashes.add(hash);
    return hash;
  };
  try {
    await run(sql, otherInstance, secret, registerClient);
  } finally {
    await sql.query(
      "DELETE FROM product_workspace_suggestion_limits WHERE client_hash = ANY($1::text[])",
      [[...clientHashes]],
    );
  }
}

test(
  "shared client quota admits only eight simultaneous calls across independent instances",
  integrationOptions,
  async () => {
    await withQuotaDatabase(async (sql, otherInstance, secret, register) => {
      const ip = "192.0.2.10";
      register(ip);
      const instances = [
        createDurableSuggestionLimiter(sql, secret),
        createDurableSuggestionLimiter(otherInstance, secret),
      ];
      const completed = await Promise.allSettled(
        Array.from({ length: 24 }, (_, index) => instances[index % 2](ip)),
      );
      assert.ok(
        completed.every((attempt) => attempt.status === "fulfilled"),
        "All concurrent quota transactions must complete",
      );
      const attempts = completed.map((attempt) =>
        attempt.status === "fulfilled" ? attempt.value : NaN,
      );
      assert.equal(
        attempts.filter((retry) => retry === 0).length,
        SUGGESTION_CLIENT_LIMIT,
      );
      assert.ok(
        attempts
          .filter((retry) => retry > 0)
          .every((retry) => retry <= SUGGESTION_WINDOW_SECONDS),
      );
      const [row] = (await sql.query(
        "SELECT COUNT(*)::int AS count FROM product_workspace_suggestion_limits",
      )) as { count: number }[];
      assert.equal(row.count, SUGGESTION_CLIENT_LIMIT);
      // A new limiter object has no memory of prior requests, but the DB does.
      assert.ok(
        await createDurableSuggestionLimiter(otherInstance, secret)(ip),
      );
    });
  },
);

test(
  "shared global quota admits only forty simultaneous calls from distinct clients",
  integrationOptions,
  async () => {
    await withQuotaDatabase(async (sql, otherInstance, secret, register) => {
      const instances = [
        createDurableSuggestionLimiter(sql, secret),
        createDurableSuggestionLimiter(otherInstance, secret),
      ];
      const completed = await Promise.allSettled(
        Array.from({ length: 64 }, (_, index) => {
          const ip = `198.51.100.${index}`;
          register(ip);
          return instances[index % 2](ip);
        }),
      );
      assert.ok(
        completed.every((attempt) => attempt.status === "fulfilled"),
        "All concurrent quota transactions must complete",
      );
      const attempts = completed.map((attempt) =>
        attempt.status === "fulfilled" ? attempt.value : NaN,
      );
      assert.equal(
        attempts.filter((retry) => retry === 0).length,
        SUGGESTION_GLOBAL_LIMIT,
      );
      const [row] = (await sql.query(
        "SELECT COUNT(*)::int AS count FROM product_workspace_suggestion_limits",
      )) as { count: number }[];
      assert.equal(row.count, SUGGESTION_GLOBAL_LIMIT);
    });
  },
);

test(
  "expired admissions release quota and are removed without retaining draft content",
  integrationOptions,
  async () => {
    await withQuotaDatabase(async (sql, _otherInstance, secret, register) => {
      const ip = "203.0.113.10";
      const clientHash = register(ip);
      await sql.query(
        `INSERT INTO product_workspace_suggestion_limits (client_hash, created_at)
         SELECT $1, clock_timestamp() - interval '11 minutes'
         FROM generate_series(1, $2)`,
        [clientHash, SUGGESTION_GLOBAL_LIMIT],
      );
      assert.equal(await createDurableSuggestionLimiter(sql, secret)(ip), 0);
      const rows = (await sql.query(
        "SELECT client_hash, created_at FROM product_workspace_suggestion_limits",
      )) as { client_hash: string; created_at: string }[];
      assert.equal(rows.length, 1);
      assert.equal(rows[0].client_hash, clientHash);
      assert.ok(Date.now() - Date.parse(rows[0].created_at) < 60_000);
    });
  },
);
