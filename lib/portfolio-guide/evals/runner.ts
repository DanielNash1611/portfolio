import {
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import { inferInterestTags } from "@/lib/portfolio-guide/infer-tags";
import type { PortfolioGuideGenerationResult } from "@/lib/portfolio-guide/service";
import type {
  CopilotRequest,
  PageContext,
  SessionContext,
} from "@/lib/portfolio-guide/types";
import { evaluateDeterministicChecks } from "@/lib/portfolio-guide/evals/assertions";
import type {
  PortfolioGuideEvalAssistant,
  PortfolioGuideEvalCase,
  PortfolioGuideEvalCaseResult,
  PortfolioGuideRecordedResponse,
  PortfolioGuideEvalRubricScores,
  PortfolioGuideEvalSuiteResult,
  PortfolioGuideEvalJudge,
} from "@/lib/portfolio-guide/evals/types";
import type { EvalResolvedConfig } from "@/lib/portfolio-guide/evals/config";

async function withEvalTimeout<T>(options: {
  timeoutMs: number;
  label: string;
  run: (signal: AbortSignal) => Promise<T>;
}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs);

  try {
    return await options.run(controller.signal);
  } catch (error) {
    if (
      controller.signal.aborted &&
      error instanceof Error &&
      /abort|aborted|timeout/i.test(error.message)
    ) {
      throw new Error(
        `${options.label} timed out after ${options.timeoutMs}ms.`,
      );
    }

    if (controller.signal.aborted) {
      throw new Error(
        `${options.label} timed out after ${options.timeoutMs}ms.`,
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function buildSessionContext(
  evalCase: PortfolioGuideEvalCase,
  pageContext: PageContext,
): SessionContext {
  const override = evalCase.sessionContext ?? {};
  const visitedPages = [
    ...new Set([...(override.visitedPages ?? []), pageContext.slug]),
  ];
  const askedQuestions = [
    ...(override.askedQuestions ?? []),
    evalCase.question,
  ];
  const inferredInterestTags = [
    ...new Set([
      ...(override.inferredInterestTags ?? []),
      ...inferInterestTags({
        pageContext,
        text: [evalCase.question, ...askedQuestions].join(" "),
      }),
    ]),
  ];

  return {
    visitedPages,
    clickedPrompts: override.clickedPrompts ?? [],
    askedQuestions,
    inferredInterestTags,
    visitorIntent: override.visitorIntent,
    recommendedPath: override.recommendedPath,
    lastVisitedAt: override.lastVisitedAt,
  };
}

export function buildRequestForEvalCase(
  evalCase: PortfolioGuideEvalCase,
): CopilotRequest {
  const pageContext = getPageContextBySlug(evalCase.pageSlug);
  if (!pageContext) {
    throw new Error(`Missing pageContext for eval case "${evalCase.id}".`);
  }

  return {
    message: evalCase.question,
    pageContext,
    portfolioContext: getPortfolioContext(),
    sessionContext: buildSessionContext(evalCase, pageContext),
    conversation: evalCase.priorConversation,
  };
}

function scoreAverage(
  cases: PortfolioGuideEvalCaseResult[],
): PortfolioGuideEvalRubricScores | undefined {
  const judgeResults = cases.map((item) => item.judge).filter(Boolean);
  if (judgeResults.length === 0) {
    return undefined;
  }

  const totals = judgeResults.reduce(
    (accumulator, judge) => ({
      groundedness: accumulator.groundedness + judge!.scores.groundedness,
      uncertaintyHandling:
        accumulator.uncertaintyHandling + judge!.scores.uncertaintyHandling,
      sourceSeparation:
        accumulator.sourceSeparation + judge!.scores.sourceSeparation,
      helpfulness: accumulator.helpfulness + judge!.scores.helpfulness,
      concision: accumulator.concision + judge!.scores.concision,
    }),
    {
      groundedness: 0,
      uncertaintyHandling: 0,
      sourceSeparation: 0,
      helpfulness: 0,
      concision: 0,
    },
  );
  const divisor = judgeResults.length;

  return {
    groundedness: Number((totals.groundedness / divisor).toFixed(2)),
    uncertaintyHandling: Number(
      (totals.uncertaintyHandling / divisor).toFixed(2),
    ),
    sourceSeparation: Number((totals.sourceSeparation / divisor).toFixed(2)),
    helpfulness: Number((totals.helpfulness / divisor).toFixed(2)),
    concision: Number((totals.concision / divisor).toFixed(2)),
  };
}

function minimumJudgeThresholds(
  evalCase: PortfolioGuideEvalCase,
): PortfolioGuideEvalRubricScores {
  const uncertaintyFloor = evalCase.answerability === "answerable" ? 3 : 4;
  const overrides = evalCase.judgeThresholds ?? {};

  return {
    groundedness: overrides.groundedness ?? 4,
    uncertaintyHandling: overrides.uncertaintyHandling ?? uncertaintyFloor,
    sourceSeparation: overrides.sourceSeparation ?? 4,
    helpfulness: overrides.helpfulness ?? 3,
    concision: overrides.concision ?? 3,
  };
}

function judgePassesThresholds(
  evalCase: PortfolioGuideEvalCase,
  judge: NonNullable<PortfolioGuideEvalCaseResult["judge"]>,
): boolean {
  const thresholds = minimumJudgeThresholds(evalCase);

  return (
    judge.scores.groundedness >= thresholds.groundedness &&
    judge.scores.uncertaintyHandling >= thresholds.uncertaintyHandling &&
    judge.scores.sourceSeparation >= thresholds.sourceSeparation &&
    judge.scores.helpfulness >= thresholds.helpfulness &&
    judge.scores.concision >= thresholds.concision &&
    judge.verdict === "pass"
  );
}

export async function runPortfolioGuideEvalSuite(config: {
  label: string;
  cases: PortfolioGuideEvalCase[];
  providerConfig: EvalResolvedConfig;
  runAssistant: PortfolioGuideEvalAssistant;
  runJudge?: PortfolioGuideEvalJudge;
}): Promise<PortfolioGuideEvalSuiteResult> {
  const results: PortfolioGuideEvalCaseResult[] = [];

  for (const evalCase of config.cases) {
    const request = buildRequestForEvalCase(evalCase);
    const providers = {
      mode: config.providerConfig.providerMode,
      assistant: {
        label: config.providerConfig.assistant.label,
        model: config.providerConfig.assistant.model,
        ...(config.providerConfig.assistant.baseURL
          ? { baseURL: config.providerConfig.assistant.baseURL }
          : {}),
      },
      ...(config.providerConfig.judge
        ? {
            judge: {
              label: config.providerConfig.judge.label,
              model: config.providerConfig.judge.model,
              ...(config.providerConfig.judge.baseURL
                ? { baseURL: config.providerConfig.judge.baseURL }
                : {}),
            },
          }
        : {}),
    };
    const failures: PortfolioGuideEvalCaseResult["failures"] = [];

    let generation: PortfolioGuideGenerationResult | undefined;
    try {
      generation = await withEvalTimeout({
        timeoutMs: config.providerConfig.timeouts.assistantMs,
        label: `Assistant for ${evalCase.id}`,
        run: (signal) => config.runAssistant({ evalCase, request, signal }),
      });
    } catch (error) {
      failures.push({
        stage: "assistant",
        message: error instanceof Error ? error.message : String(error),
      });
    }

    const deterministicChecks = generation
      ? evaluateDeterministicChecks(evalCase, generation.response)
      : [];
    const deterministicPassed =
      generation != null &&
      deterministicChecks
        .filter((check) => check.severity === "hard")
        .every((check) => check.passed);

    let judge: PortfolioGuideEvalCaseResult["judge"];
    if (generation && config.runJudge) {
      try {
        judge = await withEvalTimeout({
          timeoutMs: config.providerConfig.timeouts.judgeMs,
          label: `Judge for ${evalCase.id}`,
          run: (signal) =>
            config.runJudge!({ evalCase, request, generation, signal }),
        });
      } catch (error) {
        failures.push({
          stage: "judge",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }
    const judgePassed =
      generation != null && judge ? judgePassesThresholds(evalCase, judge) : !config.runJudge;

    results.push({
      evalCase,
      request,
      generation,
      deterministicChecks,
      judge,
      providers,
      failures,
      passed:
        failures.length === 0 &&
        deterministicPassed &&
        judgePassed,
    });
  }

  return {
    label: config.label,
    cases: results,
      summary: {
        total: results.length,
        passed: results.filter((result) => result.passed).length,
        failed: results.filter((result) => !result.passed).length,
        assistantFailures: results.filter((result) =>
        result.failures.some((failure) => failure.stage === "assistant"),
      ).length,
      deterministicFailures: results.filter((result) =>
        result.deterministicChecks.some(
          (check) => check.severity === "hard" && !check.passed,
        ),
      ).length,
      advisoryWarnings: results.filter((result) =>
        result.deterministicChecks.some(
          (check) => check.severity === "advisory" && !check.passed,
        ),
      ).length,
      judgeFailures: results.filter(
        (result) =>
          result.failures.some((failure) => failure.stage === "judge") ||
          (result.judge &&
            (!result.judge.passed ||
              !judgePassesThresholds(result.evalCase, result.judge))),
      ).length,
      averageScores: scoreAverage(results),
    },
  };
}

export function snapshotGeneration(
  caseId: string,
  result: Pick<
    PortfolioGuideEvalCaseResult,
    "request" | "generation" | "providers" | "failures"
  >,
) {
  return {
    caseId,
    request: result.request,
    generation: result.generation,
    providers: result.providers,
    failures: result.failures,
  };
}
