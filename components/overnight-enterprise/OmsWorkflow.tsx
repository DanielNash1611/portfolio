"use client";
import MediaFrame from "@/components/site/MediaFrame";
import NarrativeGraphic from "./NarrativeGraphic";
import useNarrativeStages from "./useNarrativeStages";
import "./enterprise.css";
export type WorkflowScreen = {
  title: string;
  description: string;
  src: string;
  alt: string;
};
export default function OmsWorkflow({
  screens,
}: {
  screens: readonly WorkflowScreen[];
}) {
  const { root, active, choose, reading, setReading, ready } =
    useNarrativeStages();
  const labels = [
    "Look up the order",
    "Confirm the action",
    "Inspect the result",
  ];
  return (
    <div
      className="enterprise-workflow enterprise-scroll-story"
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
        <p className="enterprise-eyebrow">Public prototype / simulated data</p>
        <NarrativeGraphic kind="oms" active={active} />
        <div
          className="enterprise-controls"
          role="group"
          aria-label="Inspect the actual OMS prototype states"
        >
          {screens.map((screen, i) => (
            <button
              key={screen.title}
              type="button"
              disabled={!ready}
              aria-pressed={active === i}
              aria-controls={`oms-workflow-state-${i}`}
              onClick={() => choose(i)}
            >
              <span>0{i + 1}</span>
              {labels[i]}
            </button>
          ))}
        </div>
        <p
          className="enterprise-stage-status"
          aria-live="polite"
          aria-atomic="true"
        >
          {active + 1} / {screens.length} · {labels[active]}
        </p>
      </div>
      <div id="oms-workflow-state" className="enterprise-scroll-copy">
        {screens.map((screen, i) => (
          <article
            key={screen.title}
            id={`oms-workflow-state-${i}`}
            data-enterprise-stage={i}
            data-active={active === i}
            className="enterprise-narrative-step enterprise-oms-step"
          >
            <p className="enterprise-eyebrow">
              0{i + 1} / Actual prototype screen
            </p>
            <h3>{screen.title}</h3>
            <p>{screen.description}</p>
            <MediaFrame
              src={screen.src}
              alt={screen.alt}
              fallbackTitle={screen.title}
              sizes="(min-width: 900px) 55vw, 90vw"
              className="mt-7 aspect-[16/11] bg-white border border-[#14273330]"
              imageClassName="object-contain"
              expandable
            />
            <p className="mt-5">
              {i === 1
                ? "The confirmation screen is a deliberate pause before a consequential action."
                : i === 2
                  ? "This is a recorded prototype state, not a live order action."
                  : "No real order is retrieved or changed on this page."}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
