import assert from "node:assert/strict";
import test from "node:test";
import {
  introMapController,
  introMapTarget,
  type IntroMapGeometry,
} from "@/lib/experience/intro-map-sequence";
import { orchestraArrivalGuard } from "@/lib/experience/orchestra-stop";
import {
  orchestraFormationProgress,
  scoreSequenceFrame,
} from "@/lib/experience/score-sequence";
import { mapLeafFrame, mapLeafStops } from "@/lib/experience/map-unfold";

const geometry: IntroMapGeometry = {
  start: 0,
  mapStart: 835,
  travel: 620,
  nextSection: 2400,
};
const end = geometry.mapStart + geometry.travel;
const score = { start: 8000, travel: 1000 };
const formed = score.start + score.travel * orchestraFormationProgress;
function event(y: number, time: number, count = 1, x = 100, cancelable = true) {
  const value = new Event("touchmove", { cancelable });
  Object.defineProperties(value, {
    touches: {
      value: Array.from({ length: count }, () => ({ clientX: x, clientY: y })),
    },
    timeStamp: { value: time },
  });
  return value as TouchEvent;
}
function fixture(origin = 0) {
  let position = origin,
    native = false,
    zoomed = false,
    available = true,
    cancels = 0;
  const moves: number[] = [],
    settles: number[] = [];
  const host = {
    position: () => position,
    native: () => native,
    zoomed: () => zoomed,
    move: (y: number) => {
      position = y;
      moves.push(y);
    },
    settle: (y: number) => {
      position = y;
      settles.push(y);
    },
    cancel: () => {
      cancels++;
    },
  };
  const intro = introMapController({
    ...host,
    geometry: () => (available ? geometry : null),
  });
  const orchestra = orchestraArrivalGuard({
    ...host,
    geometry: () => (available ? score : null),
  });
  const controllers = [intro, orchestra];
  const start = (e: TouchEvent) => controllers.forEach((c) => c.start(e));
  const move = (e: TouchEvent) => controllers.forEach((c) => c.move(e));
  const finish = (e: TouchEvent) => controllers.forEach((c) => c.end(e));
  const abort = () => controllers.forEach((c) => c.abort());
  function swipe(direction = 1, fast = false) {
    start(event(500, 0));
    const events = [
      event(500 - direction * 15, fast ? 10 : 80),
      event(500 - direction * 90, fast ? 25 : 160),
      event(500 - direction * (fast ? 350 : 150), fast ? 70 : 300),
    ];
    for (const e of events) move(e);
    finish(event(0, fast ? 75 : 310, 0));
    return events;
  }
  return {
    intro,
    orchestra,
    start,
    move,
    finish,
    abort,
    swipe,
    moves,
    settles,
    scroll(y: number) {
      position = y;
      orchestra.scrolled();
    },
    get position() {
      return position;
    },
    set position(y: number) {
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

test("initial swipes land the closed compass without a hero animation hold, then one real leaf per swipe", () => {
  const f = fixture();
  const expected = [
    geometry.mapStart,
    ...mapLeafStops.map((p) => geometry.mapStart + p * geometry.travel),
  ];
  for (const target of expected) {
    assert.ok(f.swipe().every((e) => e.defaultPrevented));
    assert.equal(f.position, target);
  }
  assert.deepEqual(f.settles, expected);
  for (let step = 0; step < 3; step++) {
    const states = [0, 1, 2].map(
      (i) => mapLeafFrame(mapLeafStops[step], i).amount,
    );
    assert.ok(states.slice(0, step + 1).every((n) => n === 1));
    assert.ok(states.slice(step + 1).every((n) => n === 0));
  }
  assert.equal(
    introMapTarget(540, 1, geometry),
    geometry.mapStart,
    "the old hero hold is no longer a checkpoint",
  );
});

test("fast initial and in-compass flicks respect the closed case and completed map", () => {
  const f = fixture();
  f.swipe(1, true);
  assert.equal(f.position, geometry.mapStart);
  f.swipe(1, true);
  assert.equal(f.position, end);
  assert.ok(f.moves.every((y) => y <= end));
  assert.deepEqual(
    [0, 1, 2].map((i) => mapLeafFrame(1, i).amount),
    [1, 1, 1],
  );
});

test("the next swipe or fast flick AFTER compass lands products and cannot catapult through it", () => {
  for (const origin of [end - 1.5, end, end + 1.5, end + 120]) {
    for (const fast of [false, true]) {
      const f = fixture(origin);
      assert.ok(f.swipe(1, fast).every((e) => e.defaultPrevented));
      assert.equal(f.position, geometry.nextSection);
      assert.ok(f.moves.every((y) => y <= geometry.nextSection));
      assert.ok(f.swipe(1, fast).every((e) => !e.defaultPrevented));
      assert.equal(
        f.settles.length,
        1,
        "fresh swipe from products resumes native reading",
      );
    }
  }
  const f = fixture(end);
  f.start(event(500, 0));
  f.move(event(-5000, 60));
  f.finish(event(-5000, 70, 0));
  assert.equal(f.position, geometry.nextSection);
});

test("reverse from products returns to the open map, then closes leaves and leaves the closed compass smoothly", () => {
  const f = fixture(geometry.nextSection);
  for (const target of [
    end,
    geometry.mapStart + mapLeafStops[1] * geometry.travel,
    geometry.mapStart + mapLeafStops[0] * geometry.travel,
    geometry.mapStart,
    geometry.start,
  ]) {
    f.swipe(-1);
    assert.equal(f.position, target);
  }
  assert.ok(f.swipe(-1).every((e) => !e.defaultPrevented));
  for (const offset of [-1.5, 0, 1.5]) {
    f.position = geometry.mapStart + offset;
    f.swipe(-1, true);
    assert.equal(f.position, geometry.start);
    f.swipe(1, true);
    assert.equal(f.position, geometry.mapStart);
    f.swipe(1, true);
    assert.equal(f.position, end);
    f.swipe(-1, true);
    assert.equal(f.position, geometry.mapStart);
    f.swipe(-1, true);
    assert.equal(f.position, geometry.start);
  }
});

test("ordinary products/content gestures remain native, with no generic reading steps", () => {
  for (const origin of [-10, geometry.nextSection + 10, 4000, 15000]) {
    const f = fixture(origin);
    for (const direction of [-1, 1])
      assert.ok(f.swipe(direction, true).every((e) => !e.defaultPrevented));
    assert.equal(f.settles.length, 0);
    // Native scroll within ordinary content is not rewritten.
    f.scroll(origin + 100);
    assert.equal(f.position, origin + 100);
  }
});

test("orchestra forward arrival from OUTSIDE its animation range catches native momentum at formation", () => {
  for (const origin of [
    geometry.nextSection,
    score.start - 900,
    score.start - 10,
    score.start,
  ]) {
    for (const fast of [false, true]) {
      const f = fixture(origin);
      assert.ok(
        f.swipe(1, fast).every((e) => !e.defaultPrevented),
        "arrival before the hold stays native",
      );
      f.scroll(formed - 20);
      assert.equal(f.position, formed - 20);
      // Native inertia arrives after touchend, including a huge scroll sample.
      f.scroll(formed + (fast ? 5000 : 30));
      assert.equal(f.position, formed);
      f.scroll(formed + 100);
      assert.equal(f.position, formed, "remaining momentum cannot escape");
      assert.ok(f.swipe(1, fast).every((e) => !e.defaultPrevented));
      f.scroll(formed + 500);
      assert.equal(f.position, formed + 500, "fresh swipe exits");
    }
  }
  const frame = scoreSequenceFrame(orchestraFormationProgress);
  assert.equal(frame.gather, 1);
  assert.equal(frame.orchestra, 1);
  assert.equal(frame.surface, 0);
});

test("orchestra hold catches an active drag, then releases in either direction on the next gesture", () => {
  for (const direction of [-1, 1]) {
    const f = fixture(score.start - 200);
    f.start(event(500, 0));
    f.move(event(400, 100));
    f.scroll(formed + 10);
    assert.equal(f.position, formed);
    const remainder = event(100, 160);
    f.move(remainder);
    assert.equal(remainder.defaultPrevented, true);
    f.finish(event(100, 170, 0));
    assert.ok(f.swipe(direction).every((e) => !e.defaultPrevented));
    f.scroll(formed + direction * 300);
    assert.equal(f.position, formed + direction * 300);
  }
});

test("reverse orchestra hold and replay keep working without capturing content below the score", () => {
  const f = fixture(score.start + score.travel);
  f.swipe(-1, true);
  f.scroll(formed - 600);
  assert.equal(f.position, formed);
  f.scroll(formed - 20);
  assert.equal(f.position, formed);
  f.swipe(-1);
  f.scroll(score.start - 200);
  assert.equal(f.position, score.start - 200);
  f.swipe();
  f.scroll(formed + 100);
  assert.equal(f.position, formed);
  f.position = score.start + score.travel + 100;
  f.swipe(-1);
  f.scroll(score.start + score.travel + 10);
  assert.equal(f.position, score.start + score.travel + 10);
});

test("the whole initial journey reaches products natively, holds initial orchestra arrival, then exits", () => {
  const f = fixture();
  f.swipe();
  assert.equal(f.position, geometry.mapStart);
  for (let i = 0; i < 3; i++) f.swipe();
  assert.equal(f.position, end);
  f.swipe(1, true);
  assert.equal(f.position, geometry.nextSection);
  f.swipe(1, true);
  f.scroll(score.start - 100);
  assert.equal(f.position, score.start - 100);
  f.scroll(formed + 2000);
  assert.equal(f.position, formed);
  f.swipe();
  f.scroll(formed + 500);
  assert.equal(f.position, formed + 500);
});

test("pinch, zoom, widgets, reading and browser-owned map gestures bypass capture", () => {
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
    f.start(event(500, 0));
    const move =
      bypass === "pinch"
        ? event(300, 50, 2)
        : bypass === "horizontal"
          ? event(490, 50, 1, 300)
          : bypass === "tap"
            ? event(499, 50)
            : event(300, 50, 1, 100, bypass !== "browser-owned");
    f.move(move);
    f.finish(event(300, 80, 0));
    assert.equal(move.defaultPrevented, false, bypass);
    assert.equal(f.settles.length, 0, bypass);
  }
  for (const bypass of ["pinch", "zoom", "widget", "reading"]) {
    const f = fixture(score.start - 400);
    f.zoomed = bypass === "zoom";
    f.native = bypass === "widget";
    f.available = bypass !== "reading";
    f.start(event(500, 0));
    f.move(event(300, 50, bypass === "pinch" ? 2 : 1));
    f.scroll(formed + 300);
    assert.equal(f.position, formed + 300, bypass);
  }
});

test("interruptions clear holds, tiny map nudges do not snap back, and replay retains no scene index", () => {
  const f = fixture(geometry.mapStart);
  f.start(event(500, 0));
  f.move(event(480, 50));
  f.finish(event(480, 60, 0));
  assert.equal(f.settles.length, 0);
  assert.equal(f.position, geometry.mapStart + 20);
  f.start(event(500, 0));
  f.move(event(400, 100));
  f.abort();
  f.finish(event(400, 110, 0));
  assert.equal(f.settles.length, 0);
  f.position = score.start - 500;
  f.swipe();
  f.scroll(formed + 100);
  assert.equal(f.position, formed);
  f.abort();
  f.scroll(formed + 500);
  assert.equal(f.position, formed + 500);
  f.position = 0;
  f.swipe();
  assert.equal(f.position, geometry.mapStart);
});
