export const PROJECT_STORAGE_KEY = "daniel-nash:project-workspace:v1";
export const PROJECT_MAX_TEXT = 2400;

export const projectSteps = [
  {
    step: "Frame",
    title: "Frame the project.",
    description: "Start with a rough direction.",
    view: "brief",
    fields: [
      {
        key: "name",
        label: "Project name",
        placeholder: "A working name is fine.",
      },
      {
        key: "problem",
        label: "Why should this exist?",
        placeholder: "The problem or possibility you want to explore.",
        rows: 3,
      },
      {
        key: "audience",
        label: "Who is it for?",
        placeholder: "The people and situation you have in mind.",
      },
      {
        key: "outcome",
        label: "What would better look like?",
        placeholder: "The outcome you hope to create.",
      },
    ],
  },
  {
    step: "MVP",
    title: "Choose the first version.",
    description: "Keep it small, but cover the whole user journey.",
    view: "brief",
    fields: [
      {
        key: "flow",
        label: "The whole experience",
        placeholder:
          "From the first action to the outcome: what happens, and why?",
        rows: 3,
      },
      {
        key: "mvp",
        label: "Smallest useful version",
        placeholder: "What would give you something to test?",
      },
      {
        key: "mustPreserve",
        label: "What must stay true?",
        placeholder:
          "Behaviors or constraints to preserve, and why they matter.",
      },
      {
        key: "nonGoals",
        label: "Leave out for now",
        placeholder: "What belongs outside the first build?",
      },
    ],
  },
  {
    step: "Context",
    title: "Keep context current.",
    description:
      "Give each session the current definition and supporting sources.",
    view: "context",
    fields: [
      {
        key: "location",
        label: "Product definition location",
        placeholder: "An exact file path or accessible source link.",
      },
      {
        key: "design",
        label: "Design references",
        placeholder: "A design system, prototype, or interaction rules.",
      },
      {
        key: "technical",
        label: "Technical context",
        placeholder: "Repo, architecture, stack constraints, or dependencies.",
      },
      {
        key: "owner",
        label: "Who keeps it current?",
        placeholder: "The person or team responsible for updates.",
      },
      {
        key: "reviewed",
        label: "Last reviewed / revision",
        placeholder: "A review date or source version.",
      },
    ],
  },
  {
    step: "Start",
    title: "Start the conversation.",
    description: "Brainstorm → review the PRD → approve the first build.",
    view: "prompt",
    fields: [
      {
        key: "firstQuestion",
        label: "What will you explore first?",
        placeholder: "The biggest unknown or decision to discuss.",
      },
      {
        key: "verification",
        label: "How will you test it?",
        placeholder:
          "A real task, observable criteria, and checks that matter.",
        rows: 3,
      },
      {
        key: "questions",
        label: "Other open questions",
        placeholder: "What else should the conversation clarify?",
      },
    ],
  },
] as const;

export type ProjectField =
  (typeof projectSteps)[number]["fields"][number]["key"];
export type ProjectView = (typeof projectSteps)[number]["view"];
export type ProjectPrompt = "brainstorm" | "prd" | "build";
export type ProjectDraft = { version: 1; fields: Record<ProjectField, string> };
const keys = projectSteps.flatMap((step) =>
  step.fields.map((field) => field.key),
);

export function emptyProjectDraft(): ProjectDraft {
  return {
    version: 1,
    fields: Object.fromEntries(
      keys.map((key) => [key, ""]),
    ) as ProjectDraft["fields"],
  };
}
export function parseProjectDraft(raw: unknown): ProjectDraft | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<ProjectDraft>;
  if (
    value.version !== 1 ||
    !value.fields ||
    !keys.every(
      (key) =>
        typeof value.fields?.[key] === "string" &&
        value.fields[key].length <= PROJECT_MAX_TEXT,
    )
  )
    return null;
  return {
    version: 1,
    fields: Object.fromEntries(
      keys.map((key) => [key, value.fields![key]]),
    ) as ProjectDraft["fields"],
  };
}
const open = (value: string) => value.trim() || "_Open — clarify when needed._";

