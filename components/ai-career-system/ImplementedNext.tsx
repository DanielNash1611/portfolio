import { Check, CircleDashed } from "lucide-react";
import { productEntries } from "@/content/portfolio";

const deploymentStory = productEntries
  .find((entry) => entry.slug === "ai-career-operating-system")
  ?.buildStory?.find((item) =>
    item.startsWith("Separated large portfolio recordings"),
  );

const implemented = [
  "Authenticated API boundary",
  "Claim-to-Evidence local prototype",
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
}): React.JSX.Element {
  return (
    <div className="space-y-6">
      <h3 className="font-serif text-2xl font-medium tracking-[-0.025em] text-[color:var(--color-slate)] md:text-3xl">
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

export default function ImplementedNext(): React.JSX.Element {
  return (
    <section
      className="space-y-10 border-y border-[color:var(--color-slate)]/16 py-10 md:py-14"
      aria-labelledby="implemented-next-heading"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(260px,0.74fr)_minmax(0,1.26fr)] lg:gap-16">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
            Capability boundary
          </p>
          <h2
            id="implemented-next-heading"
            className="mt-5 max-w-[11ch] text-balance font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] text-[color:var(--color-slate)] md:text-6xl"
          >
            What is real. What gets stronger next.
          </h2>
        </div>
        <p className="max-w-2xl self-end text-pretty text-base leading-7 text-[color:var(--color-slate)]/68 md:text-lg md:leading-8">
          The credible product story includes its limits. Current capabilities
          are visible on the left; the investments required for stronger
          reliability and measurement stay visible on the right.
        </p>
      </div>

      <div className="grid border-t border-[color:var(--color-slate)]/16 md:grid-cols-2 md:divide-x md:divide-[color:var(--color-slate)]/16">
        <div className="py-8 md:pr-10">
          <Column title="Implemented" items={implemented} complete />
        </div>
        <div className="border-t border-[color:var(--color-slate)]/16 py-8 md:border-t-0 md:pl-10">
          <Column
            title="Needs implementation or instrumentation"
            items={next}
            complete={false}
          />
        </div>
      </div>

      <div className="border-t border-[color:var(--color-slate)]/16 pt-6 text-sm leading-6 text-[color:var(--color-slate)]/70">
        <h3 className="font-semibold text-[color:var(--color-slate)]">
          Private local workflow
        </h3>
        <p className="mt-2 max-w-3xl">
          Added a private local application profile with reviewed facts, source
          references, confirmation dates, and employer-specific answers.
          Implemented locally in ResumeCustomizer on October 8, 2026; Daniel
          directed requirements and reviewed facts, with Codex assisting
          implementation. The profile remains private and local.
        </p>
        <p className="mt-2 max-w-3xl">
          No measured time savings, hiring outcomes, external adoption,
          application-quality gains, or semantic AI-quality gains are established
          for this profile.
        </p>
      </div>

      <p className="max-w-3xl text-sm leading-6 text-[color:var(--color-slate)]/70">
        This release candidate uses canonical portfolio pages. Remote career
        evidence stays disabled until the separate evidence-search endpoint is
        reviewed and shipped; the selected ResumeCustomizer branch supports the
        existing resume-job contract. The local retrieval prototype does not
        establish a launched public integration.
      </p>

      {deploymentStory ? (
        <div className="space-y-3 border-t border-[color:var(--color-slate)]/16 pt-8">
          <h3 className="font-serif text-2xl font-medium tracking-[-0.025em] text-[color:var(--color-slate)]">
            Deployment media
          </h3>
          <p className="max-w-3xl text-sm leading-6 text-[color:var(--color-slate)]/70">
            {deploymentStory}
          </p>
          <a
            href="https://github.com/DanielNash1611/portfolio/pull/11"
            className="inline-block text-sm font-bold text-[color:var(--color-teal)] underline underline-offset-4"
          >
            Review the media migration evidence
          </a>
        </div>
      ) : null}
    </section>
  );
}
