import assert from "node:assert/strict";
import test from "node:test";
import type OpenAI from "openai";
import { createOpenAiPortfolioGuideJudge } from "@/lib/portfolio-guide/evals/judge";
import { buildRequestForEvalCase } from "@/lib/portfolio-guide/evals/runner";
import { portfolioGuideEvalCases } from "@/lib/portfolio-guide/evals/cases";
import type { PortfolioGuideGenerationResult } from "@/lib/portfolio-guide/service";

test("judge sees the answer's approved sources but not hidden response summaries or routing hints as facts", async () => {
  let captured = "";
  const client = {
    responses: {
      create: async (params: { input: Array<{ content: string }> }) => {
        captured = params.input[1].content;
        return {
          output_text: JSON.stringify({
            verdict: "pass",
            scores: {
              groundedness: 5,
              uncertaintyHandling: 5,
              sourceSeparation: 5,
              helpfulness: 5,
              concision: 5,
            },
          }),
        };
      },
    },
  } as unknown as OpenAI;
  const judge = createOpenAiPortfolioGuideJudge({
    apiKey: "test",
    model: "test",
    client,
  });
  const evalCase = portfolioGuideEvalCases[0];
  const generation = {
    promptInput: JSON.stringify({
      routingContext: {
        supportingPages: [
          { slug: "canonical", claimBoundaries: ["Prototype only"] },
        ],
        careerEvidence: {
          evidence: [{ id: "approved", claim: "Approved career proof" }],
        },
        decisionHints: { inventedFact: "never evidence" },
      },
    }),
    response: {
      answer: "Displayed answer",
      evidenceUsed: [{ claim: "Hidden summary is not displayed" }],
    },
    relatedPages: [],
  } as unknown as PortfolioGuideGenerationResult;
  await judge({
    evalCase,
    request: buildRequestForEvalCase(evalCase),
    generation,
  });
  const context = JSON.parse(captured);
  assert.equal(
    context.additionalCanonicalPages[0].claimBoundaries[0],
    "Prototype only",
  );
  assert.equal(context.approvedCareerRecords.evidence[0].id, "approved");
  assert.equal(context.responseToGrade.answer, "Displayed answer");
  assert.equal(context.responseToGrade.evidenceUsed, undefined);
  assert.doesNotMatch(captured, /Hidden summary|inventedFact/);
});
