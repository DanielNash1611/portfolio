import test from "node:test";
import assert from "node:assert/strict";
import {
  emptyProjectDraft,
  parseProjectDraft,
  projectAgentContext,
  projectBrief,
  projectPrompt,
  PROJECT_STORAGE_KEY,
} from "../../lib/product-workspace/project";
import {
  emptyDraft,
  parseDraft,
  STORAGE_KEY,
} from "../../lib/product-workspace/model";

test("project and idea drafts have independent storage keys and validators", () => {
  assert.notEqual(PROJECT_STORAGE_KEY, STORAGE_KEY);
  const idea = emptyDraft();
  idea.fields.idea = "An idea to preserve";
  const project = emptyProjectDraft();
  project.fields.name = "An independent project";
  const storage = new Map([
    [STORAGE_KEY, JSON.stringify(idea)],
    [PROJECT_STORAGE_KEY, JSON.stringify(project)],
  ]);
  storage.set(PROJECT_STORAGE_KEY, JSON.stringify(emptyProjectDraft()));
  assert.equal(
    parseDraft(JSON.parse(storage.get(STORAGE_KEY)!))?.fields.idea,
    "An idea to preserve",
  );
  assert.equal(parseProjectDraft(idea), null);
  assert.equal(parseDraft(project), null);
});

test("a blank project is valid and keeps scope and approval open", () => {
  const blank = emptyProjectDraft();
  assert.deepEqual(parseProjectDraft(JSON.parse(JSON.stringify(blank))), blank);
  assert.ok(Object.values(blank.fields).every((value) => value === ""));
  assert.match(projectBrief(blank), /This is not an approved PRD/);
  assert.match(
    projectBrief(blank),
    /## First MVP\n_Open — clarify when needed\._/,
  );
  assert.match(projectAgentContext(blank), /Product definition: _Open/);
});

test("project fields round-trip and all appear in the brief and conversation prompts", () => {
  const project = emptyProjectDraft();
  for (const field of Object.keys(
    project.fields,
  ) as (keyof typeof project.fields)[])
    project.fields[field] = `Entered ${field}`;
  const restored = parseProjectDraft(JSON.parse(JSON.stringify(project)))!;
  assert.deepEqual(restored, project);
  for (const value of Object.values(project.fields)) {
    assert.ok(projectBrief(restored).includes(value));
    for (const kind of ["brainstorm", "prd", "build"] as const)
      assert.ok(projectPrompt(restored, kind).includes(value));
  }
  const setup = projectAgentContext(restored);
  for (const field of [
    "location",
    "design",
    "technical",
    "owner",
    "reviewed",
  ] as const)
    assert.ok(setup.includes(project.fields[field]));
});

test("corrupt or oversized saved projects do not become valid drafts", () => {
  const project = emptyProjectDraft();
  assert.equal(parseProjectDraft(null), null);
  assert.equal(parseProjectDraft({ ...project, version: 2 }), null);
  assert.equal(parseProjectDraft({ ...project, fields: {} }), null);
  assert.equal(
    parseProjectDraft({
      ...project,
      fields: { ...project.fields, name: null },
    }),
    null,
  );
  assert.equal(
    parseProjectDraft({
      ...project,
      fields: { ...project.fields, flow: "x".repeat(2401) },
    }),
    null,
  );
});

test("prompts preserve the review boundary and context checkpoints", () => {
  const project = emptyProjectDraft();
  assert.match(
    projectPrompt(project, "brainstorm"),
    /Do not begin implementation yet/,
  );
  assert.match(
    projectPrompt(project, "prd"),
    /do not treat this request as build approval/,
  );
  assert.match(
    projectPrompt(project, "build"),
    /only after I have reviewed and approved/,
  );
  assert.match(
    projectPrompt(project, "build"),
    /location is missing or contradictory/,
  );
  assert.match(projectAgentContext(project), /including each new session/);
  assert.match(projectAgentContext(project), /During implementation/);
  assert.match(projectAgentContext(project), /whole experience/);
});
