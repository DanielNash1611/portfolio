import OpenAI from "openai";
import { selectRecommendationsForPage } from "@/lib/portfolio-guide/context";
import { getRelatedPages } from "@/lib/portfolio-guide/related";
import {
  buildPortfolioGuideInput,
  extractResponseText,
  normalizeCopilotResponse,
  PORTFOLIO_GUIDE_SYSTEM_PROMPT,
} from "@/lib/portfolio-guide/prompt";
import type {
  CopilotRequest,
  CopilotResponse,
  EvidenceSummary,
  RelatedPage,
} from "@/lib/portfolio-guide/types";
import {
  buildUnavailableEvidenceResult,
  callEvidenceTool,
  EVIDENCE_FALLBACK_MESSAGES,
  SEARCH_CAREER_EVIDENCE_TOOL_DEFINITION,
  type EvidenceConfig,
  type EvidenceItem,
  type EvidenceSearchResponse,
  type EvidenceUnavailableReason,
} from "@/lib/portfolio-guide/tools/evidence";
import { runMockEvidence } from "@/lib/portfolio-guide/tools/mockEvidence";
import type { EvidenceMetadata } from "@/lib/portfolio-guide/types";
import {
  SEARCH_CONVERSATION_HISTORY_TOOL_DEFINITION,
  type ConversationHistorySearchResult,
} from "@/lib/portfolio-guide/tools/conversation-history";
import type { PortfolioGuideTraceEvent } from "@/lib/portfolio-guide/trace";

export type PortfolioGuideServiceConfig = {
  apiKey: string;
  model?: string;
  baseURL?: string;
  providerLabel?: string;
  systemPrompt?: string;
  reasoningEffort?: "low" | "medium" | "high";
  client?: OpenAI;
  signal?: AbortSignal;
  /** When provided, enables the searchCareerEvidence tool (server-side call to ResumeCustomizer). */
  evidenceConfig?: EvidenceConfig;
  /**
   * When true, the evidence tool is served by the in-process local mock instead
   * of a real ResumeCustomizer call. Non-production only; lets the whole
   * evidence path be exercised on localhost. Takes precedence over evidenceConfig.
   */
  evidenceMock?: boolean;
  conversationHistorySearch?: (
    query: string,
    maxResults: number,
  ) => Promise<ConversationHistorySearchResult["messages"]>;
};

export type PortfolioGuideProviderInfo = {
  label: string;
  model: string;
  baseURL?: string;
};

export type PortfolioGuideGenerationResult = {
  promptInput: string;
  rawText: string;
  relatedPages: RelatedPage[];
  response: CopilotResponse;
  normalizationStatus: "normalized-json" | "raw-fallback";
  provider: PortfolioGuideProviderInfo;
  responseIds?: string[];
  usage?: Record<string, unknown>;
  traceEvents?: PortfolioGuideTraceEvent[];
};

const RESUME_GENERATOR_PATH = "/resume/generate";
const RESUME_GENERATOR_FOLLOW_UPS = [
  "Generate a resume for my role",
  "Compare Daniel to this job description",
  "Show the strongest proof points",
  "Contact Daniel",
] as const;

