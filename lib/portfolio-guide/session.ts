"use client";

import {
  GUIDE_INTERACTION_SESSION_STORAGE_KEY,
  GUIDE_SESSION_STORAGE_KEY,
  GUIDE_SESSION_VERSION,
  GUIDE_VISITOR_STORAGE_KEY,
  MAX_MESSAGES_PER_PAGE,
  MAX_TAG_SIGNALS,
  MAX_TRACKED_PROMPTS,
  MAX_TRACKED_QUESTIONS,
  MAX_VISITED_PAGES,
} from "@/lib/portfolio-guide/constants";
import type {
  GuideConversationMessage,
  GuidedRecommendation,
  GuideSessionState,
  InterestTag,
  StorageLike,
  VisitorIntent,
} from "@/lib/portfolio-guide/types";

const VALID_ROLE_LENSES = [
  "senior-product-manager",
  "builder-pm",
  "product-leader",
] as const;

const VALID_SENIORITY = [
  "pm",
  "senior",
  "group",
  "director",
  "exec",
] as const;

let memorySessionState: GuideSessionState = createEmptyGuideSessionState();
let memoryVisitorId: string | null = null;
let memoryInteractionSessionId: string | null = null;

function cloneState(state: GuideSessionState): GuideSessionState {
  return JSON.parse(JSON.stringify(state)) as GuideSessionState;
}

function capArray<T>(items: T[], limit: number): T[] {
  return items.slice(-limit);
}

function appendUnique(items: string[], value: string, limit: number): string[] {
  const next = [...items.filter((item) => item !== value), value];
  return capArray(next, limit);
}

function appendCapped(items: string[], value: string, limit: number): string[] {
  return capArray([...items, value], limit);
}

function appendUniqueTags(
  existing: InterestTag[],
  additions: InterestTag[],
): InterestTag[] {
  return [...new Set([...existing, ...additions])];
}

function normalizeStringList(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return [...new Set(input)]
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeVisitorIntent(input: unknown): VisitorIntent | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return undefined;
  }

  const candidate = input as Partial<VisitorIntent>;
  const rawInput =
    typeof candidate.rawInput === "string" ? candidate.rawInput.trim() : "";

  if (!rawInput) {
    return undefined;
  }

  const roleLenses = normalizeStringList(candidate.roleLenses).filter(
    (value): value is NonNullable<VisitorIntent["roleLenses"]>[number] =>
      VALID_ROLE_LENSES.includes(
        value as (typeof VALID_ROLE_LENSES)[number],
      ),
  );

  const seniority = VALID_SENIORITY.includes(
    candidate.seniority as (typeof VALID_SENIORITY)[number],
  )
    ? (candidate.seniority as VisitorIntent["seniority"])
    : undefined;
  const focusAreas = normalizeStringList(candidate.focusAreas);
  const emphasis = normalizeStringList(candidate.emphasis);

  return {
    rawInput,
    normalizedTitle:
      typeof candidate.normalizedTitle === "string"
        ? candidate.normalizedTitle.trim() || undefined
        : undefined,
    seniority,
    roleLenses: roleLenses.length > 0 ? roleLenses : undefined,
    focusAreas: focusAreas.length > 0 ? focusAreas : undefined,
    emphasis: emphasis.length > 0 ? emphasis : undefined,
  };
}

function normalizeGuidedRecommendations(
  input: unknown,
): GuidedRecommendation[] | undefined {
  if (!Array.isArray(input)) {
    return undefined;
  }

  const recommendations = input
    .map((item): GuidedRecommendation | null => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }

      const candidate = item as Partial<GuidedRecommendation>;
      const slug =
        typeof candidate.slug === "string" ? candidate.slug.trim() : "";
      const title =
        typeof candidate.title === "string" ? candidate.title.trim() : "";
      const reason =
        typeof candidate.reason === "string" ? candidate.reason.trim() : "";
      const priority =
        typeof candidate.priority === "number" &&
        Number.isFinite(candidate.priority)
          ? candidate.priority
          : null;

      if (!slug || !title || !reason || priority == null) {
        return null;
      }

      return {
        slug,
        title,
        reason,
        priority,
      };
    })
    .filter((value): value is GuidedRecommendation => value !== null)
    .sort((left, right) => left.priority - right.priority);

  return recommendations.length > 0 ? recommendations : undefined;
}

function getSessionStorage(): StorageLike | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function getLocalStorage(): StorageLike | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function generateOpaqueId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function normalizeStoredId(value: string | null): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export function createEmptyGuideSessionState(): GuideSessionState {
  return {
    version: GUIDE_SESSION_VERSION,
    visitedPages: [],
    clickedPrompts: [],
    askedQuestions: [],
    inferredInterestTags: [],
    tagSignals: [],
    conversationsBySlug: {},
  };
}

