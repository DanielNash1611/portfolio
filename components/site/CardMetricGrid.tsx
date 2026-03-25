import clsx from "clsx";
import type { Metric } from "@/content/portfolio";

type CardMetricGridProps = {
  metrics: Metric[];
  className?: string;
  itemClassName?: string;
  showDetail?: boolean;
};

export default function CardMetricGrid({
  metrics,
  className,
  itemClassName,
  showDetail = false,
}: CardMetricGridProps): JSX.Element | null {
  const items = metrics.slice(0, 3);

  if (!items.length) {
    return null;
  }

  return (
    <div className={clsx("grid grid-cols-2 gap-3", className)}>
      {items.map((metric, index) => {
        const isLastOddItem =
          items.length % 2 === 1 && index === items.length - 1;

        return (
          <article
            key={`${metric.label}-${metric.value}`}
            className={clsx(
              "flex min-w-0 min-h-[104px] flex-col rounded-[1.2rem] border border-[color:var(--color-teal)]/8 bg-[color:var(--color-background)]/88 px-4 py-4",
              isLastOddItem && items.length > 1 ? "col-span-2" : "",
              itemClassName,
            )}
          >
            <p className="clamp-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/68">
              {metric.label}
            </p>
            <p className="text-safe mt-2 font-semibold leading-tight tracking-tight text-[color:var(--color-slate)] [font-variant-numeric:tabular-nums] text-[1.05rem] sm:text-[1.1rem]">
              {metric.value}
            </p>
            {showDetail && metric.detail ? (
              <p className="clamp-2 mt-2 text-xs leading-5 text-[color:var(--color-slate)]/62">
                {metric.detail}
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
