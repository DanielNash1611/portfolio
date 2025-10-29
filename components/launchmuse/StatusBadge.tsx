import clsx from "clsx";

interface StatusBadgeProps {
  label: string;
  className?: string;
}

const StatusBadge = ({ label, className }: StatusBadgeProps): JSX.Element => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border border-brand-teal/30 bg-brand-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal",
        className
      )}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
