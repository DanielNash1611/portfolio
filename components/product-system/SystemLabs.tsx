"use client";

import { useEffect, useReducer, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  FileText,
  GitBranch,
  Pause,
  Play,
  RotateCcw,
  StepForward,
} from "lucide-react";
import {
  lifecycleStates,
  opportunityStates,
  loopSteps,
} from "@/content/product-system";

type SequenceState = { frame: number; elapsed: number; playing: boolean };
type SequenceAction =
  | { type: "tick" }
  | { type: "play"; reduced: boolean }
  | { type: "pause" }
  | { type: "select"; frame: number }
  | { type: "reset" };
function useSequence(count: number, duration = 2800) {
  const reducedMotion = useReducedMotion();
  const [state, dispatch] = useReducer(
    (state: SequenceState, action: SequenceAction): SequenceState => {
      switch (action.type) {
        case "tick": {
          if (!state.playing) return state;
          const elapsed = state.elapsed + 80;
          if (elapsed < duration) return { ...state, elapsed };
          return state.frame === count - 1
            ? { ...state, elapsed: duration, playing: false }
            : { frame: state.frame + 1, elapsed: 0, playing: true };
        }
        case "play":
          if (action.reduced)
            return { frame: count - 1, elapsed: duration, playing: false };
          return state.frame === count - 1 && state.elapsed >= duration
            ? { frame: 0, elapsed: 0, playing: true }
            : { ...state, playing: true };
        case "pause":
          return { ...state, playing: false };
        case "select":
          return { frame: action.frame, elapsed: duration, playing: false };
        case "reset":
          return { frame: 0, elapsed: 0, playing: false };
      }
    },
    { frame: 0, elapsed: 0, playing: false },
  );
  useEffect(() => {
    if (!state.playing) return;
    const timer = window.setInterval(() => dispatch({ type: "tick" }), 80);
    const pauseWhenHidden = () => {
      if (document.hidden) dispatch({ type: "pause" });
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", pauseWhenHidden);
    };
  }, [state.playing]);
  useEffect(() => {
    if (reducedMotion) dispatch({ type: "pause" });
  }, [reducedMotion]);
  return {
    ...state,
    progress: Math.min(1, state.elapsed / (duration * 0.7)),
    reducedMotion,
    play: () => dispatch({ type: "play", reduced: Boolean(reducedMotion) }),
    pause: () => dispatch({ type: "pause" }),
    select: (frame: number) => dispatch({ type: "select", frame }),
    reset: () => dispatch({ type: "reset" }),
  };
}
type Sequence = ReturnType<typeof useSequence>;
function SequenceControls({
  sequence,
  labels,
  name,
}: {
  sequence: Sequence;
  labels: string[];
  name: string;
}) {
  return (
    <div className="lab-sequence-controls">
      <div className="lab-play-controls">
        <button
          type="button"
          onClick={sequence.playing ? sequence.pause : sequence.play}
          aria-label={`${sequence.playing ? "Pause" : "Play"} ${name}`}
        >
          {sequence.playing ? <Pause size={15} /> : <Play size={15} />}{" "}
          {sequence.playing
            ? "Pause"
            : sequence.reducedMotion
              ? "Show result"
              : sequence.frame === labels.length - 1
                ? "Replay"
                : "Play"}
        </button>
        <button
          type="button"
          onClick={() =>
            sequence.select(Math.min(labels.length - 1, sequence.frame + 1))
          }
          disabled={sequence.frame === labels.length - 1}
          aria-label={`Next step in ${name}`}
        >
          <StepForward size={16} />
        </button>
        <button
          type="button"
          onClick={sequence.reset}
          aria-label={`Reset ${name}`}
        >
          <RotateCcw size={15} />
        </button>
      </div>
      <div
        className="lab-sequence-steps"
        role="group"
        aria-label={`${name} steps`}
      >
        {labels.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={index === sequence.frame}
            onClick={() => sequence.select(index)}
          >
            <span>{index + 1}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

const brainstormIdeas = [
  {
    source: "New teammate",
    text: "I can’t find the right guide.",
    type: "Opportunity",
    final: "Make guidance easier to find",
    branch: "find",
  },
  {
    source: "Developer",
    text: "What about better search?",
    type: "Possible solution",
    final: "Improve search",
    branch: "find",
  },
  {
    source: "AI brainstorm",
    text: "An assistant that cites its sources?",
    type: "Possible solution",
    final: "Explore a cited assistant",
    branch: "find",
  },
  {
    source: "Business partner",
    text: "Which answer is still current?",
    type: "Opportunity",
    final: "Make guidance easier to trust",
    branch: "trust",
  },
];
export function BrainstormStudio() {
  const sequence = useSequence(3, 3000);
  const captions = [
    "Capture the thought before asking anyone to classify it.",
    "Look for the need behind a suggested feature.",
    "An idea can become an opportunity or a solution. Keep alternatives open.",
  ];
  return (
    <section
      className="system-lab brainstorm-lab"
      aria-labelledby="brainstorm-title"
    >
      <div className="lab-heading">
        <div>
          <p className="system-eyebrow">Imagine / an illustrative brainstorm</p>
          <h2 id="brainstorm-title">Ideas come from everywhere.</h2>
        </div>
        <span className="lab-small-label">Try the sequence</span>
      </div>
      <div className="brainstorm-prompt">
        <span>The question</span>How could new teammates find reliable answers?
      </div>
      <div
        className={`brainstorm-canvas brainstorm-phase-${sequence.frame}`}
        aria-label="Ideas being connected and classified"
      >
        <div className="brainstorm-thread" aria-hidden="true" />
        <div className="brainstorm-center">
          <GitBranch size={20} />
          <span>
            {sequence.frame === 0
              ? "Collect possibilities"
              : sequence.frame === 1
                ? "Find the underlying need"
                : "Give ideas structure"}
          </span>
        </div>
        <div className="brainstorm-ideas">
          {brainstormIdeas.map((idea, index) => (
            <div
              className={`brainstorm-note brainstorm-note-${index}`}
              key={idea.source}
              data-kind={sequence.frame === 2 ? idea.type : "Idea"}
            >
              <span>{sequence.frame === 2 ? idea.type : idea.source}</span>
              <p>{sequence.frame === 2 ? idea.final : idea.text}</p>
              <small>
                {sequence.frame === 0
                  ? "Unclassified idea"
                  : idea.branch === "find"
                    ? "↳ Find the answer"
                    : "↳ Trust the answer"}
              </small>
            </div>
          ))}
        </div>
      </div>
      <p className="lab-caption" aria-live="polite">
        {captions[sequence.frame]}
      </p>
      <SequenceControls
        sequence={sequence}
        labels={["Gather", "Connect", "Classify"]}
        name="brainstorm"
      />
    </section>
  );
}

const treeNodes = [
  {
    id: "find",
    title: "Make guidance easier to find",
    type: "Opportunity",
    stage: "Discovery",
  },
  {
    id: "trust",
    title: "Make guidance easier to trust",
    type: "Opportunity",
    stage: "Discovery",
  },
  {
    id: "search",
    title: "Improve search",
    type: "Solution",
    stage: "Delivery",
  },
  {
    id: "assistant",
    title: "Explore a cited assistant",
    type: "Solution",
    stage: "Discovery",
  },
  {
    id: "owners",
    title: "Show owners & review dates",
    type: "Solution",
    stage: "Impact",
  },
];
const initialStages = Object.fromEntries(
  treeNodes.map((node) => [node.id, node.stage]),
);
export function OpportunityTreeLab() {
  const [selected, setSelected] = useState("search");
  const [stages, setStages] = useState(initialStages);
  const [change, setChange] = useState(
    "Select a node, then change its lifecycle state.",
  );
  const node = treeNodes.find((node) => node.id === selected)!;
  const choices =
    node.type === "Opportunity" ? opportunityStates : lifecycleStates;
  function move(stage: string) {
    const previous = stages[selected];
    setStages((current) => ({ ...current, [selected]: stage }));
    setChange(
      `${node.title}: ${previous} → ${stage}. Other nodes keep their own states.`,
    );
  }
  function renderNode(id: string) {
    const item = treeNodes.find((node) => node.id === id)!;
    return (
      <button
        type="button"
        className={`lab-tree-node ${item.type === "Opportunity" ? "lab-tree-opportunity" : "lab-tree-solution"}`}
        aria-pressed={selected === id}
        onClick={() => setSelected(id)}
      >
        <span className="lab-node-type">{item.type}</span>
        <strong>{item.title}</strong>
        <span className="lab-node-state" data-stage={stages[id]}>
          {stages[id]}
        </span>
      </button>
    );
  }
  return (
    <section className="system-lab" aria-labelledby="tree-lab-title">
      <div className="lab-heading">
        <div>
          <p className="system-eyebrow">
            Explore an example / changes stay on this page
          </p>
          <h2 id="tree-lab-title">One tree. Different states.</h2>
        </div>
        <button
          className="lab-reset"
          type="button"
          onClick={() => {
            setStages(initialStages);
            setSelected("search");
            setChange("Example reset. Select a node to explore.");
          }}
        >
          <RotateCcw size={14} />
          Reset tree
        </button>
      </div>
      <div className="lab-tree-workspace">
        <div
          className="lab-tree-diagram"
          role="group"
          aria-label="Opportunity–solution tree"
        >
          <div className="lab-tree-outcome">
            <span className="lab-node-type">Desired outcome</span>
            <strong>New teammates find reliable answers</strong>
          </div>
          <div className="lab-tree-fork">
            <div className="lab-tree-branch">
              {renderNode("find")}
              <div className="lab-tree-leaves">
                {renderNode("search")}
                {renderNode("assistant")}
              </div>
            </div>
            <div className="lab-tree-branch">
              {renderNode("trust")}
              <div className="lab-tree-leaves single-leaf">
                {renderNode("owners")}
              </div>
            </div>
          </div>
        </div>
        <div className="lab-tree-inspector">
          <p className="system-eyebrow">Selected {node.type.toLowerCase()}</p>
          <h3>{node.title}</h3>
          <label htmlFor="tree-lifecycle">Lifecycle state</label>
          <select
            id="tree-lifecycle"
            value={stages[selected]}
            onChange={(event) => move(event.target.value)}
          >
            {choices.map((state) => (
              <option key={state.title}>{state.title}</option>
            ))}
          </select>
          <p>
            {choices.find((state) => state.title === stages[selected])?.body}
          </p>
          <div className="lab-tree-insight">
            <GitBranch size={19} />
            <p>
              {node.type === "Opportunity"
                ? "Opportunities can stay open while several solutions are tested. Delivery applies to a solution."
                : "Moving this solution changes only this node. Its opportunity and sibling solutions remain independent."}
            </p>
          </div>
          {stages[selected] !== "Discovery" && (
            <button
              type="button"
              className="lab-text-button"
              onClick={() => move("Discovery")}
            >
              <RotateCcw size={14} />
              New evidence? Return to Discovery
            </button>
          )}
        </div>
      </div>
      <p className="lab-caption" role="status">
        {change}
      </p>
    </section>
  );
}

const prdFrames = [
  "Read context",
  "Frame",
  "Draft",
  "Specify",
  "Review",
  "Refine",
];
const prdSections = [
  {
    title: "Opportunity",
    text: "New teammates need a reliable way to find the current guidance without interrupting a colleague.",
    frame: 1,
  },
  {
    title: "Proposed experience",
    text: "Ask a question → see a cited answer → open the source. If there is no current source, say so.",
    frame: 2,
  },
  {
    title: "Acceptance criteria",
    text: "Every answer links to a source. Missing evidence produces an explicit unknown. No unsupported answer is presented as fact.",
    frame: 3,
  },
];
export function PrdDraftDemo() {
  const sequence = useSequence(6, 3100);
  const review = sequence.frame >= 4;
  const refined = sequence.frame === 5;
  return (
    <section className="system-lab prd-lab" aria-labelledby="prd-demo-title">
      <div className="lab-heading">
        <div>
          <p className="system-eyebrow">
            Define / scripted AI-assisted example
          </p>
          <h2 id="prd-demo-title">Watch context become a PRD.</h2>
        </div>
        <span className="lab-small-label">
          Example content · no live AI call
        </span>
      </div>
      <div className="prd-workspace">
        <div className="prd-inputs">
          <p className="system-eyebrow">Give the assistant context</p>
          <div>
            <span>01 / User need</span>
            <p>Find the right answer without asking around.</p>
          </div>
          <div>
            <span>02 / Constraint</span>
            <p>Use current, attributable guidance.</p>
          </div>
          <div>
            <span>03 / Unknown</span>
            <p>Will people trust the answer enough to use it?</p>
          </div>
          <div
            className={`prd-human-review ${review ? "is-visible" : ""}`}
            aria-hidden={!review}
          >
            <span>PM + developer review</span>
            <p>
              “Citations help. But how will we know a source is still current?”
            </p>
          </div>
        </div>
        <div className="prd-document">
          <div className="prd-document-bar">
            <span>
              <FileText size={15} />
              product / PRD.md
            </span>
            <span>
              {refined
                ? "Revised draft"
                : review
                  ? "Human review"
                  : sequence.frame === 0
                    ? "Context ready"
                    : "AI draft"}
            </span>
          </div>
          <div className="prd-paper">
            <p className="system-eyebrow">Living product definition</p>
            <h3>A reliable first answer</h3>
            {sequence.frame === 0 ? (
              <div className="prd-empty">
                <span className="prd-cursor" aria-hidden="true" />
                <p>
                  The brief is ready.
                  <br />
                  Play to see a first draft take shape.
                </p>
              </div>
            ) : (
              prdSections
                .filter((section) => section.frame <= sequence.frame)
                .map((section) => {
                  const isWriting = sequence.frame === section.frame;
                  const visibleText = isWriting
                    ? section.text.slice(
                        0,
                        Math.floor(section.text.length * sequence.progress),
                      )
                    : section.text;
                  return (
                    <div className="prd-section" key={section.title}>
                      <h4>{section.title}</h4>
                      <p>
                        <span aria-hidden={isWriting || undefined}>
                          {visibleText}
                          {isWriting && sequence.playing && (
                            <span className="prd-cursor" aria-hidden="true" />
                          )}
                        </span>
                        {isWriting && (
                          <span className="sr-only">{section.text}</span>
                        )}
                      </p>
                    </div>
                  );
                })
            )}
            {refined && (
              <div className="prd-revision">
                <span>
                  <Check size={14} />
                  Refined after review
                </span>
                <p>
                  A source needs an owner and review date. Flag stale guidance
                  before answering. Add stale-source cases to the eval plan.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="prd-handoff">
        <span className={refined ? "is-ready" : ""}>Living PRD</span>
        <ArrowRight size={16} />
        <span>Repo context</span>
        <ArrowRight size={16} />
        <span>Build + verify</span>
        <ArrowRight size={16} />
        <span>Update the PRD ↶</span>
      </div>
      <p className="lab-caption" aria-live="polite">
        {review
          ? refined
            ? "The team’s feedback changes the definition and the eval plan."
            : "People review the draft, challenge assumptions, and decide what to change."
          : "AI assembles a draft from supplied context. The team remains responsible for the definition."}
      </p>
      <SequenceControls
        sequence={sequence}
        labels={prdFrames}
        name="PRD demonstration"
      />
    </section>
  );
}

const evidenceChoices = [
  {
    question: "Can it work?",
    method: "Technical POC + evals",
    scenario:
      "Try the assistant with known answers, missing sources, and stale guidance.",
    supports: "Behavior under the conditions tested.",
    limit: "Not proof that people will find it useful.",
    artifact: "A bounded proof of concept",
    icon: "01",
  },
  {
    question: "Can people use it?",
    method: "Observe a real task",
    scenario: "Watch a new teammate find an answer and inspect its source.",
    supports: "Where the experience helps or creates confusion.",
    limit: "Not proof of broad adoption or business impact.",
    artifact: "A usable prototype",
    icon: "02",
  },
  {
    question: "Does it create value?",
    method: "Pilot + outcome evidence",
    scenario:
      "Compare the workflow in real use with a baseline. Investigate other explanations.",
    supports: "An outcome signal, with the study’s limits.",
    limit: "A before-and-after change alone does not establish causality.",
    artifact: "A usable product in real work",
    icon: "03",
  },
];
export function EvidenceExplorer() {
  const [selected, setSelected] = useState(0);
  const choice = evidenceChoices[selected];
  return (
    <section
      className="system-lab evidence-lab"
      aria-labelledby="evidence-lab-title"
    >
      <div className="lab-heading">
        <div>
          <p className="system-eyebrow">Test / choose the question</p>
          <h2 id="evidence-lab-title">
            Different questions. Different evidence.
          </h2>
        </div>
      </div>
      <div
        className="lab-choice-row"
        role="group"
        aria-label="Learning questions"
      >
        {evidenceChoices.map((item, index) => (
          <button
            type="button"
            key={item.question}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <span>{item.icon}</span>
            {item.question}
          </button>
        ))}
      </div>
      <div className="evidence-flow" key={selected}>
        <div>
          <span className="system-eyebrow">Make</span>
          <h3>{choice.artifact}</h3>
        </div>
        <ArrowRight className="lab-flow-arrow" size={22} />
        <div>
          <span className="system-eyebrow">Try</span>
          <h3>{choice.method}</h3>
          <p>{choice.scenario}</p>
        </div>
        <ArrowRight className="lab-flow-arrow" size={22} />
        <div>
          <span className="system-eyebrow">Learn</span>
          <h3>{choice.supports}</h3>
        </div>
      </div>
      <p className="lab-caption" aria-live="polite">
        <strong>Claim boundary</strong> {choice.limit}
      </p>
    </section>
  );
}

export function ArtifactExplorer() {
  const [selected, setSelected] = useState(0);
  const artifacts = [
    {
      title: "Sketch",
      purpose: "Make an experience discussable.",
      state: "Discovery",
      result: "A conversation about the approach",
      className: "artifact-sketch",
    },
    {
      title: "POC",
      purpose: "Answer a bounded feasibility question.",
      state: "Discovery / Ready for Delivery",
      result: "Evidence for the next commitment",
      className: "artifact-poc",
    },
    {
      title: "MVP",
      purpose: "Create and test value in real work.",
      state: "Delivery → Impact",
      result: "A usable increment and outcome evidence",
      className: "artifact-mvp",
    },
  ];
  const item = artifacts[selected];
  return (
    <section className="system-lab" aria-labelledby="artifact-title">
      <div className="lab-heading">
        <div>
          <p className="system-eyebrow">
            Build / choose the smallest useful artifact
          </p>
          <h2 id="artifact-title">Build to answer a question.</h2>
        </div>
      </div>
      <div className="lab-choice-row" role="group" aria-label="Artifact types">
        {artifacts.map((item, index) => (
          <button
            key={item.title}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className="artifact-workspace">
        <div
          className={`artifact-drawing ${item.className}`}
          aria-hidden="true"
        >
          <div className="artifact-window">
            <span />
            <span />
            <span />
          </div>
          <div className="artifact-query">Where is the current guidance?</div>
          <div className="artifact-answer">
            <div />
            <div />
            <div />
          </div>
          <div className="artifact-source">
            {selected === 0
              ? "Source goes here"
              : selected === 1
                ? "✓ Source check passes"
                : "Open the current source →"}
          </div>
        </div>
        <div className="artifact-explanation" aria-live="polite">
          <p className="system-eyebrow">{item.state}</p>
          <h3>{item.purpose}</h3>
          <p>Leave with: {item.result}.</p>
        </div>
      </div>
    </section>
  );
}

export function RefinementFlow() {
  return (
    <section className="system-lab" aria-labelledby="refine-title">
      <div className="lab-heading">
        <div>
          <p className="system-eyebrow">Refine / close the loop</p>
          <h2 id="refine-title">Evidence changes the definition.</h2>
        </div>
      </div>
      <div className="refinement-flow">
        <div>
          <span className="system-eyebrow">We assumed</span>
          <p>A citation makes an answer trustworthy.</p>
        </div>
        <ArrowRight className="lab-flow-arrow" size={21} />
        <div>
          <span className="system-eyebrow">We observed</span>
          <p>The cited page was out of date.</p>
        </div>
        <ArrowRight className="lab-flow-arrow" size={21} />
        <div>
          <span className="system-eyebrow">We changed</span>
          <p>Show freshness. Flag stale sources. Add an eval.</p>
        </div>
      </div>
      <div className="refinement-return">
        <RotateCcw size={17} />
        Update the PRD, implementation, and tests together.
      </div>
    </section>
  );
}

export function ProductLoopLab() {
  const [step, setStep] = useState(0);
  return (
    <div className="product-loop-lab">
      <div
        className="lab-loop-selector"
        role="group"
        aria-label="Choose a development activity"
      >
        {loopSteps.map((item, index) => (
          <button
            key={item.title}
            type="button"
            aria-pressed={step === index}
            onClick={() => setStep(index)}
          >
            <span>0{index + 1}</span>
            {item.title}
            <ArrowRight size={15} />
          </button>
        ))}
      </div>
      {step === 0 && <BrainstormStudio />}
      {step === 1 && <PrdDraftDemo />}
      {step === 2 && <ArtifactExplorer />}
      {step === 3 && <EvidenceExplorer />}
      {step === 4 && <RefinementFlow />}
      <p className="lab-loop-footnote">
        <RotateCcw size={14} />
        Revisit any activity. This loop runs across lifecycle states.
      </p>
    </div>
  );
}
