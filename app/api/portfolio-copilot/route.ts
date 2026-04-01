import { NextResponse } from "next/server";
import { buildPortfolioGuidePromptContext } from "@/lib/portfolio-guide/prompt";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import type { CopilotRequest } from "@/lib/portfolio-guide/types";
import { GUIDE_UNAVAILABLE_MESSAGE } from "@/lib/portfolio-guide/constants";

export const runtime = "nodejs";

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

function isValidRequest(input: unknown): input is CopilotRequest {
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
    (candidate.debug == null || typeof candidate.debug === "boolean") &&
    (candidate.conversation == null ||
      isConversationArray(candidate.conversation))
  );
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    if (!isValidRequest(payload)) {
      return NextResponse.json(
        { error: "Missing or invalid Portfolio Guide request." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-5.4";

    if (!apiKey) {
      return NextResponse.json(
        {
          error: GUIDE_UNAVAILABLE_MESSAGE,
          code: "missing_api_key",
        },
        { status: 503 },
      );
    }

    const generation = await generatePortfolioGuideResponse(payload, {
      apiKey,
      model,
    });
    const promptContext = payload.debug
      ? buildPortfolioGuidePromptContext(payload, generation.relatedPages)
      : null;

    return NextResponse.json(
      payload.debug
        ? {
            ...generation.response,
            debug: {
              promptContext: promptContext as Record<string, unknown>,
            },
          }
        : generation.response,
    );
  } catch (error) {
    console.error("Portfolio Guide route failed:", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 },
    );
  }
}
