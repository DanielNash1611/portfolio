import assert from "node:assert/strict";
import test from "node:test";
import { HOMEPAGE_LOOK_FLAGS, resolveHomepageLook } from "../lib/homepage-look";

test("exposes the studio and score homepage flags", () => {
  assert.equal(HOMEPAGE_LOOK_FLAGS.studio.enabled, true);
  assert.equal(HOMEPAGE_LOOK_FLAGS.score.enabled, true);
});

test("resolves public homepage look values", () => {
  assert.equal(resolveHomepageLook("studio"), "studio");
  assert.equal(resolveHomepageLook("score"), "score");
  assert.equal(resolveHomepageLook(["score", "studio"]), "score");
});

test("falls back safely for missing or unknown values", () => {
  assert.equal(resolveHomepageLook(undefined), "classic");
  assert.equal(resolveHomepageLook("unknown"), "classic");
});
