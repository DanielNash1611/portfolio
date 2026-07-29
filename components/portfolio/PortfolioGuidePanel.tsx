"use client";

import type { FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import clsx from "clsx";
import type {
  GuideConversationMessage,
  GuidePersistenceStatus,
  GuideTone,
} from "@/lib/portfolio-guide/types";

type PortfolioGuidePanelProps = {
  messages: GuideConversationMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: () => void;
  onFollowUp: (message: string) => void;
  onRetry: () => void;
  onNewConversation: () => void;
  onDeleteConversation: () => void;
  isLoading: boolean;
  isUnavailable: boolean;
  errorMessage: string | null;
  loadingLabel: string;
  persistenceStatus: GuidePersistenceStatus;
  persistenceWarning: string | null;
  isHydrating: boolean;
  tone?: GuideTone;
};

function handleTextareaKeyDown(
  event: KeyboardEvent<HTMLTextAreaElement>,
  onSubmit: () => void,
) {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    onSubmit();
  }
}

function getFollowUpActionHref(followUp: string): string | null {
  const normalized = followUp.trim().toLowerCase();

  if (
    normalized === "generate a resume for my role" ||
    normalized === "compare daniel to this job description"
  ) {
    return "/resume/generate";
  }

  if (normalized === "contact daniel") {
    return "/contact";
  }

  return null;
}