function normalizeText(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractMentionedTerm(question: string): string | undefined {
  const match = question.match(
    /\bmention(?:ed|s)?\b(?:\s+the term)?\s+["“]?([a-z0-9-]+)["”]?/i,
  );

  return match?.[1]?.trim();
}

function answerDeniesMention(answer: string, term: string): boolean {
  const normalized = normalizeText(answer);
  const escapedTerm = escapeRegex(normalizeText(term));

  return (
    new RegExp(
      `\\b(?:no|does not|doesn't|do not|don't|not on this page|i don't see)\\b[\\s\\S]{0,80}\\b${escapedTerm}\\b`,
      "i",
    ).test(normalized) ||
    new RegExp(
      `\\b${escapedTerm}\\b[\\s\\S]{0,40}\\b(?:is not|isn't)\\b`,
      "i",
    ).test(normalized)
  );
}

function isOwnershipQuestion(question: string): boolean {
  return /\b(what did .* own|ownership|who owned)\b/i.test(question);
}

function isRankingQuestion(question: string): boolean {
  return /\b(reused most|most reused|which .* most|rank(?:ing)?|most use)\b/i.test(
    question,
  );
}

function isImpactQuestion(question: string): boolean {
  return /\b(impact|results|outcome|outcomes)\b/i.test(question);
}

function isSeniorityQuestion(question: string): boolean {
  return /\b(how senior|seniority|level of work)\b/i.test(question);
}

function isImpliedNotProvenQuestion(question: string): boolean {
  return /\b(implied|not proven|proven|inference)\b/i.test(question);
}

function isNextReadQuestion(question: string): boolean {
  return /\b(what should i (?:read|view) next|read next|view next|next read)\b/i.test(
    question,
  );
}

function isConnectionsQuestion(question: string): boolean {
  return /\b(connect|rest of the portfolio|other work|broader portfolio)\b/i.test(
    question,
  );
}

function isEvidenceSummaryQuestion(question: string): boolean {
  return /\b(what evidence|strongest (?:signals|evidence|proof)|evidence (?:is|shown)|proof (?:is|shown)|signals on this page)\b/i.test(
    question,
  );
}

function isReferentialFollowUpQuestion(question: string): boolean {
  return /\b(what do you mean|what did you mean|explain that|elaborate|say more|why is that|how so|that point|your (?:last|previous) answer|you (?:said|mentioned)|what about that)\b/i.test(
    question,
  );
}

function isDailyActiveUsersQuestion(question: string): boolean {
  return /\b(daily active users?|dau)\b/i.test(question);
}

function isDirectResumeRequest(question: string): boolean {
  return (
    /\b(?:resume|cv)\b/i.test(question) &&
    /\b(?:role|job|jd|job description|specific|tailor|tailored|custom|generate|get|download|look at|send|pdf)\b/i.test(
      question,
    )
  );
}

function isRoleFitOrJobDescriptionQuestion(question: string): boolean {
  return (
    isDirectResumeRequest(question) ||
    /\b(?:is daniel (?:a )?fit|daniel fit|fit for (?:this|the) (?:role|job)|can daniel do|can he do|does daniel have .*experience|ai product experience|job description|jd\b|compare daniel to|compare .* (?:jd|job description|role|job)|what resume should i look at|which resume should i look at)\b/i.test(
      question,
    )
  );
}

function isEvidenceOrOwnershipOnlyQuestion(question: string): boolean {
  return (
    !isRoleFitOrJobDescriptionQuestion(question) &&
    (isOwnershipQuestion(question) ||
      isSeniorityQuestion(question) ||
      isImpliedNotProvenQuestion(question) ||
      /\b(?:strongest signals|evidence|proof|signals on this page|what did .* responsible|responsib)\b/i.test(
        question,
      ))
  );
}

function hasExplicitLimit(answer: string): boolean {
  return /\b(does not|doesn't|did not|didn't)\b.*\b(specify|say|rank|define|provide|mention|quantify)\b|\bno\b.*\b(figure|ranking|counts?)\b|\bnot explicit\b/i.test(
    answer,
  );
}

function stripSpeculativeTail(answer: string): string {
  const sentences = answer
    .match(/[^.!?]+[.!?]?/g)
    ?.map((sentence) => sentence.trim()) ?? [answer.trim()];
  const filtered = sentences.filter(
    (sentence) =>
      !/(^inference:|\blikely\b|\bprobably\b|\bmight\b|\bmost broadly\b|\bappeared frequently\b|\bsaw the most use\b)/i.test(
        sentence,
      ),
  );

  return filtered.join(" ").trim() || answer.trim();
}

function buildSafeRankingAnswer(request: CopilotRequest): string {
  const namedPatterns = (request.pageContext.tools ?? [])
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 4);
  if (namedPatterns.length === 0) {
    return "The page does not provide reuse counts, frequencies, or a supported ranking, so it cannot establish which pattern was reused most.";
  }
  const listed =
    namedPatterns.length === 1
      ? namedPatterns[0]
      : `${namedPatterns.slice(0, -1).join(", ")}, and ${namedPatterns.at(-1)}`;
  return `The page does not provide reuse counts, frequencies, or a ranking, so it cannot establish which pattern was reused most. It names ${listed} as supported patterns.`;
}

function hasExplicitOwnershipLimit(answer: string): boolean {
  return /\b(full|formal) ownership matrix\b|\bexact ownership split\b|\bteam-by-team breakdown\b|\bdoes not define\b.*\bownership\b|\bdoes not provide\b.*\bownership\b/i.test(
    answer,
  );
}

function hasExplicitUnknownLimit(answer: string): boolean {
  return /\bnot proven\b|\bnot explicit\b|\bdoes not define\b|\bdoesn't define\b|\bdoes not specify\b|\bdoesn't specify\b|\bdoes not show\b|\bdoesn't show\b/i.test(
    answer,
  );
}

function softenOwnershipClaims(answer: string, subjectName: string): string {
  return answer
    .replace(
      new RegExp(`\\b${escapeRegex(subjectName)}\\s+owned\\b`, "gi"),
      `The page shows ${subjectName} leading`,
    )
    .replace(
      new RegExp(
        `\\b${escapeRegex(subjectName)}\\s+designed and implemented\\b`,
        "gi",
      ),
      `The page describes ${subjectName} driving`,
    )
    .replace(
      new RegExp(
        `\\b${escapeRegex(subjectName)}\\s+built\\b([\\s\\S]{0,80})\\bend[- ]to[- ]end\\b`,
        "gi",
      ),
      `${subjectName} helped build$1`,
    );
}

