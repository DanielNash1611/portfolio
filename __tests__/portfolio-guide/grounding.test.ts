import assert from "node:assert/strict";
import test from "node:test";
import {
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import { buildPortfolioGuidePromptContext } from "@/lib/portfolio-guide/prompt";

const fallbackRelatedPages = [
  {
    slug: "chatgpt-enterprise",
    title: "ChatGPT Enterprise from pilot to operating model",
    href: "/work/chatgpt-enterprise",
    reason: "Strong adjacent example for enterprise AI adoption.",
  },
];

test("assistant chat turns are excluded from grounding context", () => {
  const pageContext = getPageContextBySlug("ai-platform-mcp");
  assert.ok(pageContext, "expected canonical page context");

  const promptContext = buildPortfolioGuidePromptContext(
    {
      message: "Show the impact",
      pageContext,
      portfolioContext: getPortfolioContext(),
      sessionContext: {
        visitedPages: ["ai-platform-mcp"],
        clickedPrompts: [],
        askedQuestions: ["Show the impact"],
        inferredInterestTags: ["platform"],
      },
      conversation: [
        {
          role: "user",
          content: "What did Daniel own?",
        },
        {
          role: "assistant",
          content: "Daniel owned every reusable pattern end to end.",
        },
      ],
    },
    fallbackRelatedPages,
  );

  assert.deepEqual(promptContext.conversationContext.recentUserQuestions, [
    "What did Daniel own?",
  ]);
  assert.equal(promptContext.conversationContext.excludedAssistantMessages, 1);
  assert.doesNotMatch(
    JSON.stringify(promptContext.conversationContext),
    /Daniel owned every reusable pattern end to end\./,
  );
});

test("current page grounding includes authored content for page summaries", () => {
  const pageContext = getPageContextBySlug("ai-platform-mcp");
  assert.ok(pageContext, "expected canonical page context");

  const sectionLabels = pageContext.authoredSections?.map((section) => section.label) ?? [];
  const authoredText = JSON.stringify(pageContext.authoredSections ?? []);
  const evidenceText = JSON.stringify(pageContext.evidenceHighlights ?? []);

  assert.ok(sectionLabels.includes("Page summary"));
  assert.ok(sectionLabels.includes("Execution"));
  assert.match(authoredText, /87% would use again/);
  assert.match(authoredText, /Mapped recurring AI workflow patterns across pilots/);
  assert.match(evidenceText, /hackathon-winning AI concept/i);
  assert.match(evidenceText, /87%/);
  assert.match(
    JSON.stringify(pageContext.claimBoundaries ?? {}),
    /does not define team size, org structure, production rollout scale, or which reusable pattern shipped most/i,
  );
});

test("essay pages are included in the guide catalog and product philosophy uses rich authored grounding", () => {
  const aiStrategy = getPageContextBySlug("ai-strategy");
  const productPhilosophy = getPageContextBySlug("product-philosophy");
  assert.ok(aiStrategy, "expected ai-strategy page context");
  assert.ok(productPhilosophy, "expected product-philosophy page context");

  const pageDirectory = getPortfolioContext().pageDirectory ?? [];
  assert.ok(pageDirectory.some((page) => page.slug === "ai-strategy"));
  assert.ok(pageDirectory.some((page) => page.slug === "product-philosophy"));

  const sectionLabels =
    productPhilosophy.authoredSections?.map((section) => section.label) ?? [];
  const authoredText = JSON.stringify(productPhilosophy.authoredSections ?? []);
  const evidenceText = JSON.stringify(productPhilosophy.evidenceHighlights ?? []);
  const boundariesText = JSON.stringify(productPhilosophy.claimBoundaries ?? {});

  assert.ok(sectionLabels.includes("AI-assisted workflows"));
  assert.ok(sectionLabels.includes("Product types limit"));
  assert.match(
    authoredText,
    /Custom GPTs supported idea generation, opportunity framing, ROI estimation, and PRD creation/i,
  );
  assert.match(
    authoredText,
    /did not ultimately gain executive adoption/i,
  );
  assert.match(
    evidenceText,
    /product lifecycle, RICE worksheet, review cadence, sprint planning flow, roadmap language, and product-types visuals/i,
  );
  assert.match(boundariesText, /does not provide business impact metrics/i);
  assert.match(boundariesText, /executive adoption/i);
});

test("prompt context keeps current page facts separate from broader site memory", () => {
  const pageContext = getPageContextBySlug("ai-platform-mcp");
  assert.ok(pageContext, "expected canonical page context");

  const promptContext = buildPortfolioGuidePromptContext(
    {
      message: "What should I view next for this role?",
      pageContext,
      portfolioContext: getPortfolioContext(),
      sessionContext: {
        visitedPages: ["chatgpt-enterprise", "ai-platform-mcp"],
        clickedPrompts: ["What should I view next for this role?"],
        askedQuestions: [
          "What did Daniel own?",
          "What should I view next for this role?",
        ],
        inferredInterestTags: ["platform", "technical-depth"],
        visitorIntent: {
          rawInput: "Platform PM",
          normalizedTitle: "Platform Product Manager",
          seniority: "pm",
          roleLenses: ["builder-pm", "senior-product-manager"],
          focusAreas: ["platform"],
          emphasis: ["technical-depth"],
        },
        recommendedPath: [
          {
            slug: "chatgpt-enterprise",
            title: "ChatGPT Enterprise from pilot to operating model",
            reason: "Strong adjacent example for enterprise AI adoption.",
            priority: 1,
          },
        ],
      },
    },
    fallbackRelatedPages,
  );

  assert.equal(promptContext.currentPage.identity.slug, "ai-platform-mcp");
  assert.equal(
    promptContext.currentPage.structuredMetadata.oneLiner,
    "Turned early AI validation into a broader point of view on reusable systems, workflow fit, and platform foundations.",
  );
  assert.equal(promptContext.currentPage.evidenceHighlights.length > 0, true);
  assert.equal(promptContext.traceability.evidenceHighlightLabels.length > 0, true);
  assert.equal(promptContext.responsePlaybook.mode, "next-read");
  assert.deepEqual(
    promptContext.siteMemory.visitedPages.map((page) => page.slug),
    ["chatgpt-enterprise"],
  );
  assert.equal(
    promptContext.siteMemory.visitorIntent?.normalizedTitle,
    "Platform Product Manager",
  );
  assert.deepEqual(promptContext.sourcePriority.slice(0, 4), [
    "currentPage.authoredContent",
    "currentPage.evidenceHighlights",
    "currentPage.claimBoundaries",
    "currentPage.structuredMetadata",
  ]);
  assert.equal(promptContext.siteCatalog.pageDirectory?.length, 9);
});
