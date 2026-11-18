"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import "./scout-artwork.css";

const screens = [
  { label: "Explore the map", image: "aster-map-close.webp" },
  { label: "Inspect a relationship", image: "aster-relationship-close.webp" },
  { label: "Follow its source", image: "aster-relationship-close.webp" },
] as const;

/** Real Mechanisms workspace captures, populated only with invented demo data. */
export default function ScoutArtwork({
  progress,
  quiet,
}: {
  progress: MotionValue<number>;
  quiet: boolean;
}) {
  const [step, setStep] = useState(0);
  const scrollSelection = useRef(0);
  useMotionValueEvent(progress, "change", (value) => {
    if (quiet) return;
    const next = value < 0.38 ? 0 : value < 0.62 ? 1 : 2;
    // Keep a manual choice until scrolling crosses another narrative beat.
    if (next !== scrollSelection.current) {
      scrollSelection.current = next;
      setStep(next);
    }
  });
  return (
    <figure
      className="experience-artwork experience-artwork-scout"
      data-step={step}
    >
      <p className="experience-artwork-kicker">
        Immunology Scout / Real app
        <span>Fictional Aster study</span>
      </p>
      <div className="experience-scout-screen">
        <div className="experience-scout-screen-label">
          <span>Mechanisms</span>
          <span>Map · Relationships · Evidence</span>
        </div>
        <AnimatePresence initial={false}>
          <motion.div
            key={screens[step].image}
            className="experience-scout-map"
            initial={{ opacity: quiet ? 1 : 0 }}
            animate={{ opacity: step === 2 ? 0.35 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: quiet ? 0 : 0.35 }}
          >
            <Image
              src={`/images/experience/scout/${screens[step].image}`}
              alt={
                step === 0
                  ? "Actual Immunology Scout mechanism graph showing an invented Aster study, with fictional entities and distinct support, inference, conflict, and gap relationships."
                  : "The actual graph after selecting a fictional relationship, with its two connected nodes highlighted."
              }
              fill
              sizes="(min-width:900px) 48vw, 90vw"
            />
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {step === 2 ? (
            <motion.div
              className="experience-scout-source"
              initial={{ x: quiet ? 0 : 35, opacity: quiet ? 1 : 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: quiet ? 0 : 35, opacity: 0 }}
              transition={{ duration: quiet ? 0 : 0.4 }}
            >
              <Image
                src="/images/experience/scout/aster-source-detail.webp"
                alt="Actual source inspection panel showing an explicitly fictional study note, its document identifier, access level, and extraction method."
                fill
                sizes="(min-width:900px) 22vw, 60vw"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <figcaption>
        <span>{screens[step].label}</span>
        <div role="group" aria-label="Immunology Scout preview screens">
          {screens.map((screen, index) => (
            <button
              key={screen.label}
              type="button"
              aria-label={screen.label}
              aria-pressed={index === step}
              onClick={() => setStep(index)}
            >
              <span aria-hidden="true">0{index + 1}</span>
            </button>
          ))}
        </div>
      </figcaption>
    </figure>
  );
}
