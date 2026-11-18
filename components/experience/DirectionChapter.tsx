"use client";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { careerNarrative as story } from "@/content/experience-narrative";
import { stackArrival } from "@/lib/experience/reveal-sequence";
import { useScrollSequence, useSequenceFits } from "./useScrollSequence";
import "./annotation-motion.css";

function DecisionCard({
  step,
  i,
  progress,
  active,
  animated,
  select,
}: {
  step: (typeof story.decisions)[number];
  i: number;
  progress: MotionValue<number>;
  active: boolean;
  animated: boolean;
  select(): void;
}) {
  const y = useTransform(
    progress,
    (p) => `${(1 - stackArrival(p, i, story.decisions.length)) * 135}%`,
  );
  const rotate = useTransform(
    progress,
    (p) => (1 - stackArrival(p, i, story.decisions.length)) * (i % 2 ? 5 : -5),
  );
  return (
    <motion.article
      className="experience-stack-card"
      data-active={active}
      style={animated ? { y, rotate, top: i * 56, zIndex: i + 1 } : undefined}
    >
      <h3>
        <button
          onClick={select}
          disabled={!animated}
          tabIndex={animated && !active ? -1 : 0}
        >
          <span>0{i + 1}</span>
          {step.question}
        </button>
      </h3>
      <div
        className="experience-stack-card-body"
        aria-hidden={animated && !active}
      >
        <p className="experience-home-eyebrow">{step.label}</p>
        <strong>{step.title}</strong>
        <p>{step.detail}</p>
        <Link tabIndex={animated && !active ? -1 : 0} href={step.source}>
          {step.sourceLabel} <ArrowUpRight size={15} />
        </Link>
      </div>
    </motion.article>
  );
}
export default function DirectionChapter({
  reading = false,
}: {
  paused: boolean;
  reading?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const fits = useSequenceFits();
  const animated = fits && !reduced && !reading;
  const { progress, index, select } = useScrollSequence(
    ref,
    story.decisions.length,
    animated,
  );
  return (
    <section
      ref={ref}
      className="experience-direction experience-home-section experience-direction-stack"
      id="experience-direction"
      aria-labelledby="experience-direction-heading"
      data-sequence={animated}
    >
      <div className="experience-sequence-stage experience-direction-stage">
        <div className="experience-direction-intro">
          <p className="experience-home-eyebrow">
            Working method / Create direction
          </p>
          <h2 id="experience-direction-heading">
            A way forward,
            <br />
            <em>before there’s a playbook.</em>
          </h2>
          <p className="experience-home-intro">
            Understand the problem. Choose what matters. Give people a useful
            next step.
          </p>
        </div>
        <div className="experience-card-deck">
          {story.decisions.map((step, i) => (
            <DecisionCard
              key={step.label}
              step={step}
              i={i}
              progress={progress}
              active={i === index}
              animated={animated}
              select={() => select(i)}
            />
          ))}
        </div>
        <div className="experience-sequence-footer">
          <span>
            {animated
              ? `0${index + 1} / 03 · Scroll to stack the next decision`
              : "Three decisions that move the work forward"}
          </span>
          <small>Authored method · Case studies linked in each card</small>
        </div>
      </div>
    </section>
  );
}
