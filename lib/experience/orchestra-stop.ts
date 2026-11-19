import { orchestraFormationProgress } from "./score-sequence";
import type { SceneSwipeHost } from "./scene-swipe";

export type OrchestraGeometry = { start: number; travel: number };

/** Observe native arrival, including inertia from a gesture begun before the stage. */
export function orchestraArrivalGuard(host: SceneSwipeHost<OrchestraGeometry>) {
  let arrival: { target: number; direction: number; held: boolean } | null =
    null;
  const abort = () => {
    arrival = null;
  };
  const start = (event: Pick<TouchEvent, "touches" | "target">) => {
    abort();
    if (
      event.touches.length !== 1 ||
      host.zoomed() ||
      host.native(event.target)
    )
      return;
    const geometry = host.geometry();
    if (!geometry || geometry.travel <= 0) return;
    const target =
      geometry.start + geometry.travel * orchestraFormationProgress;
    const origin = host.position();
    // A fresh gesture on the formed orchestra leaves freely in either direction.
    // Forward arrival can begin anywhere before it; reverse is local to the score.
    const direction =
      origin < target - 2
        ? 1
        : origin > target + 2 && origin <= geometry.start + geometry.travel + 2
          ? -1
          : 0;
    if (direction) arrival = { target, direction, held: false };
  };
  const scrolled = () => {
    if (!arrival) return;
    if (host.zoomed()) {
      abort();
      return;
    }
    const position = host.position();
    if ((position - arrival.target) * arrival.direction >= 0)
      arrival.held = true;
    if (arrival.held && Math.abs(position - arrival.target) > 0.5)
      host.move(arrival.target);
  };
  const move = (
    event: Pick<TouchEvent, "touches" | "cancelable" | "preventDefault">,
  ) => {
    if (event.touches.length !== 1 || host.zoomed()) {
      abort();
      return;
    }
    // Before arrival the browser owns scrolling. At the hold, consume only the
    // remainder of this gesture; scroll events also cap its native inertia.
    if (arrival?.held && event.cancelable) event.preventDefault();
  };
  const end = (event: Pick<TouchEvent, "touches">) => {
    if (event.touches.length) abort();
    // Keep observing after release: a fast native flick may arrive during inertia.
  };
  return { start, move, end, scrolled, abort };
}
