export const LIGHT_JOURNEY_APPROACH = 0.32;

/** Measure on layout changes, then sample native scroll without layout reads. */
export function lightJourneyGeometry(
  documentTop: number,
  sceneHeight: number,
  stickyTop: number,
  compact = false,
  homePacing = false,
) {
  // Give touch swipes more room to settle on each method. Keep the same
  // reading/flight proportions and native scroll, including reverse travel.
  const step = Math.max(
    500,
    sceneHeight * (compact ? (homePacing ? 2.6 : 1.9) : 1.25),
  );
  return { start: documentTop - stickyTop, step, distance: step * 6.05 };
}

export function lightJourneyFrame(
  scroll: number,
  geometry: ReturnType<typeof lightJourneyGeometry>,
) {
  const offset = scroll - geometry.start;
  const position = Math.max(
    -LIGHT_JOURNEY_APPROACH,
    Math.min(5.9, offset / geometry.step - LIGHT_JOURNEY_APPROACH),
  );
  const index = Math.max(0, Math.min(4, Math.round(position)));
  return {
    position,
    index,
    readable: Math.abs(position - index) <= 0.24,
    reward: position >= 4.95,
    immersive: offset >= -0.5 && offset <= geometry.distance + 0.5,
  };
}
