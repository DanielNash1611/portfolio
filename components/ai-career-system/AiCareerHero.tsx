import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const actionClassName =
  "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]";

export default function AiCareerHero(): JSX.Element {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-black/6 bg-white/86 px-6 py-8 shadow-[0_30px_80px_rgba(58,61,64,0.1)] md:px-8 md:py-10 lg:px-10 lg:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(44,79,82,0.05),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(209,122,95,0.05),_transparent_38%)]"
      />
      <div className="relative max-w-5xl space-y-8">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-orange)]">
            Governed AI product workflow
          </p>
          <h1 className="max-w-[13ch] text-balance text-5xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-6xl">
            AI Career Operating System
          </h1>
          <p className="max-w-3xl text-pretty text-2xl font-semibold leading-9 text-[color:var(--color-slate)] md:text-3xl md:leading-10">
            A governed AI workflow for turning approved career evidence into
            recruiter-ready artifacts.
          </p>
          <p className="max-w-4xl text-pretty text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg md:leading-8">
            The system connects portfolio proof, source-audited evidence
            retrieval, role-aware resume generation, authenticated APIs, evals,
            and human review, showing how AI can improve high-stakes knowledge
            work without hiding claim boundaries.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="#portfolio-guide-ai-career-operating-system"
            className={`${actionClassName} border-[color:var(--color-teal)] bg-[color:var(--color-teal)] text-[color:var(--color-cream)]`}
          >
            Ask the Portfolio Guide
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/resume/generate"
            className={`${actionClassName} border-[color:var(--color-teal)]/16 bg-white text-[color:var(--color-teal)]`}
          >
            Generate a role-specific resume
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <p className="max-w-2xl border-l-2 border-[color:var(--color-orange)]/45 pl-4 text-sm leading-6 text-[color:var(--color-slate)]/64">
          Personal operating context with authenticated boundaries,
          source-audited retrieval, eval-backed grounding, and human approval.
          No external-adoption claim.
        </p>
      </div>
    </section>
  );
}
