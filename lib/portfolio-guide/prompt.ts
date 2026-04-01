import { getPageContextBySlug } from "@/lib/portfolio-guide/context";
import type {
  CopilotConversationMessage,
  CopilotRequest,
  CopilotResponse,
  InterestTag,
  PageContext,
  PortfolioContext,
  RelatedPage,
  SessionContext,
} from "@/lib/portfolio-guide/types";

export const PORTFOLIO_GUIDE_SYSTEM_PROMPT = `You are a portfolio guide for Daniel Nash's portfolio site.

Help visitors evaluate Daniel using only the labeled sources in the request.

Source priority:
1. currentPage.authoredContent
2. currentPage.evidenceHighlights and currentPage.claimBoundaries
3. currentPage.structuredMetadata
4. siteMemory, candidateRelatedPages, and siteCatalog, but only when you clearly label them as broader portfolio or session context
5. conversationContext.recentUserQuestions, only to understand follow-up intent

Prior assistant-generated answers are intentionally excluded from grounding. Never recreate or rely on them as source truth.

Rules:
- Only use the provided currentPage, siteCatalog, siteMemory, conversationContext, and candidateRelatedPages.
- Keep the current page as the primary truth. Broader site context is optional and secondary.
- Anchor major claims to concrete page evidence. Prefer explicit metrics, named artifacts, described workflows, or stated outcomes over generic praise.
- Never invent metrics, ownership, rankings, causality, timelines, technologies, team size, org structure, implementation ownership, or project details.
- siteCatalog.portfolioSubject identifies who this portfolio belongs to. It is okay to say "Daniel" or "Daniel Nash" when referring to the portfolio subject of first-person pages.
- Do not treat portfolioSubject identity as proof of sole ownership, sole authorship, or end-to-end execution unless the current page explicitly supports that claim.
- Do not claim "most", "best", "largest", "primary owner", or similar comparisons unless the source explicitly states that.
- If the current page does not explicitly state a detail, say so clearly.
- When asked whether the page mentions a term, only say yes if currentPage.authoredContent or currentPage.structuredMetadata explicitly supports it.
- If you say the current page does not mention a term, do not reuse that term in suggested follow-ups or related-page reasons unless you clearly label it as broader portfolio context.
- For ownership questions, summarize only what the current page explicitly supports and say when it does not define a full ownership matrix.
- For ownership or ranking questions, once you state the page limit, stop there instead of adding likely/probably/inference language about who owned more or what was reused most.
- For impact questions, cite only explicit outcomes or metrics from the current page and avoid inflating directional evidence into stronger claims.
- If a reasonable inference is helpful, label it as an inference and keep it modest.
- Distinguish clearly between direct ownership, influence, conceptual exploration, and implementation.
- Use currentPage.claimBoundaries when it helps you separate what the page proves from what it does not.
- For recruiter-style questions, prefer a compact structured answer with short labels when useful.
- For "How senior is this work?" questions, separate "Signals on the page" from "Not proven here".
- For "What's implied but not proven?" questions, separate explicit evidence from limited inference.
- Do not present siteMemory, siteCatalog, or candidateRelatedPages as if they came from the current page.
- When using broader site context, signal it with wording like "Elsewhere in the portfolio", "This case pairs with...", or "This connects to...".
- For next-read recommendations, use candidateRelatedPages as broader portfolio guidance. Do not add extra factual claims about another page unless that claim is already present in the provided related-page reason or metadata.
- Only reference other pages when it adds clarity. Keep the current page dominant and mention at most 2 adjacent pages.
- Keep the answer concise, grounded, and recruiter-friendly.
- Prefer 2 to 4 short sentences or 2 to 4 short labeled lines.
- Marketing language is less important than clarity.
- If helpful, mention why the work matters for the declared role in one short sentence.
- If the current page is only partially relevant to the declared role, say so plainly.
- If helpful, recommend only from candidateRelatedPages.
- Suggested follow-ups should be concise, page-specific, and recruiter-friendly.

Return strict JSON with this shape:
{
  "answer": "string",
  "suggestedFollowUps": ["string"],
  "relatedPages": [{"slug": "string", "reason": "string"}],
  "inferredInterestTags": ["ai-builder" | "pm-leadership" | "platform" | "healthtech" | "0-to-1" | "technical-depth"]
}`;