export default function PortfolioGuidePanel({
  messages,
  draft,
  onDraftChange,
  onSubmit,
  onFollowUp,
  onRetry,
  onNewConversation,
  onDeleteConversation,
  isLoading,
  isUnavailable,
  errorMessage,
  loadingLabel,
  persistenceStatus,
  persistenceWarning,
  isHydrating,
  tone = "site",
}: PortfolioGuidePanelProps): JSX.Element {
  const panelClassName =
    tone === "site"
      ? "rounded-[1.4rem] border border-[color:var(--color-teal)]/10 bg-white/84"
      : "rounded-[1.6rem] border border-brand-slate/10 bg-white/95 shadow-soft";

  const userMessageClassName =
    tone === "site"
      ? "ml-auto bg-[color:var(--color-teal)] text-[color:var(--color-cream)]"
      : "ml-auto bg-brand-teal text-white";

  const assistantMessageClassName =
    tone === "site"
      ? "bg-[color:var(--color-background)]/86 text-[color:var(--color-slate)]"
      : "bg-brand-teal/5 text-brand-slate";

  const statusClassName =
    tone === "site"
      ? "border-[color:var(--color-orange)]/20 bg-[color:var(--color-orange)]/8 text-[color:var(--color-slate)]"
      : "border-brand-orange/20 bg-brand-orange/10 text-brand-slate";

  const emptyStateClassName =
    tone === "site"
      ? "text-[color:var(--color-slate)]/68"
      : "text-brand-slate/72";

  const buttonClassName =
    tone === "site"
      ? "border-[color:var(--color-teal)] bg-[color:var(--color-teal)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-slate)] focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-[color:var(--color-cream)]"
      : "border-brand-teal bg-brand-teal text-white hover:bg-brand-teal/90 focus-visible:ring-brand-orange focus-visible:ring-offset-white";

  const fieldClassName =
    tone === "site"
      ? "border-[color:var(--color-teal)]/12 bg-[color:var(--color-background)]/72 text-[color:var(--color-slate)] placeholder:text-[color:var(--color-slate)]/42 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-[color:var(--color-cream)]"
      : "border-brand-slate/15 bg-white text-brand-slate placeholder:text-brand-slate/45 focus-visible:ring-brand-orange focus-visible:ring-offset-white";

  return (
    <div className={clsx("space-y-5 p-5 md:p-6", panelClassName)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-4">
        <p
          className={clsx(
            "text-xs leading-5",
            tone === "site"
              ? "text-[color:var(--color-slate)]/58"
              : "text-brand-slate/60",
          )}
        >
          {isHydrating
            ? "Restoring this browser's conversation..."
            : persistenceStatus === "durable"
              ? "Saved across this site for 90 days after your last question."
              : "Temporary conversation in this browser session."}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onNewConversation}
            disabled={isLoading}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50",
              tone === "site"
                ? "border-[color:var(--color-teal)]/14 bg-white text-[color:var(--color-teal)]"
                : "border-brand-teal/15 bg-white text-brand-teal",
            )}
          >
            New conversation
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                typeof window === "undefined" ||
                window.confirm("Delete this conversation and its saved history?")
              ) {
                onDeleteConversation();
              }
            }}
            disabled={isLoading || messages.length === 0}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-40",
              tone === "site"
                ? "border-[color:var(--color-orange)]/18 bg-white text-[color:var(--color-slate)]/72"
                : "border-brand-orange/20 bg-white text-brand-slate/72",
            )}
          >
            Delete
          </button>
        </div>
      </div>

      {persistenceWarning ? (
        <div className={clsx("rounded-xl border px-3 py-2 text-xs leading-5", statusClassName)}>
          {persistenceWarning}
        </div>
      ) : null}

      {messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                "max-w-[92%] rounded-[1.2rem] px-4 py-3 text-sm leading-6",
                message.role === "user"
                  ? userMessageClassName
                  : assistantMessageClassName,
              )}
            >
              {message.pageTitle ? (
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-55">
                  {message.pageTitle}
                </p>
              ) : null}
              <p className="whitespace-pre-line">{message.content}</p>

              {message.role === "assistant" && message.relatedPages?.length ? (
                <div className="mt-4 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">
                    Related work
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {message.relatedPages.map((page) => (
                      <Link
                        key={page.slug}
                        href={page.href}
                        className={clsx(
                          "inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                          tone === "site"
                            ? "border-[color:var(--color-teal)]/12 bg-white text-[color:var(--color-teal)] hover:bg-[color:var(--color-background)]"
                            : "border-brand-teal/15 bg-white text-brand-teal hover:bg-brand-teal/5",
                        )}
                      >
                        {page.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {message.role === "assistant" && message.suggestedFollowUps?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {message.suggestedFollowUps.map((followUp) => {
                    const actionHref = getFollowUpActionHref(followUp);
                    const className = clsx(
                      "inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                      tone === "site"
                        ? "border-[color:var(--color-teal)]/12 bg-white text-[color:var(--color-teal)] hover:bg-[color:var(--color-background)] focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-[color:var(--color-cream)]"
                        : "border-brand-teal/15 bg-white text-brand-teal hover:bg-brand-teal/5 focus-visible:ring-brand-orange focus-visible:ring-offset-white",
                    );

                    return actionHref ? (
                      <Link key={followUp} href={actionHref} className={className}>
                        {followUp}
                      </Link>
                    ) : (
                      <button
                        key={followUp}
                        type="button"
                        onClick={() => onFollowUp(followUp)}
                        className={className}
                      >
                        {followUp}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className={emptyStateClassName}>
          <p className="text-sm leading-6">
            Ask a specific question about this page. Answers stay
            grounded in page evidence and can point to one useful adjacent page
            when that adds clarity.
          </p>
        </div>
      )}

      {isLoading ? (
        <div
          className={clsx(
            "rounded-[1.2rem] border px-4 py-3 text-sm",
            tone === "site"
              ? "border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/72 text-[color:var(--color-slate)]/72"
              : "border-brand-teal/12 bg-brand-teal/5 text-brand-slate/72",
          )}
          role="status"
          aria-live="polite"
        >
          <div className="mb-3 flex gap-2">
            {[0, 1, 2].map((item) => (
              <span
                key={item}
                className={clsx(
                  "h-2.5 w-2.5 rounded-full animate-pulse",
                  tone === "site" ? "bg-[color:var(--color-teal)]/55" : "bg-brand-teal/55",
                )}
              />
            ))}
          </div>
          <p>{loadingLabel}</p>
        </div>
      ) : null}

      {errorMessage ? (
        <div
          className={clsx(
            "rounded-[1.2rem] border px-4 py-3 text-sm",
            statusClassName,
          )}
          role="status"
        >
          <p>{errorMessage}</p>
          {!isUnavailable ? (
            <button
              type="button"
              onClick={onRetry}
              className={clsx(
                "mt-3 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                tone === "site"
                  ? "border-[color:var(--color-teal)]/14 bg-white text-[color:var(--color-teal)] focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-[color:var(--color-cream)]"
                  : "border-brand-teal/15 bg-white text-brand-teal focus-visible:ring-brand-orange focus-visible:ring-offset-white",
              )}
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      <form
        className="space-y-3"
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label
          htmlFor="portfolio-guide-question"
          className={clsx(
            "block text-sm font-semibold",
            tone === "site" ? "text-[color:var(--color-slate)]" : "text-brand-teal",
          )}
        >
          Ask a question
        </label>
        <textarea
          id="portfolio-guide-question"
          name="portfolio-guide-question"
          rows={3}
          maxLength={4000}
          value={draft}
          disabled={isLoading || isUnavailable}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => handleTextareaKeyDown(event, onSubmit)}
          placeholder="e.g. What are the strongest signals on this page?"
          className={clsx(
            "w-full rounded-[1.2rem] border px-4 py-3 text-sm leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            fieldClassName,
          )}
        />
        <div className="flex items-center justify-between gap-3">
          <p
            className={clsx(
              "max-w-md text-xs leading-5",
              tone === "site"
                ? "text-[color:var(--color-slate)]/52"
                : "text-brand-slate/56",
            )}
          >
            Conversations are saved for 90 days to improve the guide and may be
            processed by OpenAI. Don&apos;t include sensitive information. Press
            Ctrl/Cmd + Enter to send. {draft.length.toLocaleString()}/4,000
          </p>
          <button
            type="submit"
            disabled={isLoading || isUnavailable || draft.trim().length === 0}
            className={clsx(
              "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
              buttonClassName,
            )}
          >
            Ask
          </button>
        </div>
      </form>
    </div>
  );
}
