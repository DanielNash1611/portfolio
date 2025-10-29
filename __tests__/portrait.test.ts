import assert from "node:assert/strict";
import test from "node:test";
import metadata from "@/public/portraits/metadata.json";
import { getPortrait } from "@/components/Portrait";

test("hero variant resolves to the dedicated hero portrait", () => {
  const portrait = getPortrait("hero");
  assert.ok(portrait, "expected hero portrait to resolve");
  assert.equal(portrait.file, "hero_square_photo.jpg");
});

test("inline variant falls back to center portrait when primary missing", () => {
  const inlineIndex = metadata.findIndex((item) => item.roles.includes("inline"));
  assert.notEqual(inlineIndex, -1, "expected to find inline portrait entry");
  const [removed] = metadata.splice(inlineIndex, 1);

  try {
    const portrait = getPortrait("inline");
    assert.ok(portrait, "expected inline fallback portrait to resolve");
    assert.equal(portrait.file, "center_medium_photo.jpg");
  } finally {
    if (removed) {
      metadata.splice(inlineIndex, 0, removed);
    }
  }
});

test("getPortrait returns null when no matching asset exists", () => {
  const heroIndex = metadata.findIndex((item) => item.roles.includes("hero"));
  assert.notEqual(heroIndex, -1, "expected to find hero portrait entry");
  const [removed] = metadata.splice(heroIndex, 1);

  try {
    const portrait = getPortrait("hero");
    assert.equal(portrait, null);
  } finally {
    if (removed) {
      metadata.splice(heroIndex, 0, removed);
    }
  }
});
