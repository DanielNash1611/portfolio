import { NextRequest, NextResponse } from "next/server";
import {
  getEnginePdf,
  EngineUnavailableError,
} from "@/lib/resume-generator/engineClient";

export const dynamic = "force-dynamic";

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    { error: { code, message, retryable: status >= 500 } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

// GET /api/resume-generator/jobs/{jobId}/pdf  (contract §3.3)
// This is the no-email direct download path (contract decision #6).
export async function GET(
  _request: NextRequest,
  { params }: { params: { jobId: string } },
) {
  const { jobId } = params;

  let result;
  try {
    result = await getEnginePdf(jobId);
  } catch (error) {
    if (error instanceof EngineUnavailableError) {
      return errorResponse(
        503,
        "unavailable",
        error.message,
      );
    }
    console.error("[resume-generator:pdf]", error);
    return errorResponse(502, "engine_failed", "Unable to download the PDF.");
  }

  if (!result.ok) {
    if (result.status === "not_ready") {
      return errorResponse(409, "not_ready", "The resume isn't ready yet.");
    }
    if (result.status === "expired") {
      return errorResponse(
        410,
        "expired",
        "This download has expired. Please regenerate the resume.",
      );
    }
    return errorResponse(404, "not_found", "We couldn't find that resume job.");
  }

  return new NextResponse(Buffer.from(result.bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${result.filename}"`,
      "Content-Length": String(result.bytes.byteLength),
      "Cache-Control": "no-store",
    },
  });
}
