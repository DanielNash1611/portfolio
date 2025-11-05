import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import CaseStudyHeader from "@/components/CaseStudyHeader";

const heroTags = [
  "AI Platform & Strategy",
  "AI Product Management",
  "Organizational Change",
  "ChatGPT Enterprise",
  "Enablement & Training"
];

const heroKpis = [
  { label: "HQ Licenses", value: "Hundreds+" },
  { label: "Contact Center Rollout", value: "~350 agents" },
  { label: "Program", value: "ChatGPT Champions" }
];

export const metadata: Metadata = {
  title: "Scaling ChatGPT Across the Organization - ChatGPT Champions & AI COE",
  description:
    "Expanded ChatGPT Enterprise from a focused contact center pilot to hundreds of HQ users, launched a ChatGPT Champions program, and laid the groundwork for an AI Center of Excellence."
};

const snapshotItems = [
  {
    label: "Role",
    value: "Senior Product Manager - AI Platform & Strategy"
  },
  {
    label: "Company",
    value: "The Guitar Center Company"
  },
  {
    label: "Timeframe",
    value: "2024-2025"
  },
  {
    label: "Scope",
    value:
      "Expanded from ~150 pilot licenses to hundreds across HQ with a roadmap toward ~1000, plus full contact center rollout (~350 agents)."
  },
  {
    label: "Focus",
    value:
      "Turn a successful pilot into a responsible AI capability the whole organization can use productively."
  }
];

const approachThemes = [
  {
    title: "Turn pilot results into a scalable story",
    body: [
      "Used the Contact Center ChatGPT Pilot as proof of value - clear ROI, strong governance, and agent advocacy.",
      "Framed a roadmap from \"one team tool\" to \"company-wide capability\" with milestones for access, enablement, and governance.",
      "Paired every expansion ask with the business outcomes already demonstrated in the pilot."
    ]
  },
  {
    title: "Training & enablement at scale",
    body: [
      "Produced self-serve training videos covering how ChatGPT works, prompt craft fundamentals, and responsible use.",
      "Delivered starter prompt libraries tailored to core teams (Product, Marketing, Merchandising, Operations).",
      "Packaged enablement kits so each new cohort could ramp quickly without bespoke workshops."
    ]
  },
  {
    title: "ChatGPT Champions program",
    body: [
      "Recruited champions across departments to run their own experiments following the pilot playbook.",
      "Facilitated regular share-outs where champions demoed workflows, swapped prompts, and surfaced new guardrail needs.",
      "Scaled adoption by letting power users model experimentation best practices inside their home teams."
    ]
  },
  {
    title: "AI COE groundwork",
    body: [
      "Partnered with Product, Data, Security, and Operations leaders to define ownership across platform, use case intake, and enablement layers.",
      "Outlined governance processes so AI efforts tied back to company goals instead of scattered experiments.",
      "Established a common language for risk, value, and maturity to guide future investment decisions."
    ]
  }
];

const outcomes = [
  {
    heading: "Scaled ChatGPT access across HQ",
    detail:
      "Moved from a single pilot to hundreds of licensed HQ users plus full deployment to the contact center (~350 agents)."
  },
  {
    heading: "ChatGPT Champions community",
    detail:
      "Champions across Product, Marketing, Merchandising, and Ops ran dozens of experiments using a shared, responsible pattern."
  },
  {
    heading: "Training & self-serve enablement",
    detail:
      "Video primers and starter prompts reduced onboarding friction and raised the floor on prompt quality and safety."
  },
  {
    heading: "Structured AI platform strategy",
    detail:
      "Clarified platform ownership, governance flow, and enablement responsibilities - boosting executive confidence in scaling AI."
  }
];

const nextSteps = [
  "Formalize a lightweight AI intake process with clear evaluation criteria for impact, risk, and complexity.",
  "Build a centralized library of reusable prompts, workflows, and automation patterns maintained by the AI COE.",
  "Introduce agentic workflows that connect ChatGPT to internal systems with robust safeguards and approval flows."
];

