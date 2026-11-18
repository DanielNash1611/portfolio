import assert from "node:assert/strict";
import test from "node:test";
import {
  createPortraitScrubber,
  portraitHandoffOffset,
  portraitPhases,
  portraitTime,
} from "@/lib/experience/portrait-scroll";

class Clock {
  next = 0;
  pending = new Map<number, () => void>();
  request = (callback: () => void) => {
    const id = ++this.next;
    this.pending.set(id, callback);
    return id;
  };
  cancel = (id: number) => {
    this.pending.delete(id);
  };
  flush() {
    const callbacks = [...this.pending.values()];
    this.pending.clear();
    callbacks.forEach((callback) => callback());
  }
}
class Media extends EventTarget {
  duration = 8;
  readyState = 0;
  seeking = false;
  time = 0;
  writes: number[] = [];
  pauses = 0;
  get currentTime() {
    return this.time;
  }
  set currentTime(value: number) {
    assert.ok(!this.seeking, "a second seek must wait for the first");
    this.time = value;
    this.writes.push(value);
    this.seeking = true;
  }
  pause() {
    this.pauses++;
  }
  ready() {
    this.readyState = 2;
    this.dispatchEvent(new Event("loadedmetadata"));
  }
  finishSeek() {
    this.seeking = false;
    this.dispatchEvent(new Event("seeked"));
  }
}

test("portrait progress traverses every encoded frame, reverses, and stays inside decodable boundaries", () => {
  assert.equal(portraitTime(-1, 8), 0);
  assert.equal(portraitTime(0, 8), 0);
  assert.equal(portraitTime(1, 8), 191 / 24);
  assert.equal(portraitTime(2, 8), 191 / 24);
  for (const invalid of [0, -1, NaN, Infinity])
    assert.equal(portraitTime(0.5, invalid), 0);
  assert.equal(portraitTime(NaN, 8), 0);
  const forward = Array.from({ length: 10001 }, (_, i) =>
    portraitTime(i / 10000, 8),
  );
  assert.equal(new Set(forward).size, 192);
  assert.deepEqual(
    [...forward].reverse(),
    Array.from({ length: 10001 }, (_, i) =>
      portraitTime((10000 - i) / 10000, 8),
    ),
  );
});

test("the entrance reaches the look before a held reading beat and a continuous exit phase", () => {
  const look = 125 / 24;
  for (const progress of [portraitPhases.look, 0.6, 0.63, portraitPhases.exit])
    assert.equal(portraitTime(progress, 8), look);
  assert.ok(portraitTime(0.4, 8) < look);
  assert.ok(portraitTime(0.8, 8) > look);
  assert.equal(portraitTime(1, 8), 191 / 24);
  for (const boundary of [portraitPhases.look, portraitPhases.exit])
    assert.ok(
      Math.abs(
        portraitTime(boundary - 0.0001, 8) - portraitTime(boundary + 0.0001, 8),
      ) <=
        1 / 24,
    );
});

test("words release at the look while portrait compensation overlaps the unfinished walk-out at desktop and phone travel distances", () => {
  for (const travel of [1280, 1067.2, 908.8]) {
    assert.equal(portraitHandoffOffset(0.4, travel), 0);
    assert.equal(portraitHandoffOffset(portraitPhases.look, travel), 0);
    for (const p of [0.66, 0.8, 0.9]) {
      assert.ok(portraitHandoffOffset(p, travel) > 0);
      assert.ok(portraitTime(p, 8) < portraitTime(1, 8));
    }
    assert.equal(
      portraitHandoffOffset(1, travel),
      (1 - portraitPhases.look) * travel,
    );
    assert.equal(
      portraitHandoffOffset(0.8, travel),
      portraitHandoffOffset(1 - 0.2, travel),
    );
  }
  assert.equal(portraitHandoffOffset(NaN, 1000), 0);
  assert.equal(portraitHandoffOffset(0.9, Infinity), 0);
});

test("mobile seeking coalesces rapid and reversed scrolling into the latest frame without overlapping decodes", () => {
  const media = new Media();
  const clock = new Clock();
  const scrub = createPortraitScrubber(media, clock, () => assert.fail());
  scrub.setActive(true);
  scrub.setProgress(0.8);
  clock.flush();
  assert.equal(media.writes.length, 0, "wait for metadata");
  media.ready();
  clock.flush();
  assert.deepEqual(media.writes, [portraitTime(0.8, 8)]);
  scrub.setProgress(0.9);
  scrub.setProgress(0.3);
  scrub.setProgress(0.2);
  assert.equal(clock.pending.size, 1);
  clock.flush();
  assert.equal(media.writes.length, 1, "the decoder still owns the first seek");
  media.finishSeek();
  clock.flush();
  assert.deepEqual(media.writes, [portraitTime(0.8, 8), portraitTime(0.2, 8)]);
  media.finishSeek();
  clock.flush();
  assert.equal(media.writes.length, 2, "an idle page has no playback clock");
  assert.equal(clock.pending.size, 0);
  scrub.dispose();
});

test("suspension cancels queued work, resumes at current scroll, and disposal ignores late media events", () => {
  const media = new Media();
  const clock = new Clock();
  const scrub = createPortraitScrubber(media, clock, () => assert.fail());
  media.ready();
  scrub.setActive(true);
  scrub.setProgress(0.4);
  scrub.setActive(false);
  assert.equal(clock.pending.size, 0);
  scrub.setProgress(0.7);
  media.finishSeek();
  clock.flush();
  assert.equal(media.writes.length, 0);
  scrub.setActive(true);
  clock.flush();
  assert.deepEqual(media.writes, [portraitTime(0.7, 8)]);
  media.finishSeek();
  scrub.dispose();
  scrub.setProgress(0.1);
  media.ready();
  media.finishSeek();
  clock.flush();
  assert.equal(clock.pending.size, 0);
  assert.equal(media.writes.length, 1);
  assert.ok(media.pauses >= 4);
});
