import type {
  GuideSessionState,
  InterestTag,
  PageContext,
} from "@/lib/portfolio-guide/types";

const PAGE_SIGNAL_KEYWORDS: Record<InterestTag, string[]> = {
  "ai-builder": [
    "prototype",
    "builder",
    "custom gpt",
    "ai-native",
    "agents",
    "launchmuse",
    "sound seeker",
  ],
  "pm-leadership": [
    "leadership",
    "governance",
    "enablement",
    "operating model",
    "planning",
    "jira product discovery",
    "cross-functional",
  ],
  platform: [
    "platform",
    "connector",
    "mcp",
    "retrieval",
    "workflow orchestration",
  ],
  healthtech: [
    "immunology",
    "research",
    "science",
    "scientific",
    "literature",
    "hypothesis",
  ],
  "0-to-1": [
    "0-to-1",
    "mvp",
    "alpha",
    "concept",
    "prototype",
    "incubation",
  ],
  "technical-depth": [
    "architecture",
    "retrieval",
    "evaluation",
    "agent",
    "workflow",
    "system",
    "integration",
    "connector",
  ],
};

function normalizeText(input: string): string {
  return input.trim().toLowerCase();
}

function uniqueTags(tags: InterestTag[]): InterestTag[] {
  return [...new Set(tags)];
}

function collectPageSignals(pageContext: PageContext): string {
  return normalizeText(
    [
      pageContext.slug,
      pageContext.title,
      pageContext.category,
      pageContext.oneLiner,
      pageContext.problem,
      ...(pageContext.actions ?? []),
      ...(pageContext.tools ?? []),
      ...(pageContext.tags ?? []),
      ...(pageContext.leadershipSignals ?? []),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function inferInterestTagsFromText(input: string): InterestTag[] {
  const text = normalizeText(input);
  if (!text) {
    return [];
  }

  const matches: InterestTag[] = [];

  for (const [tag, keywords] of Object.entries(PAGE_SIGNAL_KEYWORDS) as Array<
    [InterestTag, string[]]
  >) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      matches.push(tag);
    }
  }

  return uniqueTags(matches);
}

export function inferInterestTagsFromPageContext(
  pageContext: PageContext,
): InterestTag[] {
  return uniqueTags([
    ...(pageContext.interestTags ?? []),
    ...inferInterestTagsFromText(collectPageSignals(pageContext)),
  ]);
}

export function inferInterestTags({
  pageContext,
  text,
}: {
  pageContext?: PageContext;
  text?: string;
}): InterestTag[] {
  return uniqueTags([
    ...(pageContext ? inferInterestTagsFromPageContext(pageContext) : []),
    ...(text ? inferInterestTagsFromText(text) : []),
  ]);
}

export function getSessionAwarePrompt(
  sessionState: GuideSessionState,
  currentPageSlug?: string,
): string | null {
  const distinctVisitedPages = new Set(sessionState.visitedPages);
  if (currentPageSlug) {
    distinctVisitedPages.add(currentPageSlug);
  }

  if (sessionState.visitorIntent) {
    const recommendedSlugs = new Set(
      (sessionState.recommendedPath ?? []).map((recommendation) => recommendation.slug),
    );
    const viewedRecommendedPages = [...distinctVisitedPages].filter((slug) =>
      recommendedSlugs.has(slug),
    ).length;

    if (distinctVisitedPages.size >= 3 || viewedRecommendedPages >= 2) {
      return "What is the strongest remaining evidence for this role elsewhere on the site?";
    }

    if (distinctVisitedPages.size >= 2) {
      return "What should I view next for this role?";
    }

    return null;
  }

  if (distinctVisitedPages.size < 2 || sessionState.tagSignals.length === 0) {
    return null;
  }

  const counts = new Map<InterestTag, number>();
  for (const tag of sessionState.tagSignals) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }

  const dominantTag =
    [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ??
    null;

  switch (dominantTag) {
    case "pm-leadership":
      return "What else on the site shows leadership examples?";
    case "healthtech":
      return "What on the site shows healthtech work?";
    case "technical-depth":
      return "What else on the site shows technical depth?";
    case "platform":
      return "What should I read for platform and systems work?";
    case "0-to-1":
      return "What else should I read for builder roles?";
    case "ai-builder":
    default:
      return "What else should I view for AI work?";
  }
}
