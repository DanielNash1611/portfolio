import test from "node:test";
import assert from "node:assert/strict";
import {
  sequenceIndex,
  sequencePosition,
  sequenceTarget,
  stackArrival,
} from "@/lib/experience/reveal-sequence";
test("scroll stories hold their endpoints, visit every beat, and reverse without losing the selection", () => {
  for (const count of [3, 4]) {
    assert.equal(sequenceIndex(0, count), 0);
    assert.equal(sequenceIndex(1, count), count - 1);
    assert.equal(sequencePosition(0.08, count), 0);
    assert.equal(sequencePosition(0.92, count), count - 1);
    for (let i = 0; i < count; i++)
      assert.equal(sequenceIndex(sequenceTarget(i, count), count), i);
    const forward = Array.from({ length: 101 }, (_, i) =>
      sequenceIndex(i / 100, count),
    );
    assert.deepEqual(
      Array.from({ length: 101 }, (_, i) =>
        sequenceIndex(1 - i / 100, count),
      ).reverse(),
      forward,
    );
  }
  assert.equal(sequenceIndex(NaN, 3), 0);
  assert.equal(sequenceIndex(-1, 3), 0);
  assert.equal(sequenceIndex(2, 3), 2);
});
test("cards arrive in order and each previously placed title remains in the deck", () => {
  assert.deepEqual(
    [0, 1, 2].map((i) => stackArrival(0, i, 3)),
    [1, 0, 0],
  );
  assert.deepEqual(
    [0, 1, 2].map((i) => stackArrival(0.5, i, 3)),
    [1, 1, 0],
  );
  assert.deepEqual(
    [0, 1, 2].map((i) => stackArrival(1, i, 3)),
    [1, 1, 1],
  );
  const before = stackArrival(0.3, 1, 3),
    after = stackArrival(0.4, 1, 3);
  assert.ok(before > 0 && before < after && after < 1);
  assert.equal(stackArrival(0.3, 1, 3), before);
});
