import test from "node:test";
import assert from "node:assert/strict";
import { emptyDraft } from "../../lib/product-workspace/model";
import {
  applySuggestions,
  emptySuggestions,
  groundedSuggestions,
  parseSuggestionInput,
  suggestionInput,
} from "../../lib/product-workspace/suggestions";
import {
  createSuggestionLimiter,
  matchesRequestHost,
  readBoundedJson,
} from "../../lib/product-workspace/suggestion-limits";
import { NextRequest } from "next/server";
import { POST } from "../../app/api/product-workspace/suggest/route";

test("only the disclosed context is sent, bounded and validated", () => {
  const draft = emptyDraft();
  draft.fields.idea = "Add voice commands.";
  draft.fields.evidence = "PRIVATE evidence";
  draft.fields.repo = "PRIVATE repo";
  draft.fields.agentNotes = "PRIVATE instructions";
  draft.fields.mustPreserve = "PRIVATE product constraints";
  draft.fields.contextOwner = "PRIVATE owner";
  draft.fields.contextReviewed = "PRIVATE revision";
  const input = suggestionInput(draft);
  assert.doesNotMatch(JSON.stringify(input), /PRIVATE/);
  assert.deepEqual(parseSuggestionInput(input), input);
  assert.equal(parseSuggestionInput({ ...input, open: {} }), null);
  assert.equal(
    parseSuggestionInput({
      ...input,
      notes: { ...input.notes, idea: "x".repeat(2401) },
    }),
    null,
  );
  assert.equal(
    parseSuggestionInput({
      ...input,
      notes: {
        ...input.notes,
        idea: "x".repeat(2400),
        audience: "x".repeat(2400),
        outcome: "x".repeat(2400),
      },
    }),
    null,
  );
});
test("unverifiable or invented text is dropped; solution-only notes keep opportunities empty", () => {
  const draft = emptyDraft();
  draft.fields.idea = "Add voice commands.";
  const input = suggestionInput(draft);
  const result = groundedSuggestions(
    {
      ...emptySuggestions(),
      opportunity: {
        text: "People cannot use their hands",
        sourceField: "idea",
        quote: draft.fields.idea,
      },
      solution: {
        text: "Add voice commands.",
        sourceField: "idea",
        quote: draft.fields.idea,
      },
      audience: { text: "People", sourceField: "missing", quote: "People" },
    },
    input,
  );
  assert.equal(result.opportunity, null);
  assert.equal(result.audience, null);
  assert.equal(result.solution?.text, draft.fields.idea);
  const next = applySuggestions(
    draft,
    result,
    ["opportunity", "solution"],
    JSON.stringify(draft),
  );
  assert.equal(next.opportunities[0].title, "");
  assert.equal(next.solutions[0].opportunityId, null);
  assert.equal(next.solutions[0].state, "");
});
test("only selected suggestions fill open fields and supported new connections", () => {
  const draft = emptyDraft();
  draft.fields.idea =
    "New teammates cannot find guides. Add search to address this.";
  draft.fields.audience = "Keep this audience";
  draft.opportunities[0].state = "Discovery";
  const quote = { sourceField: "idea" as const, quote: draft.fields.idea };
  const suggestions = groundedSuggestions(
    {
      ...emptySuggestions(),
      audience: { ...quote, text: "New teammates" },
      opportunity: { ...quote, text: "New teammates cannot find guides." },
      solution: { ...quote, text: "Add search" },
      connection: quote,
    },
    suggestionInput(draft),
  );
  assert.equal(suggestions.audience, null);
  const selected = applySuggestions(
    draft,
    suggestions,
    ["opportunity"],
    JSON.stringify(draft),
  );
  assert.equal(selected.solutions[0].title, "");
  assert.equal(selected.solutions[0].opportunityId, null);
  const next = applySuggestions(
    draft,
    suggestions,
    ["opportunity", "solution", "audience"],
    JSON.stringify(draft),
  );
  assert.equal(next.fields.audience, "Keep this audience");
  assert.equal(next.opportunities[0].state, "Discovery");
  assert.equal(next.solutions[0].state, "");
  assert.equal(next.solutions[0].opportunityId, next.opportunities[0].id);
  assert.equal(draft.opportunities[0].title, "");
  const changed = {
    ...draft,
    fields: { ...draft.fields, idea: "My new idea" },
  };
  assert.equal(
    applySuggestions(
      changed,
      suggestions,
      ["opportunity", "solution"],
      JSON.stringify(draft),
    ),
    changed,
  );
});
test("existing nodes, links, and duplicate titles are preserved", () => {
  const draft = emptyDraft();
  draft.fields.idea = "Add voice commands.";
  draft.solutions[0].title = "Add voice commands.";
  draft.solutions.push({
    id: "solution-2",
    title: "",
    state: "",
    opportunityId: "opportunity-1",
  });
  const result = groundedSuggestions(
    {
      ...emptySuggestions(),
      solution: {
        sourceField: "idea",
        quote: draft.fields.idea,
        text: draft.fields.idea,
      },
    },
    suggestionInput(draft),
  );
  assert.equal(result.solution, null);
  assert.deepEqual(
    applySuggestions(draft, result, ["solution"], JSON.stringify(draft)),
    draft,
  );
});
test("suggestion limits expire and bound both per-client and total requests", () => {
  const limit = createSuggestionLimiter();
  for (let i = 0; i < 8; i++) assert.equal(limit("client", 1000), 0);
  assert.equal(limit("client", 1000), 600);
  assert.equal(limit("client", 601001), 0);
  const global = createSuggestionLimiter();
  for (let i = 0; i < 40; i++) assert.equal(global(String(i), 1000), 0);
  assert.equal(global("new", 1000), 600);
});
test("oversized request bodies are rejected while streaming", async () => {
  await assert.rejects(
    readBoundedJson(
      new Request("http://localhost", {
        method: "POST",
        body: "x".repeat(33000),
      }),
    ),
  );
  assert.deepEqual(
    await readBoundedJson(
      new Request("http://localhost", {
        method: "POST",
        body: '{"idea":"hello"}',
      }),
    ),
    { idea: "hello" },
  );
});
test("API rejects cross-origin and invalid requests, and blank notes need no model", async () => {
  const request = (body: unknown, origin = "http://localhost:3001") =>
    new NextRequest("http://localhost:3001/api/product-workspace/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: origin },
      body: JSON.stringify(body),
    });
  const blank = suggestionInput(emptyDraft());
  assert.equal(
    (await POST(request(blank, "https://unrelated.example"))).status,
    403,
  );
  assert.equal((await POST(request({}))).status, 400);
  const response = await POST(request(blank));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).suggestions, emptySuggestions());
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("the phone Origin matches its HTTP Host even when Next uses an internal bind address", async () => {
  const request = (origin: string, host = "192.168.4.26:3001") =>
    new NextRequest("http://0.0.0.0:3001/api/product-workspace/suggest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
        Host: host,
      },
      body: JSON.stringify(suggestionInput(emptyDraft())),
    });
  assert.equal(matchesRequestHost(request("http://192.168.4.26:3001")), true);
  assert.equal(matchesRequestHost(request("https://unrelated.example")), false);
  assert.equal(
    matchesRequestHost(request("http://192.168.4.26:3001/path")),
    false,
  );
  assert.equal(matchesRequestHost(request("https://192.168.4.26:3001")), false);
  assert.equal((await POST(request("http://192.168.4.26:3001"))).status, 200);
  assert.equal((await POST(request("https://unrelated.example"))).status, 403);
});
