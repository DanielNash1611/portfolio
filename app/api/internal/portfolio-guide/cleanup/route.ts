import { NextRequest, NextResponse } from "next/server";
import {
  createPortfolioGuideConversationStore,
  isDurablePortfolioGuideEnabled,
} from "@/lib/portfolio-guide/conversation-store";
import { deleteStoredOpenAIResponses } from "@/lib/portfolio-guide/provider-retention";
import { pruneFeedback } from "@/lib/feedback";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (
    !cronSecret ||
    req.headers.get("authorization") !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  // Feedback expiry runs even when durable guide storage is disabled.
  // A failure here does not prevent the existing guide cleanup from running.
  let feedback: Awaited<ReturnType<typeof pruneFeedback>> | { error: string };
  try {
    feedback = await pruneFeedback();
  } catch {
    feedback = { error: "Feedback cleanup failed" };
    console.error("[feedback:cleanup] Persistence failed");
  }
  if (!isDurablePortfolioGuideEnabled()) {
    return NextResponse.json(
      { processed: 0, deleted: 0, pending: 0, feedback },
      { status: "error" in feedback ? 503 : 200 },
    );
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
  return NextResponse.json(
    { processed: candidates.length, deleted, pending, feedback },
    { status: "error" in feedback ? 503 : 200 },
  );
}
