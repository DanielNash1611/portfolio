import assert from "node:assert/strict";
import test from "node:test";
import {
  appendConversationMessages,
  clearVisitorIntent,
  createEmptyGuideSessionState,
  readGuideSessionState,
  recordPageVisit,
  recordPromptClick,
  recordQuestion,
  recordTagSignals,
  setVisitorIntent,
  writeGuideSessionState,
} from "@/lib/portfolio-guide/session";
import { GUIDE_SESSION_STORAGE_KEY } from "@/lib/portfolio-guide/constants";

function createMemoryStorage() {
  const store = new Map<string, string>();

  return {
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
  };
}

test("session state initializes empty when storage has no guide data", () => {
  const storage = createMemoryStorage();
  const state = readGuideSessionState(storage);

  assert.deepEqual(state.visitedPages, []);
  assert.deepEqual(state.clickedPrompts, []);
  assert.deepEqual(state.askedQuestions, []);
  assert.deepEqual(state.inferredInterestTags, []);
  assert.deepEqual(state.conversationsBySlug, {});
  assert.equal(state.visitorIntent, undefined);
  assert.equal(state.recommendedPath, undefined);
});

test("session helpers persist deduped page visits and guide history", () => {
  const storage = createMemoryStorage();

  let state = createEmptyGuideSessionState();
  state = recordPageVisit(state, "chatgpt-enterprise");
  state = recordPageVisit(state, "ai-platform-mcp");
  state = recordPageVisit(state, "chatgpt-enterprise");
  state = recordPromptClick(state, "Summarize this page");
  state = recordQuestion(state, "What did Daniel own?");
  state = recordTagSignals(state, ["platform", "technical-depth", "platform"]);
  state = appendConversationMessages(state, "chatgpt-enterprise", [
    {
      id: "user-1",
      role: "user",
      content: "What did Daniel own?",
      createdAt: "2026-03-28T00:00:00.000Z",
    },
    {
      id: "assistant-1",
      role: "assistant",
      content: "He led the pilot design and operating model.",
      createdAt: "2026-03-28T00:00:01.000Z",
    },
  ]);

  writeGuideSessionState(state, storage);
  const persistedState = readGuideSessionState(storage);

  assert.deepEqual(persistedState.visitedPages, [
    "ai-platform-mcp",
    "chatgpt-enterprise",
  ]);
  assert.deepEqual(persistedState.clickedPrompts, ["Summarize this page"]);
  assert.deepEqual(persistedState.askedQuestions, ["What did Daniel own?"]);
  assert.deepEqual(persistedState.inferredInterestTags, [
    "platform",
    "technical-depth",
  ]);
  assert.equal(
    persistedState.conversationsBySlug["chatgpt-enterprise"]?.length,
    2,
  );
  assert.ok(storage.getItem(GUIDE_SESSION_STORAGE_KEY));
});

test("visitor intent and recommended path can be persisted and cleared", () => {
  const storage = createMemoryStorage();

  let state = createEmptyGuideSessionState();
  state = setVisitorIntent(
    state,
    {
      rawInput: "Director of Product for AI platform work",
      normalizedTitle: "Director of Product",
      seniority: "director",
      roleLenses: ["product-leader", "builder-pm"],
      focusAreas: ["platform"],
      emphasis: ["leadership", "technical-depth"],
    },
    [
      {
        slug: "chatgpt-enterprise",
        title: "ChatGPT Enterprise from pilot to operating model",
        reason: "Strong match for leadership and enterprise AI adoption.",
        priority: 1,
      },
      {
        slug: "ai-platform-mcp",
        title: "From AI experiments to platform foundations",
        reason: "Good supporting evidence for platform and systems thinking.",
        priority: 2,
      },
    ],
  );

  writeGuideSessionState(state, storage);
  let persistedState = readGuideSessionState(storage);

  assert.equal(
    persistedState.visitorIntent?.normalizedTitle,
    "Director of Product",
  );
  assert.deepEqual(
    persistedState.recommendedPath?.map((recommendation) => recommendation.slug),
    ["chatgpt-enterprise", "ai-platform-mcp"],
  );

  persistedState = writeGuideSessionState(clearVisitorIntent(persistedState), storage);

  assert.equal(persistedState.visitorIntent, undefined);
  assert.equal(persistedState.recommendedPath, undefined);
});
