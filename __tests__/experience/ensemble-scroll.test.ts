import test from "node:test";
import assert from "node:assert/strict";
import {
  ensembleFrame,
  canPinEnsemble,
} from "../../lib/experience/ensemble-scroll";

test("the orchestra gathers through scrolling and reverses to the same independent state", () => {
  const forward = [0, 0.1, 0.25, 0.5, 0.75, 1].map(ensembleFrame);
  assert.equal(forward[0].alignment, 0);
  assert.equal(forward[4].alignment, 1);
  assert.equal(forward[5].alignment, 1);
  for (let i = 1; i < forward.length; i++)
    assert.ok(forward[i].alignment >= forward[i - 1].alignment);
  for (const p of [1, 0.75, 0.5, 0.25, 0.1, 0]) {
    assert.deepEqual(
      ensembleFrame(p),
      forward[[0, 0.1, 0.25, 0.5, 0.75, 1].indexOf(p)],
    );
  }
  assert.notEqual(ensembleFrame(0.8).baton, ensembleFrame(0.9).baton);
});

test("scroll boundaries and invalid geometry retain finite, readable orchestra states", () => {
  assert.deepEqual(ensembleFrame(-1), ensembleFrame(0));
  assert.deepEqual(ensembleFrame(2), ensembleFrame(1));
  assert.deepEqual(ensembleFrame(NaN), ensembleFrame(0));
  assert.equal(canPinEnsemble(738, 510, 113), true);
  assert.equal(canPinEnsemble(844, 561, 113), true);
  assert.equal(canPinEnsemble(568, 400, 113), false);
  assert.equal(canPinEnsemble(650, 600, 113), false);
  assert.equal(canPinEnsemble(844, NaN, 113), false);
});
