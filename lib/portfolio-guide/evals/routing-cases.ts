import type { InterestTag } from "@/lib/portfolio-guide/types";

export type RoutingEvalCase = {
  question: string;
  route: boolean;
  topics?: InterestTag[];
  sources?: string[];
};

// Labels describe information needs, never claims about Daniel's accomplishments.
export const routingEvalCases: RoutingEvalCase[] = [
  { question: "What are the strongest signals on this page?", route: false },
  { question: "What particularly was Daniel responsible for?", route: false },
  { question: "How senior is this work?", route: false },
  { question: "What's implied but not proven here?", route: false },
  { question: "What should I view next?", route: false },
  { question: "Does this page mention MCP?", route: false },
  { question: "What was the impact on this page?", route: false },
  { question: "Which pattern was reused most?", route: false },
  {
    question: "Tell me about Gravity.",
    route: false,
    sources: ["gravity-astra"],
  },
  {
    question: "What is Tabletop Symphony?",
    route: false,
    sources: ["tabletop-symphony"],
  },
  { question: "Explain that point.", route: false },
  { question: "How do I contact Daniel?", route: false },
  {
    question: "For the role I entered, what's most relevant here?",
    route: false,
  },
  {
    question: "What's his experience with AI?",
    route: true,
    topics: ["ai-builder"],
  },
  {
    question: "Has Daniel implemented AI in enterprise environments?",
    route: true,
    topics: ["ai-builder"],
  },
  {
    question: "Would Daniel be a good Director of AI Product?",
    route: true,
    topics: ["ai-builder", "pm-leadership"],
  },
  {
    question:
      "How does his creative background influence his product leadership?",
    route: true,
    topics: ["creative-technology", "pm-leadership"],
  },
  {
    question: "How does Daniel's creative background connect to his AI work?",
    route: true,
    topics: ["creative-technology", "ai-builder"],
  },
  {
    question: "Compare Daniel's platform work with his AI product experience.",
    route: true,
    topics: ["platform", "ai-builder"],
  },
  {
    question: "Has Daniel led teams through major technology transformations?",
    route: true,
    topics: ["pm-leadership"],
  },
  { question: "What companies has Daniel worked for?", route: true },
  {
    question:
      "What career evidence supports Daniel's experience in healthcare?",
    route: true,
    topics: ["healthtech"],
    sources: ["immunology-scout"],
  },
  {
    question: "Can Daniel lead technical teams?",
    route: true,
    topics: ["pm-leadership"],
  },
  { question: "What makes Daniel more than a retail PM?", route: true },
  {
    question: "Has Daniel shipped production AI?",
    route: true,
    topics: ["ai-builder"],
  },
  {
    question:
      "Compare his experience with AI evaluations and technical architecture.",
    route: true,
    topics: ["technical-depth", "ai-builder"],
  },
  {
    question: "Across the portfolio, what supports 0-to-1 product work?",
    route: true,
    topics: ["0-to-1"],
  },
  {
    question: "How does this connect to the rest of the portfolio?",
    route: true,
  },
  {
    question:
      "Across his career, what demonstrates measurable business outcomes?",
    route: true,
  },
  {
    question:
      "Compare Gravity × Astra with Tabletop Symphony across the portfolio.",
    route: true,
    topics: ["creative-technology"],
    sources: ["gravity-astra", "tabletop-symphony"],
  },
  {
    question: "Does Daniel have experience with life science AI research?",
    route: true,
    topics: ["healthtech", "ai-builder"],
    sources: ["immunology-scout"],
  },
  {
    question:
      "Across the portfolio, separate Daniel's direct ownership from his influence.",
    route: true,
    topics: ["pm-leadership"],
  },
];
