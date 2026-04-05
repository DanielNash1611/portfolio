import assert from "node:assert/strict";
import test from "node:test";
import {
  createPortfolioGuideInteractionLogger,
} from "@/lib/portfolio-guide/interaction-log";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";

function createRequest(): CopilotRequest {
  return {
    message: "What did Daniel own here?",
    pageContext: {
      slug: "ai-platform-mcp",
      href: "/work/ai-platform-mcp",
      title: "From AI experiments to platform foundations",
    },
    portfolioContext: {},
    sessionContext: {
      visitedPages: ["home", "ai-platform-mcp"],
      clickedPrompts: ["What are the strongest signals on this page?"],
      askedQuestions: ["What did Daniel own here?"],
      inferredInterestTags: ["platform", "technical-depth"],
      visitorIntent: {
        rawInput: "Director of Product for AI platform work",
        normalizedTitle: "Director of Product",
        seniority: "director",
        focusAreas: ["platform"],
      },
      recommendedPath: [
        {
          slug: "chatgpt-enterprise",
          title: "ChatGPT Enterprise from pilot to operating model",
          reason: "Strong match for operating model and adoption evidence.",
          priority: 1,
        },
      ],
    },
    interactionMeta: {
      source: "input",
      visitorId: "visitor_123",
      sessionId: "session_123",
      turnIndex: 2,
    },
  };
}

test("interaction logger stores prompt-only request metadata and response summary", async () => {
  const queries: Array<{ query: string; params?: unknown[] }> = [];
  const logger = createPortfolioGuideInteractionLogger({
    sql: {
      query: async (query, params) => {
        queries.push({ query, params });
        return [];
      },
    },
    appEnv: "local",
    databaseBranchName: "development",
  });

  await logger.start({
    requestId: "req_1",
    request: createRequest(),
    model: "gpt-5",
  });
  await logger.finish({
    requestId: "req_1",
    status: "answered",
    model: "gpt-5",
    latencyMs: 321,
    answerLength: 84,
  });

  assert.equal(queries.length, 2);

  const insertParams = queries[0].params ?? [];
  assert.equal(insertParams[1], "req_1");
  assert.equal(insertParams[2], "local");
  assert.equal(insertParams[3], "development");
  assert.equal(insertParams[4], "visitor_123");
  assert.equal(insertParams[5], "session_123");
  assert.equal(insertParams[6], "ai-platform-mcp");
  assert.equal(insertParams[8], "input");
  assert.equal(insertParams[9], "What did Daniel own here?");
  assert.deepEqual(insertParams[16], ["platform", "technical-depth"]);
  assert.deepEqual(insertParams[18], ["chatgpt-enterprise"]);
  assert.equal(insertParams[19], "gpt-5");
  assert.equal(insertParams[20], "pending");

  const updateParams = queries[1].params ?? [];
  assert.deepEqual(updateParams, [
    "req_1",
    "gpt-5",
    "answered",
    321,
    84,
    null,
  ]);
});

