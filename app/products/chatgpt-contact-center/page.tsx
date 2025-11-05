import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import CaseStudyHeader from "@/components/CaseStudyHeader";

const heroTags = [
  "AI Product Management",
  "ChatGPT Enterprise",
  "Contact Center",
  "Experimentation",
  "Change Management"
];

const heroKpis = [
  { label: "Annualized Impact", value: "$2.7M+" },
  { label: "Pilot Duration", value: "6 months" },
  { label: "Pilot Cohort", value: "15 agents" }
];

export const metadata: Metadata = {
  title: "Contact Center ChatGPT Pilot - AI Copilot for Agents",
  description:
    "Designed and launched a 6-month ChatGPT Enterprise pilot for Guitar Center's contact center, delivering a $2.7M annualized impact and proving the business case for scaling AI."
};

const snapshotItems = [
  {
    label: "Role",
    value: "Senior Product Manager - Contact Center & Order Management"
  },
  {
    label: "Company",
    value: "The Guitar Center Company"
  },
  {
    label: "Timeframe",
    value: "June 2024 - November 2024"
  },
  {
    label: "Scope",
    value: "15 agents in pilot cohort with a matched control group"
  },
  {
    label: "Objective",
    value:
      "Validate whether AI copilots improve revenue per call, efficiency, and experience without sacrificing brand voice or data security."
  }
];

const approachSections = [
  {
    title: "Brainstorming sessions -> focused customGPTs",
    body: [
      "Partnered with supervisors and frontline agents to surface their highest-friction jobs-to-be-done.",
      "Converted the insights into purpose-built customGPTs, including a call-prep assistant and brand-safe email helpers.",
      "One of the pilot customGPTs became the most-used customGPT inside the company, proving we solved a real agent problem."
    ]
  },
  {
    title: "Safe use of CRM data & security review",
    body: [
      "Collaborated with EIS to review ChatGPT Enterprise security and privacy posture.",
      "Agreed on guardrails for pasting basic CRM context (no PCI or PII) and double-checking generated copy before sending.",
      "Documented do/don't guidance so agents understood exactly how to work safely."
    ]
  },
  {
    title: "Agent workflow design: call scripts and emails",
    body: [
      "Defined repeatable workflows for pre-call prep and follow-up emails using structured prompts.",
      "Enabled agents to turn CRM snippets into concise call plans that emphasized solution paths and relevant product tie-ins.",
      "Accelerated outbound communications without automating call summaries - keeping humans in the loop where it mattered most."
    ]
  }
];

const measurementBullets = [
  "Formed a 15-agent ChatGPT test group and a matched control group with similar tenure, skill, and call mix.",
  "Measured growth deltas between groups to control for seasonality instead of relying on simple before/after comparisons.",
  "Primary metrics: Revenue Per Call, Items Per Transaction (IPT), Average Order Value (AOV).",
  "Efficiency signals (handle time, after-call work) influenced the $2.7M annualized impact model - ChatGPT agents consistently outperformed control across each vector."
];

const outcomes = [
  {
    heading: "$2.7M annualized impact",
    detail:
      "Pilot agents outpaced the control group across Revenue Per Call, IPT, and AOV while reducing time spent on prep and follow-up."
  },
  {
    heading: "Proof that AI can work safely with CRM context",
    detail:
      "EIS and Legal signed off on using basic CRM data within ChatGPT Enterprise under the guardrails defined in the pilot."
  },
  {
    heading: "CustomGPT adoption",
    detail:
      "One of the pilot customGPTs quickly became the most-used customGPT across the company, validating product-market fit for agent workflows."
  },
  {
    heading: "Foundation for scaling",
    detail:
      "Results unlocked a decision to roll ChatGPT Enterprise out to the entire contact center (~350 agents) and set the stage for org-wide expansion."
  }
];

const nextSteps = [
  "Turn the most successful customGPTs into task-specific mini-agents embedded directly in the agent desktop.",
  "Expand the measurement framework to capture customer sentiment and first-contact resolution alongside revenue metrics.",
  "Integrate with OMS and knowledge-base systems in a human-in-the-loop pattern that keeps agents accountable for final outputs."
];

export default function ContactCenterChatGPTPage(): JSX.Element {
  return (
    <div className="container space-y-12 py-10">
      <Link href="/work">
        <Button variant="ghost" className="mb-4">
          Back to portfolio
        </Button>
      </Link>

      <CaseStudyHeader
        title="Contact Center ChatGPT Pilot - AI Copilot for Agents"
        subtitle="Designed and launched a 6-month ChatGPT Enterprise pilot for Guitar Center's contact center, driving a $2.7M annualized impact and proving the business case for scaling AI."
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
          Agents juggled multiple tools, manually drafted emails and call scripts, and spent valuable time preparing for every interaction. Leadership wanted to know if AI could serve as a safe, reliable copilot that improved performance without risking customer trust.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-brand-slate/80">
          <li>Help agents prepare before calls with faster access to relevant context.</li>
          <li>Draft on-brand emails in minutes instead of grinding through templates and copy/paste loops.</li>
          <li>Deliver measurable lift in Revenue Per Call, Items Per Transaction, and Average Order Value.</li>
          <li>Respect Guitar Center&apos;s brand voice and data governance requirements.</li>
        </ul>
      </section>

      <section className="space-y-4 rounded-3xl border border-brand-slate/10 bg-white/90 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-brand-teal md:text-3xl">My role</h2>
        <ul className="list-disc space-y-2 pl-6 text-brand-slate/80">
          <li>Framed the opportunity, success metrics, and business case for piloting AI inside the contact center.</li>
          <li>Partnered with EIS and Legal to ensure security, privacy, and compliance were baked into the pilot from day one.</li>
          <li>Facilitated co-design sessions with supervisors and agents to capture real workflows and pain points.</li>
          <li>Defined and iterated on customGPT instructions, tone guidance, and workflow prompts.</li>
          <li>Designed the experimental setup, including control group selection and measurement methodology.</li>
          <li>Socialized pilot results and recommendations with senior leadership to green-light expansion.</li>
        </ul>
      </section>

      <section className="space-y-6 rounded-3xl border border-brand-slate/10 bg-white/90 p-8 shadow-soft">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-brand-teal md:text-3xl">Approach</h2>
        <p className="text-brand-slate/80">
          The pilot focused on shipping working workflows quickly - balancing agent creativity with the guardrails needed for a retail contact center.
        </p>
        </div>
        <div className="space-y-6">
          {approachSections.map((section) => (
            <div key={section.title} className="space-y-3 rounded-2xl border border-brand-teal/10 bg-brand-teal/5 p-5">
              <h3 className="text-xl font-semibold text-brand-teal">{section.title}</h3>
              <ul className="list-disc space-y-2 pl-6 text-brand-slate/80">
                {section.body.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-brand-slate/10 bg-white/90 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-brand-teal md:text-3xl">Measurement &amp; experiment design</h2>
        <p className="text-brand-slate/80">
          Retail seasonality and promotional spikes make simple before/after comparisons unreliable. We designed a matched control methodology to keep the signal clean.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-brand-slate/80">
          {measurementBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-3xl border border-brand-slate/10 bg-white/90 p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-brand-teal md:text-3xl">Key outcomes</h2>
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
            Let&apos;s talk about your AI roadmap and how to launch or scale copilots responsibly.
          </p>
          <Link href="/contact">
            <Button variant="primary">Start the conversation</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
