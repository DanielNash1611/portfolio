import type { InterestTag } from "@/lib/portfolio-guide/types";

export const GUIDE_SESSION_STORAGE_KEY = "portfolio-guide:v1";
export const GUIDE_SESSION_VERSION = 2;
export const MAX_VISITED_PAGES = 12;
export const MAX_TRACKED_PROMPTS = 20;
export const MAX_TRACKED_QUESTIONS = 20;
export const MAX_TAG_SIGNALS = 24;
export const MAX_MESSAGES_PER_PAGE = 10;
export const MAX_CONVERSATION_CONTEXT_MESSAGES = 4;

export const DEFAULT_GUIDE_TITLE = "Ask about this page";
export const DEFAULT_GUIDE_HELPER =
  "Get a grounded read on responsibility, evidence, impact, or what to read next.";

export const DEFAULT_GUIDE_PROMPTS = [
  "What are the strongest signals on this page?",
  "What particularly was Daniel responsible for?",
  "What's implied but not proven here?",
  "What should I view next?",
] as const;

export const INTEREST_TAGS: InterestTag[] = [
  "ai-builder",
  "pm-leadership",
  "platform",
  "healthtech",
  "0-to-1",
  "technical-depth",
];

export const GUIDE_UNAVAILABLE_MESSAGE =
  "Portfolio Guide is unavailable until OPENAI_API_KEY is configured.";
