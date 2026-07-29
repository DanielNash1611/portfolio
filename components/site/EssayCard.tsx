import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ThinkingEntry } from "@/content/portfolio";

type EssayCardProps = {
  entry: ThinkingEntry;
};

export default function EssayCard({ entry }: EssayCardProps): JSX.Element {
  const cardTitle = entry.cardTitle ?? entry.title;
  const cardDescription = entry.cardDescription ?? entry.description;
  const keyIdeas = entry.keyIdeas ?? [];
  const hasKeyIdeas = keyIdeas.length > 0;

  return (
    <article className="flex h-full flex-col border-t border-[color:var(--color-slate)]/20 py-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-teal)]/68">
            {entry.eyebrow}
          </span>
          <span className="whitespace-nowrap border-l border-[color:var(--color-slate)]/18 pl-3 text-xs font-medium text-[color:var(--color-slate)]/62">
            {entry.readTime}
          </span>
        </div>
        <h3 className="clamp-2 min-h-[3.6rem] max-w-[19ch] font-serif text-3xl font-medium leading-[1.05] tracking-[-0.035em] text-[color:var(--color-slate)]">
          {cardTitle}
        </h3>
        <p
          className={
            hasKeyIdeas
              ? "clamp-3 text-sm leading-6 text-[color:var(--color-slate)]/70"
              : "max-w-[34rem] text-sm leading-6 text-[color:var(--color-slate)]/70"
          }
        >
          {cardDescription}
        </p>
      </div>

      {hasKeyIdeas ? (
        <ul className="mt-6 space-y-3 text-sm text-[color:var(--color-slate)]/72">
          {keyIdeas.map((idea) => (
            <li key={idea} className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--color-orange)]" />
              <span className="clamp-2">{idea}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className={hasKeyIdeas ? "mt-auto pt-6" : "mt-auto pt-8"}>
        <Link
          href={entry.href}
          className="inline-flex items-center gap-2 border-b border-[color:var(--color-teal)] pb-1 text-sm font-bold text-[color:var(--color-teal)] transition hover:border-[color:var(--color-orange)] hover:text-[color:var(--color-orange)]"
        >
          Read essay
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
