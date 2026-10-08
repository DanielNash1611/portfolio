import test from "node:test";
import assert from "node:assert/strict";
import {
  contextMarkdown,
  emptyDraft,
  hasDraftContent,
  parseDraft,
  productMarkdown,
} from "../../lib/product-workspace/model";

test("a completely blank workspace is valid and preserves open nodes", () => {
  const draft = emptyDraft();
  assert.deepEqual(parseDraft(JSON.parse(JSON.stringify(draft))), draft);
  assert.equal(hasDraftContent(draft), false);
  assert.equal(draft.opportunities[0].title, "");
  assert.equal(draft.solutions[0].title, "");
  assert.equal(draft.solutions[0].opportunityId, null);
  assert.match(productMarkdown(draft), /Open — add when known/);
});
test("a solution-only idea does not silently invent an opportunity", () => {
  const draft = emptyDraft();
  draft.fields.idea = "Add voice commands.";
  draft.solutions[0].title = "Voice commands";
  const restored = parseDraft(draft)!;
  assert.equal(restored.opportunities[0].title, "");
  assert.equal(restored.solutions[0].opportunityId, null);
  assert.match(productMarkdown(restored), /Solutions with an open opportunity/);
});
test("existing v1 drafts retain their content and get empty optional context fields", () => {
  const saved = JSON.parse(JSON.stringify(emptyDraft()));
  saved.fields.idea = "Preserve this older draft";
  saved.fields.experience = "Enter, explore, return";
  delete saved.fields.mustPreserve;
  delete saved.fields.contextOwner;
  delete saved.fields.contextReviewed;
  const restored = parseDraft(saved)!;
  assert.equal(restored.fields.idea, saved.fields.idea);
  assert.equal(restored.fields.experience, saved.fields.experience);
  assert.equal(restored.fields.mustPreserve, "");
  assert.equal(restored.fields.contextOwner, "");
  assert.equal(restored.fields.contextReviewed, "");
  assert.deepEqual(restored.opportunities, saved.opportunities);
  assert.deepEqual(restored.solutions, saved.solutions);
  assert.equal(
    parseDraft({ ...saved, fields: { ...saved.fields, mustPreserve: null } }),
    null,
  );
  assert.equal(
    parseDraft({
      ...saved,
      fields: { ...saved.fields, contextReviewed: "x".repeat(2401) },
    }),
    null,
  );
  delete saved.fields.idea;
  assert.equal(parseDraft(saved), null);
});
test("persistent-context exports carry intent and review provenance without inventing freshness", () => {
  const draft = emptyDraft();
  draft.fields.experience = "Cello → performers → explore → cello";
  draft.fields.mustPreserve =
    "Independent timelines, to preserve the composition";
  draft.fields.contextOwner = "Product and engineering";
  draft.fields.contextReviewed = "Reviewed 2026-10-01, revision 3";
  draft.fields.repo = "product/definition.md";
  const restored = parseDraft(JSON.parse(JSON.stringify(draft)))!;
  const definition = productMarkdown(restored);
  const context = contextMarkdown(restored);
  for (const text of [
    draft.fields.experience,
    draft.fields.mustPreserve,
    draft.fields.contextOwner,
    draft.fields.contextReviewed,
    draft.fields.repo,
  ]) {
    assert.ok(definition.includes(text));
  }
  assert.ok(context.includes(draft.fields.contextOwner));
  assert.ok(context.includes(draft.fields.contextReviewed));
  assert.match(context, /at the start of each new session/);
  assert.match(context, /During implementation/);
  assert.match(context, /walk the whole user flow/);
  assert.match(
    contextMarkdown(emptyDraft()),
    /## Last reviewed or source revision\n_Open — add when known\._/,
  );
});
test("node states and connections survive restoration independently", () => {
  const draft = emptyDraft();
  draft.opportunities[0] = {
    id: "opportunity-1",
    title: "Reliable guidance",
    state: "Validated",
  };
  draft.solutions[0] = {
    id: "solution-1",
    title: "Show review dates",
    state: "Impact",
    opportunityId: "opportunity-1",
  };
  assert.deepEqual(parseDraft(JSON.parse(JSON.stringify(draft))), draft);
  assert.match(productMarkdown(draft), /Reliable guidance \(Validated\)/);
  assert.match(productMarkdown(draft), /Show review dates \(Impact\)/);
});
test("corrupt versions, mismatched lifecycles, duplicate IDs and dangling links cannot replace a draft", () => {
  const draft = emptyDraft();
  assert.equal(parseDraft({ ...draft, version: 2 }), null);
  assert.equal(
    parseDraft({
      ...draft,
      opportunities: [{ ...draft.opportunities[0], state: "Delivery" }],
    }),
    null,
  );
  assert.equal(
    parseDraft({
      ...draft,
      solutions: [{ ...draft.solutions[0], id: "opportunity-1" }],
    }),
    null,
  );
  assert.equal(
    parseDraft({
      ...draft,
      solutions: [{ ...draft.solutions[0], opportunityId: "missing" }],
    }),
    null,
  );
  assert.equal(
    parseDraft({
      ...draft,
      fields: { ...draft.fields, idea: "x".repeat(2401) },
    }),
    null,
  );
});
test("exports include current learning and uncertainty without claims of readiness", () => {
  const draft = emptyDraft();
  draft.fields.idea = "Help new teammates find answers";
  draft.fields.evidence = "One participant could not find the current guide.";
  draft.fields.limits = "No adoption data.";
  draft.fields.nextAction = "Test source freshness.";
  draft.fields.repo = "product/PRD.md";
  const definition = productMarkdown(draft);
  assert.match(definition, /No adoption data/);
  assert.match(definition, /nothing here implies validation or delivery/);
  assert.match(contextMarkdown(draft), /Test source freshness/);
  assert.match(contextMarkdown(draft), /Empty sections are unknown/);
});
