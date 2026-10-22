import { getPageContextBySlug } from "./context";
import { resolveQuestionScope, searchPortfolio } from "./search";
import {
  callEvidenceTool,
  buildUnavailableEvidenceResult,
  type EvidenceConfig,
  type EvidenceSearchResponse,
  type EvidenceUnavailableReason,
} from "./tools/evidence";
import type { CopilotRequest } from "./types";
import type { ClaimBlock } from "./factual-answers";

/** Retrieval supplies allowlisted blocks; the existing ID selection is relevance review.
 * No free-prose synthesis or extra relevance-model call is introduced. */
export async function retrieveGuideSources(
  request: CopilotRequest,
  config: {
    apiKey?: string;
    signal?: AbortSignal;
    semantic?: boolean;
    evidenceConfig?: EvidenceConfig;
    portfolioSearch?: (
      scope: ReturnType<typeof resolveQuestionScope>,
    ) => Promise<Awaited<ReturnType<typeof searchPortfolio>>>;
    careerSearch?: (
      payload: Parameters<typeof callEvidenceTool>[0],
    ) => ReturnType<typeof callEvidenceTool>;
  },
) {
  const scope = resolveQuestionScope(request);
  if (/\b(?:role|fit|relevan\w*|requirements?)\b/i.test(request.message)) {
    const role = request.sessionContext.visitorIntent?.rawInput?.slice(0, 1000);
    if (role) scope.query += `\nDeclared role requirements: ${role}`;
  }
  const [portfolio, career] = await Promise.all([
    config.portfolioSearch
      ? config.portfolioSearch(scope)
      : searchPortfolio(scope, config),
    scope.kind !== "page" && (config.evidenceConfig || config.careerSearch)
      ? (
          config.careerSearch ??
          ((payload) =>
            callEvidenceTool(payload, config.evidenceConfig!, config.signal))
        )({
          query: scope.query,
          currentPortfolioPage: request.pageContext.slug,
          questionScope: scope.kind,
          targetProjectId: scope.projectId,
          maxResults: 6,
        })
      : Promise.resolve(undefined),
  ]);
  const evidenceUnavailableReason: EvidenceUnavailableReason | undefined =
    scope.kind === "page"
      ? undefined
      : !config.evidenceConfig && !config.careerSearch
        ? "not_configured"
        : career && !career.ok
          ? career.reason
          : career?.ok && !career.data.evidence.length
            ? "no_evidence_found"
            : undefined;
  const careerEvidence: EvidenceSearchResponse | undefined = career?.ok
    ? career.data
    : evidenceUnavailableReason
      ? buildUnavailableEvidenceResult(scope.query, evidenceUnavailableReason)
      : undefined;
  // Keep model URLs out of the factual/citation path. Canonical pages remain server-owned.
  const primary =
    scope.kind === "project" && scope.projectId
      ? getPageContextBySlug(scope.projectId)
      : null;
  const effectiveRequest: CopilotRequest = {
    ...request,
    ...(primary ? { pageContext: primary } : {}),
    scope: scope.kind === "broad" ? "portfolio" : "page",
  };
  const blocks: ClaimBlock[] = portfolio.blocks;
  const candidateIds = [
    ...blocks.map((b) => b.id),
    ...(careerEvidence?.evidence.map((e) => `career:${e.id}`) ?? []),
  ];
  const proof = [
    ...blocks.flatMap((block) => block.claims),
    ...(careerEvidence?.evidence.flatMap((e) => [
      e.claim,
      ...e.supportingDetails,
    ]) ?? []),
  ];
  const qualificationGap = [
    "HIPAA",
    "FedRAMP",
    "clinical validation",
    "ISO 27001",
  ].find(
    (term) =>
      scope.query.toLowerCase().includes(term.toLowerCase()) &&
      !proof.some(
        (text) =>
          text.toLowerCase().includes(term.toLowerCase()) &&
          !/\b(?:no|not|without|cannot|unverified)\b/i.test(text),
      ),
  );
  return {
    qualificationGap,
    scope,
    request: effectiveRequest,
    blocks,
    careerEvidence,
    evidenceUnavailableReason,
    candidateIds,
    mode: portfolio.mode,
    careerMode: careerEvidence?.retrievalMeta?.mode,
  };
}
