import { NextRequest, NextResponse } from "next/server";
import { isAllowedOrigin } from "@/lib/contact";
import {
  createPortfolioGuideConversationStore,
  GUIDE_CONVERSATION_COOKIE,
  isDurablePortfolioGuideEnabled,
} from "@/lib/portfolio-guide/conversation-store";
import { clearGuideConversationCookie } from "@/lib/portfolio-guide/conversation-cookie";
import { deleteStoredOpenAIResponses } from "@/lib/portfolio-guide/provider-retention";
import { normalizeVisitorIntent } from "@/lib/portfolio-guide/intent";
import { findRelevantWork } from "@/lib/portfolio-agent/capabilities";
import { getPublicSurfaceCatalog } from "@/lib/portfolio-agent/catalog";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest) {
  if (!isAllowedOrigin(req))
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  let input: unknown;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid lens." }, { status: 400 });
  }
  if (
    !input ||
    typeof input !== "object" ||
    !("rawInput" in input) ||
    (input.rawInput !== null &&
      (typeof input.rawInput !== "string" ||
        !input.rawInput.trim() ||
        input.rawInput.length > 1000))
  ) {
    return NextResponse.json(
      {
        error:
          "Enter a role or interest up to 1,000 characters, or null to clear.",
      },
      { status: 400 },
    );
  }
  if (!isDurablePortfolioGuideEnabled())
    return NextResponse.json({ persistenceStatus: "disabled" });
  const token = req.cookies.get(GUIDE_CONVERSATION_COOKIE)?.value;
  if (!token) return NextResponse.json({ persistenceStatus: "disabled" });
  try {
    const store = createPortfolioGuideConversationStore();
    const conversation = await store.resolve(token);
    if (!conversation)
      return NextResponse.json({ persistenceStatus: "disabled" });
    const intent =
      input.rawInput === null
        ? undefined
        : (normalizeVisitorIntent(input.rawInput as string) ?? undefined);
    await store.updateLens(
      conversation.id,
      intent,
      intent
        ? findRelevantWork(getPublicSurfaceCatalog(), intent.rawInput)
        : undefined,
    );
    return NextResponse.json({ persistenceStatus: "durable" });
  } catch {
    return NextResponse.json(
      { error: "Saved lens update temporarily unavailable." },
      { status: 503 },
    );
  }
}

export async function GET(req: NextRequest) {
  if (!isDurablePortfolioGuideEnabled()) {
    return NextResponse.json({ messages: [], persistenceStatus: "disabled" });
  }
  try {
    const token = req.cookies.get(GUIDE_CONVERSATION_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ messages: [], persistenceStatus: "durable" });
    }
    const store = createPortfolioGuideConversationStore();
    const conversation = await store.resolve(token);
    if (!conversation) {
      const response = NextResponse.json({
        messages: [],
        persistenceStatus: "durable",
      });
      clearGuideConversationCookie(response);
      return response;
    }
    const messages = await store.loadMessages(conversation.id);
    return NextResponse.json({
      messages,
      sessionSignals: conversation.sessionMemory,
      persistenceStatus: "durable",
      expiresAt: conversation.expiresAt,
    });
  } catch (error) {
    console.warn("Portfolio Guide conversation restore failed:", error);
    return NextResponse.json({
      messages: [],
      persistenceStatus: "degraded",
      persistenceWarning:
        "Saved conversation history is temporarily unavailable.",
    });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  const response = NextResponse.json({ deleted: true });
  clearGuideConversationCookie(response);
  if (!isDurablePortfolioGuideEnabled()) {
    return response;
  }
  try {
    const token = req.cookies.get(GUIDE_CONVERSATION_COOKIE)?.value;
    if (!token) {
      return response;
    }
    const store = createPortfolioGuideConversationStore();
    const conversation = await store.resolve(token);
    if (!conversation) {
      return response;
    }
    const responseIds = await store.markDeletionPending(conversation.id);
    const providerDeletion = await deleteStoredOpenAIResponses(responseIds);
    if (providerDeletion.failed.length === 0) {
      await store.hardDelete(conversation.id);
    }
    return response;
  } catch (error) {
    console.warn("Portfolio Guide conversation deletion unavailable:", error);
    return NextResponse.json(
      {
        error:
          "Saved conversation deletion is temporarily unavailable. Please retry.",
      },
      { status: 503 },
    );
  }
}
