import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { portfolioGuideEvalCases } from "@/lib/portfolio-guide/evals/cases";
import {
  resolveEvalRunnerConfig,
} from "@/lib/portfolio-guide/evals/config";
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
import type {
  PortfolioGuideEvalCaseResult,
  PortfolioGuideEvalSuiteResult,
} from "@/lib/portfolio-guide/evals/types";

const PORTFOLIO_GUIDE_SMOKE_CASE_IDS = new Set([
  "checkout-mentions-mcp",
  "ai-platform-most-reused-patterns",
  "ai-platform-contaminated-history",
  "ai-platform-seniority",
  "ai-platform-implied-not-proven",
  "ai-platform-connections",
  "checkout-cross-page-dau",
  "jira-evidence",
  "jira-next-read",
]);

function timestampLabel(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function formatScores(result: PortfolioGuideEvalCaseResult): string {
  if (!result.judge) {
    return "deterministic-only";
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

${result.deterministicChecks.length > 0
  ? result.deterministicChecks
      .map(
        (check) =>
          `- ${check.passed ? "PASS" : "FAIL"}${check.severity === "advisory" ? " [ADVISORY]" : ""} ${check.label}${
            check.details ? ` — ${check.details}` : ""
          }`,
      )
      .join("\n")
  : "- not run"}

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
  const envLoad = loadPortfolioGuideEvalEnv();
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
    },
    allowPositionals: false,
  });

  const providerConfig = resolveEvalRunnerConfig({
    providerMode: values["provider-mode"],
    assistantBaseUrl: values["assistant-base-url"],
    assistantApiKey: values["assistant-api-key"],
    assistantModel: values["assistant-model"],
    assistantTimeoutMs: values["assistant-timeout-ms"]
      ? Number.parseInt(values["assistant-timeout-ms"], 10)
      : undefined,
    judgeBaseUrl: values["judge-base-url"],
    judgeApiKey: values["judge-api-key"],
    judgeModel: values["judge-model"],
    judgeTimeoutMs: values["judge-timeout-ms"]
      ? Number.parseInt(values["judge-timeout-ms"], 10)
      : undefined,
    noJudge: values["no-judge"] ?? false,
  });

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
  const promptFile = values["prompt-file"];
  const systemPrompt = promptFile
    ? await readFile(path.resolve(promptFile), "utf8")
    : PORTFOLIO_GUIDE_SYSTEM_PROMPT;
  const cases = portfolioGuideEvalCases.filter((evalCase) => {
    if (values.smoke && !PORTFOLIO_GUIDE_SMOKE_CASE_IDS.has(evalCase.id)) {
      return false;
    }

    if (!values.filter) {
      return true;
    }

    return `${evalCase.id} ${evalCase.title} ${evalCase.summary}`
      .toLowerCase()
      .includes(values.filter.toLowerCase());
  });

  if (cases.length === 0) {
    throw new Error("No eval cases matched the requested filter.");
  }

  const suiteResult = await runPortfolioGuideEvalSuite({
    label,
    cases,
    providerConfig,
    runAssistant: createPortfolioGuideAssistant({
      ...providerConfig.assistant,
      systemPrompt,
    }),
    runJudge: providerConfig.judge
      ? createPortfolioGuideJudge(providerConfig.judge)
      : undefined,
  });

  await mkdir(outputDir, { recursive: true });
  await mkdir(path.join(outputDir, "transcripts"), { recursive: true });

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
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
