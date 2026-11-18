export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export function smooth(from: number, to: number, progress: number) {
  const t = clamp((progress - from) / (to - from));
  return t * t * (3 - 2 * t);
}
/** Progress is local to the later Gravity interlude, never the whole portfolio.
 * Dissipation is scroll driven and reverses without rewinding simulation time. */
export const chapterProgress = {
  arrival: 0,
  gravity: 0.35,
  dissolve: 1,
} as const;
export function narrativeFrame(progress: number) {
  const p = clamp(progress);
  const assembly = smooth(0, 0.15, p);
  const dissolve = smooth(0.62, 0.98, p);
  const visibility = assembly * (1 - smooth(0.86, 1, p));
  return {
    progress: p,
    assembly,
    dissolve,
    visibility,
    chapter:
      p < 0.15
        ? ("arrival" as const)
        : p < 0.82
          ? ("gravity" as const)
          : ("dissolve" as const),
    gravity: assembly * (1 - smooth(0.62, 0.82, p)),
    particles: visibility * (0.12 + dissolve * 0.78),
  };
}
export const isGravityActive = (progress: number) =>
  progress >= 0.15 && progress < 0.82;

/** Stable, deterministic dispersal directions; no random respawning on reverse. */
export function dissipationVector(
  index: number,
): readonly [number, number, number] {
  const angle = index * 2.399963;
  const radius = 2.1 + (index % 29) / 12;
  return [
    Math.cos(angle) * radius,
    Math.sin(angle) * radius * 0.6 + 0.65,
    Math.sin(index * 0.71) * 2.5,
  ];
}

/** Reuses the renderer's typed buffers; no random targets or per-frame arrays. */
export function disperseParticles(
  origin: Float32Array,
  directions: Float32Array,
  output: Float32Array,
  amount: number,
) {
  const t = clamp(amount);
  for (let offset = 0; offset < output.length; offset++) {
    const axis = offset % 3,
      index = Math.floor(offset / 3);
    output[offset] =
      origin[offset] +
      directions[offset] * t +
      Math.sin(index * 0.053 + t * 4 + axis) * t * 0.28;
  }
}
