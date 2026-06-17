import MediaFrame from "@/components/site/MediaFrame";

const reviewAgents = [
  {
    name: "Recruiter Screen",
    pass: "Baseline + final",
    owns: "Top-third fit and supported JD keyword coverage.",
    catches:
      "Buried qualifications, weak skim-read clarity, and exact terms that are supported but missing.",
  },
  {
    name: "Hiring Manager",
    pass: "Baseline + final",
    owns: "Role-specific proof, seniority calibration, and likely hiring questions.",
    catches:
      "True gaps, adjacent evidence that needs a safe bridge, and strong proof the draft failed to surface.",
  },
  {
    name: "Career Coach",
    pass: "Baseline + final",
    owns: "AI product leadership positioning and story coherence.",
    catches:
      "Stale positioning, credibility risks, and language that undersells or overstates supported experience.",
  },
  {
    name: "Source Auditor",
    pass: "Final",
    owns: "Exact claim verification against approved or current-run evidence.",
    catches:
      "Missing sources, contradictions, overclaims, credential inflation, and supported claims weakened by over-hedging.",
  },
  {
    name: "ATS Readability",
    pass: "Final",
    owns: "Parseability, density, section clarity, and document hygiene.",
    catches:
      "Template leakage, unusual characters, dense bullets, ambiguous labels, and page length padded with filler.",
  },
  {
    name: "Positioning & Bridge Strategist",
    pass: "Baseline + final",
    owns: "Candidate archetype, bridge classification, and the highest-leverage positioning change.",
    catches:
      "Off-archetype framing, unsafe domain leaps, underplayed proof, and bridges that need evidence instead of invention.",
  },
];

const signals = [
  {
    label: "Portfolio Guide",
    value: "31 cases",
    detail: "Authored evaluation inventory",
  },
  {
    label: "Resume review",
    value: "6 agents",
    detail: "Configured advisory perspectives",
  },
  {
    label: "Role strategy",
    value: "3 lanes",
    detail: "Configured positioning lanes",
  },
];

export default function EvalEvidence(): JSX.Element {
  return (
    <section className="space-y-8" aria-labelledby="eval-evidence-heading">
      <div className="max-w-3xl space-y-4">
        <h2
          id="eval-evidence-heading"
          className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-4xl"
        >
          Evals define quality before they measure it
        </h2>
        <p className="text-pretty text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
          In a stored 12-case Portfolio Guide eval set, grounding and
          source-separation changes improved acceptable responses from 5/12 to
          11/12. This is a historical comparison from comparable runs, not a
          current full-suite quality claim.
        </p>
      </div>

      <MediaFrame
        src="/images/products/ai-career-operating-system/portfolio-guide-grounding-improvement.png"
        alt="Evaluation card showing Portfolio Guide grounding improvement from 5 out of 12 acceptable responses to 11 out of 12 in a historical comparable run."
        fallbackTitle="Portfolio Guide grounding improvement"
        sizes="(min-width: 1280px) 1100px, 94vw"
        className="aspect-[3/2] rounded-[1.5rem] border border-black/6 bg-white shadow-[0_24px_60px_rgba(58,61,64,0.08)]"
        imageClassName="object-contain"
        expandable
        expandLabel="Expand Portfolio Guide grounding evaluation"
      />

      <article className="space-y-8 rounded-[2rem] border border-[color:var(--color-teal)]/9 bg-[color:var(--color-background)]/88 p-6 shadow-[0_20px_50px_rgba(44,79,82,0.06)] md:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-end">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-orange)]">
              Six configured reviewers
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-3xl">
              Different agents own different failure modes
            </h3>
          </div>
          <p className="text-sm leading-6 text-[color:var(--color-slate)]/68 md:text-base md:leading-7">
            The baseline-template pass uses four strategic reviewers before
            drafting. The final-resume pass runs all six against the completed
            content and rendering evidence. Their findings are advisory;
            structural checks can block output, and Daniel retains final
            approval.
          </p>
        </div>

        <MediaFrame
          src="/images/products/ai-career-operating-system/six-advisory-review-agents.png"
          alt="Infographic showing six advisory resume review agents: Recruiter Screen, Hiring Manager, Career Coach, Source Auditor, ATS Readability, and Positioning and Bridge Strategist, followed by structured findings, scores, issue severity, source status, and human approval."
          fallbackTitle="Six advisory review agents"
          sizes="(min-width: 1280px) 1040px, 94vw"
          className="aspect-[3/2] rounded-[1.5rem] border border-black/6 bg-white shadow-[0_24px_60px_rgba(58,61,64,0.08)]"
          imageClassName="object-contain"
          expandable
          expandLabel="Expand six advisory review agents diagram"
        />

        <ol className="grid gap-x-8 md:grid-cols-2">
          {reviewAgents.map((agent, index) => (
            <li
              key={agent.name}
              className="border-t border-[color:var(--color-teal)]/12 py-5"
            >
              <div className="flex items-start gap-4">
                <span className="mt-1 text-xs font-semibold text-[color:var(--color-orange)]">
                  0{index + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-[color:var(--color-slate)]">
                      {agent.name}
                    </h4>
                    <span className="rounded-full border border-[color:var(--color-teal)]/12 bg-white/70 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-teal)]/72">
                      {agent.pass}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium leading-6 text-[color:var(--color-slate)]/82">
                    {agent.owns}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--color-slate)]/62">
                    {agent.catches}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="grid gap-4 border-t border-[color:var(--color-teal)]/10 pt-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/68">
              Structured output
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/66">
              Findings, 1–5 scores, issue severity, source status, and
              recommendations labeled source-backed, needs-source, or reject.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/68">
              Credibility boundary
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/66">
              Review artifacts expose tradeoffs and gaps. They do not prove
              universal uplift or replace final human judgment.
            </p>
          </div>
        </div>
      </article>

      <div className="grid gap-4 md:grid-cols-3">
        {signals.map((signal) => (
          <article
            key={signal.label}
            className="border-t-2 border-[color:var(--color-teal)]/22 pt-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-teal)]/68">
              {signal.label}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-[color:var(--color-slate)]">
              {signal.value}
            </p>
            <p className="mt-2 text-sm text-[color:var(--color-slate)]/62">
              {signal.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