function ensureTrailingPeriod(text: string): string {
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function includesResumeGeneratorPath(answer: string): boolean {
  return normalizeText(answer).includes(RESUME_GENERATOR_PATH);
}

function removeResumeGenerationCompletionClaims(answer: string): string {
  return answer
    .replace(
      /\b(?:i|i've|we|we've|the bot|portfolio guide)\s+(?:generated|created|built|made|rendered|emailed|downloaded)\b[^.!?]*(?:resume|pdf)[.!?]?/gi,
      `The generator flow at ${RESUME_GENERATOR_PATH} can create the role-specific PDF resume after a job description is submitted.`,
    )
    .replace(
      /\b(?:your|the)\s+(?:role-specific\s+)?(?:resume|pdf)\s+(?:is|has been)\s+(?:ready|generated|created|rendered|emailed|downloaded)[.!?]?/gi,
      `A role-specific PDF resume is only ready after the generator flow runs.`,
    );
}

function removeUnsupportedPortfolioGeneratorSourceClaims(
  answer: string,
): string {
  const correction =
    "The current page does not prove that Portfolio pages directly feed the generated resume.";

  return answer
    .replace(
      /\b(?:the\s+)?(?:tool|generator)(?:\s+flow)?\s+(?:pulls?|uses?|reads?|retrieves?)\s+(?:its\s+)?evidence\s+from\s+(?:the\s+)?current\s+(?:portfolio\s+)?page(?:\s+and\s+(?:other\s+)?portfolio\s+pages)?[^.!?]*[.!?]?/gi,
      correction,
    )
    .replace(
      /\bportfolio\s+(?:pages|content)\s+(?:directly\s+)?(?:power|powers|feed|feeds|supply|supplies)\s+(?:the\s+)?(?:resume\s+)?generator[^.!?]*[.!?]?/gi,
      correction,
    );
}

function uniqueFollowUps(
  items: Array<string | undefined>,
  limit = 4,
): string[] {
  const seen = new Set<string>();
  const results: string[] = [];

  for (const item of items) {
    const value = item?.trim();
    if (!value) {
      continue;
    }

    const key = normalizeText(value);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    results.push(value);
    if (results.length >= limit) {
      break;
    }
  }

  return results;
}

function isResumeGeneratorFollowUp(label: string): boolean {
  const normalized = normalizeText(label);

  return (
    normalized.includes("generate a resume") ||
    normalized.includes("role-specific resume") ||
    normalized.includes("resume for my role") ||
    normalized.includes("compare daniel to this job description") ||
    normalized.includes(RESUME_GENERATOR_PATH)
  );
}

function addResumeGeneratorFollowUps(existing: string[] | undefined): string[] {
  return uniqueFollowUps([...RESUME_GENERATOR_FOLLOW_UPS, ...(existing ?? [])]);
}

function removeResumeGeneratorFollowUps(
  existing: string[] | undefined,
): string[] | undefined {
  const filtered = existing?.filter((item) => !isResumeGeneratorFollowUp(item));

  return filtered && filtered.length > 0 ? filtered : undefined;
}

function normalizeReasonForAnswer(reason: string): string {
  return reason.trim().replace(/\s+/g, " ").replace(/[.]$/, "");
}

function buildSafeRelatedPages(
  responsePages: RelatedPage[] | undefined,
  fallbackRelatedPages: RelatedPage[],
): RelatedPage[] {
  const fallbackBySlug = new Map(
    fallbackRelatedPages.map((page) => [page.slug, page]),
  );
  const selectedPages =
    responsePages && responsePages.length > 0
      ? responsePages
      : fallbackRelatedPages;

  return selectedPages
    .map((page) => {
      const fallbackPage = fallbackBySlug.get(page.slug);

      return {
        ...page,
        ...(fallbackPage?.reason ? { reason: fallbackPage.reason } : {}),
      };
    })
    .slice(0, 2);
}

function buildNextReadAnswer(input: {
  currentPageTitle: string;
  relatedPages: RelatedPage[];
}): string | undefined {
  const [firstPage, secondPage] = input.relatedPages;

  if (!firstPage) {
    return undefined;
  }

  const firstReason = normalizeReasonForAnswer(
    firstPage.reason ?? "it is a useful follow-on to this page",
  );

  if (!secondPage) {
    return ensureTrailingPeriod(
      `As a next read, start with ${firstPage.title}. ${ensureTrailingPeriod(firstReason)}`,
    );
  }

  const secondReason = normalizeReasonForAnswer(
    secondPage.reason ?? "it is another useful complement",
  );

  return [
    ensureTrailingPeriod(
      `As a next read, start with ${firstPage.title}. ${ensureTrailingPeriod(firstReason)}`,
    ),
    ensureTrailingPeriod(
      `If you want a second example after ${input.currentPageTitle}, ${secondPage.title} is another good complement. ${ensureTrailingPeriod(secondReason)}`,
    ),
  ].join(" ");
}

function pickDistinctDetails(
  items: Array<string | undefined>,
  limit: number,
): string[] {
  const seen = new Set<string>();
  const results: string[] = [];

  for (const item of items) {
    const value = item?.trim();
    if (!value || seen.has(value)) {
      continue;
    }

    seen.add(value);
    results.push(value);
    if (results.length >= limit) {
      break;
    }
  }

  return results;
}

function joinDetailsAsOneSentence(details: string[]): string {
  return details
    .map((detail) => detail.trim().replace(/[.!?]+$/, ""))
    .filter(Boolean)
    .join("; ");
}

function buildOwnershipAnswer(request: CopilotRequest): string | undefined {
  const direct = pickDistinctDetails(
    request.pageContext.claimBoundaries?.directOwnership ?? [],
    2,
  );
  const influence = request.pageContext.claimBoundaries?.influence?.[0];
  const implementation = request.pageContext.claimBoundaries?.implementation?.[0];
  const unknown = request.pageContext.claimBoundaries?.explicitUnknowns?.[0];
  if (direct.length === 0 && !influence && !implementation && !unknown) {
    return undefined;
  }
  const parts: string[] = [];
  if (direct.length > 0) {
    parts.push(
      `The page shows Daniel leading: ${joinDetailsAsOneSentence(direct)}`,
    );
  }
  if (influence) {
    parts.push(`Influence: ${influence}`);
  }
  const unknownDetail =
    unknown && !/ownership matrix|ownership split|team-by-team/i.test(unknown)
      ? unknown
      : undefined;
  const unprovenDetails = joinDetailsAsOneSentence(
    [implementation, unknownDetail].filter(Boolean) as string[],
  );
  parts.push(
    `Not explicit: ${unprovenDetails ? `${unprovenDetails}; ` : ""}the page does not define a full ownership matrix or exact team-by-team split`,
  );
  return parts.map(ensureTrailingPeriod).join(" ");
}

function buildEvidenceSummaryAnswer(request: CopilotRequest): string | undefined {
  const highlights = request.pageContext.evidenceHighlights?.slice(0, 3) ?? [];
  if (highlights.length === 0) {
    return undefined;
  }

  return highlights
    .map((highlight) =>
      ensureTrailingPeriod(`${highlight.label}: ${highlight.detail}`),
    )
    .join(" ");
}

function buildReferentialFollowUpAnswer(
  request: CopilotRequest,
): string | undefined {
  if (!request.conversation?.some((message) => message.role === "assistant")) {
    return undefined;
  }

  const highlights = request.pageContext.evidenceHighlights?.slice(0, 3) ?? [];
  if (highlights.length === 0) {
    return undefined;
  }

  return [
    ensureTrailingPeriod(
      `By that, I mean the current page's evidence: ${joinDetailsAsOneSentence(
        highlights.map((highlight) => highlight.detail),
      )}`,
    ),
    "Those page facts—not the earlier assistant wording—are the basis for the explanation.",
  ].join(" ");
}

function pageHasDailyActiveUsersMetric(request: CopilotRequest): boolean {
  return (request.pageContext.metrics ?? []).some((metric) =>
    /\b(daily active users?|dau)\b/i.test(metric),
  );
}

function buildRoleFitAnswer(request: CopilotRequest): string | undefined {
  const evidence =
    request.pageContext.evidenceHighlights
      ?.slice(0, 3)
      .map((highlight) => highlight.detail) ?? [];
  const leadership = request.pageContext.leadershipSignals?.slice(0, 2) ?? [];
  const boundary =
    request.pageContext.claimBoundaries?.implementation?.[0] ??
    request.pageContext.claimBoundaries?.explicitUnknowns?.[0];
  if (evidence.length === 0 && leadership.length === 0) {
    return undefined;
  }

  const role =
    request.sessionContext?.visitorIntent?.normalizedTitle?.trim() || "this role";
  const parts: string[] = [];
  if (evidence.length > 0) {
    parts.push(
      `For ${role}, this page supports fit through ${joinDetailsAsOneSentence(evidence)}`,
    );
  }
  if (leadership.length > 0) {
    parts.push(
      `Leadership signals include ${joinDetailsAsOneSentence(leadership)}`,
    );
  }
  if (boundary) {
    parts.push(`Boundary: ${boundary}`);
  }
  return parts.map(ensureTrailingPeriod).join(" ");
}

function summarizeRecommendation(rec: {
  name: string;
  title: string;
  short: string;
}): string {
  const firstTitleSegment = rec.title.split(/[,|·]/)[0].trim();
  const titleClause = firstTitleSegment ? ` (${firstTitleSegment})` : "";
  return `${rec.name}${titleClause}: "${rec.short.replace(/^["“]|["”]$/g, "")}"`;
}

function buildSeniorityAnswer(request: CopilotRequest): string | undefined {
  const signals = pickDistinctDetails(
    [
      request.pageContext.claimBoundaries?.directOwnership?.[0],
      request.pageContext.claimBoundaries?.directOwnership?.[1],
      request.pageContext.evidenceHighlights?.[2]?.detail,
      request.pageContext.evidenceHighlights?.[1]?.detail,
    ],
    2,
  );
  const unknown = request.pageContext.claimBoundaries?.explicitUnknowns?.[0];
  const recommendations = request.portfolioContext.recommendations;
  const currentRec = recommendations?.currentPage[0];
  const projectRec = recommendations?.projectLinked[0];

  if (signals.length === 0 && !unknown && !currentRec && !projectRec) {
    return undefined;
  }

  const parts: string[] = [];

  if (signals.length > 0) {
    parts.push(`Signals on the page: ${joinDetailsAsOneSentence(signals)}`);
  }

  if (currentRec) {
    parts.push(
      `Direct evidence on this page — ${summarizeRecommendation(currentRec)}`,
    );
  }

  if (projectRec) {
    parts.push(
      `Direct recommendation tied to this project — ${summarizeRecommendation(projectRec)}`,
    );
  }

  if (unknown) {
    parts.push(`Not proven here: ${unknown}`);
  }

  return parts.map(ensureTrailingPeriod).join(" ");
}

function buildImpliedNotProvenAnswer(
  request: CopilotRequest,
): string | undefined {
  const explicitProof = pickDistinctDetails(
    [
      request.pageContext.evidenceHighlights?.[0]?.detail,
      request.pageContext.evidenceHighlights?.[1]?.detail,
    ],
    2,
  );
  const implied =
    request.pageContext.claimBoundaries?.conceptualExploration?.[0];
  const unknown = request.pageContext.claimBoundaries?.explicitUnknowns?.[0];

  if (explicitProof.length === 0 && !implied && !unknown) {
    return undefined;
  }

  const parts: string[] = [];

  if (explicitProof.length > 0) {
    parts.push(`Explicit on the page: ${explicitProof.join(" ")}`);
  }

  if (implied || unknown) {
    const impliedPart = pickDistinctDetails([implied, unknown], 2).join(" ");
    if (impliedPart) {
      parts.push(`Implied, not proven: ${impliedPart}`);
    }
  }

  return parts.map(ensureTrailingPeriod).join(" ");
}

function buildConnectionsAnswer(input: {
  request: CopilotRequest;
  relatedPages: RelatedPage[];
}): string | undefined {
  const [firstPage, secondPage] = input.relatedPages;
  const currentPageLead =
    input.request.pageContext.oneLiner ??
    input.request.pageContext.evidenceHighlights?.[0]?.detail;

  if (!currentPageLead && !firstPage) {
    return undefined;
  }

  const parts: string[] = [];

  if (currentPageLead) {
    parts.push(
      ensureTrailingPeriod(`This page stands on its own as ${currentPageLead}`),
    );
  }

  if (firstPage?.reason) {
    parts.push(ensureTrailingPeriod(firstPage.reason));
  }

  if (secondPage?.reason) {
    parts.push(ensureTrailingPeriod(secondPage.reason));
  }

  return parts.join(" ");
}

function answerIncludesExplicitMetric(
  answer: string,
  pageMetrics: string[] | undefined,
): boolean {
  if (!pageMetrics || pageMetrics.length === 0) {
    return false;
  }

  return pageMetrics.some((metric) => {
    const numericMatches =
      metric.match(
        /\b\d+(?:[.,]\d+)?%?|\$\d+(?:\.\d+)?\s*[mb]?|\b(?:eight|nine|twelve|sixteen)\b/gi,
      ) ?? [];

    return numericMatches.some((token) =>
      normalizeText(answer).includes(normalizeText(token)),
    );
  });
}

export function applyPortfolioGuideResponseGuardrails(input: {
  request: CopilotRequest;
  response: CopilotResponse;
  fallbackRelatedPages: RelatedPage[];
}): CopilotResponse {
  const { request, response, fallbackRelatedPages } = input;
  const fallbackBySlug = new Map(
    fallbackRelatedPages.map((page) => [page.slug, page]),
  );
  const mentionTerm = extractMentionedTerm(request.message);
  const normalizedAnswer = response.answer.trim();
  const portfolioSubject = request.portfolioContext.portfolioSubject;

  let answer = normalizedAnswer;
  let suggestedFollowUps = response.suggestedFollowUps;
  let relatedPages = response.relatedPages;
  const shouldSuggestResumeGenerator = isRoleFitOrJobDescriptionQuestion(
    request.message,
  );
  const directResumeRequest = isDirectResumeRequest(request.message);

  if (mentionTerm && answerDeniesMention(answer, mentionTerm)) {
    const termPattern = new RegExp(`\\b${escapeRegex(mentionTerm)}\\b`, "i");

    suggestedFollowUps = suggestedFollowUps?.filter(
      (item) => !termPattern.test(normalizeText(item)),
    );
    relatedPages = relatedPages?.map((page) => {
      if (!page.reason || !termPattern.test(normalizeText(page.reason))) {
        return page;
      }

      const fallbackPage = fallbackBySlug.get(page.slug);

      return {
        ...page,
        reason: fallbackPage?.reason ?? page.reason,
      };
    });
  }

  if (
    (isOwnershipQuestion(request.message) ||
      isRankingQuestion(request.message)) &&
    hasExplicitLimit(answer)
  ) {
    answer = stripSpeculativeTail(answer);
  }

  if (isRankingQuestion(request.message)) {
    answer = buildSafeRankingAnswer(request);
  }

  if (isOwnershipQuestion(request.message)) {
    const safeOwnershipAnswer = buildOwnershipAnswer(request);
    answer = safeOwnershipAnswer ?? answer;

    if (!safeOwnershipAnswer && portfolioSubject) {
      answer = softenOwnershipClaims(answer, portfolioSubject.shortName);
      answer = softenOwnershipClaims(answer, portfolioSubject.name);
    }

    if (!hasExplicitOwnershipLimit(answer)) {
      answer = `${ensureTrailingPeriod(answer)} The page does not define a full ownership matrix or exact team-by-team split.`;
    }
  }

  if (isSeniorityQuestion(request.message)) {
    const safeSeniorityAnswer = buildSeniorityAnswer(request);
    if (safeSeniorityAnswer) {
      answer = safeSeniorityAnswer;
    }
  }

  if (isImpliedNotProvenQuestion(request.message)) {
    const safeImpliedAnswer = buildImpliedNotProvenAnswer(request);
    if (safeImpliedAnswer) {
      answer = safeImpliedAnswer;
    }
  }

  if (isEvidenceSummaryQuestion(request.message)) {
    const safeEvidenceAnswer = buildEvidenceSummaryAnswer(request);
    if (safeEvidenceAnswer) {
      answer = safeEvidenceAnswer;
    }
  }

  if (isReferentialFollowUpQuestion(request.message)) {
    const safeReferentialAnswer = buildReferentialFollowUpAnswer(request);
    if (safeReferentialAnswer) {
      answer = safeReferentialAnswer;
    }
  }

  if (
    isDailyActiveUsersQuestion(request.message) &&
    !pageHasDailyActiveUsersMetric(request)
  ) {
    answer =
      "This page does not provide a daily active users (DAU) figure. Any DAU metric from another portfolio page is broader context, not evidence for this page.";
  }

  if (shouldSuggestResumeGenerator && !directResumeRequest) {
    const safeRoleFitAnswer = buildRoleFitAnswer(request);
    if (safeRoleFitAnswer) {
      answer = safeRoleFitAnswer;
    }
  }

  if (
    isImpactQuestion(request.message) &&
    request.pageContext.slug === "ai-platform-mcp" &&
    !answerIncludesExplicitMetric(answer, request.pageContext.metrics)
  ) {
    answer = `${ensureTrailingPeriod(answer)} The page explicitly cites a hackathon-winning prototype and an 87% would-use-again signal as the customer validation behind this work.`;
  }

  if (isNextReadQuestion(request.message)) {
    relatedPages = buildSafeRelatedPages(relatedPages, fallbackRelatedPages);
    suggestedFollowUps = suggestedFollowUps?.filter(
      (item) => !/\b(read|view) next\b/i.test(item),
    );

    const safeNextReadAnswer = buildNextReadAnswer({
      currentPageTitle: request.pageContext.title,
      relatedPages,
    });

    if (safeNextReadAnswer) {
      answer = safeNextReadAnswer;
    }
  }

  if (isConnectionsQuestion(request.message)) {
    relatedPages = buildSafeRelatedPages(relatedPages, fallbackRelatedPages);
    const safeConnectionsAnswer = buildConnectionsAnswer({
      request,
      relatedPages,
    });

    if (safeConnectionsAnswer) {
      answer = safeConnectionsAnswer;
    }
  }

  answer = removeResumeGenerationCompletionClaims(answer);
  answer = removeUnsupportedPortfolioGeneratorSourceClaims(answer);

  if (directResumeRequest) {
    if (!includesResumeGeneratorPath(answer)) {
      answer = `${ensureTrailingPeriod(answer)} For a role-specific PDF resume, use ${RESUME_GENERATOR_PATH}; paste the job description in the generator flow, not in a URL.`;
    } else if (!/\bpaste\b/i.test(answer)) {
      answer = `${ensureTrailingPeriod(answer)} Paste the job description in the generator flow, not in a URL.`;
    }
  }

  if (shouldSuggestResumeGenerator) {
    suggestedFollowUps = addResumeGeneratorFollowUps(suggestedFollowUps);
  } else if (isEvidenceOrOwnershipOnlyQuestion(request.message)) {
    suggestedFollowUps = removeResumeGeneratorFollowUps(suggestedFollowUps);
  }

  return {
    ...response,
    answer,
    ...(suggestedFollowUps ? { suggestedFollowUps } : {}),
    ...(relatedPages ? { relatedPages } : {}),
  };
}

// ── Tool-calling helpers ──────────────────────────────────────────────────────

type FunctionCallItem = {
  type: "function_call";
  call_id: string;
  name: string;
  arguments: string;
};

function getResponseOutput(response: unknown): unknown[] {
  const typed = response as { output?: unknown[] };
  return Array.isArray(typed.output) ? typed.output : [];
}

function extractFunctionCalls(response: unknown): FunctionCallItem[] {
  return getResponseOutput(response).filter(
    (item): item is FunctionCallItem =>
      Boolean(item) &&
      typeof item === "object" &&
      (item as Record<string, unknown>).type === "function_call",
  );
}

function buildEvidenceSummaries(
  evidenceItems: EvidenceItem[],
): EvidenceSummary[] {
  return evidenceItems.map((e) => ({
    project: e.project,
    claim: e.claim,
    capabilityTags: e.capabilityTags,
    hasMetrics: e.metrics.length > 0,
  }));
}

function getResponseDiagnostics(response: unknown): {
  id?: string;
  usage?: Record<string, unknown>;
} {
  if (!response || typeof response !== "object") {
    return {};
  }
  const typed = response as { id?: unknown; usage?: unknown };
  return {
    ...(typeof typed.id === "string" ? { id: typed.id } : {}),
    ...(typed.usage && typeof typed.usage === "object"
      ? { usage: typed.usage as Record<string, unknown> }
      : {}),
  };
}

export function extractAnswerFromRawFallback(rawText: string): string {
  const withoutAnswerMarker = rawText
    .trim()
    .replace(
      /^\s*(?:#{1,3}\s*)?(?:\*\*)?answer\s*:?\s*(?:\*\*)?\s*/i,
      "",
    );
  const endMarker = withoutAnswerMarker.search(
    /\s+(?:#{1,3}\s*)?(?:\*\*)?(?:suggested follow-ups?|related pages?|inferred interest tags?|inferredInterestTags)(?:\*\*)?(?:\s*:\s*|\s*\n)/i,
  );
  return (
    endMarker >= 0
      ? withoutAnswerMarker.slice(0, endMarker)
      : withoutAnswerMarker
  ).trim();
}

export async function generatePortfolioGuideResponse(
  request: CopilotRequest,
  config: PortfolioGuideServiceConfig,
): Promise<PortfolioGuideGenerationResult> {
  const {
    apiKey,
    model = "gpt-5",
    baseURL,
    providerLabel = "openai",
    systemPrompt = PORTFOLIO_GUIDE_SYSTEM_PROMPT,
    reasoningEffort = "low",
    client = new OpenAI({ apiKey, baseURL }),
    signal,
    evidenceConfig,
    evidenceMock = false,
    conversationHistorySearch,
  } = config;

  // The evidence tool is available when either a real ResumeCustomizer
  // connection is configured or the local mock is enabled. The mock takes
  // precedence so localhost testing never hits a (possibly down) real endpoint.
  const evidenceEnabled = Boolean(evidenceConfig) || evidenceMock;

  const relatedPages = getRelatedPages(
    request.pageContext,
    request.portfolioContext,
    request.sessionContext,
  );
  const recommendations =
    request.portfolioContext.recommendations ??
    selectRecommendationsForPage(request.pageContext);
  const enrichedRequest: CopilotRequest = {
    ...request,
    portfolioContext: {
      ...request.portfolioContext,
      recommendations,
    },
  };
  const promptInput = buildPortfolioGuideInput(enrichedRequest, relatedPages);
  const traceEvents: PortfolioGuideTraceEvent[] = [];
  const responseIds: string[] = [];
  const responseUsage: Array<Record<string, unknown>> = [];
  let traceSequence = 0;

  const addTrace = (
    event: Omit<PortfolioGuideTraceEvent, "sequence">,
  ): void => {
    traceEvents.push({ sequence: traceSequence, ...event });
    traceSequence += 1;
  };

  // Base input shared by both LLM calls
  const baseInput = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: promptInput },
  ];

  // First call: include only the allowlisted tools available for this request.
  type ResponsesCreateParams = Parameters<typeof client.responses.create>[0];
  const availableTools: NonNullable<ResponsesCreateParams["tools"]> = [];
  if (evidenceEnabled) {
    availableTools.push(SEARCH_CAREER_EVIDENCE_TOOL_DEFINITION);
  }
  if (conversationHistorySearch) {
    availableTools.push(SEARCH_CONVERSATION_HISTORY_TOOL_DEFINITION);
  }

  const providerStorageParams =
    providerLabel === "openai" && !baseURL
      ? {
          store: true as const,
          metadata: {
            portfolio_guide_conversation:
              request.interactionMeta?.conversationId ?? "stateless",
            portfolio_guide_turn:
              request.interactionMeta?.clientTurnId ?? "unknown",
          },
        }
      : {};

  const runModelCall = async (
    stage: string,
    params: ResponsesCreateParams,
  ): Promise<unknown> => {
    const startedAt = Date.now();
    addTrace({
      eventType: "model",
      eventName: `${stage}.request`,
      payload: {
        model,
        stage,
        toolNames:
          params.tools?.map((tool) =>
            "name" in tool ? tool.name : tool.type,
          ) ?? [],
        input: params.input as unknown,
      },
    });
    try {
      const response = await client.responses.create(
        params,
        signal ? { signal } : undefined,
      );
      const diagnostics = getResponseDiagnostics(response);
      if (diagnostics.id) {
        responseIds.push(diagnostics.id);
      }
      if (diagnostics.usage) {
        responseUsage.push({ stage, ...diagnostics.usage });
      }
      addTrace({
        eventType: "model",
        eventName: `${stage}.response`,
        payload: {
          stage,
          responseId: diagnostics.id,
          usage: diagnostics.usage,
          output: getResponseOutput(response),
        },
        durationMs: Date.now() - startedAt,
      });
      return response;
    } catch (error) {
      addTrace({
        eventType: "error",
        eventName: `${stage}.error`,
        payload: {
          stage,
          message: error instanceof Error ? error.message : "Unknown model error",
        },
        durationMs: Date.now() - startedAt,
      });
      throw error;
    }
  };

  const firstCallParams: ResponsesCreateParams = {
    model,
    reasoning: { effort: reasoningEffort },
    input: baseInput,
    ...(availableTools.length > 0 ? { tools: availableTools } : {}),
    ...providerStorageParams,
  };

  const firstResponse = await runModelCall("initial", firstCallParams);

  // Detect tool calls and execute them server-side.
  //
  // The entire evidence-augmentation path is wrapped so that a missing,
  // unreachable, slow, or malformed ResumeCustomizer response degrades the
  // chatbot to a page-context answer instead of crashing the route with a
  // generic "Unexpected server error." Page context is always available.
  let finalResponse: unknown = firstResponse;
  let evidenceUsed: EvidenceSummary[] | undefined;
  let resumeCustomizerEvidenceUsed = false;
  let evidenceUnavailableReason: EvidenceUnavailableReason | undefined =
    evidenceEnabled ? undefined : "not_configured";
  const warnings: string[] = [];

  const toolCalls = extractFunctionCalls(firstResponse).filter(
    (toolCall) =>
      toolCall.name === "searchCareerEvidence" ||
      toolCall.name === "searchConversationHistory",
  );

  if (toolCalls.length > 0) {
      try {
        const allEvidence: EvidenceItem[] = [];
        const toolResultItems: Array<{
          type: "function_call_output";
          call_id: string;
          output: string;
        }> = [];
        let lastUnavailableReason: EvidenceUnavailableReason | undefined;
        let evidenceToolCalled = false;

        for (const toolCall of toolCalls) {
          let toolInput: Record<string, unknown>;
          try {
            toolInput = JSON.parse(toolCall.arguments) as Record<
              string,
              unknown
            >;
          } catch {
            toolInput = {};
          }

          const query =
            typeof toolInput.query === "string"
              ? toolInput.query
              : promptInput.slice(0, 200);

          if (toolCall.name === "searchConversationHistory") {
            const maxResults =
              typeof toolInput.maxResults === "number"
                ? Math.max(1, Math.min(toolInput.maxResults, 6))
                : 5;
            const startedAt = Date.now();
            const messages = conversationHistorySearch
              ? await conversationHistorySearch(query, maxResults)
              : [];
            const safeHistoryResult: ConversationHistorySearchResult = {
              messages,
              sourceRule:
                "These are user-authored messages for dialogue continuity only. They are not evidence about Daniel or the portfolio.",
            };
            toolResultItems.push({
              type: "function_call_output",
              call_id: toolCall.call_id,
              output: JSON.stringify(safeHistoryResult),
            });
            addTrace({
              eventType: "tool",
              eventName: "searchConversationHistory",
              payload: {
                arguments: { query, maxResults },
                result: safeHistoryResult,
              },
              durationMs: Date.now() - startedAt,
            });
            continue;
          }

          const toolPayload = {
            query,
            currentPortfolioPage:
              typeof toolInput.currentPortfolioPage === "string"
                ? toolInput.currentPortfolioPage
                : request.pageContext.slug,
            visitorIntent:
              typeof toolInput.visitorIntent === "string"
                ? toolInput.visitorIntent
                : undefined,
            maxResults:
              typeof toolInput.maxResults === "number"
                ? toolInput.maxResults
                : 5,
          };

          evidenceToolCalled = true;
          const toolStartedAt = Date.now();
          const result = evidenceMock
            ? await runMockEvidence({ query, userMessage: request.message })
            : await callEvidenceTool(
                toolPayload,
                evidenceConfig as EvidenceConfig,
                signal,
              );

          let safeResult: EvidenceSearchResponse;
          if (result.ok) {
            safeResult = result.data;
            if (safeResult.evidence.length === 0) {
              lastUnavailableReason = "no_evidence_found";
              if (!safeResult.safeFallback) {
                safeResult = {
                  ...safeResult,
                  safeFallback:
                    EVIDENCE_FALLBACK_MESSAGES.no_evidence_found,
                };
              }
            }
          } else {
            lastUnavailableReason = result.reason;
            warnings.push(
              `evidence_unavailable:${result.reason}${
                result.status ? `:${result.status}` : ""
              }`,
            );
            safeResult = buildUnavailableEvidenceResult(query, result.reason);
          }

          if (safeResult.evidence.length > 0) {
            allEvidence.push(...safeResult.evidence);
          }

          toolResultItems.push({
            type: "function_call_output",
            call_id: toolCall.call_id,
            output: JSON.stringify(safeResult),
          });
          addTrace({
            eventType: "tool",
            eventName: "searchCareerEvidence",
            payload: { arguments: toolPayload, result: safeResult },
            durationMs: Date.now() - toolStartedAt,
          });
        }

        if (allEvidence.length > 0) {
          evidenceUsed = buildEvidenceSummaries(allEvidence);
          resumeCustomizerEvidenceUsed = true;
        } else if (evidenceToolCalled) {
          evidenceUnavailableReason =
            lastUnavailableReason ?? "no_evidence_found";
        }

        // Second call: replay the model's full first-turn output (reasoning
        // items + function_call items, in order) followed by our tool results,
        // then ask for the synthesized answer with no tools.
        //
        // Echoing the whole output (not just the function_call items) is
        // required for reasoning models: the Responses API rejects a
        // function_call that is replayed without its sibling reasoning item.
        const secondCallInput = [
          ...baseInput,
          ...getResponseOutput(firstResponse),
          ...toolResultItems,
        ] as ResponsesCreateParams["input"];

        finalResponse = await runModelCall(
          "synthesis",
          {
            model,
            reasoning: { effort: reasoningEffort },
            input: secondCallInput,
            ...providerStorageParams,
          },
        );
      } catch (error) {
        // The evidence augmentation or the synthesis call failed. Recover with
        // a single page-context-only completion so the visitor still gets a
        // useful, grounded answer rather than a server error.
        console.warn(
          "[portfolio-guide] evidence augmentation failed; falling back to page context",
          error,
        );
        evidenceUsed = undefined;
        resumeCustomizerEvidenceUsed = false;
        evidenceUnavailableReason = "evidence_layer_error";
        warnings.push("evidence_layer_error");

        finalResponse = await runModelCall(
          "page_context_fallback",
          {
            model,
            reasoning: { effort: reasoningEffort },
            input: baseInput,
            ...providerStorageParams,
          },
        );
      }
  }
  // toolCalls.length === 0: the model answered from page context without
  // requesting deeper evidence. Not an error.

  const rawText = extractResponseText(finalResponse);
  if (!rawText) {
    throw new Error("No portfolio guide response was returned.");
  }

  const parsedResponse = normalizeCopilotResponse(rawText, relatedPages);
  const normalizedResponse =
    parsedResponse ??
    ({
      answer: extractAnswerFromRawFallback(rawText),
      relatedPages,
    } satisfies CopilotResponse);
  const guardedResponse = applyPortfolioGuideResponseGuardrails({
    request: enrichedRequest,
    response: normalizedResponse,
    fallbackRelatedPages: relatedPages,
  });
  const normalizationStatus = parsedResponse
    ? "normalized-json"
    : "raw-fallback";

  if (
    guardedResponse.answer !== normalizedResponse.answer ||
    JSON.stringify(guardedResponse.suggestedFollowUps) !==
      JSON.stringify(normalizedResponse.suggestedFollowUps) ||
    JSON.stringify(guardedResponse.relatedPages) !==
      JSON.stringify(normalizedResponse.relatedPages)
  ) {
    addTrace({
      eventType: "guardrail",
      eventName: "response_guardrails_applied",
      payload: {
        before: normalizedResponse,
        after: guardedResponse,
      },
    });
  }

  const evidenceMeta: EvidenceMetadata = {
    pageContextUsed: true,
    resumeCustomizerEvidenceUsed,
    ...(evidenceUnavailableReason
      ? { evidenceUnavailableReason }
      : {}),
    ...(warnings.length > 0 ? { warnings } : {}),
  };

  const finalCopilotResponse: CopilotResponse = {
    ...guardedResponse,
    ...(evidenceUsed ? { evidenceUsed } : {}),
    evidenceMeta,
  };

  return {
    promptInput,
    rawText,
    relatedPages,
    response: finalCopilotResponse,
    normalizationStatus,
    provider: {
      label: providerLabel,
      model,
      ...(baseURL ? { baseURL } : {}),
    },
    responseIds,
    usage: { responses: responseUsage },
    traceEvents,
  };
}
