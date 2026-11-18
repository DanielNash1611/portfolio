import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { scoutScenes } from "../../components/overnight-builders/scout-narrative-content";

test("the artifact sequence uses only documented app captures and carries fictional-data boundaries", async () => {
  const provenance = await readFile(
    "source-assets/experience-provenance/images/experience/scout/README.md",
    "utf8",
  );
  assert.equal(new Set(scoutScenes.map((scene) => scene.image)).size, 3);
  for (const scene of scoutScenes) {
    assert.ok(provenance.includes(scene.image.split("/").at(-1)!));
    assert.match(scene.alt, /fictional/);
  }
  assert.match(scoutScenes[0].detail, /invented/);
  assert.match(scoutScenes[2].detail, /fictional/);
  assert.equal(scoutScenes[3].image, scoutScenes[2].image);
  assert.match(scoutScenes[3].detail, /no scientific finding/);
  assert.match(scoutScenes[3].alt, /Focused crop/);
});
