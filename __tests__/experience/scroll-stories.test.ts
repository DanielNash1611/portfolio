import assert from "node:assert/strict";
import test from "node:test";
import {
  recommendationFrame,
  systemNodeFrame,
} from "@/lib/experience/scroll-stories";
import {
  contactCenterSystems,
  systemsSource,
} from "@/content/experience-systems";

test("scrolling reaches every recommendation in order, holds each for reading, and reverses deterministically", () => {
  const seen = new Set<number>();
  let previous = -1;
  for (let p = 0; p <= 10000; p++) {
    const frame = recommendationFrame(p / 10000, 15);
    assert.ok(frame.position >= previous && frame.position <= 14);
    assert.ok(frame.index >= 0 && frame.index < 15);
    seen.add(frame.index);
    previous = frame.position;
  }
  assert.equal(seen.size, 15);
  assert.deepEqual(recommendationFrame(-1, 15), { position: 0, index: 0 });
  assert.deepEqual(recommendationFrame(2, 15), { position: 14, index: 14 });
  assert.equal(recommendationFrame(0.3 / 14, 15).position, 0);
  assert.equal(recommendationFrame(0.96, 15).position, 14);
  assert.deepEqual(
    recommendationFrame(0.713, 15),
    recommendationFrame(1 - 0.287, 15),
  );
  assert.deepEqual(recommendationFrame(0.5, 1), { position: 0, index: 0 });
});

test("the circle diagram preserves the original sixteen-system and one-year nine-system states", () => {
  const before = contactCenterSystems.filter((n) => n.before);
  const after = contactCenterSystems.filter((n) => n.after);
  assert.equal(before.length, systemsSource.before);
  assert.equal(after.length, systemsSource.after);
  assert.equal(
    new Set(contactCenterSystems.map((n) => n.id)).size,
    contactCenterSystems.length,
  );
  assert.deepEqual(
    after.map((n) => n.label).sort(),
    [
      "Salesforce",
      "OMS",
      "MFDAX",
      "Finance Center",
      "CCC",
      "ChatGPT",
      "Store fulfilment",
      "Dropbox",
      "Cresta Coaching",
    ].sort(),
  );
  for (const node of contactCenterSystems) {
    const start = systemNodeFrame(0, node),
      end = systemNodeFrame(1, node);
    assert.equal(start.opacity, node.before ? 1 : 0);
    assert.equal(end.opacity, node.after ? 1 : 0);
    if (node.before) assert.deepEqual([start.x, start.y], [...node.before]);
    if (node.after) assert.deepEqual([end.x, end.y], [...node.after]);
    for (let i = 0; i <= 100; i++) {
      const pose = systemNodeFrame(i / 100, node);
      assert.ok(Object.values(pose).every(Number.isFinite));
      assert.ok(pose.opacity >= 0 && pose.opacity <= 1);
    }
  }
  assert.equal(systemsSource.period, "After one year");
});
