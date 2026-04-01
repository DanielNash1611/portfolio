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
    <article className="flex h-full flex-col rounded-[1.75rem] border border-black/6 bg-white/84 p-5 shadow-[0_24px_60px_rgba(58,61,64,0.08)] md:p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-teal)]/68">
            {entry.eyebrow}
          </span>
          <span className="whitespace-nowrap rounded-full bg-[color:var(--color-cream)] px-3 py-1 text-xs font-medium text-[color:var(--color-slate)]/72">
            {entry.readTime}
          </span>
        </div>
        <h3 className="clamp-2 min-h-[3.6rem] text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
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
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--color-teal)]/16 bg-white px-5 py-3 text-sm font-semibold text-[color:var(--color-teal)] transition hover:border-[color:var(--color-teal)]/26 hover:bg-[color:var(--color-cream)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
        >
          Read essay
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
