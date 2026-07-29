import assert from "node:assert/strict";
import test from "node:test";
import { NextResponse } from "next/server";
import {
  clearGuideConversationCookie,
  setGuideConversationCookie,
} from "@/lib/portfolio-guide/conversation-cookie";

test("conversation cookie is opaque, httpOnly, same-site, and browser-persistent", () => {
  const response = NextResponse.json({ ok: true });
  setGuideConversationCookie(response, "opaque-token");
  const header = response.headers.get("set-cookie") ?? "";
  assert.match(header, /portfolio-guide-conversation=opaque-token/);
  assert.match(header, /HttpOnly/i);
  assert.match(header, /SameSite=Lax/i);
  assert.match(header, /Max-Age=7776000/i);
});

test("clearing a conversation cookie expires it immediately", () => {
  const response = NextResponse.json({ ok: true });
  clearGuideConversationCookie(response);
  assert.match(response.headers.get("set-cookie") ?? "", /Max-Age=0/i);
});
