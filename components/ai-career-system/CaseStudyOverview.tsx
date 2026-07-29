export default function CaseStudyOverview(): JSX.Element {
  return (
    <section
      className="border-y border-[color:var(--color-slate)]/16"
      aria-labelledby="why-this-matters-heading"
    >
      <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-[color:var(--color-slate)]/16">
        <article className="py-9 lg:pr-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
            Product problem
          </p>
          <h2
            id="why-this-matters-heading"
            className="mt-5 max-w-[10ch] text-balance font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] text-[color:var(--color-slate)] md:text-5xl"
          >
            Why this matters
          </h2>
          <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-[color:var(--color-slate)]/68 md:text-lg md:leading-8">
            Hiring teams often see polished claims without knowing what evidence
            supports them. This system separates authored proof, source-audited
            evidence, role-specific tailoring, AI-assisted critique, and final
            human approval so career materials can be stronger without becoming
            less trustworthy.
          </p>
        </article>

        <article className="border-t border-[color:var(--color-slate)]/16 py-9 lg:border-t-0 lg:pl-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
            Hands-on AI product leadership
          </p>
          <h2 className="mt-5 max-w-[11ch] text-balance font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] text-[color:var(--color-slate)] md:text-5xl">
            Daniel&apos;s responsibility
          </h2>
          <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-[color:var(--color-slate)]/68 md:text-lg md:leading-8">
            Daniel defined the product architecture, evidence boundaries,
            claim-safety rules, workflow stages, evaluation criteria, and
            portfolio positioning. He used AI-assisted development to build and
            iterate across the Portfolio Guide and ResumeCustomizer while
            preserving human review as the final approval layer.
          </p>
        </article>
      </div>
      <p className="border-t border-[color:var(--color-slate)]/16 py-5 text-sm leading-6 text-[color:var(--color-slate)]/58">
        Governance and guardrails stay active from approved evidence through the
        final human-approved artifact.
      </p>
    </section>
  );
}
