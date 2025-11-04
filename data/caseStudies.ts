export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  headlineMetrics?: Array<{ label: string; value: string }>;
  measuredMetrics?: Array<{ label: string; value: string; context?: string }>;
  body?: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "checkout-velocity",
    title: "Checkout flow optimization",
    summary: "Reduced friction through UX & A/B testing.",
    headlineMetrics: [
      { label: "conversion", value: "+3%" },
      { label: "checkout time", value: "50% faster" },
    ],
    measuredMetrics: [
      { label: "Conversion", value: "+3%", context: "A/B tested, 95%+ confidence" },
      { label: "Completion time", value: "50% faster", context: "Median time vs. baseline" },
    ],
    body: `
## Checkout transformation

<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
  <p className="text-3xl font-semibold text-slate-900">+3% conversion</p>
  <p className="mt-1 text-sm text-slate-600">AB tested metric across a 30-day experiment window.</p>
</div>

The redesigned flow removed ambiguous copy and surfaced dynamic AI-generated support options, which reduced drop-off and time to checkout completion.
    `.trim(),
  },
  {
    slug: "contact-center-ai",
    title: "Contact Center AI pilot",
    summary: "Agent assist and automated workflows.",
    headlineMetrics: [{ label: "annual impact", value: "$2.7M/yr" }],
    measuredMetrics: [
      { label: "Annualized revenue influence", value: "$2.7M+", context: "Pilot cohort extrapolated over 12 months" },
    ],
    body: `
## Scaling AI pilot impact

<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
  <p className="text-3xl font-semibold text-slate-900">$2.7M+ annualized impact</p>
  <p className="mt-1 text-sm text-slate-600">Derived from initial pilot lift across 150 agent licenses.</p>
</div>

Measured outcomes demonstrate the upside of expanding generative AI assistance into additional contact center queues.
    `.trim(),
  },
];
