import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

test("every literal image referenced by the assigned pages exists locally", () => {
  for (const path of [
    "app/creative/gravity/page.tsx",
    "app/creative/gravity/astra/page.tsx",
    "app/creative/jumping-on-coals/page.tsx",
    "app/creative/tabletop-symphony/page.tsx",
    "app/creative/eeg-music/page.tsx",
    "components/overnight-creative/GravityFlagship.tsx",
    "components/overnight-creative/AstraInteractionStory.tsx",
    "components/overnight-creative/TabletopStory.tsx",
    "components/overnight-creative/FarraginousScore.tsx",
  ]) {
    for (const [, asset] of read(path).matchAll(
      /["`]((?:\/images\/)[^"`$]+)["`]/g,
    )) {
      assert.ok(
        existsSync(join(root, "public", asset)),
        `${path}: missing ${asset}`,
      );
    }
  }
});

test("Farraginous keeps the full adaptation qualification visible and links to its evidence sections", () => {
  const page = read("app/creative/eeg-music/page.tsx");
  const score = read("components/overnight-creative/FarraginousScore.tsx");
  for (const id of [
    "watch",
    "signal-system",
    "process-artifacts",
    "exhibition",
  ]) {
    assert.ok(page.includes(`href="#${id}"`));
    assert.ok((page + score).includes(`id="${id}"`));
  }
  assert.match(
    score,
    /<aside[^>]*aria-label="Technical limits and adaptation"[\s\S]*?inputs\[3\]\.body[\s\S]*?<\/aside>/,
  );
});

test("Sound Seeker still uses the existing widget and keeps generation user initiated", () => {
  const page = read("app/sound-seeker/page.tsx");
  assert.match(page, /<SoundSeekerWidget \/>/);
  assert.match(page, /Examples only fill the field/);
  const brief = read("components/overnight-creative/SoundBrief.tsx");
  assert.doesNotMatch(page + brief, /fetch\(|useEffect|responses\.create/);
});
