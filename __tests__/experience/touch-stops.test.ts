import assert from "node:assert/strict";
import test from "node:test";
import {
  TouchStopGesture,
  touchInterval,
  touchStopController,
  type TouchStops,
} from "@/lib/experience/touch-stops";

const layout: TouchStops = {
  viewport: 800,
  max: 14000,
  // Intro, outcomes, products, work, toolkit, recommendations, contact, creative.
  stops: [
    0, 900, 2600, 4200, 6100, 7000, 7300, 7900, 8500, 9100, 9700, 10300, 10900,
    12000, 14000,
  ],
  scenes: [
    {
      start: 7000,
      end: 10900,
      stops: [7000, 7300, 7900, 8500, 9100, 9700, 10300, 10900],
    },
  ],
};
function flick(origin: number, direction: number, config = layout) {
  const gesture = new TouchStopGesture(
    { x: 100, y: 500, time: 0 },
    origin,
    config,
  );
  const path = [10, 50, 150, 500, 1500, 5000].map((distance, i) =>
    gesture.move({ x: 100, y: 500 - direction * distance, time: (i + 1) * 10 }),
  );
  return { path, target: gesture.end(65)! };
}

test("fast flicks cannot cross any next/previous major homepage boundary", () => {
  for (const boundary of [900, 2600, 4200, 6100, 12000]) {
    const down = flick(boundary - 90, 1);
    const up = flick(boundary + 90, -1);
    assert.equal(down.target, boundary);
    assert.equal(up.target, boundary);
    assert.ok(down.path.every((value) => value !== null && value <= boundary));
    assert.ok(up.path.every((value) => value !== null && value >= boundary));
  }
});

test("a whole light scene is a single deliberate swipe, independent of flick speed", () => {
  for (const direction of [1, -1]) {
    const origins =
      direction === 1
        ? [7300, 7900, 8500, 9100, 9700, 10300]
        : [10300, 9700, 9100, 8500, 7900, 7300];
    for (const origin of origins) {
      const { path, target } = flick(origin, direction);
      assert.ok(
        path.every((value) => value === origin),
        "scene stays readable until release",
      );
      assert.equal(
        target,
        direction < 0 && origin === 7300 ? 7000 : origin + direction * 600,
      );
    }
  }
});

test("long sections retain overlapping reading pages and can be traversed both ways", () => {
  let origin = 900;
  const visited = [origin];
  while (origin < 2600) {
    origin = flick(origin, 1).target;
    visited.push(origin);
    assert.ok(visited.length < 10, "forward never gets trapped");
  }
  assert.deepEqual(visited, [900, 1580, 2260, 2600]);
  while (origin > 900) {
    const next = flick(origin, -1).target;
    assert.ok(origin - next <= 680);
    origin = next;
  }
  assert.equal(origin, 900);
});

test("entry, clearing, exit, reverse entry and replay do not skip scenes or trap the visitor", () => {
  assert.equal(flick(6900, 1).target, 7000);
  assert.equal(flick(7000, 1).target, 7300);
  assert.equal(flick(7000, -1).target, 6320);
  assert.equal(flick(10300, 1).target, 10900);
  assert.ok(flick(10900, 1).target > 10900);
  assert.equal(flick(10900, -1).target, 10300);
  assert.equal(flick(7300, -1).target, 7000);
  assert.equal(
    flick(7300, 1).target,
    7900,
    "replayed first scene has no accumulated state",
  );
});

test("taps, horizontal swipes, short scene drags and held fingers do not turn into flings", () => {
  const tap = new TouchStopGesture({ x: 0, y: 100, time: 0 }, 7300, layout);
  assert.equal(tap.end(20), null);
  assert.equal(tap.move({ x: 2, y: 99, time: 30 }), null);
  assert.equal(tap.end(40), null);
  const horizontal = new TouchStopGesture(
    { x: 0, y: 100, time: 0 },
    7300,
    layout,
  );
  assert.equal(horizontal.move({ x: 50, y: 90, time: 10 }), null);
  assert.equal(horizontal.move({ x: 50, y: -900, time: 20 }), null);
  assert.equal(horizontal.end(30), null);
  const small = new TouchStopGesture({ x: 0, y: 100, time: 0 }, 7300, layout);
  small.move({ x: 0, y: 80, time: 10 });
  assert.equal(small.end(20), 7300);
  const held = new TouchStopGesture({ x: 0, y: 100, time: 0 }, 1000, layout);
  held.move({ x: 0, y: 40, time: 10 });
  assert.equal(held.end(500), 1060, "holding removes release velocity");
});

