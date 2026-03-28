export type NarrativeId =
  | "senior-product-manager"
  | "builder-pm"
  | "product-leader";

export type Narrative = {
  id: NarrativeId;
  name: string;
  shortName: string;
  summary: string;
  positioning: string;
  proofPoints: string[];
  workHref: string;
  resumeHref: string;
};

export type ResumeTrack = {
  id: NarrativeId;
  label: string;
  audience: string;
  focus: string;
  resumeHref: string;
  placeholderPath: string;
  placeholderNote: string;
};

export type ApprovedMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
  narrativeIds: NarrativeId[];
};

export const NARRATIVE_ORDER: NarrativeId[] = [
  "senior-product-manager",
  "builder-pm",
  "product-leader",
];

export const NARRATIVES: Narrative[] = [
  {
    id: "senior-product-manager",
    name: "Senior Product Manager",
    shortName: "Sr PM",
    summary:
      "End-to-end owner across customer journeys, service operations, and AI-enabled products. Strong in roadmap, prioritization, experimentation, and cross-functional execution.",
    positioning:
      "Best fit for broad-market Senior Product Manager roles spanning commerce, platforms, operations, and AI-enabled customer experiences.",
    proofPoints: [
      "~$16M annualized impact from checkout redesign",
      "~3% conversion lift and 30% faster checkout",
      "12-week launch with minimal service disruption",
      "~$2.7M estimated annual lift from a Contact Center ChatGPT pilot",
    ],
    workHref: "/work#senior-product-manager",
    resumeHref: "/resume#senior-product-manager",
  },
  {
    id: "builder-pm",
    name: "Builder PM",
    shortName: "Builder",
    summary:
      "Best fit for 0-to-1, AI platform, prototyping, and innovation-heavy product roles. I turn ambiguity into shipped workflows, pilots, and scalable product foundations.",
    positioning:
      "Best fit for teams building AI workflows, internal tools, emerging products, and platform capabilities from first principles.",
    proofPoints: [
      "AI middle layer story with MCP, connectors, and retrieval patterns",
      "Custom GPTs and internal AI workflows that moved from pilot to broader adoption",
      "Hackathon-winning product concept translated into portfolio-grade prototypes",
      "Emerging AI + science work with Immiatrics",
    ],
    workHref: "/work#builder-pm",
    resumeHref: "/resume#builder-pm",
  },
  {
    id: "product-leader",
    name: "Product Leader",
    shortName: "Leader",
    summary:
      "Player-coach PM leader who improves how teams build through governance, onboarding, prioritization, and product operating cadence.",
    positioning:
      "Best fit for PM leadership roles focused on operating model, enablement, governance, and leader-of-leaders influence.",
    proofPoints: [
      "AI COE and governance operating model",
      "PM onboarding and train-the-trainer enablement",
      "Jira Product Discovery adoption across the product organization",
      "First 3-year contact center roadmap and repeatable planning rhythm",
    ],
    workHref: "/work#product-leader",
    resumeHref: "/resume#product-leader",
  },
];

export const RESUME_TRACKS: ResumeTrack[] = [
  {
    id: "senior-product-manager",
    label: "Senior Product Manager Resume",
    audience:
      "For broad-market Senior PM roles across commerce, platform, customer experience, and AI-enabled product teams.",
    focus:
      "Balances growth, operations, experimentation, and cross-functional execution with explicit business outcomes.",
    resumeHref: "/resume#senior-product-manager",
    placeholderPath:
      "/public/resumes/daniel-nash-senior-product-manager-resume.pdf",
    placeholderNote:
      "Add the PDF at public/resumes/daniel-nash-senior-product-manager-resume.pdf to enable a direct download.",
  },
  {
    id: "builder-pm",
    label: "Builder PM Resume",
    audience:
      "For 0-to-1, AI platform, prototyping, workflow, and frontier product roles.",
    focus:
      "Highlights AI pilots, internal tools, prototyping speed, platform thinking, and emerging product work.",
    resumeHref: "/resume#builder-pm",
    placeholderPath: "/public/resumes/daniel-nash-builder-pm-resume.pdf",
    placeholderNote:
      "Add the PDF at public/resumes/daniel-nash-builder-pm-resume.pdf to enable a direct download.",
  },
  {
    id: "product-leader",
    label: "Product Leader Resume",
    audience:
      "For PM leadership, operating model, enablement, governance, and player-coach opportunities.",
    focus:
      "Highlights PM practice, roadmap leadership, AI governance, decision quality, and org-scale enablement.",
    resumeHref: "/resume#product-leader",
    placeholderPath: "/public/resumes/daniel-nash-product-leader-resume.pdf",
    placeholderNote:
      "Add the PDF at public/resumes/daniel-nash-product-leader-resume.pdf to enable a direct download.",
  },
];

