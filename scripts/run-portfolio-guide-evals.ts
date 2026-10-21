import { isCacheableGeneration } from "../lib/portfolio-guide/evals/cache";
import path from "node:path";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { portfolioGuideEvalCases } from "@/lib/portfolio-guide/evals/cases";
import { resolveEvalRunnerConfig } from "@/lib/portfolio-guide/evals/config";
import { loadPortfolioGuideEvalEnv } from "@/lib/portfolio-guide/evals/env";
import { verifyOpenAiCompatibleProvider } from "@/lib/portfolio-guide/evals/preflight";
import {
  createPortfolioGuideAssistant,
  createPortfolioGuideJudge,
} from "@/lib/portfolio-guide/evals/provider";
import {
  runPortfolioGuideEvalSuite,
  snapshotGeneration,
} from "@/lib/portfolio-guide/evals/runner";
import { PORTFOLIO_GUIDE_SYSTEM_PROMPT } from "@/lib/portfolio-guide/prompt";
import { selectEvalCases, requireExplicitLive } from "@/lib/portfolio-guide/evals/selection";
import { ArtifactCache, digest, fingerprintFiles } from "./lib/eval-artifacts";
import type { PortfolioGuideGenerationResult } from "@/lib/portfolio-guide/service";
import type {
  PortfolioGuideEvalCaseResult,
  PortfolioGuideEvalSuiteResult,
} from "@/lib/portfolio-guide/evals/types";

function timestampLabel(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function formatScores(result: PortfolioGuideEvalCaseResult): string {
  if (!result.judge) {
    return "deterministic scoring; model-generated answer";
  }

  const {
    groundedness,
    uncertaintyHandling,
    sourceSeparation,
    helpfulness,
    concision,
  } = result.judge.scores;

  return `G:${groundedness} U:${uncertaintyHandling} S:${sourceSeparation} H:${helpfulness} C:${concision}`;
}

function renderCaseTranscript(result: PortfolioGuideEvalCaseResult): string {
  const failedChecks = result.deterministicChecks.filter(
    (check) => check.severity === "hard" && !check.passed,
  );
  const advisoryWarnings = result.deterministicChecks.filter(
    (check) => check.severity === "advisory" && !check.passed,
  );
  const failureLines =
    result.failures.length > 0
      ? result.failures
          .map((failure) => `- ${failure.stage}: ${failure.message}`)
          .join("\n")
      : "- none";

  return `# ${result.evalCase.title}

- Case ID: \`${result.evalCase.id}\`
- Status: ${result.passed ? "PASS" : "FAIL"}
- Execution: ${result.execution?.kind ?? "unknown"}
- Quality: ${result.qualityStatus ?? "not-reviewed"} (local judge is advisory)
- Category: \`${result.evalCase.category}\`
- Page: \`${result.request.pageContext.href}\`

## Providers

- Mode: \`${result.providers.mode}\`
- Assistant: \`${result.providers.assistant.label}\` / \`${result.providers.assistant.model}\`${result.providers.assistant.baseURL ? ` / ${result.providers.assistant.baseURL}` : ""}
${result.providers.judge ? `- Judge: \`${result.providers.judge.label}\` / \`${result.providers.judge.model}\`${result.providers.judge.baseURL ? ` / ${result.providers.judge.baseURL}` : ""}` : "- Judge: disabled"}

## What This Tests

${result.evalCase.summary}

## Question

${result.request.message}

## Prior Conversation

\`\`\`json
${JSON.stringify(result.request.conversation ?? [], null, 2)}
\`\`\`

## Request

\`\`\`json
${JSON.stringify(result.request, null, 2)}
\`\`\`

## Prompt Input

\`\`\`json
${result.generation?.promptInput ?? "<assistant failed before prompt execution finished>"}
\`\`\`

## Raw Model Output

\`\`\`text
${result.generation?.rawText ?? "<no model output>"}
\`\`\`

## Normalized Response

\`\`\`json
${JSON.stringify(result.generation?.response ?? null, null, 2)}
\`\`\`

## Response Metadata

- Normalization: ${result.generation?.normalizationStatus ?? "not available"}

## Deterministic Checks

${
  result.deterministicChecks.length > 0
    ? result.deterministicChecks
        .map(
          (check) =>
            `- ${check.passed ? "PASS" : "FAIL"}${check.severity === "advisory" ? " [ADVISORY]" : ""} ${check.label}${
              check.details ? ` — ${check.details}` : ""
            }`,
        )
        .join("\n")
    : "- not run"
}

## Judge

${
  result.judge
    ? `- Verdict: ${result.judge.verdict.toUpperCase()}
- Scores: ${formatScores(result)}
- Summary: ${result.judge.summary}
${result.judge.issues.length > 0 ? `- Issues: ${result.judge.issues.join(" | ")}` : "- Issues: none"}`
    : "- Judge disabled"
}

## Failures To Review

${
  result.failures.length > 0
    ? failureLines
    : failedChecks.length > 0
      ? failedChecks.map((check) => `- ${check.label}`).join("\n")
      : result.judge && !result.judge.passed
        ? result.judge.issues.map((issue) => `- ${issue}`).join("\n")
        : advisoryWarnings.length > 0
          ? advisoryWarnings
              .map((check) => `- [advisory] ${check.label}`)
              .join("\n")
          : "- none"
}
`;
}