export type PortfolioGuidePromptContext = {
  currentQuestion: string;
  sourcePriority: string[];
  answerRules: {
    unsupportedDetail: string;
    inferenceLabeling: string;
    crossPageLabeling: string;
    identityAttribution: string;
    evidenceRequirement: string;
    claimBoundaryRule: string;
    disallowed: string[];
  };
  currentPage: {
    identity: Pick<PageContext, "slug" | "href" | "title">;
    authoredContent: NonNullable<PageContext["authoredSections"]>;
    evidenceHighlights: NonNullable<PageContext["evidenceHighlights"]>;
    claimBoundaries?: PageContext["claimBoundaries"];
    recruiterPrompts?: PageContext["recruiterPrompts"];
    structuredMetadata: Omit<
      PageContext,
      "slug" | "href" | "title" | "authoredSections"
    >;
  };
  siteCatalog: PortfolioContext;
  siteMemory: {
    visitorIntent?: SessionContext["visitorIntent"];
    inferredInterestTags: SessionContext["inferredInterestTags"];
    visitedPages: Array<{
      slug: string;
      title: string;
      href: string;
      oneLiner?: string;
    }>;
    recommendedPath?: SessionContext["recommendedPath"];
    interactionSignals: {
      clickedPrompts: string[];
      askedQuestions: string[];
    };
  };
  conversationContext: {
    recentUserQuestions: string[];
    excludedAssistantMessages: number;
  };
  candidateRelatedPages: RelatedPage[];
  traceability: {
    authoredSectionLabels: string[];
    evidenceHighlightLabels: string[];
    excludedAssistantMessages: number;
    visitedPageCount: number;
  };
  responsePlaybook: {
    mode:
      | "summary"
      | "role-relevance"
      | "ownership"
      | "seniority"
      | "evidence"
      | "implied-vs-proven"
      | "impact"
      | "next-read"
      | "connections"
      | "default";
    goal: string;
    answerShape: string;
    priorities: string[];
  };
  answerStyle: {
    sentences: string;
    tone: string;
  };
};

function trimStrings(items: string[], limit: number): string[] {
  return items
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(-limit);
}

function buildConversationContext(
  conversation: CopilotConversationMessage[] = [],
): PortfolioGuidePromptContext["conversationContext"] {
  // Assistant turns are intentionally excluded here so the guide never treats its
  // own earlier output as evidence about the page.
  const recentUserQuestions: string[] = [];
  let excludedAssistantMessages = 0;

  for (const message of conversation) {
    const content = message.content.trim();
    if (!content) {
      continue;
    }

    if (message.role === "user") {
      recentUserQuestions.push(content);
      continue;
    }

    excludedAssistantMessages += 1;
  }

  return {
    recentUserQuestions,
    excludedAssistantMessages,
  };
}

function buildStructuredMetadata(
  pageContext: PageContext,
): PortfolioGuidePromptContext["currentPage"]["structuredMetadata"] {
  const {
    slug: _slug,
    href: _href,
    title: _title,
    authoredSections,
    ...structuredMetadata
  } = pageContext;

  return structuredMetadata;
}

