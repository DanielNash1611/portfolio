import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { ownerEventStatement, ownerExclusionClause } from "../lib/analytics-owner-policy";

test("rollout off preserves ingestion without requiring the additive table", () => {
  const query = "INSERT INTO analytics_events VALUES ($1,$2)", params = ["one", "two"];
  assert.deepEqual(ownerEventStatement(query, params, true, false), { query, params });
  assert.equal(ownerExclusionClause(false, false), "");
});

test("owner registration shares the event statement and binds its marker after all existing parameters", () => {
  for (const count of [11, 13]) {
    const params = Array.from({ length: count }, (_, i) => `value-${i + 1}`);
    const statement = ownerEventStatement("INSERT INTO analytics_events VALUES ($1)", params, true, true);
    assert.match(statement.query, new RegExp(`WHERE \\$${count + 1}::boolean`));
    assert.match(statement.query, /SELECT \$4,\$5,\$7/);
    assert.match(statement.query, /ON CONFLICT DO NOTHING/);
    assert.deepEqual(statement.params, [...params, true]);
    assert.doesNotMatch(statement.query, /value-|DELETE|UPDATE analytics_events/);
  }
});

test("owner exclusion is optional and scoped to the same app, environment and visitor", () => {
  assert.equal(ownerExclusionClause(true, true), "");
  const clause = ownerExclusionClause(false, true);
  for (const field of ["app", "app_env", "visitor_id"]) assert.ok(clause.includes(`owner_identity.${field} = analytics_events.${field}`));
  assert.doesNotMatch(clause, /DELETE|UPDATE|session_id/);
});

test("additive migration cannot delete analytics history and scopes the identity key", async () => {
  const migration = await readFile(new URL("../migrations/007_analytics_owner_identities.sql", import.meta.url), "utf8");
  assert.match(migration, /CREATE TABLE IF NOT EXISTS/);
  assert.match(migration, /PRIMARY KEY \(app, app_env, visitor_id\)/);
  assert.doesNotMatch(migration, /\b(?:DELETE|DROP|TRUNCATE|UPDATE)\b/);
});
