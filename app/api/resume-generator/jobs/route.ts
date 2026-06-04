import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getClientIp, isAllowedOrigin } from "@/lib/contact";
import {
  createEngineJob,
  EngineUnavailableError,
  PayloadTooLargeError,
} from "@/lib/resume-generator/engineClient";
import { checkResumeRateLimit } from "@/lib/resume-generator/rateLimit";
import {
  RESUME_ESTIMATED_SECONDS,
  RESUME_JD_MAX_CHARS,
  type CreateJobRequest,
} from "@/lib/resume-generator/types";

export const dynamic = "force-dynamic";

function errorResponse(
  status: number,
  code: string,
  message: string,
  retryable = false,
  headers?: HeadersInit,
) {
  return NextResponse.json(
    { error: { code, message, retryable } },
    { status, headers },
  );
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalString(value: unknown): string | undefined {
  const trimmed = asString(value);
  return trimmed.length > 0 ? trimmed : undefined;
}

// POST /api/resume-generator/jobs  (contract §3.1)
export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return errorResponse(403, "invalid_request", "Request origin is not allowed.");
  }

  const ip = getClientIp(request);
  const rateLimit = checkResumeRateLimit(ip);
  if (rateLimit.limited) {
    return errorResponse(
      429,
      "rate_limited",
      "Too many resume requests. Please try again shortly.",
      true,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  let payload: CreateJobRequest;
  try {
    payload = (await request.json()) as CreateJobRequest;
  } catch {
    return errorResponse(400, "invalid_request", "Invalid request body.");
  }

  const jd = payload?.jobDescription;
  const text = asString(jd?.text);

  if (!text) {
    return errorResponse(
      400,
      "invalid_jd",
      "Please paste a job description to generate a tailored resume.",
    );
  }

  if (text.length > RESUME_JD_MAX_CHARS) {
    return errorResponse(
      413,
      "payload_too_large",
      `The job description is too long. Please keep it under ${RESUME_JD_MAX_CHARS.toLocaleString()} characters.`,
    );
  }

  // FORCE_UNAVAILABLE is a test hook for the "service unavailable" UI state.
  if (/FORCE_UNAVAILABLE/i.test(text)) {
    return errorResponse(
      503,
      "unavailable",
      "The resume generator is temporarily unavailable. Please try again soon.",
      true,
    );
  }

  try {
    const created = await createEngineJob({
      jobDescription: {
        text,
        sourceUrl: asOptionalString(jd?.sourceUrl),
        company: asOptionalString(jd?.company),
        roleTitle: asOptionalString(jd?.roleTitle),
      },
      variantHint: asOptionalString(payload?.variantHint),
      clientRequestId: randomUUID(),
    });

    return NextResponse.json(
      {
        jobId: created.jobId,
        status: created.status,
        expiresAt: created.expiresAt,
        pollUrl: `/api/resume-generator/jobs/${created.jobId}`,
        estimatedSeconds: created.estimatedSeconds || RESUME_ESTIMATED_SECONDS,
      },
      { status: 202, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return errorResponse(
        413,
        "payload_too_large",
        "The job description exceeds the allowed size.",
      );
    }
    if (error instanceof EngineUnavailableError) {
      return errorResponse(
        503,
        "unavailable",
        "The resume generator is temporarily unavailable. Please try again soon.",
        true,
      );
    }
    console.error("[resume-generator:create]", error);
    return errorResponse(
      502,
      "engine_failed",
      "We couldn't start generation right now. Please try again.",
      true,
    );
  }
}
