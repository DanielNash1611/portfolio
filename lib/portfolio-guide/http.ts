import { randomUUID } from "node:crypto";
import { buildPortfolioGuidePromptContext } from "@/lib/portfolio-guide/prompt";
import {
  createPortfolioGuideInteractionLogger,
  type PortfolioGuideInteractionLogger,
} from "@/lib/portfolio-guide/interaction-log";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import type {
  CopilotRequest,
  CopilotResponse,
  GuideInteractionSource,
} from "@/lib/portfolio-guide/types";
import { GUIDE_UNAVAILABLE_MESSAGE } from "@/lib/portfolio-guide/constants";

type PortfolioGuideSuccessBody =
  | CopilotResponse
  | (CopilotResponse & {
      debug: {
        promptContext: Record<string, unknown>;
      };
    });

type PortfolioGuideErrorBody = {
  error: string;
  code?: string;
};

export type PortfolioGuideRouteResult = {
  status: number;
  body: PortfolioGuideSuccessBody | PortfolioGuideErrorBody;
};

export type PortfolioGuideRouteDependencies = {
  logger: PortfolioGuideInteractionLogger;
  generateResponse: typeof generatePortfolioGuideResponse;
  buildPromptContext: typeof buildPortfolioGuidePromptContext;
  getApiKey: () => string | undefined;
  getModel: () => string;
  createRequestId: () => string;
  now: () => number;
  logWarning: (...args: unknown[]) => void;
  logError: (...args: unknown[]) => void;
};

function isStringArray(input: unknown): input is string[] {
  return (
    Array.isArray(input) && input.every((value) => typeof value === "string")
  );
}

function isVisitorIntent(input: unknown): boolean {
  if (!input) {
    return true;
  }

  if (typeof input !== "object" || Array.isArray(input)) {
    return false;
  }

  const candidate = input as {
    rawInput?: unknown;
    normalizedTitle?: unknown;
    seniority?: unknown;
    roleLenses?: unknown;
    focusAreas?: unknown;
    emphasis?: unknown;
  };

  return (
    typeof candidate.rawInput === "string" &&
    (candidate.normalizedTitle == null ||
      typeof candidate.normalizedTitle === "string") &&
    (candidate.seniority == null || typeof candidate.seniority === "string") &&
    (candidate.roleLenses == null || isStringArray(candidate.roleLenses)) &&
    (candidate.focusAreas == null || isStringArray(candidate.focusAreas)) &&
    (candidate.emphasis == null || isStringArray(candidate.emphasis))
  );
}

function isRecommendedPathArray(input: unknown): boolean {
  return (
    input == null ||
    (Array.isArray(input) &&
      input.every(
        (item) =>
          Boolean(item) &&
          typeof item === "object" &&
          typeof (item as { slug?: unknown }).slug === "string" &&
          typeof (item as { title?: unknown }).title === "string" &&
          typeof (item as { reason?: unknown }).reason === "string" &&
          typeof (item as { priority?: unknown }).priority === "number",
      ))
  );
}

function isInteractionSource(input: unknown): input is GuideInteractionSource {
  return input === "chip" || input === "input" || input === "follow-up";
}

function isInteractionMeta(input: unknown): boolean {
  if (input == null) {
    return true;
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return false;
  }

  const candidate = input as {
    source?: unknown;
    visitorId?: unknown;
    sessionId?: unknown;
    turnIndex?: unknown;
  };

  return (
    isInteractionSource(candidate.source) &&
    typeof candidate.visitorId === "string" &&
    candidate.visitorId.trim().length > 0 &&
    typeof candidate.sessionId === "string" &&
    candidate.sessionId.trim().length > 0 &&
    typeof candidate.turnIndex === "number" &&
    Number.isFinite(candidate.turnIndex) &&
    candidate.turnIndex > 0
  );
}

function isConversationArray(
  input: unknown,
): input is CopilotRequest["conversation"] {
  return (
    Array.isArray(input) &&
    input.every(
      (message) =>
        Boolean(message) &&
        typeof message === "object" &&
        typeof message.role === "string" &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string",
    )
  );
}

