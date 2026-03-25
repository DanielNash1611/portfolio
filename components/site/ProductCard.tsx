import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductEntry } from "@/content/portfolio";
import CardMetricGrid from "@/components/site/CardMetricGrid";
import MediaFrame from "@/components/site/MediaFrame";

type ProductCardProps = {
  entry: ProductEntry;
};

export default function ProductCard({ entry }: ProductCardProps): JSX.Element {
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-black/6 bg-white/88 shadow-[0_24px_60px_rgba(58,61,64,0.09)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(58,61,64,0.12)]">
      <MediaFrame
        src={entry.heroImage}
        alt={entry.heroImageAlt}
        fallbackTitle={entry.title}
        sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 100vw"
        className="aspect-[16/10] border-b border-black/6 bg-[color:var(--color-cream)]/80"
        imageClassName="transition duration-500 group-hover:scale-[1.02]"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-5 p-5 md:p-6">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <span className="inline-flex whitespace-nowrap rounded-full border border-[color:var(--color-orange)]/12 bg-[color:var(--color-orange)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-orange)]/88">
            {entry.status}
          </span>
          <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/65">
            {entry.eyebrow}
          </span>
        </div>

        <div className="min-w-0 space-y-4">
          <h3 className="clamp-2 min-h-[3.6rem] text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
            {entry.title}
          </h3>
          <CardMetricGrid metrics={entry.featuredMetrics} />
          <p className="clamp-3 max-w-[34ch] text-sm leading-6 text-[color:var(--color-slate)]/70">
            {entry.description}
          </p>
        </div>

        <div className="mt-auto">
          <Link
            href={entry.href}
            className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-[color:var(--color-teal)] px-5 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-[color:var(--color-slate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
          >
            View product
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
