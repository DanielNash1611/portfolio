import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

// New curated artifact references must resolve locally; this catches broken screenshot paths.
for (const story of ["ScoutStory", "LaunchMuseStory", "CareerStory"]) {
  test(`${story} ships every referenced artifact`, async () => {
    const source = await readFile(
      story === "ScoutStory"
        ? "components/overnight-builders/scout-narrative-content.ts"
        : `components/overnight-builders/${story}.tsx`,
      "utf8",
    );
    const assets = [
      ...source.matchAll(/(?:src|image)[:=]\s*["'](\/images\/[^"']+)["']/g),
    ].map((match) => match[1]);
    assert.ok(assets.length >= 3);
    await Promise.all(assets.map((asset) => access(`public${asset}`)));
  });
}

test("career folio links preserve evidence destinations", async () => {
  const story = await readFile(
    "components/overnight-builders/CareerStory.tsx",
    "utf8",
  );
  const folio = await readFile(
    "components/overnight-builders/CareerFolio.tsx",
    "utf8",
  );
  for (const match of `${story}\n${folio}`.matchAll(
    /(?:href=|source:)\s*["']#([^"']+)["']/g,
  )) {
    assert.ok(
      `${story}\n${folio}`.includes(`id="${match[1]}"`),
      `Missing target ${match[1]}`,
    );
  }
  for (const component of [
    "CaseStudyOverview",
    "EvidenceBridge",
    "EvalEvidence",
    "ImplementedNext",
    "ProductEngines",
    "WhatThisProves",
  ]) {
    assert.ok(
      story.includes(`<${component} />`),
      `Missing full evidence section ${component}`,
    );
  }
});
