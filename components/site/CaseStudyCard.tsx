import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { WorkEntry } from "@/content/portfolio";
import CardMetricGrid from "@/components/site/CardMetricGrid";
import MediaFrame from "@/components/site/MediaFrame";

type CaseStudyCardProps = {
  entry: WorkEntry;
};

export default function CaseStudyCard({
  entry,
}: CaseStudyCardProps): JSX.Element {
  return (
    <article className="group flex h-full min-w-0 flex-col border-t border-[color:var(--color-slate)]/20 pt-5">
      <MediaFrame
        src={entry.heroImage}
        alt={entry.heroImageAlt}
        fallbackTitle={entry.title}
        sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 100vw"
        className="aspect-[16/10] border border-[color:var(--color-slate)]/16 bg-[color:var(--color-background-soft)]"
        imageClassName="transition duration-500 group-hover:scale-[1.02]"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-5 py-5">
        <div className="min-w-0 space-y-4">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <span className="clamp-2 inline-flex min-h-[2.25rem] max-w-full items-center border-l-2 border-[color:var(--color-orange)] pl-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/72">
              {entry.role}
            </span>
          </div>
          <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1 text-sm text-[color:var(--color-slate)]/58">
            <span className="whitespace-nowrap">{entry.company}</span>
            <span
              aria-hidden="true"
              className="text-[color:var(--color-orange)]/45"
            >
              •
            </span>
            <span className="whitespace-nowrap">{entry.timeframe}</span>
          </div>
          <h3 className="clamp-2 min-h-[3.6rem] font-serif text-3xl font-medium leading-[1.05] tracking-[-0.035em] text-[color:var(--color-slate)]">
            {entry.title}
          </h3>
        </div>

        <CardMetricGrid metrics={entry.featuredMetrics} />

        <p className="clamp-3 max-w-[34ch] text-sm leading-6 text-[color:var(--color-slate)]/70">
          {entry.description}
        </p>

        <div className="mt-auto">
          <Link
            href={entry.href}
            className="inline-flex w-fit items-center gap-2 border-b border-[color:var(--color-teal)] pb-1 text-sm font-bold text-[color:var(--color-teal)] transition hover:border-[color:var(--color-orange)] hover:text-[color:var(--color-orange)]"
          >
            Read case study
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
