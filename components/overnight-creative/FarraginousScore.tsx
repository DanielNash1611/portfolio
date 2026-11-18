"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { eegMusicHowItWorksItems as inputs } from "@/content/creative-extra-content";
import styles from "./farraginous-score.module.css";

const patch = "/images/farraginous-puredata-patch.jpg";
const chapters = [
  {
    label: "Two tuning systems",
    title: "Coexistence, written into sound.",
    body: "Chinese tuning shapes the melody; Western Just Intonation shapes the harmony. The actual Pure Data patch holds both musical structures without forcing them into one tuning system.",
    note: "Original Pure Data patch · complete view",
  },
  {
    label: "A physical gesture",
    title: "A blink becomes a musical event.",
    body: "The patch routes blink and left/right wink messages into musical behavior. Small physical gestures influenced the melody. This is a magnified source artifact, not a live signal visualization.",
    note: "Source detail · /EXP/BLINK and wink routes",
  },
  {
    label: "The honest adaptation",
    title: "Keep the dependable signals.",
    body: "Emotional-state readings from the failing EPOC+ were too imprecise to use confidently. Live Fitbit data did not connect reliably to Pure Data. The final BPM oscillates between the highest and lowest heart rates measured during development; dependable blink and expression-linked input remained.",
    note: "Source detail · tempo / timing logic; not a live heart-rate feed",
  },
] as const;

