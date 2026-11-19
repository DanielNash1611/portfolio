import { referralPhases, referralReadingStops } from "./referral-ring";
import { sceneSwipeController, type SceneSwipeHost } from "./scene-swipe";

export type ReferralGeometry = { start: number; travel: number; count: number };
// Land inside the grouped plateau: native pixel rounding must not leave its controls disabled.
export function referralStops({ start, travel, count }: ReferralGeometry) {
  return [...referralReadingStops(count), referralPhases.grouped + 0.06].map(
    (p) => start + p * travel,
  );
}

/** No fast-flick shortcut: every featured quote must settle before the split. */
export function referralTarget(
  origin: number,
  direction: number,
  geometry: ReferralGeometry,
) {
  if (geometry.travel <= 0 || geometry.count <= 0) return null;
  const stops = referralStops(geometry);
  if (direction > 0) return stops.find((point) => point > origin + 2) ?? null;
  return stops.toReversed().find((point) => point < origin - 2) ?? null;
}

export function referralSwipeController(
  host: SceneSwipeHost<ReferralGeometry>,
) {
  let gesture: {
    origin: number;
    x: number;
    y: number;
    geometry: ReferralGeometry;
    held: number | null;
  } | null = null;
  const pager = sceneSwipeController({
    ...host,
    geometry: () => {
      const geometry = gesture?.geometry;
      if (!geometry) return null;
      const stops = referralStops(geometry),
        origin = host.position();
      return origin >= stops[0] - 2 && origin <= stops.at(-1)! + 2
        ? geometry
        : null;
    },
    target: referralTarget,
  });
  const abort = () => {
    gesture = null;
    pager.abort();
  };
  const start = (
    event: Pick<TouchEvent, "touches" | "target" | "timeStamp">,
  ) => {
    abort();
    if (
      event.touches.length !== 1 ||
      host.zoomed() ||
      host.native(event.target)
    )
      return;
    const geometry = host.geometry();
    if (geometry && geometry.travel > 0 && geometry.count > 0)
      gesture = {
        origin: host.position(),
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        geometry,
        held: null,
      };
    pager.start(event);
  };
  const scrolled = () => {
    if (!gesture) return;
    if (host.zoomed()) {
      abort();
      return;
    }
    const position = host.position();
    if (gesture.held === null) {
      const direction = position > gesture.origin ? 1 : -1;
      const target = referralTarget(
        gesture.origin,
        direction,
        gesture.geometry,
      );
      if (target === null || (position - target) * direction < 0) return;
      gesture.held = target;
      pager.abort();
    }
    // Also catches native entry and browser-owned momentum after touchend.
    // The latch survives release, and only a fresh gesture/input can advance it.
    if (Math.abs(position - gesture.held) > 0.5) host.move(gesture.held);
  };
  const move = (
    event: Pick<
      TouchEvent,
      "touches" | "timeStamp" | "cancelable" | "preventDefault"
    >,
  ) => {
    if (event.touches.length !== 1 || host.zoomed()) {
      abort();
      return;
    }
    if (gesture && gesture.held === null) {
      const x = Math.abs(event.touches[0].clientX - gesture.x);
      const y = Math.abs(event.touches[0].clientY - gesture.y);
      if (x >= 8 && x > y * 1.5) {
        abort();
        return;
      }
    }
    if (gesture && gesture.held !== null) {
      if (event.cancelable) event.preventDefault();
      return;
    }
    pager.move(event);
  };
  const end = (event: Pick<TouchEvent, "touches" | "timeStamp">) => {
    pager.end(event);
    if (event.touches.length) abort();
  };
  return { start, move, end, scrolled, abort };
}
