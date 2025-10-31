import { CircleHelp } from "lucide-react";
import Tooltip from "@/components/Tooltip";
import clsx from "clsx";

export type StatItem = {
  value: string;
  label: string;
  tooltip: string;
};

type StatsProps = {
  items?: StatItem[];
  className?: string;
};

const defaultStats: StatItem[] = [
  {
    value: "50% faster",
    label: "Checkout completion time reduction",
    tooltip:
      "Measured after redesign; median path-to-purchase time cut in half."
  },
  {
    value: "+3% conversion",
    label: "Net lift through experimentation",
    tooltip:
      "A/B tested across key flows; instrumentation via analytics."
  },
  {
    value: "$16M/yr impact",
    label: "Incremental annualized revenue influence",
    tooltip:
      "Projected from conversion lift at current traffic and AOV."
  }
];

const Stats = ({ items = defaultStats, className }: StatsProps): JSX.Element => {
  return (
    <div
      className={clsx(
        "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {items.map((item) => (
        <article
          key={item.label}
          className="group relative overflow-hidden rounded-3xl border border-[#2C4F52]/12 bg-white/90 p-6 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold text-[#2C4F52] sm:text-4xl">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-[#3A3D40]/80">{item.label}</p>
            </div>
            <Tooltip content={item.tooltip}>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2C4F52]/20 bg-white text-[#2C4F52] opacity-70 transition hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <span className="sr-only">More about {item.label}</span>
                <CircleHelp className="h-4 w-4" aria-hidden="true" />
              </button>
            </Tooltip>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Stats;
