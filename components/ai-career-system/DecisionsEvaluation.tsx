import {
  decisionsEvaluation,
  modelBakeoff,
} from "@/content/projects/decisions-evaluation";

export default function DecisionsEvaluation(): React.JSX.Element {
  return (
    <section
      className="space-y-8 border-t border-[color:var(--color-slate)]/16 pt-10"
      aria-labelledby="decisions-evaluation-heading"
    >
      <div className="max-w-3xl space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--color-teal)]">
          Evaluation journal
        </p>
        <h3
          id="decisions-evaluation-heading"
          className="font-serif text-3xl font-medium leading-tight tracking-[-0.025em] text-[color:var(--color-slate)] md:text-4xl"
        >
          {decisionsEvaluation.title}
        </h3>
        <p className="text-base leading-7 text-[color:var(--color-slate)]/75">
          {decisionsEvaluation.introduction}
        </p>
        <p className="text-sm font-semibold leading-6 text-[color:var(--color-slate)]/70">
          {decisionsEvaluation.status}
        </p>
      </div>
      <ol className="divide-y divide-[color:var(--color-slate)]/16 border-y border-[color:var(--color-slate)]/16">
        {decisionsEvaluation.stages.map((stage, index) => (
          <li
            key={stage.id}
            className="grid gap-4 py-7 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-10"
          >
            <div className="space-y-2">
              <p className="font-mono text-xs text-[color:var(--color-teal)]">
                0{index + 1} · {stage.date}
              </p>
              <h4 className="font-serif text-xl font-medium text-[color:var(--color-slate)]">
                {stage.label}
              </h4>
              <p className="text-sm font-bold text-[color:var(--color-slate)]">
                {stage.result}
              </p>
            </div>
            <div className="space-y-3 text-sm leading-6 text-[color:var(--color-slate)]/75">
              <p>{stage.method}</p>
              <p>
                <span className="font-semibold">Limit: </span>
                {stage.limit}
              </p>
              <p className="text-xs leading-5 text-[color:var(--color-slate)]/60">
                {stage.snapshot}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="max-w-3xl space-y-3 text-sm leading-6 text-[color:var(--color-slate)]/75">
        <p>{decisionsEvaluation.judgeDisclosure}</p>
        <p>{decisionsEvaluation.methodology}</p>
      </div>
      <section
        className="space-y-6 border-t border-[color:var(--color-slate)]/16 pt-10"
        aria-labelledby="model-bakeoff-heading"
      >
        <div className="max-w-3xl space-y-3 text-sm leading-6 text-[color:var(--color-slate)]/75">
          <p className="font-mono text-xs text-[color:var(--color-teal)]">
            {modelBakeoff.date}
          </p>
          <h4
            id="model-bakeoff-heading"
            className="font-serif text-2xl font-medium leading-tight text-[color:var(--color-slate)] md:text-3xl"
          >
            {modelBakeoff.title}
          </h4>
          <p>{modelBakeoff.introduction}</p>
          <p>{modelBakeoff.method}</p>
        </div>
        <div
          className="max-w-full overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Historical model comparison; scroll horizontally on small screens"
        >
          <table className="min-w-[42rem] w-full border-collapse text-left text-sm text-[color:var(--color-slate)]">
            <caption className="sr-only">
              Historical answer-model results before the final ownership
              guardrail repair
            </caption>
            <thead className="border-y border-[color:var(--color-slate)]/20 text-xs">
              <tr>
                {[
                  "Answer model",
                  "Trials",
                  "Deterministic",
                  "Source-aware judged",
                  "Median workflow",
                  "Helpfulness / 5",
                ].map((label) => (
                  <th
                    key={label}
                    scope="col"
                    className="py-3 pr-5 font-semibold"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-slate)]/16">
              {modelBakeoff.models.map((row) => (
                <tr key={row.model}>
                  <th
                    scope="row"
                    className="py-4 pr-5 font-mono text-xs font-medium"
                  >
                    {row.model}
                  </th>
                  <td className="pr-5">{row.trials}</td>
                  <td className="pr-5">{row.deterministic}</td>
                  <td className="pr-5">{row.judged}</td>
                  <td className="pr-5">{row.medianSeconds} s</td>
                  <td>{row.helpfulness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="max-w-3xl space-y-3 text-sm leading-6 text-[color:var(--color-slate)]/75">
          <p>{modelBakeoff.interpretation}</p>
          <p>{modelBakeoff.latencyLimit}</p>
          <p>{modelBakeoff.costLimit}</p>
          <p>{modelBakeoff.auditLimit}</p>
          <p>{modelBakeoff.selection}</p>
          <p className="text-xs leading-5 text-[color:var(--color-slate)]/60">
            {modelBakeoff.provenance}
          </p>
        </div>
      </section>
    </section>
  );
}
