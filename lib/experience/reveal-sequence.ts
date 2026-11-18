const clamp = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

/** Leave a reading interval at both ends; each intermediate beat has equal time. */
export function sequencePosition(progress: number, count: number) {
  return clamp((clamp(progress) - 0.08) / 0.84) * Math.max(0, count - 1);
}

export function sequenceIndex(progress: number, count: number) {
  return Math.min(
    Math.max(0, count - 1),
    Math.floor(sequencePosition(progress, count) + 0.5 + 1e-9),
  );
}

export function sequenceTarget(index: number, count: number) {
  return count <= 1 ? 0 : 0.08 + clamp(index / (count - 1)) * 0.84;
}

export function stackArrival(progress: number, index: number, count: number) {
  if (index === 0) return 1;
  return clamp((sequencePosition(progress, count) - index + 0.72) / 0.72);
}
