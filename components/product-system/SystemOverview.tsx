"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSystemHref } from "./SystemExperience";
import { ArrowDown, Check, MessageSquare } from "lucide-react";
import { BuildConversationDemo } from "./BuildConversationDemo";
import { useReducedMotion } from "framer-motion";

export function SystemOverview() {
  const router = useRouter();
  const workspaceHref = useSystemHref("playbook");
  return (
    <div className="system-journey" id="method-in-brief">
      <header className="story-intro story-build-intro system-wrap">
        <div>
          <p className="system-eyebrow">
            Daniel Nash / Product Operating System
          </p>
          <h1>
            Think it through. <em>Then let it build.</em>
          </h1>
          <p>
            Brainstorm with AI. Review the PRD. Build, try, refine—with the
            product context carried into every cycle.
          </p>
        </div>
      </header>
      <div className="system-wrap">
        <BuildConversationDemo onTryIdea={() => router.push(workspaceHref)} />
      </div>
    </div>
  );
}

const incomingIdeas = [
  {
    source: "A message from a business partner",
    quote: "Could we add an AI assistant?",
    opportunity: null,
    solution: "An AI assistant",
    question: "What would it help someone do?",
    reply:
      "New teammates find three different setup guides. They don’t know which answer to trust.",
  },
  {
    source: "A comment during onboarding",
    quote: "Three guides. Different answers. I’m stuck.",
    opportunity: "Find guidance you can trust",
    solution: null,
    question: "Where are the conflicting answers getting in your way?",
    reply:
      "I’m trying to set up my account. I can find the guides, but I can’t tell which one is current.",
  },
  {
    source: "An observation from support",
    quote: "We keep explaining the same setup steps.",
    opportunity: null,
    solution: null,
    question: "Who needs help, and what’s making setup difficult?",
    reply:
      "New teammates ask us which setup guide is current. The conflicting answers keep bringing them back.",
  },
] as const;

/** A focused intake example; editable drafts live only in the workspace. */
export function IdeaIntakeExample() {
  const [selected, setSelected] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [focusTarget, setFocusTarget] = useState<number | null>(null);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const idea = incomingIdeas[selected];

  useEffect(() => {
    if (focusTarget === null) return;
    const heading = headings.current[focusTarget];
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({
      behavior: reducedMotion ? "instant" : "smooth",
      block: "start",
    });
    setFocusTarget(null);
  }, [focusTarget, reducedMotion]);

  function advance(step: number) {
    setRevealed((current) => Math.max(current, step));
    setFocusTarget(step);
  }
  return (
    <div className="system-journey" id="method-in-brief">
      <section
        className="story-arrival system-wrap"
        aria-labelledby="story-arrival-title"
      >
        <div className="story-section-label">
          <h2 id="story-arrival-title" className="system-eyebrow">
            01 / Imagine — start with what arrives
          </h2>
          <span>Illustrative examples · pick a note</span>
        </div>
        <div className="story-intake">
          <div className="story-inbox" role="group" aria-label="Incoming ideas">
            {incomingIdeas.map((item, index) => (
              <button
                type="button"
                className="story-note"
                key={item.source}
                aria-pressed={selected === index}
                aria-controls="story-first-reading"
                onClick={() => {
                  setSelected(index);
                  setRevealed(0);
                }}
              >
                <span>
                  {item.source}
                  {selected === index && <Check size={14} aria-hidden="true" />}
                </span>
                <q>{item.quote}</q>
              </button>
            ))}
          </div>
          <div
            className="story-first-reading"
            id="story-first-reading"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="system-eyebrow">What can we say from this alone?</p>
            <div key={selected} className="story-node-pair story-enter">
              <div
                className={`story-node ${idea.opportunity ? "" : "story-node-empty"}`}
              >
                <span>
                  Opportunity <small>The need</small>
                </span>
                <p>{idea.opportunity || "Still open"}</p>
                {!idea.opportunity && (
                  <small>
                    {selected === 2
                      ? "A signal to investigate; the need isn’t clear yet."
                      : "A feature request doesn’t tell us the need."}
                  </small>
                )}
              </div>
              <div
                className={`story-node ${idea.solution ? "" : "story-node-empty"}`}
              >
                <span>
                  Possible solution <small>A response</small>
                </span>
                <p>{idea.solution || "Still open"}</p>
                {!idea.solution && (
                  <small>No response has been proposed yet.</small>
                )}
              </div>
            </div>
            <p className="story-takeaway">
              Keep the original thought. Leave the gaps open.
            </p>
          </div>
        </div>
        <div className="story-actions">
          <button
            type="button"
            className="story-next"
            onClick={() => advance(1)}
            aria-expanded={revealed >= 1}
            aria-controls="story-discovery"
          >
            Ask what’s behind it <ArrowDown size={17} />
          </button>
        </div>
      </section>

      {revealed >= 1 && (
        <section
          className="story-discovery story-enter"
          id="story-discovery"
          aria-labelledby="story-discovery-title"
        >
          <div className="system-wrap">
            <p className="system-eyebrow">02 / Imagine → Define</p>
            <h2
              id="story-discovery-title"
              tabIndex={-1}
              ref={(node) => {
                headings.current[1] = node;
              }}
            >
              A little context changes the picture.
            </h2>
            <div className="story-conversation">
              <p>
                <MessageSquare size={17} aria-hidden="true" />
                <span>{idea.question}</span>
              </p>
              <blockquote>
                <p>“{idea.reply}”</p>
                <cite>An illustrative follow-up</cite>
              </blockquote>
            </div>
            <div
              className="story-tree"
              aria-label="An opportunity with two possible solutions"
            >
              <div className="story-tree-outcome">
                <span>Proposed outcome</span>
                <strong>New teammates find reliable answers</strong>
              </div>
              <div className="story-tree-need">
                <span>Opportunity · Discovery</span>
                <strong>Know which setup guidance to trust</strong>
              </div>
              <div className="story-tree-options">
                <div>
                  <span>Possible solution</span>
                  <strong>An assistant with current sources</strong>
                </div>
                <div>
                  <span>Another possible solution</span>
                  <strong>Guides with owners & review dates</strong>
                </div>
              </div>
            </div>
            <p className="story-takeaway">
              One need. Several possible responses. Discovery gives the idea
              structure; it doesn’t prove a solution will work.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
