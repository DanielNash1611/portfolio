/** The first two pauses finish one leaf; the last also enables the story buttons. */
export const mapLeafStops = [0.36, 0.63, 1] as const;

const clamp = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
const ease = (value: number, from: number, to: number) => {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};

/** Progress starts only once the collection's complete viewport is pinned. */
export function mapLeafFrame(progress: number, index: number) {
  const p = clamp(progress);
  const timing = [
    [0.08, mapLeafStops[0]],
    [mapLeafStops[0], mapLeafStops[1]],
    [mapLeafStops[1], 0.9],
  ][index] ?? [0.62, 0.9];
  const amount = ease(p, timing[0], timing[1]);
  return {
    amount,
    opacity: ease(amount, 0, 0.12),
    rotateX: 0,
    rotateY: -84 * (1 - amount) || 0,
    origin: "0% 50%",
  };
}

export function mapUnfoldTravel(stageHeight: number) {
  return Number.isFinite(stageHeight)
    ? Math.max(620, Math.min(850, stageHeight * 0.95))
    : 680;
}
