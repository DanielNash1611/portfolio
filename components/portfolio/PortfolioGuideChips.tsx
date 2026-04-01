"use client";

import clsx from "clsx";
import type { GuideTone } from "@/lib/portfolio-guide/types";

type PortfolioGuideChipsProps = {
  chips: string[];
  onSelect: (chip: string) => void;
  disabled?: boolean;
  tone?: GuideTone;
};

export default function PortfolioGuideChips({
  chips,
  onSelect,
  disabled = false,
  tone = "site",
}: PortfolioGuideChipsProps): JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(chip)}
          className={clsx(
            "inline-flex items-center rounded-full border px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
            tone === "site"
              ? "border-[color:var(--color-teal)]/12 bg-[color:var(--color-background)]/88 text-[color:var(--color-teal)] hover:bg-white focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-[color:var(--color-cream)]"
              : "border-brand-teal/15 bg-brand-teal/5 text-brand-teal hover:bg-brand-teal/10 focus-visible:ring-brand-orange focus-visible:ring-offset-white",
          )}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
