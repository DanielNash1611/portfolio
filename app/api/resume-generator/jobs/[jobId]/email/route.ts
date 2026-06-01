import { NextRequest, NextResponse } from "next/server";
import {
  emailPattern,
  getClientIp,
  isAllowedOrigin,
  maxEmailLength,
} from "@/lib/contact";
import {
  getEnginePdf,
  getEngineJob,
  EngineUnavailableError,
} from "@/lib/resume-generator/engineClient";
import {
  sendGeneratedResumeEmail,
  ResumeEmailConfigurationError,
  ResumeEmailSendError,
} from "@/lib/resume-generator/emailDelivery";
import { checkResumeRateLimit } from "@/lib/resume-generator/rateLimit";
import type {
  EmailDeliveryRequest,
  EmailDeliveryResponse,
} from "@/lib/resume-generator/types";

export const dynamic = "force-dynamic";

// POST /api/resume-generator/jobs/{jobId}/email  (contract §3.4)
//
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

  // Confirm the job exists and is ready before fetching/attaching the PDF.
  let envelope;
  try {
    envelope = await getEngineJob(params.jobId);
  } catch (error) {
    if (error instanceof EngineUnavailableError) {
      return NextResponse.json(
        {
          ok: false,
          emailed: false,
          ccDaniel,
          error: "unavailable",
          message: error.message,
        },
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

  let pdf;
  try {
    pdf = await getEnginePdf(params.jobId);
  } catch (error) {
    if (error instanceof EngineUnavailableError) {
      return NextResponse.json(
        {
          ok: false,
          emailed: false,
          ccDaniel,
          error: "unavailable",
          message: error.message,
        },
        { status: 503 },
      );
    }
    console.error("[resume-generator:email:pdf]", error);
    return NextResponse.json(
      { ok: false, emailed: false, ccDaniel, error: "engine_failed" },
      { status: 502 },
    );
  }

  if (!pdf.ok) {
    const status = pdf.status === "not_ready" ? 409 : pdf.status === "expired" ? 410 : 404;
    return NextResponse.json(
      { ok: false, emailed: false, ccDaniel, error: pdf.status },
      { status },
    );
  }

  const contactUrl = new URL("/contact", request.nextUrl.origin).toString();

  try {
    await sendGeneratedResumeEmail({
      recipientEmail,
      ccDaniel,
      mock: envelope.result?.mock === true,
      note: typeof body.note === "string" ? body.note : undefined,
      pdf: {
        bytes: pdf.bytes,
        filename: pdf.filename,
      },
      job: {
        jobId: envelope.jobId,
        company: envelope.result?.company,
        roleTitle: envelope.result?.roleTitle,
        fitSummary: envelope.result?.fitSummary,
      },
      contactUrl,
    });
  } catch (error) {
    if (
      error instanceof ResumeEmailConfigurationError ||
      error instanceof ResumeEmailSendError
    ) {
      return NextResponse.json(
        { ok: false, emailed: false, ccDaniel, error: "email_send_failed" },
        { status: 502 },
      );
    }
    console.error("[resume-generator:email:send]", error);
    return NextResponse.json(
      { ok: false, emailed: false, ccDaniel, error: "email_send_failed" },
      { status: 502 },
    );
  }

  const response: EmailDeliveryResponse = {
    ok: true,
    emailed: true,
    ccDaniel,
    message: "Sent. Check your inbox.",
  };

  return NextResponse.json(response, { status: 200 });
}
