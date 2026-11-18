import {
  circularSpeed,
  GRAVITY,
  integrateGravity,
  type GravityBody,
} from "./gravity-physics";
import type { Point3 } from "./types";

/** A two-performer excerpt, using Gravity's original force integrator.
 * Its independent audio timelines never use this visual simulation as a clock. */
export function createWorld() {
  const performers: GravityBody[] = [
    {
      position: { x: 1.65, y: 0, z: 0 },
      velocity: {
        x: 0,
        y: circularSpeed(1.65) * 0.44,
        z: circularSpeed(1.65) * 0.898,
      },
    },
    {
      position: { x: -2.25, y: 0, z: 0 },
      velocity: {
        x: 0,
        y: circularSpeed(2.25) * 0.83,
        z: -circularSpeed(2.25) * 0.558,
      },
    },
  ];
  let remainder = 0;
  return {
    performers,
    advance(seconds: number, paused = false) {
      if (paused) return;
      remainder += Math.min(0.12, Math.max(0, seconds));
      while (remainder >= GRAVITY.step) {
        for (const body of performers) integrateGravity(body, GRAVITY.step);
        remainder -= GRAVITY.step;
      }
    },
    sources(): Point3[] {
      return [
        [0, 0, 0],
        ...performers.map(({ position: p }): Point3 => [p.x, p.y, p.z ?? 0]),
      ];
    },
  };
}

const excerptSeconds = 36;
const excerptSteps = Math.round(excerptSeconds / GRAVITY.step);
let scrollSamples: Float32Array | undefined;

/** Cache the force-integrated path once, then seek it without depending on draw
 * cadence or previous scroll direction. This affects visual positions, not audio
 * playback times. A stationary page does not continue the orbit. */
export function scrollGravityPose(progress: number) {
  if (!scrollSamples) {
    const world = createWorld();
    scrollSamples = new Float32Array((excerptSteps + 1) * 6);
    for (let step = 0; step <= excerptSteps; step++) {
      const sources = world.sources();
      scrollSamples.set([...sources[1], ...sources[2]], step * 6);
      world.advance(GRAVITY.step);
    }
  }
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const sample = (seconds: number): Point3[] => {
    const tick = Math.max(0, Math.min(excerptSteps, seconds / GRAVITY.step));
    const from = Math.floor(tick),
      to = Math.min(excerptSteps, from + 1);
    const amount = tick - from;
    return [0, 1].map(
      (index) =>
        [0, 1, 2].map((axis) => {
          const offset = index * 3 + axis;
          const a = scrollSamples![from * 6 + offset];
          return a + (scrollSamples![to * 6 + offset] - a) * amount;
        }) as unknown as Point3,
    );
  };
  const seconds = p * excerptSeconds;
  const sources: Point3[] = [[0, 0, 0], ...sample(seconds)];
  const trails: Point3[][] = [[], []];
  for (let index = 0; index < 70; index++) {
    const previous = sample(seconds - index * 0.065);
    trails[0].push(previous[0]);
    trails[1].push(previous[1]);
  }
  return { sources, trails, seconds };
}
