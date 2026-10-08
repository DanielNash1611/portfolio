import { lifecycleStates, opportunityStates } from "@/content/product-system";

export const STORAGE_KEY = "daniel-nash:product-playbook:v1";
export const MAX_TEXT = 2400;
export const MAX_NODES = 8;
export const fieldGroups = [
  {
    step: "Capture",
    title: "Capture your idea.",
    description: "A rough thought is enough to start.",
    fields: [
      {
        key: "idea",
        label: "Your idea",
        placeholder: "What if every performer could follow their own timeline?",
        rows: 4,
      },
      {
        key: "audience",
        label: "Who is this for?",
        placeholder: "The people and situation you have in mind.",
      },
      {
        key: "outcome",
        label: "What would improve?",
        placeholder: "The change you hope to see.",
      },
      {
        key: "questions",
        label: "What’s still unclear?",
        placeholder: "Questions to explore next.",
      },
    ],
  },
  {
    step: "Define",
    title: "Define the experience.",
    description:
      "Edit the tree directly. Needs and possible solutions can stay unlinked.",
    fields: [
      {
        key: "experience",
        label: "The whole experience",
        placeholder:
          "From the first action to the outcome: what happens, and why?",
      },
      {
        key: "mustPreserve",
        label: "What must stay true?",
        placeholder: "Behaviors to preserve, and why they matter.",
      },
      {
        key: "scope",
        label: "Smallest useful version",
        placeholder: "What is enough to learn from?",
      },
      {
        key: "nonGoals",
        label: "Leave out for now",
        placeholder: "What belongs outside this version?",
      },
      {
        key: "constraints",
        label: "Constraints or assumptions",
        placeholder: "Limits to work within or assumptions to check.",
      },
      {
        key: "acceptance",
        label: "Acceptance criteria",
        placeholder: "What should someone be able to observe or verify?",
      },
    ],
  },
  {
    step: "Learn",
    title: "Record what you learned.",
    description: "Keep observations separate from assumptions.",
    fields: [
      {
        key: "testQuestion",
        label: "Question to test",
        placeholder: "What uncertainty matters next?",
      },
      {
        key: "testMethod",
        label: "How you’ll test it",
        placeholder: "A conversation, prototype, or technical check.",
      },
      {
        key: "evidence",
        label: "What you observed",
        placeholder: "What happened? Add source links if useful.",
      },
      {
        key: "limits",
        label: "Limits of this evidence",
        placeholder: "What remains unknown?",
      },
      {
        key: "decision",
        label: "Decision and why",
        placeholder: "What changed, why, and who agreed?",
      },
      {
        key: "nextAction",
        label: "Next action",
        placeholder: "A small next step.",
      },
    ],
  },
  {
    step: "Context",
    title: "Keep context current.",
    description:
      "Point to the current definition and say when to read it. This draft doesn’t configure an agent.",
    fields: [
      {
        key: "repo",
        label: "Product context location",
        placeholder: "The exact file path or accessible source link.",
      },
      {
        key: "contextOwner",
        label: "Who keeps it current?",
        placeholder: "The person or team responsible for updates.",
      },
      {
        key: "contextReviewed",
        label: "Last reviewed / revision",
        placeholder: "A review date or source version.",
      },
      {
        key: "agentNotes",
        label: "Notes for the next session",
        placeholder: "What should they read, preserve, or verify?",
        rows: 4,
      },
    ],
  },
] as const;
export type FieldKey = (typeof fieldGroups)[number]["fields"][number]["key"];
// These optional fields were added to v1. Older saved drafts keep all their
// content and receive empty values; malformed present values still fail validation.
const addedOptionalFields: readonly FieldKey[] = [
  "mustPreserve",
  "contextOwner",
  "contextReviewed",
];
export const fieldKeys = fieldGroups.flatMap((group) =>
  group.fields.map((field) => field.key),
) as FieldKey[];
export type WorkspaceNode = { id: string; title: string; state: string };
export type WorkspaceSolution = WorkspaceNode & {
  opportunityId: string | null;
};
export type WorkspaceDraft = {
  version: 1;
  fields: Record<FieldKey, string>;
  opportunities: WorkspaceNode[];
  solutions: WorkspaceSolution[];
};
export function emptyDraft(): WorkspaceDraft {
  return {
    version: 1,
    fields: Object.fromEntries(fieldKeys.map((key) => [key, ""])) as Record<
      FieldKey,
      string
    >,
    opportunities: [{ id: "opportunity-1", title: "", state: "" }],
    solutions: [
      { id: "solution-1", title: "", state: "", opportunityId: null },
    ],
  };
}
export function newNodeId() {
  return `node-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
export function hasDraftContent(draft: WorkspaceDraft) {
  return (
    fieldKeys.some((key) => draft.fields[key].trim()) ||
    [...draft.opportunities, ...draft.solutions].some(
      (node) => node.title.trim() || node.state,
    )
  );
}
// Validate saved and imported data instead of trusting a previous browser session.
export function parseDraft(raw: unknown): WorkspaceDraft | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<WorkspaceDraft>;
  if (
    value.version !== 1 ||
    !value.fields ||
    !Array.isArray(value.opportunities) ||
    !Array.isArray(value.solutions)
  )
    return null;
  if (
    value.opportunities.length < 1 ||
    value.solutions.length < 1 ||
    value.opportunities.length > MAX_NODES ||
    value.solutions.length > MAX_NODES
  )
    return null;
  if (
    !fieldKeys.every(
      (key) =>
        (addedOptionalFields.includes(key) &&
          value.fields?.[key] === undefined) ||
        (typeof value.fields?.[key] === "string" &&
          value.fields[key].length <= MAX_TEXT),
    )
  )
    return null;
  const ids = new Set<string>();
  const validNode = (node: WorkspaceNode, states: { title: string }[]) => {
    if (
      !node ||
      typeof node.id !== "string" ||
      !/^[\w-]{1,80}$/.test(node.id) ||
      ids.has(node.id) ||
      typeof node.title !== "string" ||
      node.title.length > 400 ||
      (node.state !== "" && !states.some((s) => s.title === node.state))
    )
      return false;
    ids.add(node.id);
    return true;
  };
  if (!value.opportunities.every((node) => validNode(node, opportunityStates)))
    return null;
  if (
    !value.solutions.every(
      (node) =>
        validNode(node, lifecycleStates) &&
        (node.opportunityId === null ||
          value.opportunities!.some(
            (opportunity) => opportunity.id === node.opportunityId,
          )),
    )
  )
    return null;
  return {
    version: 1,
    fields: Object.fromEntries(
      fieldKeys.map((key) => [key, value.fields![key] ?? ""]),
    ) as Record<FieldKey, string>,
    opportunities: value.opportunities.map(({ id, title, state }) => ({
      id,
      title,
      state,
    })),
    solutions: value.solutions.map(({ id, title, state, opportunityId }) => ({
      id,
      title,
      state,
      opportunityId,
    })),
  };
}
const present = (text: string) => text.trim() || "_Open — add when known._";
export function treeMarkdown(draft: WorkspaceDraft) {
  const solutionLine = (node: WorkspaceSolution) =>
    `  - Solution: ${present(node.title)}${node.state ? ` (${node.state})` : ""}`;
  return [
    `Desired outcome: ${present(draft.fields.outcome)}`,
    ...draft.opportunities.flatMap((node) => [
      `- Opportunity: ${present(node.title)}${node.state ? ` (${node.state})` : ""}`,
      ...draft.solutions
        .filter((s) => s.opportunityId === node.id)
        .map(solutionLine),
    ]),
    ...(draft.solutions.some((s) => s.opportunityId === null)
      ? [
          "- Solutions with an open opportunity:",
          ...draft.solutions
            .filter((s) => s.opportunityId === null)
            .map(solutionLine),
        ]
      : []),
  ].join("\n");
}
export function productMarkdown(draft: WorkspaceDraft) {
  const f = draft.fields;
  return `# Living product definition\n\nWorking draft. Blank sections remain open; nothing here implies validation or delivery.\n\n## Original idea\n${present(f.idea)}\n\n## Context owner\n${present(f.contextOwner)}\n\n## Last reviewed or source revision\n${present(f.contextReviewed)}\n\n## Current context location\n${present(f.repo)}\n\n## People\n${present(f.audience)}\n\n## Opportunity–solution tree\n${treeMarkdown(draft)}\n\n## The whole user experience\n${present(f.experience)}\n\n## What must stay true and why\n${present(f.mustPreserve)}\n\n## Scope\n${present(f.scope)}\n\n## Non-goals\n${present(f.nonGoals)}\n\n## Constraints and assumptions\n${present(f.constraints)}\n\n## Acceptance criteria\n${present(f.acceptance)}\n\n## Open questions\n${present(f.questions)}\n\n## Evidence and learning\n### Question\n${present(f.testQuestion)}\n### Method\n${present(f.testMethod)}\n### Observations and sources\n${present(f.evidence)}\n### Limits\n${present(f.limits)}\n### Decision and why\n${present(f.decision)}\n### Next action\n${present(f.nextAction)}\n`;
}
export function contextMarkdown(draft: WorkspaceDraft) {
  const f = draft.fields;
  return `# Product context for people and AI

Setup draft. This page does not configure an agent or sync a repository. Adapt the source pointers and instructions to your tool before use.

## Current product context location
${present(f.repo)}

## Context owner
${present(f.contextOwner)}

## Last reviewed or source revision
${present(f.contextReviewed)}

## Source setup
Choose one authoritative product definition. If using this export, place the accompanying product-definition.md with the work and replace the location above with its actual path. Otherwise, reconcile this draft with your existing source. Confirm the agent can access it; a link alone is not proof it was read.

## Suggested agent instructions: where and when
- Before planning, and at the start of each new session: read the current definition and relevant design, architecture, and decision records. Identify the source and revision consulted. Explain who it serves, why, the whole user journey, what must stay true, and how the change will be checked.
- During implementation: revisit the relevant context at product decisions or scope changes. Resolve inaccessible, stale, or conflicting sources with the team before dependent changes. Keep unconfirmed scope separate.
- Before completion: recheck the current definition and walk the whole user flow as well as individual acceptance criteria. Report observed results and anything unverified.
- After agreed changes: update the canonical definition, the decision and its reason, and review information so the next session reads the current understanding.
- Empty sections are unknown, not permission to invent requirements. Do not infer approval or readiness from this document.

## Keep responsibilities clear
The product definition explains intent. Tickets describe bounded work and link to it. Skills or commands describe procedures. Keep agent entry instructions short: pointers and reading checkpoints, rather than another full copy of the PRD.

## Notes from the team
${present(f.agentNotes)}

## Current next action
${present(f.nextAction)}

## Open questions
${present(f.questions)}
`;
}
