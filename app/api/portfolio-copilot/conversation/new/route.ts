import { NextRequest, NextResponse } from "next/server";
import { isAllowedOrigin } from "@/lib/contact";
import {
  createPortfolioGuideConversationStore,
  GUIDE_CONVERSATION_COOKIE,
  isDurablePortfolioGuideEnabled,
} from "@/lib/portfolio-guide/conversation-store";
import {
  clearGuideConversationCookie,
  setGuideConversationCookie,
} from "@/lib/portfolio-guide/conversation-cookie";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  }
  if (!isDurablePortfolioGuideEnabled()) {
    const response = NextResponse.json({ messages: [], persistenceStatus: "disabled" });
    clearGuideConversationCookie(response);
    return response;
  }
  try {
    const store = createPortfolioGuideConversationStore();
    const token = req.cookies.get(GUIDE_CONVERSATION_COOKIE)?.value;
    const current = token ? await store.resolve(token) : null;
    if (current) {
      await store.end(current.id);
    }
    const created = await store.create();
    const response = NextResponse.json({
      messages: [],
      persistenceStatus: "durable",
      expiresAt: created.conversation.expiresAt,
    });
    setGuideConversationCookie(response, created.token);
    return response;
  } catch (error) {
    console.warn("Portfolio Guide new conversation degraded:", error);
    const response = NextResponse.json({
      messages: [],
      persistenceStatus: "degraded",
      persistenceWarning: "A new temporary conversation was started in this browser.",
    });
    clearGuideConversationCookie(response);
    return response;
  }
}
