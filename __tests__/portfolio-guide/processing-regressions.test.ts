import assert from "node:assert/strict";
import test from "node:test";
import type OpenAI from "openai";
import fixtures from "./fixtures/processing-regressions.json";
import repairFixtures from "./fixtures/source-contract-repairs.json";
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

function processCaptured(
  caseId: string,
  rawText?: string,
  transform?: (input: CopilotRequest) => CopilotRequest,
) {
  const fixture = repairFixtures.cases.find((item) => item.caseId === caseId)!;
  const input = request(fixture.pageSlug, fixture.question);
  return processPortfolioGuideAnswer({
    request: transform ? transform(input) : input,
    rawText: rawText ?? fixture.rawText,
    relatedPages: [],
  }).finalized.answer;
}

test("captured checkout impact retains its estimate and does not invent time units", () => {
  const answer = processCaptured("checkout-impact");
  assert.match(answer, /estimated/i);
  assert.match(answer, /16/);
  assert.match(answer, /30%/);
  assert.match(answer, /3:00.*2:03/);
  assert.doesNotMatch(answer, /2:03\s*(?:seconds|minutes)/i);
  assert.match(answer, /conversion/i);
});

test("metric corrections require the supplied estimated metric and unspecified-unit evidence", () => {
  const raw =
    "A separate study measured $16 million annualized revenue and a 3:00 to 2:03 seconds comparison.";
  const answer = processCaptured("checkout-impact", raw, (input) => ({
    ...input,
    pageContext: {
      ...input.pageContext,
      metrics: [],
      evidenceHighlights: [],
      claimBoundaries: {},
    },
  }));
  assert.equal(answer, raw);
});

test("already-qualified checkout proof remains unchanged", () => {
  const raw =
    "The page reports an estimated ~$16M in annualized impact, a 30% faster checkout from 3:00 to 2:03, and ~3% conversion lift.";
  assert.equal(processCaptured("checkout-impact", raw), raw);
});

test("captured summary preserves exact inventory values, retrieval status and unlaunched scope", () => {
  const answer = processCaptured("ai-career-summary");
  assert.match(answer, /147\.65.*81\.58/);
  assert.match(answer, /exclude server bundles/);
  assert.match(answer, /not independently rerun/);
  assert.match(answer, /Remote career retrieval is disabled/);
  assert.doesNotMatch(
    answer,
    /complete,?\s*end[\u2010-\u2015-]to[\u2010-\u2015-]end\s+proof[\u2010-\u2015-]engine/i,
  );
  assert.match(answer, /before.*public integration.*launched/);
  assert.ok(answer.split(/(?<=[.!?])\s+/).length <= 4);
});

test("empty assistance headings cannot suppress the captured ownership fallback", () => {
  for (const credit of [
    "unknown",
    "not documented",
    "undocumented",
    "not disclosed",
    "I don't know",
    "AI development agents are not documented",
    "",
  ]) {
    const answer = broadOwnership(
      `Directed: unknown. AI-assisted: ${credit}. Local status: unknown. I can't identify roles across the portfolio from this page.`,
    );
    assert.match(answer, /AI development agents/);
    assert.match(answer, /does not claim sole hand-coding/);
    assert.doesNotMatch(
      answer,
      /AI-assisted: (?:unknown|not documented|undocumented)/,
    );
  }
});

test("substantive AI assistance is retained even if another ownership detail is unknown", () => {
  const raw =
    "AI-assisted: AI development agents accelerated implementation under human review; exact team size is unknown. I can't identify every role across the portfolio from this page.";
  assert.match(broadOwnership(raw), /exact team size is unknown/);
  assert.doesNotMatch(
    broadOwnership(raw),
    /From AI experiments to platform foundations/,
  );
});

