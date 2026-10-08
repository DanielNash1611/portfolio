"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import type { WorkspaceDraft } from "@/lib/product-workspace/model";
import {
  groundedSuggestions,
  hasSuggestionSource,
  suggestionInput,
  suggestionKinds,
  type SuggestionKind,
  type Suggestions,
} from "@/lib/product-workspace/suggestions";

const labels: Record<SuggestionKind, string> = {
  audience: "Who it’s for",
  outcome: "Desired outcome",
  opportunity: "Opportunity",
  solution: "Possible solution",
};
export function WorkspaceSuggestions({
  draft,
  ready,
  onApply,
}: {
  draft: WorkspaceDraft;
  ready: boolean;
  onApply: (
    suggestions: Suggestions,
    selected: SuggestionKind[],
    snapshot: string,
  ) => void;
}) {
  const snapshot = JSON.stringify(draft);
  const currentSnapshot = useRef(snapshot);
  currentSnapshot.current = snapshot;
  const controller = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState<{
    suggestions: Suggestions;
    snapshot: string;
  } | null>(null);
  const [selected, setSelected] = useState<SuggestionKind[]>([]);
  const [status, setStatus] = useState("");
  const input = suggestionInput(draft);
  const eligible =
    ready &&
    hasSuggestionSource(input) &&
    Object.values(input.open).some(Boolean);

  useEffect(() => {
    controller.current?.abort();
    setBusy(false);
    setReview(null);
    setStatus("");
    return () => {
      controller.current?.abort();
    };
  }, [snapshot]);

  async function suggest() {
    if (!eligible || busy) return;
    const requestSnapshot = snapshot;
    const requestController = new AbortController();
    controller.current = requestController;
    setBusy(true);
    setReview(null);
    setStatus("Looking for what your notes support…");
    const timeout = window.setTimeout(() => requestController.abort(), 25_000);
    try {
      const response = await fetch("/api/product-workspace/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: requestController.signal,
      });
      const data = await response.json();
      if (
        currentSnapshot.current !== requestSnapshot ||
        controller.current !== requestController
      )
        return;
      if (!response.ok)
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Suggestions are unavailable. Your draft is unchanged.",
        );
      const suggestions = groundedSuggestions(data.suggestions, input);
      const available = suggestionKinds.filter((kind) => suggestions[kind]);
      setReview({ suggestions, snapshot: requestSnapshot });
      setSelected(available);
      setStatus(
        available.length
          ? "Review the suggestions below. Your draft hasn’t changed."
          : "There isn’t enough clear detail to fill an open field. Your tree stays as it is.",
      );
    } catch (error) {
      if (
        currentSnapshot.current !== requestSnapshot ||
        controller.current !== requestController
      )
        return;
      setStatus(
        requestController.signal.aborted
          ? "Suggestions stopped. Your draft is unchanged; you can try again."
          : error instanceof Error
            ? error.message
            : "Suggestions are unavailable. Your draft is unchanged.",
      );
    } finally {
      window.clearTimeout(timeout);
      if (controller.current === requestController) {
        setBusy(false);
        controller.current = null;
      }
    }
  }

  const currentReview = review?.snapshot === snapshot ? review : null;
  return (
    <div className="workspace-ai">
      <div className="workspace-ai-intro">
        <p>AI suggestions leave unclear fields blank.</p>
        <button
          type="button"
          className="workspace-ai-trigger"
          disabled={!eligible || busy}
          onClick={suggest}
        >
          <Sparkles size={15} />
          {busy ? "Reading your notes…" : "Suggest from my notes"}
        </button>
      </div>
      <details className="workspace-ai-privacy">
        <summary>Sends notes to OpenAI when you click.</summary>
        <p>
          Your idea, audience, outcome, intended experience, open questions, and
          tree titles are shared for this request. Evidence, repo links, and
          notes for coding assistants are excluded. Suggestions use your words
          and need your review. Your saved draft stays in this browser.
        </p>
      </details>
      <p className="workspace-ai-status" role="status" aria-live="polite">
        {status ||
          (!hasSuggestionSource(input)
            ? "Add an idea or experience to enable suggestions."
            : !Object.values(input.open).some(Boolean)
              ? "Add an empty tree node to explore another suggestion."
              : "Review suggestions before adding them.")}
      </p>
      {currentReview && (
        <div className="workspace-ai-review" aria-label="Review AI suggestions">
          {suggestionKinds.map((kind) => {
            const suggestion = currentReview.suggestions[kind];
            if (!suggestion) return null;
            return (
              <label key={kind} className="workspace-ai-proposal">
                <input
                  type="checkbox"
                  checked={selected.includes(kind)}
                  onChange={(event) =>
                    setSelected((current) =>
                      event.target.checked
                        ? [...current, kind]
                        : current.filter((k) => k !== kind),
                    )
                  }
                />
                <span>
                  <strong>{labels[kind]}</strong>
                  <span>{suggestion.text}</span>
                  <small>
                    From your {suggestion.sourceField}: “{suggestion.quote}”
                  </small>
                </span>
              </label>
            );
          })}
          {currentReview.suggestions.connection &&
            selected.includes("opportunity") &&
            selected.includes("solution") && (
              <p className="workspace-ai-connection">
                These two nodes will be connected because your notes link the
                need and the response.
              </p>
            )}
          {!currentReview.suggestions.connection &&
            currentReview.suggestions.opportunity &&
            currentReview.suggestions.solution && (
              <p className="workspace-ai-connection">
                The connection is still open. You can link these nodes in your
                tree.
              </p>
            )}
          {currentReview.suggestions.question && (
            <p className="workspace-ai-question">
              <strong>Still open</strong>
              {currentReview.suggestions.question}
            </p>
          )}
          <div className="workspace-ai-actions">
            {suggestionKinds.some((k) => currentReview.suggestions[k]) && (
              <button
                type="button"
                className="workspace-primary"
                disabled={!selected.length}
                onClick={() => {
                  if (currentSnapshot.current !== currentReview.snapshot)
                    return;
                  onApply(
                    currentReview.suggestions,
                    selected,
                    currentReview.snapshot,
                  );
                  setReview(null);
                }}
              >
                Use selected suggestions
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setReview(null);
                setStatus("Suggestions dismissed. Your draft is unchanged.");
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
