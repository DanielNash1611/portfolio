import { orchestraFormationProgress } from "./score-sequence";
import { sceneSwipeController, type SceneSwipeHost } from "./scene-swipe";

export type OrchestraGeometry = { start: number; travel: number };

/** One hold at the actual gathering completion, approached from either side. */
export function orchestraTarget(
  origin: number,
  direction: number,
  { start, travel }: OrchestraGeometry,
) {
  if (travel <= 0 || origin < start - 2 || origin > start + travel + 2)
    return null;
  const formed = start + travel * orchestraFormationProgress;
  // A fresh swipe away from the hold is native. Never reselect this position.
  return (origin < formed - 2 && direction > 0) ||
    (origin > formed + 2 && direction < 0)
    ? formed
    : null;
}

export function orchestraController(host: SceneSwipeHost<OrchestraGeometry>) {
  return sceneSwipeController({ ...host, target: orchestraTarget });
}
