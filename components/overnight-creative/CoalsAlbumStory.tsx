"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { jumpingOnCoalsChapters as chapters } from "@/content/creative-extra-content";
import styles from "./coals-album.module.css";

const movements = [
  {
    name: "The invitation",
    src: "title-screen.png",
    alt: "Actual game title screen in a pixel-art playground.",
    caption: "Title-screen capture · the playground frames the cycle",
    chapters: [0, 1],
    thought: "A comfortable motion. A reason to leave it.",
  },
  {
    name: "The cost",
    src: "coals-traversal.png",
    alt: "Actual chapter III capture: a player above glowing coals, platforms and the game's controls.",
    caption:
      "Chapter III capture · later descent and recovery are described, not pictured",
    chapters: [2, 3, 4, 5],
    thought:
      "Effort becomes compulsion. Recovery asks for a different kind of attention.",
  },
  {
    name: "The choice",
    src: "return-or-leave.png",
    alt: "Actual game choice: return to the swing or leave the playground.",
    caption: "Ending capture · the player chooses whether to return",
    chapters: [6, 7],
    thought: "The music reaches silence. The decision stays with you.",
  },
] as const;

export default function CoalsAlbumStory() {
  const root = useRef<HTMLElement>(null);
  const [reading, setReading] = useState(false),
    [paused, setPaused] = useState(false),
    [reduced, setReduced] = useState(false),
    [short, setShort] = useState(false),
    [active, setActive] = useState(0);
  const progress = useMotionValue(0);
  const x = useTransform(progress, [0, 2], ["0%", "-66.666667%"]);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)"),
      small = matchMedia(
        "(max-height:450px), (max-width:760px) and (max-height:740px)",
      );
    const update = () => {
      setReduced(media.matches);
      setShort(small.matches);
    };
    update();
    media.addEventListener("change", update);
    small.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      small.removeEventListener("change", update);
    };
  }, []);
  const enhanced = !reading && !reduced && !short;
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!enhanced || paused || !root.current) return;
      const rect = root.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const groups = [
        ...root.current.querySelectorAll<HTMLElement>("[data-album-movement]"),
      ];
      const tops = groups.map(
        (group) =>
          group.getBoundingClientRect().top - (innerWidth <= 760 ? 450 : 150),
      );
      let value = 0;
      for (let i = 0; i < tops.length - 1; i++)
        if (tops[i] <= 0)
          value =
            i +
            Math.max(
              0,
              Math.min(1, (-tops[i] / (tops[i + 1] - tops[i]) - 0.2) / 0.6),
            );
      progress.set(value);
      setActive(Math.min(2, Math.round(value)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    if (root.current) observer.observe(root.current);
    update();
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [enhanced, paused, progress]);
  const jump = (index: number) => {
    setPaused(false);
    const section = root.current?.querySelectorAll<HTMLElement>(
      "[data-album-movement]",
    )[index];
    if (section)
      window.scrollTo({
        top:
          section.getBoundingClientRect().top +
          scrollY -
          (innerWidth <= 760 ? 450 : 150),
        behavior: "instant",
      });
  };
  const toggleReading = () => {
    setReading(!reading);
    requestAnimationFrame(() => {
      root.current?.scrollIntoView({ behavior: "instant", block: "start" });
      root.current
        ?.querySelector<HTMLButtonElement>("[data-reading-control]")
        ?.focus({ preventScroll: true });
    });
  };
  return (
    <section
      id="album-arc"
      ref={root}
      className={styles.root}
      data-enhanced={enhanced}
      aria-label="Eight songs, three movements"
    >
      <noscript>
        <style>{`#album-arc [class*="_reel__"]{display:none}#album-arc [class*="_layout__"]{display:block}#album-arc [class*="_staticFrame__"]{display:block}#album-arc [class*="_movement__"]{min-height:0}`}</style>
      </noscript>
      <div className={styles.intro}>
        <p className={styles.kicker}>
          One cello pizzicato / eight emotional states
        </p>
        <h2>
          The album is the clock.
          <br />
          The player makes the choice.
        </h2>
        <p>
          Eight non-looping songs give the chapters their duration. When a song
          reaches silence, a final action or choice opens. The music never makes
          that choice for you.
        </p>
      </div>
      <div className={styles.controls}>
        <span>Recorded game frames / album sequence</span>
        <div>
          {enhanced && (
            <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
              {paused ? "Resume" : "Pause"} frame motion
            </button>
          )}
          <button
            data-reading-control
            disabled={reduced || short}
            onClick={toggleReading}
          >
            {reduced
              ? "Reading view · reduced motion"
              : short
                ? "Reading view · short viewport"
                : reading
                  ? "Return to moving frames"
                  : "Read without motion"}
          </button>
        </div>
      </div>
      <div className={styles.layout}>
        <div className={styles.reel} aria-hidden={!enhanced}>
          <div
            className={styles.aperture}
            role="img"
            aria-label={movements[active].alt}
          >
            <motion.div className={styles.film} style={{ x }}>
              {movements.map((item) => (
                <figure key={item.src}>
                  <Image
                    src={`/images/jumping-on-coals/${item.src}`}
                    alt=""
                    fill
                    sizes="(min-width:761px) 65vw,100vw"
                    className={styles.frameImage}
                  />
                </figure>
              ))}
            </motion.div>
          </div>
          <p className={styles.caption}>{movements[active].caption}</p>
          <nav aria-label="Inspect game story movements">
            {movements.map((item, i) => (
              <button
                key={item.name}
                aria-pressed={active === i}
                onClick={() => jump(i)}
              >
                <span>0{i + 1}</span>
                {item.name}
              </button>
            ))}
          </nav>
          <a
            className={styles.source}
            href={`/images/jumping-on-coals/${movements[active].src}`}
            target="_blank"
            rel="noreferrer"
          >
            Open complete capture ↗
          </a>
        </div>
        <div className={styles.tracklist}>
          {movements.map((item, i) => (
            <section
              key={item.name}
              data-album-movement
              className={styles.movement}
            >
              <figure className={styles.staticFrame}>
                <Image
                  src={`/images/jumping-on-coals/${item.src}`}
                  alt={item.alt}
                  width={1920}
                  height={1080}
                  sizes="100vw"
                />
                <figcaption>{item.caption}</figcaption>
              </figure>
              <p className={styles.movementName}>
                0{i + 1} / {item.name}
              </p>
              <h3>{item.thought}</h3>
              <ol start={item.chapters[0] + 1}>
                {item.chapters.map((index) => (
                  <li key={chapters[index].number}>
                    <span className={styles.number}>
                      {chapters[index].number}
                    </span>
                    <div>
                      <h4>{chapters[index].title}</h4>
                      <p>{chapters[index].description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
      <p className={styles.outro}>
        This is a sequence of recorded frames, not a playable scene. The full
        game holds the timing, music and decisions.
      </p>
    </section>
  );
}
