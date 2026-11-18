"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import recordings from "./gravity-waveforms.json";
import styles from "./gravity-flagship.module.css";

const chapters = [
  {
    eyebrow: "01 / Original recordings",
    title: "One center. No shared clock.",
    body: "A cello remains at the center. Each moving performer repeats an independent pattern. The texture comes from their drift.",
    source: "Measured from the original audio files",
    href: "/audio/gravity/cello-sustain-loop.m4a",
  },
  {
    eyebrow: "02 / Generated visual target",
    title: "Give the music a world.",
    body: "I chose a visual language for presence, orbit, and distance—then turned the concept into buildable requirements.",
    source: "Generated Atomic concept · not application UI",
    href: "/images/gravity/concept/gravity-concept-atomic.webp",
  },
  {
    eyebrow: "03 / Recorded browser MVP",
    title: "Build the field. Keep the rule.",
    body: "The browser version gives each performer its own timeline. One simulation supplies both the visible position and the spatial sound.",
    source: "Actual Atomic capture · original browser MVP",
    href: "/images/gravity/app/gravity-atomic-field.png",
  },
  {
    eyebrow: "04 / Recorded listening perspective",
    title: "Let the listener move inside.",
    body: "From the cello, nearby performers become immediate and distant ones recede. Perspective becomes part of the composition.",
    source: "Actual cello-perspective capture · original browser MVP",
    href: "/images/gravity/app/gravity-cello-perspective.png",
  },
] as const;
const anchors = [0.08, 0.34, 0.7, 0.92];
const phase = (value: number) =>
  value < 0.24 ? 0 : value < 0.49 ? 1 : value < 0.78 ? 2 : 3;

function SourceRecordings({ enabled = true }: { enabled?: boolean }) {
  const [selected, setSelected] = useState(0);
  const audio = useRef<HTMLAudioElement>(null);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!enabled) audio.current?.pause();
  }, [enabled]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) audio.current?.pause();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const stop = () => {
      if (document.hidden) audio.current?.pause();
    };
    document.addEventListener("visibilitychange", stop);
    return () => {
      document.removeEventListener("visibilitychange", stop);
    };
  }, []);
  return (
    <div ref={host} className={styles.sources}>
      {recordings.map((track, index) => (
        <button
          key={track.src}
          disabled={!enabled}
          type="button"
          aria-label={`Select source: ${track.title}`}
          aria-pressed={selected === index}
          onClick={() => setSelected(index)}
        >
          <span>
            {track.title}
            <small>{track.duration.toFixed(2)} s</small>
          </span>
          <svg
            viewBox="0 0 768 70"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {track.peaks.map((peak, i) => (
              <line
                key={i}
                x1={i * 6 + 3}
                x2={i * 6 + 3}
                y1={35 - peak * 31}
                y2={35 + peak * 31}
                stroke="currentColor"
                strokeWidth="3"
              />
            ))}
          </svg>
        </button>
      ))}
      <div className={styles.listen}>
        <audio
          ref={audio}
          key={recordings[selected].src}
          src={recordings[selected].src}
          controls={enabled}
          tabIndex={enabled ? 0 : -1}
          preload="none"
          aria-label={`Original recording: ${recordings[selected].title}`}
        />
        <p>
          Original recordings · normalized amplitude
          <br />
          Each waveform spans its own file. Select a source, then press play.
        </p>
      </div>
    </div>
  );
}

