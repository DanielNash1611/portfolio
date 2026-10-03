"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X } from "lucide-react";
import { feedbackAnalyticsIdentity } from "@/lib/analytics";

export default function FeedbackButton() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const submission = useRef<{ signature: string; id: string } | null>(null);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  function open() {
    if (status === "success") {
      setCategory("");
      setMessage("");
      setStatus("idle");
      submission.current = null;
    }
    dialog.current?.showModal();
  }
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = new FormData(event.currentTarget);
    const payload = {
      category,
      message: message.trim(),
      pagePath: pathname,
      website: String(form.get("website") ?? ""),
      ...feedbackAnalyticsIdentity(),
    };
    const signature = JSON.stringify(payload);
    if (submission.current?.signature !== signature)
      submission.current = { signature, id: crypto.randomUUID() };
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          clientSubmissionId: submission.current.id,
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        stored?: boolean;
        error?: string;
      };
      if (!response.ok || data.stored !== true)
        throw new Error(
          data.error ?? "Feedback could not be saved. Please try again.",
        );
      setStatus("success");
    } catch (failure) {
      setStatus("error");
      setError(
        failure instanceof Error && failure.message !== "Failed to fetch"
          ? failure.message
          : "Feedback could not be saved. Please check your connection and try again.",
      );
    }
  }
  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="fixed right-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-[color:var(--color-teal)] px-4 text-sm font-semibold text-[color:var(--color-cream)] shadow-lg transition hover:bg-[color:var(--color-slate)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--color-orange)]"
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <MessageSquare className="h-4 w-4" aria-hidden="true" />
        Feedback
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="feedback-title"
        aria-describedby="feedback-notice"
        className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-[color:var(--color-slate)]/15 bg-[color:var(--color-background)] p-6 text-[color:var(--color-slate)] shadow-2xl backdrop:bg-black/45 sm:p-8"
        onCancel={(event) => {
          if (status === "sending") event.preventDefault();
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="feedback-title"
            className="font-serif text-3xl tracking-tight"
          >
            Share feedback
          </h2>
          <button
            type="button"
            aria-label="Close feedback"
            disabled={status === "sending"}
            onClick={() => dialog.current?.close()}
            className="-mr-2 -mt-2 inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5 disabled:opacity-40"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <p id="feedback-notice" className="mt-3 text-sm leading-6 opacity-75">
          Reviewed with AI to improve this site. Includes this page and, when
          analytics is enabled, pseudonymous browsing context. Raw feedback is
          kept for 90 days. Please avoid personal or sensitive details.
        </p>
        {status === "success" ? (
          <div className="mt-6" role="status">
            <p className="font-semibold">Thanks — your feedback was saved.</p>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="mt-6 min-h-11 rounded-lg bg-[color:var(--color-teal)] px-5 font-semibold text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={send} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="feedback-category"
                className="block text-sm font-semibold"
              >
                Category
              </label>
              <select
                id="feedback-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                disabled={status === "sending"}
                className="mt-2 min-h-11 w-full rounded-lg border border-black/20 bg-white px-3 text-sm"
              >
                <option value="" disabled>
                  Choose a category
                </option>
                <option value="problem">Problem</option>
                <option value="suggestion">Suggestion</option>
                <option value="general">General feedback</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="feedback-message"
                className="block text-sm font-semibold"
              >
                Your feedback
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
                maxLength={2000}
                rows={5}
                disabled={status === "sending"}
                aria-describedby="feedback-length"
                className="mt-2 w-full rounded-lg border border-black/20 bg-white p-3 text-sm leading-6"
                placeholder="What happened, or what could be better?"
              />
              <p
                id="feedback-length"
                className="mt-1 text-right text-xs opacity-60"
              >
                {message.length.toLocaleString()} / 2,000
              </p>
            </div>
            <div hidden aria-hidden="true">
              <label htmlFor="feedback-website">Website</label>
              <input
                id="feedback-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            {error ? (
              <p role="alert" className="text-sm text-red-800">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={status === "sending" || !message.trim()}
              className="min-h-11 rounded-lg bg-[color:var(--color-teal)] px-5 font-semibold text-white disabled:opacity-50"
            >
              {status === "sending"
                ? "Sending…"
                : status === "error"
                  ? "Try again"
                  : "Send feedback"}
            </button>
          </form>
        )}
      </dialog>
    </>
  );
}