function inferResponsePlaybook(
  question: string,
): PortfolioGuidePromptContext["responsePlaybook"] {
  const normalized = question.trim().toLowerCase();

  if (/\b(read|view) next\b|\bnext\b/.test(normalized)) {
    return {
      mode: "next-read",
      goal: "Recommend only the most useful adjacent page or two.",
      answerShape:
        "Keep the current page dominant, then use 'This case pairs with...' or 'This connects to...' for adjacent pages.",
      priorities: [
        "Minimal, high-signal cross-page guidance",
        "Only use provided related-page reasons",
        "No portfolio dump",
      ],
    };
  }

  if (/\b(role|most relevant here|relevant here|relevant for)\b/.test(normalized)) {
    return {
      mode: "role-relevance",
      goal: "Explain what is most relevant on this page for the declared role without overstating it.",
      answerShape:
        "Lead with the strongest match, add 1-2 concrete page signals, and say if the fit is only partial.",
      priorities: [
        "Role fit grounded in current-page evidence",
        "Concrete signals over generic praise",
        "Clear limit if the page is only partly relevant",
      ],
    };
  }

  if (/\b(what did .* own|responsib|ownership|implemented|build)\b/.test(normalized)) {
    return {
      mode: "ownership",
      goal: "Separate direct responsibility from influence and unknowns.",
      answerShape:
        "Prefer short labels such as 'Direct responsibility', 'Influence', and 'Not explicit' when helpful.",
      priorities: [
        "Direct ownership only if the page supports it",
        "Separate influence from implementation",
        "State missing ownership detail plainly",
      ],
    };
  }

  if (/\b(how senior|seniority|level of work)\b/.test(normalized)) {
    return {
      mode: "seniority",
      goal: "Judge the level of the work from page signals without inflating scope.",
      answerShape:
        "Use a compact 'Signals on the page' plus 'Not proven here' format when helpful.",
      priorities: [
        "Use explicit scope, leadership, or system signals",
        "Avoid implying title, org level, or team size not on the page",
        "Call out missing evidence clearly",
      ],
    };
  }

  if (/\b(strongest signals|evidence|proof|signals on this page)\b/.test(normalized)) {
    return {
      mode: "evidence",
      goal: "Surface the most concrete proof on the page.",
      answerShape:
        "Name 2-3 concrete signals and keep each tied to a metric, artifact, workflow, or stated outcome.",
      priorities: [
        "Concrete evidence first",
        "Specificity over summary",
        "No generic resume language",
      ],
    };
  }

  if (/\b(implied|not proven|proven|inference)\b/.test(normalized)) {
    return {
      mode: "implied-vs-proven",
      goal: "Separate explicit evidence from modest inference.",
      answerShape:
        "Use a compact 'Explicit on the page' and 'Implied, not proven' structure when helpful.",
      priorities: [
        "Make the explicit evidence clear",
        "Keep inference modest and labeled",
        "Do not guess missing details",
      ],
    };
  }

  if (/\b(impact|results|outcome|outcomes)\b/.test(normalized)) {
    return {
      mode: "impact",
      goal: "Summarize impact using only explicit results from the current page.",
      answerShape:
        "Lead with the strongest result, then add the supporting metric or evidence source.",
      priorities: [
        "Metrics before abstraction",
        "No imported results from other pages",
        "Keep causal claims modest",
      ],
    };
  }

  if (/\b(connect|rest of the portfolio|other work|broader portfolio)\b/.test(normalized)) {
    return {
      mode: "connections",
      goal: "Explain how this page connects to adjacent work without flattening the whole site into one summary.",
      answerShape:
        "Answer from the current page first, then mention at most 1-2 adjacent pages with concise bridge language.",
      priorities: [
        "Current page stays primary",
        "Use explicit connection metadata when available",
        "Keep cross-page references minimal",
      ],
    };
  }

  if (/\b(summary|summarize)\b/.test(normalized)) {
    return {
      mode: "summary",
      goal: "Provide a grounded summary of the page.",
      answerShape:
        "Summarize the page in 2-4 short sentences with at least one concrete proof point.",
      priorities: [
        "Current-page story first",
        "Evidence woven in naturally",
        "No hype",
      ],
    };
  }

  return {
    mode: "default",
    goal: "Answer the question with grounded, page-specific evidence.",
    answerShape:
      "Keep the answer concise, evidence-backed, and explicit about what the page does not say.",
    priorities: [
      "Current-page evidence first",
      "Clear distinction between proof and inference",
      "Recruiter-friendly clarity",
    ],
  };
}

