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
import MotionReveal from "@/components/site/MotionReveal";
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
  "group inline-flex items-center justify-center gap-2 border px-5 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-slate)]";

export default function AiCareerOperatingSystemPage(): JSX.Element {
  return (
    <div className="overflow-hidden">
      <AiCareerHero />

      <section className="bg-[#dbe7e3] py-16 md:py-24">
        <Container className="space-y-16 md:space-y-24">
          <MotionReveal>
            <CaseStudyOverview />
          </MotionReveal>

          <MotionReveal>
            <section
              className="space-y-10"
              aria-labelledby="boundaries-heading"
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(240px,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
                <h2
                  id="boundaries-heading"
                  className="max-w-[10ch] text-balance font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] text-[color:var(--color-slate)] md:text-6xl"
                >
                  Clear product boundaries
                </h2>
                <p className="max-w-2xl self-end text-pretty text-base leading-7 text-[color:var(--color-slate)]/68 md:text-lg md:leading-8">
                  The products share an operating context and authenticated
                  contracts, but each retains a distinct responsibility. Human
                  review remains the final accountability layer.
                </p>
              </div>

              <div className="grid border-y border-[color:var(--color-slate)]/16 md:grid-cols-3 md:divide-x md:divide-[color:var(--color-slate)]/16">
                {boundaries.map((boundary, index) => (
                  <article
                    key={boundary.title}
                    className="border-b border-[color:var(--color-slate)]/16 py-7 last:border-b-0 md:border-b-0 md:px-7 md:first:pl-0 md:last:pr-0"
                  >
                    <p className="font-mono text-xs text-[color:var(--color-orange)]">
                      0{index + 1}
                    </p>
                    <h3 className="mt-5 font-serif text-2xl font-medium tracking-[-0.025em] text-[color:var(--color-slate)]">
                      {boundary.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--color-slate)]/68">
                      {boundary.detail}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </MotionReveal>
        </Container>
      </section>

      <section className="bg-[color:var(--color-background)] py-10 md:py-14">
        <Container>
          {pageContext ? (
            <PortfolioGuide
              pageContext={pageContext}
              portfolioContext={portfolioContext}
            />
          ) : null}
        </Container>
      </section>

      <section className="bg-[#e8c7ba] py-16 md:py-24">
        <Container className="space-y-20 md:space-y-28">
          <ProductEngines />
          <EvidenceBridge />
        </Container>
      </section>

      <WhatThisProves />

      <section className="bg-[#e6d7aa] py-16 md:py-24">
        <Container>
          <EvalEvidence />
        </Container>
      </section>

      <section className="bg-[#d8e5ed] py-16 md:py-24">
        <Container>
          <ImplementedNext />
        </Container>
      </section>

      <section className="border-t border-white/12 bg-[#173f3d] text-[color:var(--color-cream)]">
        <Container className="grid gap-10 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <MotionReveal className="max-w-3xl">
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-tan)]">
              <span className="h-px w-10 bg-current" aria-hidden="true" />
              Continue exploring
            </div>
            <h2 className="mt-6 max-w-[17ch] text-balance font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] md:text-6xl">
              Explore the evidence first. Try the workflow when it is useful.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--color-cream)]/72 md:text-lg">
              Use the generator when a role-specific artifact would help a
              hiring team evaluate the same evidence in context.
            </p>
            <p className="mt-3 text-sm leading-6 text-[color:var(--color-cream)]/52">
              The generator is an action surface, not evidence of role fit.
            </p>
          </MotionReveal>

          <MotionReveal
            delay={0.08}
            className="flex flex-wrap gap-3 lg:max-w-[320px] lg:justify-end"
          >
            <Link
              href="#portfolio-guide-ai-career-operating-system"
              className={`${actionClassName} border-[color:var(--color-cream)] bg-[color:var(--color-cream)] text-[color:var(--color-slate)] hover:border-[color:var(--color-tan)] hover:bg-[color:var(--color-tan)]`}
            >
              Ask the Portfolio Guide
              <ArrowDown
                className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/resume/generate"
              className={`${actionClassName} border-white/24 text-[color:var(--color-cream)] hover:border-[color:var(--color-tan)] hover:text-[color:var(--color-tan)]`}
            >
              Generate a role-specific resume
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </MotionReveal>
        </Container>
      </section>
    </div>
  );
}
