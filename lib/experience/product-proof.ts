const clamp = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

const proofSlugs = [
  "oms-chatgpt-app",
  "ai-career-operating-system",
  "immunology-scout",
] as const;

/** Bind each artifact to its project, even if the homepage's feature order changes. */
export function orderProofProducts<T extends { slug: string }>(
  items: readonly T[],
) {
  if (items.length !== proofSlugs.length) return null;
  const ordered = proofSlugs.map((slug) =>
    items.find((item) => item.slug === slug),
  );
  return ordered.every((item): item is T => Boolean(item)) ? ordered : null;
}

export function proofEase(value: number, from: number, to: number) {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
}

/** The first and final beats hold; direct controls land on stable artifact views. */
export function productProofFrame(progress: number) {
  const p = clamp(progress);
  const project = Math.min(2, Math.floor(p * 3));
  const local = clamp(p * 3 - project);
  const step =
    project === 2
      ? local < 0.28
        ? 0
        : local < 0.64
          ? 1
          : 2
      : local < 0.55
        ? 0
        : 1;
  return { project, local, step };
}

export function productProofLocal(progress: number, project: number) {
  return clamp(clamp(progress) * 3 - Math.max(0, Math.min(2, project)));
}

export function productProofTarget(project: number, step: number) {
  const index = Number.isFinite(project)
    ? Math.max(0, Math.min(2, Math.round(project)))
    : 0;
  const targets = index === 2 ? [0.04, 0.42, 0.92] : [0.12, 0.87];
  const view = Number.isFinite(step)
    ? Math.max(0, Math.min(targets.length - 1, Math.round(step)))
    : 0;
  return (index + targets[view]) / 3;
}

export function productProofTravel(stageHeight: number) {
  return Number.isFinite(stageHeight)
    ? Math.max(1500, Math.min(2400, stageHeight * 2.8))
    : 1900;
}

export function canPinProductProof(width: number, height: number) {
  return (
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    (width >= 900
      ? height >= 620
      : width >= 600
        ? height >= 740
        : height >= 800)
  );
}
