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
    ? "inline-flex items-center justify-center whitespace-nowrap border border-[color:var(--color-cream)] bg-[color:var(--color-cream)] px-5 py-3 text-sm font-bold text-[color:var(--color-slate)] transition hover:bg-[#e6a286] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-slate)]"
    : "inline-flex items-center justify-center whitespace-nowrap border border-white/24 bg-transparent px-5 py-3 text-sm font-bold text-[color:var(--color-cream)] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-slate)]";

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
    <section className="relative overflow-hidden border-y border-white/12 bg-[color:var(--color-slate)] px-6 py-9 text-[color:var(--color-cream)] md:px-8 md:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-[linear-gradient(135deg,transparent_30%,rgba(219,96,72,0.2))]"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#e6a286]">
            Contact
          </p>
          <h2 className="max-w-[18ch] text-balance font-serif text-3xl font-medium leading-[1.02] tracking-[-0.04em] md:text-5xl">
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