export function isValidPortfolioGuideRequest(
  input: unknown,
): input is CopilotRequest {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return false;
  }

  const candidate = input as Partial<CopilotRequest>;
  const pageContext = candidate.pageContext;
  const sessionContext = candidate.sessionContext;

  return (
    typeof candidate.message === "string" &&
    candidate.message.trim().length > 0 &&
    Boolean(pageContext) &&
    typeof pageContext === "object" &&
    typeof pageContext.slug === "string" &&
    typeof pageContext.title === "string" &&
    typeof pageContext.href === "string" &&
    Boolean(candidate.portfolioContext) &&
    typeof candidate.portfolioContext === "object" &&
    Boolean(sessionContext) &&
    typeof sessionContext === "object" &&
    isStringArray(sessionContext.visitedPages) &&
    isStringArray(sessionContext.clickedPrompts) &&
    isStringArray(sessionContext.askedQuestions) &&
    isStringArray(sessionContext.inferredInterestTags) &&
    isVisitorIntent(sessionContext.visitorIntent) &&
    isRecommendedPathArray(sessionContext.recommendedPath) &&
    isInteractionMeta(candidate.interactionMeta) &&
    (candidate.debug == null || typeof candidate.debug === "boolean") &&
    (candidate.conversation == null ||
      isConversationArray(candidate.conversation))
  );
}

function defaultDependencies(): PortfolioGuideRouteDependencies {
  return {
    logger: createPortfolioGuideInteractionLogger(),
    generateResponse: generatePortfolioGuideResponse,
    buildPromptContext: buildPortfolioGuidePromptContext,
    getApiKey: () => process.env.OPENAI_API_KEY,
    getModel: () => process.env.OPENAI_MODEL || "gpt-5.4",
    createRequestId: () => randomUUID(),
    now: () => Date.now(),
    logWarning: (...args: unknown[]) => console.warn(...args),
    logError: (...args: unknown[]) => console.error(...args),
  };
}

function normalizeErrorCode(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  ) {
    return (error as { code: string }).code;
  }

  return "unexpected_server_error";
}

async function safeStartLog(
  logger: PortfolioGuideInteractionLogger,
  input: Parameters<PortfolioGuideInteractionLogger["start"]>[0],
  logWarning: (...args: unknown[]) => void,
) {
  try {
    await logger.start(input);
  } catch (error) {
    logWarning("Portfolio Guide interaction logging failed to start:", error);
  }
}

async function safeFinishLog(
  logger: PortfolioGuideInteractionLogger,
  input: Parameters<PortfolioGuideInteractionLogger["finish"]>[0],
  logWarning: (...args: unknown[]) => void,
) {
  try {
    await logger.finish(input);
  } catch (error) {
    logWarning("Portfolio Guide interaction logging failed to finish:", error);
  }
}

export async function handlePortfolioGuideRequest(
  payload: unknown,
  overrides: Partial<PortfolioGuideRouteDependencies> = {},
): Promise<PortfolioGuideRouteResult> {
  const dependencies = {
    ...defaultDependencies(),
    ...overrides,
  } satisfies PortfolioGuideRouteDependencies;

  if (!isValidPortfolioGuideRequest(payload)) {
    return {
      status: 400,
      body: {
        error: "Missing or invalid Portfolio Guide request.",
      },
    };
  }

  const requestId = dependencies.createRequestId();
  const apiKey = dependencies.getApiKey();
  const model = dependencies.getModel();

  await safeStartLog(
    dependencies.logger,
    {
      requestId,
      request: payload,
      model,
    },
    dependencies.logWarning,
  );

  if (!apiKey) {
    await safeFinishLog(
      dependencies.logger,
      {
        requestId,
        model,
        status: "unavailable",
        errorCode: "missing_api_key",
      },
      dependencies.logWarning,
    );

    return {
      status: 503,
      body: {
        error: GUIDE_UNAVAILABLE_MESSAGE,
        code: "missing_api_key",
      },
    };
  }

  const startedAt = dependencies.now();

  try {
    const generation = await dependencies.generateResponse(payload, {
      apiKey,
      model,
    });
    const promptContext = payload.debug
      ? dependencies.buildPromptContext(payload, generation.relatedPages)
      : null;
    const elapsedMs = dependencies.now() - startedAt;

    await safeFinishLog(
      dependencies.logger,
      {
        requestId,
        model: generation.provider.model ?? model,
        status: "answered",
        latencyMs: elapsedMs,
        answerLength: generation.response.answer.trim().length,
      },
      dependencies.logWarning,
    );

    return {
      status: 200,
      body: payload.debug
        ? {
            ...generation.response,
            debug: {
              promptContext: promptContext as Record<string, unknown>,
            },
          }
        : generation.response,
    };
  } catch (error) {
    const elapsedMs = dependencies.now() - startedAt;

    await safeFinishLog(
      dependencies.logger,
      {
        requestId,
        model,
        status: "errored",
        latencyMs: elapsedMs,
        errorCode: normalizeErrorCode(error),
      },
      dependencies.logWarning,
    );

    dependencies.logError("Portfolio Guide route failed:", error);
    return {
      status: 500,
      body: {
        error: "Unexpected server error.",
      },
    };
  }
}
