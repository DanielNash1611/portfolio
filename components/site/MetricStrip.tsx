import type { Metric } from "@/content/portfolio";

type MetricStripProps = {
  metrics: Metric[];
  variant?: "default" | "compact";
};

export default function MetricStrip({
  metrics,
  variant = "default",
}: MetricStripProps): JSX.Element | null {
  if (!metrics.length) {
    return null;
  }

  if (variant === "compact") {
    return (
      <section className="grid border-l border-t border-[color:var(--color-slate)]/18 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={`${metric.label}-${metric.value}`}
            className="flex h-full flex-col border-b border-r border-[color:var(--color-slate)]/18 px-5 py-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/68">
              {metric.label}
            </p>
            <p className="metric-value mt-3 font-serif text-3xl tracking-[-0.04em] text-[color:var(--color-slate)]">
              {metric.value}
            </p>
            {metric.detail ? (
              <p className="clamp-2 mt-2 text-sm font-medium text-[color:var(--color-slate)]/66">
                {metric.detail}
              </p>
            ) : null}
          </article>
        ))}
      </section>
    );
  }

  return (
    <section className="grid border-l border-t border-[color:var(--color-slate)]/18 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article
          key={`${metric.label}-${metric.value}`}
          className="flex h-full flex-col border-b border-r border-[color:var(--color-slate)]/18 px-5 py-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/68">
            {metric.label}
          </p>
          <h3 className="metric-value mt-3 font-serif text-3xl font-medium tracking-[-0.04em] text-[color:var(--color-slate)]">
            {metric.value}
          </h3>
          {metric.detail ? (
            <p className="clamp-2 mt-3 text-sm leading-6 text-[color:var(--color-slate)]/68">
              {metric.detail}
            </p>
          ) : null}
        </article>
      ))}
    </section>
  );
}
