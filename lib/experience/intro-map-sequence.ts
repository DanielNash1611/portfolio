import { mapLeafStops } from "./map-unfold";
import { sceneSwipeController, type SceneSwipeHost } from "./scene-swipe";

export type IntroMapGeometry = {
  start: number;
  heroEnd: number;
  mapStart: number;
  travel: number;
};

/** Only the opening hero → map interaction participates. Content after it is native. */
export function introMapTarget(
  origin: number,
  direction: number,
  geometry: IntroMapGeometry,
  fast = false,
) {
  const { start, heroEnd, mapStart, travel } = geometry;
  const end = mapStart + travel;
  if (origin < start - 2 || origin > end + 2 || travel <= 0) return null;
  if (
    (origin <= start + 2 && direction < 0) ||
    (origin >= end - 2 && direction > 0)
  )
    return null;
  // A fast map flick can unfold all leaves, but cannot fling into the products.
  if (fast && origin >= mapStart - 2) {
    if (direction > 0) return end;
    // At the closed case a reverse flick must leave, not reselect the case.
    if (origin > mapStart + 2) return mapStart;
  }
  const stops = [
    start,
    heroEnd,
    mapStart,
    ...mapLeafStops.map((p) => mapStart + p * travel),
  ];
  return direction > 0
    ? (stops.find((point) => point > origin + 2) ?? null)
    : (stops.toReversed().find((point) => point < origin - 2) ?? null);
}

/** Share gesture semantics without sharing scene state or capturing the gaps. */
export function introMapController(host: SceneSwipeHost<IntroMapGeometry>) {
  return sceneSwipeController({ ...host, target: introMapTarget });
}
