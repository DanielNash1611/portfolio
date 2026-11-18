import assert from "node:assert/strict";
import test from "node:test";
import { getExperienceHomeContent } from "@/content/experience-home";
import { referralOrder } from "@/content/experience-referrals";
import { testimonials } from "@/data/testimonials";
import {
  referralCardPose,
  referralFeaturedCount,
  referralLayout,
  referralPhases,
  referralRingFrame,
} from "@/lib/experience/referral-ring";

const groups = getExperienceHomeContent().recommendations;
const counts = groups.map((group) => group.people.length);
const entries = referralOrder.map((id) => {
  const group = groups.findIndex((group) =>
    group.people.some((person) => person.id === id),
  );
  return { id, group, rank: 0 };
});
const ranks = groups.map(() => 0);
for (const entry of entries) entry.rank = ranks[entry.group]++;

test("all fifteen cards remain available while only Don, Zac and Sumanth lead the short scroll sequence", () => {
  const ids = groups.flatMap((group) =>
    group.people.map((person) => person.id),
  );
  assert.equal(new Set(referralOrder).size, ids.length);
  assert.deepEqual([...referralOrder].sort(), ids.sort());
  assert.deepEqual(referralOrder.slice(0, 3), [
    "don-worsham",
    "zac-bogart",
    "sumanth-cherukuri",
  ]);
  const layout = referralLayout(1152, 430, counts);
  for (let i = 0; i < referralFeaturedCount; i++) {
    const progress =
      referralPhases.reading + ((i + 0.3) / referralFeaturedCount) * 0.53;
    const frame = referralRingFrame(progress, entries.length);
    assert.equal(frame.index, i);
    assert.equal(frame.position, i);
    const pose = referralCardPose(
      progress,
      i,
      entries.length,
      entries[i],
      layout,
    );
    assert.ok(Math.abs(pose.x + pose.width / 2) < 0.00001);
    assert.ok(Math.abs(pose.z) < 0.00001);
    assert.ok(Math.abs(pose.rotateY) < 0.00001);
    assert.equal(pose.fullOpacity, 1);
    assert.equal(pose.summaryOpacity, 0);
  }
  for (let p = 0; p < referralPhases.sorting; p += 0.001) {
    assert.ok(
      referralRingFrame(p, entries.length).index < referralFeaturedCount,
    );
  }
  assert.equal(
    referralRingFrame(referralPhases.sorting, entries.length).phase,
    "sorting",
  );
  assert.equal(
    referralRingFrame(referralPhases.sorting, entries.length).index,
    2,
  );
  for (const person of groups.flatMap((group) => group.people)) {
    const source = testimonials.find((item) => item.id === person.id)!;
    assert.equal(person.fullQuote, source.full);
  }
});

test("the same cards land in their correct categories, with a readable desktop grid and compact mobile stacks", () => {
  for (const [width, height] of [
    [1152, 430],
    [954, 390],
    [342, 392],
    [720, 400],
  ]) {
    const layout = referralLayout(width, height, counts);
    const grouped = referralRingFrame(1, entries.length);
    assert.equal(grouped.phase, "grouped");
    for (const [index, entry] of entries.entries()) {
      const pose = referralCardPose(1, index, entries.length, entry, layout);
      const left = pose.x + width / 2,
        top = pose.y + height / 2;
      assert.ok(left >= -0.01 && top >= -0.01);
      assert.ok(left + pose.width <= width + 0.01);
      assert.ok(top + pose.height <= height + 0.01);
      assert.equal(pose.fullOpacity, 0);
      assert.equal(pose.summaryOpacity, 1);
      assert.ok(Math.abs(pose.rotateY) < 0.00001);
      assert.ok(Math.abs(pose.rotateZ) < 0.00001);
      assert.equal(
        groups[entry.group].people.some((person) => person.id === entry.id),
        true,
      );
    }
  }
});

test("ring-to-category movement is continuous at chapter boundaries and deterministic in reverse", () => {
  const layout = referralLayout(342, 392, counts);
  for (const boundary of [
    0,
    referralPhases.reading,
    0.59,
    referralPhases.sorting,
    referralPhases.grouped,
    1,
  ]) {
    for (const [index, entry] of entries.entries()) {
      const before = referralCardPose(
        boundary - 0.000001,
        index,
        entries.length,
        entry,
        layout,
      );
      const after = referralCardPose(
        boundary + 0.000001,
        index,
        entries.length,
        entry,
        layout,
      );
      for (const key of [
        "x",
        "y",
        "z",
        "width",
        "height",
        "fullOpacity",
        "summaryOpacity",
      ] as const)
        assert.ok(
          Math.abs(before[key] - after[key]) < 0.05,
          `${boundary} ${key}`,
        );
    }
  }
  for (const [index, entry] of entries.entries()) {
    const samples = Array.from({ length: 101 }, (_, i) =>
      referralCardPose(i / 100, index, entries.length, entry, layout),
    );
    assert.ok(
      samples.every((pose) => Object.values(pose).every(Number.isFinite)),
    );
    const reverse = Array.from({ length: 101 }, (_, i) =>
      referralCardPose((100 - i) / 100, index, entries.length, entry, layout),
    );
    assert.deepEqual(samples, reverse.reverse());
  }
});