export default function ChatGPTOrgScalePage(): JSX.Element {
  return (
    <div className="container space-y-12 py-10">
      <Link href="/work">
        <Button variant="ghost" className="mb-4">
          Back to portfolio
        </Button>
      </Link>

      <CaseStudyHeader
        title="Scaling ChatGPT Across the Organization - ChatGPT Champions & AI COE"
        subtitle="Expanded ChatGPT Enterprise from a focused contact center pilot to hundreds of HQ users, launched a ChatGPT Champions program, and laid the groundwork for an AI Center of Excellence."
        kpis={heroKpis}
        tags={heroTags}
      />

      <section className="space-y-4 rounded-3xl border border-brand-slate/10 bg-white/90 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-brand-teal md:text-3xl">Snapshot</h2>
        <dl className="grid gap-4 md:grid-cols-2">
          {snapshotItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-brand-slate/10 bg-white/80 p-4">
              <dt className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal/70">
                {item.label}
              </dt>
              <dd className="mt-2 text-base text-brand-slate/80">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-4 rounded-3xl border border-brand-slate/10 bg-white/90 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-brand-teal md:text-3xl">Context &amp; problem</h2>
        <p className="text-brand-slate/80">
          The success of the contact center pilot triggered organization-wide demand. Without a strategy, AI adoption risked becoming a patchwork of one-off experiments, inconsistent quality, and unmanaged risk. The opportunity: build a coherent AI platform and enablement model around ChatGPT Enterprise.
        </p>
      </section>

      <section className="space-y-4 rounded-3xl border border-brand-slate/10 bg-white/90 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-brand-teal md:text-3xl">My role</h2>
        <ul className="list-disc space-y-2 pl-6 text-brand-slate/80">
          <li>Served as the de facto AI product lead for ChatGPT across the company.</li>
          <li>Defined expansion strategy, guardrails, and adoption patterns for multiple business units.</li>
          <li>Created and ran the ChatGPT Champions program to distribute experimentation.</li>
          <li>Partnered with leadership to sketch the first iteration of an AI Center of Excellence.</li>
          <li>Connected AI investments to revenue, efficiency, and customer experience objectives.</li>
        </ul>
      </section>

      <section className="space-y-6 rounded-3xl border border-brand-slate/10 bg-white/90 p-8 shadow-soft">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-brand-teal md:text-3xl">Approach</h2>
          <p className="text-brand-slate/80">
            Scaling required repeatable patterns - grounded in the pilot results but extensible across functions.
          </p>
          <p className="text-sm text-brand-slate/70">
            Building on the{" "}
            <Link href="/products/chatgpt-contact-center" className="font-semibold text-brand-teal underline-offset-4 hover:underline">
              Contact Center ChatGPT Pilot
            </Link>
            , we translated proven value into an enterprise-ready playbook.
          </p>
        </div>
        <div className="space-y-6">
          {approachThemes.map((theme) => (
            <div key={theme.title} className="space-y-3 rounded-2xl border border-brand-teal/10 bg-brand-teal/5 p-5">
              <h3 className="text-xl font-semibold text-brand-teal">{theme.title}</h3>
              <ul className="list-disc space-y-2 pl-6 text-brand-slate/80">
                {theme.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-brand-slate/10 bg-white/90 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-brand-teal md:text-3xl">Outcomes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {outcomes.map((outcome) => (
            <div key={outcome.heading} className="space-y-2 rounded-2xl border border-brand-teal/10 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-brand-teal">{outcome.heading}</h3>
              <p className="text-sm leading-relaxed text-brand-slate/80">{outcome.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-brand-slate/10 bg-white/90 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-brand-teal md:text-3xl">What I&apos;d do next</h2>
        <ul className="list-disc space-y-2 pl-6 text-brand-slate/80">
          {nextSteps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-brand-teal/15 bg-brand-teal/10 p-8 text-brand-teal shadow-soft">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold md:text-3xl">Interested in building something similar?</h2>
          <p className="text-brand-teal/80">
            Let&apos;s talk about your AI roadmap and how to scale ChatGPT adoption responsibly.
          </p>
          <Link href="/contact">
            <Button variant="primary">Start the conversation</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
