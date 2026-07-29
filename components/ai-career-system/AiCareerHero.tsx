import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Container from "@/components/site/Container";
import MediaFrame from "@/components/site/MediaFrame";
import MotionReveal from "@/components/site/MotionReveal";

const actionClassName =
  "group inline-flex items-center justify-center gap-2 border px-5 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-slate)]";

export default function AiCareerHero(): JSX.Element {
  return (
    <section className="relative isolate overflow-hidden bg-[color:var(--color-slate)] text-[color:var(--color-cream)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[color:var(--color-orange)]/12 blur-3xl"
      />

      <Container className="relative grid gap-12 py-12 md:py-16 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[minmax(0,0.72fr)_minmax(520px,1.28fr)] lg:items-center lg:gap-16 lg:py-20">
        <MotionReveal>
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-tan)]">
              <span className="h-px w-10 bg-current" aria-hidden="true" />
              Governed AI product workflow
            </div>
            <h1 className="mt-8 text-balance font-serif font-medium tracking-[-0.06em]">
              <span className="block text-[clamp(3.6rem,7vw,7.4rem)] leading-[0.82] text-[color:var(--color-cream)]">
                AI Career
              </span>
              <span className="mt-3 block max-w-[11ch] text-[clamp(2.75rem,5.6vw,6.2rem)] leading-[0.86] text-[color:var(--color-tan)]">
                Operating System
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-pretty text-xl font-medium leading-8 text-[color:var(--color-cream)] md:text-2xl md:leading-9">
              A governed AI workflow for turning approved career evidence into
              recruiter-ready artifacts.
            </p>
            <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-[color:var(--color-cream)]/66">
              The system connects portfolio proof, source-audited evidence
              retrieval, role-aware resume generation, authenticated APIs,
              evals, and human review, showing how AI can improve high-stakes
              knowledge work without hiding claim boundaries.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
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
            </div>

            <p className="mt-8 max-w-xl border-l-2 border-[color:var(--color-orange)] pl-4 text-sm leading-6 text-[color:var(--color-cream)]/56">
              Personal operating context with authenticated boundaries,
              source-audited retrieval, eval-backed grounding, and human
              approval. No external-adoption claim.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.12}>
          <figure className="relative pb-6 pr-4 sm:pb-8 sm:pr-7">
            <div
              aria-hidden="true"
              className="absolute bottom-0 right-0 top-10 w-[46%] bg-[color:var(--color-tan)]"
            />
            <MediaFrame
              src="/images/products/ai-career-operating-system/governed-ai-workflow-career-evidence.png"
              alt="Diagram showing a governed AI workflow from approved career evidence to portfolio proof, claim-to-evidence retrieval, role-aware tailoring, specialized reviews, and a human-approved artifact."
              fallbackTitle="Governed AI workflow for career evidence"
              sizes="(min-width: 1024px) 59vw, 100vw"
              className="aspect-[1693/929] border border-white/16 bg-white"
              imageClassName="object-contain transition-transform duration-700 hover:scale-[1.012]"
              priority
              expandable
              expandLabel="Expand governed AI workflow diagram"
            />
          </figure>
        </MotionReveal>
      </Container>
    </section>
  );
}
