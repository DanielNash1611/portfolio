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
    value: "33 cases",
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
    <section className="space-y-10" aria-labelledby="eval-evidence-heading">
      <div className="grid gap-6 lg:grid-cols-[minmax(260px,0.74fr)_minmax(0,1.26fr)] lg:gap-16">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
            Evaluation evidence
          </p>
          <h2
            id="eval-evidence-heading"
            className="mt-5 max-w-[11ch] text-balance font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] text-[color:var(--color-slate)] md:text-6xl"
          >
            Evals define quality before they measure it
          </h2>
        </div>
        <p className="max-w-2xl self-end text-pretty text-base leading-7 text-[color:var(--color-slate)]/68 md:text-lg md:leading-8">
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
        className="aspect-[3/2] border border-[color:var(--color-slate)]/14 bg-white"
        imageClassName="object-contain transition-transform duration-700 hover:scale-[1.012]"
        expandable
        expandLabel="Expand Portfolio Guide grounding evaluation"
      />

      <article className="space-y-9 border-y border-[color:var(--color-slate)]/16 py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-end">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
              Six configured reviewers
            </p>
            <h3 className="mt-5 max-w-[14ch] font-serif text-3xl font-medium leading-[1] tracking-[-0.035em] text-[color:var(--color-slate)] md:text-5xl">
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
          className="aspect-[3/2] border border-[color:var(--color-slate)]/14 bg-white"
          imageClassName="object-contain transition-transform duration-700 hover:scale-[1.012]"
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
                    <h4 className="font-serif text-lg font-medium text-[color:var(--color-slate)]">
                      {agent.name}
                    </h4>
                    <span className="border-l border-[color:var(--color-orange)]/40 pl-2.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[color:var(--color-teal)]/68">
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

      <div className="grid border-y border-[color:var(--color-slate)]/16 md:grid-cols-3 md:divide-x md:divide-[color:var(--color-slate)]/16">
        {signals.map((signal) => (
          <article
            key={signal.label}
            className="border-b border-[color:var(--color-slate)]/16 py-6 last:border-b-0 md:border-b-0 md:px-7 md:first:pl-0 md:last:pr-0"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/64">
              {signal.label}
            </p>
            <p className="mt-3 font-serif text-3xl font-medium tracking-[-0.03em] text-[color:var(--color-slate)]">
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
