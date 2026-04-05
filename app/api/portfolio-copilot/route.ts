import { NextResponse } from "next/server";
import { handlePortfolioGuideRequest } from "@/lib/portfolio-guide/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Missing or invalid Portfolio Guide request." },
      { status: 400 },
    );
  }

  const result = await handlePortfolioGuideRequest(payload);
  return NextResponse.json(result.body, { status: result.status });
}
