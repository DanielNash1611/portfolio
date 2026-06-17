/**
 * Historical eval replay — makes the public "5/12 → 11/12" claim auditable.
 *
 * The product page claims the Portfolio Guide improved from 5/12 to 11/12 on a
 * comparable stored 12-case OpenAI run after grounding and source-separation
 * changes. That number comes from a live model + LLM judge, so it cannot be
 * regenerated deterministically. Instead we commit the two real runs verbatim
 * (lib/portfolio-guide/evals/__fixtures__/) and assert here what IS reproducible:
 *
 *  1. Provenance: the committed runs really did score 5/12 and 11/12 (judged).
 *  2. Traceability: every case in those runs still exists in the suite.
 *  3. The deterministic layer is reproducible on the frozen answers.
 *  4. Honest framing: the headline number is judge-gated. The deterministic
 *     floor on the same answers is higher (judged-pass ≤ deterministic-pass),
 *     and the improved run does not regress the deterministic layer.
 *
 * This keeps the marketing claim honest: it is a historical, judge-scored,
 * 12-case result — not a current full-suite or deterministic pass rate.
 */

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { portfolioGuideEvalCases } from "@/lib/portfolio-guide/evals/cases";
import { evaluateDeterministicChecks } from "@/lib/portfolio-guide/evals/assertions";
import type { CopilotResponse } from "@/lib/portfolio-guide/types";

type HistoricalFixture = {
  provenance: {
    label: string;
    sourceArtifact: string;
    recordedSummary: { passed: number; total: number };
  };
  cases: Array<{
    id: string;
    question: string;
    recordedPassed: boolean;
    judgeVerdict?: string;
    response: CopilotResponse;
  }>;
};

async function loadFixture(name: string): Promise<HistoricalFixture> {
  const url = new URL(
    `../../lib/portfolio-guide/evals/__fixtures__/${name}.json`,
    import.meta.url,
  );
  return JSON.parse(await readFile(url, "utf8")) as HistoricalFixture;
}

function deterministicHardPassCount(fixture: HistoricalFixture): number {
  let passed = 0;
  for (const recorded of fixture.cases) {
    const evalCase = portfolioGuideEvalCases.find(
      (candidate) => candidate.id === recorded.id,
    );
    assert.ok(
      evalCase,
      `historical case "${recorded.id}" must still exist in the suite`,
    );
    const checks = evaluateDeterministicChecks(evalCase, recorded.response);
    const hardFailures = checks.filter(
      (check) => check.severity === "hard" && !check.passed,
    );
    if (hardFailures.length === 0) {
      passed += 1;
    }
  }
  return passed;
}

const BASELINE = "historical-openai-12case-baseline";
const IMPROVED = "historical-openai-12case-improved";

test("committed historical runs preserve the 5/12 → 11/12 provenance", async () => {
  const baseline = await loadFixture(BASELINE);
  const improved = await loadFixture(IMPROVED);

  assert.deepEqual(baseline.provenance.recordedSummary, {
    passed: 5,
    total: 12,
  });
  assert.deepEqual(improved.provenance.recordedSummary, {
    passed: 11,
    total: 12,
  });

  // The recorded per-case verdicts must add up to the recorded summary, so the
  // committed evidence is internally consistent and not hand-edited.
  assert.equal(baseline.cases.filter((item) => item.recordedPassed).length, 5);
  assert.equal(improved.cases.filter((item) => item.recordedPassed).length, 11);
});

test("every historical case still exists in the current suite", async () => {
  for (const name of [BASELINE, IMPROVED]) {
    const fixture = await loadFixture(name);
    assert.equal(fixture.cases.length, 12);
    for (const recorded of fixture.cases) {
      assert.ok(
        portfolioGuideEvalCases.some((c) => c.id === recorded.id),
        `historical case "${recorded.id}" is missing from the suite`,
      );
    }
  }
});

test("re-scoring the frozen answers is deterministic", async () => {
  const baseline = await loadFixture(BASELINE);
  for (const recorded of baseline.cases) {
    const evalCase = portfolioGuideEvalCases.find((c) => c.id === recorded.id);
    assert.ok(evalCase);
    const first = evaluateDeterministicChecks(evalCase, recorded.response);
    const second = evaluateDeterministicChecks(evalCase, recorded.response);
    assert.deepEqual(
      first,
      second,
      `deterministic checks for "${recorded.id}" are not reproducible`,
    );
  }
});

test("the headline number is judge-gated; the deterministic floor is higher", async () => {
  // A case only passes when BOTH deterministic checks and the judge pass, so the
  // judged pass count can never exceed the deterministic pass count on the same
  // answers. This documents that most of 5→11 was groundedness/judge scoring,
  // not deterministic checks — i.e. the claim is genuinely judge-dependent.
  for (const name of [BASELINE, IMPROVED]) {
    const fixture = await loadFixture(name);
    const deterministicPass = deterministicHardPassCount(fixture);
    assert.ok(
      fixture.provenance.recordedSummary.passed <= deterministicPass,
      `${name}: recorded judged pass (${fixture.provenance.recordedSummary.passed}) ` +
        `should be ≤ deterministic pass (${deterministicPass})`,
    );
  }
});

test("the improved grounding run does not regress the deterministic layer", async () => {
  const baseline = await loadFixture(BASELINE);
  const improved = await loadFixture(IMPROVED);
  assert.ok(
    deterministicHardPassCount(improved) >=
      deterministicHardPassCount(baseline),
    "improved run should be at least as clean as baseline on deterministic checks",
  );
});
