"use client";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import {
  contactCenterSystems,
  systemsMilestones,
} from "@/content/experience-systems";
import {
  quarterlySystemNodeFrame,
  systemsMilestoneStop,
  systemsTimelineFrame,
} from "@/lib/experience/systems-timeline";
import type { SystemNode } from "@/lib/experience/scroll-stories";
import { useShortViewport } from "./useShortViewport";

function Rings() {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="experience-system-rings"
    >
      <path d="M50 2 C79 1 99 22 98 51 C100 79 77 99 50 98 C21 99 1 77 2 49 C1 22 23 1 50 2Z" />
      <path d="M51 16 C73 16 87 33 87 53 C87 75 71 88 50 87 C28 88 15 72 15 52 C14 32 31 15 51 16Z" />
      <path d="M51 31 C65 30 75 40 74 54 C75 68 65 75 51 75 C37 76 28 66 28 53 C27 40 38 30 51 31Z" />
    </svg>
  );
}
function MovingNode({
  node,
  progress,
}: {
  node: SystemNode;
  progress: MotionValue<number>;
}) {
  const pose = useTransform(progress, (p) => quarterlySystemNodeFrame(p, node));
  const left = useTransform(pose, (p) => `${p.x}%`),
    top = useTransform(pose, (p) => `${p.y}%`);
  const opacity = useTransform(pose, (p) => p.opacity);
  const background = useTransform(pose, (p) =>
    p.highlighted ? "#dfc495" : "#f3eee4",
  );
  const borderColor = useTransform(pose, (p) =>
    p.highlighted ? "#a14835" : "#173f3d55",
  );
  return (
    <motion.span
      className="experience-system-node"
      data-system={node.id}
      data-new={!node.before}
      style={{ left, top, opacity, background, borderColor }}
    >
      {node.label}
    </motion.span>
  );
}
function Connections({
  index,
  animated,
}: {
  index: number;
  animated: boolean;
}) {
  const stage = systemsMilestones[index];
  const reduced = useReducedMotion();
  return (
    <svg
      className="experience-system-connections"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      {stage.edges.map(([from, to]) => {
        const start = contactCenterSystems.find((n) => n.id === from)!.before!;
        const end = contactCenterSystems.find((n) => n.id === to)!.before!;
        const dx = end[0] - start[0],
          dy = end[1] - start[1];
        const length = Math.hypot(dx, dy);
        const x = end[0] - (dx / length) * 9,
          y = end[1] - (dy / length) * 7;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        return (
          <g key={`${from}-${to}`}>
            <motion.path
              d={`M${start[0]} ${start[1]} Q${start[0]} ${end[1]} ${x} ${y}`}
              initial={
                animated && !reduced ? { pathLength: 0, opacity: 0 } : false
              }
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.55 }}
            />
            <path
              d="M-2 -1.5 L0 0 L-2 1.5"
              transform={`translate(${x.toFixed(4)} ${y.toFixed(4)}) rotate(${angle.toFixed(4)})`}
            />
          </g>
        );
      })}
    </svg>
  );
}
export function SystemsDiagram({
  progress,
  index,
}: {
  progress?: MotionValue<number>;
  index: number;
}) {
  const still = systemsMilestoneStop(index);
  return (
    <div className="experience-system-diagram" aria-hidden="true">
      <Rings />
      <Connections index={index} animated={Boolean(progress)} />
      <span className="experience-system-frequency experience-system-monthly">
        Monthly +
      </span>
      <span className="experience-system-frequency experience-system-daily">
        Daily
      </span>
      {contactCenterSystems.map((node) => {
        if (progress)
          return <MovingNode key={node.id} node={node} progress={progress} />;
        const pose = quarterlySystemNodeFrame(still, node);
        return pose.opacity > 0 ? (
          <span
            key={node.id}
            className="experience-system-node"
            data-system={node.id}
            data-new={!node.before}
            style={{
              left: `${pose.x}%`,
              top: `${pose.y}%`,
              background: pose.highlighted ? "#dfc495" : undefined,
            }}
          >
            {node.label}
          </span>
        ) : null;
      })}
    </div>
  );
}

export function useSystemsTimelineScroll<T extends HTMLElement>() {
  const root = useRef<T>(null);
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = systemsTimelineFrame(progress).index;
    setIndex((previous) => (previous === next ? previous : next));
  });

  function jumpTo(index: number) {
    const element = root.current;
    if (!element) return;
    const travel = element.offsetHeight - window.innerHeight;
    window.scrollTo({
      top:
        element.getBoundingClientRect().top +
        window.scrollY +
        travel * systemsMilestoneStop(index),
      behavior: "smooth",
    });
  }

  return { root, index, scrollYProgress, jumpTo };
}

export default function SystemsTransformation({
  reading,
}: {
  reading: boolean;
}) {
  const reduced = useReducedMotion(),
    short = useShortViewport();
  const staticView = reading || Boolean(reduced) || short;
  const { root, index, scrollYProgress, jumpTo } =
    useSystemsTimelineScroll<HTMLElement>();
  const stage = systemsMilestones[index];
  return (
    <>
      <section
        ref={root}
        id="experience-systems"
        className="experience-systems"
        data-static={staticView}
        data-quarter={stage.id}
        aria-labelledby="experience-systems-heading"
      >
        <div className="experience-systems-stage">
          <div className="experience-systems-copy">
            <p className="experience-home-eyebrow">
              Contact Center / A roadmap into progress
            </p>
            <h2 id="experience-systems-heading">
              <span>16</span> <i>→</i> <em>9</em> systems.
            </h2>
            {!staticView ? (
              <div className="experience-system-milestone">
                <p>
                  {stage.label} <span>{stage.kind}</span>
                </p>
                <h3>{stage.title}</h3>
                <p>{stage.detail}</p>
              </div>
            ) : (
              <p>
                Follow the quarterly roadmap targets into the reported one-year
                result.
              </p>
            )}
          </div>
          {staticView ? (
            <div className="experience-system-static-pair">
              {systemsMilestones.map((step, i) => (
                <figure key={step.id}>
                  <figcaption>
                    <strong>{step.label}</strong> · {step.kind}
                    <span>{step.title}</span>
                  </figcaption>
                  <SystemsDiagram index={i} />
                  <p>{step.detail}</p>
                </figure>
              ))}
            </div>
          ) : (
            <>
              <SystemsDiagram index={index} progress={scrollYProgress} />
              <ol
                className="experience-system-timeline"
                aria-label="Contact Center roadmap milestones"
              >
                {systemsMilestones.map((step, i) => (
                  <li key={step.id}>
                    <button
                      type="button"
                      aria-current={index === i ? "step" : undefined}
                      onClick={() => jumpTo(i)}
                    >
                      <span>0{i + 1}</span>
                      {step.label}
                    </button>
                  </li>
                ))}
              </ol>
            </>
          )}
          <p className="sr-only">
            The original sketch groups tools by daily and monthly use. The
            one-year review reports nine systems:{" "}
            {contactCenterSystems
              .filter((node) => node.after)
              .map((node) => node.label)
              .join(", ")}
            .
          </p>
        </div>
      </section>
      <div className="experience-systems-notes">
        <p className="experience-system-source">
          From my Contact Center Roadmap, slides 13–16, and one-year progress
          review, slides 5–6. Quarterly scenes are roadmap targets; the final
          scene is the reported result.
        </p>
        <p className="experience-system-outcome">
          A separate workflow improvement: partnering with OMS on in-system
          returns saved ~2,000 annual customer hold-time hours.
        </p>
      </div>
    </>
  );
}
