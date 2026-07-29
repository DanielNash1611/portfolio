import { NextRequest, NextResponse } from "next/server";
import { getClientIp, isAllowedOrigin } from "@/lib/contact";
import { getPageContextBySlug, getPortfolioContext } from "@/lib/portfolio-guide/context";
import {
  createPortfolioGuideConversationStore,
  GUIDE_CONVERSATION_COOKIE,
  hashPortfolioGuideIp,
  isDurablePortfolioGuideEnabled,
} from "@/lib/portfolio-guide/conversation-store";
import { setGuideConversationCookie } from "@/lib/portfolio-guide/conversation-cookie";
import { createPortfolioGuideInteractionLogger } from "@/lib/portfolio-guide/interaction-log";
import {
  mergeGuideSessionSignals,
  parsePortfolioGuideTurnRequest,
} from "@/lib/portfolio-guide/public-request";
import { generatePortfolioGuideResponse } from "@/lib/portfolio-guide/service";
import { handlePortfolioGuideRequest } from "@/lib/portfolio-guide/http";
import { PORTFOLIO_GUIDE_PROMPT_VERSION } from "@/lib/portfolio-guide/constants";
import type {
  CopilotRequest,
  GuideConversationMessage,
  GuideSessionSignals,
  PortfolioGuideTurnRequest,
} from "@/lib/portfolio-guide/types";

export const runtime = "nodejs";

function toInternalRequest(input: {
  request: PortfolioGuideTurnRequest;
  sessionSignals: GuideSessionSignals;
  messages: GuideConversationMessage[];
  conversationId?: string;
  turnIndex: number;
}): CopilotRequest | null {
  const pageContext = getPageContextBySlug(input.request.pageSlug);
  if (!pageContext) {
    return null;
  }
  return {
    message: input.request.message,
    pageContext,
    portfolioContext: getPortfolioContext(),
    sessionContext: input.sessionSignals,
    interactionMeta: {
      source: input.request.source,
      visitorId: input.conversationId
        ? `conversation_${input.conversationId}`
        : "anonymous_degraded",
      sessionId: input.conversationId ?? "degraded",
      turnIndex: input.turnIndex,
      conversationId: input.conversationId,
      clientTurnId: input.request.clientTurnId,
    },
    conversation:
      input.messages.length > 0
        ? input.messages.slice(-8).map(({ role, content }) => ({ role, content }))
        : input.request.fallbackConversation,
  };
}

async function runStatelessFallback(
  request: PortfolioGuideTurnRequest,
  reason: string,
  persistenceStatus: "disabled" | "degraded" = "degraded",
) {
  const sessionSignals = mergeGuideSessionSignals(
    request.sessionSignals,
    request.sessionSignals,
    request.pageSlug,
    request.message,
  );
  const internalRequest = toInternalRequest({
    request,
    sessionSignals,
    messages: [],
    turnIndex:
      (request.fallbackConversation?.filter((message) => message.role === "user").length ?? 0) + 1,
  });
  if (!internalRequest) {
    return NextResponse.json({ error: "Unknown portfolio page." }, { status: 400 });
  }
  const result = await handlePortfolioGuideRequest(internalRequest);
  return NextResponse.json(
    {
      ...result.body,
      persistenceStatus,
      persistenceWarning:
        "This answer worked, but the conversation could not be saved. Your current browser keeps a temporary copy.",
    },
    { status: result.status },
  );
}

export async function POST(req: NextRequest) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }

  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Missing or invalid Portfolio Guide request." },
      { status: 400 },
    );
  }

  const publicRequest = parsePortfolioGuideTurnRequest(payload);
  if (!publicRequest) {
    return NextResponse.json(
      { error: "Missing or invalid Portfolio Guide request." },
      { status: 400 },
    );
  }
  if (!getPageContextBySlug(publicRequest.pageSlug)) {
    return NextResponse.json({ error: "Unknown portfolio page." }, { status: 400 });
  }

  if (!isDurablePortfolioGuideEnabled()) {
    return runStatelessFallback(
      publicRequest,
      "durable_conversations_disabled",
      "disabled",
    );
  }

  try {
    const store = createPortfolioGuideConversationStore();
    const existingToken = req.cookies.get(GUIDE_CONVERSATION_COOKIE)?.value;
    let conversation = existingToken ? await store.resolve(existingToken) : null;
    let newToken: string | undefined;
    if (!conversation) {
      const created = await store.create();
      conversation = created.conversation;
      newToken = created.token;
    }

    const messages = await store.loadMessages(conversation.id);
    const sessionSignals = mergeGuideSessionSignals(
      conversation.sessionMemory,
      publicRequest.sessionSignals,
      publicRequest.pageSlug,
      publicRequest.message,
    );
    let internalRequest = toInternalRequest({
      request: publicRequest,
      sessionSignals,
      messages,
      conversationId: conversation.id,
      turnIndex: messages.filter((message) => message.role === "user").length + 1,
    });
    if (!internalRequest) {
      return NextResponse.json({ error: "Unknown portfolio page." }, { status: 400 });
    }

    const begun = await store.beginTurn({
      conversationId: conversation.id,
      clientTurnId: publicRequest.clientTurnId,
      ipHash: hashPortfolioGuideIp(getClientIp(req)),
      request: internalRequest,
      model: process.env.OPENAI_MODEL || "gpt-5.4",
      promptVersion: PORTFOLIO_GUIDE_PROMPT_VERSION,
    });

    if (begun.kind === "rate_limited") {
      return NextResponse.json(
        { error: "Too many guide requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(begun.retryAfterSeconds) } },
      );
    }
    if (begun.kind === "in_progress") {
      return NextResponse.json(
        { error: "This conversation is already answering a question." },
        { status: 409, headers: { "Retry-After": String(begun.retryAfterSeconds) } },
      );
    }

    const expiresAt = await store.updateMemory(conversation.id, sessionSignals);
    if (begun.kind === "existing") {
      const response = NextResponse.json({
        ...begun.response,
        persistenceStatus: "durable",
        expiresAt,
        turnId: begun.interactionId,
        turnIndex: begun.turnIndex,
      });
      if (newToken) {
        setGuideConversationCookie(response, newToken);
      }
      return response;
    }
    if (begun.kind !== "started") {
      return NextResponse.json({ error: "Conversation turn could not start." }, { status: 409 });
    }

    internalRequest = {
      ...internalRequest,
      interactionMeta: {
        ...internalRequest.interactionMeta!,
        turnIndex: begun.turnIndex,
      },
    };
    const result = await handlePortfolioGuideRequest(internalRequest, {
      logger: createPortfolioGuideInteractionLogger(),
      createRequestId: () => begun.requestId,
      generateResponse: (request, config) =>
        generatePortfolioGuideResponse(request, {
          ...config,
          conversationHistorySearch: (query, maxResults) =>
            store.searchUserMessages(conversation.id, query, maxResults),
        }),
    });
    const response = NextResponse.json(
      {
        ...result.body,
        persistenceStatus: "durable",
        expiresAt,
        turnId: begun.interactionId,
        turnIndex: begun.turnIndex,
      },
      { status: result.status },
    );
    if (newToken) {
      setGuideConversationCookie(response, newToken);
    }
    return response;
  } catch (error) {
    console.warn("Portfolio Guide durable conversation degraded:", error);
    return runStatelessFallback(
      publicRequest,
      error instanceof Error ? error.message : "persistence_unavailable",
    );
  }
}
