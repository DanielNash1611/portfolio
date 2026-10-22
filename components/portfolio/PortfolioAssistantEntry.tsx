"use client";
import { ArrowRight, Compass, MessageSquare } from "lucide-react";
import { usePortfolioAssistant } from "./PortfolioAssistantProvider";

export default function PortfolioAssistantEntry({
  lens = false,
  title,
  id,
}: {
  lens?: boolean;
  title?: string;
  id?: string;
}) {
  const assistant = usePortfolioAssistant();
  if (!assistant?.enabled) return null;
  return lens ? (
    <div className="flex flex-col justify-between gap-5 border-y border-[color:var(--color-teal)]/20 py-6 sm:flex-row sm:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-teal)]">
          Find your way into the work
        </p>
        <p className="mt-2 text-sm text-[color:var(--color-slate)]/70">
          Explore a role, follow an interest, or ask a question as you browse.
        </p>
      </div>
      <button
        type="button"
        className="inline-flex min-h-11 shrink-0 items-center gap-3 self-start bg-[color:var(--color-teal)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-85"
        onClick={() => assistant.open(true)}
      >
        <Compass size={17} aria-hidden="true" />
        Explore with AI
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
  ) : (
    <button
      id={id}
      type="button"
      onClick={() => assistant.open()}
      className="inline-flex min-h-11 items-center gap-2 border-b border-[color:var(--color-teal)]/25 py-2 text-sm font-semibold text-[color:var(--color-teal)] transition hover:border-[color:var(--color-teal)]"
      aria-label={title ? `Ask about ${title}` : "Ask about this page"}
    >
      <MessageSquare size={15} aria-hidden="true" />
      Ask about this page
      <ArrowRight size={14} aria-hidden="true" />
    </button>
  );
}
