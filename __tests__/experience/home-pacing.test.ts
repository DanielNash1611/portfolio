import assert from "node:assert/strict";
import test from "node:test";
import {
  mapUnfoldTravel,
  mapLeafFrame,
  mapLeafStops,
} from "@/lib/experience/map-unfold";
import {
  scoreOvertureTravel,
  scoreOvertureProgress,
  scoreOvertureOffset,
  scoreSequenceFrame,
  orchestraFormationProgress,
} from "@/lib/experience/score-sequence";
import {
  productProofTravel,
  productProofTarget,
  productProofFrame,
} from "@/lib/experience/product-proof";
import {
  lightJourneyGeometry,
  lightJourneyFrame,
} from "@/lib/experience/light-journey";
import { introMapTarget } from "@/lib/experience/intro-map-sequence";
import { referralStops } from "@/lib/experience/referral-swipe";
import { referralRingFrame } from "@/lib/experience/referral-ring";

for (const height of [554, 646, 731, 900]) {
  test(`mobile pacing expands real scroll budgets at ${height}px without changing compass/product targets`, () => {
    const map = mapUnfoldTravel(height, true),
      score = scoreOvertureTravel(height, true),
      proof = productProofTravel(height, true);
    assert.ok(map > mapUnfoldTravel(height) * 1.6);
    assert.ok(score > scoreOvertureTravel(height) * 1.7);
    assert.ok(proof > productProofTravel(height) * 1.6);
    assert.ok(map <= 1450 && score <= 2500 && proof <= 4200);
    const g = {
      start: 0,
      mapStart: 1000,
      travel: map,
      nextSection: 1000 + map + 900,
    };
    for (let i = 0; i < 3; i++) {
      const previous =
        i === 0 ? g.mapStart : g.mapStart + mapLeafStops[i - 1] * map;
      assert.equal(
        introMapTarget(previous, 1, g),
        g.mapStart + mapLeafStops[i] * map,
      );
      assert.equal(mapLeafFrame(mapLeafStops[i], i).amount, 1);
    }
    assert.equal(introMapTarget(g.mapStart + map, 1, g, true), g.nextSection);
    assert.equal(introMapTarget(g.mapStart, -1, g, true), 0);
    for (let project = 0; project < 3; project++)
      for (let step = 0; step < (project === 2 ? 3 : 2); step++) {
        const offset = productProofTarget(project, step) * proof;
        const frame = productProofFrame(offset / proof);
        const expected = productProofFrame(productProofTarget(project, step));
        assert.equal(frame.project, expected.project);
        assert.equal(frame.step, expected.step);
        assert.ok(Math.abs(frame.local - expected.local) < 1e-10);
      }
  });
}

test("the orchestra checkpoint is still fully formed and gentle scrolling keeps it visible before transfer", () => {
  const travel = scoreOvertureTravel(646, true);
  assert.equal(
    scoreOvertureProgress(orchestraFormationProgress, true),
    orchestraFormationProgress,
  );
  for (const distance of [0, 50, 150, 300, travel * 0.2]) {
    const p = scoreOvertureProgress(
      orchestraFormationProgress + distance / travel,
      true,
    );
    const frame = scoreSequenceFrame(p);
    assert.equal(frame.gather, 1);
    assert.ok(frame.orchestra > 0.999999);
    assert.equal(frame.surface, 0);
  }
  assert.ok(
    travel * 0.2 > 400,
    "fully formed dwell exceeds a typical gentle swipe",
  );
  assert.ok(
    orchestraFormationProgress * travel > 570,
    "formation approach has more scroll distance too",
  );
});

test("mobile score remapping is continuous, reversible and invertible for replay/slider controls", () => {
  let previous = 0;
  for (let i = 0; i <= 2000; i++) {
    const raw = i / 2000,
      p = scoreOvertureProgress(raw, true);
    assert.ok(p >= previous && p - previous < 0.002);
    assert.ok(Math.abs(scoreOvertureOffset(p, true) - raw) < 1e-10);
    assert.equal(
      scoreOvertureProgress(raw),
      raw,
      "desktop timeline remains identical",
    );
    previous = p;
  }
  for (const value of [-1, NaN, 2]) {
    const p = scoreOvertureProgress(value, true);
    assert.ok(Number.isFinite(p) && p >= 0 && p <= 1);
    assert.ok(Number.isFinite(scoreOvertureOffset(value, true)));
  }
});

test("the longer homepage forest preserves five readable scenes and sunrise in both directions", () => {
  const before = lightJourneyGeometry(1000, 646, 0, true);
  const after = lightJourneyGeometry(1000, 646, 0, true, true);
  assert.ok(after.step > before.step * 1.35);
  for (const point of [
    0, 0.32, 1.32, 2.32, 3.32, 4.32, 5.52, 6.05,
  ].toReversed()) {
    const next = lightJourneyFrame(after.start + point * after.step, after);
    const prior = lightJourneyFrame(before.start + point * before.step, before);
    assert.ok(Math.abs(next.position - prior.position) < 1e-10);
    assert.deepEqual({ ...next, position: 0 }, { ...prior, position: 0 });
  }
  assert.equal(
    lightJourneyGeometry(1000, 646, 0, false, true).step,
    lightJourneyGeometry(1000, 646, 0).step,
  );
});

test("longer recommendation distance still lands each quote fully readable before the split", () => {
  const targets = referralStops({ start: 1000, travel: 3 * 480, count: 15 });
  for (let i = 0; i < 3; i++) {
    const frame = referralRingFrame((targets[i] - 1000) / (3 * 480), 15);
    assert.equal(frame.index, i);
    assert.equal(frame.position, i);
    assert.equal(frame.gather, 0);
  }
  assert.equal(
    referralRingFrame((targets[3] - 1000) / (3 * 480), 15).phase,
    "grouped",
  );
});
