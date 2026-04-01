import {
  getAllCanonicalPageContexts,
  getCanonicalProjectBySlug,
} from "@/lib/portfolio-guide/context";
import { scorePageForVisitorIntent } from "@/lib/portfolio-guide/recommendations";
import type {
  PageContext,
  PortfolioContext,
  RelatedPage,
  SessionContext,
} from "@/lib/portfolio-guide/types";

type ScoredCandidate = {
  pageContext: PageContext;
  score: number;
  reason: string;
  visited: boolean;
};

function intersectionSize(left: string[] = [], right: string[] = []): number {
  const rightSet = new Set(right);
  return left.reduce(
    (count, item) => (rightSet.has(item) ? count + 1 : count),
    0,
  );
}

function getFeaturedProjectSlugs(portfolioContext: PortfolioContext): string[] {
  return (
    portfolioContext.featuredProjects?.map((project) => project.slug).filter(Boolean) ??
    []
  );
}

function scoreCandidate(
  currentPage: PageContext,
  candidate: PageContext,
  portfolioContext: PortfolioContext,
  sessionContext: SessionContext,
): ScoredCandidate {
  const featuredProjectSlugs = getFeaturedProjectSlugs(portfolioContext);
  const guidedRecommendation =
    sessionContext.recommendedPath?.find(
      (recommendation) => recommendation.slug === candidate.slug,
    ) ?? null;
  const visitorIntentScore = scorePageForVisitorIntent(
    candidate,
    sessionContext.visitorIntent,
    featuredProjectSlugs,
  );
  const explicitCrossPageLink =
    currentPage.crossPageLinks?.find((link) => link.slug === candidate.slug) ?? null;
  const relatedSlugs = currentPage.relatedProjectSlugs ?? [];
  const explicitIndex = relatedSlugs.indexOf(candidate.slug);
  const sharedTagCount = intersectionSize(currentPage.tags, candidate.tags);
  const sharedInterestCount = intersectionSize(
    currentPage.interestTags,
    candidate.interestTags,
  );
  const sessionInterestCount = intersectionSize(
    sessionContext.inferredInterestTags,
    candidate.interestTags,
  );
  const featured = featuredProjectSlugs.includes(candidate.slug);
  const visited = sessionContext.visitedPages.includes(candidate.slug);

  let score = 0;
  let reason = "Related to the themes on this page.";

  if (explicitCrossPageLink) {
    score += explicitIndex >= 0 ? 40 : 200;
    reason = explicitCrossPageLink.bridge;
  }

  if (guidedRecommendation) {
    score += 220 - (guidedRecommendation.priority - 1) * 30;
    if (!explicitCrossPageLink) {
      reason = guidedRecommendation.reason;
    }
  }

  if (visitorIntentScore.score > 0) {
    score += visitorIntentScore.score;
    if (!guidedRecommendation && !explicitCrossPageLink) {
      reason = visitorIntentScore.reason;
    }
  }

  if (explicitIndex >= 0) {
    score += 1000 - explicitIndex * 100;
    if (
      !guidedRecommendation &&
      visitorIntentScore.score === 0 &&
      !explicitCrossPageLink
    ) {
      reason = "Explicitly related from this page’s portfolio metadata.";
    }
  }

  if (currentPage.category && currentPage.category === candidate.category) {
    score += 24;
    if (
      explicitIndex < 0 &&
      !guidedRecommendation &&
      visitorIntentScore.score === 0 &&
      !explicitCrossPageLink
    ) {
      reason = `Another example in ${candidate.category.toLowerCase()}.`;
    }
  }

  if (sharedTagCount > 0) {
    score += sharedTagCount * 10;
    if (
      explicitIndex < 0 &&
      !guidedRecommendation &&
      visitorIntentScore.score === 0 &&
      !explicitCrossPageLink
    ) {
      reason = "Overlapping themes and tags with the current page.";
    }
  }

  if (sharedInterestCount > 0) {
    score += sharedInterestCount * 8;
    if (
      explicitIndex < 0 &&
      !guidedRecommendation &&
      visitorIntentScore.score === 0 &&
      !explicitCrossPageLink
    ) {
      reason = "A strong follow-on if you want more of the same kind of work.";
    }
  }

  if (sessionInterestCount > 0) {
    score += sessionInterestCount * 12;
    if (
      explicitIndex < 0 &&
      !guidedRecommendation &&
      visitorIntentScore.score === 0 &&
      !explicitCrossPageLink
    ) {
      reason = "Matches the topics you’ve shown interest in during this session.";
    }
  }

  if (featured) {
    score += 4;
  }

  return {
    pageContext: candidate,
    score,
    reason,
    visited,
  };
}

export function getRelatedPages(
  pageContext: PageContext,
  portfolioContext: PortfolioContext,
  sessionContext: SessionContext,
  limit = 2,
): RelatedPage[] {
  const candidates = getAllCanonicalPageContexts()
    .filter((candidate) => candidate.slug !== pageContext.slug)
    .map((candidate) =>
      scoreCandidate(pageContext, candidate, portfolioContext, sessionContext),
    )
    .filter((candidate) => candidate.score > 0)
    .filter((candidate) => Boolean(getCanonicalProjectBySlug(candidate.pageContext.slug)));

  const sorted = candidates.sort((left, right) => right.score - left.score);
  const unseen = sorted.filter((candidate) => !candidate.visited);
  const seen = sorted.filter((candidate) => candidate.visited);

  return [...unseen, ...seen].slice(0, limit).map((candidate) => ({
    slug: candidate.pageContext.slug,
    title: candidate.pageContext.title,
    href: candidate.pageContext.href,
    reason: candidate.reason,
  }));
}
