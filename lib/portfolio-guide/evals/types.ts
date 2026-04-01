import type {
  CopilotRequest,
  SessionContext,
} from "@/lib/portfolio-guide/types";
import type { PortfolioGuideGenerationResult } from "@/lib/portfolio-guide/service";
import type {
  EvalProviderConfig,
  EvalProviderMode,
} from "@/lib/portfolio-guide/evals/provider";

export type EvalAnswerability = "answerable" | "partial" | "unanswerable";
export type EvalCategory =
  | "answerable"
  | "partial"
  | "unanswerable"
  | "contaminated-history"
  | "cross-page-memory";

export type EvalMatcher = {
  value: string;
  type?: "substring" | "regex";
  flags?: string;
};

export type PortfolioGuideDeterministicTextTarget =
  | "answer"
  | "suggestedFollowUps"
  | "relatedPageReasons";

export type PortfolioGuideDeterministicChecks = {
  target?: PortfolioGuideDeterministicTextTarget;
  answerMustIncludeAll?: EvalMatcher[];
  answerMustIncludeAny?: EvalMatcher[];
  answerMustIncludeAnyGroups?: EvalMatcher[][];
  answerMustExclude?: EvalMatcher[];
  relatedPageSlugsMustInclude?: string[];
  relatedPageSlugsMustExclude?: string[];
  maxSentences?: number;
};

export type PortfolioGuideEvalCase = {
  id: string;
  title: string;
  summary: string;
  category: EvalCategory;
  answerability: EvalAnswerability;
  pageSlug: string;
  question: string;
  priorConversation?: CopilotRequest["conversation"];
  sessionContext?: Partial<SessionContext>;
  deterministicChecks?:
    | PortfolioGuideDeterministicChecks
    | PortfolioGuideDeterministicChecks[];
  advisoryChecks?: PortfolioGuideDeterministicChecks[];
  judgeExpectations: string[];
  judgeThresholds?: Partial<PortfolioGuideEvalRubricScores>;
};

export type PortfolioGuideEvalRubricScores = {
  groundedness: number;
  uncertaintyHandling: number;
  sourceSeparation: number;
  helpfulness: number;
  concision: number;
};

export type PortfolioGuideEvalJudgeResult = {
  passed: boolean;
  verdict: "pass" | "fail";
  summary: string;
  scores: PortfolioGuideEvalRubricScores;
  strengths: string[];
  issues: string[];
  rawText: string;
};

export type PortfolioGuideDeterministicCheckResult = {
  passed: boolean;
  label: string;
  details?: string;
  severity: "hard" | "advisory";
  target:
    | PortfolioGuideDeterministicTextTarget
    | "relatedPages";
};

export type PortfolioGuideEvalCaseResult = {
  evalCase: PortfolioGuideEvalCase;
  request: CopilotRequest;
  generation?: PortfolioGuideGenerationResult;
  deterministicChecks: PortfolioGuideDeterministicCheckResult[];
  judge?: PortfolioGuideEvalJudgeResult;
  providers: {
    mode: EvalProviderMode;
    assistant: Pick<EvalProviderConfig, "label" | "model" | "baseURL">;
    judge?: Pick<EvalProviderConfig, "label" | "model" | "baseURL">;
  };
  failures: Array<{
    stage: "assistant" | "judge";
    message: string;
  }>;
  passed: boolean;
};

export type PortfolioGuideEvalSummary = {
  total: number;
  passed: number;
  failed: number;
  assistantFailures: number;
  deterministicFailures: number;
  advisoryWarnings: number;
  judgeFailures: number;
  averageScores?: PortfolioGuideEvalRubricScores;
};

export type PortfolioGuideEvalSuiteResult = {
  label: string;
  cases: PortfolioGuideEvalCaseResult[];
  summary: PortfolioGuideEvalSummary;
};

export type PortfolioGuideEvalAssistant = (input: {
  evalCase: PortfolioGuideEvalCase;
  request: CopilotRequest;
  signal?: AbortSignal;
}) => Promise<PortfolioGuideGenerationResult>;

export type PortfolioGuideEvalJudge = (input: {
  evalCase: PortfolioGuideEvalCase;
  request: CopilotRequest;
  generation: PortfolioGuideGenerationResult;
  signal?: AbortSignal;
}) => Promise<PortfolioGuideEvalJudgeResult>;

export type PortfolioGuideRecordedResponse = Pick<
  PortfolioGuideGenerationResult,
  | "promptInput"
  | "rawText"
  | "relatedPages"
  | "response"
  | "normalizationStatus"
  | "provider"
>;
