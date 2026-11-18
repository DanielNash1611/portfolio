import type { Point3 } from "./types";

/** Exact low, string-level pose in Gravity/src/core/spatial-stage.ts. Apply the
 * same asset normalization to the camera, target, and cello sound position. */
export const gravityCelloCamera = {
  position: [0, -0.23, 0.905] as Point3,
  target: [0, 1.47, 0.02] as Point3,
  fov: 33,
} as const;
export const gravityCelloSound: Point3 = [0, 0.63, 0.22];

export function normalizeGravityPoint(
  point: Point3,
  center: Point3,
  scale: number,
): Point3 {
  return point.map(
    (value, axis) => (value - center[axis]) * scale,
  ) as unknown as Point3;
}
