const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (start: number, end: number, n: number) => {
  const x = clamp((n - start) / (end - start));
  return x * x * (3 - 2 * x);
};

/** Each voice gets a reading pause before the next slides into its place. */
export function recommendationFrame(progress: number, count: number) {
  if (count <= 1) return { position: 0, index: 0 };
  const step = clamp(progress) * count;
  const whole = Math.min(count - 1, Math.floor(step));
  const position =
    whole === count - 1 ? whole : whole + smooth(0.58, 0.98, step - whole);
  return { position, index: Math.min(count - 1, Math.round(position)) };
}

export type SystemNode = {
  id: string;
  label: string;
  before?: readonly [number, number];
  after?: readonly [number, number];
};

export function systemNodeFrame(progress: number, node: SystemNode) {
  const t = smooth(0.12, 0.88, progress);
  const from = node.before ?? node.after!;
  const to = node.after ?? from;
  return {
    x: from[0] + (to[0] - from[0]) * t,
    y: from[1] + (to[1] - from[1]) * t,
    opacity: !node.before
      ? smooth(0.55, 0.85, progress)
      : !node.after
        ? 1 - smooth(0.15, 0.64, progress)
        : 1,
  };
}
