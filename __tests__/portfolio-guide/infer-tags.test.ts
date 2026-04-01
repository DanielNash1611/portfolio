import assert from "node:assert/strict";
import test from "node:test";
import { getSessionAwarePrompt, inferInterestTags } from "@/lib/portfolio-guide/infer-tags";
import { createEmptyGuideSessionState } from "@/lib/portfolio-guide/session";
import type { PageContext } from "@/lib/portfolio-guide/types";

const platformPage: PageContext = {
  slug: "ai-platform-mcp",
  href: "/work/ai-platform-mcp",
  title: "From AI experiments to platform foundations",
  category: "AI platform strategy",
  oneLiner:
    "Turned early AI validation into reusable systems, retrieval, and connector patterns.",
  tags: ["AI Platform", "MCP", "RAG"],
  interestTags: ["platform", "technical-depth", "ai-builder"],
};

test("interest tags can be inferred from page context and typed questions", () => {
  const tags = inferInterestTags({
    pageContext: platformPage,
    text: "Show the most technical depth and MCP platform work",
  });

  assert.deepEqual(tags.sort(), [
    "ai-builder",
    "platform",
    "technical-depth",
  ]);
});

test("session-aware prompt appears after multiple project views", () => {
  const state = createEmptyGuideSessionState();
  state.visitedPages = ["chatgpt-enterprise", "ai-platform-mcp"];
  state.tagSignals = ["platform", "platform", "technical-depth"];

  assert.equal(
    getSessionAwarePrompt(state, "ai-platform-mcp"),
    "What should I read for platform and systems work?",
  );
});

test("session-aware prompt becomes role-aware when visitor intent exists", () => {
  const state = createEmptyGuideSessionState();
  state.visitorIntent = {
    rawInput: "Director of Product",
    normalizedTitle: "Director of Product",
    seniority: "director",
    roleLenses: ["product-leader"],
    emphasis: ["leadership", "scale"],
  };
  state.recommendedPath = [
    {
      slug: "chatgpt-enterprise",
      title: "ChatGPT Enterprise from pilot to operating model",
      reason: "Strong match for leadership and scale.",
      priority: 1,
    },
    {
      slug: "jira-product-discovery",
      title: "Jira Product Discovery adoption",
      reason: "Strong match for operating model and enablement work.",
      priority: 2,
    },
  ];
  state.visitedPages = ["chatgpt-enterprise", "jira-product-discovery"];

  assert.equal(
    getSessionAwarePrompt(state),
    "What is the strongest remaining evidence for this role elsewhere on the site?",
  );
});
