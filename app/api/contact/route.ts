import { NextRequest, NextResponse } from "next/server";

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const contactRateLimitWindowMs = 15 * 60 * 1000;
const maxContactRequestsPerWindow = 5;
const minFormFillTimeMs = 1500;
const maxNameLength = 120;
const maxEmailLength = 320;
const maxMessageLength = 5000;

const requestTimestampsByIp = new Map<string, number[]>();

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

function normalizeField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
}

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    return process.env.NODE_ENV !== "production";
  }

  const allowedOrigins = new Set<string>([request.nextUrl.origin]);
  const siteBaseUrl = process.env.SITE_BASE_URL;

  if (siteBaseUrl) {
    try {
      allowedOrigins.add(new URL(siteBaseUrl).origin);
    } catch {
      // Ignore malformed deployment configuration and fall back to request origin.
    }
  }

  if (process.env.NODE_ENV !== "production") {
    allowedOrigins.add("http://localhost:3000");
    allowedOrigins.add("http://127.0.0.1:3000");
  }

  return allowedOrigins.has(origin);
}

function isRateLimited(ipAddress: string): boolean {
  if (!ipAddress) {
    return false;
  }

  const now = Date.now();
  const recentRequests = (
    requestTimestampsByIp.get(ipAddress) ?? []
  ).filter((timestamp) => now - timestamp < contactRateLimitWindowMs);

  if (recentRequests.length >= maxContactRequestsPerWindow) {
    requestTimestampsByIp.set(ipAddress, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestTimestampsByIp.set(ipAddress, recentRequests);
  return false;
}

async function sendContactNotification({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactToEmail = process.env.CONTACT_TO_EMAIL;
  const contactFromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !contactToEmail || !contactFromEmail) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact:dev]", {
        configured: false,
        senderEmail: email,
      });
      return;
    }

    throw new Error("Missing contact email configuration.");
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: contactFromEmail,
      to: [contactToEmail],
      reply_to: email,
      subject: `Portfolio contact from ${name}`,
      text: [
        "New portfolio contact submission",
        "",
        `From: ${name} <${email}>`,
        `Submitted: ${new Date().toISOString()}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    }),
  });

  if (resendResponse.ok) {
    return;
  }

  let errorMessage = "Unable to deliver contact message.";

  try {
    const data = await resendResponse.json();
    errorMessage =
      data?.message ?? data?.error?.message ?? data?.error ?? errorMessage;
  } catch {
    // Ignore parse failures and use the generic message.
  }

  throw new Error(errorMessage);
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "Request origin is not allowed." },
      { status: 403 },
    );
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid contact payload." },
      { status: 400 },
    );
  }

  const name = normalizeField(payload.name);
  const email = normalizeField(payload.email);
  const message = normalizeField(payload.message);
  const website = normalizeField(payload.website);
  const startedAtRaw = normalizeField(payload.startedAt);
  const startedAt = Number(startedAtRaw);
  const clientIp = getClientIp(request);

  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (
    startedAtRaw &&
    Number.isFinite(startedAt) &&
    Date.now() - startedAt < minFormFillTimeMs
  ) {
    return NextResponse.json(
      { ok: false, error: "Please take a moment and try again." },
      { status: 400 },
    );
  }

  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages sent. Please try again shortly." },
      { status: 429 },
    );
  }

  if (name.length < 2 || name.length > maxNameLength) {
    return NextResponse.json(
      { ok: false, error: "Please enter your name." },
      { status: 400 },
    );
  }

  if (
    !email ||
    email.length > maxEmailLength ||
    !emailPattern.test(email)
  ) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!message || message.length < 10 || message.length > maxMessageLength) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please include a short message with a bit more detail.",
      },
      { status: 400 },
    );
  }

  try {
    await sendContactNotification({ name, email, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact:error]", error);
    return NextResponse.json(
      { ok: false, error: "Unable to send your message right now." },
      { status: 502 },
    );
  }
}