function renderMarkdownReport(result: PortfolioGuideEvalSuiteResult): string {
  const averageScores = result.summary.averageScores;

  return `# Portfolio Guide Eval Report

- Label: \`${result.label}\`
- Total cases: ${result.summary.total}
- Passed: ${result.summary.passed}
- Failed: ${result.summary.failed}
- Assistant failures: ${result.summary.assistantFailures}
- Deterministic failures: ${result.summary.deterministicFailures}
- Advisory warnings: ${result.summary.advisoryWarnings}
- Judge failures: ${result.summary.judgeFailures}
- Fresh generations: ${result.cases.filter((c) => c.execution?.kind === "fresh").length}
- Reused generations: ${result.cases.filter((c) => c.execution?.kind === "cache").length}
- Model requests this run: ${result.cases.reduce((n, c) => n + (c.execution?.modelCalls ?? 0), 0)}
- Scope: one run only; cached answers are not fresh sampling. Codex quality review is separate.
${averageScores ? `- Average scores: groundedness ${averageScores.groundedness}, uncertainty ${averageScores.uncertaintyHandling}, source separation ${averageScores.sourceSeparation}, helpfulness ${averageScores.helpfulness}, concision ${averageScores.concision}` : ""}

## Case Summary

${result.cases
  .map(
    (caseResult) =>
      `- ${caseResult.passed ? "PASS" : "FAIL"} \`${caseResult.evalCase.id}\` — ${caseResult.evalCase.summary}`,
  )
  .join("\n")}