function normalizeStoredState(input: unknown): GuideSessionState {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    (input as { version?: unknown }).version !== GUIDE_SESSION_VERSION
  ) {
    return createEmptyGuideSessionState();
  }

  const candidate = input as Partial<GuideSessionState>;

  return {
    version: GUIDE_SESSION_VERSION,
    visitedPages: Array.isArray(candidate.visitedPages)
      ? candidate.visitedPages.filter((value): value is string => typeof value === "string")
      : [],
    clickedPrompts: Array.isArray(candidate.clickedPrompts)
      ? candidate.clickedPrompts.filter((value): value is string => typeof value === "string")
      : [],
    askedQuestions: Array.isArray(candidate.askedQuestions)
      ? candidate.askedQuestions.filter((value): value is string => typeof value === "string")
      : [],
    inferredInterestTags: Array.isArray(candidate.inferredInterestTags)
      ? candidate.inferredInterestTags.filter(
          (value): value is InterestTag => typeof value === "string",
        )
      : [],
    visitorIntent: normalizeVisitorIntent(candidate.visitorIntent),
    recommendedPath: normalizeGuidedRecommendations(candidate.recommendedPath),
    lastVisitedAt:
      typeof candidate.lastVisitedAt === "string" ? candidate.lastVisitedAt : undefined,
    tagSignals: Array.isArray(candidate.tagSignals)
      ? candidate.tagSignals.filter(
          (value): value is InterestTag => typeof value === "string",
        )
      : [],
    conversationsBySlug:
      candidate.conversationsBySlug && typeof candidate.conversationsBySlug === "object"
        ? Object.fromEntries(
            Object.entries(candidate.conversationsBySlug).map(([slug, messages]) => [
              slug,
              Array.isArray(messages)
                ? messages.filter(
                    (message): message is GuideConversationMessage =>
                      Boolean(message) &&
                      typeof message === "object" &&
                      typeof message.id === "string" &&
                      typeof message.role === "string" &&
                      typeof message.content === "string" &&
                      typeof message.createdAt === "string",
                  )
                : [],
            ]),
          )
        : {},
  };
}

function ensureStoredId(
  storage: StorageLike | null,
  storageKey: string,
  prefix: string,
  readMemoryValue: () => string | null,
  writeMemoryValue: (value: string) => void,
): string {
  const existingStorageValue = normalizeStoredId(storage?.getItem(storageKey) ?? null);
  if (existingStorageValue) {
    return existingStorageValue;
  }

  const existingMemoryValue = normalizeStoredId(readMemoryValue());
  if (existingMemoryValue) {
    if (storage) {
      storage.setItem(storageKey, existingMemoryValue);
    }
    return existingMemoryValue;
  }

  const nextValue = generateOpaqueId(prefix);
  if (storage) {
    storage.setItem(storageKey, nextValue);
  } else {
    writeMemoryValue(nextValue);
  }
  return nextValue;
}

export function ensureGuideVisitorId(storage = getLocalStorage()): string {
  return ensureStoredId(
    storage,
    GUIDE_VISITOR_STORAGE_KEY,
    "pgv",
    () => memoryVisitorId,
    (value) => {
      memoryVisitorId = value;
    },
  );
}

export function ensureGuideInteractionSessionId(
  storage = getSessionStorage(),
): string {
  return ensureStoredId(
    storage,
    GUIDE_INTERACTION_SESSION_STORAGE_KEY,
    "pgs",
    () => memoryInteractionSessionId,
    (value) => {
      memoryInteractionSessionId = value;
    },
  );
}

export function resetGuideIdentityForTests(): void {
  memoryVisitorId = null;
  memoryInteractionSessionId = null;
}

export function readGuideSessionState(
  storage = getSessionStorage(),
): GuideSessionState {
  if (!storage) {
    return cloneState(memorySessionState);
  }

  const raw = storage.getItem(GUIDE_SESSION_STORAGE_KEY);
  if (!raw) {
    return createEmptyGuideSessionState();
  }

  try {
    return normalizeStoredState(JSON.parse(raw));
  } catch {
    storage.removeItem(GUIDE_SESSION_STORAGE_KEY);
    return createEmptyGuideSessionState();
  }
}

export function writeGuideSessionState(
  state: GuideSessionState,
  storage = getSessionStorage(),
): GuideSessionState {
  const normalized = normalizeStoredState(state);

  if (!storage) {
    memorySessionState = cloneState(normalized);
    return cloneState(memorySessionState);
  }

  storage.setItem(GUIDE_SESSION_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function recordPageVisit(
  state: GuideSessionState,
  slug: string,
): GuideSessionState {
  return {
    ...state,
    visitedPages: appendUnique(state.visitedPages, slug, MAX_VISITED_PAGES),
    lastVisitedAt: new Date().toISOString(),
  };
}

export function recordPromptClick(
  state: GuideSessionState,
  prompt: string,
): GuideSessionState {
  return {
    ...state,
    clickedPrompts: appendCapped(state.clickedPrompts, prompt, MAX_TRACKED_PROMPTS),
  };
}

export function recordQuestion(
  state: GuideSessionState,
  question: string,
): GuideSessionState {
  return {
    ...state,
    askedQuestions: appendCapped(state.askedQuestions, question, MAX_TRACKED_QUESTIONS),
  };
}

export function recordTagSignals(
  state: GuideSessionState,
  tags: InterestTag[],
): GuideSessionState {
  const nextSignals = capArray([...state.tagSignals, ...tags], MAX_TAG_SIGNALS);

  return {
    ...state,
    tagSignals: nextSignals,
    inferredInterestTags: appendUniqueTags(state.inferredInterestTags, tags),
  };
}

export function setVisitorIntent(
  state: GuideSessionState,
  visitorIntent: VisitorIntent,
  recommendedPath: GuidedRecommendation[],
): GuideSessionState {
  return {
    ...state,
    visitorIntent,
    recommendedPath,
  };
}

export function clearVisitorIntent(state: GuideSessionState): GuideSessionState {
  return {
    ...state,
    visitorIntent: undefined,
    recommendedPath: undefined,
  };
}

export function appendConversationMessages(
  state: GuideSessionState,
  slug: string,
  messages: GuideConversationMessage[],
): GuideSessionState {
  const currentMessages = state.conversationsBySlug[slug] ?? [];
  return {
    ...state,
    conversationsBySlug: {
      ...state.conversationsBySlug,
      [slug]: capArray([...currentMessages, ...messages], MAX_MESSAGES_PER_PAGE),
    },
  };
}

export function getConversationForPage(
  state: GuideSessionState,
  slug: string,
): GuideConversationMessage[] {
  return state.conversationsBySlug[slug] ?? [];
}
