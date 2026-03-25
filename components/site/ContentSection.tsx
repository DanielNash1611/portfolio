import type { ReactNode } from "react";
import clsx from "clsx";
import SectionHeader from "@/components/site/SectionHeader";

type ContentSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  tone?: "default" | "muted" | "contrast" | "plain";
  className?: string;
};

const toneClasses: Record<NonNullable<ContentSectionProps["tone"]>, string> = {
  default:
    "rounded-[2rem] border border-black/6 bg-white/82 shadow-[0_24px_60px_rgba(58,61,64,0.08)]",
  muted:
    "rounded-[2rem] border border-[color:var(--color-teal)]/8 bg-[color:var(--color-background)]/88 shadow-[0_20px_50px_rgba(44,79,82,0.06)]",
  contrast:
    "rounded-[2rem] border border-white/10 bg-[color:var(--color-slate)] text-[color:var(--color-cream)] shadow-[0_24px_60px_rgba(58,61,64,0.18)]",
  plain: "",
};

export default function ContentSection({
  eyebrow,
  title,
  description,
  children,
  tone = "default",
  className,
}: ContentSectionProps): JSX.Element {
  return (
    <section
      className={clsx(
        "space-y-8 px-6 py-7 md:px-8 md:py-8",
        toneClasses[tone],
        tone === "plain" ? "px-0 py-0" : "",
        className,
      )}
    >
      {title ? (
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          invert={tone === "contrast"}
        />
      ) : null}
      <div className="space-y-5">{children}</div>
    </section>
  );
}
