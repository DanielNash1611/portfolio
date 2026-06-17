import MediaFrame from "@/components/site/MediaFrame";

const workflowAlt =
  "Diagram showing a governed AI workflow from approved career evidence to portfolio proof, claim-to-evidence retrieval, role-aware tailoring, specialized reviews, and a human-approved artifact.";

export default function CaseStudyOverview(): JSX.Element {
  return (
    <section className="space-y-8" aria-labelledby="why-this-matters-heading">
      <div className="grid gap-8 lg:grid-cols-2">
        <article className="border-t-2 border-[color:var(--color-teal)]/22 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-orange)]">
            Product problem
          </p>
          <h2
            id="why-this-matters-heading"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-4xl"
          >
            Why this matters
          </h2>
          <p className="mt-4 text-pretty text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
            Hiring teams often see polished claims without knowing what evidence
            supports them. This system separates authored proof, source-audited
            evidence, role-specific tailoring, AI-assisted critique, and final
            human approval so career materials can be stronger without becoming
            less trustworthy.
          </p>
        </article>

        <article className="border-t-2 border-[color:var(--color-orange)]/28 pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-orange)]">
            Hands-on AI product leadership
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-4xl">
            Daniel&apos;s responsibility
          </h2>
          <p className="mt-4 text-pretty text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
            Daniel defined the product architecture, evidence boundaries,
            claim-safety rules, workflow stages, evaluation criteria, and
            portfolio positioning. He used AI-assisted development to build and
            iterate across the Portfolio Guide and ResumeCustomizer while
            preserving human review as the final approval layer.
          </p>
        </article>
      </div>

      <figure className="space-y-3">
        <MediaFrame
          src="/images/products/ai-career-operating-system/governed-ai-workflow-career-evidence.png"
          alt={workflowAlt}
          fallbackTitle="Governed AI workflow for career evidence"
          sizes="(min-width: 1280px) 1150px, 94vw"
          className="aspect-[1693/929] rounded-[1.5rem] border border-black/6 bg-white shadow-[0_24px_60px_rgba(58,61,64,0.08)]"
          imageClassName="object-contain"
          priority
          expandable
          expandLabel="Expand governed AI workflow diagram"
        />
        <figcaption className="text-sm leading-6 text-[color:var(--color-slate)]/58">
          Governance and guardrails stay active from approved evidence through
          the final human-approved artifact.
        </figcaption>
      </figure>
    </section>
  );
}
