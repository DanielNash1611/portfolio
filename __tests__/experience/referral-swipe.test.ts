import assert from "node:assert/strict";
import test from "node:test";
import { referralOrder } from "@/content/experience-referrals";
import { getExperienceHomeContent } from "@/content/experience-home";
import {
  referralSwipeController,
  referralStops,
  type ReferralGeometry,
} from "@/lib/experience/referral-swipe";
import {
  referralCardPose,
  referralLayout,
  referralRingFrame,
} from "@/lib/experience/referral-ring";

const geometry: ReferralGeometry = { start: 10000, travel: 840, count: 15 };
const stops = referralStops(geometry);
function event(y: number, time: number, count = 1, x = 100, cancelable = true) {
  const e = new Event("touchmove", { cancelable });
  Object.defineProperties(e, {
    touches: {
      value: Array.from({ length: count }, () => ({ clientX: x, clientY: y })),
    },
    timeStamp: { value: time },
  });
  return e as TouchEvent;
}
function fixture(origin: number) {
  let position = origin,
    native = false,
    zoomed = false,
    enabled = true;
  const moves: number[] = [],
    targets: number[] = [];
  const c = referralSwipeController({
    position: () => position,
    geometry: () => (enabled ? geometry : null),
    native: () => native,
    zoomed: () => zoomed,
    cancel: () => {},
    move: (y) => {
      position = y;
      moves.push(y);
    },
    settle: (y) => {
      position = y;
      targets.push(y);
    },
  });
  const scroll = (y: number) => {
    position = y;
    c.scrolled();
  };
  function swipe(direction = 1, fast = false) {
    c.start(event(500, 0));
    const samples = [
      event(500 - direction * 15, fast ? 5 : 80),
      event(500 - direction * 90, fast ? 15 : 160),
      event(500 - direction * (fast ? 1200 : 150), fast ? 40 : 300),
    ];
    for (const e of samples) {
      c.move(e);
      c.scrolled();
    }
    c.end(event(0, fast ? 45 : 310, 0));
    c.scrolled();
    return samples;
  }
  return {
    c,
    scroll,
    swipe,
    moves,
    targets,
    get position() {
      return position;
    },
    set position(value: number) {
      position = value;
    },
    set native(value: boolean) {
      native = value;
    },
    set zoomed(value: boolean) {
      zoomed = value;
    },
    set enabled(value: boolean) {
      enabled = value;
    },
  };
}
const progress = (y: number) => (y - geometry.start) / geometry.travel;

test("Don, Zac and Sumanth each settle face-on and fully opaque before any split, across responsive layouts", () => {
  assert.deepEqual(referralOrder.slice(0, 3), [
    "don-worsham",
    "zac-bogart",
    "sumanth-cherukuri",
  ]);
  const groups = getExperienceHomeContent().recommendations;
  for (const [width, height] of [
    [342, 392],
    [300, 340],
    [720, 400],
    [1152, 430],
  ]) {
    const layout = referralLayout(
      width,
      height,
      groups.map((g) => g.people.length),
    );
    for (let i = 0; i < 3; i++) {
      const frame = referralRingFrame(progress(stops[i]), 15);
      assert.equal(frame.phase, "reading");
      assert.equal(frame.position, i);
      assert.equal(frame.index, i);
      assert.equal(frame.gather, 0);
      const pose = referralCardPose(
        progress(stops[i]),
        i,
        15,
        { group: 0, rank: i },
        layout,
      );
      assert.equal(pose.fullOpacity, 1);
      assert.equal(pose.bodyOpacity, 1);
      assert.equal(pose.summaryOpacity, 0);
      assert.ok(Math.abs(pose.rotateY) < 1e-8);
      assert.ok(Math.abs(pose.rotateZ) < 1e-8);
      assert.ok(pose.width <= width);
      assert.ok(pose.height <= height);
    }
  }
  const zac = groups
    .flatMap((g) => g.people)
    .find((p) => p.id === "zac-bogart")!;
  assert.ok(zac.quote.includes("tip-of-the-spear"));
  assert.ok(zac.quote.includes("whole company"));
  assert.equal(referralRingFrame(progress(stops[3]), 15).phase, "grouped");
});

