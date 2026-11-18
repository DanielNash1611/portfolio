import assert from "node:assert/strict";
import test from "node:test";
import {
  relaySections,
  renderBudget,
  sampleContinuity,
} from "@/lib/experience/continuity";
import {
  disperseParticles,
  dissipationVector,
  isGravityActive,
  narrativeFrame,
} from "@/lib/experience/narrative";
import { careerNarrative } from "@/content/experience-narrative";

test("the hiring path leads from leadership evidence to working products, practice and contact", () => {
  const ids = relaySections.map((section) => section.id);
  const path = [
    "outcomes",
    "products",
    "work",
    "toolkit",
    "recommendation",
    "contact",
    "creative",
    "gravity",
    "direction",
    "film",
    "thinking",
    "compass",
  ] as const;
  for (let i = 1; i < path.length; i++)
    assert.ok(ids.indexOf(path[i - 1]) < ids.indexOf(path[i]));
  assert.deepEqual(
    careerNarrative.chapters.map((chapter) => chapter.id),
    ["products", "work", "toolkit", "recommendations", "contact"],
  );
  assert.equal(careerNarrative.title, "I build clarity where there isn’t any.");
  assert.deepEqual(careerNarrative.method, [
    "Opportunity",
    "Direction",
    "Prototype",
    "Evidence",
    "Adoption",
  ]);
});

test("HTML chapter handoffs are continuous and reversible on native scroll", () => {
  const anchors = ["intro", ...relaySections.map((section) => section.id)].map(
    (id, i) => ({ id, y: i * 800 }),
  );
  for (let i = 0; i < anchors.length; i++)
    assert.equal(sampleContinuity(anchors, i * 800).position, i);
  for (let y = 0; y < anchors[anchors.length - 1].y; y += 17) {
    const a = sampleContinuity(anchors, y).position,
      b = sampleContinuity(anchors, y + 0.01).position;
    assert.ok(b >= a && b - a < 0.001);
  }
  const forward = Array.from({ length: 301 }, (_, i) =>
    sampleContinuity(anchors, i * 32),
  );
  const backward = Array.from({ length: 301 }, (_, i) =>
    sampleContinuity(anchors, (300 - i) * 32),
  );
  assert.deepEqual(forward, backward.reverse());
  assert.equal(sampleContinuity(anchors, -100).position, 0);
  assert.equal(sampleContinuity(anchors, 999999).position, anchors.length - 1);
});

test("cello particles disperse from their model positions, return on reverse, and fully disappear", () => {
  for (const width of [390, 1440]) {
    const { particles: count } = renderBudget(width, false);
    const origin = Float32Array.from(
      { length: count * 3 },
      (_, i) => Math.sin(i) * 0.5,
    );
    const directions = new Float32Array(count * 3),
      positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) directions.set(dissipationVector(i), i * 3);
    const buffer = positions.buffer;
    disperseParticles(origin, directions, positions, 0);
    assert.deepEqual(positions, origin);
    disperseParticles(origin, directions, positions, 1);
    assert.ok(positions.every(Number.isFinite));
    assert.notDeepEqual(positions, origin);
    assert.equal(positions.buffer, buffer);
    disperseParticles(origin, directions, positions, 0);
    assert.deepEqual(positions, origin);
  }
  const end = narrativeFrame(1);
  assert.equal(end.gravity, 0);
  assert.equal(end.particles, 0);
  assert.equal(end.visibility, 0);
  assert.equal(isGravityActive(1), false);
  assert.equal(narrativeFrame(0.5).gravity, 1);
  assert.equal(narrativeFrame(0.5).dissolve, 0);
  assert.ok(narrativeFrame(0.9).particles > 0);
});

test("mobile retains animation with reduced rendering cost; reduced motion requests no frames", () => {
  const phone = renderBudget(390, false),
    desktop = renderBudget(1440, false);
  assert.ok(phone.particles > 0 && phone.particles < desktop.particles);
  assert.ok(phone.fps < desktop.fps && phone.dpr < desktop.dpr);
  assert.equal(renderBudget(390, true).fps, 0);
  assert.equal(renderBudget(1440, true).particles, 0);
});
