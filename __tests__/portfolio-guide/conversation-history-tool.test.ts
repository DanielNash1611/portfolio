import assert from "node:assert/strict";
import test from "node:test";
import type OpenAI from "openai";
import { getPageContextBySlug, getPortfolioContext } from "@/lib/portfolio-guide/context";
import {
  extractAnswerFromRawFallback,
  generatePortfolioGuideResponse,
} from "@/lib/portfolio-guide/service";

test("raw model fallback keeps the answer and drops pseudo-JSON helper sections", () => {
  const answer = extractAnswerFromRawFallback(`**Answer**\n\nGrounded answer.\n\n**Suggested follow-ups**\n\n- Next question?\n\n**Related pages**\n\n- Another page`);
  assert.equal(answer, "Grounded answer.");

  const inline = extractAnswerFromRawFallback(
    "**Answer:** Grounded answer. **Suggested follow-ups:** - Next question? **Related pages:** - Another page",
  );
  assert.equal(inline, "Grounded answer.");
});

test("conversation history tool returns only callback-provided user messages and is traced", async () => {
  const calls: unknown[] = [];
  const fakeClient = {
    responses: {
      create: async (params: unknown) => {
        calls.push(params);
        if (calls.length === 1) {
          return {
            id: "resp_initial",
            usage: { input_tokens: 100, output_tokens: 10, total_tokens: 110 },
            output: [
              {
                type: "function_call",
                call_id: "call_history",
                name: "searchConversationHistory",
                arguments: JSON.stringify({ query: "platform role", maxResults: 3 }),
              },
            ],
          };
        }
        return {
          id: "resp_synthesis",
          usage: { input_tokens: 120, output_tokens: 20, total_tokens: 140 },
          output_text: JSON.stringify({
            answer: "You previously asked about the platform role.",
            suggestedFollowUps: [],
            relatedPages: [],
            inferredInterestTags: ["platform"],
          }),
          output: [],
        };
      },
    },
  } as unknown as OpenAI;
  const pageContext = getPageContextBySlug("ai-platform-mcp");
  assert.ok(pageContext);
  const result = await generatePortfolioGuideResponse(
    {
      message: "What did I ask earlier?",
      pageContext,
      portfolioContext: getPortfolioContext(),
      sessionContext: {
        visitedPages: ["ai-platform-mcp"],
        clickedPrompts: [],
        askedQuestions: [],
        inferredInterestTags: ["platform"],
      },
    },
    {
      apiKey: "test",
      model: "gpt-5.4",
      client: fakeClient,
      conversationHistorySearch: async () => [
        {
          content: "How does this fit a platform role?",
          pageSlug: "ai-platform-mcp",
          createdAt: "2026-06-17T00:00:00.000Z",
        },
      ],
    },
  );

  assert.deepEqual(result.responseIds, ["resp_initial", "resp_synthesis"]);
  const toolTrace = result.traceEvents?.find(
    (event) => event.eventName === "searchConversationHistory",
  );
  assert.ok(toolTrace);
  assert.match(JSON.stringify(toolTrace.payload), /How does this fit a platform role/);
  assert.doesNotMatch(JSON.stringify(toolTrace.payload), /assistant/i);
});
