import clsx from "clsx";
import { CircleHelp } from "lucide-react";
import Tooltip from "@/components/Tooltip";

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

const accentRings = [
  "ring-[#2C4F52]/30 hover:ring-[#2C4F52]/45",
  "ring-[#3A3D40]/20 hover:ring-[#3A3D40]/35",
  "ring-[#D17A5F]/30 hover:ring-[#D17A5F]/45"
] as const;

const iconAccents = [
  "border-[#2C4F52]/35 text-[#2C4F52]",
  "border-[#3A3D40]/30 text-[#3A3D40]",
  "border-[#D17A5F]/35 text-[#D17A5F]"
] as const;

const Stats = ({ items = defaultStats, className }: StatsProps): JSX.Element => {
  return (
    <div
      className={clsx(
        "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {items.map((item, index) => {
        const accentClass = accentRings[index % accentRings.length];
        const iconClass = iconAccents[index % iconAccents.length];

        return (
          <article
            key={item.label}
            className={clsx(
              "group relative overflow-hidden rounded-3xl bg-white/95 p-6 shadow-md ring-1 transition-transform duration-200 ease-out backdrop-blur-sm hover:-translate-y-1.5 hover:shadow-lg",
              accentClass
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold tracking-tight text-[#2C4F52] sm:text-4xl">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-[#3A3D40]/85">{item.label}</p>
              </div>
              <Tooltip content={item.tooltip}>
                <button
                  type="button"
                  className={clsx(
                    "inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 transition focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    iconClass
                  )}
                >
                  <span className="sr-only">
                    How “{item.value}” was measured: {item.label}
                  </span>
                  <CircleHelp className="h-4 w-4" aria-hidden="true" />
                </button>
              </Tooltip>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default Stats;
