"use client";

import { useState } from "react";
import "./cases.css";

const sequences = {
  adoption: {
    label: "From pilot to operating model",
    note: "Authored summary of the case evidence. Pilot estimates and later adoption figures describe different stages.",
    stages: [
      {
        title: "Prove value",
        kicker: "Six-month pilot",
        value: "~$2.7M",
        unit: "annualized impact estimate",
        detail:
          "A controlled contact-center pilot compared agent performance with a matched control group. The estimate annualizes the pilot result; it is not booked annual revenue.",
        signals: [
          "Workflow discovery",
          "Matched control",
          "Revenue + efficiency",
        ],
      },
      {
        title: "Build trust",
        kicker: "Operating model",
        value: "Governance",
        unit: "and a network of champions",
        detail:
          "Workflow design, governance, enablement, and cross-functional partnership created the conditions for wider adoption. Daniel led the operating model with partners across the business.",
        signals: [
          "Legal + Security",
          "Reusable workflows",
          "Champions + training",
        ],
      },
      {
        title: "Scale use",
        kicker: "Broader company adoption",
        value: "~800",
        unit: "daily active users",
        detail:
          "The footprint grew from roughly 150 licensed users and 40 daily active users to roughly 1,000 licensed users and 800 daily active users. These are adoption figures, separate from the pilot impact estimate.",
        signals: [
          "~1,000 licensed",
          "~800 daily active",
          "Feedback + iteration",
        ],
      },
    ],
  },
  platform: {
    label: "From prototype to platform thinking",
    note: "Conceptual capability map informed by the published prototype and UX study. It does not depict a deployed enterprise architecture.",
    stages: [
      {
        title: "Prototype",
        kicker: "Functional custom GPT",
        value: "Discovery",
        unit: "start with a customer problem",
        detail:
          "Daniel led a hackathon team to build a functional AI prototype for Guitar Center customers. Sound Synthesist is the origin of this story, rather than evidence of a shipped omnichannel platform.",
        signals: [
          "Customer intent",
          "Product discovery",
          "Try the prototype below",
        ],
      },
      {
        title: "Validate",
        kicker: "Follow-up UX study",
        value: "87%",
        unit: "said they would use it again",
        detail:
          "Participants expressed strong intent to reuse the experience. This is a study response, rather than production retention or proof that the concept scaled.",
        signals: [
          "Customer feedback",
          "Use-again intent",
          "Early value signal",
        ],
      },
      {
        title: "Reuse",
        kicker: "Strategic direction",
        value: "Capabilities",
        unit: "that could serve more workflows",
        detail:
          "The work shaped a focus on reusable AI systems, workflow-based adoption, and platform-led iteration. Ecommerce, in-store, and contact-center extensions remain labeled concepts in the story below.",
        signals: ["Reusable patterns", "Workflow fit", "Conceptual extensions"],
      },
    ],
  },
  planning: {
    label: "A shared system for planning",
    note: "Authored model of the documented JPD rollout, not a screenshot of the internal workspace.",
    stages: [
      {
        title: "Capture",
        kicker: "One strategy layer",
        value: "Shared ideas",
        unit: "connected to delivery",
        detail:
          "Daniel established a unified Jira Product Discovery workspace connected to existing Jira Software projects, giving opportunities and delivery work a shared home.",
        signals: ["Opportunities", "OKRs", "Delivery links"],
      },
      {
        title: "Compare",
        kicker: "Consistent criteria",
        value: "RICE",
        unit: "a shared language for prioritization",
        detail:
          "Reach, Impact, Confidence, and Effort made initiatives comparable. Portfolio views exposed themes, dependencies, ownership, and impact versus effort so teams could discuss tradeoffs together.",
        signals: ["Reach + Impact", "Confidence + Effort", "Cross-team views"],
      },
      {
        title: "Enable",
        kicker: "Eight-week curriculum",
        value: "9 PMs",
        unit: "adopted in the core product organization",
        detail:
          "Daniel led live training, coaching, and planning sessions. All nine product managers in the core organization adopted the approach, with organic uptake from teams without an official PM.",
        signals: ["Live training", "1:1 coaching", "Rolling prioritization"],
      },
    ],
  },
};

export default function DecisionSequence({
  kind,
}: {
  kind: keyof typeof sequences;
}) {
  const sequence = sequences[kind];
  const [selected, setSelected] = useState(0);
  const stage = sequence.stages[selected];
  return (
    <figure
      className={`oc-sequence oc-sequence-${kind}`}
      aria-label={sequence.label}
    >
      <p className="oc-sequence-label">{sequence.label}</p>
      <div
        className="oc-steps"
        role="group"
        aria-label="Explore the decision sequence"
      >
        {sequence.stages.map((item, index) => (
          <button
            key={item.title}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <span>0{index + 1}</span>
            {item.title}
          </button>
        ))}
      </div>
      <div className="oc-stage" aria-live="polite" aria-atomic="true">
        <p className="oc-kicker">{stage.kicker}</p>
        <p className="oc-value">{stage.value}</p>
        <p className="oc-unit">{stage.unit}</p>
        <div className="oc-signal-line" aria-hidden="true">
          {stage.signals.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </div>
        <p className="oc-detail">{stage.detail}</p>
      </div>
      <figcaption>{sequence.note}</figcaption>
    </figure>
  );
}
