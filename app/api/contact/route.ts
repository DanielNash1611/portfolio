import { NextRequest, NextResponse } from "next/server";
import {
  type ContactPayload,
  emailPattern,
  getClientIp,
  getUserAgent,
  isAllowedOrigin,
  maxEmailLength,
  maxMessageLength,
  maxNameLength,
  maxSubjectLength,
  minFormFillTimeMs,
  normalizeField,
} from "@/lib/contact";
import { sendContactNotification } from "@/lib/contactNotification";
import { checkAndRecordContactRateLimit } from "@/lib/contactRateLimit";
import {
  type SavedContactSubmission,
  saveContactSubmission,
} from "@/lib/contactSubmissions";

const missingRelationErrorCode = "42P01";
const contactSetupHint =
  "missing contact form database tables; run `npm run db:migrate` or apply `migrations/002_contact_form.sql` in Neon";

function isMissingRelationError(
  error: unknown,
): error is { code: string; message?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === missingRelationErrorCode
  );
}

function logContactDatabaseError(context: string, error: unknown) {
  if (isMissingRelationError(error)) {
    console.error(`[contact:${context}] ${contactSetupHint}`, error);
    return;
  }

  console.error(`[contact:${context}]`, error);
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
  const subject = normalizeField(payload.subject);
  const message = normalizeField(payload.message);
  const website = normalizeField(payload.website);
  const startedAtRaw = normalizeField(payload.startedAt);
  const startedAt = Number(startedAtRaw);
  const clientIp = getClientIp(request);
  const userAgent = getUserAgent(request);

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

  if (name.length < 2 || name.length > maxNameLength) {
    return NextResponse.json(
      { ok: false, error: "Please enter your name." },
      { status: 400 },
    );
  }

  if (!email || email.length > maxEmailLength || !emailPattern.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (subject.length > maxSubjectLength) {
    return NextResponse.json(
      { ok: false, error: "Please shorten the subject line." },
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
    const rateLimitResult = await checkAndRecordContactRateLimit({
      ip: clientIp,
    });

    if (rateLimitResult.limited) {
      return NextResponse.json(
        {
          ok: false,
          error: "Too many messages sent. Please try again shortly.",
        },
        { status: 429 },
      );
    }
  } catch (error) {
    logContactDatabaseError("rate_limit_error", error);
    return NextResponse.json(
      { ok: false, error: "Unable to send your message right now." },
      { status: 500 },
    );
  }

  let savedSubmission: SavedContactSubmission;

  try {
    savedSubmission = await saveContactSubmission({
      name,
      email,
      subject: subject || null,
      message,
      ip: clientIp,
      fingerprint: null,
      userAgent,
    });
  } catch (error) {
    logContactDatabaseError("persistence_error", error);
    return NextResponse.json(
      { ok: false, error: "Unable to send your message right now." },
      { status: 500 },
    );
  }

  try {
    await sendContactNotification(savedSubmission);
  } catch (error) {
    console.error("[contact:notification_error]", error);
  }

  return NextResponse.json({ ok: true });
}
