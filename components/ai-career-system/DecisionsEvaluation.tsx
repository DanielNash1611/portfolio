import { decisionsEvaluation } from "@/content/projects/decisions-evaluation";

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
    </section>
  );
}
