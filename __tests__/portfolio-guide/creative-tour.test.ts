import assert from "node:assert/strict";
import test from "node:test";
import {
  getAllCanonicalPageContexts,
  getPageContextByPath,
  getPageContextBySlug,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";
import {
  normalizeVisitorIntent,
  getQuickSelectIntent,
} from "@/lib/portfolio-guide/intent";
import {
  CREATIVE_TECHNOLOGY_TOUR,
  getGuidedRecommendations,
} from "@/lib/portfolio-guide/recommendations";
import { getRelatedPages } from "@/lib/portfolio-guide/related";
import { sanitizeGuideSessionSignals } from "@/lib/portfolio-guide/public-request";
import {
  clearVisitorIntent,
  createEmptyGuideSessionState,
  readGuideSessionState,
  recordPageVisit,
  setVisitorIntent,
  writeGuideSessionState,
} from "@/lib/portfolio-guide/session";
import { inferInterestTagsFromText } from "@/lib/portfolio-guide/infer-tags";
import {
  applyPortfolioGuideResponseGuardrails,
  extractAnswerFromRawFallback,
} from "@/lib/portfolio-guide/service";
import {
  normalizeCopilotResponse,
  PORTFOLIO_GUIDE_SYSTEM_PROMPT,
} from "@/lib/portfolio-guide/prompt";
import {
  gravityAuthorship,
  tabletopPublicBoundary,
} from "@/content/creative-page-content";

const catalog = getAllCanonicalPageContexts();
const intent = getQuickSelectIntent("Creative Technology");
const path = getGuidedRecommendations(catalog, intent);

test("creative model fallback keeps follow-ups and next reads out of the answer", () => {
  const answer = "Daniel authored the composition. Astra accelerated implementation.";
  for (const extra of [
    "**Suggested follow‑ups**\n- What changed after testing?",
    "**SuggestedFollowUps:**\n- What changed after testing?",
    "**Suggested next read**\n- Tabletop Symphony.",
    "**RelatedPages:**\n- Tabletop Symphony.",
    "**InferredInterestTags**\n- creative-technology",
  ]) {
    assert.equal(extractAnswerFromRawFallback(`**Answer**\n${answer}\n\n${extra}`), answer);
  }
  assert.equal(
    extractAnswerFromRawFallback("The suggested next read is Tabletop Symphony."),
    "The suggested next read is Tabletop Symphony.",
  );
});

test("creative preset and freeform interests do not invent a seniority level", () => {
  for (const text of [
    "Creative Technology",
    "creative technologist",
    "interactive experiences",
    "immersive experiences",
    "spatial music",
    "adaptive music",
    "creative technology for group play and leadership development",
  ]) {
    const normalized = normalizeVisitorIntent(text);
    assert.ok(normalized, text);
    assert.ok(normalized?.focusAreas?.includes("creative-technology"), text);
    assert.equal(normalized.seniority, undefined, text);
    assert.ok(normalized.roleLenses?.includes("builder-pm"));
    assert.ok(inferInterestTagsFromText(text).includes("creative-technology"));
    assert.deepEqual(
      getGuidedRecommendations(catalog, normalized).map((p) => p.slug),
      path.map((p) => p.slug),
    );
  }
  assert.equal(
    normalizeVisitorIntent("Director of Creative Technology")?.seniority,
    "director",
  );
});

test("creative tour includes all five distinct steps in editorial order", () => {
  assert.deepEqual(
    path.map((p) => p.slug),
    [
      "gravity-astra",
      "tabletop-symphony",
      "ai-career-operating-system",
      "the-side-of-ai-i-want-to-be-on",
      "chatgpt-enterprise",
    ],
  );
  assert.deepEqual(
    path.map((p) => p.priority),
    [1, 2, 3, 4, 5],
  );
  assert.equal(new Set(path.map((p) => p.reason)).size, 5);
  assert.match(path[1].reason, /private alpha/);
});

test("creative recommendations honor exclusions, limits, and missing catalog entries", () => {
  const result = getGuidedRecommendations(
    catalog.filter((p) => p.slug !== "tabletop-symphony"),
    intent,
    { excludeSlugs: ["gravity-astra"], limit: 2 },
  );
  assert.deepEqual(
    result.map((p) => p.slug),
    ["ai-career-operating-system", "the-side-of-ai-i-want-to-be-on"],
  );
  assert.deepEqual(
    result.map((p) => p.priority),
    [1, 2],
  );
});

test("the five existing presets preserve their complete recommendation order", () => {
  const expected = {
    "AI Product Manager": [
      "ai-platform-mcp",
      "ai-career-operating-system",
      "immunology-scout",
      "chatgpt-enterprise",
    ],
    "Group PM": [
      "chatgpt-enterprise",
      "the-side-of-ai-i-want-to-be-on",
      "ai-strategy",
      "product-philosophy",
    ],
    "Director of Product": [
      "chatgpt-enterprise",
      "jira-product-discovery",
      "product-philosophy",
      "ai-strategy",
    ],
    "Platform PM": [
      "ai-platform-mcp",
      "ai-career-operating-system",
      "chatgpt-enterprise",
      "immunology-scout",
    ],
    "0-to-1 AI Builder": [
      "immunology-scout",
      "oms-chatgpt-app",
      "ai-platform-mcp",
      "launchmuse",
    ],
  };
  for (const [label, slugs] of Object.entries(expected)) {
    assert.deepEqual(
      getGuidedRecommendations(catalog, normalizeVisitorIntent(label)!, {
        featuredSlugs: getPortfolioContext().featuredProjects?.map(
          (p) => p.slug,
        ),
      }).map((p) => p.slug),
      slugs,
      label,
    );
  }
});

test("creative routes resolve canonically and ground authorship in shared public copy", () => {
  const gravity = getPageContextByPath("/creative/gravity/astra/?from=home");
  const tabletop = getPageContextByPath("/creative/tabletop-symphony");
  assert.equal(gravity?.slug, "gravity-astra");
  assert.equal(tabletop?.slug, "tabletop-symphony");
  assert.equal(gravity?.projectType, "creative-experience");
  assert.ok(
    JSON.stringify(gravity?.authoredSections).includes(
      gravityAuthorship.responsible,
    ),
  );
  assert.ok(
    JSON.stringify(tabletop?.authoredSections).includes(
      tabletopPublicBoundary.private,
    ),
  );
  assert.match(JSON.stringify(gravity?.claimBoundaries), /sole hand-coding/);
  assert.match(
    JSON.stringify(tabletop?.claimBoundaries),
    /commercial adoption/,
  );
  assert.equal(gravity?.senioritySignals, undefined);
  assert.equal(tabletop?.metrics, undefined);
});

test("next reads advance through all unvisited creative tour steps", () => {
  for (let index = 0; index < path.length - 1; index++) {
    const current = getPageContextBySlug(path[index].slug)!;
    const related = getRelatedPages(current, getPortfolioContext(), {
      visitedPages: path.slice(0, index + 1).map((p) => p.slug),
      clickedPrompts: [],
      askedQuestions: [],
      inferredInterestTags: ["creative-technology"],
      visitorIntent: intent,
      recommendedPath: path,
    });
    assert.equal(related[0].slug, path[index + 1].slug);
    assert.ok(related.every((p) => p.slug !== current.slug));
    const guarded = applyPortfolioGuideResponseGuardrails({
      request: {
        message: "What should I view next for this role?",
        pageContext: current,
        portfolioContext: getPortfolioContext(),
        sessionContext: {
          visitedPages: path.slice(0, index + 1).map((p) => p.slug),
          clickedPrompts: [],
          askedQuestions: [],
          inferredInterestTags: [],
          visitorIntent: intent,
        },
      },
      response: {
        answer: "Skip ahead to enterprise proof.",
        relatedPages: related.slice(-1),
      },
      fallbackRelatedPages: related,
    });
    assert.equal(guarded.relatedPages?.[0].slug, path[index + 1].slug);
    assert.ok(guarded.answer.indexOf(path[index + 1].title) >= 0);
  }
});

test("creative intent and all five steps survive storage and server sanitization", () => {
  assert.ok(PORTFOLIO_GUIDE_SYSTEM_PROMPT.includes('"creative-technology"'));
  assert.deepEqual(
    normalizeCopilotResponse(
      JSON.stringify({
        answer: "Grounded creative response.",
        inferredInterestTags: ["creative-technology", "invalid"],
      }),
      [],
    )?.inferredInterestTags,
    ["creative-technology"],
  );
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
  const state = recordPageVisit(
    setVisitorIntent(createEmptyGuideSessionState(), intent, path),
    "gravity-astra",
  );
  writeGuideSessionState(state, storage);
  const restored = readGuideSessionState(storage);
  assert.deepEqual(
    restored.recommendedPath?.map((p) => p.slug),
    CREATIVE_TECHNOLOGY_TOUR.map((p) => p.slug),
  );
  const sanitized = sanitizeGuideSessionSignals({
    ...restored,
    inferredInterestTags: ["creative-technology", "invalid"],
  });
  assert.deepEqual(sanitized.inferredInterestTags, ["creative-technology"]);
  assert.equal(sanitized.visitorIntent?.seniority, undefined);
  assert.equal(sanitized.recommendedPath?.length, 5);
  assert.equal(clearVisitorIntent(restored).recommendedPath, undefined);
  assert.equal(clearVisitorIntent(restored).visitorIntent, undefined);
});
