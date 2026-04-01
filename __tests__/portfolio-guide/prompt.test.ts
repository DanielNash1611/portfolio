import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPortfolioGuideInput,
  buildPortfolioGuidePromptContext,
  normalizeCopilotResponse,
  PORTFOLIO_GUIDE_SYSTEM_PROMPT,
} from "@/lib/portfolio-guide/prompt";
import type { RelatedPage } from "@/lib/portfolio-guide/types";

const fallbackRelatedPages: RelatedPage[] = [
  {
    slug: "ai-platform-mcp",
    title: "From AI experiments to platform foundations",
    href: "/work/ai-platform-mcp",
    reason: "Explicitly related from metadata.",
  },
  {
    slug: "oms-chatgpt-app",
    title: "OMS ChatGPT App",
    href: "/products/oms-chatgpt-app",
    reason: "Strong follow-on builder example.",
  },
];

test("response normalization keeps valid data and drops invalid tags or slugs", () => {
  const response = normalizeCopilotResponse(
    `\`\`\`json
    {
      "answer": "This page shows how Daniel moved from a measured pilot into a repeatable operating model.",
      "suggestedFollowUps": ["What did Daniel own here?"],
      "relatedPages": [
        { "slug": "ai-platform-mcp", "reason": "It shows the platform layer behind the rollout." },
        { "slug": "missing-page", "reason": "This should be filtered out." }
      ],
      "inferredInterestTags": ["platform", "not-a-real-tag"]
    }
    \`\`\``,
    fallbackRelatedPages,
  );

  assert.ok(response, "expected normalized response");
  assert.equal(
    response?.relatedPages?.map((page) => page.slug).join(","),
    "ai-platform-mcp",
  );
  assert.deepEqual(response?.inferredInterestTags, ["platform"]);
});

test("response normalization falls back to deterministic related pages when needed", () => {
  const response = normalizeCopilotResponse(
    `{"answer":"This project shows a focused MVP with a live alpha."}`,
    fallbackRelatedPages,
  );

  assert.ok(response, "expected normalized response");
  assert.deepEqual(
    response?.relatedPages?.map((page) => page.slug),
    ["ai-platform-mcp", "oms-chatgpt-app"],
  );
});

