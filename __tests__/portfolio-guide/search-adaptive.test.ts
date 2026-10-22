import test from "node:test";
import assert from "node:assert/strict";
import { runFrozenSearchSuite } from "./helpers/frozen-search-suite";

const result = runFrozenSearchSuite("adaptive");
for (const captured of result.cases) {
  test(`frozen adaptive corpus: ${captured.name}`, () => {
    assert.equal(captured.skip, undefined, "Historical coverage must execute");
    assert.equal(captured.todo, undefined);
    assert.equal(captured.passed, true, JSON.stringify(captured.details));
  });
}
test("frozen adaptive suite executes all 14 historical cases", () => {
  assert.equal(result.error, undefined);
  assert.equal(result.signal, null);
  assert.equal(
    result.exitCode,
    0,
    "See artifacts/frozen-search-tests/adaptive.events.jsonl",
  );
  assert.equal(result.cases.length, 14);
});
