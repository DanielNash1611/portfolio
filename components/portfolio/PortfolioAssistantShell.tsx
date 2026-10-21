"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  Compass,
  MessageSquare,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { usePortfolioAssistant } from "./PortfolioAssistantProvider";
import PortfolioWebMCP from "./PortfolioWebMCP";
import {
  findRelevantWork,
  getPortfolioHref,
  submitAnnotatedForm,
} from "@/lib/portfolio-agent/capabilities";
import { ROLE_INTENT_QUICK_SELECTS } from "@/lib/portfolio-guide/intent";
import type { GuideConversationMessage } from "@/lib/portfolio-guide/types";
import "./portfolio-assistant.css";

function followUpHref(label: string) {
  if (
    /^(?:generate a resume for my role|compare daniel to this job description)$/i.test(
      label.trim(),
    )
  )
    return "/resume/generate";
  return /^contact daniel$/i.test(label.trim()) ? "/contact" : null;
}

function Turn({
  message,
  sourceHref,
  onFollowUp,
  disabled,
}: {
  message: GuideConversationMessage;
  sourceHref?: string;
  onFollowUp: (value: string) => void;
  disabled: boolean;
}) {
  const citations = message.citations?.filter(
    (source, index, all) =>
      all.findIndex(
        (other) =>
          other.kind === source.kind &&
          other.url === source.url &&
          other.title === source.title,
      ) === index,
  );
  return (
    <article className={`assistant-turn assistant-turn--${message.role}`}>
      <p className="assistant-turn-byline">
        {message.role === "user" ? "You" : "Portfolio assistant"}
      </p>
      {message.pageTitle && (
        <p className="assistant-turn-context">
          {sourceHref ? (
            <Link href={sourceHref}>{message.pageTitle}</Link>
          ) : (
            message.pageTitle
          )}
        </p>
      )}
      <p className="assistant-answer">{message.content}</p>
      {message.role === "assistant" && (
        <>
          {!!citations?.length && (
            <div className="assistant-sources" aria-label="Answer sources">
              <span>Sources</span>
              {citations.map((source) => (
                <div key={`${source.sourceId}:${source.claim}`}>
                  {source.url && /^(https:\/\/|\/(?!\/))/.test(source.url) ? (
                    getPortfolioHref(source.url) ? (
                      <Link href={getPortfolioHref(source.url)!}>
                        {source.title}
                      </Link>
                    ) : (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.title}
                      </a>
                    )
                  ) : (
                    source.title
                  )}
                  {source.kind === "approved_career" && (
                    <small>
                      {" "}
                      · Approved career evidence
                      {source.url ? " · Portfolio context link" : ""}
                    </small>
                  )}
                </div>
              ))}
            </div>
          )}
          {!!message.relatedPages?.length && (
            <div className="assistant-next">
              <span>Read next</span>
              {message.relatedPages.slice(0, 2).map((page) => (
                <Link key={page.slug} href={page.href}>
                  {page.title}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              ))}
            </div>
          )}
          {!!message.suggestedFollowUps?.length && (
            <div className="assistant-followups">
              {message.suggestedFollowUps.slice(0, 2).map((label) => {
                const href = followUpHref(label);
                return href ? (
                  <Link key={label} href={href}>
                    {label}
                  </Link>
                ) : (
                  <button
                    key={label}
                    disabled={disabled}
                    onClick={() => onFollowUp(label)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </article>
  );
}

export default function PortfolioAssistantShell() {
  const assistant = usePortfolioAssistant();
  const panel = useRef<HTMLElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [docked, setDocked] = useState(false);
  const [lensDraft, setLensDraft] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [pathExpanded, setPathExpanded] = useState(false);
  const [evidence, setEvidence] = useState<{
    slug: string;
    data: import("@/lib/portfolio-agent/types").PublicPageEvidence;
  } | null>(null);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const isOpen = assistant?.isOpen ?? false;
  const enabled = assistant?.enabled ?? false;
  const open = assistant?.open;
  const close = assistant?.close;

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1440px)");
    const update = () => setDocked(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!enabled) return;
    const shortcut = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k" &&
        !(
          event.target instanceof HTMLElement &&
          (event.target.isContentEditable ||
            /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName))
        )
      ) {
        event.preventDefault();
        if (isOpen) close?.();
        else open?.();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [enabled, isOpen, open, close]);
  useEffect(() => {
    if (!enabled || !isOpen) return;
    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const launchButton = launcher.current;
    panel.current?.focus();
    const content = document.getElementById("portfolio-site-content");
    const previousOverflow = document.body.style.overflow;
    if (!docked) {
      document.body.style.overflow = "hidden";
      if (content) content.inert = true;
    }
    document.body.classList.toggle("portfolio-assistant-docked", docked);
    const keyboard = (event: KeyboardEvent) => {
      // Let media dialogs above the assistant own their Escape/Tab behavior.
      if (
        document.querySelector(
          '[aria-modal="true"]:not(#portfolio-assistant-panel)',
        )
      )
        return;
      if (event.key === "Escape") {
        event.preventDefault();
        close?.();
      }
      if (!docked && event.key === "Tab") {
        const items = Array.from(
          panel.current?.querySelectorAll<HTMLElement>(
            'a[href],button:not(:disabled),textarea:not(:disabled),input:not(:disabled),select:not(:disabled),summary,[tabindex="0"]',
          ) ?? [],
        ).filter((element) => element.getClientRects().length > 0);
        const first = items[0],
          last = items.at(-1);
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === panel.current)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === panel.current)
        ) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      if (content) content.inert = false;
      document.body.classList.remove("portfolio-assistant-docked");
      document.removeEventListener("keydown", keyboard);
      const target = previousFocus.current?.isConnected
        ? previousFocus.current
        : launchButton;
      target?.focus({ preventScroll: true });
    };
  }, [enabled, isOpen, docked, close]);
  useEffect(() => {
    if (assistant?.lensOpen)
      setLensDraft(assistant.state.visitorIntent?.rawInput ?? "");
  }, [assistant?.lensOpen, assistant?.state.visitorIntent?.rawInput]);
  useEffect(() => {
    const view = window.visualViewport;
    const element = panel.current;
    if (!isOpen || docked || !view || !element) return;
    const resize = () => {
      element.style.setProperty(
        "--assistant-visible-height",
        `${view.height}px`,
      );
      element.style.setProperty(
        "--assistant-visible-top",
        `${view.offsetTop}px`,
      );
    };
    resize();
    view.addEventListener("resize", resize);
    view.addEventListener("scroll", resize);
    return () => {
      view.removeEventListener("resize", resize);
      view.removeEventListener("scroll", resize);
      element.style.removeProperty("--assistant-visible-height");
      element.style.removeProperty("--assistant-visible-top");
    };
  }, [isOpen, docked]);
  const messageCount = assistant?.messages.length ?? 0;
  const answering = assistant?.answering ?? false;
  useEffect(() => {
    if (!isOpen || !log.current) return;
    const latestQuestion = Array.from(
      log.current.querySelectorAll<HTMLElement>(".assistant-turn--user"),
    ).at(-1);
    if (answering) log.current.scrollTop = log.current.scrollHeight;
    else if (messageCount && latestQuestion) {
      log.current.scrollTop +=
        latestQuestion.getBoundingClientRect().top -
        log.current.getBoundingClientRect().top -
        16;
    } else log.current.scrollTop = 0;
  }, [messageCount, answering, isOpen]);
  useEffect(() => {
    if (assistant?.lensOpen && log.current) log.current.scrollTop = 0;
  }, [assistant?.lensOpen]);
  useEffect(() => {
    const hasLens = Boolean(assistant?.state.visitorIntent?.rawInput);
    setPathExpanded(hasLens);
    if (hasLens && log.current) log.current.scrollTop = 0;
  }, [assistant?.state.visitorIntent?.rawInput]);
  const lensInput = assistant?.state.visitorIntent?.rawInput;
  const pageCatalog = assistant?.catalog;
  const recommendations = useMemo(
    () => lensInput && pageCatalog ? findRelevantWork(pageCatalog, lensInput) : [],
    [pageCatalog, lensInput],
  );

  if (!assistant || !enabled) return null;
  const disabled = assistant.busy || assistant.hydrating;
  const prompts =
    assistant.scope === "portfolio"
      ? [
          "Where should I start?",
          "Show me the creative work",
          "What connects these projects?",
        ]
      : assistant.surface.kind === "method" ||
          assistant.surface.projectType === "essay"
        ? [
            "What is the main idea here?",
            "How does this connect to the rest of the portfolio?",
          ]
        : assistant.surface.projectType === "creative-experience"
          ? ["How was this experience made?", "What should I explore next?"]
          : assistant.state.visitorIntent
            ? [
                "For the role I entered, what's most relevant here?",
                "What particularly was Daniel responsible for?",
              ]
            : [
                "What are the strongest signals on this page?",
                "What's implied but not proven here?",
              ];
  // Do not publish a temporary schema with required inputs disabled while the
  // saved conversation restores. Agents can discover the forms once ready.
  const annotations = assistant.webmcpEnabled && !assistant.hydrating;
  // Disabled fields disappear from native form schemas. Keep their eligibility
  // stable during respondWith; the provider serializes all submissions.
  const formFieldDisabled = assistant.hydrating;

  function handleLens(event: FormEvent<HTMLFormElement>) {
    void submitAnnotatedForm(event, "intent", async (value, entryPoint) => {
      if (!value.trim() || value.length > 1000) {
        setFormError("Enter a role or interest up to 1,000 characters.");
        return { error: "Invalid lens." };
      }
      setFormError(null);
      return assistant!.applyLens(value, entryPoint === "webmcp");
    });
  }

  async function showEvidence() {
    if (evidence?.slug === assistant!.surface.slug) {
      setEvidence(null);
      return;
    }
    setEvidenceLoading(true);
    setFormError(null);
    const slug = assistant!.surface.slug;
    try {
      const response = await fetch(
        `/api/portfolio-agent/evidence?slug=${encodeURIComponent(slug)}`,
      );
      if (!response.ok) throw new Error("Evidence is temporarily unavailable.");
      setEvidence({ slug, data: await response.json() });
    } catch {
      setFormError(
        "Evidence is temporarily unavailable. You can still read the page.",
      );
    } finally {
      setEvidenceLoading(false);
    }
  }

  return (
    <>
      <PortfolioWebMCP />
      <button
        ref={launcher}
        hidden={isOpen}
        type="button"
        className="assistant-launcher"
        aria-haspopup={docked ? undefined : "dialog"}
        aria-controls="portfolio-assistant-panel"
        aria-expanded={isOpen}
        onClick={() => assistant.open()}
      >
        <Compass size={18} aria-hidden="true" />
        <span>Explore with AI</span>
      </button>
      {isOpen && (
        <>
          {!docked && (
            <div
              className="assistant-backdrop"
              onClick={assistant.close}
              aria-hidden="true"
            />
          )}
          <aside
            ref={panel}
            id="portfolio-assistant-panel"
            className="portfolio-assistant"
            role={docked ? "complementary" : "dialog"}
            aria-modal={docked ? undefined : true}
            aria-labelledby="assistant-title"
            tabIndex={-1}
          >
            <header className="assistant-header">
              <div>
                <p className="assistant-eyebrow">
                  <Compass size={13} aria-hidden="true" /> Explore together
                </p>
                <h2 id="assistant-title">Portfolio assistant</h2>
              </div>
              <button
                type="button"
                className="assistant-icon-button"
                onClick={assistant.close}
                aria-label="Close assistant"
              >
                <X size={20} />
              </button>
            </header>
            <div className="assistant-context">
              <div>
                <span className="assistant-eyebrow">
                  {assistant.pageKnown
                    ? "Currently viewing"
                    : "Portfolio context"}
                </span>
                <p>{assistant.surface.title}</p>
              </div>
              <label className="assistant-scope">
                <span className="sr-only">Answer scope</span>
                <select
                  value={assistant.scope}
                  onChange={(event) =>
                    assistant.setScope(
                      event.target.value as "page" | "portfolio",
                    )
                  }
                >
                  <option value="page" disabled={!assistant.pageKnown}>
                    This page
                  </option>
                  <option value="portfolio">Whole portfolio</option>
                </select>
                <ChevronDown size={12} aria-hidden="true" />
              </label>
            </div>
            <div className="assistant-lens-bar">
              <button
                type="button"
                onClick={() => assistant.setLensOpen(!assistant.lensOpen)}
                aria-expanded={assistant.lensOpen}
                className="assistant-text-button"
              >
                <SlidersHorizontal size={14} aria-hidden="true" />
                {assistant.state.visitorIntent
                  ? "Edit your lens"
                  : "Add a role or interest"}
              </button>
              {assistant.state.visitorIntent && (
                <>
                  <span className="assistant-lens-label">
                    {assistant.state.visitorIntent.rawInput}
                  </span>
                  <button
                    type="button"
                    className="assistant-text-button"
                    disabled={disabled}
                    onClick={() => void assistant.applyLens(null)}
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
            <div
              ref={log}
              className="assistant-scroll"
              role="log"
              aria-label="Portfolio conversation"
              aria-live="polite"
              aria-relevant="additions text"
            >
              {assistant.lensOpen && (
                <form
                  className="assistant-lens-form"
                  toolname={annotations ? "guide_portfolio_tour" : undefined}
                  tooldescription={
                    annotations
                      ? "Set an optional role or interest and show relevant published work. Does not call an AI model. Saved with an existing conversation; otherwise kept in this tab until a question is asked."
                      : undefined
                  }
                  toolautosubmit={annotations ? "" : undefined}
                  onSubmit={handleLens}
                >
                  <label htmlFor="assistant-intent">
                    What brings you here?
                  </label>
                  <textarea
                    id="assistant-intent"
                    name="intent"
                    toolparamdescription="Role, short job brief, or interest. Maximum 1,000 characters."
                    required
                    maxLength={1000}
                    rows={3}
                    value={lensDraft}
                    onChange={(event) => setLensDraft(event.target.value)}
                    placeholder="A role, short brief, or creative interest…"
                    disabled={formFieldDisabled}
                  />
                  <button
                    type="submit"
                    className="assistant-primary"
                    disabled={disabled}
                  >
                    Find relevant work{" "}
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                  <div className="assistant-quickstarts">
                    {ROLE_INTENT_QUICK_SELECTS.map((label) => (
                      <button
                        key={label}
                        type="button"
                        disabled={disabled}
                        onClick={() => void assistant.applyLens(label)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </form>
              )}
              {assistant.hydrating && (
                <p className="assistant-muted" role="status">
                  Restoring this browser’s conversation…
                </p>
              )}
              {!assistant.messages.length && !recommendations.length && (
                <div className="assistant-welcome">
                  <MessageSquare
                    size={24}
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  <h3>A useful way into the work.</h3>
                  <p>
                    Ask about an idea, examine the evidence, or find a project
                    that fits your interests.
                  </p>
                  <div className="assistant-starters">
                    {prompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        disabled={disabled}
                        onClick={() => void assistant.submit(prompt, "chip")}
                      >
                        {prompt}
                        <ArrowRight size={14} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {!!recommendations.length && (
                <details
                  className="assistant-recommendations"
                  open={pathExpanded}
                  onToggle={(event) =>
                    setPathExpanded(event.currentTarget.open)
                  }
                >
                  <summary>Your suggested path</summary>
                  {recommendations.map((page) => (
                    <Link key={page.slug} href={page.href}>
                      <strong>{page.title}</strong>
                      <span>{page.reason}</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  ))}
                </details>
              )}
              {assistant.messages.map((turn) => (
                <Turn
                  key={turn.id}
                  message={turn}
                  sourceHref={
                    assistant.catalog.find(
                      (page) => page.slug === turn.pageSlug,
                    )?.href
                  }
                  disabled={disabled}
                  onFollowUp={(question) =>
                    void assistant.submit(question, "follow-up")
                  }
                />
              ))}
              {assistant.answering && (
                <div className="assistant-status" role="status">
                  <span className="assistant-working" /> Working with the public
                  evidence…
                  <button type="button" onClick={assistant.cancel}>
                    Stop
                  </button>
                </div>
              )}
              {(assistant.error || formError) && (
                <div className="assistant-error" role="alert">
                  <p>{assistant.error ?? formError}</p>
                  {assistant.error && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => void assistant.retry()}
                    >
                      Retry question
                    </button>
                  )}
                </div>
              )}
              {assistant.pageKnown && (
                <div className="assistant-evidence">
                  <button
                    type="button"
                    className="assistant-text-button"
                    onClick={() => void showEvidence()}
                    disabled={evidenceLoading}
                  >
                    <Check size={14} aria-hidden="true" />
                    {evidenceLoading
                      ? "Loading evidence…"
                      : evidence?.slug === assistant.surface.slug
                        ? "Hide page evidence"
                        : "Inspect page evidence"}
                  </button>
                  {evidence?.slug === assistant.surface.slug && (
                    <div>
                      <Link href={getPortfolioHref(evidence.data.source.url)!}>
                        {evidence.data.title}
                      </Link>
                      <p>
                        Published portfolio content · Independent verification
                        not assessed
                      </p>
                      {evidence.data.highlights.map((item) => (
                        <p key={item.label}>
                          <strong>{item.label}:</strong> {item.detail}
                        </p>
                      ))}
                      {Object.entries(evidence.data.claimBoundaries).map(
                        ([kind, items]) => (
                          <div key={kind}>
                            <strong>
                              {kind
                                .replace(/([A-Z])/g, " $1")
                                .toLowerCase()
                                .replace(/^./, (letter) =>
                                  letter.toUpperCase(),
                                )}
                            </strong>
                            <ul>
                              {items?.map((item: string) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <footer className="assistant-composer">
              <form
                toolname={annotations ? "ask_portfolio_guide" : undefined}
                tooldescription={
                  annotations
                    ? "Ask a grounded portfolio question using the visible answer scope and role lens. Uses OpenAI and saves the question and answer in this browser's conversation for up to 90 days. Returns the displayed answer, citations, and next reads. Does not send contact messages or generate resumes."
                    : undefined
                }
                toolautosubmit={annotations ? "" : undefined}
                onSubmit={(event) => {
                  void submitAnnotatedForm(
                    event,
                    "question",
                    (value, entryPoint) => {
                      if (!value.trim() || value.length > 4000) {
                        setFormError(
                          "Enter a question between 1 and 4,000 characters.",
                        );
                        return Promise.resolve({ error: "Invalid question." });
                      }
                      setFormError(null);
                      return assistant.submit(value, "input", entryPoint);
                    },
                  );
                }}
              >
                <label htmlFor="assistant-question" className="sr-only">
                  Ask the portfolio assistant
                </label>
                <div className="assistant-input-row">
                  <textarea
                    id="assistant-question"
                    name="question"
                    required
                    maxLength={4000}
                    rows={2}
                    toolparamdescription="Question about this page or portfolio, up to 4,000 characters. To navigate, explicitly ask to open a named page."
                    value={assistant.draft}
                    onChange={(event) => assistant.setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (
                        (event.ctrlKey || event.metaKey) &&
                        event.key === "Enter"
                      ) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    placeholder={
                      assistant.scope === "page"
                        ? "Ask about this page…"
                        : "Ask about the portfolio…"
                    }
                    disabled={formFieldDisabled}
                  />
                  <button
                    type="submit"
                    className="assistant-send"
                    aria-label="Send question"
                    disabled={disabled}
                  >
                    <ArrowUp size={18} />
                  </button>
                </div>
                <p className="assistant-privacy">
                  Questions may be processed by OpenAI and saved for 90 days.
                  Don’t include sensitive information.
                </p>
              </form>
              <div className="assistant-session">
                <span>
                  {assistant.persistence === "durable"
                    ? "Saved in this browser"
                    : "Temporary session"}
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => void assistant.reset()}
                >
                  New chat
                </button>
                <button
                  type="button"
                  disabled={disabled || !assistant.messages.length}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Delete this conversation and its saved history?",
                      )
                    )
                      void assistant.reset(true);
                  }}
                >
                  Delete
                </button>
              </div>
              {assistant.warning && (
                <p className="assistant-warning" role="status">
                  {assistant.warning}
                </p>
              )}
            </footer>
          </aside>
        </>
      )}
    </>
  );
}
