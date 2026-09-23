import type { NarrativeId } from "@/data/positioning";
import { isCreativeTechnologyIntent } from "@/lib/portfolio-guide/intent";
import type {
  GuidedRecommendation,
  InterestTag,
  PageContext,
  VisitorIntent,
} from "@/lib/portfolio-guide/types";

type VisitorIntentScore = {
  score: number;
  reason: string;
};

// An editorial path through complementary evidence, not a claim of job fit.
export const CREATIVE_TECHNOLOGY_TOUR = [
  {
    slug: "gravity-astra",
    reason:
      "Start with an original composition made spatial and interactive: Blender-built instruments, hand controls, and simpler gestures shaped by human testing.",
  },
  {
    slug: "tabletop-symphony",
    reason:
      "Explore a composer-built adaptive score that keeps the storyteller in control. The public page shows the process and working private alpha.",
  },
  {
    slug: "ai-career-operating-system",
    reason:
      "See how the same builder approach becomes a concrete AI workflow, with source-grounded retrieval, evaluation, and human review—and explicit implementation limits.",
  },
  {
    slug: "the-side-of-ai-i-want-to-be-on",
    reason:
      "Read the point of view connecting these projects: AI should expand creativity and human capability alongside measurable business value.",
  },
  {
    slug: "chatgpt-enterprise",
    reason:
      "Finish with enterprise delivery evidence: ChatGPT adoption grew from a controlled pilot to roughly 1,000 licensed users and 800 daily active users.",
  },
] as const;

const ROLE_LENS_LABELS: Record<NarrativeId, string> = {
  "senior-product-manager": "broad end-to-end PM work",
  "builder-pm": "0-to-1 and AI builder work",
  "product-leader": "leadership and operating model work",
};

const SIGNAL_LABELS: Record<string, string> = {
  "creative-technology": "creative technology and interactive experiences",
  "ai-product": "AI product work",
  platform: "platform and systems thinking",
  leadership: "leadership and org-shaping work",
  "0-to-1": "0-to-1 product building",
  "technical-depth": "technical depth",
  experimentation: "experimentation and measured validation",
  commerce: "commerce execution",
  healthtech: "healthtech and research workflows",
  scale: "org-scale rollout",
  ux: "UX and decision quality",
  governance: "governance and enablement",
  enablement: "enablement and onboarding",
  operations: "operations and workflow modernization",
  research: "research workflow design",
  "contact-center": "contact center workflows",
  "enterprise-ai": "enterprise AI adoption",
  "workflow-design": "workflow design",
};

const SIGNAL_TO_INTEREST_TAGS: Record<string, InterestTag[]> = {
  "creative-technology": ["creative-technology"],
  "ai-product": ["ai-builder"],
  platform: ["platform"],
  leadership: ["pm-leadership"],
  "0-to-1": ["0-to-1"],
  "technical-depth": ["technical-depth"],
  healthtech: ["healthtech"],
  scale: ["pm-leadership"],
};

function uniqueStrings(items: Array<string | undefined>): string[] {
  return [...new Set(items.filter((item): item is string => Boolean(item)))];
}

function intersection(left: string[] = [], right: string[] = []): string[] {
  const rightSet = new Set(right);
  return left.filter((item) => rightSet.has(item));
}

function countTagTextMatches(
  tags: string[] = [],
  intentKeywords: string[],
): number {
  const normalizedTags = tags.map((tag) => tag.toLowerCase());
  return intentKeywords.reduce((count, keyword) => {
    const normalizedKeyword = keyword.toLowerCase();
    if (
      normalizedKeyword.length > 2 &&
      normalizedTags.some(
        (tag) =>
          tag.includes(normalizedKeyword) || normalizedKeyword.includes(tag),
      )
    ) {
      return count + 1;
    }

    return count;
  }, 0);
}

function buildReason(
  pageContext: PageContext,
  roleMatches: NarrativeId[],
  signalMatches: string[],
  seniorityMatch: boolean,
  projectTypeMatch: boolean,
): string {
  const rolePhrase = roleMatches
    .map((role) => ROLE_LENS_LABELS[role])
    .slice(0, 2)
    .join(" and ");
  const signalPhrase = signalMatches
    .map((signal) => SIGNAL_LABELS[signal] ?? signal)
    .slice(0, 2)
    .join(" and ");
  const evidenceCue =
    pageContext.evidenceHighlights?.[0]?.detail ?? pageContext.oneLiner ?? "";
  const evidenceSuffix = evidenceCue ? ` Evidence includes ${evidenceCue}` : "";

  if (roleMatches.length > 0 && signalMatches.length > 0) {
    return `Strong match for ${rolePhrase}, with clear evidence in ${signalPhrase}.${evidenceSuffix}`;
  }

  if (roleMatches.length > 0 && seniorityMatch) {
    return `Strong match for ${rolePhrase}, with signal at the level this role usually needs.${evidenceSuffix}`;
  }

  if (roleMatches.length > 0) {
    return `Strong match for ${rolePhrase}.${evidenceSuffix}`;
  }

  if (signalMatches.length > 0) {
    return `Good supporting evidence for ${signalPhrase}, even if it is not the closest overall role match.${evidenceSuffix}`;
  }

  if (projectTypeMatch) {
    return `Useful supporting evidence because it shows a relevant kind of product work, even if it is not the closest overall match.${evidenceSuffix}`;
  }

  return `Relevant supporting evidence for the role you entered.${evidenceSuffix}`;
}

