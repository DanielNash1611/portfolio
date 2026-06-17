import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import AiCareerHero from "@/components/ai-career-system/AiCareerHero";
import CaseStudyOverview from "@/components/ai-career-system/CaseStudyOverview";
import EvalEvidence from "@/components/ai-career-system/EvalEvidence";
import EvidenceBridge from "@/components/ai-career-system/EvidenceBridge";
import ImplementedNext from "@/components/ai-career-system/ImplementedNext";
import ProductEngines from "@/components/ai-career-system/ProductEngines";
import WhatThisProves from "@/components/ai-career-system/WhatThisProves";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import Container from "@/components/site/Container";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

const pageContext = getPageContextByPath(
  "/products/ai-career-operating-system",
);
const portfolioContext = getPortfolioContext();

export const metadata: Metadata = {
  title: "AI Career Operating System",
  description:
    "A governed AI workflow for turning approved career evidence into recruiter-ready artifacts through source-audited retrieval, evals, and human review.",
  openGraph: {
    title: "AI Career Operating System",
    description:
      "A governed AI workflow for turning approved career evidence into recruiter-ready artifacts.",
    images: [
      {
        url: "/images/products/ai-career-operating-system/governed-ai-workflow-career-evidence.png",
        width: 1693,
        height: 929,
        alt: "Governed AI workflow from approved career evidence to a human-approved artifact.",
      },
    ],
  },
};

const boundaries = [
  {
    title: "Portfolio",
    detail:
      "Recruiter UX, authored page grounding, Portfolio Guide interactions, download, and optional email delivery.",
  },
  {
    title: "ResumeCustomizer",
    detail:
      "Public-safe evidence retrieval, role mapping, generation, specialized reviews, rendering, and temporary artifacts.",
  },
  {
    title: "Human review",
    detail:
      "Final accountability for what is approved, represented publicly, and submitted to a hiring team.",
  },
];

const actionClassName =
  "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-slate)]";

export default function AiCareerOperatingSystemPage(): JSX.Element {
  return (
    <Container className="space-y-12 pt-6 pb-16 md:space-y-16">
      <AiCareerHero />
      <CaseStudyOverview />

      <section className="space-y-8" aria-labelledby="boundaries-heading">
        <div className="max-w-3xl space-y-4">
          <h2
            id="boundaries-heading"
            className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-4xl"
          >
            Clear product boundaries
          </h2>
          <p className="text-pretty text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
            The products share an operating context and authenticated contracts,
            but each retains a distinct responsibility. Human review remains the
            final accountability layer.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {boundaries.map((boundary, index) => (
            <article
              key={boundary.title}
              className="border-t-2 border-[color:var(--color-teal)]/22 pt-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-orange)]">
                0{index + 1}
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[color:var(--color-slate)]">
                {boundary.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-slate)]/68">
                {boundary.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      {pageContext ? (
        <PortfolioGuide
          pageContext={pageContext}
          portfolioContext={portfolioContext}
        />
      ) : null}

      <ProductEngines />
      <EvidenceBridge />
      <WhatThisProves />
      <EvalEvidence />
      <ImplementedNext />

      <section className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[color:var(--color-slate)] px-6 py-8 text-[color:var(--color-cream)] shadow-[0_30px_80px_rgba(58,61,64,0.18)] md:px-8 md:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(219,191,150,0.2),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(209,122,95,0.22),_transparent_42%)]"
        />
        <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl space-y-4">
            <h2 className="max-w-[18ch] text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Explore the evidence first. Try the workflow when it is useful.
            </h2>
            <p className="text-base leading-7 text-[color:var(--color-cream)]/78 md:text-lg">
              Use the generator when a role-specific artifact would help a
              hiring team evaluate the same evidence in context.
            </p>
            <p className="text-sm leading-6 text-[color:var(--color-cream)]/62">
              The generator is an action surface, not evidence of role fit.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#portfolio-guide-ai-career-operating-system"
              className={`${actionClassName} border-[color:var(--color-cream)] bg-[color:var(--color-cream)] text-[color:var(--color-slate)]`}
            >
              Ask the Portfolio Guide
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/resume/generate"
              className={`${actionClassName} border-white/20 bg-transparent text-[color:var(--color-cream)] hover:bg-white/10`}
            >
              Generate a role-specific resume
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </Container>
  );
}
