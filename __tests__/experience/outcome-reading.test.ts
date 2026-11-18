import assert from "node:assert/strict";
import test from "node:test";
import {
  outcomeReadingRange,
  outcomeReadingFrame,
  outcomeRestTravel,
  canPinCardCollection,
} from "@/lib/experience/outcome-reading";

test("standard Chrome content heights retain interactive cards while very short windows stay readable", () => {
  for (const height of [600, 640, 682, 720, 844, 960])
    assert.equal(canPinCardCollection(height), true);
  for (const height of [0, 400, 599, Number.NaN])
    assert.equal(canPinCardCollection(height), false);
});

test("long cards reach their bottom before returning, including on mobile", () => {
  for (const [paper, viewport] of [
    [1250, 580],
    [860, 700],
    [1900, 450],
  ]) {
    const range = outcomeReadingRange(paper, viewport);
    assert.equal(
      outcomeReadingFrame(400, 400, range.distance, range.shift).finished,
      false,
    );
    const before = outcomeReadingFrame(
      400 + range.distance - 1,
      400,
      range.distance,
      range.shift,
    );
    assert.equal(before.finished, false);
    const end = outcomeReadingFrame(
      400 + range.distance,
      400,
      range.distance,
      range.shift,
    );
    assert.equal(end.finished, true);
    assert.equal(paper + end.y, viewport);
  }
});

test("a card that fits still leaves reading time and reverse scroll restores earlier content", () => {
  const range = outcomeReadingRange(500, 700);
  assert.equal(range.shift, 0);
  assert.ok(range.distance >= 240);
  const long = outcomeReadingRange(1200, 600);
  const forward = outcomeReadingFrame(700, 400, long.distance, long.shift);
  const reverse = outcomeReadingFrame(500, 400, long.distance, long.shift);
  assert.ok(reverse.y > forward.y);
  assert.equal(outcomeReadingFrame(200, 400, long.distance, long.shift).y, 0);
});

test("the final actions stay in place through continued scrolling before return", () => {
  for (const [paper, viewport] of [
    [1250, 580],
    [860, 700],
    [1900, 450],
    [500, 700],
  ]) {
    const range = outcomeReadingRange(paper, viewport);
    const bottom = 400 + range.shift;
    // A wheel gesture can carry past the bottom. Keep it readable, including
    // when the entire card already fits, and don't move its actions offscreen.
    for (const overshoot of [0, 100, 400, 600]) {
      const frame = outcomeReadingFrame(
        bottom + overshoot,
        400,
        range.distance,
        range.shift,
      );
      assert.equal(frame.finished, false);
      assert.equal(frame.y, -range.shift || 0);
    }
    const back = outcomeReadingFrame(
      bottom + 100,
      400,
      range.distance,
      range.shift,
    );
    assert.equal(back.finished, false);
    assert.equal(back.y, -range.shift || 0);
  }
});

test("return preserves the current position and leaves a finite choice-or-continue interval", () => {
  const extra = outcomeRestTravel(2400, 1000, 800);
  const endOfPin = 1000 + extra;
  assert.ok(endOfPin > 2400);
  assert.ok(endOfPin - 2400 < 800);
  const next = outcomeReadingFrame(2400, 2400, 600, 500);
  assert.equal(next.progress, 0);
  assert.equal(next.finished, false);
});
