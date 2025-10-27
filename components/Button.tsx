import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

const baseStyles =
  "inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-teal text-white shadow-soft hover:bg-brand-teal/90 focus-visible:ring-brand-orange",
  secondary:
    "bg-brand-cream text-brand-teal border border-brand-teal/20 hover:border-brand-teal/40 focus-visible:ring-brand-orange",
  ghost:
    "bg-transparent text-brand-slate hover:bg-brand-tan/40 focus-visible:ring-brand-orange"
};

type ButtonVariant = "primary" | "secondary" | "ghost";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  );
});

export default Button;
