"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { normalizeVisitorIntent } from "@/lib/portfolio-guide/intent";
import {
  appendSiteWideConversationMessages,
  clearVisitorIntent,
  createEmptyGuideSessionState,
  getSiteWideConversation,
  readGuideSessionState,
  recordPageVisit,
  recordPromptClick,
  recordQuestion,
  recordTagSignals,
  replaceSiteWideConversation,
  setVisitorIntent,
  writeGuideSessionState,
} from "@/lib/portfolio-guide/session";
import { inferInterestTags } from "@/lib/portfolio-guide/infer-tags";
import {
  canApplyNavigation,
  findRelevantWork,
  getNavigationTarget,
} from "@/lib/portfolio-agent/capabilities";
import type {
  GuideEntryPoint,
  GuideScope,
  PublicSurface,
} from "@/lib/portfolio-agent/types";
import type {
  CopilotResponse,
  GuideConversationMessage,
  GuideConversationSnapshot,
  GuideInteractionSource,
  GuidePersistenceStatus,
  GuideSessionState,
  PortfolioGuideTurnRequest,
} from "@/lib/portfolio-guide/types";

export type AssistantResult =
  | Pick<
      CopilotResponse,
      "answer" | "citations" | "relatedPages" | "suggestedFollowUps" | "action"
    >
  | { error: string };
type TurnSnapshot = {
  request: PortfolioGuideTurnRequest;
  path: string;
  page: PublicSurface;
  draft: string;
  revision: number;
};
type AssistantContext = {
  enabled: boolean;
  webmcpEnabled: boolean;
  catalog: PublicSurface[];
  surface: PublicSurface;
  pageKnown: boolean;
  isOpen: boolean;
  open: (lens?: boolean) => void;
  close: () => void;
  scope: GuideScope;
  setScope: (scope: GuideScope) => void;
  draft: string;
  setDraft: (value: string) => void;
  lensOpen: boolean;
  setLensOpen: (value: boolean) => void;
  state: GuideSessionState;
  messages: GuideConversationMessage[];
  busy: boolean;
  answering: boolean;
  hydrating: boolean;
  error: string | null;
  warning: string | null;
  persistence: GuidePersistenceStatus;
  submit: (
    message: string,
    source?: GuideInteractionSource,
    entryPoint?: GuideEntryPoint,
  ) => Promise<AssistantResult>;
  retry: () => Promise<AssistantResult>;
  cancel: () => void;
  applyLens: (
    input: string | null,
    keepEditorOpen?: boolean,
  ) => Promise<unknown>;
  reset: (remove?: boolean) => Promise<void>;
  navigate: (slug: string, signal?: AbortSignal) => Promise<unknown>;
};

const Context = createContext<AssistantContext | null>(null);
export const usePortfolioAssistant = () => useContext(Context);

function id() {
  return crypto.randomUUID();
}
function message(
  role: "user" | "assistant",
  content: string,
  page: PublicSurface,
  turnId: string,
  extra: Partial<GuideConversationMessage> = {},
): GuideConversationMessage {
  return {
    id: `${turnId}:${role}`,
    role,
    content,
    createdAt: new Date().toISOString(),
    turnId,
    pageSlug: page.slug,
    pageTitle: page.title,
    ...extra,
  };
}

