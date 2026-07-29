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
  default: "border-y border-[color:var(--color-slate)]/16",
  muted:
    "border-y border-[color:var(--color-slate)]/16 bg-[color:var(--color-background-soft)]/58",
  contrast:
    "border-y border-white/12 bg-[color:var(--color-slate)] text-[color:var(--color-cream)]",
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
        "space-y-8 px-5 py-8 md:px-7 md:py-10",
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
