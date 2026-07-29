import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductEntry } from "@/content/portfolio";
import CardMetricGrid from "@/components/site/CardMetricGrid";
import MediaFrame from "@/components/site/MediaFrame";

type ProductCardProps = {
  entry: ProductEntry;
  priority?: boolean;
};

export default function ProductCard({
  entry,
  priority = false,
}: ProductCardProps): JSX.Element {
  return (
    <article className="group flex h-full min-w-0 flex-col border-t border-[color:var(--color-slate)]/20 pt-5">
      <MediaFrame
        src={entry.heroImage}
        alt={entry.heroImageAlt}
        fallbackTitle={entry.title}
        priority={priority}
        sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 100vw"
        className="aspect-[16/10] border border-[color:var(--color-slate)]/16 bg-[color:var(--color-background-soft)]"
        imageClassName="transition duration-500 group-hover:scale-[1.02]"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-5 py-5">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <span className="inline-flex whitespace-nowrap border-l-2 border-[color:var(--color-orange)] pl-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-orange)]">
            {entry.status}
          </span>
          <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/65">
            {entry.eyebrow}
          </span>
        </div>

        <div className="min-w-0 space-y-4">
          <h3 className="clamp-2 min-h-[3.6rem] font-serif text-3xl font-medium leading-[1.05] tracking-[-0.035em] text-[color:var(--color-slate)]">
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
            className="inline-flex w-fit items-center gap-2 border-b border-[color:var(--color-teal)] pb-1 text-sm font-bold text-[color:var(--color-teal)] transition hover:border-[color:var(--color-orange)] hover:text-[color:var(--color-orange)]"
          >
            View product
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
