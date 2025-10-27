import clsx from "clsx";

interface MetricCardProps {
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down";
  description: string;
}

const MetricCard = ({
  value,
  delta,
  deltaDirection = "up",
  description
}: MetricCardProps): JSX.Element => {
  return (
    <div className="flex h-full flex-col gap-3 rounded-3xl border border-brand-slate/10 bg-white/80 p-6 shadow-soft">
      <p className="text-3xl font-semibold text-brand-teal">{value}</p>
      {delta ? (
        <p
          className={clsx(
            "text-sm font-medium",
            deltaDirection === "up" ? "text-brand-teal" : "text-brand-orange"
          )}
        >
          {deltaDirection === "up" ? "▲" : "▼"} {delta}
        </p>
      ) : null}
      <p className="text-sm text-brand-slate/80">{description}</p>
    </div>
  );
};

export default MetricCard;
