import {
  INTEREST_TAGS,
  MAX_TAG_SIGNALS,
  MAX_TRACKED_PROMPTS,
  MAX_TRACKED_QUESTIONS,
  MAX_VISITED_PAGES,
} from "@/lib/portfolio-guide/constants";
import { GUIDE_MESSAGE_MAX_LENGTH } from "@/lib/portfolio-guide/conversation-store";
import type {
  CopilotConversationMessage,
  GuideInteractionSource,
  GuidedRecommendation,
  GuideSessionSignals,
  InterestTag,
  PortfolioGuideTurnRequest,
  VisitorIntent,
} from "@/lib/portfolio-guide/types";

const VALID_SOURCES: GuideInteractionSource[] = ["chip", "input", "follow-up"];
const VALID_SENIORITY = ["pm", "senior", "group", "director", "exec"];
const CLIENT_TURN_ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;

function strings(input: unknown, limit: number, maxLength = 500): string[] {
  if (!Array.isArray(input)) {
    return [];
  }
  return input
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(-limit);
}

function sanitizeVisitorIntent(input: unknown): VisitorIntent | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return undefined;
  }
  const value = input as Record<string, unknown>;
  if (typeof value.rawInput !== "string" || !value.rawInput.trim()) {
    return undefined;
  }
  const seniority =
    typeof value.seniority === "string" && VALID_SENIORITY.includes(value.seniority)
      ? (value.seniority as VisitorIntent["seniority"])
      : undefined;
  return {
    rawInput: value.rawInput.trim().slice(0, 1000),
    ...(typeof value.normalizedTitle === "string"
      ? { normalizedTitle: value.normalizedTitle.trim().slice(0, 200) }
      : {}),
    ...(seniority ? { seniority } : {}),
    ...(Array.isArray(value.roleLenses)
      ? { roleLenses: strings(value.roleLenses, 3, 80) as VisitorIntent["roleLenses"] }
      : {}),
    ...(Array.isArray(value.focusAreas)
      ? { focusAreas: strings(value.focusAreas, 12, 120) }
      : {}),
    ...(Array.isArray(value.emphasis)
      ? { emphasis: strings(value.emphasis, 12, 120) }
      : {}),
  };
}

function sanitizeRecommendations(input: unknown): GuidedRecommendation[] | undefined {
  if (!Array.isArray(input)) {
    return undefined;
  }
  const values = input
    .slice(0, 8)
    .map((item): GuidedRecommendation | null => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }
      const value = item as Record<string, unknown>;
      if (
        typeof value.slug !== "string" ||
        typeof value.title !== "string" ||
        typeof value.reason !== "string" ||
        typeof value.priority !== "number"
      ) {
        return null;
      }
      return {
        slug: value.slug.trim().slice(0, 120),
        title: value.title.trim().slice(0, 240),
        reason: value.reason.trim().slice(0, 600),
        priority: Math.max(1, Math.floor(value.priority)),
      };
    })
    .filter((value): value is GuidedRecommendation => value !== null);
  return values.length ? values : undefined;
}

export function sanitizeGuideSessionSignals(input: unknown): GuideSessionSignals {
  const value =
    input && typeof input === "object" && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const interestTags = strings(value.inferredInterestTags, MAX_TAG_SIGNALS, 80).filter(
    (tag): tag is InterestTag => INTEREST_TAGS.includes(tag as InterestTag),
  );
  return {
    visitedPages: strings(value.visitedPages, MAX_VISITED_PAGES, 120),
    clickedPrompts: strings(value.clickedPrompts, MAX_TRACKED_PROMPTS, 1000),
    askedQuestions: strings(value.askedQuestions, MAX_TRACKED_QUESTIONS, 1000),
    inferredInterestTags: interestTags,
    ...(sanitizeVisitorIntent(value.visitorIntent)
      ? { visitorIntent: sanitizeVisitorIntent(value.visitorIntent) }
      : {}),
    ...(sanitizeRecommendations(value.recommendedPath)
      ? { recommendedPath: sanitizeRecommendations(value.recommendedPath) }
      : {}),
    ...(typeof value.lastVisitedAt === "string"
      ? { lastVisitedAt: value.lastVisitedAt.slice(0, 40) }
      : {}),
  };
}

export function mergeGuideSessionSignals(
  stored: GuideSessionSignals,
  incoming: GuideSessionSignals,
  pageSlug: string,
  question: string,
): GuideSessionSignals {
  const mergeUnique = (left: string[], right: string[], limit: number) =>
    [...new Set([...left, ...right])].slice(-limit);
  return sanitizeGuideSessionSignals({
    visitedPages: mergeUnique(stored.visitedPages, [...incoming.visitedPages, pageSlug], MAX_VISITED_PAGES),
    clickedPrompts: [...stored.clickedPrompts, ...incoming.clickedPrompts],
    askedQuestions: [...stored.askedQuestions, ...incoming.askedQuestions, question],
    inferredInterestTags: mergeUnique(
      stored.inferredInterestTags,
      incoming.inferredInterestTags,
      MAX_TAG_SIGNALS,
    ),
    visitorIntent: incoming.visitorIntent ?? stored.visitorIntent,
    recommendedPath: incoming.recommendedPath ?? stored.recommendedPath,
    lastVisitedAt: new Date().toISOString(),
  });
}

function sanitizeFallbackConversation(input: unknown): CopilotConversationMessage[] | undefined {
  if (!Array.isArray(input)) {
    return undefined;
  }
  const messages = input
    .slice(-8)
    .map((item): CopilotConversationMessage | null => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }
      const value = item as Record<string, unknown>;
      if (
        (value.role !== "user" && value.role !== "assistant") ||
        typeof value.content !== "string"
      ) {
        return null;
      }
      return {
        role: value.role,
        content: value.content.trim().slice(0, GUIDE_MESSAGE_MAX_LENGTH),
      };
    })
    .filter((value): value is CopilotConversationMessage => value !== null);
  return messages.length ? messages : undefined;
}

export function parsePortfolioGuideTurnRequest(
  input: unknown,
): PortfolioGuideTurnRequest | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }
  const value = input as Record<string, unknown>;
  const message = typeof value.message === "string" ? value.message.trim() : "";
  if (
    typeof value.clientTurnId !== "string" ||
    !CLIENT_TURN_ID_PATTERN.test(value.clientTurnId) ||
    typeof value.pageSlug !== "string" ||
    !value.pageSlug.trim() ||
    !message ||
    message.length > GUIDE_MESSAGE_MAX_LENGTH ||
    typeof value.source !== "string" ||
    !VALID_SOURCES.includes(value.source as GuideInteractionSource)
  ) {
    return null;
  }
  return {
    clientTurnId: value.clientTurnId,
    pageSlug: value.pageSlug.trim().slice(0, 120),
    message,
    source: value.source as GuideInteractionSource,
    sessionSignals: sanitizeGuideSessionSignals(value.sessionSignals),
    fallbackConversation: sanitizeFallbackConversation(value.fallbackConversation),
  };
}
