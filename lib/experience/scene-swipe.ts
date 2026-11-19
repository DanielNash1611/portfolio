export type SwipePoint = { x: number; y: number; time: number };

export type SceneSwipeHost<Geometry> = {
  position(): number;
  geometry(): Geometry | null;
  native(target: EventTarget | null): boolean;
  zoomed(): boolean;
  move(y: number): void;
  settle(y: number): void;
  cancel(): void;
};

/** The event adapter is independent of rendering, so real cancelable events can be tested. */
export function sceneSwipeController<Geometry>(
  host: SceneSwipeHost<Geometry> & {
    target(
      origin: number,
      direction: number,
      geometry: Geometry,
      fast?: boolean,
    ): number | null;
  },
) {
  let gesture: {
    origin: number;
    start: SwipePoint;
    last: SwipePoint;
    geometry: Geometry;
    axis: "pending" | "vertical" | "native";
    claimed: boolean;
  } | null = null;
  const abort = () => {
    gesture = null;
    host.cancel();
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
    if (!geometry) return;
    const origin = host.position();
    if (
      host.target(origin, 1, geometry) === null &&
      host.target(origin, -1, geometry) === null
    )
      return;
    const touch = event.touches[0];
    const point = { x: touch.clientX, y: touch.clientY, time: event.timeStamp };
    gesture = {
      origin,
      start: point,
      last: point,
      geometry,
      axis: "pending",
      claimed: false,
    };
  };
  const move = (
    event: Pick<
      TouchEvent,
      "touches" | "timeStamp" | "cancelable" | "preventDefault"
    >,
  ) => {
    if (!gesture) return;
    if (event.touches.length !== 1 || host.zoomed()) {
      abort();
      return;
    }
    const touch = event.touches[0];
    const delta = gesture.start.y - touch.clientY;
    const x = touch.clientX - gesture.start.x;
    if (gesture.axis === "pending") {
      if (Math.max(Math.abs(delta), Math.abs(x)) < 8) return;
      gesture.axis =
        Math.abs(x) > Math.abs(delta) * 1.5 ? "native" : "vertical";
    }
    if (gesture.axis !== "vertical") return;
    const target = host.target(
      gesture.origin,
      delta > 0 ? 1 : -1,
      gesture.geometry,
    );
    if (target === null && !gesture.claimed) return;
    if (!event.cancelable) {
      abort();
      return;
    }
    event.preventDefault();
    gesture.claimed = true;
    gesture.last = {
      x: touch.clientX,
      y: touch.clientY,
      time: event.timeStamp,
    };
    const bound = target ?? gesture.origin;
    host.move(
      Math.max(
        Math.min(gesture.origin, bound),
        Math.min(Math.max(gesture.origin, bound), gesture.origin + delta),
      ),
    );
  };
  const end = (event: Pick<TouchEvent, "touches" | "timeStamp">) => {
    const current = gesture;
    gesture = null;
    if (!current || event.touches.length || !current.claimed) return;
    const delta = current.start.y - current.last.y;
    // Tiny nudges stay where the finger left them instead of snapping backward.
    if (Math.abs(delta) < 35) return;
    const duration = Math.max(80, current.last.time - current.start.time);
    const fast =
      Math.abs(delta) >= 100 &&
      Math.abs(delta) / duration >= 1.4 &&
      event.timeStamp - current.last.time <= 100;
    const target = host.target(
      current.origin,
      delta > 0 ? 1 : -1,
      current.geometry,
      fast,
    );
    if (target !== null) host.settle(target);
  };
  return { start, move, end, abort };
}
