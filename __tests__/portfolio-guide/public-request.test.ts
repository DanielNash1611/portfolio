import assert from "node:assert/strict";
import test from "node:test";
import {
  mergeGuideSessionSignals,
  parsePortfolioGuideTurnRequest,
} from "@/lib/portfolio-guide/public-request";

test("public turn requests accept only the narrow server-owned grounding contract", () => {
  const parsed = parsePortfolioGuideTurnRequest({
    clientTurnId: "12345678-abcd",
    pageSlug: "ai-platform-mcp",
    message: "What did Daniel own?",
    source: "input",
    pageContext: { title: "Client-injected title" },
    portfolioContext: { bioSummary: "Client-injected bio" },
    sessionSignals: {
      visitedPages: ["checkout-redesign"],
      inferredInterestTags: ["platform", "not-a-real-tag"],
    },
  });

  assert.ok(parsed);
  assert.equal(parsed.pageSlug, "ai-platform-mcp");
  assert.deepEqual(parsed.sessionSignals.inferredInterestTags, ["platform"]);
  assert.equal("pageContext" in parsed, false);
  assert.equal("portfolioContext" in parsed, false);
});

test("public turn requests reject oversize messages and legacy payloads", () => {
  assert.equal(
    parsePortfolioGuideTurnRequest({
      message: "x".repeat(4001),
      pageSlug: "ai-platform-mcp",
      source: "input",
      clientTurnId: "12345678-abcd",
    }),
    null,
  );
  assert.equal(
    parsePortfolioGuideTurnRequest({ message: "Hello", pageContext: {} }),
    null,
  );
});

test("session memory merge is bounded, site-wide, and preserves role intent", () => {
  const merged = mergeGuideSessionSignals(
    {
      visitedPages: ["checkout-redesign"],
      clickedPrompts: [],
      askedQuestions: [],
      inferredInterestTags: ["platform"],
      visitorIntent: { rawInput: "Director of AI Product", seniority: "director" },
    },
    {
      visitedPages: ["chatgpt-enterprise"],
      clickedPrompts: [],
      askedQuestions: [],
      inferredInterestTags: ["ai-builder"],
    },
    "ai-platform-mcp",
    "What is most relevant?",
  );

  assert.deepEqual(merged.visitedPages, [
    "checkout-redesign",
    "chatgpt-enterprise",
    "ai-platform-mcp",
  ]);
  assert.equal(merged.visitorIntent?.rawInput, "Director of AI Product");
  assert.equal(merged.askedQuestions.at(-1), "What is most relevant?");
});