test("standalone inventory-derived speed, cost and semantic conclusions are removed with source limits", () => {
  const raw =
    "Repository-documented uncompressed static files decreased from 147.65 MiB to 81.58 MiB. This reduction makes pages faster, lowers bills and improves semantic AI answer quality.";
  const answer = processCaptured("ai-career-summary", raw);
  assert.match(answer, /147\.65.*81\.58/);
  assert.doesNotMatch(
    answer,
    /makes pages faster|lowers bills|improves semantic AI answer quality/,
  );
  assert.match(answer, /does not establish lower bills, faster pages/);
});

test("inventory guard preserves explicit denials and unrelated measured runtime facts", () => {
  const raw =
    "Uncompressed static files decreased from 147.65 MiB to 81.58 MiB. This reduction does not establish faster pages or better semantic quality. A separate evaluation recorded Terra's median workflow latency of 4.82 seconds.";
  const answer = processCaptured("ai-career-summary", raw);
  assert.match(answer, /does not establish faster pages/);
  assert.match(
    answer,
    /separate evaluation recorded Terra's median workflow latency of 4\.82 seconds/,
  );
});

test("a denied semantic claim cannot shelter an affirmative inventory-derived speed claim", () => {
  const raw =
    "Uncompressed static files decreased from 147.65 MiB to 81.58 MiB. This reduction makes pages faster but does not establish semantic quality.";
  const answer = processCaptured("ai-career-summary", raw);
  assert.doesNotMatch(answer, /makes pages faster/);
  assert.match(answer, /does not establish lower bills, faster pages/);
});

test("a denial scopes across coordinated unsupported outcomes", () => {
  const raw =
    "Uncompressed static files decreased from 147.65 MiB to 81.58 MiB. This reduction does not establish faster pages and better semantic quality.";
  assert.match(
    processCaptured("ai-career-summary", raw),
    /does not establish faster pages and better semantic quality/,
  );
});

test("equivalent retrieval typography receives the same authored availability qualification", () => {
  for (const hyphen of ["-", "\u2010", "\u2011", "\u2013"]) {
    const answer = processCaptured(
      "ai-career-summary",
      `The system includes source${hyphen}audited retrieval and structural PDF checks.`,
    );
    assert.match(answer, /Remote career retrieval is disabled/);
  }
});

test("retrieval and completion corrections do not invent absent source boundaries", () => {
  const raw =
    "A complete end-to-end proof-engine uses source‑audited retrieval.";
  const answer = processCaptured("ai-career-summary", raw, (input) => ({
    ...input,
    pageContext: {
      ...input.pageContext,
      evidenceHighlights: [],
      claimBoundaries: {},
    },
  }));
  assert.equal(answer, raw);
});

test("an explicit denial of completion remains a limit rather than a positive launch claim", () => {
  const raw =
    "The page does not establish a complete end-to-end proof-engine or a production-ready workflow.";
  assert.equal(processCaptured("ai-career-summary", raw), raw);
});

test("fresh bounded evidence retrieval retains the supplied disabled-release boundary", () => {
  assert.match(
    processCaptured("bcf-ai-career-summary"),
    /Remote career retrieval is disabled/,
  );
});

test("canonical page retrieval alone is not relabeled as remote career retrieval", () => {
  const raw =
    "The Guide retrieves canonical portfolio pages; this is page grounding.";
  assert.equal(processCaptured("bcf-ai-career-summary", raw), raw);
});

test("unnamed evidence retrieval still carries the supplied disabled-remote boundary", () => {
  const answer = processCaptured(
    "bcf-ai-career-summary",
    "The prototype retrieves approved facts through an authenticated API.",
  );
  assert.match(answer, /Remote career retrieval is disabled/);
});

test("generic retrieval cannot invent availability when no source boundary is supplied", () => {
  const raw =
    "The prototype retrieves approved facts through an authenticated API.";
  assert.equal(
    processCaptured("bcf-ai-career-summary", raw, (input) => ({
      ...input,
      pageContext: {
        ...input.pageContext,
        evidenceHighlights: [],
        claimBoundaries: {},
      },
    })),
    raw,
  );
});

