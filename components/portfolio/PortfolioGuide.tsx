"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import PortfolioGuideChips from "@/components/portfolio/PortfolioGuideChips";
import PortfolioGuidePanel from "@/components/portfolio/PortfolioGuidePanel";
import {
  DEFAULT_GUIDE_HELPER,
  DEFAULT_GUIDE_PROMPTS,
  DEFAULT_GUIDE_TITLE,
  GUIDE_UNAVAILABLE_MESSAGE,
  MAX_CONVERSATION_CONTEXT_MESSAGES,
} from "@/lib/portfolio-guide/constants";
import { getSessionAwarePrompt, inferInterestTags } from "@/lib/portfolio-guide/infer-tags";
import {
  appendSiteWideConversationMessages,
  createEmptyGuideSessionState,
  getSiteWideConversation,
  readGuideSessionState,
  recordPageVisit,
  recordPromptClick,
  recordQuestion,
  recordTagSignals,
  replaceSiteWideConversation,
  writeGuideSessionState,
} from "@/lib/portfolio-guide/session";
import type {
  GuideConversationMessage,
  GuideConversationSnapshot,
  GuidePersistenceStatus,
  GuideTone,
  PageContext,
  PortfolioContext,
  VisitorIntent,
} from "@/lib/portfolio-guide/types";

type PortfolioGuideProps = {
  pageContext: PageContext;
  portfolioContext: PortfolioContext;
  tone?: GuideTone;
};

type GuideStatus = "idle" | "loading" | "error" | "unavailable";

function createConversationMessage(
  role: "user" | "assistant",
  content: string,
  options?: Pick<
    GuideConversationMessage,
    "suggestedFollowUps" | "relatedPages" | "turnId" | "pageSlug" | "pageTitle"
  > & { id?: string },
): GuideConversationMessage {
  return {
    id: options?.id ?? `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
    suggestedFollowUps: options?.suggestedFollowUps,
    relatedPages: options?.relatedPages,
    turnId: options?.turnId,
    pageSlug: options?.pageSlug,
    pageTitle: options?.pageTitle,
  };
}

function createClientTurnId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `turn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

function uniquePrompts(prompts: Array<string | null | undefined>, limit = 6): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const prompt of prompts) {
    const value = prompt?.trim();
    if (!value || seen.has(value)) {
      continue;
    }

    seen.add(value);
    result.push(value);

    if (result.length >= limit) {
      break;
    }
  }

  return result;
}

