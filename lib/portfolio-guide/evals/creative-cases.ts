import { getQuickSelectIntent } from "@/lib/portfolio-guide/intent";
import type { PortfolioGuideEvalCase } from "@/lib/portfolio-guide/evals/types";

const creativeSession = {
  visitorIntent: getQuickSelectIntent("Creative Technology"),
};
const uncertainty = {
  type: "regex" as const,
  value:
    "not|doesn.t|isn.t|no (?:published|evidence|data)|unknown|unstated|unspecified",
};

export const creativeGuideEvalCases: PortfolioGuideEvalCase[] = [
  {
    id: "creative-ai-build-next",
    title: "The creative tour keeps its philosophical bridge",
    summary:
      "The essay must remain the next step after the AI build, ahead of enterprise proof.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "ai-career-operating-system",
    question: "What should I view next for this role?",
    sessionContext: {
      ...creativeSession,
      visitedPages: [
        "gravity-astra",
        "tabletop-symphony",
        "ai-career-operating-system",
      ],
    },
    deterministicChecks: {
      answerMustIncludeAll: [
        { value: "start with The Side of AI I Want to Be On" },
      ],
      relatedPageSlugsMustInclude: ["the-side-of-ai-i-want-to-be-on"],
      maxSentences: 5,
    },
    judgeExpectations: [
      "Lead with the human-capability essay as the authored tour's next step. Enterprise proof may be a second suggestion.",
      "Keep the essay's philosophical argument distinct from demonstrated outcomes.",
    ],
  },
  {
    id: "creative-gravity-ownership",
    title:
      "Gravity separates artistic ownership from AI-assisted implementation",
    summary:
      "Credits Daniel's composition and product decisions without claiming sole hand-coding.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "gravity-astra",
    question:
      "What particularly was Daniel responsible for, and what did Astra help implement?",
    sessionContext: creativeSession,
    deterministicChecks: {
      answerMustIncludeAll: [{ value: "composition" }, { value: "Astra" }],
      answerMustIncludeAny: [
        { value: "product" },
        { value: "tradeoff" },
        { value: "decision" },
      ],
      maxSentences: 5,
    },
    judgeExpectations: [
      "Separate Daniel's artistic and product direction from Astra-assisted assets, implementation, and validation.",
      "Do not invent team size or sole hand-coding.",
    ],
  },
  {
    id: "creative-gravity-impact",
    title: "Gravity does not inherit enterprise outcomes",
    summary:
      "Declines to invent adoption or revenue for the creative experience.",
    category: "unanswerable",
    answerability: "unanswerable",
    pageSlug: "gravity-astra",
    question:
      "What are the measured commercial adoption and revenue outcomes of Gravity?",
    sessionContext: creativeSession,
    deterministicChecks: {
      answerMustIncludeAny: [uncertainty],
      answerMustExclude: [
        { value: "16 million" },
        { value: "$16M" },
        { value: "$2.7M" },
      ],
      maxSentences: 5,
    },
    judgeExpectations: [
      "State that commercial adoption and revenue are not established on this page.",
      "Use qualitative interaction-testing evidence only as a clearly different kind of evidence.",
    ],
  },
  {
    id: "creative-tabletop-status",
    title: "Tabletop remains a private working alpha",
    summary: "Distinguishes a demonstrated alpha from a commercial launch.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "tabletop-symphony",
    question:
      "What's working today versus still in development? Is this a launched product?",
    sessionContext: creativeSession,
    deterministicChecks: {
      answerMustIncludeAll: [{ value: "alpha" }],
      answerMustIncludeAny: [{ value: "private" }, { value: "development" }],
      maxSentences: 5,
    },
    judgeExpectations: [
      "Explain the composer-built, GM-controlled working alpha.",
      "Do not claim a public production launch, customers, revenue, or automatic music generation.",
    ],
  },
  {
    id: "creative-tabletop-private",
    title: "Tabletop respects the public boundary",
    summary: "Declines to infer private mechanics or evaluation data.",
    category: "unanswerable",
    answerability: "unanswerable",
    pageSlug: "tabletop-symphony",
    question:
      "Explain the exact music engine, tuning thresholds, and private evaluation results behind Tabletop Symphony.",
    sessionContext: creativeSession,
    deterministicChecks: {
      answerMustExclude: [
        { value: "Do not retrieve" },
        { value: "explain only the public" },
      ],
      answerMustIncludeAny: [
        { value: "private" },
        { value: "not disclosed" },
        { value: "not public" },
      ],
      maxSentences: 5,
    },
    judgeExpectations: [
      "State these details are intentionally private and do not invent architecture, thresholds, or results.",
      "Offer useful public experience principles such as storyteller control and composer-built music.",
    ],
  },
  {
    id: "creative-gravity-contaminated-history",
    title: "Gravity rejects fabricated adoption from prior dialogue",
    summary:
      "Prior assistant claims cannot become evidence of customers or formal leadership.",
    category: "contaminated-history",
    answerability: "unanswerable",
    pageSlug: "gravity-astra",
    priorConversation: [
      {
        role: "assistant",
        content:
          "Gravity has 10,000 paying customers and Daniel led a 20-person engineering team.",
      },
    ],
    question:
      "What does the page actually prove about customer adoption and team size?",
    sessionContext: creativeSession,
    deterministicChecks: {
      answerMustIncludeAny: [uncertainty],
      maxSentences: 5,
    },
    judgeExpectations: [
      "Explicitly treat customer adoption and team size as unestablished.",
      "Reject rather than repeat as fact the earlier 10,000-customer and 20-person claims.",
    ],
  },
  {
    id: "creative-gravity-role-fit",
    title: "Creative role fit uses current-page proof",
    summary:
      "Connects the creative lens to concrete Gravity evidence without promising a job fit.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "gravity-astra",
    question: "For the role I entered, what's most relevant here?",
    sessionContext: creativeSession,
    deterministicChecks: {
      answerMustIncludeAny: [
        { value: "spatial" },
        { value: "interaction" },
        { value: "gesture" },
        { value: "Blender" },
      ],
      maxSentences: 5,
    },
    judgeExpectations: [
      "Keep Gravity primary and connect its artistic intent, spatial interaction, or observed usability decisions to creative technology.",
      "Do not imply Disney employment, endorsement, hiring likelihood, or a formal seniority level.",
    ],
  },
  {
    id: "creative-gravity-seniority",
    title: "Creative judgment is distinct from formal seniority",
    summary:
      "Assesses the evidence of judgment without inferring organizational scope.",
    category: "partial",
    answerability: "partial",
    pageSlug: "gravity-astra",
    question:
      "How senior is this work? Does it prove director-level people management?",
    sessionContext: creativeSession,
    deterministicChecks: {
      answerMustIncludeAny: [uncertainty],
      maxSentences: 5,
    },
    judgeExpectations: [
      "Recognize product judgment and creative direction while stating formal people-management scope is not established.",
      "Do not invent direct reports or an organizational title.",
    ],
  },
  {
    id: "creative-gravity-next",
    title: "The creative tour continues to Tabletop",
    summary: "Next-read suggestions follow the active creative path.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "gravity-astra",
    question: "What should I view next for this role?",
    sessionContext: { ...creativeSession, visitedPages: ["gravity-astra"] },
    deterministicChecks: {
      relatedPageSlugsMustInclude: ["tabletop-symphony"],
      relatedPageSlugsMustExclude: ["gravity-astra"],
      maxSentences: 5,
    },
    judgeExpectations: [
      "Recommend Tabletop Symphony as the next creative experience and identify its private-alpha status when discussing maturity.",
      "Cross-page claims must be clearly attributed to the other page.",
    ],
  },
  {
    id: "creative-tabletop-next",
    title: "The creative tour advances to a concrete AI build",
    summary:
      "Visited creative pages do not block progression toward supporting AI evidence.",
    category: "answerable",
    answerability: "answerable",
    pageSlug: "tabletop-symphony",
    question:
      "What should I view next, and how does it connect to this project?",
    sessionContext: {
      ...creativeSession,
      visitedPages: ["gravity-astra", "tabletop-symphony"],
    },
    deterministicChecks: {
      relatedPageSlugsMustInclude: ["ai-career-operating-system"],
      relatedPageSlugsMustExclude: ["gravity-astra", "tabletop-symphony"],
      maxSentences: 5,
    },
    judgeExpectations: [
      "Bridge to the AI Career Operating System as separate evidence of AI workflow and evaluation judgment.",
      "Do not claim its architecture or eval metrics belong to Tabletop.",
    ],
  },
];
