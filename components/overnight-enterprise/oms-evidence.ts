/** Source crops were inspected against the original public prototype screenshots.
 * Coordinates describe presentation only, never application or backend behavior. */
export type OmsScreen = {
  title: string;
  description: string;
  src: string;
  alt: string;
};
export type CropSpec = {
  x: number;
  y: number;
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
};
export const omsCrops: readonly CropSpec[] = [
  {
    x: 761,
    y: 111,
    width: 572,
    height: 568,
    sourceWidth: 1887,
    sourceHeight: 850,
  },
  {
    x: 761,
    y: 418,
    width: 571,
    height: 311,
    sourceWidth: 1883,
    sourceHeight: 919,
  },
  {
    x: 760,
    y: 391,
    width: 572,
    height: 344,
    sourceWidth: 1895,
    sourceHeight: 924,
  },
];
export const omsBeats = [
  {
    nav: "Read",
    eyebrow: "01 / An order worth checking",
    title: "Read the order.",
    detail:
      "Order 1002 is Processing. Its items, totals, and cancellable state are visible in one view.",
    screen: 0,
  },
  {
    nav: "Risk",
    eyebrow: "02 / The consequence",
    title: "Show the consequence.",
    detail:
      "The confirmation panel warns that cancellation cannot be undone once confirmed.",
    screen: 1,
  },
  {
    nav: "Phrase",
    eyebrow: "03 / A deliberate confirmation",
    title: "Tie confirmation to this order.",
    detail:
      "The form labels CANCEL 1002 as the required phrase for this order.",
    screen: 1,
  },
  {
    nav: "Choice",
    eyebrow: "04 / The final choice",
    title: "Keep both choices visible.",
    detail:
      "The panel offers both “No, keep order” and “Yes, cancel this order.”",
    screen: 1,
  },
  {
    nav: "Result",
    eyebrow: "05 / A visible result",
    title: "Verify the recorded result.",
    detail:
      "The recorded result shows Cancelled and Not cancellable. The outcome is visible in the order itself.",
    screen: 2,
  },
] as const;

export const omsBeatTargets = [0.005, 0.28, 0.48, 0.68, 0.92] as const;
export function omsBeatAt(progress: number): number {
  return Number.isFinite(progress)
    ? Math.min(4, Math.max(0, Math.floor(progress * 5)))
    : 0;
}
export function omsBeatTarget(index: number): number {
  return omsBeatTargets[index] ?? omsBeatTargets[0];
}
export function omsLookupPan(width: number, height: number): number {
  return Math.min(0, height - Math.min(width, 610) * (568 / 572));
}

export function omsScrollProgress(
  top: number,
  sectionHeight: number,
  viewportHeight: number,
  headerHeight = 61,
): number {
  const distance = Math.max(1, sectionHeight - viewportHeight + headerHeight);
  return Math.min(1, Math.max(0, (headerHeight - top) / distance));
}

/** Focus rectangles are fixed to visible controls in the original confirmation crop. */
export const omsFocusTargets = [
  {
    beat: 1,
    field: "warning",
    top: 24.8,
    left: 2.5,
    width: 94.5,
    height: 29.5,
  },
  { beat: 2, field: "phrase", top: 64.4, left: 2.5, width: 94.5, height: 10.6 },
  { beat: 3, field: "choice", top: 86, left: 53.5, width: 43.8, height: 10.6 },
] as const;
export function omsFocusForProgress(progress: number) {
  const beat = omsBeatAt(progress);
  return omsFocusTargets.find((target) => target.beat === beat)?.field;
}
