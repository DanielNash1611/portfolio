import assert from "node:assert/strict";
import test from "node:test";
import {
  introMapController,
  introMapTarget,
  type IntroMapGeometry,
} from "@/lib/experience/intro-map-sequence";
import { mapLeafFrame, mapLeafStops } from "@/lib/experience/map-unfold";

const geometry: IntroMapGeometry = {
  start: 0,
  heroEnd: 540,
  mapStart: 835,
  travel: 620,
};
const end = geometry.mapStart + geometry.travel;
function fixture(origin = 0) {
  let position = origin,
    native = false,
    zoomed = false,
    available = true,
    cancels = 0;
  const moves: number[] = [],
    settles: number[] = [];
  const controller = introMapController({
    position: () => position,
    geometry: () => (available ? geometry : null),
    native: () => native,
    zoomed: () => zoomed,
    move: (y) => {
      position = y;
      moves.push(y);
    },
    settle: (y) => {
      position = y;
      settles.push(y);
    },
    cancel: () => {
      cancels++;
    },
  });
  function event(
    y: number,
    time: number,
    count = 1,
    x = 100,
    cancelable = true,
  ) {
    const value = new Event("touchmove", { cancelable });
    Object.defineProperties(value, {
      touches: {
        value: Array.from({ length: count }, () => ({
          clientX: x,
          clientY: y,
        })),
      },
      timeStamp: { value: time },
    });
    return value as TouchEvent;
  }
  function swipe(direction = 1, fast = false) {
    controller.start(event(500, 0));
    const events = [
      event(500 - direction * 15, fast ? 10 : 80),
      event(500 - direction * 90, fast ? 25 : 160),
      event(500 - direction * (fast ? 350 : 150), fast ? 70 : 300),
    ];
    for (const e of events) controller.move(e);
    controller.end(event(0, fast ? 75 : 310, 0));
    return events;
  }
  return {
    controller,
    event,
    swipe,
    moves,
    settles,
    get position() {
      return position;
    },
    set position(y) {
      position = y;
    },
    set native(value: boolean) {
      native = value;
    },
    set zoomed(value: boolean) {
      zoomed = value;
    },
    set available(value: boolean) {
      available = value;
    },
    get cancels() {
      return cancels;
    },
  };
}

test("normal swipes resolve the hero, land the closed map, then open exactly one real map leaf each", () => {
  const f = fixture();
  const expected = [
    geometry.heroEnd,
    geometry.mapStart,
    ...mapLeafStops.map((p) => geometry.mapStart + p * geometry.travel),
  ];
  for (const target of expected) {
    const events = f.swipe();
    assert.equal(f.position, target);
    assert.ok(
      events.every((e) => e.defaultPrevented),
      "claimed moves suppress native overshoot",
    );
  }
  assert.deepEqual(f.settles, expected);
  for (let step = 0; step < 3; step++) {
    const states = [0, 1, 2].map(
      (index) => mapLeafFrame(mapLeafStops[step], index).amount,
    );
    assert.ok(states.slice(0, step + 1).every((amount) => amount === 1));
    assert.ok(
      states.slice(step + 1).every((amount) => amount === 0),
      "later leaves have not visibly opened",
    );
  }
});

test("a fast map flick may open all three pages, but no move or release exits the interaction", () => {
  const f = fixture(geometry.mapStart);
  const events = f.swipe(1, true);
  assert.equal(f.position, end);
  assert.ok(events.every((e) => e.defaultPrevented));
  assert.ok(f.moves.every((y) => y <= end));
  assert.deepEqual(
    [0, 1, 2].map(
      (i) =>
        mapLeafFrame((f.position - geometry.mapStart) / geometry.travel, i)
          .amount,
    ),
    [1, 1, 1],
  );
  // Oversized samples still cannot fling into the next homepage section.
  f.position = geometry.mapStart;
  f.controller.start(f.event(500, 0));
  f.controller.move(f.event(-5000, 60));
  f.controller.end(f.event(-5000, 70, 0));
  assert.equal(f.position, end);
});

test("even a fast first swipe rests at the hero, and the following swipe only lands the map", () => {
  const f = fixture();
  f.swipe(1, true);
  assert.equal(f.position, geometry.heroEnd);
  f.swipe(1, true);
  assert.equal(f.position, geometry.mapStart);
});

test("reverse swipes close one leaf at a time and return through the map landing and hero", () => {
  const f = fixture(end);
  const expected = [
    geometry.mapStart + mapLeafStops[1] * geometry.travel,
    geometry.mapStart + mapLeafStops[0] * geometry.travel,
    geometry.mapStart,
    geometry.heroEnd,
    0,
  ];
  for (const target of expected) {
    f.swipe(-1);
    assert.equal(f.position, target);
  }
  const native = f.swipe(-1);
  assert.ok(native.every((event) => !event.defaultPrevented));
  assert.equal(f.settles.length, expected.length);
});

test("entry/exit, products, work, light and other ordinary content keep native touch", () => {
  for (const origin of [-10, end + 10, 3000, 7000, 15000]) {
    const f = fixture(origin);
    for (const direction of [-1, 1])
      assert.ok(f.swipe(direction, true).every((e) => !e.defaultPrevented));
    assert.equal(f.position, origin);
    assert.equal(f.settles.length, 0);
  }
  const f = fixture(end);
  assert.ok(f.swipe(1).every((e) => !e.defaultPrevented));
  assert.equal(
    f.settles.length,
    0,
    "the next swipe after all pages are open exits naturally",
  );
});

test("pinch, zoom, native widgets, horizontal movement and taps bypass the sequence", () => {
  for (const bypass of [
    "pinch",
    "zoom",
    "widget",
    "horizontal",
    "tap",
    "reading",
    "browser-owned",
  ]) {
    const f = fixture(geometry.mapStart);
    f.zoomed = bypass === "zoom";
    f.native = bypass === "widget";
    f.available = bypass !== "reading";
    f.controller.start(f.event(500, 0));
    const move =
      bypass === "pinch"
        ? f.event(300, 50, 2)
        : bypass === "horizontal"
          ? f.event(490, 50, 1, 300)
          : bypass === "tap"
            ? f.event(499, 50)
            : f.event(300, 50, 1, 100, bypass !== "browser-owned");
    f.controller.move(move);
    f.controller.end(f.event(300, 80, 0));
    assert.equal(move.defaultPrevented, false, bypass);
    assert.equal(f.settles.length, 0, bypass);
  }
});

test("interruptions and replay do not accumulate scene state or snap tiny nudges backward", () => {
  const f = fixture(geometry.mapStart);
  f.controller.start(f.event(500, 0));
  f.controller.move(f.event(480, 50));
  f.controller.end(f.event(480, 60, 0));
  assert.equal(f.settles.length, 0);
  assert.equal(f.position, geometry.mapStart + 20);
  f.controller.start(f.event(500, 0));
  f.controller.move(f.event(400, 100));
  f.controller.abort();
  f.controller.end(f.event(400, 110, 0));
  assert.equal(f.settles.length, 0);
  f.position = 0;
  f.swipe();
  assert.equal(f.position, geometry.heroEnd);
  f.swipe();
  assert.equal(f.position, geometry.mapStart);
  const midway = geometry.mapStart + 100;
  assert.equal(
    introMapTarget(midway, 1, geometry),
    geometry.mapStart + mapLeafStops[0] * geometry.travel,
  );
  assert.equal(introMapTarget(midway, -1, geometry), geometry.mapStart);
});
