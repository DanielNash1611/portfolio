import type {
  PageContext,
  PageClaimBoundary,
  PageEvidenceHighlight,
} from "@/lib/portfolio-guide/types";

export type GuideScope = "page" | "portfolio";
export type GuideEntryPoint = "ui" | "webmcp";
export type NavigationAction = { kind: "navigate"; slug: string };
export type PublicSurface = Pick<
  PageContext,
  | "slug"
  | "href"
  | "title"
  | "oneLiner"
  | "category"
  | "tags"
  | "projectType"
  | "interestTags"
  | "roleLens"
  | "domains"
  | "strengths"
  | "senioritySignals"
  | "evidenceHighlights"
  | "recruiterPrompts"
> & {
  kind: "detail" | "collection" | "profile" | "method" | "utility";
  aliases: string[];
  featured?: boolean;
};

export type PublicPageEvidence = {
  slug: string;
  title: string;
  source: { kind: "portfolio_authored"; url: string };
  summary?: string;
  highlights: PageEvidenceHighlight[];
  sections: NonNullable<PageContext["authoredSections"]>;
  claimBoundaries: PageClaimBoundary;
};

export type AgentSubmitEvent = SubmitEvent & {
  agentInvoked?: boolean;
  respondWith?: (result: Promise<unknown>) => void;
};