test("fresh survey agency retains helped-run wording and its qualified creativity evidence", () => {
  const answer = processCaptured("bcf-human-flourishing-proof-boundaries");
  assert.match(answer, /helped run Guitar Center AI adoption surveys/);
  assert.match(answer, /majority.*reported increased creativity/);
  assert.match(answer, /personal aspiration|personal convictions/);
  assert.doesNotMatch(answer, /Daniel explicitly led/);
});

test("survey correction requires the explicit helped-run source, preserving supported leadership elsewhere", () => {
  const raw = "Daniel led Guitar Center AI adoption surveys.";
  const answer = processCaptured(
    "bcf-human-flourishing-proof-boundaries",
    raw,
    (input) => ({
      ...input,
      pageContext: {
        ...input.pageContext,
        claimBoundaries: {
          directOwnership: ["Daniel led Guitar Center AI adoption surveys."],
        },
      },
    }),
  );
  assert.equal(answer, raw);
});

test("the rollout essay retains helped-lead agency without changing its supported workflow details", () => {
  const answer = processCaptured("bcf-ai-strategy-summary");
  assert.match(answer, /he helped lead a ChatGPT rollout/);
  assert.match(answer, /pre[\u2010-\u2015-]call preparation and drafting/);
  assert.match(answer, /champions, training, and feedback loops/);
  assert.match(
    answer,
    /ChatGPT Enterprise case study for concrete rollout metrics/,
  );
  assert.doesNotMatch(answer, /he led a ChatGPT rollout/);
});

test("captured platform summaries and role answers retain qualified production and ownership scope", () => {
  for (const id of [
    "bcf-ai-platform-summary",
    "bcf-ai-platform-role-relevance",
  ]) {
    const answer = processCaptured(id);
    assert.match(answer, /production version.*February 2026/);
    assert.match(answer, /does not establish.*full original vision/);
    assert.match(
      answer,
      /does not describe end-to-end production implementation ownership/,
    );
    assert.match(answer, /87/);
    assert.doesNotMatch(
      answer,
      /result was a new platform layer|leadership in building a reusable AI[\u2010-\u2015-]platform layer|framework that accelerates subsequent/,
    );
  }
});

test("platform corrections require source scope and preserve explicit conceptual framing", () => {
  const raw =
    "The page explores a conceptual platform layer and does not establish a delivered production platform.";
  assert.equal(processCaptured("bcf-ai-platform-summary", raw), raw);
  const unsupported = "The result was a new platform layer.";
  assert.equal(
    processCaptured("bcf-ai-platform-summary", unsupported, (input) => ({
      ...input,
      pageContext: { ...input.pageContext, claimBoundaries: {} },
    })),
    unsupported,
  );
});

test("the canonical platform packet includes the approved production timeline and vision caveat", () => {
  const page = getPageContextBySlug("ai-platform-mcp")!;
  const timeline = page.evidenceHighlights?.find(
    (item) => item.label === "Qualified prototype-to-production timeline",
  )?.detail;
  assert.ok(timeline);
  assert.match(timeline, /pitched in February 2025/);
  assert.match(timeline, /proofs of concept.*October 2025/);
  assert.match(timeline, /production version.*February 2026/);
  assert.match(timeline, /does not establish.*full original vision/);
});

test("the exact middle-layer summary retains qualified production proof without a scaling outcome", () => {
  const answer = processCaptured("3cec-ai-platform-summary");
  assert.match(answer, /production version.*February 2026/);
  assert.match(answer, /does not establish.*full original vision/);
  assert.match(
    answer,
    /does not describe end-to-end production implementation ownership/,
  );
  assert.match(answer, /87/);
  assert.doesNotMatch(answer, /scale AI use cases more quickly and reliably/);
});