test("prompt input includes visitor intent and recommended path context", () => {
  const promptContext = buildPortfolioGuidePromptContext(
    {
      message: "What should I view next for this role?",
      pageContext: {
        slug: "chatgpt-enterprise",
        href: "/work/chatgpt-enterprise",
        title: "ChatGPT Enterprise from pilot to operating model",
        claimBoundaries: {
          directOwnership: ["Led the pilot and rollout framing."],
        },
        authoredSections: [
          {
            label: "Page summary",
            snippets: [
              "A controlled pilot scaled into a broader operating model.",
            ],
          },
        ],
      },
      portfolioContext: {
        portfolioSubject: {
          name: "Daniel Nash",
          shortName: "Daniel",
          authoredInFirstPerson: true,
        },
        pageDirectory: [
          {
            slug: "chatgpt-enterprise",
            title: "ChatGPT Enterprise from pilot to operating model",
            href: "/work/chatgpt-enterprise",
            oneLiner: "A controlled pilot scaled into a broader operating model.",
            evidenceHighlights: ["Measured adoption: ~1,000 users"],
            interestTags: ["platform"],
          },
        ],
        featuredProjects: [
          {
            slug: "chatgpt-enterprise",
            title: "ChatGPT Enterprise from pilot to operating model",
          },
        ],
      },
      sessionContext: {
        visitedPages: ["chatgpt-enterprise"],
        clickedPrompts: [],
        askedQuestions: ["What should I view next for this role?"],
        inferredInterestTags: ["platform"],
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
            slug: "ai-platform-mcp",
            title: "From AI experiments to platform foundations",
            reason: "Strong match for platform and systems thinking.",
            priority: 1,
          },
        ],
      },
    },
    fallbackRelatedPages,
  );
  const input = buildPortfolioGuideInput(
    {
      message: "What should I view next for this role?",
      pageContext: {
        slug: "chatgpt-enterprise",
        href: "/work/chatgpt-enterprise",
        title: "ChatGPT Enterprise from pilot to operating model",
        claimBoundaries: {
          directOwnership: ["Led the pilot and rollout framing."],
        },
        authoredSections: [
          {
            label: "Page summary",
            snippets: [
              "A controlled pilot scaled into a broader operating model.",
            ],
          },
        ],
      },
      portfolioContext: {
        portfolioSubject: {
          name: "Daniel Nash",
          shortName: "Daniel",
          authoredInFirstPerson: true,
        },
        pageDirectory: [
          {
            slug: "chatgpt-enterprise",
            title: "ChatGPT Enterprise from pilot to operating model",
            href: "/work/chatgpt-enterprise",
            oneLiner: "A controlled pilot scaled into a broader operating model.",
            evidenceHighlights: ["Measured adoption: ~1,000 users"],
            interestTags: ["platform"],
          },
        ],
        featuredProjects: [
          {
            slug: "chatgpt-enterprise",
            title: "ChatGPT Enterprise from pilot to operating model",
          },
        ],
      },
      sessionContext: {
        visitedPages: ["chatgpt-enterprise"],
        clickedPrompts: [],
        askedQuestions: ["What should I view next for this role?"],
        inferredInterestTags: ["platform"],
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
            slug: "ai-platform-mcp",
            title: "From AI experiments to platform foundations",
            reason: "Strong match for platform and systems thinking.",
            priority: 1,
          },
        ],
      },
    },
    fallbackRelatedPages,
  );

  assert.equal(
    promptContext.siteMemory.visitorIntent?.normalizedTitle,
    "Platform Product Manager",
  );
  assert.equal(promptContext.siteCatalog.portfolioSubject?.name, "Daniel Nash");
  assert.equal(promptContext.sourcePriority[0], "currentPage.authoredContent");
  assert.equal(promptContext.sourcePriority[1], "currentPage.evidenceHighlights");
  assert.equal(promptContext.responsePlaybook.mode, "next-read");
  assert.match(input, /"visitorIntent"/);
  assert.match(input, /"recommendedPath"/);
  assert.match(input, /"portfolioSubject"/);
  assert.match(input, /"pageDirectory"/);
  assert.match(input, /"evidenceHighlights"/);
  assert.match(input, /"claimBoundaries"/);
  assert.match(input, /"responsePlaybook"/);
  assert.match(input, /"sourcePriority"/);
  assert.match(input, /"currentPage"/);
  assert.match(input, /"excludedAssistantMessages"/);
});

test("prompt rules explicitly require grounded fallback when detail is missing", () => {
  assert.match(
    PORTFOLIO_GUIDE_SYSTEM_PROMPT,
    /If the current page does not explicitly state a detail, say so clearly\./,
  );
  assert.match(
    PORTFOLIO_GUIDE_SYSTEM_PROMPT,
    /Never invent metrics, ownership, rankings, causality, timelines, technologies, team size, org structure, implementation ownership, or project details\./,
  );
  assert.match(
    PORTFOLIO_GUIDE_SYSTEM_PROMPT,
    /When asked whether the page mentions a term, only say yes if currentPage\.authoredContent or currentPage\.structuredMetadata explicitly supports it\./,
  );
  assert.match(
    PORTFOLIO_GUIDE_SYSTEM_PROMPT,
    /siteCatalog\.portfolioSubject identifies who this portfolio belongs to\./,
  );
  assert.match(
    PORTFOLIO_GUIDE_SYSTEM_PROMPT,
    /For next-read recommendations, use candidateRelatedPages as broader portfolio guidance\./,
  );
  assert.match(
    PORTFOLIO_GUIDE_SYSTEM_PROMPT,
    /Do not present siteMemory, siteCatalog, or candidateRelatedPages as if they came from the current page\./,
  );
  assert.match(
    PORTFOLIO_GUIDE_SYSTEM_PROMPT,
    /Anchor major claims to concrete page evidence\./,
  );
  assert.match(
    PORTFOLIO_GUIDE_SYSTEM_PROMPT,
    /Distinguish clearly between direct ownership, influence, conceptual exploration, and implementation\./,
  );
  assert.match(
    PORTFOLIO_GUIDE_SYSTEM_PROMPT,
    /Only reference other pages when it adds clarity\. Keep the current page dominant and mention at most 2 adjacent pages\./,
  );
});
