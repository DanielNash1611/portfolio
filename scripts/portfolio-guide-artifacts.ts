import { readFile, writeFile } from "node:fs/promises";
import { statSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { portfolioGuideEvalCases } from "../lib/portfolio-guide/evals/cases";
import { evaluateDeterministicChecks } from "../lib/portfolio-guide/evals/assertions";
import { buildJudgeInput } from "../lib/portfolio-guide/evals/judge";
import type { PortfolioGuideEvalSuiteResult, PortfolioGuideEvalCaseResult } from "../lib/portfolio-guide/evals/types";
import { digest, makeReviewPacket, validateNativeReview, reviewPrompt, writeJson, type ReviewCase } from "./lib/eval-artifacts";

export function packetCase(record: PortfolioGuideEvalCaseResult): ReviewCase {
  const { generation, request } = record;
  const evalCase = portfolioGuideEvalCases.find((c) => c.id === record.evalCase.id);
  if (!evalCase || evalCase.question !== request.message) throw new Error("Captured case is missing or its question changed.");
  const context = generation ? JSON.parse(buildJudgeInput(evalCase, request, generation)) : { request };
  const { untrustedPriorConversation } = context;
  const sourceContext = Object.fromEntries(["pageContext", "portfolioContext", "retrievalContext", "additionalCanonicalPages", "approvedCareerRecords", "candidateRelatedPages"]
    .filter((key) => context[key] !== undefined).map((key) => [key, context[key]]));
  if (context.retrievalContext) sourceContext.retrievalContext = { ...context.retrievalContext, sources: undefined };
  let prompt: Record<string, unknown> = {};
  try { prompt = JSON.parse(generation?.promptInput ?? "{}"); } catch {}
  const canonical = Array.isArray(prompt.canonicalSources) ? prompt.canonicalSources : [];
  const approvedBlocks = Array.isArray(prompt.approvedBlocks) ? prompt.approvedBlocks : [];
  const sources = [
    // Keep all source containers and attribution boundaries, excluding the answer/history.
    { id: "provided-source-context", text: JSON.stringify(sourceContext, null, 2) },
    ...approvedBlocks.map((block: { id: string }) => ({ id: block.id, text: JSON.stringify(block, null, 2) })),
    ...canonical.map((source: { id: string; text?: string }) => ({ id: source.id, text: source.text ?? JSON.stringify(source) })),
    ...(context.retrievalContext?.sources ?? []).map((source: { id: string; text: string }) => ({ id: source.id, text: source.text })),
  ];
  return {
    id: evalCase.id, question: request.message, rawAnswer: generation?.rawText ?? "",
    displayedAnswer: generation?.response.answer ?? "",
    sources, context: { untrustedPriorConversation, requestedScope: (request as typeof request & { scope?: string }).scope ?? "page", capturedInputHash: digest(generation?.promptInput ?? null),
      expectations: evalCase.judgeExpectations, sourceCompleteness: generation ? "captured" : "missing-assistant-output" },
    deterministicFindings: generation ? evaluateDeterministicChecks(evalCase, generation.response) : [],
    generation: { providers: record.providers, execution: record.execution ?? { kind: "legacy-capture", usage: null }, failures: record.failures },
  };
}

export function replaySuite(suite: PortfolioGuideEvalSuiteResult) {
  const cases = suite.cases.map((record) => {
    const current = portfolioGuideEvalCases.find((c) => c.id === record.evalCase.id);
    if (!current || current.question !== record.request.message) throw new Error(`Case missing or question changed: ${record.evalCase.id}`);
    const checks = record.generation ? evaluateDeterministicChecks(current, record.generation.response) : [];
    return { id: current.id, checks, passed: Boolean(record.generation) && checks.filter((c) => c.severity === "hard").every((c) => c.passed),
      execution: "replay", qualityStatus: "not-reviewed" };
  });
  return { schemaVersion: 1, mode: "offline-recorded-answer-replay", modelCalls: 0, sourceHash: digest(suite),
    note: "Current assertions on frozen displayed answers. Does not exercise changed prompts, retrieval or guardrail implementation. Original run is unchanged.",
    total: cases.length, passed: cases.filter((c) => c.passed).length, cases };
}

async function main() {
  const { values } = parseArgs({ options: { from: { type: "string" }, replay: { type: "boolean" }, review: { type: "boolean" },
    "validate-review": { type: "string" }, "output-dir": { type: "string" }, filter: { type: "string" } } });
  if (!values.from) throw new Error("--from RUN_DIRECTORY or results.json is required. This command never generates answers.");
  const inputPath = resolve(values.from);
  const output = resolve(values["output-dir"] ?? join("artifacts/portfolio-guide-reviews", new Date().toISOString().replace(/[:.]/g, "-")));
  const sourceFile = statSync(inputPath).isDirectory() ? join(inputPath, "results.json") : inputPath;
  const suite: PortfolioGuideEvalSuiteResult = JSON.parse(await readFile(sourceFile, "utf8"));
  if (!Array.isArray(suite.cases) || !suite.cases.length || suite.cases.some((c) => !c.evalCase || !c.request)) throw new Error("Expected a captured guide results.json.");
  if (values.filter) suite.cases = suite.cases.filter((c) => values.filter!.split(",").some((s) => c.evalCase.id.includes(s.trim())));
  if (!suite.cases.length) throw new Error("No matching captured cases.");
  if (values.replay) {
    const report = replaySuite(suite);
    await writeJson(join(output, "replay.json"), report);
    console.log(`Recorded-answer checks: ${report.passed}/${report.total}; model calls: 0; ${output}`);
    if (report.passed !== report.total) process.exitCode = 1;
    return;
  }
  const packet = makeReviewPacket("portfolio-guide", suite.cases.map(packetCase));
  if (values["validate-review"]) {
    const review = validateNativeReview(packet, JSON.parse(await readFile(resolve(values["validate-review"]), "utf8")));
    console.log(JSON.stringify({ valid: true, packetHash: packet.packetHash, mode: packet.reviewMode,
      judgments: review.cases.map((c) => ({ id: c.id, verdict: c.verdict })), note: "Excerpt/schema validity does not establish semantic or human calibration." }, null, 2));
    return;
  }
  await writeJson(join(output, "review-packet.json"), packet);
  await writeFile(join(output, "review-prompt.md"), reviewPrompt(packet), { flag: "wx" });
  console.log(`Review packet: ${join(output, "review-packet.json")}\nInstructions: ${join(output, "review-prompt.md")}\nReview in the active Codex chat; no model runner was launched.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
