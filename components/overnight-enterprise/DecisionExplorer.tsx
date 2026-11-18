"use client";
import NarrativeGraphic, { type GraphicKind } from "./NarrativeGraphic";
import useNarrativeStages from "./useNarrativeStages";
export type Decision = {
  label: string;
  title: string;
  body: readonly string[];
  signal: string;
};
export default function DecisionExplorer({
  label,
  steps,
  kind = "pilot",
}: {
  label: string;
  steps: readonly Decision[];
  kind?: GraphicKind;
}) {
  const { root, active, choose, reading, setReading, ready } =
    useNarrativeStages();
  return (
    <div
      className="enterprise-explorer enterprise-scroll-story"
      ref={root}
      data-reading={reading}
      data-enhanced={ready}
    >
      <div className="enterprise-scroll-art">
        <button
          type="button"
          disabled={!ready}
          className="enterprise-reading-toggle"
          aria-pressed={reading}
          onClick={() => setReading((value) => !value)}
        >
          Read this sequence without motion {reading ? "✓" : "+"}
        </button>
        <p className="enterprise-eyebrow">{label}</p>
        <NarrativeGraphic kind={kind} active={active} />
        <div className="enterprise-controls" role="group" aria-label={label}>
          {steps.map((step, i) => (
            <button
              key={step.label}
              type="button"
              disabled={!ready}
              aria-pressed={active === i}
              aria-controls={`enterprise-stage-${i}`}
              onClick={() => choose(i)}
            >
              <span>0{i + 1}</span>
              {step.label}
            </button>
          ))}
        </div>
        <p
          className="enterprise-stage-status"
          aria-live="polite"
          aria-atomic="true"
        >
          {active + 1} / {steps.length} · {steps[active].label}
        </p>
      </div>
      <div id="enterprise-decision" className="enterprise-scroll-copy">
        {steps.map((step, i) => (
          <article
            key={step.label}
            id={`enterprise-stage-${i}`}
            data-enterprise-stage={i}
            data-active={active === i}
            className="enterprise-narrative-step"
          >
            <p className="enterprise-eyebrow">{step.signal}</p>
            <h3>{step.title}</h3>
            <ul>
              {step.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
