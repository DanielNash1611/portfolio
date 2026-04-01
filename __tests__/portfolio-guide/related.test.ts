import assert from "node:assert/strict";
import test from "node:test";
import {
  getAllCanonicalPageContexts,
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import { normalizeVisitorIntent } from "@/lib/portfolio-guide/intent";
import { getGuidedRecommendations } from "@/lib/portfolio-guide/recommendations";
import { getRelatedPages } from "@/lib/portfolio-guide/related";

test("related pages prefer explicit metadata ordering when pages are unseen", () => {
  const pageContext = getPageContextBySlug("chatgpt-enterprise");
  assert.ok(pageContext, "expected canonical page context");

  const relatedPages = getRelatedPages(pageContext, getPortfolioContext(), {
    visitedPages: ["chatgpt-enterprise"],
    clickedPrompts: [],
    askedQuestions: [],
    inferredInterestTags: [],
  });

  assert.deepEqual(
    relatedPages.map((page) => page.slug),
    ["ai-platform-mcp", "oms-chatgpt-app"],
  );
  assert.match(
    relatedPages[0]?.reason ?? "",
    /This case pairs with AI Platform MCP/i,
  );
});

test("related pages deprioritize already visited slugs when unseen options exist", () => {
  const pageContext = getPageContextBySlug("chatgpt-enterprise");
  assert.ok(pageContext, "expected canonical page context");

  const relatedPages = getRelatedPages(pageContext, getPortfolioContext(), {
    visitedPages: ["chatgpt-enterprise", "ai-platform-mcp"],
    clickedPrompts: [],
    askedQuestions: [],
    inferredInterestTags: [],
  });

  assert.equal(relatedPages[0]?.slug, "oms-chatgpt-app");
});

test("guided recommendations rank the strongest homepage path for a platform role", () => {
  const visitorIntent = normalizeVisitorIntent("Platform PM");
  assert.ok(visitorIntent, "expected visitor intent");

  const recommendedPath = getGuidedRecommendations(
    getAllCanonicalPageContexts(),
    visitorIntent,
    {
      featuredSlugs:
        getPortfolioContext().featuredProjects?.map((project) => project.slug) ?? [],
    },
  );

  assert.equal(recommendedPath[0]?.slug, "ai-platform-mcp");
  assert.match(
    recommendedPath[0]?.reason ?? "",
    /Evidence includes .*(hackathon|87%)/i,
  );
  assert.ok(
    recommendedPath.slice(0, 3).some((recommendation) => recommendation.slug === "chatgpt-enterprise"),
  );
});

test("related pages boost the remaining guided path for the declared role", () => {
  const pageContext = getPageContextBySlug("chatgpt-enterprise");
  const visitorIntent = normalizeVisitorIntent("Platform PM");
  assert.ok(pageContext, "expected canonical page context");
  assert.ok(visitorIntent, "expected visitor intent");

  const relatedPages = getRelatedPages(pageContext, getPortfolioContext(), {
    visitedPages: ["chatgpt-enterprise", "ai-platform-mcp"],
    clickedPrompts: [],
    askedQuestions: [],
    inferredInterestTags: [],
    visitorIntent,
    recommendedPath: [
      {
        slug: "ai-platform-mcp",
        title: "From AI experiments to platform foundations",
        reason: "Strong match for platform and systems thinking.",
        priority: 1,
      },
      {
        slug: "oms-chatgpt-app",
        title: "OMS ChatGPT App",
        reason: "Good supporting evidence for AI builder work inside enterprise workflows.",
        priority: 2,
      },
    ],
  });

  assert.equal(relatedPages[0]?.slug, "oms-chatgpt-app");
});

test("essay pages recommend linked proof pages first", () => {
  const pageContext = getPageContextBySlug("ai-strategy");
  assert.ok(pageContext, "expected essay page context");

  const relatedPages = getRelatedPages(pageContext, getPortfolioContext(), {
    visitedPages: ["ai-strategy"],
    clickedPrompts: [],
    askedQuestions: [],
    inferredInterestTags: [],
  });

  assert.deepEqual(
    relatedPages.map((page) => page.slug),
    ["chatgpt-enterprise", "ai-platform-mcp"],
  );
  assert.match(
    relatedPages[0]?.reason ?? "",
    /This essay pairs with ChatGPT Enterprise/i,
  );
});

test("essays stay secondary to concrete proof in guided recommendations", () => {
  const recommendedPath = getGuidedRecommendations(
    getAllCanonicalPageContexts(),
    {
      rawInput: "Director of Product",
      normalizedTitle: "Director of Product",
      seniority: "director",
      roleLenses: ["product-leader"],
      emphasis: ["leadership", "scale"],
    },
    {
      featuredSlugs:
        getPortfolioContext().featuredProjects?.map((project) => project.slug) ?? [],
    },
  );

  assert.notEqual(recommendedPath[0]?.slug, "product-philosophy");
  assert.ok(
    recommendedPath.slice(0, 4).some((recommendation) => recommendation.slug === "product-philosophy"),
  );
});

test("connected essays surface only after stronger proof pages are exhausted", () => {
  const pageContext = getPageContextBySlug("chatgpt-enterprise");
  assert.ok(pageContext, "expected canonical page context");

  const relatedPages = getRelatedPages(pageContext, getPortfolioContext(), {
    visitedPages: [
      "chatgpt-enterprise",
      "ai-platform-mcp",
      "oms-chatgpt-app",
      "checkout-redesign",
    ],
    clickedPrompts: [],
    askedQuestions: [],
    inferredInterestTags: [],
  });

  assert.equal(relatedPages[0]?.slug, "ai-strategy");
});
