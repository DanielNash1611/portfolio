import assert from "node:assert/strict";
import test from "node:test";
import {
  lightJourneyFrame,
  lightJourneyGeometry,
} from "@/lib/experience/light-journey";

test("the measured journey preserves every reading stop and the clear sunrise hold", () => {
  const geometry = lightJourneyGeometry(3000, 852, 0);
  for (let index = 0; index < 5; index++) {
    const frame = lightJourneyFrame(
      geometry.start + (index + 0.32) * geometry.step,
      geometry,
    );
    assert.equal(frame.index, index);
    assert.equal(frame.readable, true);
    assert.equal(frame.reward, false);
    assert.equal(frame.immersive, true);
  }
  const clearing = lightJourneyFrame(
    geometry.start + geometry.step * 5.52,
    geometry,
  );
  assert.equal(clearing.reward, true);
  assert.equal(clearing.immersive, true);
  assert.equal(
    lightJourneyFrame(geometry.start + geometry.distance + 2, geometry)
      .immersive,
    false,
  );
  assert.equal(
    lightJourneyFrame(geometry.start - 2, geometry).immersive,
    false,
  );
});

test("interrupted and reversed scrolling has no accumulated animation state", () => {
  const geometry = lightJourneyGeometry(3000, 852, 113);
  const positions = [0, 3000, 5000, 9000, 4600, 2900, 7500, 3000];
  const forward = positions.map((y) => lightJourneyFrame(y, geometry));
  assert.deepEqual(
    positions
      .toReversed()
      .map((y) => lightJourneyFrame(y, geometry))
      .toReversed(),
    forward,
  );
  assert.equal(forward[1].position, forward[7].position);
  assert.ok(forward.every((frame) => Number.isFinite(frame.position)));
});

test("layout invalidation moves the journey without changing its selected reading stop", () => {
  const before = lightJourneyGeometry(3000, 852, 0);
  const after = lightJourneyGeometry(3700, 852, 0);
  assert.deepEqual(
    lightJourneyFrame(5000, before),
    lightJourneyFrame(5700, after),
  );
  assert.equal(lightJourneyGeometry(0, 400, 0).step, 500);
});
