"use client";

import { FormEvent, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const examplePrompts = [
  "What do I need to play The Sweater Song?",
  "How do I sound like Ólafur Arnalds?",
  "What pedals do I need to sound like Until It Blazes?",
  "What gear do I need to play True Love Waits by Radiohead?",
];

const loadingPhrases = [
  "Looking up reference tracks...",
  "Analyzing tonal spectrum...",
  "Dialing in the signal chain...",
  "Coming up with recommendations...",
  "Adjusting virtual faders...",
];

export function SoundSeekerWidget() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setPhraseIndex(0);
      return;
    }
    const id = window.setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 1200);
    return () => window.clearInterval(id);
  }, [isLoading]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) {
      setError("Tell Sound Seeker which tone, artist, or era to explore.");
      setResult("");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult("");
    setPhraseIndex(0);

    try {
      const response = await fetch("/api/sound-seeker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(typeof data?.error === "string" ? data.error : "No recommendations returned.");
        return;
      }

      const textResult = typeof data?.result === "string" ? data.result.trim() : "";
      if (!textResult) {
        setError("No recommendations returned.");
        return;
      }
      setResult(textResult);
    } catch (err) {
      console.error("Sound Seeker request failed", err);
      setError("Network issue -- please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="sound-prompt" className="block text-sm font-semibold text-slate-200">
          What sound are you chasing?
        </label>
        <textarea
          id="sound-prompt"
          name="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="e.g., I'm chasing the jangly chorus guitars from The Cure's Just Like Heaven."
          rows={5}
          className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          spellCheck={false}
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-full bg-teal-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Generate Recommendations
          </button>
          {isLoading && (
            <div className="flex items-center gap-3 text-sm text-slate-400" role="status" aria-live="polite">
              <div className="flex items-end gap-1">
                {[0, 1, 2, 3].map((bar) => (
                  <span
                    key={bar}
                    className="h-4 w-1 rounded-full bg-teal-300/80 animate-bounce"
                    style={{ animationDelay: `${bar * 150}ms` }}
                  />
                ))}
              </div>
              <span>{loadingPhrases[phraseIndex]}</span>
            </div>
          )}
        </div>
      </form>

      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
      )}

      {result ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Recommendation</p>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-invert prose-sm md:prose-base mt-3 max-w-none"
          >
            {result}
          </ReactMarkdown>
        </div>
      ) : (
        !isLoading && (
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Try one of these prompts</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {examplePrompts.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setPrompt(example)}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-left text-sm text-slate-200 transition hover:border-teal-400/60 hover:text-white"
                >
                  {example}
                </button>
              ))}
            </div>
          </section>
        )
      )}
    </div>
  );
}
