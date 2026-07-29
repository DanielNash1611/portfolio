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
  conversationId?: string;
  clientTurnId?: string;
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

export type RecommendationEvidenceLevel =
  | "current_page"
  | "project_linked"
  | "broader";

export type RecommendationSummary = {
  id: string;
  name: string;
  title: string;
  relationshipCapacity: string;
  source: "LinkedIn" | "Direct";
  short: string;
  full: string;
  narrativeTags: NarrativeId[];
  date?: string;
  profileUrl?: string;
  evidenceLevel: RecommendationEvidenceLevel;
  /**
   * When evidenceLevel is "project_linked", the project slug(s) this rec is
   * tied to. Lets the model say "tied to this project" rather than implying
   * the rec is rendered on the page.
   */
  linkedProjectIds?: string[];
  /**
   * Optional one-liner explaining why this recommendation maps to the
   * current project. Surfaced verbatim in the prompt context.
   */
  projectRelevance?: string;
};

export type PageRecommendationContext = {
  /** Recommendations the page actually renders today (direct evidence). */
  currentPage: RecommendationSummary[];
  /** Recommendations explicitly tied to this project via projectIds but not rendered on the page. */
  projectLinked: RecommendationSummary[];
  /** Tag-matched recommendations from elsewhere on the site, kept as supporting context. */
  broader: RecommendationSummary[];
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
  recommendations?: PageRecommendationContext;
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

/** Lightweight evidence summary for optional UI display. */
export type EvidenceSummary = {
  project: string;
  claim: string;
  capabilityTags: string[];
  hasMetrics: boolean;
};

/**
 * Provenance metadata describing which evidence layers backed an answer.
 * Lets the UI (and debugging) distinguish a page-context-only answer from one
 * augmented with source-audited ResumeCustomizer evidence, and surfaces why the
 * deeper layer was skipped when applicable. Never contains secrets.
 */
export type EvidenceMetadata = {
  /** True whenever the answer was grounded in the current/related page context. */
  pageContextUsed: boolean;
  /** True only when source-audited ResumeCustomizer evidence was woven in. */
  resumeCustomizerEvidenceUsed: boolean;
  /** Why the deeper evidence layer was not used (omitted when it was used). */
  evidenceUnavailableReason?: string;
  /** Non-fatal, server-side degradation notes for observability. */
  warnings?: string[];
};

export type CopilotResponse = {
  answer: string;
  suggestedFollowUps?: string[];
  relatedPages?: RelatedPage[];
  inferredInterestTags?: InterestTag[];
  /** Evidence items used in this answer, for optional UI display. Never contains raw resume bullets. */
  evidenceUsed?: EvidenceSummary[];
  /** Which evidence layers backed this answer and why the deeper layer was skipped, if it was. */
  evidenceMeta?: EvidenceMetadata;
  debug?: {
    promptContext: Record<string, unknown>;
  };
};

export type GuideConversationMessage = CopilotConversationMessage & {
  id: string;
  createdAt: string;
  turnId?: string;
  pageSlug?: string;
  pageTitle?: string;
  suggestedFollowUps?: string[];
  relatedPages?: RelatedPage[];
};

export type GuideSessionSignals = Pick<
  SessionContext,
  | "visitedPages"
  | "clickedPrompts"
  | "askedQuestions"
  | "inferredInterestTags"
  | "visitorIntent"
  | "recommendedPath"
  | "lastVisitedAt"
>;

export type PortfolioGuideTurnRequest = {
  clientTurnId: string;
  pageSlug: string;
  message: string;
  source: GuideInteractionSource;
  sessionSignals: GuideSessionSignals;
  fallbackConversation?: CopilotConversationMessage[];
};

export type GuidePersistenceStatus = "durable" | "degraded" | "disabled";

export type GuideConversationSnapshot = {
  messages: GuideConversationMessage[];
  sessionSignals?: GuideSessionSignals;
  persistenceStatus: GuidePersistenceStatus;
  expiresAt?: string;
};

export type GuideSessionState = SessionContext & {
  version: number;
  tagSignals: InterestTag[];
  conversationsBySlug: Record<string, GuideConversationMessage[]>;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
