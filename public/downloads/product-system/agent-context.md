# Persistent product context starter

Every field is optional while drafting. Resolve context needed for a particular
change before implementing it. This template does not configure an agent itself.

## Source pointers

- Current product definition (exact path or accessible URL):
- Design system and user-flow references:
- Architecture and relevant decisions:
- Experience checks / eval plan:
- Context owner:
- Last reviewed or source revision:

Keep one authoritative version of each artifact. My default is context in or
alongside the repo; an accessible product workspace or Jira source can also work.
Remove unused pointers and confirm access. A link is not proof of a read.

## Suggested agent entry instructions

Adapt to the instruction mechanism your tool uses, such as AGENTS.md or CLAUDE.md.
Replace the source pointers above with real locations. Keep this entry short;
the full definition belongs in the linked source.

Before planning, including in a fresh session:

1. Read the current product definition and relevant design, architecture, and decisions.
2. Identify the sources and revision actually consulted.
3. Explain who it serves, why, the end-to-end flow, what must stay true and why,
   the scope, and how the proposed change will be checked.
4. Resolve inaccessible, stale, or conflicting context with the team before
   dependent product decisions. Empty sections are unknown, not invented scope.

During implementation:

- Revisit relevant context at product decisions and scope changes.
- Surface discoveries that challenge the definition; agree on material changes.
- Preserve the whole experience, the agreed behavior, and unrelated work.

Before completion:

- Recheck the current definition. Walk the whole user journey as well as checking
  individual acceptance criteria, technical behavior, and any AI evals.
- Report observed results and unverified behavior accurately.
- After agreed changes, update the definition, decision and reason, and review
  information so the next session reads the current understanding.
- Do not infer approval, launch, or product impact from a document or local test.

## Different artifacts, different jobs

- Product definition: enduring intent, experience, constraints, and checks.
- Ticket: bounded work, acceptance criteria, and status; links to the definition.
- Skill / command: a repeatable procedure.
- Agent instructions: where to read and when to consult, verify, and update.

Teams can share this small context standard without identical authoring templates.
PMs, designers, and developers review changes together; the owner keeps the source current.

## Fresh-session check

Start without the earlier conversation. Have the agent identify the source and
revision it read, explain the journey and invariants, and propose checks. Compare
its answer with the source, then inspect the actual result. A fluent summary
alone does not establish a correct build.

## Proposed evaluation

Compare the same bounded change with initial-only context and explicit reading
checkpoints. Review product drift, requirement misses, clarification, rework,
time, and upkeep cost. This is an experiment to run, not a measured benefit or
a guarantee against mistakes.
