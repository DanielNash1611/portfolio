import { NextRequest, NextResponse } from "next/server";
import { isAllowedOrigin } from "@/lib/contact";
import {
  createPortfolioGuideConversationStore,
  GUIDE_CONVERSATION_COOKIE,
  isDurablePortfolioGuideEnabled,
} from "@/lib/portfolio-guide/conversation-store";
import { clearGuideConversationCookie } from "@/lib/portfolio-guide/conversation-cookie";
import { deleteStoredOpenAIResponses } from "@/lib/portfolio-guide/provider-retention";

export const runtime = "nodejs";

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
      const response = NextResponse.json({ messages: [], persistenceStatus: "durable" });
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
      persistenceWarning: "Saved conversation history is temporarily unavailable.",
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
    console.warn("Portfolio Guide conversation deletion queued:", error);
    return response;
  }
}