export default function PortfolioGuide({
  pageContext,
  portfolioContext,
  tone = "site",
}: PortfolioGuideProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<GuideConversationMessage[]>([]);
  const [status, setStatus] = useState<GuideStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [lastClientTurnId, setLastClientTurnId] = useState<string>("");
  const [loadingLabel, setLoadingLabel] = useState("Grounding this answer in the page…");
  const [extraPrompt, setExtraPrompt] = useState<string | null>(null);
  const [visitorIntent, setVisitorIntent] = useState<VisitorIntent | null>(null);
  const [persistenceStatus, setPersistenceStatus] =
    useState<GuidePersistenceStatus>("disabled");
  const [persistenceWarning, setPersistenceWarning] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const initialTags = inferInterestTags({ pageContext });
    let nextState = writeGuideSessionState(
      recordTagSignals(recordPageVisit(readGuideSessionState(), pageContext.slug), initialTags),
    );
    const localMessages = getSiteWideConversation(nextState);
    setMessages(localMessages);
    setExtraPrompt(getSessionAwarePrompt(nextState, pageContext.slug));
    setVisitorIntent(nextState.visitorIntent ?? null);

    void fetch("/api/portfolio-copilot/conversation", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Conversation restore failed.");
        }
        return (await response.json()) as GuideConversationSnapshot & {
          persistenceWarning?: string;
        };
      })
      .then((snapshot) => {
        if (cancelled) {
          return;
        }
        setPersistenceStatus(snapshot.persistenceStatus);
        setPersistenceWarning(snapshot.persistenceWarning ?? null);
        if (snapshot.persistenceStatus === "durable") {
          nextState = writeGuideSessionState(
            replaceSiteWideConversation(
              {
                ...nextState,
                ...(snapshot.sessionSignals ?? {}),
              },
              snapshot.messages,
            ),
          );
          setMessages(snapshot.messages);
          setVisitorIntent(nextState.visitorIntent ?? null);
          setExtraPrompt(getSessionAwarePrompt(nextState, pageContext.slug));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPersistenceStatus("degraded");
          setPersistenceWarning(
            "Saved history is temporarily unavailable; this browser is keeping a temporary copy.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsHydrating(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [pageContext]);

  async function submitMessage(
    message: string,
    source: "chip" | "input" | "follow-up",
    existingClientTurnId?: string,
  ) {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || status === "loading" || status === "unavailable") {
      return;
    }

    setIsOpen(true);
    setStatus("loading");
    setErrorMessage(null);
    setLastMessage(trimmedMessage);
    const clientTurnId = existingClientTurnId ?? createClientTurnId();
    setLastClientTurnId(clientTurnId);
    setLoadingLabel(
      source === "input"
        ? visitorIntent
          ? "Grounding this answer in the current page and the role you entered…"
          : "Grounding this answer in the current page and your recent browsing…"
        : visitorIntent
          ? "Pulling the strongest grounded signal for this role from the page…"
          : "Pulling the strongest grounded signal from this page…",
    );

    let nextState = readGuideSessionState();
    nextState = recordQuestion(nextState, trimmedMessage);
    if (source !== "input") {
      nextState = recordPromptClick(nextState, trimmedMessage);
    }
    nextState = recordTagSignals(
      nextState,
      inferInterestTags({
        pageContext,
        text: trimmedMessage,
      }),
    );
    nextState = writeGuideSessionState(nextState);
    setExtraPrompt(getSessionAwarePrompt(nextState, pageContext.slug));
    setVisitorIntent(nextState.visitorIntent ?? null);

    try {
      const response = await fetch("/api/portfolio-copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientTurnId,
          pageSlug: pageContext.slug,
          message: trimmedMessage,
          source,
          sessionSignals: {
            visitedPages: nextState.visitedPages,
            clickedPrompts: nextState.clickedPrompts,
            askedQuestions: nextState.askedQuestions,
            inferredInterestTags: nextState.inferredInterestTags,
            visitorIntent: nextState.visitorIntent,
            recommendedPath: nextState.recommendedPath,
            lastVisitedAt: nextState.lastVisitedAt,
          },
          fallbackConversation: messages
            .slice(-MAX_CONVERSATION_CONTEXT_MESSAGES)
            .map((entry) => ({
              role: entry.role,
              content: entry.content,
            })),
        }),
      });

      const data = (await response.json()) as {
        answer?: string;
        suggestedFollowUps?: string[];
        relatedPages?: GuideConversationMessage["relatedPages"];
        inferredInterestTags?: PageContext["interestTags"];
        error?: string;
        code?: string;
        turnId?: string;
        persistenceStatus?: GuidePersistenceStatus;
        persistenceWarning?: string;
      };

      if (!response.ok) {
        if (data.code === "missing_api_key") {
          setStatus("unavailable");
          setErrorMessage(
            typeof data.error === "string"
              ? data.error
              : GUIDE_UNAVAILABLE_MESSAGE,
          );
          return;
        }

        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Portfolio Guide could not answer right now.",
        );
      }

      if (typeof data.answer !== "string" || data.answer.trim().length === 0) {
        throw new Error("Portfolio Guide returned an empty answer.");
      }

      if (data.persistenceStatus) {
        setPersistenceStatus(data.persistenceStatus);
      }
      setPersistenceWarning(data.persistenceWarning ?? null);

      const updatedState = writeGuideSessionState(
        appendSiteWideConversationMessages(
          recordTagSignals(
            nextState,
            (data.inferredInterestTags ?? []).filter(Boolean) as NonNullable<
              PageContext["interestTags"]
            >,
          ),
          [
            createConversationMessage("user", trimmedMessage, {
              id: data.turnId ? `${data.turnId}:user` : undefined,
              turnId: data.turnId,
              pageSlug: pageContext.slug,
              pageTitle: pageContext.title,
            }),
            createConversationMessage("assistant", data.answer.trim(), {
              id: data.turnId ? `${data.turnId}:assistant` : undefined,
              turnId: data.turnId,
              pageSlug: pageContext.slug,
              pageTitle: pageContext.title,
              suggestedFollowUps: data.suggestedFollowUps,
              relatedPages: data.relatedPages,
            }),
          ],
        ),
      );

      setMessages(getSiteWideConversation(updatedState));
      setExtraPrompt(getSessionAwarePrompt(updatedState, pageContext.slug));
      setVisitorIntent(updatedState.visitorIntent ?? null);
      setDraft("");
      setStatus("idle");
    } catch (error) {
      console.error("Portfolio Guide request failed", error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Portfolio Guide could not answer right now.",
      );
    }
  }

  async function startNewConversation() {
    if (status === "loading") {
      return;
    }
    try {
      const response = await fetch("/api/portfolio-copilot/conversation/new", {
        method: "POST",
      });
      const data = (await response.json()) as GuideConversationSnapshot & {
        persistenceWarning?: string;
      };
      setPersistenceStatus(data.persistenceStatus);
      setPersistenceWarning(data.persistenceWarning ?? null);
    } catch {
      setPersistenceStatus("degraded");
      setPersistenceWarning("A new temporary conversation was started in this browser.");
    }
    const nextState = writeGuideSessionState(createEmptyGuideSessionState());
    setMessages([]);
    setVisitorIntent(null);
    setExtraPrompt(getSessionAwarePrompt(nextState, pageContext.slug));
    setErrorMessage(null);
    setDraft("");
  }

  async function deleteConversation() {
    if (status === "loading") {
      return;
    }
    try {
      await fetch("/api/portfolio-copilot/conversation", { method: "DELETE" });
    } finally {
      const nextState = writeGuideSessionState(createEmptyGuideSessionState());
      setMessages([]);
      setVisitorIntent(null);
      setPersistenceWarning(null);
      setExtraPrompt(getSessionAwarePrompt(nextState, pageContext.slug));
      setErrorMessage(null);
      setDraft("");
    }
  }

  const basePrompts = visitorIntent
    ? [
        "For the role I entered, what's most relevant here?",
        "What particularly was Daniel responsible for?",
        "How senior is the signal on this page?",
        "What should I view next for this role?",
      ]
    : [...DEFAULT_GUIDE_PROMPTS];

  const chipList = uniquePrompts([
    ...basePrompts,
    ...(pageContext.recruiterPrompts ?? []),
    extraPrompt,
  ]);

  const cardClassName =
    tone === "site"
      ? "rounded-[1.5rem] border border-[color:var(--color-teal)]/10 bg-white/82 px-5 py-5 shadow-[0_20px_50px_rgba(58,61,64,0.08)] md:px-6"
      : "rounded-[1.75rem] border border-brand-slate/10 bg-white/92 px-6 py-5 shadow-soft md:px-7";

  return (
    <section className="space-y-4" aria-labelledby={`portfolio-guide-${pageContext.slug}`}>
      <div className={clsx("space-y-4", cardClassName)}>
        <div className="space-y-2">
          <h2
            id={`portfolio-guide-${pageContext.slug}`}
            className={clsx(
              "text-xl font-semibold tracking-tight",
              tone === "site" ? "text-[color:var(--color-slate)]" : "text-brand-teal",
            )}
          >
            {DEFAULT_GUIDE_TITLE}
          </h2>
          <p
            className={clsx(
              "max-w-3xl text-sm leading-6",
              tone === "site"
                ? "text-[color:var(--color-slate)]/68"
                : "text-brand-slate/72",
            )}
          >
            {DEFAULT_GUIDE_HELPER}
          </p>
          {visitorIntent ? (
            <p
              className={clsx(
                "inline-flex max-w-full rounded-full border px-3 py-1 text-xs font-semibold leading-5",
                tone === "site"
                  ? "border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/86 text-[color:var(--color-teal)]/82"
                  : "border-brand-teal/12 bg-brand-teal/5 text-brand-teal/80",
              )}
            >
              Guided for: {visitorIntent.rawInput}
            </p>
          ) : null}
        </div>

        <PortfolioGuideChips
          chips={chipList}
          onSelect={(chip) => void submitMessage(chip, "chip")}
          disabled={status === "loading" || status === "unavailable"}
          tone={tone}
        />

        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={clsx(
              "inline-flex rounded-full border px-3.5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              tone === "site"
                ? "border-[color:var(--color-teal)]/12 bg-white text-[color:var(--color-teal)] hover:bg-[color:var(--color-background)] focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-[color:var(--color-cream)]"
                : "border-brand-teal/15 bg-white text-brand-teal hover:bg-brand-teal/5 focus-visible:ring-brand-orange focus-visible:ring-offset-white",
            )}
          >
            Open guide
          </button>
        ) : null}
      </div>

      {isOpen ? (
        <PortfolioGuidePanel
          messages={messages}
          draft={draft}
          onDraftChange={setDraft}
          onSubmit={() => void submitMessage(draft, "input")}
          onFollowUp={(message) => void submitMessage(message, "follow-up")}
          onRetry={() => void submitMessage(lastMessage, "input", lastClientTurnId)}
          onNewConversation={() => void startNewConversation()}
          onDeleteConversation={() => void deleteConversation()}
          isLoading={status === "loading"}
          isUnavailable={status === "unavailable"}
          errorMessage={errorMessage}
          loadingLabel={loadingLabel}
          persistenceStatus={persistenceStatus}
          persistenceWarning={persistenceWarning}
          isHydrating={isHydrating}
          tone={tone}
        />
      ) : null}
    </section>
  );
}
