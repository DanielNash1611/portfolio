"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { gravityDecisionChanges } from "@/content/creative-page-content";
import styles from "./astra-interaction.module.css";

const scenes = [
  {
    title: "Possibility created a new problem.",
    eyebrow: "A richer build",
    body: "Astra and Blender opened a navigable, dimensional musical world. Watching people use it showed where the interaction needed to get smaller.",
    src: "/images/gravity/astra/celestial-orbits.webp",
    alt: "Gravity’s Celestial world with dimensional instruments orbiting the central cello.",
    source: "Actual Celestial capture · Astra build",
    note: "Richer spatial capability did not establish that a larger gesture vocabulary was usable.",
  },
  {
    title: "Make the target visible.",
    eyebrow: "A clearer invitation",
    body: "I chose visible targets and feedback instead of asking the visitor to infer whether the system understood them.",
    src: "/images/gravity/astra/hand-launch.webp",
    alt: "Captured Viola target, spring and 71% release-to-launch state in Gravity.",
    source: "Actual launch capture · target detail",
    note: "The outline emphasizes the captured Viola target. It is an editorial annotation, not a new recognition event.",
  },
  {
    title: "Relax the grab. Keep the spring.",
    eyebrow: "A smaller input grammar",
    body: "The revision anchors the target before closure and moves with the palm. Pinch remains an alternate input.",
    src: "/images/gravity/astra/hand-launch.webp",
    alt: "Captured Viola target, spring and 71% release-to-launch state in Gravity.",
    source: "Same launch capture · spring detail",
    note: "The visible 71% is a captured spring state, not a gesture-accuracy score.",
    decision: 1,
  },
  {
    title: "Keep another way in.",
    eyebrow: "Agency without a camera",
    body: "Mouse and keyboard controls remain available alongside hand control. The captured performer view makes the alternative visible.",
    src: "/images/gravity/astra/performer-follow.webp",
    alt: "Captured performer view with the instruction to drag or use arrow keys to look around.",
    source: "Actual performer view · keyboard guidance",
    note: "The original capture says “Drag or use ← → ↑ ↓ to look around.” The focus crop preserves that instruction.",
    decision: 3,
  },
  {
    title: "Make the session inspectable.",
    eyebrow: "Evidence for the next revision",
    body: "Local recording, marked moments, and timestamped events make interaction problems inspectable after a session.",
    src: "/images/gravity/astra/session-recording.webp",
    alt: "Local controls labeled Recording 00:23, Marked 1 and Stop, with a test-camera tile in the source capture.",
    source: "Actual local recording interface",
    note: "This capture establishes recording controls, not recognition accuracy, participant counts, or a formal study result.",
  },
] as const;
const phase = (p: number) =>
  p < 0.125 ? 0 : p < 0.375 ? 1 : p < 0.625 ? 2 : p < 0.875 ? 3 : 4;

function DecisionText({ index }: { index: number }) {
  const scene = scenes[index];
  return (
    <>
      <p className={styles.kicker}>
        0{index + 1} / {scene.eyebrow}
      </p>
      <h2>{scene.title}</h2>
      <p className={styles.body}>{scene.body}</p>
      <details className={styles.context}>
        <summary>
          {"decision" in scene
            ? "Read the before / after decision"
            : "Read the evidence boundary"}
        </summary>
        {"decision" in scene ? (
          <>
            <p>
              <strong>Before testing</strong>
              {gravityDecisionChanges[scene.decision].before}
            </p>
            <p>
              <strong>After testing</strong>
              {gravityDecisionChanges[scene.decision].after}
            </p>
          </>
        ) : null}
        <p>{scene.note}</p>
      </details>
    </>
  );
}

