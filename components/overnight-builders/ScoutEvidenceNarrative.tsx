"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowRight, BookOpen, RotateCcw } from "lucide-react";
import { scoutSceneAt, scoutScenes } from "./scout-narrative-content";

export default function ScoutEvidenceNarrative() {
  const ref = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(true);
  const [fits, setFits] = useState(false);
  const [reading, setReading] = useState(false);
  const [scene, setScene] = useState<0 | 1 | 2 | 3>(0);
  useEffect(() => {
    // Four captions and the complete source frame must fit below the site header.
    const query = window.matchMedia(
      "(min-width: 1100px) and (min-height: 680px)",
    );
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setFits(query.matches);
      setReduced(preference.matches);
    };
    update();
    query.addEventListener("change", update);
    preference.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      preference.removeEventListener("change", update);
    };
  }, []);
  const animated = fits && !reduced && !reading;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (animated) setScene(scoutSceneAt(value));
  });
  const relationshipOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.34],
    [0, 1],
  );
  const mapScale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.45, 0.64],
    [0.96, 1, 1, 0.98],
  );
  const mapX = useTransform(scrollYProgress, [0.45, 0.72], ["0%", "-12%"]);
  const mapOpacity = useTransform(scrollYProgress, [0.52, 0.72], [1, 0.28]);
  const sourceX = useTransform(scrollYProgress, [0.52, 0.74], ["115%", "0%"]);
  const sourceOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const sourceScale = useTransform(scrollYProgress, [0.82, 1], [1, 1.16]);
  const trackScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scrollSelection = (
    index: number,
    behavior: ScrollBehavior = "smooth",
  ) => {
    const section = ref.current;
    if (!section) return;
    const start = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: start + travel * [0.04, 0.44, 0.76, 0.96][index],
      behavior,
    });
  };
  const toggleReading = () => {
    const next = !reading;
    setReading(next);
    requestAnimationFrame(() => {
      if (next)
        document
          .getElementById(scoutScenes[scene].id)
          ?.scrollIntoView({ behavior: "auto", block: "start" });
      else scrollSelection(scene, "auto");
    });
  };
  return (
    <>
      <section
        className="scout-evidence-story"
        id="scout-evidence"
        ref={ref}
        data-animated={animated}
        aria-label="Follow the evidence in Immunology Scout"
      >
        <div className="scout-story-toolbar">
          <p>
            Actual app captures <span>Fictional Aster study</span>
          </p>
          {fits && !reduced ? (
            <button onClick={toggleReading} aria-pressed={reading}>
              {reading ? (
                <>
                  <RotateCcw size={14} /> Return to scroll story
                </>
              ) : (
                <>
                  <BookOpen size={14} /> Read without motion
                </>
              )}
            </button>
          ) : (
            <span className="scout-reading-indicator">
              Reading view · Complete evidence trail
            </span>
          )}
        </div>
        {animated ? (
          <div className="scout-pinned-scene">
            <div className="scout-scene-heading">
              <p className="scout-kicker">From connection to source</p>
              <p className="scout-scroll-invitation">
                <ArrowDown size={14} /> Scroll to follow
              </p>
              <span>0{scene + 1} / 04</span>
            </div>
            <div className="scout-scene-layout">
              <div className="scout-scene-copy">
                <nav aria-label="Evidence story scenes">
                  {scoutScenes.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => scrollSelection(index)}
                      aria-current={scene === index ? "step" : undefined}
                    >
                      <span>0{index + 1}</span>
                      {item.label}
                      <ArrowRight size={15} />
                    </button>
                  ))}
                </nav>
                <div className="scout-scene-caption">
                  <p className="scout-kicker">{scoutScenes[scene].label}</p>
                  <h2>{scoutScenes[scene].title}</h2>
                  <p>{scoutScenes[scene].detail}</p>
                </div>
              </div>
              <figure
                className="scout-artifact-stage"
                aria-label="Actual interface captures progressing from map to relationship and source"
              >
                <div className="scout-artifact-meta">
                  <span>Immunology Scout / Mechanisms</span>
                  <span>Captured interface</span>
                </div>
                <div className="scout-artifact-canvas">
                  <motion.div
                    className="scout-map-plane"
                    style={{ scale: mapScale, x: mapX, opacity: mapOpacity }}
                  >
                    <div className="scout-map-original">
                      <Image
                        unoptimized
                        src={scoutScenes[0].image}
                        alt={scoutScenes[0].alt}
                        aria-hidden={scene !== 0}
                        fill
                        sizes="(min-width: 1280px) 780px, 68vw"
                        priority
                        className="scout-map-image"
                      />
                      <motion.div
                        className="scout-relationship-plane"
                        aria-hidden={scene !== 1}
                        style={{ opacity: relationshipOpacity }}
                      >
                        <Image
                          unoptimized
                          src={scoutScenes[1].image}
                          loading="eager"
                          alt={scoutScenes[1].alt}
                          fill
                          sizes="(min-width: 1280px) 780px, 68vw"
                          className="scout-map-image"
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="scout-source-plane"
                    aria-hidden={scene < 2}
                    style={{
                      x: sourceX,
                      opacity: sourceOpacity,
                      scale: sourceScale,
                    }}
                  >
                    <Image
                      unoptimized
                      src={scoutScenes[2].image}
                      loading="eager"
                      alt={scoutScenes[scene >= 2 ? scene : 2].alt}
                      fill
                      sizes="420px"
                      className="scout-source-image"
                    />
                  </motion.div>
                </div>
                <figcaption>
                  <span>
                    {scene === 3
                      ? "Focused crop of the actual source capture · Fictional note"
                      : "Real interface · Invented study content · No scientific validation implied"}
                  </span>
                  <a
                    href={scoutScenes[scene].image}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open full ${scoutScenes[scene].label.toLowerCase().replace(/^the /, "")} capture in a new tab`}
                  >
                    Open full capture ↗
                  </a>
                </figcaption>
              </figure>
            </div>
            <div className="scout-scroll-track" aria-hidden="true">
              <motion.div style={{ scaleX: trackScale }} />
            </div>
          </div>
        ) : (
          <div className="scout-reading-scenes">
            {scoutScenes.map((item, index) => (
              <article key={item.id} id={item.id}>
                <div>
                  <p className="scout-kicker">
                    0{index + 1} / {item.label}
                  </p>
                  <h2>{item.title}</h2>
                  <p>{item.detail}</p>
                </div>
                <figure>
                  <div
                    className={`scout-reading-image ${index === 3 ? "scout-reading-boundary" : index === 2 ? "scout-reading-source" : ""}`}
                  >
                    <Image
                      unoptimized
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width:960px) 65vw, 94vw"
                      priority={index === 0}
                    />
                  </div>
                  <figcaption>
                    <span>
                      {index === 3
                        ? "Focused crop · Fictional study note"
                        : "Actual application capture · Fictional Aster study"}
                    </span>
                    <a
                      href={item.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open full ${item.label.toLowerCase().replace(/^the /, "")} capture in a new tab`}
                    >
                      Open full capture ↗
                    </a>
                  </figcaption>
                </figure>
              </article>
            ))}
          </div>
        )}
      </section>
      <div className="scout-story-transcript">
        <details>
          <summary>Read the complete artifact narrative</summary>
          <ol>
            {scoutScenes.map((item) => (
              <li key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </li>
            ))}
          </ol>
        </details>
      </div>
    </>
  );
}