test("normal and extreme quick flicks advance exactly one settled card; split requires another fresh swipe", () => {
  for (const fast of [false, true]) {
    const f = fixture(stops[0]);
    for (const [index, target] of stops.slice(1).entries()) {
      f.swipe(1, fast);
      assert.equal(f.position, target);
      if (index < 2)
        assert.equal(referralRingFrame(progress(f.position), 15).gather, 0);
      f.scroll(target + 3000);
      assert.equal(
        f.position,
        target,
        "remaining native momentum cannot advance again",
      );
    }
    const before = f.moves.length;
    assert.ok(f.swipe(1, fast).every((e) => !e.defaultPrevented));
    f.scroll(geometry.start + geometry.travel + 600);
    assert.equal(f.position, geometry.start + geometry.travel + 600);
    assert.equal(
      f.moves.length,
      before,
      "native exit adds no corrective moves",
    );
  }
});

test("fast arrival from outside the quote animation cannot skip Don or Zac", () => {
  for (const origin of [0, geometry.start - 600, geometry.start]) {
    const f = fixture(origin);
    assert.ok(f.swipe(1, true).every((e) => !e.defaultPrevented));
    f.scroll(geometry.start + 5000);
    assert.equal(f.position, stops[0]);
    f.scroll(geometry.start + 6000);
    assert.equal(f.position, stops[0]);
    f.swipe(1, true);
    assert.equal(f.position, stops[1]);
    for (let i = 0; i < 4; i++) {
      f.scroll(stops[1] + 5000);
      assert.equal(
        f.position,
        stops[1],
        "Zac remains readable until fresh input",
      );
    }
    f.swipe(1, true);
    assert.equal(f.position, stops[2]);
    assert.equal(referralRingFrame(progress(f.position), 15).phase, "reading");
    f.swipe(1, true);
    assert.equal(f.position, stops[3]);
  }
});

test("reverse from the split restores Sumanth, Zac, Don one per flick, then exits natively", () => {
  const f = fixture(stops[3]);
  for (const target of stops.slice(0, 3).toReversed()) {
    f.swipe(-1, true);
    assert.equal(f.position, target);
    f.scroll(target - 3000);
    assert.equal(f.position, target);
  }
  assert.ok(f.swipe(-1, true).every((e) => !e.defaultPrevented));
  f.scroll(geometry.start - 500);
  assert.equal(f.position, geometry.start - 500);
  f.position = geometry.start + geometry.travel + 900;
  f.swipe(-1, true);
  f.scroll(geometry.start - 900);
  assert.equal(
    f.position,
    stops[3],
    "native reverse arrival lands the split before restoring quotes",
  );
  f.swipe(-1, true);
  assert.equal(f.position, stops[2]);
});

test("a completed card cannot be undone by reversing the same finger before release", () => {
  const f = fixture(stops[0]);
  f.c.start(event(500, 0));
  f.c.move(event(-5000, 30));
  f.c.scrolled();
  assert.equal(f.position, stops[1]);
  f.c.move(event(700, 60));
  f.c.scrolled();
  f.c.end(event(0, 70, 0));
  assert.equal(f.position, stops[1]);
  f.swipe(-1, true);
  assert.equal(f.position, stops[0]);
});

test("pinch, zoom, native widgets and static/paused modes bypass quote capture; interruptions clear the hold", () => {
  for (const bypass of ["pinch", "zoom", "widget", "disabled"]) {
    const f = fixture(stops[0]);
    f.zoomed = bypass === "zoom";
    f.native = bypass === "widget";
    f.enabled = bypass !== "disabled";
    f.c.start(event(500, 0));
    const e = event(300, 40, bypass === "pinch" ? 2 : 1);
    f.c.move(e);
    f.c.end(event(0, 50, 0));
    assert.equal(e.defaultPrevented, false, bypass);
    f.scroll(stops[3] + 500);
    assert.equal(f.position, stops[3] + 500, bypass);
  }
  const f = fixture(stops[0]);
  f.swipe(1, true);
  assert.equal(f.position, stops[1]);
  f.c.abort();
  f.scroll(stops[3] + 400);
  assert.equal(f.position, stops[3] + 400);
  f.position = stops[0];
  f.swipe(1, true);
  assert.equal(f.position, stops[1]);
});

test("horizontal gestures bypass the arrival guard; noncancelable vertical momentum still cannot skip a card", () => {
  const f = fixture(stops[0]);
  f.c.start(event(500, 0));
  const horizontal = event(495, 40, 1, 400);
  f.c.move(horizontal);
  f.c.end(event(495, 50, 0));
  assert.equal(horizontal.defaultPrevented, false);
  f.scroll(stops[3] + 600);
  assert.equal(f.position, stops[3] + 600);
  f.position = stops[0];
  f.c.start(event(500, 0));
  const native = event(100, 40, 1, 100, false);
  f.c.move(native);
  f.c.end(event(100, 50, 0));
  assert.equal(native.defaultPrevented, false);
  f.scroll(stops[3] + 600);
  assert.equal(f.position, stops[1]);
});