function getIntentSignalSet(intent: VisitorIntent): string[] {
  return uniqueStrings([
    ...(intent.focusAreas ?? []),
    ...(intent.emphasis ?? []),
  ]);
}

export function scorePageForVisitorIntent(
  pageContext: PageContext,
  visitorIntent?: VisitorIntent,
  featuredSlugs: string[] = [],
): VisitorIntentScore {
  if (!visitorIntent) {
    return {
      score: 0,
      reason: "Relevant supporting evidence for the role you entered.",
    };
  }

  const roleMatches = intersection(
    pageContext.roleLens,
    visitorIntent.roleLenses,
  ) as NarrativeId[];
  const intentSignals = getIntentSignalSet(visitorIntent);
  const signalMatches = uniqueStrings([
    ...intersection(pageContext.domains, intentSignals),
    ...intersection(pageContext.strengths, intentSignals),
  ]);
  const seniorityMatch = Boolean(
    visitorIntent.seniority &&
      pageContext.senioritySignals?.includes(visitorIntent.seniority),
  );
  const interestTagMatches = uniqueStrings(
    intentSignals.flatMap((signal) => SIGNAL_TO_INTEREST_TAGS[signal] ?? []),
  );
  const matchedInterestTags = intersection(
    pageContext.interestTags,
    interestTagMatches,
  );
  const tagTextMatches = countTagTextMatches(pageContext.tags, [
    visitorIntent.rawInput,
    visitorIntent.normalizedTitle ?? "",
    ...intentSignals,
  ]);
  const projectTypeMatch = Boolean(
    pageContext.projectType &&
      ((intentSignals.includes("0-to-1") &&
        ["product", "prototype-lab"].includes(pageContext.projectType)) ||
        (intentSignals.includes("leadership") &&
          ["case-study", "enablement"].includes(pageContext.projectType)) ||
        (intentSignals.includes("platform") &&
          ["case-study", "product"].includes(pageContext.projectType))),
  );
  const featured = featuredSlugs.includes(pageContext.slug);

  let score = 0;
  score += roleMatches.length * 70;
  score += signalMatches.length * 18;
  score += seniorityMatch ? 18 : 0;
  score += matchedInterestTags.length * 10;
  score += tagTextMatches * 4;
  score += projectTypeMatch ? 8 : 0;
  score += featured ? 5 : 0;

  return {
    score,
    reason: buildReason(
      pageContext,
      roleMatches,
      signalMatches,
      seniorityMatch,
      projectTypeMatch,
    ),
  };
}

export function getGuidedRecommendations(
  pageCatalog: PageContext[],
  visitorIntent: VisitorIntent,
  options?: {
    featuredSlugs?: string[];
    excludeSlugs?: string[];
    limit?: number;
  },
): GuidedRecommendation[] {
  const featuredSlugs = options?.featuredSlugs ?? [];
  const excludeSet = new Set(options?.excludeSlugs ?? []);
  if (isCreativeTechnologyIntent(visitorIntent)) {
    return CREATIVE_TECHNOLOGY_TOUR.filter((step) => !excludeSet.has(step.slug))
      .flatMap((step) => {
        const page = pageCatalog.find(
          (candidate) => candidate.slug === step.slug,
        );
        return page
          ? [{ slug: page.slug, title: page.title, reason: step.reason }]
          : [];
      })
      .slice(0, options?.limit ?? 5)
      .map((step, index) => ({ ...step, priority: index + 1 }));
  }
  const limit = options?.limit ?? 4;
  const ranked = pageCatalog
    .filter((page) => page.projectType !== "creative-experience")
    .filter((page) => !excludeSet.has(page.slug))
    .map((page) => {
      const score = scorePageForVisitorIntent(
        page,
        visitorIntent,
        featuredSlugs,
      );
      return {
        page,
        score: score.score,
        reason: score.reason,
      };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score);
  const trimmed =
    ranked.length > 3 && ranked[3].score < 45
      ? ranked.slice(0, Math.min(limit, 3))
      : ranked.slice(0, limit);

  return trimmed.map((candidate, index) => ({
    slug: candidate.page.slug,
    title: candidate.page.title,
    reason: candidate.reason,
    priority: index + 1,
  }));
}
