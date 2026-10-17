import assert from "node:assert/strict";
import test from "node:test";
import type OpenAI from "openai";
import fixtures from "./fixtures/processing-regressions.json";
import {
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import {
  generatePortfolioGuideResponse,
  processPortfolioGuideAnswer,
} from "@/lib/portfolio-guide/service";
import { buildUnavailableEvidenceResult } from "@/lib/portfolio-guide/tools/evidence";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";

function request(pageSlug: string, question: string): CopilotRequest {
  return {
    message: question,
    pageContext: getPageContextBySlug(pageSlug)!,
    portfolioContext: getPortfolioContext(),
    sessionContext: {
      visitedPages: [],
      clickedPrompts: [],
      askedQuestions: [],
      inferredInterestTags: [],
    },
  };
}

async function replay(
  caseId: string,
  transform?: (input: CopilotRequest) => CopilotRequest,
) {
  const fixture = fixtures.cases.find((item) => item.caseId === caseId)!;
  const input = request(fixture.pageSlug, fixture.question);
  return generatePortfolioGuideResponse(transform ? transform(input) : input, {
    apiKey: "offline-regression-only",
    client: {
      responses: { create: async () => ({ output_text: fixture.rawText }) },
    } as unknown as OpenAI,
  });
}

test("responsibility wording receives the source's direct, influence and implementation distinctions", async () => {
  const result = await replay("ai-platform-responsibility-specific");
  assert.match(result.response.answer, /Led a team to design and build/);
  assert.match(
    result.response.answer,
    /Influence: Connected prototype learnings/,
  );
  assert.match(
    result.response.answer,
    /does not describe end-to-end production implementation ownership/,
  );
  assert.match(result.response.answer, /does not define team size/);
});

test("ownership answers retain documented AI assistance and the sole-code boundary when the model omits them", async () => {
  const result = await replay("ai-career-ownership");
  assert.match(result.response.answer, /product thesis.*service boundaries/);
  assert.match(
    result.response.answer,
    /AI development agents.*retaining product and quality accountability/,
  );
  assert.match(result.response.answer, /does not claim sole hand-coding/);
  assert.doesNotMatch(
    result.response.answer,
    /Daniel (?:solely|single-handedly) (?:built|implemented)/,
  );
});

test("AI assistance is not invented on a page without that source boundary", async () => {
  const result = await replay("ai-career-ownership", (input) => ({
    ...input,
    pageContext: {
      ...input.pageContext,
      leadershipSignals: [],
      authoredSections: [],
      claimBoundaries: {
        directOwnership: ["Defined the product direction."],
        implementation: [
          "The page does not establish production implementation ownership.",
        ],
      },
    },
  }));
  assert.match(result.response.answer, /Defined the product direction/);
  assert.doesNotMatch(
    result.response.answer,
    /AI development agents|AI-assisted|sole hand-coding/,
  );
});

test("shortening preserves qualified survey proof and professional grounding beside conviction limits", async () => {
  const result = await replay("human-flourishing-proof-boundaries");
  assert.match(
    result.response.answer,
    /majority.*reported increased creativity/,
  );
  assert.match(
    result.response.answer,
    /enterprise AI adoption|agentic workflows|productivity tools/,
  );
  assert.match(result.response.answer, /convictions|not proven outcomes/);
  assert.doesNotMatch(result.response.answer, /directly owned.*survey/);
  assert.doesNotMatch(result.response.answer, /\b\d+\s*%|\b\d+\s+respondents/);
  assert.ok(result.response.answer.split(/(?<=[.!?])\s+/).length <= 4);
});

test("multi-sentence source limitations cannot crowd direct ownership out of four categories", async () => {
  const input = request(
    "gravity-astra",
    "What particularly was Daniel responsible for, and what did Astra help implement?",
  );
  const result = await generatePortfolioGuideResponse(input, {
    apiKey: "offline-regression-only",
    client: {
      responses: {
        create: async () => ({ output_text: "Daniel made it all." }),
      },
    } as unknown as OpenAI,
  });
  assert.match(result.response.answer, /composition/);
  assert.match(result.response.answer, /product thesis|product direction/);
  assert.match(result.response.answer, /Astra/);
  assert.match(result.response.answer, /does not establish sole hand-coding/);
  assert.match(
    result.response.answer,
    /Enterprise metrics elsewhere belong to those projects/,
  );
  assert.ok(result.response.answer.split(/(?<=[.!?])\s+/).length <= 4);
});

test("static inventory cannot become a runtime or semantic-quality result in the displayed summary", async () => {
  const result = await replay("ai-career-summary");
  assert.match(result.response.answer, /147\.65.*81\.58/);
  assert.match(result.response.answer, /exclude server bundles/);
  assert.match(result.response.answer, /not independently rerun/);
  assert.match(
    result.response.answer,
    /does not establish.*faster pages.*semantic AI-quality improvement/,
  );
  assert.doesNotMatch(
    result.response.answer,
    /illustrating tangible quality and performance gains/,
  );
});

test("unrelated runtime evidence is not rewritten as an inventory disclaimer", async () => {
  const input = request("checkout-redesign", "What was the impact?");
  const rawText =
    "The page reports a 30% faster checkout flow and estimated annualized revenue impact.";
  const result = await generatePortfolioGuideResponse(input, {
    apiKey: "offline-regression-only",
    client: {
      responses: { create: async () => ({ output_text: rawText }) },
    } as unknown as OpenAI,
  });
  assert.equal(result.response.answer, rawText);
  assert.doesNotMatch(result.response.answer, /inventory|server bundles/);
});

test("future-tense generator claims cannot imply Portfolio pages feed the resume", async () => {
  const result = await replay("fresh-resume-source-claim");
  assert.doesNotMatch(
    result.response.answer,
    /will pull in evidence from this page/,
  );
  assert.match(
    result.response.answer,
    /does not prove that Portfolio pages directly feed/,
  );
  assert.match(result.response.answer, /\/resume\/generate/);
  assert.match(result.response.answer, /paste.*job description/i);
});

test("retrieval summaries retain the documented release boundary", async () => {
  const result = await replay("fresh-retrieval-release-boundary");
  assert.match(
    result.response.answer,
    /Remote career retrieval is disabled.*pending a separately reviewed endpoint/,
  );
  assert.match(
    result.response.answer,
    /canonical page grounding and resume jobs remain supported/,
  );
});

function broadOwnership(rawText?: string, includeSources = true) {
  const fixture = fixtures.cases.find(
    (item) => item.caseId === "fresh-broad-ownership-refusal",
  )!;
  const supportingPages = includeSources
    ? [
        getPageContextBySlug("ai-platform-mcp")!,
        getPageContextBySlug("chatgpt-enterprise")!,
      ]
    : [];
  return processPortfolioGuideAnswer({
    request: request(fixture.pageSlug, fixture.question),
    rawText: rawText ?? fixture.rawText,
    relatedPages: supportingPages.map(({ slug, title, href }) => ({
      slug,
      title,
      href,
    })),
    supportingPages,
    routingEnabled: true,
    careerEvidence: buildUnavailableEvidenceResult(
      fixture.question,
      "not_configured",
    ),
  }).finalized.answer;
}

test("a false page-only ownership refusal uses only captured canonical sources", () => {
  const answer = broadOwnership();
  assert.match(answer, /AI Career Operating System/);
  assert.match(answer, /From AI experiments to platform foundations/);
  assert.match(answer, /AI development agents/);
  assert.match(answer, /does not claim sole hand-coding/);
  assert.match(
    answer,
    /locally implemented candidates|locally tested.*prototype/i,
  );
  assert.doesNotMatch(
    answer,
    /can't identify|can’t identify|only describes work done on this specific project/,
  );
  assert.ok(answer.split(/(?<=[.!?])\s+/).length <= 4);
});

test("a broad ownership fallback cannot invent unprovided supporting projects", () => {
  const answer = broadOwnership(undefined, false);
  assert.doesNotMatch(
    answer,
    /From AI experiments to platform foundations|ChatGPT Enterprise/,
  );
});

test("a substantive broader answer survives instead of receiving the refusal fallback", () => {
  const raw =
    "Directed: On this page Daniel defined product architecture; elsewhere in the portfolio he led a functional prototype. AI-assisted: On this project AI development agents accelerated implementation under human review. Local prototype: Decisions routing remains a local candidate with validation pending.";
  const answer = broadOwnership(raw);
  assert.match(
    answer,
    /Directed: On this page Daniel defined product architecture; elsewhere in the portfolio he led a functional prototype/,
  );
  assert.match(answer, /AI-assisted: On this project/);
});