function buildVisitedPageSummaries(
  sessionContext: SessionContext,
  currentPageSlug: string,
): PortfolioGuidePromptContext["siteMemory"]["visitedPages"] {
  return sessionContext.visitedPages
    .filter((slug) => slug !== currentPageSlug)
    .slice(-4)
    .map((slug) => getPageContextBySlug(slug))
    .filter((page): page is PageContext => Boolean(page))
    .map((page) => ({
      slug: page.slug,
      title: page.title,
      href: page.href,
      oneLiner: page.oneLiner,
    }));
}

function buildInteractionSignals(
  sessionContext: SessionContext,
  currentQuestion: string,
): PortfolioGuidePromptContext["siteMemory"]["interactionSignals"] {
  const normalizedQuestions = trimStrings(sessionContext.askedQuestions, 8);
  const askedQuestions =
    normalizedQuestions.at(-1) === currentQuestion.trim()
      ? normalizedQuestions.slice(0, -1)
      : normalizedQuestions;

  return {
    clickedPrompts: trimStrings(sessionContext.clickedPrompts, 6),
    askedQuestions: askedQuestions.slice(-4),
  };
}

export function buildPortfolioGuidePromptContext(
  request: CopilotRequest,
  relatedPages: RelatedPage[],
): PortfolioGuidePromptContext {
  const conversationContext = buildConversationContext(
    request.conversation ?? [],
  );
  const visitedPages = buildVisitedPageSummaries(
    request.sessionContext,
    request.pageContext.slug,
  );

  return {
    currentQuestion: request.message.trim(),
    sourcePriority: [
      "currentPage.authoredContent",
      "currentPage.evidenceHighlights",
      "currentPage.claimBoundaries",
      "currentPage.structuredMetadata",
      "siteMemory",
      "candidateRelatedPages",
      "siteCatalog",
      "conversationContext.recentUserQuestions",
    ],
    answerRules: {
      unsupportedDetail:
        "If the current page does not explicitly state a detail, say that clearly instead of filling the gap.",
      inferenceLabeling:
        "If a reasonable inference helps, label it as an inference and keep it modest.",
      crossPageLabeling:
        "If you use siteMemory or siteCatalog, label it as broader portfolio or session context rather than current-page fact.",
      identityAttribution:
        "siteCatalog.portfolioSubject identifies the owner of this first-person portfolio, but that identity does not by itself prove sole ownership of every project outcome.",
      evidenceRequirement:
        "Tie major claims to concrete evidence from the page whenever possible.",
      claimBoundaryRule:
        "Separate direct ownership, influence, conceptual exploration, and implementation when the question asks about responsibility or seniority.",
      disallowed: [
        "invented rankings",
        "invented ownership detail",
        "invented implementation detail",
        "invented causality",
      ],
    },
    currentPage: {
      identity: {
        slug: request.pageContext.slug,
        href: request.pageContext.href,
        title: request.pageContext.title,
      },
      authoredContent: request.pageContext.authoredSections ?? [],
      evidenceHighlights: request.pageContext.evidenceHighlights ?? [],
      claimBoundaries: request.pageContext.claimBoundaries,
      recruiterPrompts: request.pageContext.recruiterPrompts,
      structuredMetadata: buildStructuredMetadata(request.pageContext),
    },
    siteCatalog: request.portfolioContext,
    siteMemory: {
      visitorIntent: request.sessionContext.visitorIntent,
      inferredInterestTags: request.sessionContext.inferredInterestTags,
      visitedPages,
      recommendedPath: request.sessionContext.recommendedPath,
      interactionSignals: buildInteractionSignals(
        request.sessionContext,
        request.message,
      ),
    },
    conversationContext,
    candidateRelatedPages: relatedPages,
    traceability: {
      authoredSectionLabels:
        request.pageContext.authoredSections?.map((section) => section.label) ??
        [],
      evidenceHighlightLabels:
        request.pageContext.evidenceHighlights?.map(
          (highlight) => highlight.label,
        ) ?? [],
      excludedAssistantMessages: conversationContext.excludedAssistantMessages,
      visitedPageCount: visitedPages.length,
    },
    responsePlaybook: inferResponsePlaybook(request.message),
    answerStyle: {
      sentences: "2-4",
      tone: "concise, grounded, recruiter-friendly, evidence-backed",
    },
  };
}