export const APPROVED_METRICS: ApprovedMetric[] = [
  {
    id: "checkout-impact",
    label: "Checkout redesign",
    value: "~$16M annualized impact",
    detail:
      "Estimated from a post-launch A/B test after a 12-week checkout redesign.",
    narrativeIds: ["senior-product-manager"],
  },
  {
    id: "checkout-speed",
    label: "Faster checkout",
    value: "30% faster",
    detail:
      "Full checkout time dropped from 3:00 to 2:03 while the redesigned flow became easier to scan.",
    narrativeIds: ["senior-product-manager"],
  },
  {
    id: "returns-modernization",
    label: "Returns workflow modernization",
    value: "16 systems reduced to 9",
    detail:
      "Simplified fragmented tooling and saved roughly 2,000 annual hours through workflow modernization.",
    narrativeIds: ["senior-product-manager", "product-leader"],
  },
  {
    id: "returns-hours",
    label: "Operational efficiency",
    value: "~2,000 annual hours saved",
    detail:
      "Reduced team overhead by modernizing returns workflows and removing avoidable tool switching.",
    narrativeIds: ["senior-product-manager", "product-leader"],
  },
  {
    id: "contact-center-pilot",
    label: "Contact Center ChatGPT pilot",
    value: "~$2.7M estimated annual lift",
    detail:
      "Measured from a controlled pilot that validated AI-assisted workflows in the contact center.",
    narrativeIds: ["senior-product-manager", "builder-pm"],
  },
  {
    id: "chatgpt-rollout",
    label: "Enterprise ChatGPT rollout",
    value: "~1,000 licensed users / ~800 DAU",
    detail:
      "Scaled adoption with enablement, governance, and repeatable rollout patterns across the organization.",
    narrativeIds: ["senior-product-manager", "product-leader"],
  },
];

export const POSITIONING_EXPLAINER = [
  {
    narrativeId: "senior-product-manager" as const,
    title:
      "Think of me as a broad Senior Product Manager when you need end-to-end ownership.",
    body: "That lens fits customer journeys, service operations, experimentation, prioritization, and cross-functional delivery across product, engineering, operations, legal, and security.",
  },
  {
    narrativeId: "builder-pm" as const,
    title:
      "Think of me as a Builder PM when the brief is ambiguous and the product is still taking shape.",
    body: "That lens fits AI workflows, prototypes, internal tools, platform foundations, and early product bets that need someone to move from concept to credible shipped system.",
  },
  {
    narrativeId: "product-leader" as const,
    title:
      "Think of me as a Product Leader when the challenge is how the team works, not just what it ships.",
    body: "That lens fits governance, onboarding, planning rhythm, portfolio visibility, PM enablement, and the operating model that helps product organizations scale.",
  },
] as const;

export const MUSIC_NOTE = {
  title: "Also a composer",
  description:
    "Music stays in the portfolio as a differentiator rather than the headline. It sharpens systems thinking, pattern recognition, storytelling, and taste without pulling focus from the product narrative.",
  href: "/music",
};

export const IMMIATRICS = {
  name: "Immiatrics",
  label: "Emerging Work",
  category: "AI + Science",
  summary:
    "Exploring how AI systems and product thinking can support scientific discovery in immunology research.",
  detail:
    "This is emerging venture-stage work in frontier applied AI. I describe it modestly because the opportunity is promising, but still early.",
  href: "/work#immiatrics",
};
