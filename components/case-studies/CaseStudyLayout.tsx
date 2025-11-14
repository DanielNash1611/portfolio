import type { HTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

type CaseStudyLayoutProps = {
  hero: ReactNode;
  children: ReactNode;
  sidebar?: ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
};

export function CaseStudyLayout({
  hero,
  children,
  sidebar,
  backHref = "/work",
  backLabel = "Back to portfolio",
  className
}: CaseStudyLayoutProps): JSX.Element {
  return (
    <div className={clsx("container space-y-10 py-10 md:space-y-12 md:py-12", className)}>
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal transition hover:text-brand-teal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>
      ) : null}

      {hero}

      <div
        className={clsx(
          "grid gap-8 lg:gap-12",
          sidebar ? "lg:grid-cols-[minmax(0,1fr)_320px]" : "lg:grid-cols-1"
        )}
      >
        <div className="space-y-8 lg:space-y-10">{children}</div>
        {sidebar ? <aside className="space-y-6 lg:space-y-8">{sidebar}</aside> : null}
      </div>
    </div>
  );
}

type CaseStudySectionVariant = "default" | "muted" | "plain";

type CaseStudySectionProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  eyebrow?: string;
  lead?: string;
  children: ReactNode;
  variant?: CaseStudySectionVariant;
  contentClassName?: string;
};

export function CaseStudySection({
  title,
  eyebrow,
  lead,
  children,
  variant = "default",
  contentClassName,
  className,
  ...rest
}: CaseStudySectionProps): JSX.Element {
  const variants: Record<CaseStudySectionVariant, string> = {
    default: "surface-card bg-surface-default/95 p-8 md:p-10",
    muted: "surface-card border-border-soft bg-surface-subtle/90 p-8 md:p-10",
    plain: "space-y-4"
  };

  return (
    <section className={clsx("space-y-6", variants[variant], className)} {...rest}>
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-orange/80">
            {eyebrow}
          </p>
        ) : null}
        {title ? <h2 className="section-heading">{title}</h2> : null}
        {lead ? <p className="text-base text-text-muted md:text-lg">{lead}</p> : null}
      </div>
      <div className={clsx("space-y-4", contentClassName)}>{children}</div>
    </section>
  );
}

type CaseStudyMetaProps = {
  items: Array<{ label: string; value: string }>;
  title?: string;
};

export function CaseStudyMetaPanel({ items, title }: CaseStudyMetaProps): JSX.Element {
  if (!items.length) {
    return <></>;
  }

  return (
    <section className="surface-card border-border-soft bg-surface-subtle/90 p-6 shadow-subtle">
      {title ? (
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal/70">
          {title}
        </h3>
      ) : null}
      <dl className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal/60">
              {item.label}
            </dt>
            <dd className="text-sm text-text-primary">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

type CaseStudyHighlightProps = {
  label: string;
  value?: string;
  description?: string;
};

export function CaseStudyHighlight({
  label,
  value,
  description
}: CaseStudyHighlightProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-brand-teal/15 bg-brand-teal/5 p-5 shadow-subtle">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-teal/70">
        {label}
      </p>
      {value ? <p className="mt-3 text-2xl font-semibold text-brand-teal">{value}</p> : null}
      {description ? (
        <p className="mt-2 text-sm text-text-muted">{description}</p>
      ) : null}
    </div>
  );
}
