import { MAX_TEXT, type WorkspaceDraft } from "./model";

export const sourceFields = [
  "idea",
  "audience",
  "outcome",
  "experience",
] as const;
export const suggestionKinds = [
  "audience",
  "outcome",
  "opportunity",
  "solution",
] as const;
export type SourceField = (typeof sourceFields)[number];
export type SuggestionKind = (typeof suggestionKinds)[number];
export type Grounding = { sourceField: SourceField; quote: string };
export type Suggestion = Grounding & { text: string };
export type Suggestions = Record<SuggestionKind, Suggestion | null> & {
  connection: Grounding | null;
  question: string | null;
};
export type SuggestionInput = {
  notes: Record<SourceField | "questions", string>;
  existing: { opportunities: string[]; solutions: string[] };
  open: Record<SuggestionKind, boolean>;
};
export const MAX_CONTEXT_CHARS = 6000;
export const emptySuggestions = (): Suggestions => ({
  audience: null,
  outcome: null,
  opportunity: null,
  solution: null,
  connection: null,
  question: null,
});
export function suggestionInput(draft: WorkspaceDraft): SuggestionInput {
  return {
    notes: {
      idea: draft.fields.idea,
      audience: draft.fields.audience,
      outcome: draft.fields.outcome,
      experience: draft.fields.experience,
      questions: draft.fields.questions,
    },
    existing: {
      opportunities: draft.opportunities
        .map((n) => n.title)
        .filter((t) => t.trim()),
      solutions: draft.solutions.map((n) => n.title).filter((t) => t.trim()),
    },
    open: {
      audience: !draft.fields.audience.trim(),
      outcome: !draft.fields.outcome.trim(),
      opportunity: draft.opportunities.some((n) => !n.title.trim()),
      solution: draft.solutions.some((n) => !n.title.trim()),
    },
  };
}
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
export function parseSuggestionInput(raw: unknown): SuggestionInput | null {
  if (
    !record(raw) ||
    !record(raw.notes) ||
    !record(raw.existing) ||
    !record(raw.open)
  )
    return null;
  const { notes, existing, open } = raw;
  const keys = [...sourceFields, "questions"] as const;
  if (
    !keys.every(
      (k) =>
        typeof notes[k] === "string" && (notes[k] as string).length <= MAX_TEXT,
    )
  )
    return null;
  if (!suggestionKinds.every((k) => typeof open[k] === "boolean")) return null;
  if (
    ![existing.opportunities, existing.solutions].every(
      (a) =>
        Array.isArray(a) &&
        a.length <= 8 &&
        a.every((t) => typeof t === "string" && t.length <= 400),
    )
  )
    return null;
  const clean: SuggestionInput = {
    notes: Object.fromEntries(
      keys.map((k) => [k, notes[k]]),
    ) as SuggestionInput["notes"],
    existing: {
      opportunities: existing.opportunities as string[],
      solutions: existing.solutions as string[],
    },
    open: Object.fromEntries(
      suggestionKinds.map((k) => [k, open[k]]),
    ) as SuggestionInput["open"],
  };
  const chars = [
    ...Object.values(clean.notes),
    ...clean.existing.opportunities,
    ...clean.existing.solutions,
  ].join("").length;
  return chars <= MAX_CONTEXT_CHARS ? clean : null;
}
export function hasSuggestionSource(input: SuggestionInput) {
  return sourceFields.some((k) => input.notes[k].trim());
}
const normalized = (text: string) => text.replace(/\s+/g, " ").trim();
// Exact source excerpts are a deliberate constraint: the model classifies the
// visitor's words, rather than inventing a plausible product around them.
export function groundedSuggestions(
  raw: unknown,
  input: SuggestionInput,
): Suggestions {
  const result = emptySuggestions();
  if (!record(raw)) return result;
  function grounding(value: unknown): Grounding | null {
    if (
      !record(value) ||
      !sourceFields.includes(value.sourceField as SourceField) ||
      typeof value.quote !== "string"
    )
      return null;
    const quote = normalized(value.quote);
    const sourceField = value.sourceField as SourceField;
    if (
      !quote ||
      quote.length > 800 ||
      !normalized(input.notes[sourceField]).includes(quote)
    )
      return null;
    return { sourceField, quote };
  }
  for (const kind of suggestionKinds) {
    const value = raw[kind];
    const source = grounding(value);
    if (
      !input.open[kind] ||
      !source ||
      !record(value) ||
      typeof value.text !== "string"
    )
      continue;
    const text = normalized(value.text);
    if (!text || text.length > 400 || !source.quote.includes(text)) continue;
    if (
      (kind === "opportunity" || kind === "solution") &&
      input.existing[
        kind === "opportunity" ? "opportunities" : "solutions"
      ].some((t) => normalized(t).toLowerCase() === text.toLowerCase())
    )
      continue;
    result[kind] = { ...source, text };
  }
  const connection = grounding(raw.connection);
  if (
    connection &&
    result.opportunity &&
    result.solution &&
    connection.quote.includes(result.opportunity.text) &&
    connection.quote.includes(result.solution.text)
  ) {
    result.connection = connection;
  }
  if (typeof raw.question === "string" && raw.question.trim().length <= 240)
    result.question = raw.question.trim() || null;
  return result;
}
export function applySuggestions(
  draft: WorkspaceDraft,
  suggestions: Suggestions,
  selected: SuggestionKind[],
  snapshot: string,
): WorkspaceDraft {
  if (JSON.stringify(draft) !== snapshot) return draft;
  const grounded = groundedSuggestions(suggestions, suggestionInput(draft));
  const next = structuredClone(draft);
  for (const key of ["audience", "outcome"] as const) {
    if (selected.includes(key) && grounded[key] && !next.fields[key].trim())
      next.fields[key] = grounded[key]!.text;
  }
  const opportunity = next.opportunities.find((n) => !n.title.trim());
  const solution = next.solutions.find((n) => !n.title.trim());
  const useOpportunity =
    selected.includes("opportunity") && grounded.opportunity && opportunity;
  const useSolution =
    selected.includes("solution") && grounded.solution && solution;
  if (useOpportunity) opportunity.title = grounded.opportunity!.text;
  if (useSolution) solution.title = grounded.solution!.text;
  if (
    useOpportunity &&
    useSolution &&
    grounded.connection &&
    solution.opportunityId === null
  )
    solution.opportunityId = opportunity.id;
  return next;
}
