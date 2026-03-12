import clsx from "clsx";
import { ExternalLink, Quote } from "lucide-react";
import type { SocialProofSnippet as SocialProofSnippetType } from "@/data/socialProof";

type Props = {
  item: SocialProofSnippetType;
  className?: string;
  compact?: boolean;
  showSourceLink?: boolean;
};

const SocialProofSnippet = ({
  item,
  className,
  compact = false,
  showSourceLink = false,
}: Props): JSX.Element => {
  const footerText = compact ? item.title : `${item.title} • ${item.roleLabel}`;

  return (
    <article
      className={clsx(
        "rounded-2xl border border-brand-teal/12 bg-white/92 shadow-sm",
        compact ? "p-4" : "p-5",
        className,
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-teal/65">
        {item.label}
      </p>
      <div className={clsx("flex gap-3", compact ? "mt-3" : "mt-4")}>
        <Quote
          className="mt-1 h-4 w-4 shrink-0 text-brand-teal/70"
          aria-hidden="true"
        />
        <div className="space-y-2">
          <p className="text-sm font-semibold leading-relaxed text-brand-teal">
            {item.mode === "paraphrase" ? item.quote : `“${item.quote}”`}
          </p>
          <p className="text-sm leading-relaxed text-brand-slate/78">
            {item.detail}
          </p>
        </div>
      </div>
      <footer
        className={clsx(
          "mt-4 flex items-start justify-between gap-3 border-t border-brand-teal/10 pt-3",
          compact && "mt-3 pt-2.5",
        )}
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-brand-teal">{item.author}</p>
          <p className="text-xs text-brand-slate/72">{footerText}</p>
        </div>
        {showSourceLink && item.profileUrl ? (
          <a
            href={item.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-teal/80 transition hover:text-brand-teal focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label={`View ${item.author}'s recommendation on LinkedIn`}
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            LinkedIn
          </a>
        ) : null}
      </footer>
    </article>
  );
};

export default SocialProofSnippet;
