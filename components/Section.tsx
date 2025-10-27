import type { ReactNode } from "react";
import clsx from "clsx";

interface SectionProps {
  title: string;
  kicker?: string;
  children: ReactNode;
  className?: string;
}

const Section = ({
  title,
  kicker,
  children,
  className
}: SectionProps): JSX.Element => {
  return (
    <section className={clsx("space-y-6 rounded-3xl border border-brand-slate/10 bg-white/80 p-10 shadow-soft", className)}>
      <div className="space-y-2">
        {kicker ? (
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal/70">
            {kicker}
          </span>
        ) : null}
        <h2 className="text-3xl font-semibold text-brand-teal">{title}</h2>
      </div>
      <div className="prose prose-lg max-w-none text-brand-slate prose-headings:font-serif prose-headings:text-brand-teal prose-strong:text-brand-teal/90">
        {children}
      </div>
    </section>
  );
};

export default Section;
