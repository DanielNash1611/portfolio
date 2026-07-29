import assert from "node:assert/strict";
import test from "node:test";
import {
  createPortfolioGuideConversationStore,
  hashConversationAccessToken,
} from "@/lib/portfolio-guide/conversation-store";

test("conversation tokens are never sent to storage in raw form", async () => {
  const calls: Array<{ query: string; params?: unknown[] }> = [];
  const store = createPortfolioGuideConversationStore({
    sql: {
      query: async (query, params) => {
        calls.push({ query, params });
        return [
          {
            id: "11111111-1111-1111-1111-111111111111",
            session_memory: {},
            created_at: "2026-06-18T00:00:00.000Z",
            updated_at: "2026-06-18T00:00:00.000Z",
            expires_at: "2026-09-16T00:00:00.000Z",
          },
        ];
      },
    },
  });

  const created = await store.create();
  assert.equal(created.token.length > 32, true);
  assert.equal(calls[0].params?.includes(created.token), false);
  assert.equal(calls[0].params?.[1], hashConversationAccessToken(created.token));
});

test("answered client turn ids return the stored response without a new model turn", async () => {
  let queryCount = 0;
  const store = createPortfolioGuideConversationStore({
    sql: {
      query: async () => {
        queryCount += 1;
        return [
          {
            id: "turn-id",
            request_id: "request-id",
            response_status: "answered",
            response_payload: { answer: "Stored answer" },
            turn_index: 3,
          },
        ];
      },
    },
  });

  const result = await store.beginTurn({
    conversationId: "conversation-id",
    clientTurnId: "client-turn-id",
    ipHash: "ip-hash",
    model: "gpt-5.4",
    promptVersion: "test",
    request: {
      message: "Retry",
      pageContext: { slug: "ai-platform-mcp", href: "/work/ai-platform-mcp", title: "AI" },
      portfolioContext: {},
      sessionContext: {
        visitedPages: [],
        clickedPrompts: [],
        askedQuestions: [],
        inferredInterestTags: [],
      },
    },
  });

  assert.equal(result.kind, "existing");
  assert.equal(queryCount, 1);
  if (result.kind === "existing") {
    assert.equal(result.response.answer, "Stored answer");
    assert.equal(result.turnIndex, 3);
  }
});

test("a pending client turn prevents concurrent model work", async () => {
  const store = createPortfolioGuideConversationStore({
    sql: {
      query: async () => [
        {
          id: "turn-id",
          request_id: "request-id",
          response_status: "pending",
          response_payload: null,
          turn_index: 2,
        },
      ],
    },
  });
  const result = await store.beginTurn({
    conversationId: "conversation-id",
    clientTurnId: "same-client-turn",
    ipHash: "ip-hash",
    model: "gpt-5.4",
    promptVersion: "test",
    request: {
      message: "Retry",
      pageContext: { slug: "ai-platform-mcp", href: "/work/ai-platform-mcp", title: "AI" },
      portfolioContext: {},
      sessionContext: {
        visitedPages: [],
        clickedPrompts: [],
        askedQuestions: [],
        inferredInterestTags: [],
      },
    },
  });
  assert.equal(result.kind, "in_progress");
});

test("an errored idempotent turn can restart without creating a second turn", async () => {
  const calls: Array<{ query: string; params?: unknown[] }> = [];
  const store = createPortfolioGuideConversationStore({
    sql: {
      query: async (query, params) => {
        calls.push({ query, params });
        if (query.includes("SELECT id, request_id, response_status")) {
          return [
            {
              id: "turn-id",
              request_id: "failed-request-id",
              response_status: "errored",
              response_payload: null,
              turn_index: 4,
              prompt_text: "Retry this question",
              page_slug: "ai-platform-mcp",
              error_code: "model_timeout",
            },
          ];
        }
        if (query.includes("COUNT(*)::int AS count")) {
          return [{ count: 0 }];
        }
        if (query.includes("SET request_id = $2")) {
          return [{ id: "turn-id", turn_index: 4 }];
        }
        return [];
      },
    },
  });

  const result = await store.beginTurn({
    conversationId: "conversation-id",
    clientTurnId: "same-client-turn",
    ipHash: "ip-hash",
    model: "gpt-5.4",
    promptVersion: "test",
    request: {
      message: "Retry this question",
      pageContext: {
        slug: "ai-platform-mcp",
        href: "/work/ai-platform-mcp",
        title: "AI",
      },
      portfolioContext: {},
      sessionContext: {
        visitedPages: [],
        clickedPrompts: [],
        askedQuestions: [],
        inferredInterestTags: [],
      },
    },
  });

  assert.equal(result.kind, "started");
  if (result.kind === "started") {
    assert.equal(result.interactionId, "turn-id");
    assert.equal(result.turnIndex, 4);
    assert.notEqual(result.requestId, "failed-request-id");
  }
  assert.equal(
    calls.some((call) => call.query.includes("'turn.retry'")),
    true,
  );
});

test("restored conversation maps every completed turn into user and assistant messages", async () => {
  const store = createPortfolioGuideConversationStore({
    sql: {
      query: async () => [
        {
          id: "turn-1",
          prompt_text: "What matters here?",
          assistant_text: "The workflow evidence.",
          created_at: "2026-06-18T00:00:00.000Z",
          completed_at: "2026-06-18T00:00:01.000Z",
          page_slug: "ai-platform-mcp",
          page_title: "AI platform foundations",
          suggested_follow_ups: ["What did Daniel own?"],
          related_pages: [],
        },
      ],
    },
  });
  const messages = await store.loadMessages("conversation-id");
  assert.deepEqual(messages.map((message) => message.role), ["user", "assistant"]);
  assert.equal(messages[0].pageSlug, "ai-platform-mcp");
  assert.equal(messages[1].suggestedFollowUps?.[0], "What did Daniel own?");
});