test("the exact experience-leading construction retains collaborative rollout agency", () => {
  const answer = processCaptured("3cec-ai-strategy-summary");
  assert.match(answer, /experience helping lead a ChatGPT rollout/);
  assert.doesNotMatch(answer, /experience leading a ChatGPT rollout/);
  assert.match(answer, /pre[\u2010-\u2015-]call prep, drafting/);
});

test("the exact activity-specific work-he-has-led phrase remains worked-on experience", () => {
  const answer = processCaptured("3cec-human-flourishing-proof-boundaries");
  assert.match(answer, /surveys he helped run/);
  assert.match(answer, /work he has worked on/);
  assert.doesNotMatch(answer, /work he has led/);
  assert.match(answer, /majority.*reported increased creativity/);
  assert.match(answer, /exact percentages, sample sizes/);
});

test("already-qualified production and collaborative agency survive unchanged", () => {
  const platform =
    "The AI Platform had a production version deployed in February 2026; the sources do not establish preservation of the full original vision or Daniel's end-to-end production engineering ownership.";
  assert.equal(processCaptured("3cec-ai-platform-summary", platform), platform);
  const rollout =
    "His experience helping lead early ChatGPT rollout work shaped his workflow-first view.";
  assert.equal(processCaptured("3cec-ai-strategy-summary", rollout), rollout);
});

test("activity-specific calibration does not downgrade approved broader enterprise-AI leadership", () => {
  const raw = "Daniel has 2+ years leading enterprise AI initiatives.";
  assert.equal(
    processCaptured("3cec-human-flourishing-proof-boundaries", raw),
    raw,
  );
});

test("collaborative calibration preserves an explicit denial of sole rollout leadership", () => {
  const raw = "The essay does not claim Daniel led the ChatGPT rollout alone.";
  assert.equal(processCaptured("3cec-ai-strategy-summary", raw), raw);
});

test("worked-on calibration preserves an explicit limit on the composite leadership claim", () => {
  const raw =
    "The page does not establish that the enterprise AI, agentic-workflow, and productivity-tool work he has led is direct ownership evidence.";
  assert.equal(
    processCaptured("3cec-human-flourishing-proof-boundaries", raw),
    raw,
  );
});

test("source alignment cannot invent production or weaker agency when source fields are absent", () => {
  const withoutSource = (input: CopilotRequest) => ({
    ...input,
    pageContext: {
      ...input.pageContext,
      evidenceHighlights: [],
      claimBoundaries: {},
    },
  });
  for (const [id, raw] of [
    [
      "3cec-ai-platform-summary",
      "The result is a shared middle-layer platform.",
    ],
    [
      "3cec-ai-strategy-summary",
      "His experience leading a ChatGPT rollout shaped this view.",
    ],
    ["3cec-human-flourishing-proof-boundaries", "This is work he has led."],
  ]) {
    assert.equal(processCaptured(id, raw, withoutSource), raw);
  }
});

test("a captured legacy packet cannot acquire the newer production fact through a global lookup", () => {
  const answer = processCaptured(
    "3cec-ai-platform-summary",
    "The result was a new platform layer.",
    (input) => ({
      ...input,
      pageContext: {
        ...input.pageContext,
        evidenceHighlights: input.pageContext.evidenceHighlights?.filter(
          (item) => item.label !== "Qualified prototype-to-production timeline",
        ),
      },
    }),
  );
  assert.match(answer, /conceptual point of view/);
  assert.doesNotMatch(answer, /February 2026/);
});

test("a denied vision claim cannot shelter a positive platform scaling claim", () => {
  const raw =
    "The platform does not preserve the full original vision, but the platform enables teams to scale more quickly and reliably.";
  const answer = processCaptured("3cec-ai-platform-summary", raw);
  assert.doesNotMatch(
    answer,
    /enables teams to scale more quickly and reliably/,
  );
  assert.match(answer, /production version.*February 2026/);
  assert.match(answer, /does not establish faster or more reliable scaling/);
});
