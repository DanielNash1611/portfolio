import { NextRequest, NextResponse } from "next/server";
import {
  getEngineJob,
  EngineUnavailableError,
} from "@/lib/resume-generator/engineClient";
import type { JobStatusResponse } from "@/lib/resume-generator/types";

export const dynamic = "force-dynamic";

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    { error: { code, message, retryable: status >= 500 } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

// GET /api/resume-generator/jobs/{jobId}  (contract §3.2)
export async function GET(
  _request: NextRequest,
  { params }: { params: { jobId: string } },
) {
  const { jobId } = params;

  let envelope;
  try {
    envelope = await getEngineJob(jobId);
  } catch (error) {
    if (error instanceof EngineUnavailableError) {
      return errorResponse(
        503,
        "unavailable",
        error.message,
      );
    }
    console.error("[resume-generator:status]", error);
    return errorResponse(502, "engine_failed", "Unable to check job status.");
  }

  if (!envelope) {
    return errorResponse(404, "not_found", "We couldn't find that resume job.");
  }

  // Rewrite the internal pdfPath to a same-origin public download URL so the
  // browser never sees the engine's internal path (contract §3.2).
  const publicEnvelope: JobStatusResponse = {
    jobId: envelope.jobId,
    status: envelope.status,
    progress: envelope.progress ?? null,
    createdAt: envelope.createdAt,
    updatedAt: envelope.updatedAt,
    expiresAt: envelope.expiresAt,
    error: envelope.error,
    result: envelope.result
      ? {
          pdfAvailable: envelope.result.pdfAvailable,
          filename: envelope.result.filename,
          downloadUrl: `/api/resume-generator/jobs/${envelope.jobId}/pdf`,
          fitSummary: envelope.result.fitSummary,
          company: envelope.result.company,
          roleTitle: envelope.result.roleTitle,
          mock: envelope.result.mock === true,
        }
      : null,
  };

  return NextResponse.json(publicEnvelope, {
    headers: { "Cache-Control": "no-store" },
  });
}
