import type { NarrativeId } from "@/data/positioning";

export type InterestTag =
  | "ai-builder"
  | "pm-leadership"
  | "platform"
  | "healthtech"
  | "0-to-1"
  | "technical-depth";

export type GuideTone = "site" | "legacy";
export type GuideProjectType =
  | "case-study"
  | "product"
  | "prototype-lab"
  | "enablement"
  | "essay";

export type PageArtifact = {
  label: string;
  type: "image" | "case-study" | "prototype" | "diagram" | "video";
  description?: string;
};

export type PageAuthoredSection = {
  label: string;
  snippets: string[];
};

export type PageEvidenceHighlight = {
  label: string;
  detail: string;
  type: "metric" | "artifact" | "workflow" | "outcome" | "ownership";
};

export type PageClaimBoundary = {
  directOwnership?: string[];
  influence?: string[];
  conceptualExploration?: string[];
  implementation?: string[];
  explicitUnknowns?: string[];
};

export type CrossPageLink = {
  slug: string;
  bridge: string;
};

export type VisitorIntent = {
  rawInput: string;
  normalizedTitle?: string;
  seniority?: "pm" | "senior" | "group" | "director" | "exec";
  roleLenses?: NarrativeId[];
  focusAreas?: string[];
  emphasis?: string[];
};

export type GuidedRecommendation = {
  slug: string;
  title: string;
  reason: string;
  priority: number;
};

export type GuideInteractionSource = "chip" | "input" | "follow-up";

export type GuideInteractionMeta = {
  source: GuideInteractionSource;
  visitorId: string;
  sessionId: string;
  turnIndex: number;
};

export type RelatedPage = {
  slug: string;
  title: string;
  href: string;
  reason?: string;
};

export type PortfolioSubject = {
  name: string;
  shortName: string;
  authoredInFirstPerson: boolean;
};

export type PageContext = {
  slug: string;
  href: string;
  title: string;
  category?: string;
  oneLiner?: string;
  role?: string;
  companyOrProject?: string;
  timeframe?: string;
  problem?: string;
  actions?: string[];
  outcomes?: string[];
  metrics?: string[];
  tools?: string[];
  leadershipSignals?: string[];
  artifacts?: PageArtifact[];
  relatedProjectSlugs?: string[];
  tags?: string[];
  interestTags?: InterestTag[];
  roleLens?: NarrativeId[];
  domains?: string[];
  strengths?: string[];
  senioritySignals?: string[];
  projectType?: GuideProjectType;
  evidenceHighlights?: PageEvidenceHighlight[];
  claimBoundaries?: PageClaimBoundary;
  recruiterPrompts?: string[];
  crossPageLinks?: CrossPageLink[];
  authoredSections?: PageAuthoredSection[];
};

export type PortfolioContext = {
  portfolioSubject?: PortfolioSubject;
  bioSummary?: string;
  positioning?: string[];
  strengths?: string[];
  careerThemes?: string[];
  skillMap?: Record<string, string[]>;
  featuredProjects?: Array<{
    slug: string;
    title: string;
    href?: string;
    whyItMatters?: string;
  }>;
  pageDirectory?: Array<{
    slug: string;
    title: string;
    href: string;
    category?: string;
    oneLiner?: string;
    evidenceHighlights?: string[];
    interestTags?: InterestTag[];
  }>;
};

export type SessionContext = {
  visitedPages: string[];
  clickedPrompts: string[];
  askedQuestions: string[];
  inferredInterestTags: InterestTag[];
  visitorIntent?: VisitorIntent;
  recommendedPath?: GuidedRecommendation[];
  lastVisitedAt?: string;
};

export type CopilotConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type CopilotRequest = {
  message: string;
  pageContext: PageContext;
  portfolioContext: PortfolioContext;
  sessionContext: SessionContext;
  interactionMeta?: GuideInteractionMeta;
  conversation?: CopilotConversationMessage[];
  debug?: boolean;
};

export type CopilotResponse = {
  answer: string;
  suggestedFollowUps?: string[];
  relatedPages?: RelatedPage[];
  inferredInterestTags?: InterestTag[];
  debug?: {
    promptContext: Record<string, unknown>;
  };
};

export type GuideConversationMessage = CopilotConversationMessage & {
  id: string;
  createdAt: string;
  suggestedFollowUps?: string[];
  relatedPages?: RelatedPage[];
};

export type GuideSessionState = SessionContext & {
  version: number;
  tagSignals: InterestTag[];
  conversationsBySlug: Record<string, GuideConversationMessage[]>;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
