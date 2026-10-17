import assert from "node:assert/strict";
import test from "node:test";
import {
  boundGuideAnswer,
  finalizeRoutedAnswer,
} from "@/lib/portfolio-guide/answer-finalization";
import { shouldRouteQuestion } from "@/lib/portfolio-guide/decisions";
import {
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import { applyPortfolioGuideResponseGuardrails } from "@/lib/portfolio-guide/service";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";
import type { EvidenceSearchResponse } from "@/lib/portfolio-guide/tools/evidence";

function request(message: string): CopilotRequest {
  return {
    message,
    pageContext: getPageContextBySlug("ai-platform-mcp")!,
    portfolioContext: getPortfolioContext(),
    sessionContext: {
      visitedPages: [],
      clickedPrompts: [],
      askedQuestions: [],
      inferredInterestTags: [],
    },
  };
}
const evidence: EvidenceSearchResponse = {
  query: "life science",
  answerability: "medium",
  confidence: "high",
  evidence: [
    {
      id: "research",
      project: "Immunology Scout",
      claim:
        "Developed an assistant for immunology literature and patent discovery.",
      claimBoundaries: [
        "The 100% to 0% result concerns patent-search hallucinations in the measured set, not every possible hallucination.",
        "No product-wide adoption, revenue, or scientific validation is established.",
      ],
      supportingDetails: [],
      capabilityTags: ["research"],
      metricTags: [],
      metrics: [],
      sourceAudit: {
        status: "verified",
        sourceType: "approved",
        lastReviewedAt: null,
      },
      visibility: "public",
      recommendedUse: "research evidence",
    },
  ],
};

test("broad research answers replace unrelated page framing with attributed proof and its scientific limit", () => {
  const result = finalizeRoutedAnswer({
    request: request("Does Daniel have experience with life science research?"),
    answer: "For this role, this page proves fit.",
    careerEvidence: evidence,
    includeCareerEvidence: true,
    broaderQuestion: true,
  });
  assert.match(
    result.answer,
    /From ResumeCustomizer evidence: Immunology Scout/,
  );
  assert.match(
    result.answer,
    /No product-wide adoption, revenue, or scientific validation is established/,
  );
  assert.doesNotMatch(result.answer, /For this role/);
  assert.deepEqual(result.careerEvidenceIds, ["research"]);
});

test("page fit keeps its primary proof and boundary before a qualified career record", () => {
  const result = finalizeRoutedAnswer({
    request: request("Would Daniel fit this director role?"),
    answer:
      "**This page documents** an 87% would-use-again signal. Leadership includes platform thinking. **Boundary:** a prototype does not establish production implementation.",
    careerEvidence: evidence,
    includeCareerEvidence: true,
    broaderQuestion: true,
  });
  assert.match(result.answer, /^This page documents an 87%/);
  assert.match(
    result.answer,
    /Boundary: a prototype does not establish production implementation/,
  );
  assert.match(result.answer, /Limit for Immunology Scout:/);
  assert.equal(result.answer.split(/(?<=[.!?])\s+/).length, 4);
});

test("the final budget drops complete proof blocks rather than leaving their measurement caveats behind", () => {
  const answer = boundGuideAnswer(
    "Current-page proof. Other context. Another bridge. A measured result improved by 30%. Limit: the measured set does not establish product-wide outcomes.",
    "What measured results are supported?",
  );
  assert.match(answer, /30%/);
  assert.match(answer, /measured set does not establish product-wide outcomes/);
  assert.ok(answer.split(/(?<=[.!?])\s+/).length <= 4);
});

test("evidence outage disclosure survives the final budget verbatim", () => {
  const fallback =
    "I couldn't reach the deeper evidence layer. This is based on the public portfolio page.";
  const result = finalizeRoutedAnswer({
    request: request("What career proof is available?"),
    answer:
      "First public proof. Second public proof. Third public proof. Fourth public proof.",
    careerEvidence: { ...evidence, evidence: [], safeFallback: fallback },
    includeCareerEvidence: false,
    broaderQuestion: true,
  });
  assert.ok(result.answer.endsWith(fallback));
  assert.equal(result.answer.split(/(?<=[.!?])\s+/).length, 4);
});

test("generator requests and the authored creative next-read sequence bypass probabilistic routing", () => {
  assert.equal(
    shouldRouteQuestion(request("Can I get a resume for this role?")),
    false,
  );
  const creative = request("What should I view next?");
  creative.sessionContext.visitorIntent = {
    rawInput: "Creative Technology",
    focusAreas: ["creative-technology"],
  };
  assert.equal(shouldRouteQuestion(creative), false);
});

test("broader creative and career explanations survive page-local connection and role-fit templates", () => {
  const creativeAnswer =
    "This page shows prototype validation. Elsewhere in the portfolio, Tabletop Symphony provides a thematic comparison about human control; the sources do not establish shared implementation.";
  const careerAnswer =
    "From ResumeCustomizer evidence: Immunology Scout demonstrates literature and patent research workflows. No scientific validation is established.";
  for (const [question, answer] of [
    [
      "How does Daniel's creative background connect to his AI work?",
      creativeAnswer,
    ],
    [
      "Does Daniel have experience with life science AI research?",
      careerAnswer,
    ],
  ]) {
    const result = applyPortfolioGuideResponseGuardrails({
      request: request(question),
      response: { answer },
      fallbackRelatedPages: [],
    });
    assert.equal(result.answer, answer);
    assert.equal(result.suggestedFollowUps, undefined);
  }
});

test("an across-portfolio ownership map survives when routed sources support its scope", () => {
  const answer =
    "Direct ownership: on this page, Daniel led prototype building. Influence: he translated the learnings into platform direction. Elsewhere in the portfolio, ChatGPT Enterprise describes pilot framing and rollout. Limit: those sources do not establish sole implementation ownership.";
  const result = applyPortfolioGuideResponseGuardrails({
    request: request(
      "Across the portfolio, separate Daniel's direct ownership from his influence.",
    ),
    response: { answer },
    fallbackRelatedPages: [],
    routedSourcesAvailable: true,
  });
  assert.equal(result.answer, answer);
});
