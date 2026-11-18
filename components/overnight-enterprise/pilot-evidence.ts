/** Transcribed from the original roadmap review, slide 12, and checked against
 * ResumeCustomizer/sources/approved-metrics.md. No intermediate observations. */
export type PilotMetric = {
  id: string;
  name: string;
  unit: "dollars" | "percent";
  axisMax: number;
  test: { before: number; after: number; change: string };
  control: { before: number; after: number; change: string };
};
export const pilotMetrics: readonly PilotMetric[] = [
  {
    id: "aov",
    name: "Average order value",
    unit: "dollars",
    axisMax: 900,
    test: { before: 804, after: 867, change: "+7.8%" },
    control: { before: 851, after: 782, change: "−8.1%" },
  },
  {
    id: "conversion",
    name: "Conversion rate",
    unit: "percent",
    axisMax: 10,
    test: { before: 3.27, after: 7.73, change: "+136%" },
    control: { before: 3.76, after: 7.14, change: "+90%" },
  },
  {
    id: "rpc",
    name: "Revenue per call",
    unit: "dollars",
    axisMax: 80,
    test: { before: 26, after: 67, change: "+158%" },
    control: { before: 32, after: 56, change: "+75%" },
  },
];
type Base = { label: string; title: string; detail: string };
export type PilotBeat = Base &
  (
    | { kind: "study" }
    | { kind: "metric"; metricIndex: 0 | 1 | 2 }
    | { kind: "estimate" }
    | { kind: "decision" }
  );
export const pilotBeats: readonly PilotBeat[] = [
  {
    kind: "study",
    label: "Design",
    title: "Design the comparison first.",
    detail:
      "A 15-agent test cohort, matched on tenure, skill, and call mix. The control group’s size is unpublished.",
  },
  {
    kind: "metric",
    metricIndex: 0,
    label: "AOV",
    title: "AOV moved in different directions.",
    detail:
      "Test AOV rose; adjusted-control AOV fell. The comparison gives the test result context.",
  },
  {
    kind: "metric",
    metricIndex: 1,
    label: "Conversion",
    title: "Conversion improved in both groups.",
    detail:
      "Both groups improved. The comparison alone does not establish how much change was caused by AI.",
  },
  {
    kind: "metric",
    metricIndex: 2,
    label: "Revenue/call",
    title: "Compare revenue per call.",
    detail:
      "Both groups grew. Keep the reported comparison separate from causal effect or realized annual revenue.",
  },
  {
    kind: "estimate",
    label: "Estimate",
    title: "Keep the annualized estimate separate.",
    detail:
      "The case account reports an annualized business-case estimate. Its underlying model inputs are not reproduced in the measurement table.",
  },
  {
    kind: "decision",
    label: "Decision",
    title: "Use the pilot to support expansion.",
    detail:
      "The pilot supported contact-center expansion. Company-wide licenses and active users are a separate scope.",
  },
];
export const pilotTargets = [0.01, 0.25, 0.415, 0.58, 0.75, 0.93] as const;
export function pilotBeatAt(progress: number) {
  return Number.isFinite(progress)
    ? Math.min(5, Math.max(0, Math.floor(progress * 6)))
    : 0;
}
export function pilotTarget(index: number) {
  return pilotTargets[index] ?? pilotTargets[0];
}
export function formatPilotValue(metric: PilotMetric, value: number) {
  return metric.unit === "percent"
    ? `${value.toFixed(2)}%`
    : `$${value.toLocaleString("en-US")}`;
}
export function pilotBarPercent(metric: PilotMetric, value: number) {
  return (value / metric.axisMax) * 100;
}
