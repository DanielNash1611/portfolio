import { Check, CircleDashed } from "lucide-react";

const implemented = [
  "Authenticated API boundary",
  "Claim-to-Evidence retrieval",
  "Nine-state job lifecycle",
  "Six specialized review perspectives",
  "Structural PDF validation",
];

const next = [
  "Durable queue and job store",
  "Shared evidence identifiers",
  "Joined recruiter funnel",
  "Versioned latency and failure metrics",
  "Hard gate or explicit override for rejected output",
];

function Column({
  title,
  items,
  complete,
}: {
  title: string;
  items: string[];
  complete: boolean;
}): JSX.Element {
  return (
    <div className="space-y-5">
      <h3 className="text-2xl font-semibold text-[color:var(--color-slate)]">
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 border-b border-[color:var(--color-teal)]/8 pb-3 text-sm leading-6 text-[color:var(--color-slate)]/70 last:border-0"
          >
            {complete ? (
              <Check
                className="mt-1 h-4 w-4 shrink-0 text-[color:var(--color-teal)]"
                aria-hidden="true"
              />
            ) : (
              <CircleDashed
                className="mt-1 h-4 w-4 shrink-0 text-[color:var(--color-orange)]"
                aria-hidden="true"
              />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ImplementedNext(): JSX.Element {
  return (
    <section
      className="space-y-8 rounded-[2rem] border border-[color:var(--color-teal)]/9 bg-[color:var(--color-background)]/88 px-6 py-8 shadow-[0_20px_50px_rgba(44,79,82,0.06)] md:px-8 md:py-10"
      aria-labelledby="implemented-next-heading"
    >
      <div className="max-w-3xl space-y-4">
        <h2
          id="implemented-next-heading"
          className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-4xl"
        >
          What is real. What gets stronger next.
        </h2>
        <p className="text-pretty text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
          The credible product story includes its limits. Current capabilities
          are visible on the left; the investments required for stronger
          reliability and measurement stay visible on the right.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <Column title="Implemented" items={implemented} complete />
        <Column
          title="Needs implementation or instrumentation"
          items={next}
          complete={false}
        />
      </div>
    </section>
  );
}