`;
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      filter: { type: "string" },
      label: { type: "string" },
      "provider-mode": { type: "string" },
      "assistant-base-url": { type: "string" },
      "assistant-api-key": { type: "string" },
      "assistant-model": { type: "string" },
      "assistant-timeout-ms": { type: "string" },
      "judge-base-url": { type: "string" },
      "judge-api-key": { type: "string" },
      "judge-model": { type: "string" },
      "judge-timeout-ms": { type: "string" },
      "prompt-file": { type: "string" },
      "output-dir": { type: "string" },
      "no-judge": { type: "boolean" },
      smoke: { type: "boolean" },
      decisions: { type: "boolean" },
      retrieval: { type: "boolean" },
      full: { type: "boolean" },
      changed: { type: "boolean" },
      "changed-files": { type: "string" },
      live: { type: "boolean" },
      "live-evidence": { type: "boolean" },
      "max-cases": { type: "string" },
      fresh: { type: "boolean" },
      "cache-dir": { type: "string" },
    },
    allowPositionals: false,
  });

  const maxCases = values["max-cases"] === undefined ? undefined : Number(values["max-cases"]);
  if (maxCases !== undefined && (!Number.isInteger(maxCases) || maxCases < 1)) throw new Error("--max-cases must be a positive integer.");
  // Do not let credentials or env defaults silently turn a coding loop into a paid run.
  requireExplicitLive({ live: values.live, decisions: values.decisions, liveEvidence: values["live-evidence"],
    providerMode: values["provider-mode"] ?? process.env.PORTFOLIO_GUIDE_EVAL_PROVIDER_MODE,
    assistantBaseUrl: values["assistant-base-url"] ?? process.env.PORTFOLIO_GUIDE_EVAL_ASSISTANT_BASE_URL,
    judgeBaseUrl: values["judge-base-url"] ?? process.env.PORTFOLIO_GUIDE_EVAL_JUDGE_BASE_URL,
    maxCases, timeoutMs: Number(values["assistant-timeout-ms"]) });
  const envLoad = values.live ? loadPortfolioGuideEvalEnv() : { loaded: false, nodeEnv: process.env.NODE_ENV ?? "development" };
  const changedPaths = values["changed-files"]?.split(",").map((s) => s.trim()).filter(Boolean) ?? [
    ...execFileSync("git", ["diff", "--name-only", "HEAD"], { encoding: "utf8" }).trim().split("\n"),
    ...execFileSync("git", ["ls-files", "--others", "--exclude-standard"], { encoding: "utf8" }).trim().split("\n"),
  ];
  const selection = selectEvalCases(portfolioGuideEvalCases, { filter: values.filter, smoke: values.smoke,
    full: values.full, changedPaths });
  console.log(`Selection: ${selection.reason} (${selection.cases.length} cases)`);
  if (!selection.cases.length) return;
  if (maxCases !== undefined && selection.cases.length > maxCases) throw new Error("Selected cases exceed --max-cases; narrow --filter. No requests were started.");

  const providerConfig = resolveEvalRunnerConfig({
    providerMode: values["provider-mode"],
    assistantBaseUrl: values["assistant-base-url"],
    assistantApiKey: values["assistant-api-key"],
    assistantModel: values["assistant-model"],
    assistantTimeoutMs: values["assistant-timeout-ms"]
      ? Number(values["assistant-timeout-ms"])
      : undefined,
    judgeBaseUrl: values["judge-base-url"],
    judgeApiKey: values["judge-api-key"],
    judgeModel: values["judge-model"],
    judgeTimeoutMs: values["judge-timeout-ms"]
      ? Number(values["judge-timeout-ms"])
      : undefined,
    noJudge: values["no-judge"] ?? false,
  });

  if (values.decisions && !process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required when --decisions is enabled.");
  }

  if (values["live-evidence"] && !values.retrieval) throw new Error("--live-evidence requires --retrieval.");

  if (providerConfig.assistant.label === "local-openai-compatible") {
    const assistantPreflight = await verifyOpenAiCompatibleProvider(
      providerConfig.assistant,
    );
    console.log(
      `Assistant local preflight OK (${assistantPreflight.availableModels.length} models at ${providerConfig.assistant.baseURL})`,
    );
  }

  if (providerConfig.judge?.label === "local-openai-compatible") {
    const judgePreflight = await verifyOpenAiCompatibleProvider(
      providerConfig.judge,
    );
    console.log(
      `Judge local preflight OK (${judgePreflight.availableModels.length} models at ${providerConfig.judge.baseURL})`,
    );
  }
  const label =
    values.label ??
    `${providerConfig.providerMode}-${providerConfig.assistant.model.replace(/[/:]/g, "-")}`;
  const outputDir = path.resolve(
    values["output-dir"] ??
      path.join(
        "artifacts",
        "portfolio-guide-evals",
        `${timestampLabel()}-${label}`,
      ),
  );
  if (existsSync(outputDir)) throw new Error("Eval output already exists. Choose a new output directory; runs are immutable.");
  const promptFile = values["prompt-file"];
  const systemPrompt = promptFile
    ? await readFile(path.resolve(promptFile), "utf8")
    : PORTFOLIO_GUIDE_SYSTEM_PROMPT;
  const cases = selection.cases;
  const dependencies = fingerprintFiles(process.cwd(), ["lib/portfolio-guide", "lib/search", "content", "evals/integration",
    "lib/portfolio-guide/evals/provider.ts", "package-lock.json"]);
  let modelIdentity: string | undefined;
  // Mutable Ollama tags are cacheable only when their weight digest is discoverable.
  if (providerConfig.assistant.label === "local-openai-compatible") {
    try {
      const url = new URL("/api/tags", providerConfig.assistant.baseURL);
      const tags = await fetch(url, { signal: AbortSignal.timeout(3000) }).then((r) => r.json());
      modelIdentity = tags.models?.find((m: { name: string; digest: string }) => m.name === providerConfig.assistant.model)?.digest;
    } catch { /* Unknown model revision disables reuse. */ }
  }
  const cacheEnabled = Boolean(modelIdentity) && !values.live && !values.fresh;
  const cache = new ArtifactCache<PortfolioGuideGenerationResult>(path.resolve(values["cache-dir"] ?? "artifacts/eval-cache/generations"), isCacheableGeneration);
  const assistant = createPortfolioGuideAssistant({ ...providerConfig.assistant, systemPrompt,
    retrievalEnabled: values.retrieval ?? false, live: values.live ?? false, liveEvidence: values["live-evidence"] ?? false,
    ...(values.decisions ? { decisions: { enabled: true, apiKey: process.env.OPENAI_API_KEY! } } : {}) });
  let active: { started: number; kind: "fresh" | "cache"; key: string; modelCalls: number } | undefined;
  const originalFetch = globalThis.fetch;
  const localOrigins = new Set([providerConfig.assistant.baseURL, providerConfig.judge?.baseURL]
    .filter((url): url is string => Boolean(url)).map((url) => new URL(url).origin));
  globalThis.fetch = async (input, init) => {
    const url = String(input instanceof Request ? input.url : input);
    if (!values.live && !localOrigins.has(new URL(url).origin)) {
      throw new Error("Local eval blocked an unexpected network dependency. Use a separately bounded --live run.");
    }
    if (active && /\/(?:responses|embeddings|chat\/completions|decisions)(?:\?|$)/.test(url)) active.modelCalls++;
    return originalFetch(input, init);
  };
  const startedAt = new Date().toISOString();
  let suiteResult: PortfolioGuideEvalSuiteResult;
  try {
    suiteResult = await runPortfolioGuideEvalSuite({
    label,
    cases,
    providerConfig,
    runAssistant: async (input) => {
      const key = digest({ version: 1, request: input.request, systemPrompt, dependencies, modelIdentity,
        assistant: { label: providerConfig.assistant.label, model: providerConfig.assistant.model, baseURL: providerConfig.assistant.baseURL },
        retrieval: values.retrieval ?? false, evidence: "frozen-public" });
      active = { started: Date.now(), kind: "fresh", key, modelCalls: 0 };
      const previous = cacheEnabled ? await cache.get(key) : undefined;
      if (previous) { active.kind = "cache"; return previous; }
      const generation = await assistant(input);
      if (modelIdentity && !values.live) await cache.put(key, generation);
      return generation;
    },
    onCaseComplete: (result) => {
      if (active) result.execution = { kind: active.kind, durationMs: Date.now() - active.started,
        cacheKey: active.key, modelCalls: active.modelCalls, retries: 0,
        usage: active.kind === "fresh" ? result.generation?.usage ?? null : null };
    },
    runJudge: providerConfig.judge
      ? createPortfolioGuideJudge(providerConfig.judge)
      : undefined,
    });
  } finally { globalThis.fetch = originalFetch; }

  await mkdir(outputDir, { recursive: true });
  await mkdir(path.join(outputDir, "transcripts"), { recursive: true });
  await writeFile(path.join(outputDir, "run-manifest.json"), JSON.stringify({ schemaVersion: 2, startedAt,
    selection: { reason: selection.reason, cases: cases.map((c) => c.id) }, dependencies, modelIdentity: modelIdentity ?? null,
    cacheEnabled, live: values.live ?? false, retrieval: values.retrieval ? (values.live ? "live" : "frozen-public-lexical") : "page-context",
    cases: suiteResult.cases.map((c) => ({ id: c.evalCase.id, execution: c.execution, qualityStatus: c.qualityStatus })),
    note: "Single run. Reused answers are not fresh sampling; local judges are advisory; native Codex review is separate." }, null, 2));

  await Promise.all(
    suiteResult.cases.map(async (caseResult) => {
      const transcriptPath = path.join(
        outputDir,
        "transcripts",
        `${caseResult.evalCase.id}.md`,
      );
      const snapshotPath = path.join(
        outputDir,
        "transcripts",
        `${caseResult.evalCase.id}.json`,
      );

      await writeFile(transcriptPath, renderCaseTranscript(caseResult), "utf8");
      await writeFile(
        snapshotPath,
        JSON.stringify(
          snapshotGeneration(caseResult.evalCase.id, caseResult),
          null,
          2,
        ),
        "utf8",
      );
    }),
  );

  await writeFile(
    path.join(outputDir, "results.json"),
    JSON.stringify(suiteResult, null, 2),
    "utf8",
  );
  await writeFile(
    path.join(outputDir, "report.md"),
    renderMarkdownReport(suiteResult),
    "utf8",
  );

  console.log(
    `Environment: NODE_ENV=${envLoad.nodeEnv}${envLoad.loaded ? " (.env.local enabled)" : " (using runtime environment only)"}`,
  );
  console.log(
    `Portfolio Guide evals: ${suiteResult.summary.passed}/${suiteResult.summary.total} passed`,
  );
  console.log(`Output: ${outputDir}`);

  suiteResult.cases.forEach((caseResult) => {
    console.log(
      `${caseResult.passed ? "PASS" : "FAIL"} ${caseResult.evalCase.id} :: ${formatScores(caseResult)}`,
    );
  });

  if (suiteResult.summary.failed > 0) {
    process.exitCode = 1;
  } else if (suiteResult.cases.some((c) => c.qualityStatus === "evaluator-error")) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