export default function GravityFlagship() {
  const story = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [shortViewport, setShortViewport] = useState(false);
  const [reading, setReading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const [comparing, setComparing] = useState(false);
  const userModeChange = useRef(false);
  const { scrollYProgress } = useScroll({
    target: story,
    offset: ["start start", "end end"],
  });
  const display = useMotionValue(0);
  const enhanced = ready && !reading && !reduced && !shortViewport;
  const showMotionLayout = !ready || enhanced;
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const query = matchMedia(
      "(min-width:761px) and (max-height:450px), (max-width:760px) and (max-height:740px)",
    );
    const update = () => setShortViewport(query.matches);
    update();
    query.addEventListener("change", update);
    setReady(true);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    let frame = 0;
    const reveal = () => {
      const detail = document.getElementById("gravity-full-detail");
      const target = document.getElementById(location.hash.slice(1));
      if (
        detail instanceof HTMLDetailsElement &&
        target &&
        detail.contains(target)
      ) {
        detail.open = true;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() =>
          target.scrollIntoView({ block: "start", behavior: "instant" }),
        );
      }
    };
    reveal();
    addEventListener("hashchange", reveal);
    return () => {
      removeEventListener("hashchange", reveal);
      cancelAnimationFrame(frame);
    };
  }, []);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!paused && enhanced) {
      display.set(value);
      setActive(phase(value));
      setComparing(value >= 0.43 && value < 0.67);
    }
  });
  useEffect(() => {
    if (!paused && enhanced) {
      const value = scrollYProgress.get();
      display.set(value);
      setActive(phase(value));
      setComparing(value >= 0.43 && value < 0.67);
    }
  }, [paused, enhanced, display, scrollYProgress]);
  useEffect(() => {
    if (!userModeChange.current) return;
    userModeChange.current = false;
    const frame = requestAnimationFrame(() => {
      story.current?.scrollIntoView({ behavior: "instant", block: "start" });
      story.current
        ?.querySelector<HTMLElement>("[data-mode-control]")
        ?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [reading]);
  const sourceOpacity = useTransform(display, [0, 0.16, 0.25, 1], [1, 1, 0, 0]);
  const sourceScale = useTransform(display, [0, 0.24], [1, 0.84]);
  const conceptReveal = useTransform(
    display,
    [0.16, 0.28, 0.72, 0.83],
    [
      "inset(50% 50% 50% 50% round 50%)",
      "inset(0% 0% 0% 0% round 0%)",
      "inset(0% 0% 0% 0% round 0%)",
      "inset(0% 0% 0% 0% round 0%)",
    ],
  );
  const conceptScale = useTransform(display, [0.16, 0.43], [1.14, 1]);
  const appReveal = useTransform(
    display,
    [0.43, 0.67],
    ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );
  const wipePosition = useTransform(display, [0.43, 0.67], ["0%", "100%"]);
  const wipeOpacity = useTransform(
    display,
    [0, 0.43, 0.45, 0.65, 0.67, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const perspectiveOpacity = useTransform(display, [0.73, 0.85], [0, 1]);
  const perspectiveScale = useTransform(display, [0.73, 0.95], [1.12, 1]);
  const progress = useTransform(display, [0, 1], ["0%", "100%"]);
  const jump = (index: number) => {
    const element = story.current;
    if (!element) return;
    setPaused(false);
    const top = element.getBoundingClientRect().top + scrollY;
    window.scrollTo({
      top: top + (element.offsetHeight - innerHeight) * anchors[index],
      behavior: "auto",
    });
  };
  return (
    <div className={styles.flagship}>
      <header className={styles.hero}>
        <Image
          src="/images/gravity/app/gravity-entry.png"
          alt="Gravity’s original browser entry, with its luminous cello and orbital field."
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <p className={styles.kicker}>Original composition → browser MVP</p>
          <h1>Gravity</h1>
          <p className={styles.question}>
            What if the audience could
            <br className={styles.desktopBreak} /> move inside the music?
          </p>
          <p className={styles.role}>
            Composition, musical material &amp; product direction: Daniel Nash
            <br />
            Implementation partner: Codex
          </p>
          <div className={styles.heroLinks}>
            <a href="#gravity-story">
              Follow the translation <span aria-hidden="true">↓</span>
            </a>
            <a
              href="https://gravity.danielnash.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Gravity ↗
            </a>
          </div>
        </div>
        <span className={styles.heroCredit}>Actual browser MVP capture</span>
      </header>

      <section
        ref={story}
        id="gravity-story"
        className={styles.story}
        data-enhanced={showMotionLayout}
        data-mode={
          !ready
            ? "initializing"
            : reduced
              ? "reduced-motion"
              : shortViewport
                ? "short-viewport"
                : reading
                  ? "requested-reading"
                  : "scroll"
        }
        data-phase={active}
        aria-label="From composition to browser experience"
      >
        <noscript>
          <style>{`#gravity-story{height:auto!important}#gravity-story .${styles.animated}{display:none!important}#gravity-story .${styles.reading}{display:block!important}#gravity-story .${styles.modeBar} button{display:none!important}`}</style>
        </noscript>
        <div className={styles.modeBar}>
          <span>A composition, translated</span>
          <div>
            {enhanced && (
              <button
                type="button"
                onClick={() => setPaused(!paused)}
                aria-pressed={paused}
              >
                {paused ? "Resume scroll motion" : "Pause scroll motion"}
              </button>
            )}
            <button
              data-mode-control
              disabled={Boolean(reduced) || shortViewport}
              type="button"
              onClick={() => {
                userModeChange.current = true;
                setReading(!reading);
              }}
            >
              {shortViewport
                ? "Reading view · short viewport"
                : reduced
                  ? "Reduced-motion reading view"
                  : reading
                    ? "Return to scroll story"
                    : "Read without motion"}
            </button>
          </div>
        </div>
        <div className={styles.animated} aria-hidden={!showMotionLayout}>
          <div className={styles.stage}>
            <div className={styles.art}>
              <motion.div
                className={styles.sourceLayer}
                style={{ opacity: sourceOpacity, scale: sourceScale }}
                aria-hidden={active !== 0}
              >
                <SourceRecordings enabled={enhanced && active === 0} />
              </motion.div>
              <motion.div
                className={styles.imageLayer}
                style={{ clipPath: conceptReveal, scale: conceptScale }}
              >
                <Image
                  src="/images/gravity/concept/gravity-concept-atomic.webp"
                  alt=""
                  fill
                  sizes="100vw"
                  className={styles.sceneImage}
                />
              </motion.div>
              <motion.div
                className={styles.imageLayer}
                style={{ clipPath: appReveal }}
              >
                <Image
                  src="/images/gravity/app/gravity-atomic-field.png"
                  alt=""
                  fill
                  sizes="100vw"
                  className={styles.sceneImage}
                />
              </motion.div>
              <motion.div
                className={styles.wipe}
                style={{ left: wipePosition, opacity: wipeOpacity }}
              ></motion.div>
              <motion.div
                className={styles.imageLayer}
                style={{ opacity: perspectiveOpacity, scale: perspectiveScale }}
              >
                <Image
                  src="/images/gravity/app/gravity-cello-perspective.png"
                  alt=""
                  fill
                  sizes="100vw"
                  className={styles.sceneImage}
                />
              </motion.div>
            </div>
            <div className={styles.captionShade} />
            {comparing ? (
              <div
                className={styles.provenance}
                aria-label="Comparison provenance"
              >
                <span>Actual MVP capture</span>
                <span>Generated concept</span>
              </div>
            ) : null}
            <div className={styles.caption}>
              <p className={styles.kicker}>{chapters[active].eyebrow}</p>
              <h2>{chapters[active].title}</h2>
              <p className={styles.chapterBody}>{chapters[active].body}</p>
              {active === 1 || comparing ? (
                <p className={styles.qualification}>
                  Generated concept labels are speculative. The MVP’s moving
                  performers use violin recordings.
                </p>
              ) : null}
              <a
                className={styles.sourceLink}
                href={chapters[active].href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {chapters[active].source} ↗
              </a>
            </div>
            <div
              className={styles.chapterNav}
              role="group"
              aria-label="Choose Gravity story chapter"
            >
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.title}
                  type="button"
                  onClick={() => jump(index)}
                  aria-pressed={active === index}
                  aria-label={`Go to ${chapter.eyebrow}`}
                >
                  <span>0{index + 1}</span>
                  <span>
                    {["Sound", "Concept", "Browser", "Perspective"][index]}
                  </span>
                </button>
              ))}
              <span className={styles.scrollHint}>
                Scroll to transform the scene ↓
              </span>
            </div>
            <div className={styles.progress}>
              <motion.div style={{ width: progress }} />
            </div>
          </div>
        </div>
        <div className={styles.reading}>
          {chapters.map((chapter, index) => (
            <article key={chapter.title}>
              {index === 0 ? (
                <SourceRecordings />
              ) : (
                <div className={styles.readingImage}>
                  <Image
                    src={chapter.href}
                    alt={chapter.source}
                    fill
                    sizes="(min-width: 900px) 70vw, 100vw"
                    className="object-contain"
                  />
                </div>
              )}
              <div className={styles.readingCaption}>
                <p className={styles.kicker}>{chapter.eyebrow}</p>
                <h2>{chapter.title}</h2>
                <p>{chapter.body}</p>
                {index === 1 ? (
                  <p className={styles.qualification}>
                    Generated concept labels are speculative. The MVP’s moving
                    performers use violin recordings.
                  </p>
                ) : null}
                <a
                  href={chapter.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {chapter.source} ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.afterword}>
        <p className={styles.kicker}>What changed</p>
        <h2>
          The audience can inhabit
          <br />
          the composition.
        </h2>
        <div>
          <p>
            I kept the composition, performer independence, product direction,
            and final creative decisions. Codex helped translate that intent
            into a working browser medium.
          </p>
          <p>
            The first MVP established the system.{" "}
            <Link href="/creative/gravity/astra">The Astra chapter</Link> shows
            what changed next—with richer spatial instruments and simpler
            controls.
          </p>
        </div>
        <a
          href="#gravity-full-detail"
          onClick={() => {
            const detail = document.getElementById("gravity-full-detail");
            if (detail instanceof HTMLDetailsElement) detail.open = true;
          }}
        >
          Read the full composition, process, and evidence ↓
        </a>
      </section>
    </div>
  );
}
