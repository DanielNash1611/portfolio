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

for (const compact of [false, true]) {
  test(`pacing gives ${compact ? "compact" : "desktop"} readers room without losing stops or reverse travel`, () => {
    const height = 852;
    const geometry = lightJourneyGeometry(3000, height, 0, compact);
    const previousStep = height * 1.05;
    const increase = geometry.step / previousStep;
    assert.ok(compact ? increase > 1.8 : increase > 1.15 && increase < 1.25);
    // Fully legible text spans nearly a screen on touch, over half on desktop.
    assert.ok(geometry.step * 0.48 >= height * (compact ? 0.9 : 0.59));
    const offsets = [0, 0.32, 1.32, 2.32, 3.32, 4.32, 5.52, 6.05];
    const frames = offsets.map((offset) =>
      lightJourneyFrame(geometry.start + offset * geometry.step, geometry),
    );
    assert.deepEqual(
      frames.slice(1, 6).map((frame) => frame.index),
      [0, 1, 2, 3, 4],
    );
    assert.ok(
      frames.slice(1, 6).every((frame) => frame.readable && !frame.reward),
    );
    assert.equal(frames[6].reward, true);
    for (const offset of offsets.toReversed()) {
      assert.deepEqual(
        lightJourneyFrame(geometry.start + offset * geometry.step, geometry),
        frames[offsets.indexOf(offset)],
      );
    }
    assert.equal(
      lightJourneyFrame(geometry.start + geometry.distance + 2, geometry)
        .immersive,
      false,
    );
  });
}
