/**
 * Deterministic policy tests for the AI Career Operating System product page.
 *
 * These guard the *claims* the page is allowed to make, independent of any live
 * model. They exist because the page's credibility rests on staying honest about
 * scope: it must never imply external adoption, enterprise scale, or a
 * commercial launch, must keep human accountability and "advisory (not hard
 * gate)" language, and must not let its headline eval-case count drift away from
 * the real suite size. (The "no sole hand-coding" boundary is asserted in
 * grounding.test.ts, which checks the Portfolio Guide grounding context.)
 */

import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { productEntries } from "@/content/portfolio";
import { portfolioGuideEvalCases } from "@/lib/portfolio-guide/evals/cases";

const aiCareer = productEntries.find(
  (entry) => entry.slug === "ai-career-operating-system",
);

async function readComponentSources(): Promise<string> {
  const dir = new URL("../components/ai-career-system/", import.meta.url);
  const files = (await readdir(dir)).filter((file) => file.endsWith(".tsx"));
  const sources = await Promise.all(
    files.map((file) => readFile(new URL(file, dir), "utf8")),
  );
  return sources.join("\n");
}

/**
 * The reader-facing surface of the product page: the structured product entry
 * plus the component source text, lowercased for case-insensitive scanning.
 */
async function pageSurface(): Promise<string> {
  const components = await readComponentSources();
  return `${JSON.stringify(aiCareer)}\n${components}`.toLowerCase();
}

test("AI Career product entry is present and production-shaped", () => {
  assert.ok(aiCareer, "expected an ai-career-operating-system product entry");
  assert.equal(aiCareer.status, "Production-shaped");
});

test("the displayed Guide case count matches the real eval suite size", () => {
  assert.ok(aiCareer);
  const metric = aiCareer.featuredMetrics.find((item) =>
    /\bcases?\b/i.test(item.value),
  );
  assert.ok(metric, "expected a '<n> cases' featured metric");
  const shown = Number.parseInt(metric.value, 10);
  assert.equal(
    shown,
    portfolioGuideEvalCases.length,
    `Featured metric claims ${shown} cases but the suite has ` +
      `${portfolioGuideEvalCases.length}. Update this public claim deliberately ` +
      `when the eval suite changes.`,
  );
});

test("no '<n> cases' claim on the page drifts from the real suite size", async () => {
  const surface = await pageSurface();
  // Matches "31 cases" / "31 authored cases" / "31 authored evaluation cases".
  // Deliberately ignores the hyphenated historical "12-case OpenAI run" phrase.
  const claims = [
    ...surface.matchAll(/(\d+)\s+(?:authored\s+)?(?:evaluation\s+)?cases\b/g),
  ];
  assert.ok(claims.length > 0, "expected at least one '<n> cases' claim");
  for (const claim of claims) {
    assert.equal(
      Number(claim[1]),
      portfolioGuideEvalCases.length,
      `Found "${claim[0]}" but the suite has ${portfolioGuideEvalCases.length} cases.`,
    );
  }
});

test("the AI Career page makes no external-adoption, scale, or launch overclaim", async () => {
  const surface = await pageSurface();
  const forbidden: RegExp[] = [
    /fully autonomous/,
    /generally available/,
    /trusted by/,
    /enterprise customers/,
    /enterprise[- ]scale/,
    /production rollout/,
    /commercially/,
    /in production at/,
    /thousands of/,
    // External usage counts, e.g. "1,200 recruiters" / "500+ customers".
    /\b\d[\d,]*\+?\s+(?:customers|recruiters|companies|hires|paying users)\b/,
  ];
  for (const pattern of forbidden) {
    assert.doesNotMatch(
      surface,
      pattern,
      `Forbidden overclaim matched ${pattern} on the AI Career page.`,
    );
  }
});

test("the AI Career page keeps its honesty and human-accountability language", async () => {
  const surface = await pageSurface();
  const required: Array<[string, RegExp]> = [
    ["explicit 'no external-adoption claim'", /no external-adoption claim/],
    [
      "human review/approval retained",
      /human[ -](?:review|approval|judgment|approved)/,
    ],
    ["reviews are advisory", /advisory/],
    [
      "implemented vs future work separated",
      /future work|next investment|hard gate or explicit override/,
    ],
    ["source-audited evidence", /source-audited/],
    ["public-safe boundary", /public-safe/],
  ];
  for (const [label, pattern] of required) {
    assert.match(
      surface,
      pattern,
      `Missing required honesty signal: ${label}.`,
    );
  }
});
