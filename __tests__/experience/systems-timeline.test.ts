import assert from "node:assert/strict";
import test from "node:test";
import {
  contactCenterSystems,
  systemsMilestones,
} from "@/content/experience-systems";
import {
  quarterlySystemNodeFrame,
  systemsMilestoneStop,
  systemsTimelineFrame,
} from "@/lib/experience/systems-timeline";

test("quarterly scenes retain roadmap status and only the review presents the reported nine-system result", () => {
  assert.deepEqual(
    systemsMilestones.map((stage) => stage.label),
    ["Starting point", "Q2 2024", "Q3 2024", "Q4 2024", "One-year review"],
  );
  assert.equal(
    systemsMilestones.filter((stage) => stage.kind === "Roadmap target").length,
    3,
  );
  assert.equal(systemsMilestones[4].kind, "Reported result");
  for (const p of [0, 0.26, 0.46, 0.66, 0.76, 0.79, 0.799]) {
    const visible = contactCenterSystems.filter(
      (node) => quarterlySystemNodeFrame(p, node).opacity === 1,
    );
    assert.equal(
      visible.length,
      16,
      "quarter targets must not imply audited system retirements",
    );
  }
  assert.equal(
    contactCenterSystems.filter(
      (node) => quarterlySystemNodeFrame(1, node).opacity === 1,
    ).length,
    9,
  );
  for (const stage of systemsMilestones)
    for (const [from, to] of stage.edges) {
      assert.ok(
        contactCenterSystems.some((node) => node.id === from && node.before),
      );
      assert.ok(
        contactCenterSystems.some((node) => node.id === to && node.before),
      );
    }
});
test("the quarterly narrative and physical system transition remain deterministic on reverse scroll", () => {
  systemsMilestones.forEach((_, index) =>
    assert.equal(
      systemsTimelineFrame(systemsMilestoneStop(index)).index,
      index,
    ),
  );
  for (const node of contactCenterSystems)
    for (let i = 0; i <= 100; i++) {
      const progress = i / 100,
        pose = quarterlySystemNodeFrame(progress, node);
      assert.ok([pose.x, pose.y, pose.opacity].every(Number.isFinite));
      assert.ok(pose.opacity >= 0 && pose.opacity <= 1);
      assert.deepEqual(pose, quarterlySystemNodeFrame(progress, node));
      assert.ok(
        systemsTimelineFrame(progress).index >= 0 &&
          systemsTimelineFrame(progress).index <= 4,
      );
    }
  assert.equal(systemsTimelineFrame(-1).index, 0);
  assert.equal(systemsTimelineFrame(2).index, 4);
});
