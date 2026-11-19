import { systemsMilestones } from "@/content/experience-systems";
import { systemNodeFrame, type SystemNode } from "./scroll-stories";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
};
const reviewStart = (systemsMilestones.length - 1) / systemsMilestones.length;

export function systemsMilestoneStop(index: number) {
  return index === systemsMilestones.length - 1
    ? 0.97
    : (index + 0.35) / systemsMilestones.length;
}

export function systemsTimelineFrame(progress: number) {
  const position = clamp(progress) * systemsMilestones.length;
  return {
    index: Math.min(systemsMilestones.length - 1, Math.floor(position)),
    local: position % 1,
  };
}
export function quarterlySystemNodeFrame(progress: number, node: SystemNode) {
  // Quarterly targets highlight intended connections. They do not assert that
  // systems were retired in a particular quarter. Actual retirement happens only
  // in the reported-review transition.
  const actual = smooth((progress - reviewStart) / (0.94 - reviewStart));
  const pose = systemNodeFrame(actual, node);
  const stage = systemsMilestones[systemsTimelineFrame(progress).index];
  return {
    ...pose,
    highlighted: (stage.targets as readonly string[]).includes(node.id),
  };
}
