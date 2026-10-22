import { NextRequest, NextResponse } from "next/server";
import { getPublicPageEvidence } from "@/lib/portfolio-agent/catalog";

export function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const evidence =
    slug && slug.length <= 120 ? getPublicPageEvidence(slug) : null;
  return evidence
    ? NextResponse.json(evidence, {
        headers: { "Cache-Control": "public, max-age=300" },
      })
    : NextResponse.json({ error: "Unknown portfolio page." }, { status: 404 });
}
