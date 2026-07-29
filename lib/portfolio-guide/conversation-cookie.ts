import type { NextResponse } from "next/server";
import {
  GUIDE_CONVERSATION_COOKIE,
  GUIDE_CONVERSATION_RETENTION_DAYS,
} from "@/lib/portfolio-guide/conversation-store";

const COOKIE_MAX_AGE_SECONDS = GUIDE_CONVERSATION_RETENTION_DAYS * 24 * 60 * 60;

export function setGuideConversationCookie(
  response: NextResponse,
  token: string,
): void {
  response.cookies.set(GUIDE_CONVERSATION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export function clearGuideConversationCookie(response: NextResponse): void {
  response.cookies.set(GUIDE_CONVERSATION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
