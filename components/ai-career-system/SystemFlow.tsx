import { ArrowRight } from "lucide-react";

const stages = [
  {
    title: "Portfolio proof",
    detail: "Authored, grounded pages",
  },
  {
    title: "Server API",
    detail: "Authenticated boundary",
  },
  {
    title: "Tailoring engine",
    detail: "Mapping, drafting, review",
  },
  {
    title: "Reviewed PDF",
    detail: "Validated, human-approved artifact",
  },
];

export default function SystemFlow(): JSX.Element {
  return (
    <div className="rounded-[1.8rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/86 p-5 shadow-[0_22px_60px_rgba(44,79,82,0.08)] md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-teal)]/68">
          Inspectable workflow
        </p>
        <span className="h-px flex-1 bg-[color:var(--color-teal)]/10" />
      </div>

      <ol className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
        {stages.map((stage, index) => (
          <li key={stage.title} className="contents">
            <article className="min-h-[138px] min-w-0 rounded-[1.35rem] border border-black/6 bg-white/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-orange)]">
                0{index + 1}
              </p>
              <h2 className="mt-4 text-base font-semibold leading-5 text-[color:var(--color-slate)]">
                {stage.title}
              </h2>
              <p className="mt-2 text-xs leading-5 text-[color:var(--color-slate)]/64">
                {stage.detail}
              </p>
            </article>
            {index < stages.length - 1 ? (
              <ArrowRight
                className="mx-auto h-5 w-5 rotate-90 text-[color:var(--color-orange)]/75 md:rotate-0"
                aria-hidden="true"
              />
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-5 rounded-[1.2rem] border border-dashed border-[color:var(--color-teal)]/16 px-4 py-3">
        <p className="text-sm font-semibold text-[color:var(--color-slate)]">
          Evidence and review traces
        </p>
        <p className="mt-1 text-sm leading-6 text-[color:var(--color-slate)]/62">
          Sources, checks, and decisions remain inspectable across the workflow.
        </p>
      </div>
    </div>
  );
}
