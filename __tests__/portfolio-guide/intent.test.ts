import assert from "node:assert/strict";
import test from "node:test";
import {
  getQuickSelectIntent,
  normalizeVisitorIntent,
} from "@/lib/portfolio-guide/intent";

test("quick-select intent maps to the expected role lenses", () => {
  const intent = getQuickSelectIntent("Platform PM");

  assert.equal(intent.normalizedTitle, "Platform Product Manager");
  assert.equal(intent.seniority, "pm");
  assert.deepEqual(intent.roleLenses, [
    "builder-pm",
    "senior-product-manager",
  ]);
  assert.deepEqual(intent.focusAreas, ["platform"]);
});

test("freeform normalization extracts seniority, focus areas, and emphasis", () => {
  const intent = normalizeVisitorIntent(
    "Director of Product for AI platform and experimentation work",
  );

  assert.ok(intent, "expected normalized intent");
  assert.equal(intent?.normalizedTitle, "Director of Product");
  assert.equal(intent?.seniority, "director");
  assert.ok(intent?.roleLenses?.includes("product-leader"));
  assert.ok(intent?.roleLenses?.includes("builder-pm"));
  assert.ok(intent?.focusAreas?.includes("platform"));
  assert.ok(intent?.emphasis?.includes("leadership"));
  assert.ok(intent?.emphasis?.includes("experimentation"));
});