export default function AstraInteractionStory() {
  const root = useRef<HTMLElement>(null);
  const rows = useRef<(HTMLElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [short, setShort] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [reading, setReading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);
  const modeChange = useRef(false);
  const p = useMotionValue(0);
  const enhanced = ready && !reduced && !short && !reading;
  const motionLayout = !ready || enhanced;
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const small = matchMedia(
      "(min-width:761px) and (max-height:450px), (max-width:760px) and (max-height:740px)",
    );
    const width = matchMedia("(max-width:760px)");
    const update = () => {
      setNarrow(width.matches);
      setReduced(media.matches);
      setShort(small.matches);
    };
    update();
    setReady(true);
    media.addEventListener("change", update);
    small.addEventListener("change", update);
    width.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      small.removeEventListener("change", update);
      width.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    if (!enhanced || paused) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = root.current?.getBoundingClientRect();
      if (!bounds || bounds.bottom < 0 || bounds.top > innerHeight) return;
      const tops = rows.current.map(
        (row) =>
          row?.querySelector("h2")?.getBoundingClientRect().top ?? Infinity,
      );
      const focus = innerHeight * (innerWidth <= 760 ? 0.7 : 0.5);
      let index = 0;
      while (index < tops.length - 1 && tops[index + 1] <= focus) index++;
      const fraction =
        index < tops.length - 1
          ? Math.max(
              0,
              Math.min(
                1,
                (focus - tops[index]) / (tops[index + 1] - tops[index]),
              ),
            )
          : 0;
      const value = (index + fraction) / (tops.length - 1);
      p.set(value);
      setActive(phase(value));
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(queue);
    if (root.current) resize.observe(root.current);
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    update();
    return () => {
      resize.disconnect();
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
      cancelAnimationFrame(frame);
    };
  }, [enhanced, paused, p]);
  useEffect(() => {
    if (!modeChange.current) return;
    modeChange.current = false;
    const frame = requestAnimationFrame(() => {
      root.current?.scrollIntoView({ block: "start", behavior: "instant" });
      root.current
        ?.querySelector<HTMLElement>("[data-mode-control]")
        ?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [reading]);
  useEffect(() => {
    let frame = 0;
    const reveal = () => {
      const detail = document.getElementById("astra-full-detail"),
        target = document.getElementById(location.hash.slice(1));
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
  const handOpacity = useTransform(
    p,
    [0, 0.13, 0.19, 0.58, 0.65, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const handScale = useTransform(
    p,
    [0.18, 0.29, 0.5, 0.6],
    [1, narrow ? 2.1 : 1.4, narrow ? 3.2 : 1.55, narrow ? 3.2 : 1.55],
  );
  const handX = useTransform(
    p,
    [0.18, 0.29, 0.5, 0.6],
    [
      "0%",
      narrow ? "60%" : "36%",
      narrow ? "98%" : "44%",
      narrow ? "98%" : "44%",
    ],
  );
  const handY = useTransform(
    p,
    [0.18, 0.29, 0.5, 0.6],
    [
      "0%",
      narrow ? "-23%" : "-15%",
      narrow ? "-37%" : "-17%",
      narrow ? "-37%" : "-17%",
    ],
  );
  const frameWidth = useTransform(p, [0.25, 0.47], ["6%", "29%"]);
  const frameY = useTransform(p, [0.25, 0.47], ["58%", "55%"]);
  const frameHeight = useTransform(p, [0.25, 0.47], ["9%", "13%"]);
  const followOpacity = useTransform(
    p,
    [0, 0.58, 0.66, 0.84, 0.9, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const followScale = useTransform(p, [0.63, 0.8], [1, narrow ? 4 : 2.2]);
  const followX = useTransform(
    p,
    [0.63, 0.8],
    ["0%", narrow ? "-148%" : "-81%"],
  );
  const followY = useTransform(
    p,
    [0.63, 0.8],
    ["0%", narrow ? "-148%" : "-81%"],
  );
  const recordOpacity = useTransform(p, [0.83, 0.91], [0, 1]);
  const recordScale = useTransform(p, [0.87, 0.96], [1.05, narrow ? 3.2 : 2.2]);
  const recordY = useTransform(
    p,
    [0.87, 0.96],
    ["0%", narrow ? "-130%" : "-89%"],
  );
  const progress = useTransform(p, [0, 1], ["0%", "100%"]);
  const jump = (index: number) => {
    setPaused(false);
    const heading = rows.current[index]?.querySelector("h2");
    if (!heading) return;
    const header =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--portfolio-header-height",
        ),
      ) || 60;
    const safeTop =
      innerWidth <= 760
        ? header + 42 + 340 + 24
        : header + 42 + (innerHeight - header - 42) * 0.25;
    window.scrollTo({
      top: heading.getBoundingClientRect().top + scrollY - safeTop,
      behavior: "auto",
    });
  };

  return (
    <>
      <section
        ref={root}
        id="astra-interaction-story"
        className={styles.story}
        data-enhanced={motionLayout}
        data-phase={active}
        data-mode={
          !ready
            ? "initializing"
            : reduced
              ? "reduced-motion"
              : short
                ? "short-viewport"
                : reading
                  ? "requested-reading"
                  : "scroll"
        }
        aria-label="The interaction changed after observation"
      >
        <noscript>
          <style>{`#astra-interaction-story .${styles.desk}{display:none!important}#astra-interaction-story .${styles.reading}{display:block!important}#astra-interaction-story .${styles.toolbar} button{display:none!important}`}</style>
        </noscript>
        <header className={styles.toolbar}>
          <span>Observation → revised interaction</span>
          <div>
            {enhanced && (
              <button
                type="button"
                aria-pressed={paused}
                onClick={() => setPaused(!paused)}
              >
                {paused ? "Resume visual focus" : "Pause visual focus"}
              </button>
            )}
            <button
              data-mode-control
              type="button"
              disabled={reduced || short}
              onClick={() => {
                modeChange.current = true;
                setReading(!reading);
              }}
            >
              {reduced
                ? "Reduced-motion reading view"
                : short
                  ? "Reading view · short viewport"
                  : reading
                    ? "Return to visual story"
                    : "Read without motion"}
            </button>
          </div>
        </header>
        <div className={styles.desk}>
          <div className={styles.textColumn}>
            {scenes.map((scene, index) => (
              <article
                key={scene.title}
                ref={(el) => {
                  rows.current[index] = el;
                }}
                data-current={active === index}
                onFocus={(event) => {
                  if (innerWidth > 760) return;
                  const element = event.target as HTMLElement;
                  const header =
                    parseFloat(
                      getComputedStyle(
                        document.documentElement,
                      ).getPropertyValue("--portfolio-header-height"),
                    ) || 60;
                  const safe = header + 42 + 356,
                    top = element.getBoundingClientRect().top;
                  if (top < safe)
                    window.scrollBy({ top: top - safe, behavior: "auto" });
                }}
              >
                <DecisionText index={index} />
              </article>
            ))}
          </div>
          <figure className={styles.figure}>
            <div className={styles.artViewport}>
              <div className={styles.center}>
                <div className={styles.shot}>
                  <Image
                    src={scenes[0].src}
                    alt=""
                    fill
                    sizes="70vw"
                    className="object-contain"
                  />
                </div>
              </div>
              <motion.div
                className={styles.center}
                style={{ opacity: handOpacity }}
              >
                <motion.div
                  className={styles.shot}
                  style={{ scale: handScale, x: handX, y: handY }}
                >
                  <Image
                    src={scenes[1].src}
                    alt=""
                    fill
                    sizes="(min-width: 900px) 90vw, 100vw"
                    className="object-contain"
                  />
                  <motion.div
                    className={styles.focus}
                    style={{
                      left: "5%",
                      top: frameY,
                      width: frameWidth,
                      height: frameHeight,
                    }}
                  />
                </motion.div>
              </motion.div>
              <motion.div
                className={styles.center}
                style={{ opacity: followOpacity }}
              >
                <motion.div
                  className={styles.shot}
                  style={{ scale: followScale, x: followX, y: followY }}
                >
                  <Image
                    src={scenes[3].src}
                    alt=""
                    fill
                    sizes="90vw"
                    className="object-contain"
                  />
                  <div
                    className={styles.focus}
                    style={{
                      left: "75%",
                      top: "83%",
                      width: "24%",
                      height: "8%",
                    }}
                  />
                </motion.div>
              </motion.div>
              <motion.div
                className={styles.center}
                style={{ opacity: recordOpacity }}
              >
                <motion.div
                  className={styles.shot}
                  style={{ scale: recordScale, y: recordY }}
                >
                  <Image
                    src={scenes[4].src}
                    alt=""
                    fill
                    sizes="90vw"
                    className="object-contain"
                  />
                  <div
                    className={styles.focus}
                    style={{
                      left: "41%",
                      top: "87%",
                      width: "18%",
                      height: "7%",
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
            <figcaption>
              <p className={styles.sourceType}>
                Author’s focus crop / original application capture
              </p>
              <a
                href={scenes[active].src}
                target="_blank"
                rel="noopener noreferrer"
              >
                {scenes[active].source} ↗
              </a>
              {active === 2 ? (
                <p className={styles.boundary}>
                  71% is captured spring tension, not recognition accuracy.
                </p>
              ) : active === 4 ? (
                <p className={styles.boundary}>
                  Recording capability shown; no formal study result claimed.
                </p>
              ) : null}
            </figcaption>
            <div
              className={styles.nav}
              role="group"
              aria-label="Choose Astra interaction chapter"
            >
              {scenes.map((scene, index) => (
                <button
                  type="button"
                  key={scene.title}
                  aria-label={`Go to ${scene.eyebrow}`}
                  aria-pressed={active === index}
                  onClick={() => jump(index)}
                >
                  0{index + 1}
                </button>
              ))}
            </div>
            <div className={styles.progress}>
              <motion.div style={{ width: progress }} />
            </div>
          </figure>
        </div>
        <div className={styles.reading}>
          {scenes.map((scene, index) => (
            <article key={scene.title}>
              <div className={styles.readingImage}>
                <Image
                  src={scene.src}
                  alt={scene.alt}
                  fill
                  sizes="(min-width:900px) 70vw,100vw"
                  className="object-contain"
                />
              </div>
              <div>
                <DecisionText index={index} />
                <a
                  className={styles.readSource}
                  href={scene.src}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {scene.source} ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className={styles.outcome}>
        <p className={styles.kicker}>The product decision</p>
        <h2>
          A smaller grammar.
          <br />A richer instrument.
        </h2>
        <p>
          I kept the composition, product thesis, human observation, and
          tradeoffs. Astra accelerated the build; watching people use it changed
          what I chose to keep.
        </p>
        <div>
          <a
            href="#astra-full-detail"
            onClick={() => {
              const detail = document.getElementById("astra-full-detail");
              if (detail instanceof HTMLDetailsElement) detail.open = true;
            }}
          >
            Read the full build, decisions, and evidence ↓
          </a>
          <Link href="/creative/gravity">
            Return to the original composition ↗
          </Link>
        </div>
      </section>
    </>
  );
}
