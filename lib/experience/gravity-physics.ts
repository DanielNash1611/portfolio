import type { Vec3 } from "./types";
import {
  cross,
  dot,
  magnitude,
  normalized,
  perpendicular,
  trajectoryTangent,
} from "./vector3";

/** Artistic stage units and seconds, shared by every performer. */
export const GRAVITY = Object.freeze({
  mu: 0.3,
  softening: 0.025,
  step: 1 / 120,
  boundary: 6,
  captureSeconds: 1.6,
  captureDrag: 3.2,
  escapeAcceleration: 0.9,
  escapeSpeedAtInfinity: 0.85,
});

export interface GravityBody {
  position: Vec3;
  velocity: Vec3;
}

export function gravitationalPotential(position: Vec3): number {
  return -GRAVITY.mu / Math.hypot(magnitude(position), GRAVITY.softening);
}

export function specificEnergy(body: GravityBody): number {
  return (
    dot(body.velocity, body.velocity) / 2 +
    gravitationalPotential(body.position)
  );
}

/** Signed projection retained for planar diagnostics. */
export function angularMomentum(body: GravityBody): number {
  return body.position.x * body.velocity.y - body.position.y * body.velocity.x;
}

export function angularMomentumVector(body: GravityBody): Vec3 {
  return cross(body.position, body.velocity);
}

export function circularSpeed(radius: number): number {
  return Math.sqrt(
    (GRAVITY.mu * radius ** 2) / (radius ** 2 + GRAVITY.softening ** 2) ** 1.5,
  );
}

/** Positive-energy arrival. Approach angle chooses the incoming tangent only;
 * the resulting position/velocity determine the subsequent orbital plane. */
export function incomingVelocity(
  position: Vec3,
  periapsis: number,
  direction: 1 | -1,
  speedAtInfinity: number,
  approachAngle = 0,
): Vec3 {
  const radius = magnitude(position);
  const speedSquared =
    speedAtInfinity ** 2 - 2 * gravitationalPotential(position);
  const periapsisSpeed = Math.sqrt(
    speedAtInfinity ** 2 +
      (2 * GRAVITY.mu) / Math.hypot(periapsis, GRAVITY.softening),
  );
  const tangential = (direction * periapsis * periapsisSpeed) / radius;
  const radial = -Math.sqrt(Math.max(0, speedSquared - tangential ** 2));
  const r = normalized(position),
    u = perpendicular(r),
    v = cross(r, u);
  const cos = Math.cos(approachAngle),
    sin = Math.sin(approachAngle);
  return {
    x: radial * r.x + tangential * (u.x * cos + v.x * sin),
    y: radial * r.y + tangential * (u.y * cos + v.y * sin),
    z: radial * (r.z ?? 0) + tangential * ((u.z ?? 0) * cos + (v.z ?? 0) * sin),
  };
}

/** Kick-drift-kick (velocity Verlet); no orbit targets or positional correction. */
export function integrateGravity(body: GravityBody, dt: number): void {
  const { position: p, velocity: v } = body;
  let factor = -GRAVITY.mu / (dot(p, p) + GRAVITY.softening ** 2) ** 1.5;
  v.x += (p.x * factor * dt) / 2;
  v.y += (p.y * factor * dt) / 2;
  v.z = (v.z ?? 0) + ((p.z ?? 0) * factor * dt) / 2;
  p.x += v.x * dt;
  p.y += v.y * dt;
  p.z = (p.z ?? 0) + v.z * dt;
  factor = -GRAVITY.mu / (dot(p, p) + GRAVITY.softening ** 2) ** 1.5;
  v.x += (p.x * factor * dt) / 2;
  v.y += (p.y * factor * dt) / 2;
  v.z += (p.z * factor * dt) / 2;
}

/** Finite capture burn: brake within the incoming plane without changing its tilt. */
export function brakeForCapture(
  body: GravityBody,
  direction: 1 | -1,
  speedRatio: number,
  dt: number,
): void {
  const speed = circularSpeed(magnitude(body.position)) * speedRatio;
  const tangent = trajectoryTangent(body.position, body.velocity, direction);
  const amount = 1 - Math.exp(-GRAVITY.captureDrag * dt);
  body.velocity.x += (tangent.x * speed - body.velocity.x) * amount;
  body.velocity.y += (tangent.y * speed - body.velocity.y) * amount;
  body.velocity.z =
    (body.velocity.z ?? 0) +
    ((tangent.z ?? 0) * speed - (body.velocity.z ?? 0)) * amount;
}

/** Finite prograde burn ends at positive escape energy; gravity then takes over. */
export function thrustForEscape(body: GravityBody, dt: number): void {
  const speed = magnitude(body.velocity);
  const target = Math.sqrt(
    GRAVITY.escapeSpeedAtInfinity ** 2 -
      2 * gravitationalPotential(body.position),
  );
  if (speed >= target || speed < 1e-10) return;
  const factor =
    Math.min(GRAVITY.escapeAcceleration * dt, target - speed) / speed;
  body.velocity.x += body.velocity.x * factor;
  body.velocity.y += body.velocity.y * factor;
  body.velocity.z = (body.velocity.z ?? 0) * (1 + factor);
}
