"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { ExperienceHomeContent } from "@/content/experience-home";
import { useScrollSequence, useSequenceFits } from "./useScrollSequence";
import "./annotation-motion.css";
const words = ["Value.", "Trust.", "People."];
export default function PrinciplesChapter({
  content,
  reading,
  paused,
}: {
  content: ExperienceHomeContent["positioning"];
  reading: boolean;
  paused: boolean;
}) {
  const ref = useRef<HTMLElement>(null),
    reduced = useReducedMotion(),
    fits = useSequenceFits();
  const animated = fits && !reduced && !reading;
  const { index, select } = useScrollSequence(
    ref,
    content.categories.length,
    animated,
  );
  const category = content.categories[index];
  return (
    <section
      ref={ref}
      id="experience-principles"
      className="experience-principles experience-home-section experience-values-sequence"
      data-sequence={animated}
      aria-labelledby="experience-principles-heading"
    >
      <div className="experience-sequence-stage experience-values-stage">
        <header>
          <p className="experience-home-eyebrow">{content.eyebrow}</p>
          <h2 id="experience-principles-heading">
            Value. Trust. Human capability.
          </h2>
        </header>
        {animated ? (
          <>
            <div className="experience-value-window">
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: paused ? 0 : 0.25 }}
                >
                  <span className="experience-value-word" aria-hidden="true">
                    {words[index]}
                  </span>
                  <div>
                    <span>0{index + 1} / 03</span>
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
            <nav
              className="experience-beat-nav"
              aria-label="What Daniel optimizes for"
            >
              {content.categories.map((item, i) => (
                <button
                  key={item.title}
                  onClick={() => select(i)}
                  aria-current={index === i ? "step" : undefined}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </>
        ) : (
          <div className="experience-static-values">
            {content.categories.map((item, i) => (
              <article key={item.title}>
                <span>0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        )}
        {animated ? (
          <p className="experience-values-hint">
            Scroll to the next principle ↓
          </p>
        ) : null}
      </div>
    </section>
  );
}
