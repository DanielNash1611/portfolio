/** A touch gesture owns one fixed interval. No native fling can escape it. */
export type TouchStops = {
  stops: readonly number[];
  viewport: number;
  max: number;
  scenes: readonly { start: number; end: number; stops: readonly number[] }[];
};
export type TouchPoint = { x: number; y: number; time: number };
const clamp = (value: number, low: number, high: number) =>
  Math.max(low, Math.min(high, value));

export function touchInterval(origin: number, layout: TouchStops) {
  const scene = layout.scenes.find(
    (range) => origin >= range.start - 2 && origin < range.end - 2,
  );
  const page = Math.max(1, layout.viewport * 0.85);
  const stops = scene ? scene.stops : layout.stops;
  const previousPage = Math.max(
    layout.stops.toReversed().find((stop) => stop < origin - 2) ?? 0,
    origin - page,
  );
  const nextPage = Math.min(
    layout.stops.find((stop) => stop > origin + 2) ?? layout.max,
    origin + page,
  );
  const before =
    [...stops].reverse().find((stop) => stop < origin - 2) ?? previousPage;
  const after = stops.find((stop) => stop > origin + 2) ?? nextPage;
  // Ordinary content retains overlap between swipes, even in very long sections.
  return {
    min: clamp(scene ? before : Math.max(before, origin - page), 0, layout.max),
    max: clamp(scene ? after : Math.min(after, origin + page), 0, layout.max),
    scene: Boolean(scene),
  };
}

export class TouchStopGesture {
  private axis: "pending" | "vertical" | "native" = "pending";
  private last: TouchPoint;
  private velocity = 0;
  private delta = 0;
  readonly interval: ReturnType<typeof touchInterval>;
  constructor(
    private start: TouchPoint,
    readonly origin: number,
    layout: TouchStops,
  ) {
    this.last = start;
    this.interval = touchInterval(origin, layout);
  }
  move(point: TouchPoint) {
    this.delta = this.start.y - point.y;
    if (this.axis === "pending") {
      if (Math.max(Math.abs(this.delta), Math.abs(point.x - this.start.x)) < 8)
        return null;
      this.axis =
        Math.abs(point.x - this.start.x) > Math.abs(this.delta) * 1.5
          ? "native"
          : "vertical";
    }
    if (this.axis !== "vertical") return null;
    const elapsed = point.time - this.last.time;
    if (elapsed > 0)
      this.velocity = clamp((this.last.y - point.y) / elapsed, -3, 3);
    this.last = point;
    return this.interval.scene
      ? this.origin
      : clamp(this.origin + this.delta, this.interval.min, this.interval.max);
  }
  end(time: number) {
    if (this.axis !== "vertical") return null;
    const velocity = time - this.last.time > 100 ? 0 : this.velocity;
    if (this.interval.scene) {
      if (Math.abs(this.delta) < 35) return this.origin;
      return this.delta > 0 ? this.interval.max : this.interval.min;
    }
    return clamp(
      this.origin + this.delta + velocity * 180,
      this.interval.min,
      this.interval.max,
    );
  }
}

/** Browser-event adapter, also exercised with synthetic cancelable touch events. */
export function touchStopController(host: {
  position(): number;
  layout(): TouchStops;
  zoomed(): boolean;
  native(target: EventTarget | null): boolean;
  move(target: number): void;
  settle(target: number): void;
  cancel(): void;
}) {
  let gesture: TouchStopGesture | null = null;
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
    const touch = event.touches[0];
    gesture = new TouchStopGesture(
      { x: touch.clientX, y: touch.clientY, time: event.timeStamp },
      host.position(),
      host.layout(),
    );
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
    if (!gesture) return;
    const touch = event.touches[0];
    const target = gesture.move({
      x: touch.clientX,
      y: touch.clientY,
      time: event.timeStamp,
    });
    if (target === null) return;
    if (!event.cancelable) {
      abort();
      return;
    }
    event.preventDefault();
    host.move(target);
  };
  const end = (event: Pick<TouchEvent, "touches" | "timeStamp">) => {
    if (event.touches.length) {
      abort();
      return;
    }
    const target = gesture?.end(event.timeStamp);
    gesture = null;
    if (target !== null && target !== undefined) host.settle(target);
  };
  const navigate = (direction: number) => {
    abort();
    if (host.zoomed()) return;
    const interval = touchInterval(host.position(), host.layout());
    host.settle(direction > 0 ? interval.max : interval.min);
  };
  return { start, move, end, abort, navigate };
}
