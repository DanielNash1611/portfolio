import type { Vec3 } from "./types";

export function magnitude(v: Vec3): number {
  return Math.hypot(v.x, v.y, v.z ?? 0);
}

export function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + (a.z ?? 0) * (b.z ?? 0);
}

export function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * (b.z ?? 0) - (a.z ?? 0) * b.y,
    y: (a.z ?? 0) * b.x - a.x * (b.z ?? 0),
    z: a.x * b.y - a.y * b.x,
  };
}

export function scaled(v: Vec3, scale: number): Vec3 {
  return { x: v.x * scale, y: v.y * scale, z: (v.z ?? 0) * scale };
}

export function normalized(v: Vec3): Vec3 {
  return scaled(v, 1 / (magnitude(v) || 1));
}

/** Stable perpendicular for initial approach construction or a head-on contact. */
export function perpendicular(radial: Vec3): Vec3 {
  return normalized(
    Math.hypot(radial.x, radial.y) > 1e-8
      ? { x: -radial.y, y: radial.x, z: 0 }
      : { x: 1, y: 0, z: 0 },
  );
}

/** Preserve the body's actual incoming plane, including polar trajectories. */
export function trajectoryTangent(
  position: Vec3,
  velocity: Vec3,
  direction: 1 | -1 = 1,
): Vec3 {
  const radial = normalized(position),
    speed = dot(velocity, radial);
  const tangent = {
    x: velocity.x - radial.x * speed,
    y: velocity.y - radial.y * speed,
    z: (velocity.z ?? 0) - (radial.z ?? 0) * speed,
  };
  return magnitude(tangent) > 1e-8
    ? normalized(tangent)
    : scaled(perpendicular(radial), direction);
}
