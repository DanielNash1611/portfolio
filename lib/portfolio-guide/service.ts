import OpenAI from "openai";
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
  RelatedPage,
} from "@/lib/portfolio-guide/types";

export type PortfolioGuideServiceConfig = {
  apiKey: string;
  model?: string;
  baseURL?: string;
  providerLabel?: string;
  systemPrompt?: string;
  reasoningEffort?: "low" | "medium" | "high";
  client?: OpenAI;
  signal?: AbortSignal;
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
};

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
    new RegExp(`\\b${escapedTerm}\\b[\\s\\S]{0,40}\\b(?:is not|isn't)\\b`, "i").test(
      normalized,
    )
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

function hasExplicitLimit(answer: string): boolean {
  return /\b(does not|doesn't|did not|didn't)\b.*\b(specify|say|rank|define|provide|mention|quantify)\b|\bno\b.*\b(figure|ranking|counts?)\b|\bnot explicit\b/i.test(
    answer,
  );
}

function stripSpeculativeTail(answer: string): string {
  const sentences = answer.match(/[^.!?]+[.!?]?/g)?.map((sentence) => sentence.trim()) ?? [
    answer.trim(),
  ];
  const filtered = sentences.filter(
    (sentence) =>
      !/(^inference:|\blikely\b|\bprobably\b|\bmight\b|\bmost broadly\b|\bappeared frequently\b|\bsaw the most use\b)/i.test(
        sentence,
      ),
  );

  return filtered.join(" ").trim() || answer.trim();
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
      new RegExp(`\\b${escapeRegex(subjectName)}\\s+designed and implemented\\b`, "gi"),
      `The page describes ${subjectName} driving`,
    )
    .replace(
      new RegExp(`\\b${escapeRegex(subjectName)}\\s+built\\b([\\s\\S]{0,80})\\bend[- ]to[- ]end\\b`, "gi"),
      `${subjectName} helped build$1`,
    );
}

function ensureTrailingPeriod(text: string): string {
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function normalizeReasonForAnswer(reason: string): string {
  return reason
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.]$/, "");
}

function buildSafeRelatedPages(
  responsePages: RelatedPage[] | undefined,
  fallbackRelatedPages: RelatedPage[],
): RelatedPage[] {
  const fallbackBySlug = new Map(
    fallbackRelatedPages.map((page) => [page.slug, page]),
  );
  const selectedPages =
    responsePages && responsePages.length > 0 ? responsePages : fallbackRelatedPages;

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

  if (signals.length === 0 && !unknown) {
    return undefined;
  }

  const parts: string[] = [];

  if (signals.length > 0) {
    parts.push(`Signals on the page: ${signals.join(" ")}`);
  }

  if (unknown) {
    parts.push(`Not proven here: ${unknown}`);
  }

  return parts.map(ensureTrailingPeriod).join(" ");
}

function buildImpliedNotProvenAnswer(request: CopilotRequest): string | undefined {
  const explicitProof = pickDistinctDetails(
    [
      request.pageContext.evidenceHighlights?.[0]?.detail,
      request.pageContext.evidenceHighlights?.[1]?.detail,
    ],
    2,
  );
  const implied = request.pageContext.claimBoundaries?.conceptualExploration?.[0];
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
    parts.push(ensureTrailingPeriod(`This page stands on its own as ${currentPageLead}`));
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
    const numericMatches = metric.match(/\b\d+(?:[.,]\d+)?%?|\$\d+(?:\.\d+)?\s*[mb]?|\b(?:eight|nine|twelve|sixteen)\b/gi) ?? [];

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

  if (
    mentionTerm &&
    answerDeniesMention(answer, mentionTerm)
  ) {
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
    (isOwnershipQuestion(request.message) || isRankingQuestion(request.message)) &&
    hasExplicitLimit(answer)
  ) {
    answer = stripSpeculativeTail(answer);
  }

  if (isOwnershipQuestion(request.message)) {
    if (portfolioSubject) {
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

  return {
    ...response,
    answer,
    ...(suggestedFollowUps ? { suggestedFollowUps } : {}),
    ...(relatedPages ? { relatedPages } : {}),
  };
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
  } = config;

  const relatedPages = getRelatedPages(
    request.pageContext,
    request.portfolioContext,
    request.sessionContext,
  );
  const promptInput = buildPortfolioGuideInput(request, relatedPages);
  const response = await client.responses.create({
    model,
    reasoning: { effort: reasoningEffort },
    input: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: promptInput,
      },
    ],
  }, signal ? { signal } : undefined);

  const rawText = extractResponseText(response);
  if (!rawText) {
    throw new Error("No portfolio guide response was returned.");
  }

  const parsedResponse = normalizeCopilotResponse(rawText, relatedPages);
  const normalizedResponse =
    parsedResponse ??
    ({
      answer: rawText,
      relatedPages,
    } satisfies CopilotResponse);
  const guardedResponse = applyPortfolioGuideResponseGuardrails({
    request,
    response: normalizedResponse,
    fallbackRelatedPages: relatedPages,
  });
  const normalizationStatus = parsedResponse ? "normalized-json" : "raw-fallback";

  return {
    promptInput,
    rawText,
    relatedPages,
    response: guardedResponse,
    normalizationStatus,
    provider: {
      label: providerLabel,
      model,
      ...(baseURL ? { baseURL } : {}),
    },
  };
}
