import { createHash } from "node:crypto";
import type OpenAI from "openai";
import { getAllCanonicalPageContexts } from "@/lib/portfolio-guide/context";
import { INTEREST_TAGS } from "@/lib/portfolio-guide/constants";
import {
  routePortfolioQuestion,
  shouldRouteQuestion,
} from "@/lib/portfolio-guide/decisions";
import { extractResponseText } from "@/lib/portfolio-guide/prompt";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import type { PortfolioGuideGenerationResult } from "@/lib/portfolio-guide/service";
import type { CopilotRequest, InterestTag } from "@/lib/portfolio-guide/types";
import { createEvaluationBudgetGuard } from "./budget";
import type { EvaluationApproval, EvaluationBudgetSnapshot } from "./budget";

export type CanaryPacket = {
  models: { proposedAnswer: string; router: string; judge: string };
  sources: unknown;
  cases: Array<{
    evalCase: { id: string; judgeExpectations: string[] };
    request: CopilotRequest;
  }>;
  routingCases: Array<{
    id: string;
    question: string;
    route: boolean;
    topics?: InterestTag[];
  }>;
};
export type CanaryApproval = EvaluationApproval & {
  targetModelConfirmed: boolean;
  tokenCountingPricingVerified: boolean;
  tokenCountingChargeUsd: number;
};
export type CanaryJournal = {
  /** Must atomically refuse a previously claimed run. */
  claim: (scopeSha256: string, mode: "dry-run" | "live") => void;
  budget: (state: EvaluationBudgetSnapshot) => void;
  result: (name: string, value: unknown) => void;
};
const hash = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

function pairedSources(a: string, b: string) {
  const left = JSON.parse(a);
  const right = JSON.parse(b);
  const shared: Record<string, unknown> = {};
  const overridesA: Record<string, unknown> = {};
  const overridesB: Record<string, unknown> = {};
  for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
    if (JSON.stringify(left[key]) === JSON.stringify(right[key]))
      shared[key] = left[key];
    else {
      overridesA[key] = left[key];
      overridesB[key] = right[key];
    }
  }
  return { shared, overridesA, overridesB };
}

