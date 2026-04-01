import OpenAI from "openai";
import { extractResponseText } from "@/lib/portfolio-guide/prompt";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";
import type { PortfolioGuideGenerationResult } from "@/lib/portfolio-guide/service";
import type {
  PortfolioGuideEvalCase,
  PortfolioGuideEvalJudge,
  PortfolioGuideEvalJudgeResult,
  PortfolioGuideEvalRubricScores,
} from "@/lib/portfolio-guide/evals/types";

const EVAL_JUDGE_SYSTEM_PROMPT = `You are a strict evaluator for a portfolio site assistant.

Use only the structured inputs provided in the prompt. Do not use outside knowledge.

Evaluation rules:
- "This page" means the current pageContext only.
- portfolioContext, sessionContext, and candidate related pages may help with framing or recommendations, but they are not current-page evidence unless explicitly labeled as broader context.
- If portfolioContext.portfolioSubject identifies the portfolio owner, using that person's name as shorthand for the first-person portfolio subject is allowed and is not by itself a hallucination.
- However, portfolio-subject identity is not proof of sole ownership, sole authorship, or end-to-end execution. Fail groundedness when the answer turns the subject's name into stronger responsibility claims than the page supports.
- Prior assistant messages are never evidence. If the answer repeats unsupported detail from earlier assistant turns, that is a failure.
- Fail groundedness when the answer states unsupported facts, metrics, ownership, timelines, or term mentions.
- Fail source separation when the answer blends other pages, session memory, or contaminated history into current-page fact.
- For next-read answers, it is acceptable to recommend pages from candidateRelatedPages or portfolioContext, but the answer should not add extra factual claims about those target pages unless they are already present in the structured input.
- Reward useful, concise answers that say what is explicit and what is not.

Score each dimension from 1 to 5, where 5 is best.

Return strict JSON:
{
  "verdict": "pass" | "fail",
  "summary": "string",
  "scores": {
    "groundedness": 1,
    "uncertaintyHandling": 1,
    "sourceSeparation": 1,
    "helpfulness": 1,
    "concision": 1
  },
  "strengths": ["string"],
  "issues": ["string"]
}`;

function sanitizeJsonCandidate(input: string): string {
  const withoutFences = input
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = withoutFences.indexOf("{");
  const lastBrace = withoutFences.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return withoutFences;
  }

  return withoutFences.slice(firstBrace, lastBrace + 1);
}

function clampScore(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(1, Math.min(5, Math.round(value)))
    : 1;
}

function uniqueStrings(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return [...new Set(input)]
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function normalizeJudgeResult(rawText: string): PortfolioGuideEvalJudgeResult {
  const parsed = JSON.parse(sanitizeJsonCandidate(rawText)) as {
    verdict?: unknown;
    summary?: unknown;
    scores?: Partial<Record<keyof PortfolioGuideEvalRubricScores, unknown>>;
    strengths?: unknown;
    issues?: unknown;
  };

  const scores: PortfolioGuideEvalRubricScores = {
    groundedness: clampScore(parsed.scores?.groundedness),
    uncertaintyHandling: clampScore(parsed.scores?.uncertaintyHandling),
    sourceSeparation: clampScore(parsed.scores?.sourceSeparation),
    helpfulness: clampScore(parsed.scores?.helpfulness),
    concision: clampScore(parsed.scores?.concision),
  };
  const verdict = parsed.verdict === "pass" ? "pass" : "fail";

  return {
    passed: verdict === "pass",
    verdict,
    summary:
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : "No summary returned.",
    scores,
    strengths: uniqueStrings(parsed.strengths),
    issues: uniqueStrings(parsed.issues),
    rawText,
  };
}

function buildJudgeInput(
  evalCase: PortfolioGuideEvalCase,
  request: CopilotRequest,
  generation: PortfolioGuideGenerationResult,
): string {
  return JSON.stringify(
    {
      caseId: evalCase.id,
      caseTitle: evalCase.title,
      caseSummary: evalCase.summary,
      category: evalCase.category,
      answerability: evalCase.answerability,
      judgeExpectations: evalCase.judgeExpectations,
      currentQuestion: request.message,
      pageContext: request.pageContext,
      portfolioContext: request.portfolioContext,
      sessionContext: request.sessionContext,
      recentConversation: request.conversation ?? [],
      modelResponse: generation.response,
      candidateRelatedPages: generation.relatedPages,
    },
    null,
    2,
  );
}

export function createOpenAiPortfolioGuideJudge(config: {
  apiKey: string;
  model: string;
  providerLabel?: string;
  baseURL?: string;
  client?: OpenAI;
}): PortfolioGuideEvalJudge {
  const client =
    config.client ??
    new OpenAI({
      apiKey: config.apiKey,
      ...(config.baseURL ? { baseURL: config.baseURL } : {}),
    });

  return async ({ evalCase, request, generation, signal }) => {
    const response = await client.responses.create({
      model: config.model,
      reasoning: { effort: "low" },
      input: [
        { role: "system", content: EVAL_JUDGE_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildJudgeInput(evalCase, request, generation),
        },
      ],
    }, signal ? { signal } : undefined);

    const rawText = extractResponseText(response);

    if (!rawText.trim()) {
      throw new Error("Eval judge returned no output.");
    }

    return normalizeJudgeResult(rawText);
  };
}
