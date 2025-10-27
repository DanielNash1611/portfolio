import clsx from "clsx";
import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline";
};

const Badge = ({
  className,
  variant = "default",
  ...props
}: BadgeProps): JSX.Element => {
  const base =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide";
  const styles =
    variant === "default"
      ? "bg-brand-tan text-brand-teal border-brand-tan/40"
      : "bg-transparent text-brand-teal border-brand-teal/40";

  return <span className={clsx(base, styles, className)} {...props} />;
};

export default Badge;
