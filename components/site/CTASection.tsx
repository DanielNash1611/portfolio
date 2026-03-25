import Link from "next/link";
import type { ActionLink } from "@/content/portfolio";

type CTASectionProps = {
  title: string;
  description: string;
  primaryAction: ActionLink;
  secondaryAction?: ActionLink;
};

function CTAAction({
  action,
  primary,
}: {
  action: ActionLink;
  primary: boolean;
}): JSX.Element {
  const className = primary
    ? "inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[color:var(--color-cream)] bg-[color:var(--color-cream)] px-5 py-3 text-sm font-semibold text-[color:var(--color-slate)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-slate)]"
    : "inline-flex items-center justify-center whitespace-nowrap rounded-full border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-slate)]";

  if (action.external) {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {action.label}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  );
}

export default function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
}: CTASectionProps): JSX.Element {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[color:var(--color-slate)] px-6 py-8 text-[color:var(--color-cream)] shadow-[0_30px_80px_rgba(58,61,64,0.18)] md:px-8 md:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(219,191,150,0.2),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(209,122,95,0.22),_transparent_42%)]"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-cream)]/68">
            Contact
          </p>
          <h2 className="max-w-[18ch] text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h2>
          <p className="max-w-2xl text-base leading-7 text-[color:var(--color-cream)]/78 md:text-lg">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <CTAAction action={primaryAction} primary />
          {secondaryAction ? (
            <CTAAction action={secondaryAction} primary={false} />
          ) : null}
        </div>
      </div>
    </section>
  );
}