/** A bounded evaluation adapter. Dry-run uses fixtures exclusively and never reads a key. */
export async function runGuardedCanary(options: {
  packet: CanaryPacket;
  scopeSha256: string;
  approval: CanaryApproval;
  dryRun: boolean;
  apiKey?: string;
  journal: CanaryJournal;
  transport?: typeof fetch;
}) {
  const { packet, dryRun, journal } = options;
  if (
    packet.cases.length !== 6 ||
    packet.routingCases.length !== 32 ||
    new Set(packet.cases.map((c) => c.evalCase.id)).size !== 6
  )
    throw new Error(
      "Frozen canary must contain exactly six scenarios and 32 routing cases.",
    );
  if (packet.cases.filter((c) => shouldRouteQuestion(c.request)).length !== 4)
    throw new Error(
      "Canary requires four routed scenarios and two direct-question controls.",
    );
  if (
    packet.models.proposedAnswer !== "gpt-5.6-terra" ||
    packet.models.router !== "gpt-6-luna" ||
    packet.models.judge !== "gpt-6.1-sol"
  )
    throw new Error("Model change requires a revised verified budget policy.");
  if (hash(packet.sources) !== hash(getAllCanonicalPageContexts()))
    throw new Error(
      "Current public source bundle differs from the frozen packet.",
    );
  if (
    !dryRun &&
    (options.approval.approved !== true ||
      options.approval.pricingVerified !== true ||
      options.approval.targetModelConfirmed !== true ||
      options.approval.tokenCountingPricingVerified !== true ||
      options.approval.tokenCountingChargeUsd !== 0 ||
      options.approval.scopeSha256 !== options.scopeSha256 ||
      !options.apiKey)
  )
    throw new Error(
      "Live run requires confirmed model, verified generation/counting prices, matching scope and existing API access.",
    );
  journal.claim(options.scopeSha256, dryRun ? "dry-run" : "live");
  const rawFetch = options.transport ?? fetch;
  let countCalls = 0;
  const fixtureFetch: typeof fetch = async (input, init) => {
    const body = JSON.parse(init!.body as string);
    const output = String(input).endsWith("/decisions")
      ? {
          answers: [
            ...INTEREST_TAGS.map((topic) => ({
              type: "predicate",
              name: `topic:${topic}`,
              probability: 0.95,
            })),
            { type: "choice", name: "depth", choice: "deep", confidence: 0.95 },
            {
              type: "choice",
              name: "emphasis",
              choice: "balanced",
              confidence: 0.95,
            },
            { type: "predicate", name: "career_evidence", probability: 0.95 },
          ],
        }
      : {
          output_text:
            body.model === packet.models.judge
              ? JSON.stringify({
                  verdictA: "pass",
                  verdictB: "pass",
                  scoresA: {
                    groundedness: 5,
                    uncertaintyHandling: 5,
                    sourceSeparation: 5,
                    helpfulness: 5,
                    concision: 5,
                  },
                  scoresB: {
                    groundedness: 5,
                    uncertaintyHandling: 5,
                    sourceSeparation: 5,
                    helpfulness: 5,
                    concision: 5,
                  },
                  preferred: "tie",
                  summary: "Dry-run transport fixture; no semantic result.",
                })
              : '{"answer":"Dry-run transport fixture only; no semantic result."}',
        };
    return Response.json({
      ...output,
      model: body.model,
      usage: {
        input_tokens: 100,
        output_tokens: String(input).endsWith("/decisions") ? 0 : 10,
      },
    });
  };
  const budget = createEvaluationBudgetGuard({
    approval: dryRun
      ? {
          approved: true,
          pricingVerified: true,
          ceilingUsd: 10,
          scopeSha256: options.scopeSha256,
        }
      : options.approval,
    scopeSha256: options.scopeSha256,
    fetch: dryRun ? fixtureFetch : rawFetch,
    onChange: journal.budget,
    countInputTokens: async (body, requestSha256) => {
      if (++countCalls > 30)
        throw new Error("Token-count request ceiling exhausted.");
      const parsed = JSON.parse(body);
      if (dryRun)
        return { inputTokens: 1000, requestSha256, model: parsed.model };
      const payload = Object.fromEntries(
        [
          "model",
          "input",
          "instructions",
          "tools",
          "tool_choice",
          "text",
          "parallel_tool_calls",
        ]
          .filter((k) => parsed[k] !== undefined)
          .map((k) => [k, parsed[k]]),
      );
      journal.result(`count-${countCalls}-request`, {
        requestSha256,
        model: parsed.model,
        status: "pending",
        chargeUsd: 0,
      });
      const response = await rawFetch(
        "https://api.openai.com/v1/responses/input_tokens",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${options.apiKey}`,
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(15000),
        },
      );
      if (!response.ok)
        throw new Error(
          `Token counter HTTP ${response.status}; no generation retry.`,
        );
      const count = await response.json();
      if (
        count.object !== "response.input_tokens" ||
        !Number.isInteger(count.input_tokens) ||
        count.input_tokens < 0
      )
        throw new Error("Invalid token-count response.");
      journal.result(`count-${countCalls}-response`, {
        requestSha256,
        model: parsed.model,
        inputTokens: count.input_tokens,
        chargeUsd: 0,
      });
      return {
        inputTokens: count.input_tokens,
        requestSha256,
        model: parsed.model,
      };
    },
  });
  const post = async (body: Record<string, unknown>, signal?: AbortSignal) => {
    const response = await budget.fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${dryRun ? "fixture-only" : options.apiKey}`,
      },
      signal: signal ?? AbortSignal.timeout(60000),
      body: JSON.stringify({
        ...body,
        store: false,
        service_tier: "default",
        max_output_tokens: 1200,
      }),
    });
    return response.json();
  };
  const workflows: Array<{
    caseId: string;
    arms: Record<string, PortfolioGuideGenerationResult>;
  }> = [];
  const judgments: unknown[] = [];
  try {
    for (const [index, row] of packet.cases.entries()) {
      const arms: Record<string, PortfolioGuideGenerationResult> = {};
      for (const enabled of index % 2 ? [true, false] : [false, true]) {
        let answerCalls = 0;
        const arm = enabled ? "enabled" : "disabled";
        const client = {
          responses: {
            create: async (
              params: Record<string, unknown>,
              requestOptions?: { signal?: AbortSignal },
            ) => {
              if (
                ++answerCalls > 2 ||
                params.model !== packet.models.proposedAnswer
              )
                throw new Error("Workflow answer-call/model limit exceeded.");
              return post(
                {
                  ...params,
                  metadata: {
                    eval_case: row.evalCase.id,
                    eval_arm: arm,
                    eval_step: String(answerCalls),
                  },
                },
                requestOptions?.signal,
              );
            },
          },
        } as unknown as OpenAI;
        arms[arm] = await generatePortfolioGuideResponse(row.request, {
          apiKey: dryRun ? "fixture-only" : options.apiKey!,
          model: packet.models.proposedAnswer,
          client,
          providerLabel: "openai",
          decisions: {
            enabled,
            apiKey: dryRun ? "fixture-only" : options.apiKey!,
            fetch: budget.fetch,
          },
        });
        journal.result(`${row.evalCase.id}-${arm}`, {
          dryRun,
          request: row.request,
          generation: arms[arm],
        });
      }
      workflows.push({ caseId: row.evalCase.id, arms });
    }
    for (const [index, row] of packet.cases.entries()) {
      const arms = workflows[index].arms;
      const order =
        index % 2 ? ["enabled", "disabled"] : ["disabled", "enabled"];
      const a = arms[order[0]],
        b = arms[order[1]];
      const input = {
        question: row.request.message,
        expectations: row.evalCase.judgeExpectations,
        sources: pairedSources(a.promptInput, b.promptInput),
        answerA: a.response.answer,
        answerB: b.response.answer,
      };
      const response = await post({
        model: packet.models.judge,
        reasoning: { effort: "low" },
        metadata: { eval_case: row.evalCase.id, eval_role: "paired-judge" },
        input: [
          {
            role: "system",
            content:
              "Grade only the displayed answers against their frozen source contexts. Shared fields apply to both arms; overridesA/B preserve all differing fields. Prior assistant claims and routing hints are not facts. Canonical supporting pages and approved career records support attributed broader claims, not current-page claims. Preserve ownership, expert-review, prototype/production and measurement limits. A thematic bridge is not a causal link. Return JSON with verdictA/verdictB (pass/fail), scoresA/scoresB (groundedness, uncertaintyHandling, sourceSeparation, helpfulness, concision, each integer 1-5), preferred (A/B/tie), summary, issuesA and issuesB. Passing requires groundedness, uncertaintyHandling and sourceSeparation >=4 and helpfulness/concision >=3. Do not regrade or improve answers.",
          },
          { role: "user", content: JSON.stringify(input) },
        ],
      });
      const rawText = extractResponseText(response);
      journal.result(`${row.evalCase.id}-judge-original`, {
        dryRun,
        labelMap: { A: order[0], B: order[1] },
        rawText,
      });
      const grade = JSON.parse(rawText);
      if (
        !["pass", "fail"].includes(grade.verdictA) ||
        !["pass", "fail"].includes(grade.verdictB) ||
        !["A", "B", "tie"].includes(grade.preferred) ||
        ![grade.scoresA, grade.scoresB].every(
          (scores) =>
            scores &&
            [
              "groundedness",
              "uncertaintyHandling",
              "sourceSeparation",
              "helpfulness",
              "concision",
            ].every(
              (k) =>
                Number.isInteger(scores[k]) && scores[k] >= 1 && scores[k] <= 5,
            ),
        )
      )
        throw new Error(
          "Malformed paired judge result retained; no automatic regrade.",
        );
      const judgment = {
        caseId: row.evalCase.id,
        labelMap: { A: order[0], B: order[1] },
        grade,
      };
      judgments.push(judgment);
      journal.result(`${row.evalCase.id}-judge`, judgment);
    }
    const routing = [];
    for (const c of packet.routingCases) {
      const request = {
        ...packet.cases[4].request,
        message: c.question,
        conversation: [],
        sessionContext: {
          visitedPages: [],
          clickedPrompts: [],
          askedQuestions: [],
          inferredInterestTags: [],
        },
      };
      const result = await routePortfolioQuestion(request, {
        enabled: true,
        apiKey: dryRun ? "fixture-only" : options.apiKey!,
        fetch: budget.fetch,
      });
      const record = {
        id: c.id,
        expected: c,
        result,
        passed: c.route
          ? result.status === "routed" &&
            (c.topics ?? []).every((topic) =>
              result.plan?.topics.includes(topic),
            )
          : result.status === "bypassed",
      };
      routing.push(record);
      journal.result(c.id, record);
    }
    const result = {
      dryRun,
      semanticClaimsAllowed: !dryRun,
      workflows: workflows.length,
      pairedJudgments: judgments.length,
      routing,
      countCalls,
      budget: budget.snapshot(),
      deploymentVerified: false,
    };
    journal.result("summary", result);
    return result;
  } catch (error) {
    journal.result("stopped", {
      dryRun,
      message:
        error instanceof Error
          ? error.message.replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]")
          : "Evaluation stopped",
      budget: budget.snapshot(),
      countCalls,
    });
    throw new Error(
      "Canary stopped; original results and budget reservations retained. Inspect the local stopped record.",
    );
  }
}
