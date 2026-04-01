export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  headlineMetrics?: Array<{ label: string; value: string }>;
  measuredMetrics?: Array<{ label: string; value: string; context?: string }>;
  body?: string;
  href?: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "checkout-velocity",
    title: "Checkout redesign",
    summary:
      "A high-stakes checkout redesign that improved speed, validated conversion lift, and showed how better execution quality can shape delivery outcomes.",
    headlineMetrics: [
      { label: "annualized impact", value: "~$16M" },
      { label: "checkout time", value: "30% faster" },
    ],
    measuredMetrics: [
      {
        label: "Conversion",
        value: "~3%",
        context: "Post-launch A/B testing validated measurable lift",
      },
      {
        label: "Completion time",
        value: "3:00 to 2:03",
        context: "Follow-up usability testing across real checkout tasks",
      },
    ],
    body: `
## Checkout redesign

<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
  <p className="text-3xl font-semibold text-slate-900">~$16M annualized upside</p>
  <p className="mt-1 text-sm text-slate-600">Estimated from the post-launch A/B test instead of assumptions alone.</p>
</div>

The redesigned flow simplified a dense multi-step experience, cut checkout time by roughly 30%, and launched in 12 weeks with minimal service disruption.
    `.trim(),
    href: "/work/checkout-redesign",
  },
  {
    slug: "contact-center-ai",
    title: "Contact Center ChatGPT pilot",
    summary:
      "Launched a six-month ChatGPT Enterprise pilot with a matched control group to quantify agent copilot impact.",
    headlineMetrics: [{ label: "annualized impact", value: "~$2.7M" }],
    measuredMetrics: [
      {
        label: "Annualized revenue influence",
        value: "~$2.7M",
        context: "Pilot cohort extrapolated over 12 months",
      },
    ],
    body: `
## Scaling AI pilot impact

<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
  <p className="text-3xl font-semibold text-slate-900">$2.7M+ annualized impact</p>
  <p className="mt-1 text-sm text-slate-600">Derived from initial pilot lift across 150 agent licenses.</p>
</div>

Measured outcomes demonstrate the upside of expanding generative AI assistance into additional contact center queues.
    `.trim(),
    href: "/products/chatgpt-contact-center",
  },
  {
    slug: "jira-product-discovery",
    title: "Jira Product Discovery adoption",
    summary:
      "Standardized prioritization and planning in Jira Product Discovery to align product, business, and technology partners.",
    headlineMetrics: [
      { label: "org adoption", value: "9 PMs" },
      { label: "onboarding", value: "8 weeks" },
    ],
    href: "/case-studies/jira-product-discovery",
  },
  {
    slug: "chatgpt-org-scale",
    title: "Scaling ChatGPT across the organization",
    summary:
      "Expanded ChatGPT Enterprise access, launched ChatGPT Champions, and established AI COE guardrails.",
    headlineMetrics: [
      { label: "licensed users", value: "~1,000" },
      { label: "daily active users", value: "~800" },
    ],
    href: "/products/chatgpt-org-scale",
  },
];
