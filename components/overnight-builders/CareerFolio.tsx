"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const notes = [
  {
    label: "Keep the qualification",
    title: "Projected stays projected.",
    quote: "$2.7M+ projected annual AI impact",
    detail:
      "The published résumé keeps the projection in the claim. Tailoring must preserve that qualification; the artifact does not turn a projection into realized revenue.",
    source: "/work/chatgpt-enterprise",
    sourceLabel: "Read the enterprise AI case study",
  },
  {
    label: "Change emphasis, preserve facts",
    title: "A role is a lens.",
    quote: "AI Product & Automation",
    detail:
      "The skills section makes the positioning visible. Role mapping can surface supported experience and keywords. Unsupported requirements remain true gaps, rather than new experience.",
    source: "#career-role-input",
    sourceLabel: "Inspect the actual role input",
  },
  {
    label: "Keep responsibility specific",
    title: "The work still needs an owner.",
    quote: "Senior Product Manager – AI Platform & Strategy",
    detail:
      "Experience, titles and dates remain tied to approved evidence. AI-assisted drafting and six advisory review perspectives support the workflow; Daniel retains final approval.",
    source: "#career-responsibility",
    sourceLabel: "Read Daniel’s role in this build",
  },
];

export default function CareerFolio() {
  const ref = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);
  const [reading, setReading] = useState(false);
  useEffect(() => {
    const fits = matchMedia("(min-width: 1100px) and (min-height: 680px)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    // Deep links prioritize a stable reading layout during hydration.
    const initialDeepLink = Boolean(location.hash);
    const update = () =>
      setAnimated(fits.matches && !reduced.matches && !initialDeepLink);
    update();
    fits.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fits.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);
  const moving = animated && !reading;
  const [activeNote, setActiveNote] = useState(0);
  useEffect(() => {
    if (!moving || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActiveNote(Number((entry.target as HTMLElement).dataset.note));
        }
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    ref.current
      .querySelectorAll("[data-note]")
      .forEach((note) => observer.observe(note));
    return () => observer.disconnect();
  }, [moving]);
  // Existing document regions; authored annotations, not generated reviewer findings.
  const highlight = [
    { top: "25.8%", height: "2.8%" },
    { top: "40%", height: "4.2%" },
    { top: "50.3%", height: "3.2%" },
  ][activeNote];
  return (
    <section
      className="career-folio"
      ref={ref}
      id="career-folio"
      data-motion={moving}
      aria-labelledby="career-folio-title"
    >
      <header className="career-folio-heading">
        <div>
          <p className="career-kicker">An annotated public artifact</p>
          <h2 id="career-folio-title">
            Read the document.
            <br />
            <em>Keep its boundaries.</em>
          </h2>
        </div>
        <div>
          <p>
            One existing ResumeCustomizer output, with authored reading notes.
            No new role-specific résumé or reviewer result is presented here.
          </p>
          {animated && (
            <button onClick={() => setReading(!reading)} aria-pressed={reading}>
              {reading
                ? "Enable document annotations"
                : "Read without moving annotations"}
            </button>
          )}
        </div>
      </header>
      <div className="career-folio-grid">
        <div className="career-margin-notes">
          {notes.map((note, index) => (
            <article key={note.label} data-note={index}>
              <p className="career-kicker">
                <span>0{index + 1}</span> / {note.label}
              </p>
              <h3>{note.title}</h3>
              <blockquote>“{note.quote}”</blockquote>
              <p>{note.detail}</p>
              <a href={note.source}>{note.sourceLabel} ↗</a>
            </article>
          ))}
        </div>
        <figure className="career-document">
          <div className="career-document-label">
            <span>Published résumé / Page 01</span>
            <span>Existing public PDF</span>
          </div>
          <div className="career-document-sheet">
            <Image
              unoptimized
              src="/images/experience/case-study-artwork/public-resume-output.webp"
              alt="First page of Daniel Nash’s published AI Product Leader résumé, including selected impact, skills and professional experience. The impact statement is explicitly projected."
              width={773}
              height={1000}
              sizes="(min-width:1100px) 440px, 90vw"
            />
            {moving && (
              <motion.div
                className="career-document-highlight"
                animate={highlight}
                transition={{ duration: 0.25, ease: "easeOut" }}
                aria-hidden="true"
              />
            )}
          </div>
          <figcaption>
            Reading notes are editorial annotations, not a source audit of this
            PDF.{" "}
            <a
              href="/resumes/daniel-nash-ai-product-leader.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Open the published PDF ↗
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
