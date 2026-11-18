"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight, MoveRight } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { careerNarrative } from "@/content/experience-narrative";
import "./conductor-cue.css";

const perspectives = [
  {
    question: "What matters?",
    outcome: "A clear priority",
    startY: 487,
    angle: -7,
  },
  {
    question: "Who needs to align?",
    outcome: "People aligned",
    startY: 548,
    angle: 5,
  },
  {
    question: "What happens next?",
    outcome: "A practical next step",
    startY: 510,
    angle: -5,
  },
];

function ClarityStep({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const item = perspectives[index];
  const x = 26 + index * 211;
  const y = useTransform(progress, [0, 1], [item.startY - 520, 0]);
  const rotate = useTransform(progress, [0, 1], [item.angle, 0]);
  const questionOpacity = useTransform(
    progress,
    [0, 0.35, 0.7, 1],
    [1, 1, 0, 0],
  );
  const outcomeOpacity = useTransform(
    progress,
    [0, 0.45, 0.8, 1],
    [0, 0, 1, 1],
  );
  const path = useTransform(
    progress,
    [0, 1],
    [
      `M ${x} 546 C ${x + 48} 506, ${x + 100} 594, ${x + 185} 551`,
      `M ${x} 546 C ${x + 48} 546, ${x + 100} 546, ${x + 185} 546`,
    ],
  );
  return (
    <motion.g style={{ y, rotate }}>
      <motion.path d={path} />
      <circle cx={x} cy={546} r={3.5} />
      <motion.text
        x={x}
        y={526}
        style={{ opacity: questionOpacity }}
        className="cue-question"
      >
        {item.question}
      </motion.text>
      <motion.text
        x={x}
        y={526}
        style={{ opacity: outcomeOpacity }}
        className="cue-outcome"
      >
        {item.outcome}
      </motion.text>
      <motion.text
        x={x}
        y={578}
        style={{ opacity: outcomeOpacity }}
        className="cue-step-number"
      >
        0{index + 1}
      </motion.text>
    </motion.g>
  );
}

/** A metaphor for bringing perspectives together, not a claim of sole authorship. */
export default function ConductorCue({
  quiet,
  paused,
}: {
  quiet: boolean;
  paused: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const composition = useRef<HTMLDivElement>(null);
  const [focusMode, setFocusMode] = useState<"scroll" | "questions" | "clear">(
    "scroll",
  );
  const focused = focusMode === "clear";
  const progress = useMotionValue(1);
  const { scrollYProgress } = useScroll({
    target: composition,
    offset: ["85% 65%", "85% 40%"],
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!quiet && !paused && focusMode === "scroll") progress.set(value);
  });
  useEffect(() => {
    if (quiet) progress.set(1);
    else if (paused) return;
    else if (focusMode !== "scroll") {
      const animation = animate(progress, focusMode === "clear" ? 1 : 0, {
        duration: 0.7,
        ease: [0.2, 0.7, 0.2, 1],
      });
      return () => animation.stop();
    } else progress.set(scrollYProgress.get());
  }, [quiet, paused, focusMode, progress, scrollYProgress]);
  const ruleWidth = useTransform(progress, [0, 1], ["14%", "100%"]);
  return (
    <section
      ref={root}
      id="experience-intro"
      className="conductor-cue"
      aria-labelledby="experience-intro-title"
      data-quiet={quiet}
      data-paused={paused}
      data-focused={focused}
    >
      <div className="cue-copy">
        <p className="experience-home-eyebrow">{careerNarrative.eyebrow}</p>
        <p className="cue-name">
          Daniel Nash<span>.</span>
        </p>
        <h1 id="experience-intro-title">
          I build clarity
          <br />
          where there
          <br />
          <em>isn’t any.</em>
        </h1>
        <p className="cue-description">{careerNarrative.description}</p>
        <div className="cue-actions">
          <a className="cue-primary" href="#experience-outcomes">
            See how I lead <ArrowDown size={17} aria-hidden="true" />
          </a>
          <a href="#experience-products">
            Explore the products <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div ref={composition} className="cue-composition">
        <p className="cue-perspectives">Many inputs. One way forward.</p>
        <figure className="cue-portrait">
          <Image
            src="/portraits/hero_square_photo.webp"
            alt="Daniel Nash smiling in a natural portrait."
            width={900}
            height={900}
            sizes="(max-width: 759px) 64vw, 38vw"
            priority
          />
          <figcaption>
            Make sense of the noise.
            <br />
            <em>Find a shared direction.</em>
          </figcaption>
        </figure>
        <svg
          className="cue-clarity-map"
          viewBox="0 0 650 600"
          fill="none"
          role="img"
          aria-label="Questions about priorities, people and next steps resolve into a clear priority, people aligned, and a practical next step."
        >
          {[0, 1, 2].map((index) => (
            <ClarityStep key={index} index={index} progress={progress} />
          ))}
        </svg>
        <span className="cue-margin-note" aria-hidden="true">
          Clarity, made together.
        </span>
      </div>
      <div className="cue-coda">
        <span>Clarity is a team effort.</span>
        {!quiet && (
          <button
            type="button"
            className="cue-focus-control"
            aria-pressed={focused}
            onClick={() => {
              const nextMode = focused ? "questions" : "clear";
              if (paused) progress.set(nextMode === "clear" ? 1 : 0);
              setFocusMode(nextMode);
            }}
          >
            {focused ? "Revisit the questions" : "Bring it into focus"}
            <MoveRight size={15} aria-hidden="true" />
          </button>
        )}
        <motion.i style={{ width: ruleWidth }} aria-hidden="true" />
      </div>
    </section>
  );
}