export default function FarraginousScore() {
  const root = useRef<HTMLElement>(null);
  const [reading, setReading] = useState(false),
    [reduced, setReduced] = useState(false),
    [short, setShort] = useState(false),
    [narrow, setNarrow] = useState(false),
    [paused, setPaused] = useState(false),
    [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end end"],
  });
  const p = useMotionValue(0),
    enhanced = !reading && !reduced && !short;
  const phase = (n: number) => (n < 0.33 ? 0 : n < 0.69 ? 1 : 2);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)"),
      small = matchMedia(
        "(max-height:450px), (max-width:760px) and (max-height:740px)",
      ),
      mobile = matchMedia("(max-width:760px)");
    const update = () => {
      setReduced(media.matches);
      setShort(small.matches);
      setNarrow(mobile.matches);
    };
    update();
    [media, small, mobile].forEach((m) => m.addEventListener("change", update));
    return () =>
      [media, small, mobile].forEach((m) =>
        m.removeEventListener("change", update),
      );
  }, []);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (enhanced && !paused) {
      p.set(value);
      setActive(phase(value));
    }
  });
  useEffect(() => {
    if (enhanced && !paused) {
      const value = scrollYProgress.get();
      p.set(value);
      setActive(phase(value));
    }
  }, [enhanced, paused, p, scrollYProgress]);
  const scale = useTransform(
    p,
    [0, 0.22, 0.4, 0.62, 0.81, 1],
    [
      1,
      1,
      narrow ? 5 : 2.3,
      narrow ? 5 : 2.3,
      narrow ? 4.4 : 2,
      narrow ? 4.4 : 2,
    ],
  );
  const x = useTransform(
    p,
    [0, 0.22, 0.4, 0.62, 0.81, 1],
    [
      "0%",
      "0%",
      narrow ? "-35%" : "-16%",
      narrow ? "-35%" : "-16%",
      narrow ? "130%" : "26%",
      narrow ? "130%" : "26%",
    ],
  );
  const y = useTransform(
    p,
    [0, 0.22, 0.4, 0.62, 0.81, 1],
    [
      "0%",
      "0%",
      narrow ? "90%" : "39%",
      narrow ? "90%" : "39%",
      narrow ? "36%" : "16%",
      narrow ? "36%" : "16%",
    ],
  );
  const toggle = () => {
    setReading(!reading);
    requestAnimationFrame(() => {
      root.current?.scrollIntoView({ block: "start", behavior: "instant" });
      [
        ...(root.current?.querySelectorAll<HTMLButtonElement>(
          "[data-score-mode]",
        ) ?? []),
      ]
        .find((button) => button.getClientRects().length > 0)
        ?.focus({ preventScroll: true });
    });
  };
  const jump = (i: number) => {
    if (!root.current) return;
    setPaused(false);
    window.scrollTo({
      top:
        root.current.getBoundingClientRect().top +
        scrollY +
        (root.current.offsetHeight - innerHeight) * [0.1, 0.52, 0.95][i],
      behavior: "instant",
    });
  };
  return (
    <div className={styles.wrapper}>
      <section
        id="signal-system"
        ref={root}
        className={styles.root}
        data-enhanced={enhanced}
        aria-label="Read the actual Farraginous patch"
      >
        <noscript>
          <style>{`#signal-system [class*="_stage__"]{display:none}#signal-system [class*="_reading__"]{display:block}#signal-system{height:auto}`}</style>
        </noscript>
        <div className={styles.stage} aria-hidden={!enhanced}>
          <header className={styles.toolbar}>
            <span>Farraginous / the working score</span>
            <div>
              <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
                {paused ? "Resume" : "Pause"} patch motion
              </button>
              <button data-score-mode onClick={toggle}>
                Read without motion
              </button>
            </div>
          </header>
          <div
            className={styles.aperture}
            role="img"
            aria-label={chapters[active].note}
          >
            <motion.div className={styles.patch} style={{ scale, x, y }}>
              <Image
                src={patch}
                unoptimized
                alt=""
                fill
                sizes="100vw"
                className={styles.patchImage}
              />
            </motion.div>
            <span className={styles.provenance}>{chapters[active].note}</span>
          </div>
          <div className={styles.caption}>
            <div>
              <p className={styles.eyebrow}>
                0{active + 1} / {chapters[active].label}
              </p>
              <h2>{chapters[active].title}</h2>
            </div>
            <p>{chapters[active].body}</p>
          </div>
          <footer className={styles.footer}>
            <nav aria-label="Inspect Farraginous patch">
              {chapters.map((chapter, i) => (
                <button
                  key={chapter.label}
                  aria-pressed={i === active}
                  onClick={() => jump(i)}
                >
                  {chapter.label}
                </button>
              ))}
            </nav>
            <a href={patch} target="_blank" rel="noreferrer">
              Open original patch ↗
            </a>
          </footer>
        </div>
        <div className={styles.reading}>
          <div className={styles.readingHeading}>
            <p className={styles.eyebrow}>
              The working score / original artifact
            </p>
            <h2>Body becomes material.</h2>
            <button
              data-score-mode
              disabled={reduced || short}
              onClick={toggle}
            >
              {reduced
                ? "Reading view · reduced motion"
                : short
                  ? "Reading view · short viewport"
                  : "Return to patch motion"}
            </button>
          </div>
          <figure>
            <Image
              src={patch}
              alt="Complete original Pure Data patch, showing musical timing, blink/wink message routing and separate tuning structures."
              width={1536}
              height={1026}
              sizes="100vw"
            />
            <figcaption>
              Original source artifact. Labels describe the patch, not the
              reliability of every attempted input.{" "}
              <a href={patch} target="_blank" rel="noreferrer">
                Open full resolution ↗
              </a>
            </figcaption>
          </figure>
          <div className={styles.readingCopy}>
            {chapters.map((chapter) => (
              <article key={chapter.title}>
                <p className={styles.eyebrow}>{chapter.label}</p>
                <h3>{chapter.title}</h3>
                <p>{chapter.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <aside
        className={styles.limits}
        aria-label="Technical limits and adaptation"
      >
        <div>
          <p className={styles.eyebrow}>What the work can claim</p>
          <h2>Adaptation is part of the composition.</h2>
        </div>
        <div>
          {inputs.slice(0, 3).map((input) => (
            <p key={input.title}>
              <strong>{input.title}.</strong> {input.body}
            </p>
          ))}
          <p>{inputs[3].body}</p>
        </div>
      </aside>
    </div>
  );
}