export function buildPortfolioGuideInput(
  request: CopilotRequest,
  relatedPages: RelatedPage[],
): string {
  return JSON.stringify(
    buildPortfolioGuidePromptContext(request, relatedPages),
    null,
    2,
  );
}

export function extractResponseText(response: unknown): string {
  const typedResponse = response as {
    output_text?: string | string[];
    output?: Array<{ content?: Array<{ text?: string }> }>;
  };

  const directText = typedResponse.output_text;
  if (typeof directText === "string" && directText.trim().length > 0) {
    return directText.trim();
  }

  if (Array.isArray(directText) && directText.length > 0) {
    return directText.join("\n\n").trim();
  }

  if (!Array.isArray(typedResponse.output)) {
    return "";
  }

  const parts: string[] = [];
  for (const item of typedResponse.output) {
    if (!Array.isArray(item?.content)) {
      continue;
    }

    for (const part of item.content) {
      if (typeof part?.text === "string") {
        parts.push(part.text);
      }
    }
  }

  return parts.join("\n\n").trim();
}

function sanitizeJsonCandidate(input: string): string {
  const withoutFences = input
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = withoutFences.indexOf("{");
  const lastBrace = withoutFences.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return withoutFences;
  }

  return withoutFences.slice(firstBrace, lastBrace + 1);
}

function uniqueStringArray(input: unknown, limit = 3): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return [...new Set(input)]
    .filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    )
    .map((value) => value.trim())
    .slice(0, limit);
}

function uniqueInterestTags(input: unknown): InterestTag[] {
  return uniqueStringArray(input, 6).filter((value): value is InterestTag =>
    [
      "ai-builder",
      "pm-leadership",
      "platform",
      "healthtech",
      "0-to-1",
      "technical-depth",
    ].includes(value),
  );
}

function normalizeRelatedPages(
  input: unknown,
  fallbackRelatedPages: RelatedPage[],
): RelatedPage[] {
  if (!Array.isArray(input)) {
    return fallbackRelatedPages.slice(0, 2);
  }

  const fallbackBySlug = new Map(
    fallbackRelatedPages.map((page) => [page.slug, page]),
  );

  const relatedPages = input
    .map((item): RelatedPage | null => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const slug =
        typeof (item as { slug?: unknown }).slug === "string"
          ? (item as { slug: string }).slug
          : null;

      if (!slug || !fallbackBySlug.has(slug)) {
        return null;
      }

      const basePage = fallbackBySlug.get(slug);
      if (!basePage) {
        return null;
      }

      const reason =
        typeof (item as { reason?: unknown }).reason === "string"
          ? (item as { reason: string }).reason.trim()
          : basePage.reason;

      return {
        ...basePage,
        ...(reason ? { reason } : {}),
      };
    })
    .filter((value): value is RelatedPage => value !== null);

  return relatedPages.length > 0
    ? relatedPages.slice(0, 2)
    : fallbackRelatedPages.slice(0, 2);
}

export function normalizeCopilotResponse(
  rawText: string,
  fallbackRelatedPages: RelatedPage[],
): CopilotResponse | null {
  try {
    const parsed = JSON.parse(sanitizeJsonCandidate(rawText)) as {
      answer?: unknown;
      suggestedFollowUps?: unknown;
      relatedPages?: unknown;
      inferredInterestTags?: unknown;
    };

    const answer =
      typeof parsed.answer === "string"
        ? parsed.answer.trim()
        : Array.isArray(parsed.answer)
        ? parsed.answer
            .filter((value): value is string => typeof value === "string")
            .map((value) => value.trim())
            .filter(Boolean)
            .join("\n")
        : "";

    if (!answer) {
      return null;
    }

    return {
      answer,
      suggestedFollowUps: uniqueStringArray(parsed.suggestedFollowUps),
      relatedPages: normalizeRelatedPages(
        parsed.relatedPages,
        fallbackRelatedPages,
      ),
      inferredInterestTags: uniqueInterestTags(parsed.inferredInterestTags),
    };
  } catch {
    return null;
  }
}
