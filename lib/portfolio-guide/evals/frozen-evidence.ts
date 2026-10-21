import snapshot from "@/evals/integration/career-public.json";
import { rankHybrid } from "@/lib/search/hybrid";
import {
  parseEvidenceSearchResponse,
  type EvidenceFetchResult,
  type EvidenceToolInput,
} from "@/lib/portfolio-guide/tools/evidence";

/** Public projection captured offline from ResumeCustomizer; never loads private career files. */
export async function searchFrozenEvidence(input: EvidenceToolInput): Promise<EvidenceFetchResult> {
  const projectId = input.questionScope === "project" ? input.targetProjectId : undefined;
  const limit = Math.max(1, Math.min(6, Math.floor(input.maxResults ?? 5)));
  const hits = rankHybrid(snapshot.documents, input.query, { projectId, limit });
  const evidence = hits.map((hit) => snapshot.items.find((item) => item.id === hit.id)!);
  const data = parseEvidenceSearchResponse({
    contractVersion: "evidence.v1",
    query: input.query,
    answerability: evidence.length ? "medium" : "none",
    confidence: "low",
    evidence,
    ...(evidence.length ? {} : { safeFallback: "The frozen public evidence snapshot contains no matching proof for this question." }),
  });
  return data ? { ok: true, data } : { ok: false, reason: "invalid_shape" };
}


