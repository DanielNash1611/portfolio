import { NextRequest, NextResponse } from "next/server";
import {
  createPortfolioGuideConversationStore,
  isDurablePortfolioGuideEnabled,
} from "@/lib/portfolio-guide/conversation-store";
import { deleteStoredOpenAIResponses } from "@/lib/portfolio-guide/provider-retention";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret || req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!isDurablePortfolioGuideEnabled()) {
    return NextResponse.json({ processed: 0, deleted: 0, pending: 0 });
  }
  const store = createPortfolioGuideConversationStore();
  const candidates = await store.listDeletionCandidates(100);
  let deleted = 0;
  let pending = 0;
  for (const candidate of candidates) {
    const result = await deleteStoredOpenAIResponses(candidate.responseIds);
    const providerRetentionElapsed = candidate.status !== "deletion_pending";
    if (result.failed.length === 0 || providerRetentionElapsed) {
      await store.hardDelete(candidate.id);
      deleted += 1;
    } else {
      pending += 1;
    }
  }
  return NextResponse.json({ processed: candidates.length, deleted, pending });
}
