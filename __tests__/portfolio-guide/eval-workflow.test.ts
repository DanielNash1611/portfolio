import { runPortfolioGuideEvalSuite } from "../../lib/portfolio-guide/evals/runner";
import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { ArtifactCache, digest, fingerprintFiles, makeReviewPacket, validateNativeReview, type NativeReview } from "../../scripts/lib/eval-artifacts";
import { selectEvalCases, requireExplicitLive } from "../../lib/portfolio-guide/evals/selection";
import { portfolioGuideEvalCases } from "../../lib/portfolio-guide/evals/cases";
import { normalizeJudgeResult } from "../../lib/portfolio-guide/evals/judge";
import { resolveEvalRunnerConfig } from "../../lib/portfolio-guide/evals/config";

test("unrelated and assertion edits select zero inference; shared behavior selects bounded smoke", () => {
  assert.equal(selectEvalCases(portfolioGuideEvalCases, { changedPaths: ["docs/portfolio-guide.md", "app/contact/page.tsx", "lib/portfolio-guide/evals/concepts.ts"] }).cases.length, 0);
  for (const changedPaths of [["README.md"], ["components/portfolio/portfolio-assistant.css"], ["lib/portfolio-guide/evals/assertions.ts"], ["__tests__/portfolio-guide/evals.test.ts"]]) {
    assert.equal(selectEvalCases(portfolioGuideEvalCases, { changedPaths }).cases.length, 0);
  }
  assert.equal(selectEvalCases(portfolioGuideEvalCases, { changedPaths: ["lib/portfolio-guide/prompt.ts"] }).cases.length, 14);
  assert.equal(selectEvalCases(portfolioGuideEvalCases, { full: true }).cases.length, portfolioGuideEvalCases.length);
  assert.equal(selectEvalCases(portfolioGuideEvalCases, { filter: "checkout-mentions-mcp" }).cases.length, 1);
  assert.throws(() => selectEvalCases(portfolioGuideEvalCases, { filter: "not-a-case" }), /No eval cases/);
});

test("remote answering, routing, evidence, custom endpoints and grading require bounded opt-in", () => {
  for (const options of [{ providerMode: "openai" }, { providerMode: "local-answer-remote-judge" }, { decisions: true },
    { liveEvidence: true }, { assistantBaseUrl: "https://example.com/v1" }, { judgeBaseUrl: "https://example.com/v1" }]) {
    assert.throws(() => requireExplicitLive(options), /explicit --live/);
    assert.throws(() => requireExplicitLive({ ...options, live: true }), /max-cases/);
    assert.doesNotThrow(() => requireExplicitLive({ ...options, live: true, maxCases: 1, timeoutMs: 1000 }));
  }
  assert.doesNotThrow(() => requireExplicitLive({ assistantBaseUrl: "http://127.0.0.1:11434/v1" }));
  assert.equal(resolveEvalRunnerConfig({}, { NODE_ENV: "test" }).judge, undefined);
});

test("CLI rejects implicit paid runs before creating any client or output", () => {
  assert.throws(() => execFileSync(process.execPath, ["--import", "tsx", "scripts/run-portfolio-guide-evals.ts",
    "--provider-mode", "openai", "--filter", "checkout-mentions-mcp"], {
    env: { ...process.env, NODE_ENV: "production", OPENAI_API_KEY: "test-key-never-use", PORTFOLIO_GUIDE_EVAL_ASSISTANT_BASE_URL: "http://127.0.0.1:1/v1" },
    stdio: "pipe", timeout: 10000,
  }), /Remote eval dependencies require explicit/);
});

test("generation fingerprints include working sources but exclude assertions; cache rejects corruption", async () => {
  const root = await mkdtemp(join(tmpdir(), "portfolio-cache-"));
  try {
    await mkdir(join(root, "lib/evals"), { recursive: true });
    await writeFile(join(root, "lib/service.ts"), "source v1");
    await writeFile(join(root, "lib/evals/assertions.ts"), "grade v1");
    const before = fingerprintFiles(root, ["lib"]);
    await writeFile(join(root, "lib/evals/assertions.ts"), "grade v2");
    assert.equal(fingerprintFiles(root, ["lib"]), before);
    await writeFile(join(root, "lib/service.ts"), "source v2");
    assert.notEqual(fingerprintFiles(root, ["lib"]), before);
    const cache = new ArtifactCache<{ answer: string }>(join(root, "cache"), (v): v is { answer: string } => typeof (v as { answer?: unknown })?.answer === "string");
    const key = digest({ prompt: "v1", model: "weights1", sources: before });
    await cache.put(key, { answer: "frozen" });
    assert.deepEqual(await cache.get(key), { answer: "frozen" });
    for (const input of [{ prompt: "v2", model: "weights1", sources: before }, { prompt: "v1", model: "weights2", sources: before }, { prompt: "v1", model: "weights1", sources: "changed" }]) {
      assert.equal(await cache.get(digest(input)), undefined);
    }
    await writeFile(join(root, "cache", `${key}.json`), JSON.stringify({ key, hash: "wrong", value: { answer: "tampered" } }));
    assert.equal(await cache.get(key), undefined);
  } finally { await rm(root, { recursive: true, force: true }); }
});