export function projectBrief(draft: ProjectDraft) {
  const f = draft.fields;
  return `# Project brief: ${f.name.trim() || "Untitled project"}

Working notes for a product conversation. This is not an approved PRD. Every unfilled section remains open.

## Why this should exist
${open(f.problem)}

## People
${open(f.audience)}

## Desired outcome
${open(f.outcome)}

## Whole user journey
${open(f.flow)}

## First MVP
${open(f.mvp)}

## What must stay true and why
${open(f.mustPreserve)}

## Leave out for now
${open(f.nonGoals)}

## Shared context
- Current definition: ${open(f.location)}
- Design and interaction references: ${open(f.design)}
- Technical references and constraints: ${open(f.technical)}
- Context owner: ${open(f.owner)}
- Last reviewed or revision: ${open(f.reviewed)}

## First question to explore
${open(f.firstQuestion)}

## How we will try and check it
${open(f.verification)}

## Other open questions
${open(f.questions)}
`;
}

export function projectAgentContext(draft: ProjectDraft) {
  const f = draft.fields;
  return `# Agent context setup

Setup draft for ${f.name.trim() || "an untitled project"}. Adapt these pointers to your agent and repository. This file does not configure an agent or create the referenced documents.

## Current sources
- Product definition: ${open(f.location)}
- Design / interaction references: ${open(f.design)}
- Technical context: ${open(f.technical)}
- Owner: ${open(f.owner)}
- Last reviewed or source revision: ${open(f.reviewed)}

## Reading checkpoints
1. Before planning, including each new session: read the current product definition and relevant references. State which sources you consulted, the whole user journey, and what must stay true.
2. During implementation: revisit the context at product decisions or scope changes. Resolve inaccessible, stale, or conflicting sources with the team before dependent changes.
3. Before completion: check the whole experience as well as individual requirements. Report observed results and unverified behavior.
4. After agreed changes: update the definition, the decision and why, and review information for the next session.

## Review boundary
The project brief is working input. Discuss it, draft a PRD, and revise it with the user. Begin implementation only after the user approves the PRD and asks for the build. Filling these fields does not grant that approval.

## Keep the setup small
Put short source pointers and reading checkpoints in the instruction mechanism your agent uses, for example AGENTS.md. Keep the living definition in one authoritative location. Tickets describe bounded work; skills describe procedures. Missing details are open questions, not invented requirements.
`;
}

export function projectPrompt(draft: ProjectDraft, kind: ProjectPrompt) {
  const instructions = {
    brainstorm: `Help me start this project using Imagine → Define → Build → Test → Refine.

Start by discussing the experience and the most important uncertainty in my notes. Explore alternatives and ask only the questions needed for the next decision. Keep unsupported opportunities, solutions, and requirements open.

When I ask, turn our current understanding into a PRD for me to review: who and why, the whole user journey, first MVP, non-goals, what must stay true, acceptance criteria, and unresolved questions. Do not begin implementation yet.`,
    prd: `Using our discussion and the working notes below, draft a PRD for my review. Include the intended user, outcome, whole user journey, reasons for key interactions, MVP scope, non-goals, what must stay true, acceptance criteria, and open questions. Separate agreed decisions from assumptions.

Identify a canonical location for the definition and the supporting design and technical context. Propose short agent instructions with explicit reading checkpoints. Return the draft for review; do not treat this request as build approval.`,
    build: `Use this prompt only after I have reviewed and approved the PRD.

Build the first testable MVP from the approved, current PRD. First read the definition and relevant design, architecture, and decision records; state which sources and revision you consulted. If the approved definition or its location is missing or contradictory, resolve that with me before implementation.

Plan a bounded first version. Revisit the context at product decisions. Check the complete user journey and the behaviors that must stay true, alongside technical checks. Bring back a runnable version, instructions for trying it, observed results, and remaining gaps. Review material product changes with me and record agreed decisions in the shared context for the next session.`,
  };
  return `${instructions[kind]}

---
Working notes (unfilled sections remain unknown; the current approved PRD takes precedence for an authorized build):

${projectBrief(draft)}`;
}
