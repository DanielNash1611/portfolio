"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useJourneyPosition } from "./SystemExperience";
import { useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Code2, FileText } from "lucide-react";
import {
  buildMessages,
  buildStages,
  buildTasks,
} from "@/content/product-build-demo";

const messageTypingDelay = 250;
const messageTypingDuration = 1400;

function DemoArtifact({ frame }: { frame: number }) {
  const message = buildMessages[frame];
  const [perspective, setPerspective] = useState<"audience" | "cello">(
    "audience",
  );
  const kind = message.artifact;
  const approved =
    frame >= buildMessages.findIndex((item) => item.artifact === "approved");

  if (kind === "idea" || kind === "scope")
    return (
      <div className="build-idea-artifact" key={kind}>
        <div className="build-artifact-label">The idea taking shape</div>
        <div className="build-orbit-study" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>Gravity</span>
          <b>●</b>
          <b>●</b>
          <b>●</b>
        </div>
        <h3>Move inside the music.</h3>
        <p>A concert work becomes an explorable spatial composition.</p>
        {kind === "scope" ? (
          <ul className="build-scope-list">
            <li>Change where you listen</li>
            <li>Keep performers independent</li>
            <li>Start with a browser MVP</li>
          </ul>
        ) : (
          <p className="build-open-question">
            Still open: what should the listener be able to do?
          </p>
        )}
        <span className="build-artifact-footnote">
          Your idea stays central as the details emerge.
        </span>
      </div>
    );

  if (kind === "prd" || kind === "review" || kind === "approved")
    return (
      <div className="build-prd-artifact">
        <div className="build-artifact-label">
          <FileText size={15} /> docs/PRD.md{" "}
          <span>
            {approved
              ? "Approved"
              : kind === "review"
                ? "Revised draft"
                : "For review"}
          </span>
        </div>
        <div className="build-paper" key={kind}>
          <p className="build-paper-kicker">
            Product requirements / abbreviated
          </p>
          <h3>Gravity</h3>
          <p className="build-paper-deck">
            An interactive spatial music experience.
          </p>
          <h4>First MVP</h4>
          <p>
            Cello at the center. Independent orbiting performers. Spatial audio.
            Atomic & Celestial views.
          </p>
          <h4>The whole experience</h4>
          <p className="build-experience-flow">
            Cello alone → introduce performers → explore perspectives → cello
            alone
          </p>
          <div className={kind !== "prd" ? "build-prd-change" : ""}>
            <h4>
              {kind === "prd" ? "Acceptance criteria" : "What must stay true"}
            </h4>
            {kind === "prd" ? (
              <p>
                Switch perspectives, hear performers move, and return to cello
                alone.
              </p>
            ) : (
              <ul>
                <li>No shared tempo or synchronized entrances.</li>
                <li>Visible and audible positions must agree.</li>
              </ul>
            )}
          </div>
          {approved && (
            <div className="build-approval">
              <Check size={15} /> Daniel approves → the build can begin
            </div>
          )}
        </div>
      </div>
    );

  if (kind === "build")
    return (
      <div className="build-run-artifact">
        <div className="build-artifact-label">
          <Code2 size={16} /> Building from the approved PRD
        </div>
        <div className="build-contract">
          <Check size={15} /> Product intent approved
        </div>
        <h3>Build with the context open.</h3>
        <div className="build-context-source">
          <span>Agent instructions → docs/PRD.md</span>
          <strong>
            Independent performers. One coherent listener journey.
          </strong>
          <p>Revisit this at decisions, then verify it in the product.</p>
        </div>
        <ol className="build-task-list">
          {buildTasks.map((task, index) => (
            <li
              key={task}
              data-state={
                index < (message.buildProgress ?? 0)
                  ? "done"
                  : index === message.buildProgress
                    ? "active"
                    : "waiting"
              }
            >
              <span>
                {index < (message.buildProgress ?? 0) ? (
                  <Check size={14} />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </span>
              <div>
                {task}
                {index === message.buildProgress && (
                  <small>In progress in this replay</small>
                )}
              </div>
            </li>
          ))}
        </ol>
        <span className="build-artifact-footnote">
          Condensed build sequence · no code is running here.
        </span>
      </div>
    );

  return (
    <div className="build-mvp-artifact">
      <div className="build-artifact-label">
        {kind === "refine"
          ? "A working product to refine"
          : "Something you can try"}
        <span>MVP</span>
      </div>
      <div className="build-product-preview">
        <Image
          src={
            perspective === "cello"
              ? "/images/gravity/app/gravity-cello-perspective.png"
              : "/images/gravity/app/gravity-atomic-field.png"
          }
          alt={
            perspective === "cello"
              ? "Actual Gravity app capture from the cello listening perspective."
              : "Actual Gravity app capture with performers orbiting the central cello."
          }
          width={1280}
          height={720}
          sizes="(max-width: 700px) 90vw, 480px"
        />
        <span>Gravity / browser experience</span>
      </div>
      <div
        className="build-preview-controls"
        role="group"
        aria-label="Compare Gravity screenshots"
      >
        <button
          type="button"
          onClick={() => setPerspective("audience")}
          aria-pressed={perspective === "audience"}
        >
          Audience view
        </button>
        <button
          type="button"
          onClick={() => setPerspective("cello")}
          aria-pressed={perspective === "cello"}
        >
          Cello view
        </button>
      </div>
      <p className="build-capture-note">
        Real app screenshots, including later refinements.
      </p>
      {kind === "refine" ? (
        <div className="build-refinement-note">
          <span>New session → read current context</span>
          <strong>Change the visuals. Preserve musical independence.</strong>
          <p>
            Read the PRD & design references → refine → check the whole flow →
            record the agreed change and why.
          </p>
        </div>
      ) : (
        <div className="build-refinement-note">
          <span>Try one real task</span>
          <strong>Listen from the audience, then the cello.</strong>
          <p>
            Does the change in perspective deliver the experience you wanted?
          </p>
        </div>
      )}
      <a
        href="https://gravity.danielnash.co"
        target="_blank"
        rel="noreferrer"
        className="build-live-link"
      >
        Try the real Gravity <ArrowUpRight size={15} />
      </a>
    </div>
  );
}

export function BuildConversationDemo({
  onTryIdea,
}: {
  onTryIdea?: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const chat = useRef<HTMLDivElement>(null);
  const position = useJourneyPosition();
  const [frame, setFrame] = useState(() => position.read().demo.frame);
  const [elapsed, setElapsed] = useState(() => position.read().demo.elapsed);
  useEffect(() => {
    position.update({ demo: { frame, elapsed } });
  }, [position, frame, elapsed]);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [following, setFollowing] = useState(true);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const current = buildMessages[frame];
  const stage = buildStages[current.stage];
  const nextFrame = buildMessages.findIndex(
    (message) => message.stage === current.stage + 1,
  );
  const stepEnd = nextFrame === -1 ? buildMessages.length - 1 : nextFrame - 1;
  const messageTypedAt =
    current.author === "Daniel"
      ? 0
      : messageTypingDelay + messageTypingDuration;
  // Prepare the next prompt as soon as the reply is visible, without a reading pause.
  const stepComplete = frame === stepEnd && elapsed >= messageTypedAt;
  const complete = nextFrame === -1 && stepComplete;
  const nextPrompt =
    nextFrame !== -1
      ? buildMessages[nextFrame].text
      : onTryIdea
        ? "Now I’ll try this with my own idea."
        : "Let’s revisit the idea and start another cycle.";
  const promptDuration = 1800;
  const promptElapsed = stepComplete ? elapsed - messageTypedAt : 0;
  const ready =
    stepComplete && (reducedMotion || promptElapsed >= promptDuration);
  const running =
    visible && pageVisible && !ready && !reducedMotion && !transcriptOpen;
  const typedLength =
    current.author === "Daniel" || reducedMotion
      ? current.text.length
      : Math.floor(
          (Math.max(0, elapsed - messageTypingDelay) / messageTypingDuration) *
            current.text.length,
        );
  const shownText = current.text.slice(0, typedLength);
  const shownPrompt = nextPrompt.slice(
    0,
    reducedMotion
      ? nextPrompt.length
      : Math.floor((promptElapsed / promptDuration) * nextPrompt.length),
  );
  const continueLabel =
    nextFrame !== -1
      ? `Continue to ${buildStages[current.stage + 1].title}`
      : onTryIdea
        ? "Try my own idea"
        : "Continue to Brainstorm";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.intersectionRatio >= 0.15),
      { threshold: 0.15 },
    );
    if (root.current) observer.observe(root.current);
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!reducedMotion) return;
    setFrame(stepEnd);
    setElapsed(buildMessages[stepEnd].duration + promptDuration);
  }, [reducedMotion, stepEnd]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () => setElapsed((value) => value + 80),
      80,
    );
    return () => window.clearInterval(timer);
  }, [running]);
  useEffect(() => {
    // A step can animate its own messages, but only Continue starts the next step.
    if (!running || elapsed < current.duration || frame >= stepEnd) return;
    setFrame((value) => value + 1);
    setElapsed(0);
  }, [current.duration, elapsed, frame, running, stepEnd]);
  useEffect(() => {
    if (!following || !chat.current) return;
    // Scroll the conversation only. Playback never pulls the webpage away from the reader.
    chat.current.scrollTo({
      top: chat.current.scrollHeight,
      behavior: "instant",
    });
  }, [frame, shownText, shownPrompt, following]);

  function selectStage(index: number) {
    const start = buildMessages.findIndex((message) => message.stage === index);
    const next = buildMessages.findIndex(
      (message) => message.stage === index + 1,
    );
    const end = next === -1 ? buildMessages.length - 1 : next - 1;
    setFrame(reducedMotion ? end : start);
    setElapsed(
      reducedMotion ? buildMessages[end].duration + promptDuration : 0,
    );
    setFollowing(true);
    setTranscriptOpen(false);
  }
  function continueConversation() {
    if (!ready) return;
    if (nextFrame !== -1) selectStage(current.stage + 1);
    else if (onTryIdea) onTryIdea();
    else selectStage(0);
  }
  function readEarlierMessages() {
    setFollowing(false);
  }

  return (
    <section
      className="build-demo"
      id="build-cycle"
      ref={root}
      aria-labelledby="build-demo-title"
    >
      <div className="build-demo-heading">
        <div>
          <h2 id="build-demo-title" tabIndex={-1}>
            Watch Gravity take shape.
          </h2>
        </div>
        <span className="build-demo-provenance">
          Gravity · condensed reenactment
        </span>
      </div>
      <div
        className="build-stage-track"
        role="group"
        aria-label="Jump to a part of the build cycle"
      >
        {buildStages.map((item, index) => (
          <button
            type="button"
            key={item.title}
            aria-label={`Go to ${item.title}`}
            aria-pressed={current.stage === index}
            onClick={() => selectStage(index)}
          >
            <span>
              {index < current.stage ? <Check size={13} /> : `0${index + 1}`}
            </span>
            <strong>{item.title}</strong>
            <small>{item.activity}</small>
          </button>
        ))}
      </div>
      <div className="build-step-caption">
        <p role="status" aria-live="polite">
          <span>
            {current.stage + 1} / {buildStages.length} · {stage.title}
          </span>
          {stage.takeaway}
        </p>
        <div className="build-context-caption">
          <span>
            <FileText size={13} /> Persistent agent context
          </span>
          <p>{stage.context}</p>
        </div>
      </div>
      <div className="build-studio">
        <div className="build-chat-column">
          <div className="build-chat-top">
            <span className="build-chat-mark">G</span>
            <div>
              <strong>Gravity</strong>
              <span>Idea → PRD → first MVP</span>
            </div>
            <span className="build-replay-label">Demo replay</span>
          </div>
          <div
            className="build-chat-log"
            ref={chat}
            role="region"
            aria-label="Conversation replay"
            tabIndex={0}
            onWheel={readEarlierMessages}
            onTouchMove={readEarlierMessages}
            onKeyDown={(event) => {
              if (
                [
                  "ArrowUp",
                  "ArrowDown",
                  "PageUp",
                  "PageDown",
                  "Home",
                  "End",
                ].includes(event.key)
              )
                readEarlierMessages();
            }}
          >
            <p className="build-chat-intro">
              Each step plays automatically. Send the next prompt below when
              you’re ready to continue.
            </p>
            {buildMessages.slice(0, frame + 1).map((message, index) => (
              <article
                className={`build-message ${message.author === "Daniel" ? "build-message-user" : "build-message-ai"}`}
                key={index}
              >
                <span className="build-message-author">
                  {message.author === "Daniel" ? (
                    "Daniel"
                  ) : message.author === "AI builder" ? (
                    <>
                      <Code2 size={14} /> AI builder
                    </>
                  ) : (
                    "AI collaborator"
                  )}
                </span>
                <div>
                  <p>
                    {index === frame
                      ? shownText || "Thinking through the next step…"
                      : message.text}
                    {index === frame &&
                      running &&
                      shownText.length < message.text.length && (
                        <span
                          className="build-typing-cursor"
                          aria-hidden="true"
                        />
                      )}
                  </p>
                  {message.artifact === "approved" && (
                    <span className="build-inline-approval">
                      <Check size={13} /> PRD approved · build authorized
                    </span>
                  )}
                </div>
              </article>
            ))}
            {complete && (
              <p className="build-chat-end">
                <Check size={15} /> One cycle complete. Keep learning from the
                product.
              </p>
            )}
          </div>
          <button
            type="button"
            className="build-demo-composer"
            disabled={!ready}
            onClick={continueConversation}
            aria-label={continueLabel}
            aria-describedby="build-next-prompt"
          >
            <span className="build-composer-label">
              {nextFrame !== -1
                ? `Next prompt · ${buildStages[current.stage + 1].title}`
                : "Your turn"}
            </span>
            <span className="build-composer-prompt" id="build-next-prompt">
              {stepComplete ? (
                <>
                  {shownPrompt}
                  {!ready && (
                    <span className="build-typing-cursor" aria-hidden="true" />
                  )}
                </>
              ) : (
                <span className="build-composer-placeholder">
                  The next prompt will appear here…
                </span>
              )}
            </span>
            <span className="build-composer-footer">
              <span role="status" aria-live="polite">
                {ready
                  ? "Ready when you are"
                  : stepComplete
                    ? "Preparing the prompt…"
                    : "Playing this step…"}
              </span>
              <span className="build-composer-send">
                {complete && onTryIdea ? "Try my idea" : "Continue"}{" "}
                <ArrowUp size={15} />
              </span>
            </span>
          </button>
        </div>
        <aside className="build-artifact" aria-label="The output taking shape">
          <DemoArtifact frame={frame} />
        </aside>
      </div>
      <div className="build-demo-bottom">
        <details
          open={transcriptOpen}
          onToggle={(event) => {
            const open = event.currentTarget.open;
            setTranscriptOpen(open);
          }}
        >
          <summary>Read the full conversation</summary>
          <p className="build-transcript-note">
            Reconstructed from Gravity’s PRD and portfolio story, not a verbatim
            transcript. Build activity and context checkpoints illustrate the
            method; they are not a historical tool log or live execution.
          </p>
          <ol>
            {buildMessages.map((message, index) => (
              <li key={index}>
                <span>
                  {buildStages[message.stage].title} / {message.author}
                </span>
                <p>{message.text}</p>
              </li>
            ))}
          </ol>
          <Link href="/creative/gravity#process">
            Read the actual Gravity process <ArrowUpRight size={14} />
          </Link>
        </details>
      </div>
    </section>
  );
}