const packet = () => makeReviewPacket("test", [{ id: "ownership", question: "Who implemented it?",
  rawAnswer: "Daniel solely implemented every component.", displayedAnswer: "Daniel solely implemented every component.",
  sources: [{ id: "page", text: "Daniel led product direction and partnered with engineering. Implementation ownership is not established." }],
  context: {}, deterministicFindings: [], generation: {} }]);
const review = (): NativeReview => ({ packetHash: packet().packetHash, rubricHash: packet().rubricHash, reviewer: "active-codex-chat", model: null, usage: null,
  cases: [{ id: "ownership", verdict: "fail", rationale: "Sole implementation overstates the supplied ownership evidence.", findings: [{ severity: "blocker", answerQuote: "solely implemented",
    sources: [{ id: "page", quote: "Implementation ownership is not established." }], rationale: "Product direction does not prove implementation ownership." }] }] });

test("native review requires exact packet, complete coverage, answer spans and source excerpts", () => {
  assert.equal(validateNativeReview(packet(), review()).cases[0].verdict, "fail");
  const stale = review(); stale.packetHash = "old";
  assert.throws(() => validateNativeReview(packet(), stale), /Stale review/);
  const wrongSource = review(); wrongSource.cases[0].findings[0].sources[0].quote = "He built everything.";
  assert.throws(() => validateNativeReview(packet(), wrongSource), /Unresolvable/);
  const wrongAnswer = review(); wrongAnswer.cases[0].findings[0].answerQuote = "not in the answer";
  assert.throws(() => validateNativeReview(packet(), wrongAnswer), /Unresolvable/);
  const missing = review(); missing.cases = [];
  assert.throws(() => validateNativeReview(packet(), missing), /every case/);
  const uncertain = review(); uncertain.cases[0] = { id: "ownership", verdict: "uncertain", rationale: "More direct evidence is needed.", findings: [] };
  assert.equal(validateNativeReview(packet(), uncertain).cases[0].verdict, "uncertain");
  const changed = packet(); changed.cases[0].displayedAnswer = "Different answer";
  assert.throws(() => validateNativeReview(changed, review()), /packet or rubric changed/);
});

test("local judge disagreement and uncertainty cannot fail a deterministic pass", async () => {
  const evalCase = { ...portfolioGuideEvalCases.find((c) => c.id === "checkout-mentions-mcp")!, deterministicChecks: undefined };
  for (const verdict of ["fail", "uncertain", "error"] as const) {
    const result = await runPortfolioGuideEvalSuite({ label: "test", cases: [evalCase],
      providerConfig: resolveEvalRunnerConfig({ providerMode: "local-answer-local-judge" }, { NODE_ENV: "test" }),
      runAssistant: async () => ({ promptInput: "{}", rawText: "No MCP mention.", relatedPages: [], response: { answer: "No MCP mention.", relatedPages: [] },
        provider: { label: "local-openai-compatible", model: "fake" }, normalizationStatus: "normalized-json" }),
      runJudge: async () => {
        if (verdict === "error") throw new Error("Malformed judge output");
        return { verdict, passed: false, summary: "Advisory", scores: { groundedness: 1, uncertaintyHandling: 1, sourceSeparation: 1, helpfulness: 1, concision: 1 }, strengths: [], issues: [], rawText: "{}" };
      },
    });
    assert.equal(result.summary.failed, 0);
    assert.equal(result.cases[0].qualityStatus, verdict === "fail" ? "advisory-fail" : verdict === "error" ? "evaluator-error" : "uncertain");
  }
  assert.throws(() => normalizeJudgeResult('{"verdict":"pass","summary":"OK","scores":{}}'), /Invalid judge score/);
});