export default function PortfolioAssistantProvider({
  children,
  catalog,
  enabled,
  webmcpEnabled,
}: {
  children: ReactNode;
  catalog: PublicSurface[];
  enabled: boolean;
  webmcpEnabled: boolean;
}) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const surface =
    catalog.find(
      (page) =>
        page.href === pathname.replace(/\/$/, "") ||
        (pathname === "/" && page.href === "/"),
    ) ?? catalog.find((page) => page.slug === "site-home")!;
  const pageKnown =
    surface.href === pathname || surface.href === pathname.replace(/\/$/, "");
  const [isOpen, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [lensOpen, setLensOpen] = useState(false);
  const [scopeChoice, setScopeChoice] = useState<{
    path: string;
    value: GuideScope;
  } | null>(null);
  const scope =
    scopeChoice?.path === pathname
      ? scopeChoice.value
      : surface.kind === "collection" || !pageKnown
        ? "portfolio"
        : "page";
  const [state, setState] = useState(createEmptyGuideSessionState);
  const stateRef = useRef(state);
  const [busy, setBusy] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [hydrating, setHydrating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [persistence, setPersistence] =
    useState<GuidePersistenceStatus>("disabled");
  const restore = useRef<Promise<
    GuideConversationSnapshot & { persistenceWarning?: string }
  > | null>(null);
  const active = useRef<AbortController | null>(null);
  const operation = useRef(false);
  const applied = useRef(new Set<string>());
  const last = useRef<TurnSnapshot | null>(null);
  const pathRef = useRef(pathname);
  const revision = useRef(0);
  useLayoutEffect(() => {
    if (pathRef.current !== pathname) revision.current += 1;
    pathRef.current = pathname;
  }, [pathname]);
  const commit = useCallback((next: GuideSessionState) => {
    stateRef.current = writeGuideSessionState(next);
    setState(stateRef.current);
  }, []);
  const open = useCallback((lens = false) => {
    setOpen(true);
    if (lens) setLensOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    if (last.current?.request.entryPoint === "webmcp") active.current?.abort();
  }, []);
  const cancel = useCallback(() => {
    active.current?.abort();
  }, []);

  useEffect(() => {
    if (!enabled) {
      setHydrating(false);
      return;
    }
    let cancelled = false;
    commit(readGuideSessionState());
    restore.current ??= fetch("/api/portfolio-copilot/conversation", {
      cache: "no-store",
    }).then(async (response) => {
      if (!response.ok)
        throw new Error("Saved history is temporarily unavailable.");
      return response.json();
    });
    void restore.current
      .then((snapshot) => {
        if (cancelled) return;
        setPersistence(snapshot.persistenceStatus);
        setWarning(snapshot.persistenceWarning ?? null);
        if (snapshot.persistenceStatus === "durable") {
          const local = stateRef.current;
          commit(
            replaceSiteWideConversation(
              {
                ...local,
                ...snapshot.sessionSignals,
                visitedPages: [
                  ...new Set([
                    ...(snapshot.sessionSignals?.visitedPages ?? []),
                    ...local.visitedPages,
                  ]),
                ],
              },
              snapshot.messages,
            ),
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPersistence("degraded");
          setWarning(
            "Saved history is unavailable. This tab keeps a temporary copy.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setHydrating(false);
      });
    return () => {
      cancelled = true;
    };
  }, [commit, enabled]);

  useEffect(() => {
    if (enabled && pageKnown)
      commit(
        recordTagSignals(
          recordPageVisit(stateRef.current, surface.slug),
          inferInterestTags({ pageContext: surface }),
        ),
      );
  }, [surface, enabled, pageKnown, commit]);
  useEffect(() => () => active.current?.abort(), []);
  useEffect(() => {
    if (!enabled) return;
    const followAnchor = () => {
      if (window.location.hash === `#portfolio-guide-${surface.slug}`) open();
    };
    followAnchor();
    window.addEventListener("hashchange", followAnchor);
    return () => window.removeEventListener("hashchange", followAnchor);
  }, [enabled, surface.slug, open]);

  const navigate = useCallback(
    async (slug: string, signal?: AbortSignal) => {
      const target = getNavigationTarget(catalog, slug);
      if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
      router.push(target.href);
      return {
        slug: target.slug,
        href: target.href,
        status: "navigation_requested",
      };
    },
    [catalog, router],
  );

  async function perform(snapshot: TurnSnapshot): Promise<AssistantResult> {
    if (operation.current || hydrating)
      return { error: "Please wait for the current operation to finish." };
    operation.current = true;
    const controller = new AbortController();
    active.current = controller;
    setAnswering(true);
    last.current = snapshot;
    setOpen(true);
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/portfolio-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(snapshot.request),
      });
      const result = (await response.json()) as CopilotResponse & {
        error?: string;
        turnId?: string;
        persistenceStatus?: GuidePersistenceStatus;
        persistenceWarning?: string;
      };
      if (!response.ok || !result.answer?.trim())
        throw new Error(
          result.error ?? "The assistant could not answer right now.",
        );
      if (controller.signal.aborted) return { error: "Request cancelled." };
      const turnId = result.turnId ?? snapshot.request.clientTurnId;
      // Merge into the latest state: browsing or lens state must never roll back to request time.
      const existing = getSiteWideConversation(stateRef.current);
      if (!existing.some((entry) => entry.turnId === turnId)) {
        commit(
          appendSiteWideConversationMessages(stateRef.current, [
            message("user", snapshot.request.message, snapshot.page, turnId),
            message("assistant", result.answer, snapshot.page, turnId, {
              citations: result.citations,
              relatedPages: result.relatedPages?.slice(0, 2),
              suggestedFollowUps: result.suggestedFollowUps,
            }),
          ]),
        );
      }
      setPersistence(result.persistenceStatus ?? "disabled");
      setWarning(result.persistenceWarning ?? null);
      setDraft((current) => (current === snapshot.draft ? "" : current));
      if (
        result.action &&
        canApplyNavigation({
          submittedPath: snapshot.path,
          currentPath: pathRef.current,
          submittedRevision: snapshot.revision,
          currentRevision: revision.current,
          turnId,
          applied: applied.current,
          cancelled: controller.signal.aborted,
        })
      ) {
        applied.current.add(turnId);
        await navigate(result.action.slug, controller.signal);
      }
      return {
        answer: result.answer,
        citations: result.citations,
        relatedPages: result.relatedPages,
        suggestedFollowUps: result.suggestedFollowUps,
        action: result.action,
      };
    } catch (cause) {
      const detail = controller.signal.aborted
        ? "Request stopped. You can retry the same question."
        : cause instanceof Error
          ? cause.message
          : "The assistant could not answer right now.";
      setError(detail);
      return { error: detail };
    } finally {
      operation.current = false;
      active.current = null;
      setAnswering(false);
      setBusy(false);
    }
  }

  async function submit(
    input: string,
    source: GuideInteractionSource = "input",
    entryPoint: GuideEntryPoint = "ui",
  ) {
    const question = input.trim();
    if (!question || question.length > 4000)
      return { error: "Enter a question between 1 and 4,000 characters." };
    if (operation.current || hydrating)
      return { error: "Please wait for the current operation to finish." };
    if (entryPoint === "webmcp") setDraft(input);
    let next = recordQuestion(stateRef.current, question);
    if (source !== "input") next = recordPromptClick(next, question);
    next = recordTagSignals(
      next,
      inferInterestTags({ pageContext: surface, text: question }),
    );
    commit(next);
    return perform({
      path: pathname,
      page: surface,
      draft: input,
      revision: revision.current,
      request: {
        clientTurnId: id(),
        pageSlug: surface.slug,
        message: question,
        source,
        scope,
        entryPoint,
        sessionSignals: {
          visitedPages: next.visitedPages,
          clickedPrompts: next.clickedPrompts,
          askedQuestions: next.askedQuestions,
          inferredInterestTags: next.inferredInterestTags,
          visitorIntent: next.visitorIntent,
          visitorIntentCleared: !next.visitorIntent,
          recommendedPath: next.recommendedPath,
          lastVisitedAt: next.lastVisitedAt,
        },
        fallbackConversation: getSiteWideConversation(next)
          .slice(-8)
          .map(({ role, content }) => ({ role, content })),
      },
    });
  }

  async function applyLens(input: string | null, keepEditorOpen = false) {
    if (operation.current || hydrating)
      return { error: "Please wait for the current operation to finish." };
    if (input !== null && (!input.trim() || input.length > 1000))
      return {
        error: "Enter a role or interest between 1 and 1,000 characters.",
      };
    const intent = input === null ? null : normalizeVisitorIntent(input);
    const recommendations = intent
      ? findRelevantWork(catalog, intent.rawInput)
      : [];
    commit(
      intent
        ? setVisitorIntent(stateRef.current, intent, recommendations)
        : clearVisitorIntent(stateRef.current),
    );
    // Keep an agent-invoked form mounted until respondWith resolves.
    if (!keepEditorOpen) setLensOpen(false);
    operation.current = true;
    setBusy(true);
    try {
      const response = await fetch("/api/portfolio-copilot/conversation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput: intent?.rawInput ?? null }),
      });
      if (!response.ok) throw new Error("Could not save lens.");
    } catch {
      setWarning(
        "Your lens is active in this tab, but its saved update is temporarily unavailable.",
      );
    } finally {
      operation.current = false;
      setBusy(false);
    }
    return { intent, recommendations };
  }

  async function reset(remove = false) {
    if (operation.current || hydrating) return;
    operation.current = true;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(
        remove
          ? "/api/portfolio-copilot/conversation"
          : "/api/portfolio-copilot/conversation/new",
        { method: remove ? "DELETE" : "POST" },
      );
      if (!response.ok)
        throw new Error(
          "The saved conversation could not be updated. Please try again.",
        );
      const result = await response.json();
      commit(createEmptyGuideSessionState());
      setDraft("");
      last.current = null;
      applied.current.clear();
      setPersistence(result.persistenceStatus ?? persistence);
      setWarning(result.persistenceWarning ?? null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again.");
    } finally {
      operation.current = false;
      setBusy(false);
    }
  }

  return (
    <Context.Provider
      value={{
        enabled,
        webmcpEnabled,
        catalog,
        surface,
        pageKnown,
        isOpen,
        open,
        close,
        scope,
        setScope: (value) => setScopeChoice({ path: pathname, value }),
        draft,
        setDraft,
        lensOpen,
        setLensOpen,
        state,
        messages: getSiteWideConversation(state),
        busy,
        answering,
        hydrating,
        error,
        warning,
        persistence,
        submit,
        retry: () =>
          last.current
            ? perform(last.current)
            : Promise.resolve({ error: "No question to retry." }),
        cancel,
        applyLens,
        reset,
        navigate,
      }}
    >
      {children}
    </Context.Provider>
  );
}
