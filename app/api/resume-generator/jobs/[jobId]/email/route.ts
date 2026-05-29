import { NextRequest, NextResponse } from "next/server";
import {
  emailPattern,
  getClientIp,
  isAllowedOrigin,
  maxEmailLength,
} from "@/lib/contact";
import {
  getEngineJob,
  EngineUnavailableError,
} from "@/lib/resume-generator/engineClient";
import { checkResumeRateLimit } from "@/lib/resume-generator/rateLimit";
import type {
  EmailDeliveryRequest,
  EmailDeliveryResponse,
} from "@/lib/resume-generator/types";

export const dynamic = "force-dynamic";

// POST /api/resume-generator/jobs/{jobId}/email  (contract §3.4)
//
// PLACEHOLDER. Email delivery via Resend is owned by a separate workstream
// (Thread E). This route validates the request shape, confirms the job is
// ready, and enforces the opt-in `ccDaniel` default, but does NOT send mail.
// It returns `{ ok: true, emailed: false, pending: true }` so the UI can
// acknowledge the request while keeping the no-email download path primary.
export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } },
) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { ok: false, emailed: false, ccDaniel: false, error: "forbidden" },
      { status: 403 },
    );
  }

  const rateLimit = checkResumeRateLimit(getClientIp(request));
  if (rateLimit.limited) {
    return NextResponse.json(
      {
        ok: false,
        emailed: false,
        ccDaniel: false,
        error: "rate_limited",
      },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  let body: EmailDeliveryRequest;
  try {
    body = (await request.json()) as EmailDeliveryRequest;
  } catch {
    return NextResponse.json(
      { ok: false, emailed: false, ccDaniel: false, error: "invalid_request" },
      { status: 400 },
    );
  }

  const recipientEmail =
    typeof body.recipientEmail === "string" ? body.recipientEmail.trim() : "";
  // ccDaniel is opt-in only (contract decision #7): default false.
  const ccDaniel = body.ccDaniel === true;

  if (
    !recipientEmail ||
    recipientEmail.length > maxEmailLength ||
    !emailPattern.test(recipientEmail)
  ) {
    return NextResponse.json(
      {
        ok: false,
        emailed: false,
        ccDaniel,
        error: "Please enter a valid email address.",
      },
      { status: 400 },
    );
  }

  // Confirm the job exists and is ready before acknowledging delivery.
  let envelope;
  try {
    envelope = await getEngineJob(params.jobId);
  } catch (error) {
    if (error instanceof EngineUnavailableError) {
      return NextResponse.json(
        { ok: false, emailed: false, ccDaniel, error: "unavailable" },
        { status: 503 },
      );
    }
    console.error("[resume-generator:email]", error);
    return NextResponse.json(
      { ok: false, emailed: false, ccDaniel, error: "engine_failed" },
      { status: 502 },
    );
  }

  if (!envelope) {
    return NextResponse.json(
      { ok: false, emailed: false, ccDaniel, error: "not_found" },
      { status: 404 },
    );
  }
  if (envelope.status === "expired") {
    return NextResponse.json(
      { ok: false, emailed: false, ccDaniel, error: "expired" },
      { status: 410 },
    );
  }
  if (envelope.status !== "ready") {
    return NextResponse.json(
      { ok: false, emailed: false, ccDaniel, error: "not_ready" },
      { status: 409 },
    );
  }

  // TODO (Thread E): fetch the PDF from the engine, attach it, and send via
  // Resend using CONTACT_FROM_EMAIL. CC CONTACT_TO_EMAIL only when ccDaniel is
  // true; otherwise include contact links (portfolio /contact + mailto) in the
  // body (contract decision #8).
  const response: EmailDeliveryResponse = {
    ok: true,
    emailed: false,
    pending: true,
    ccDaniel,
    message:
      "Your request was received. Email delivery is being finalized — your download is ready now.",
  };

  return NextResponse.json(response, { status: 202 });
}
