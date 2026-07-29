import { ArrowRight, Check } from "lucide-react";

const proofPoints = [
  "Authored page content stays primary",
  "Role context changes navigation, not facts",
  "Actions are separated from evidence",
];

const tailoringPoints = [
  "Three positioning lanes",
  "Unsupported requirements become true gaps",
  "Structural validation before PDF delivery",
];

const tailoringStages = [
  "Role-specific mapping",
  "Draft generation",
  "Six advisory reviewers",
  "Structural validation",
  "Human-approved artifact",
];

function PointList({ items }: { items: string[] }): JSX.Element {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm leading-6 text-[color:var(--color-slate)]/70"
        >
          <Check
            className="mt-1 h-4 w-4 shrink-0 text-[color:var(--color-teal)]"
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function ProductEngines(): JSX.Element {
  return (
    <section className="space-y-8" aria-labelledby="how-it-works-heading">
      <div className="max-w-3xl space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
          System mechanics
        </p>
        <h2
          id="how-it-works-heading"
          className="max-w-[11ch] text-balance font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] text-[color:var(--color-slate)] md:text-6xl"
        >
          How the system works
        </h2>
        <p className="text-pretty text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
          Approved evidence becomes portfolio proof, role-specific mapping, a
          generated draft, specialized review, and finally a human-approved
          artifact.
        </p>
      </div>

      <div className="grid border-y border-[color:var(--color-slate)]/16 lg:grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] lg:items-stretch">
        <article className="space-y-7 py-8 lg:pr-9">
          <div className="space-y-3">
            <p className="font-mono text-xs text-[color:var(--color-orange)]">
              01
            </p>
            <h3 className="font-serif text-3xl font-medium tracking-[-0.035em] text-[color:var(--color-slate)] md:text-4xl">
              Proof Engine
            </h3>
            <p className="text-sm leading-6 text-[color:var(--color-slate)]/66">
              Recruiter-facing evidence discovery with explicit source priority
              and claim boundaries.
            </p>
          </div>

          <div className="overflow-hidden border border-[color:var(--color-slate)]/16 bg-[color:var(--color-background)]/70">
            <div className="flex items-center gap-2 border-b border-black/6 bg-white/80 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-orange)]/55" />
              <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-tan)]/75" />
              <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-teal)]/45" />
            </div>
            <div className="space-y-5 p-5">
              <p className="font-medium leading-7 text-[color:var(--color-slate)]">
                What does this system prove about Daniel&apos;s AI product
                judgment?
              </p>
              {["Page evidence", "Ownership boundary", "Useful next step"].map(
                (label) => (
                  <div
                    key={label}
                    className="grid grid-cols-[130px_minmax(0,1fr)] gap-3 text-sm"
                  >
                    <span className="font-semibold text-[color:var(--color-teal)]">
                      {label}
                    </span>
                    <span className="h-px self-center bg-[color:var(--color-teal)]/18" />
                  </div>
                ),
              )}
            </div>
          </div>

          <PointList items={proofPoints} />
        </article>

        <div className="flex flex-col items-center justify-center gap-3 border-y border-[color:var(--color-slate)]/16 py-6 text-center lg:border-x lg:border-y-0">
          <ArrowRight
            className="h-6 w-6 rotate-90 text-[color:var(--color-orange)] lg:rotate-0"
            aria-hidden="true"
          />
          <p className="max-w-[140px] text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-teal)]/68">
            Server-to-server boundary
          </p>
        </div>

        <article className="space-y-7 py-8 lg:pl-9">
          <div className="space-y-3">
            <p className="font-mono text-xs text-[color:var(--color-orange)]">
              02
            </p>
            <h3 className="font-serif text-3xl font-medium tracking-[-0.035em] text-[color:var(--color-slate)] md:text-4xl">
              Tailoring Engine
            </h3>
            <p className="text-sm leading-6 text-[color:var(--color-slate)]/66">
              Role-aware evidence mapping, specialized critique, and validated
              document rendering through six configured advisory reviewers.
            </p>
          </div>

          <ol className="relative space-y-0">
            {tailoringStages.map((stage, index) => (
              <li
                key={stage}
                className="relative grid min-h-[58px] grid-cols-[38px_minmax(0,1fr)] items-start gap-3"
              >
                {index < tailoringStages.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-[18px] top-8 h-full w-px bg-[color:var(--color-teal)]/18"
                  />
                ) : null}
                <span className="relative z-10 inline-flex h-9 w-9 items-center justify-center border border-[color:var(--color-teal)]/20 bg-[color:var(--color-background)] text-xs font-semibold text-[color:var(--color-teal)]">
                  {index + 1}
                </span>
                <span className="pt-1.5 font-semibold text-[color:var(--color-slate)]">
                  {stage}
                </span>
              </li>
            ))}
          </ol>

          <PointList items={tailoringPoints} />
        </article>
      </div>

      <div className="border-y border-[color:var(--color-teal)]/10 py-7 text-center">
        <p className="mx-auto max-w-4xl text-balance font-serif text-2xl font-medium leading-9 tracking-[-0.02em] text-[color:var(--color-slate)] md:text-3xl">
          Models assist with mapping, drafting, and critique; Daniel remains
          responsible for what is approved and submitted.
        </p>
      </div>
    </section>
  );
}