test("new swipes during settling and direction changes stay within their original bounds", () => {
  assert.equal(flick(7600, 1).target, 7900);
  assert.equal(flick(7600, -1).target, 7300);
  const gesture = new TouchStopGesture({ x: 0, y: 100, time: 0 }, 2550, layout);
  assert.equal(gesture.move({ x: 0, y: -5000, time: 10 }), 2600);
  assert.equal(gesture.move({ x: 0, y: 5000, time: 20 }), 1870);
  assert.equal(gesture.move({ x: 0, y: -5000, time: 30 }), 2600);
});

test("ordinary homepage scrolling reaches the document ends and adapts to layout changes", () => {
  assert.equal(flick(0, -1).target, 0);
  assert.equal(flick(14000, 1).target, 14000);
  assert.deepEqual(touchInterval(2550, layout), {
    min: 1870,
    max: 2600,
    scene: false,
  });
  assert.equal(
    touchInterval(2550, { ...layout, stops: [0, 3000, 14000] }).max,
    3000,
  );
});

test("cancelable touch events suppress native momentum, while pinch, taps and widgets remain native", () => {
  let position = 7300,
    zoom = false,
    native = false,
    cancelCount = 0;
  const settles: number[] = [];
  const controller = touchStopController({
    position: () => position,
    layout: () => layout,
    zoomed: () => zoom,
    native: () => native,
    move: (target) => {
      position = target;
    },
    settle: (target) => {
      settles.push(target);
      position = target;
    },
    cancel: () => {
      cancelCount++;
    },
  });
  function event(
    y: number,
    time: number,
    count = 1,
    x = 100,
    cancelable = true,
  ) {
    const event = new Event("touchmove", { cancelable });
    Object.defineProperties(event, {
      touches: {
        value: Array.from({ length: count }, () => ({
          clientX: x,
          clientY: y,
        })),
      },
      timeStamp: { value: time },
    });
    return event as TouchEvent;
  }
  controller.start(event(500, 0));
  for (const [y, time] of [
    [480, 10],
    [300, 20],
    [-5000, 30],
  ]) {
    const move = event(y, time);
    controller.move(move);
    assert.equal(
      move.defaultPrevented,
      true,
      "every vertical move blocks the browser fling",
    );
    assert.equal(position, 7300);
  }
  controller.end(event(-5000, 35, 0));
  assert.deepEqual(
    settles,
    [7900],
    "one fast swipe advances exactly one scene",
  );
  controller.start(event(100, 40));
  controller.move(event(100, 50, 2));
  const pinch = event(200, 60, 2);
  controller.move(pinch);
  controller.end(event(200, 70, 0));
  assert.equal(pinch.defaultPrevented, false);
  assert.deepEqual(settles, [7900], "second finger cancels paging");
  for (const bypass of [
    "zoom",
    "widget",
    "tap",
    "horizontal",
    "cancelled",
    "browser-owned",
  ]) {
    zoom = bypass === "zoom";
    native = bypass === "widget";
    controller.start(event(500, 100));
    if (bypass === "cancelled") controller.abort();
    const move =
      bypass === "tap"
        ? event(499, 110)
        : bypass === "horizontal"
          ? event(490, 110, 1, 300)
          : event(-5000, 110, 1, 100, bypass !== "browser-owned");
    controller.move(move);
    controller.end(event(0, 120, 0));
    assert.equal(move.defaultPrevented, false, bypass);
    assert.deepEqual(settles, [7900], bypass);
  }
  zoom = native = false;
  controller.navigate(1);
  controller.navigate(-1);
  assert.deepEqual(
    settles,
    [7900, 8500, 7900],
    "buttons share the scene boundaries",
  );
  assert.ok(cancelCount >= 9);
});

test("ordinary diagonal finger movement still gets the vertical swipe boundary", () => {
  const gesture = new TouchStopGesture(
    { x: 100, y: 500, time: 0 },
    2550,
    layout,
  );
  assert.equal(gesture.move({ x: 155, y: 440, time: 10 }), 2600);
  assert.equal(gesture.end(20), 2600);
});
