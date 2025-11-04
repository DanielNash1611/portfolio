"use client";

export type MeasuredItem = { label: string; value: string; context?: string };

export default function MeasuredOutcomes({ items }: { items: MeasuredItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section aria-labelledby="measured-outcomes" className="mt-12">
      <h2 id="measured-outcomes" className="text-2xl font-semibold text-slate-800">
        Measured outcomes
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((m, idx) => (
          <div key={idx} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="text-xl font-semibold text-slate-900">
              <span className="mr-2">{m.value}</span>
              <span className="text-slate-600">{m.label}</span>
            </div>
            {m.context && <p className="mt-1 text-sm text-slate-600">{m.context}</p>}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Metrics shown are measured results tied to this case study; broader portfolio impact appears on the home page.
      </p>
    </section>
  );
}
