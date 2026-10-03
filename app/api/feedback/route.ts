import { NextRequest, NextResponse } from "next/server";
import { isAllowedOrigin, getClientIp } from "@/lib/contact";
import {
  MAX_FEEDBACK_BODY_BYTES,
  normalizeFeedback,
  networkKey,
  saveFeedback,
} from "@/lib/feedback";
import { isDatabaseConfigured } from "@/lib/db";

export const runtime = "nodejs";
function originAllowed(request: NextRequest) {
  if (isAllowedOrigin(request)) return true;
  try {
    const origin = new URL(request.headers.get("origin") ?? "");
    return (
      origin.host === request.headers.get("host") &&
      origin.protocol === request.nextUrl.protocol
    );
  } catch {
    return false;
  }
}
export async function POST(request: NextRequest) {
  if (
    request.headers.get("sec-fetch-site") === "cross-site" ||
    !originAllowed(request)
  )
    return NextResponse.json(
      { ok: false, error: "Request origin is not allowed." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return NextResponse.json(
      { ok: false, error: "Invalid feedback." },
      { status: 400 },
    );
  let value: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("No body");
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > MAX_FEEDBACK_BODY_BYTES) {
        await reader.cancel();
        return NextResponse.json(
          { ok: false, error: "Please shorten your feedback." },
          { status: 413 },
        );
      }
      chunks.push(chunk.value);
    }
    value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid feedback." },
      { status: 400 },
    );
  }
  if (
    value &&
    typeof value === "object" &&
    "website" in value &&
    (value as { website: unknown }).website
  )
    return NextResponse.json(
      { ok: false, error: "Unable to send feedback." },
      { status: 400 },
    );
  const payload = normalizeFeedback(value);
  if (!payload)
    return NextResponse.json(
      {
        ok: false,
        error: "Please choose a category and enter up to 2,000 characters.",
      },
      { status: 400 },
    );
  if (
    request.headers.get("dnt") === "1" ||
    request.headers.get("sec-gpc") === "1" ||
    process.env.NEXT_PUBLIC_ANALYTICS_DISABLED === "true"
  ) {
    payload.visitorId = null;
    payload.sessionId = null;
  }
  const secret = process.env.FEEDBACK_RATE_LIMIT_SECRET?.trim();
  if (!secret || !isDatabaseConfigured())
    return NextResponse.json(
      {
        ok: false,
        error: "Feedback is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  try {
    const result = await saveFeedback(
      payload,
      networkKey(getClientIp(request), secret),
    );
    if (result === "limited")
      return NextResponse.json(
        {
          ok: false,
          error: "Too many submissions. Please try again in an hour.",
        },
        { status: 429, headers: { "Retry-After": "3600" } },
      );
    if (result === "conflict")
      return NextResponse.json(
        { ok: false, error: "Please reopen the form and try again." },
        { status: 409 },
      );
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    console.error("[feedback:ingest] Persistence failed");
    return NextResponse.json(
      { ok: false, error: "Feedback could not be saved. Please try again." },
      { status: 503 },
    );
  }
}
