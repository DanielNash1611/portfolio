import { UNIFIED_IMPACT_METRICS } from "@/data/impact";
import { MetricCard } from "@/components/MetricCard";
import { MetricPill } from "@/components/MetricPill";

export default function ImpactAtScale() {
  return (
    <section
      aria-labelledby="impact-heading"
      className="bg-[var(--impact-bg,theme(colors.slate.50))]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              id="impact-heading"
              className="text-3xl md:text-4xl font-semibold text-slate-800"
            >
              Selected impact <span className="text-slate-500">(approved)</span>
            </h2>
            <p className="mt-2 max-w-3xl text-slate-600">
              Explicit proof points across commerce, service operations,
              workflow modernization, and AI adoption. No rolled-up totals, just
              the outcomes that matter most in a hiring conversation.
            </p>
          </div>
          <MetricPill
            label="Recruiter-friendly proof"
            tooltip="Only includes approved or clearly validated outcomes already supported in case-study content. Qualitative wins and in-progress work are described separately."
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {UNIFIED_IMPACT_METRICS.map((m) => (
            <MetricCard
              key={m.id}
              category={m.category}
              value={m.value}
              support={m.support}
              intent={m.intent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
