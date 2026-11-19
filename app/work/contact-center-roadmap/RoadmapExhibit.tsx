"use client";

import { useSyncExternalStore } from "react";
import type { MotionValue } from "framer-motion";
import {
  contactCenterSystems,
  systemsMilestones,
} from "@/content/experience-systems";
import {
  SystemsDiagram,
  useSystemsTimelineScroll,
} from "@/components/experience/SystemsTransformation";
import styles from "./roadmap.module.css";
import "@/components/experience/scroll-stories.css";
import "@/components/experience/editorial-refresh.css";

const stages = systemsMilestones.map((step) =>
  step.id === "baseline"
    ? { ...step, label: "16-system baseline", kind: "Starting point" }
    : step,
);

const motionQuery =
  "(min-height: 680px) and (prefers-reduced-motion: no-preference)";

function subscribeToMotion(onChange: () => void) {
  const preference = window.matchMedia(motionQuery);
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

function ExhibitStage({
  index,
  progress,
}: {
  index: number;
  progress?: MotionValue<number>;
}) {
  const stage = stages[index];
  return (
    <div
      className={styles.exhibitPanel}
      data-stage={stage.id}
      data-animated={progress ? true : undefined}
      id={`roadmap-view-${stage.id}`}
    >
      <div className={styles.stageCopy}>
        <p className={styles.eyebrow}>{stage.kind}</p>
        <h4>{stage.title}</h4>
        <p>{stage.detail}</p>
      </div>
      <div className={styles.map}>
        <SystemsDiagram index={index} progress={progress} />
      </div>
    </div>
  );
}

function AnimatedExhibit() {
  const { root, index, scrollYProgress, jumpTo } =
    useSystemsTimelineScroll<HTMLDivElement>();
  return (
    <div ref={root} className={styles.exhibitTrack}>
      <div className={styles.exhibitSticky}>
        <p className={styles.scrollHint}>
          Scroll to explore, or choose a milestone.
        </p>
        <div
          className={styles.exhibitTabs}
          role="group"
          aria-label="Tool map milestones"
        >
          {stages.map((stage, step) => (
            <button
              key={stage.id}
              type="button"
              className={styles.exhibitTab}
              aria-current={step === index ? "step" : undefined}
              onClick={() => jumpTo(step)}
            >
              {stage.label}
            </button>
          ))}
        </div>
        <ExhibitStage index={index} progress={scrollYProgress} />
      </div>
    </div>
  );
}

export default function RoadmapExhibit() {
  const animated = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );
  return (
    <figure
      className={styles.exhibit}
      id="roadmap-exhibit"
      data-mode={animated ? "scroll" : "reading"}
    >
      {animated ? (
        <AnimatedExhibit />
      ) : (
        <fieldset className={styles.exhibitFieldset}>
          <legend className="sr-only">
            Explore the tool map and quarterly targets
          </legend>
          <div className={styles.exhibitTabs}>
            {stages.map((stage, index) => (
              <label className={styles.exhibitTab} key={stage.id}>
                <input
                  className="sr-only"
                  type="radio"
                  name="contact-center-roadmap-view"
                  value={stage.id}
                  defaultChecked={index === 0}
                  aria-controls={`roadmap-view-${stage.id}`}
                />
                <span>{stage.label}</span>
              </label>
            ))}
          </div>
          <div className={styles.exhibitPanels}>
            {stages.map((stage, index) => (
              <ExhibitStage key={stage.id} index={index} />
            ))}
          </div>
        </fieldset>
      )}
      <figcaption className={styles.caption}>
        Tool map and quarterly targets redrawn from the Contact Center Roadmap
        (slides 13–16). The one-year state comes from the end-of-2024 progress
        review (slides 5–6).
      </figcaption>
      <details className={styles.transcript}>
        <summary>Read the exhibit as text</summary>
        <ol>
          {stages.map((stage) => (
            <li key={stage.id}>
              <strong>
                {stage.label} · {stage.kind}
              </strong>
              <p>{stage.detail}</p>
              {(stage.id === "baseline" || stage.id === "review") && (
                <p>
                  Systems in the diagram{" "}
                  {contactCenterSystems
                    .filter((system) =>
                      stage.id === "baseline" ? system.before : system.after,
                    )
                    .map((system) => system.label)
                    .join(", ")}
                  .
                </p>
              )}
            </li>
          ))}
        </ol>
      </details>
    </figure>
  );
}
