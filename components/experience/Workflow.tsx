"use client";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  FileCheck2,
  SlidersHorizontal,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useRef } from "react";
import { evidenceExample, workflowStages } from "@/content/experience";
import { useScrollSequence, useSequenceFits } from "./useScrollSequence";
import "./annotation-motion.css";
const icons = [FileCheck2, SlidersHorizontal, ShieldCheck, UserCheck];
function Stage({ index }: { index: number }) {
  const stage = workflowStages[index],
    Icon = icons[index];
  return (
    <article className="experience-reasoning-beat">
      <Icon className="experience-reasoning-icon" aria-hidden="true" />
      <p className="experience-home-eyebrow">
        0{index + 1} / {stage.label}
      </p>
      <h3>{stage.title}</h3>
      <p>{stage.detail}</p>
      {index === 0 ? (
        <details className="experience-evidence-inspect">
          <summary>Inspect a supported statement</summary>
          <p>
            <mark>{evidenceExample.statement}</mark>
          </p>
          <Link href={evidenceExample.source}>
            Read Daniel’s responsibility <ArrowUpRight size={14} />
          </Link>
        </details>
      ) : null}
      {index === 3 ? (
        <Link href="/products/ai-career-operating-system">
          Explore the system <ArrowUpRight size={14} />
        </Link>
      ) : null}
    </article>
  );
}
export default function Workflow({
  reading = false,
  paused = false,
}: {
  reading?: boolean;
  paused?: boolean;
}) {
  const ref = useRef<HTMLElement>(null),
    reduced = useReducedMotion(),
    fits = useSequenceFits();
  const animated = fits && !reduced && !reading;
  const { index, select } = useScrollSequence(
    ref,
    workflowStages.length,
    animated,
  );
  return (
    <section
      ref={ref}
      className="experience-ai-proof experience-home-section experience-reasoning-sequence"
      id="experience-ai"
      aria-labelledby="experience-ai-title"
      data-sequence={animated}
    >
      <div className="experience-sequence-stage experience-reasoning-stage">
        <header>
          <p className="experience-home-eyebrow">
            From prototype to inspectable work
          </p>
          <h2 id="experience-ai-title">
            Make the reasoning <em>visible.</em>
          </h2>
          <p className="experience-walkthrough-label">
            AI Career Operating System · Authored walkthrough
          </p>
        </header>
        {animated ? (
          <>
            <nav className="experience-beat-nav" aria-label="Workflow stages">
              {workflowStages.map((stage, i) => (
                <button
                  key={stage.id}
                  aria-current={i === index ? "step" : undefined}
                  onClick={() => select(i)}
                >
                  <span>0{i + 1}</span>
                  {stage.label}
                </button>
              ))}
            </nav>
            <div className="experience-beat-window">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: paused ? 0 : 0.2 }}
                >
                  <Stage index={index} />
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="experience-static-beats">
            {workflowStages.map((stage, i) => (
              <Stage key={stage.id} index={i} />
            ))}
          </div>
        )}
        <footer className="experience-sequence-footer">
          <span>
            {animated
              ? "Scroll through the decisions ↓"
              : evidenceExample.limitation}
          </span>
          <span>AI-assisted checks · Final human approval</span>
        </footer>
      </div>
    </section>
  );
}
