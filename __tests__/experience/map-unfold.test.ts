import test from "node:test";
import assert from "node:assert/strict";
import { mapLeafFrame, mapUnfoldTravel } from "../../lib/experience/map-unfold";

test("the fully arrived map holds closed, then unfolds strictly left to right", () => {
  for (const p of [-1, 0, 0.07])
    for (const leaf of [0, 1, 2]) assert.equal(mapLeafFrame(p, leaf).amount, 0);
  assert.ok(mapLeafFrame(0.2, 0).amount > 0);
  assert.equal(mapLeafFrame(0.2, 1).amount, 0);
  assert.equal(mapLeafFrame(0.2, 2).amount, 0);
  assert.equal(mapLeafFrame(0.5, 0).amount, 1);
  assert.ok(mapLeafFrame(0.5, 1).amount > 0);
  assert.equal(mapLeafFrame(0.5, 2).amount, 0);
  assert.equal(mapLeafFrame(0.75, 0).amount, 1);
  assert.equal(mapLeafFrame(0.75, 1).amount, 1);
  assert.ok(mapLeafFrame(0.75, 2).amount > 0);
  for (const leaf of [0, 1, 2]) assert.equal(mapLeafFrame(1, leaf).amount, 1);
});

test("every map leaf rotates toward the reader from its left hinge and travels continuously in reverse", () => {
  for (const [leaf, p] of [
    [0, 0.2],
    [1, 0.5],
    [2, 0.75],
  ]) {
    const frame = mapLeafFrame(p, leaf);
    assert.equal(frame.origin, "0% 50%");
    assert.ok(frame.rotateY < 0);
    assert.equal(frame.rotateX, 0);
  }
  const values = Array.from({ length: 1001 }, (_, i) => i / 1000);
  const sample = (p: number) => [0, 1, 2].map((i) => mapLeafFrame(p, i));
  const forward = values.map(sample);
  assert.deepEqual(forward, [...values].reverse().map(sample).reverse());
  for (let i = 1; i < forward.length; i++)
    for (const leaf of [0, 1, 2]) {
      assert.ok(forward[i][leaf].amount >= forward[i - 1][leaf].amount);
      assert.ok(
        Math.abs(forward[i][leaf].rotateY - forward[i - 1][leaf].rotateY) < 1,
      );
    }
});

test("map progress clamps safely and its unfolding has its own bounded scroll budget", () => {
  for (const leaf of [0, 1, 2]) {
    assert.deepEqual(mapLeafFrame(NaN, leaf), mapLeafFrame(0, leaf));
    assert.deepEqual(mapLeafFrame(-1, leaf), mapLeafFrame(0, leaf));
    assert.deepEqual(mapLeafFrame(2, leaf), mapLeafFrame(1, leaf));
    assert.equal(mapLeafFrame(1, leaf).rotateY, 0);
    assert.equal(mapLeafFrame(1, leaf).opacity, 1);
  }
  assert.ok(mapUnfoldTravel(687) >= 620 && mapUnfoldTravel(687) <= 850);
  assert.ok(mapUnfoldTravel(731) >= 620 && mapUnfoldTravel(731) <= 850);
  assert.ok(Number.isFinite(mapUnfoldTravel(NaN)));
});
