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
import { tabletopPublicBoundary } from "@/content/creative-page-content";
import styles from "./tabletop-story.module.css";

const art = [
  {
    title: "Calm",
    detail: "Exploration and discovery",
    src: "/images/tabletop-symphony/scene-calm.jpg",
  },
  {
    title: "Dramatic",
    detail: "Tension and consequence",
    src: "/images/tabletop-symphony/scene-dramatic.jpg",
  },
  {
    title: "Intense",
    detail: "Danger and climax",
    src: "/images/tabletop-symphony/scene-intense.jpg",
  },
] as const;
const copy = [
  {
    title: "Room to discover.",
    body: "Calm gives exploration and discovery a place in a deliberately small emotional vocabulary.",
  },
  {
    title: "A name for the tension.",
    body: "Dramatic makes the shift legible. The artwork establishes a direction for the score, rather than another control panel to manage.",
  },
  {
    title: "A different register.",
    body: "Intense carries danger and climax. These three artworks express the musical direction; they are separate from the working alpha.",
  },
  {
    title: "Know what is ready.",
    body: "The alpha distinguishes microphone availability, score-pack state, and GM readiness. This recorded interface shows the microphone unavailable and music paused.",
  },
  {
    title: "The GM keeps the final say.",
    body: "The captured controls expose Manual, Assist and Auto, plus Lock, Undo, Mute and intensity. The image documents the surface—not live adaptive behavior.",
  },
] as const;
const phase = (p: number) =>
  p < 0.145 ? 0 : p < 0.29 ? 1 : p < 0.45 ? 2 : p < 0.74 ? 3 : 4;
const anchors = [0.05, 0.22, 0.38, 0.6, 0.94];
function width(index: number, p: number) {
  const t = Math.max(0, Math.min(2, (p / 0.42) * 2));
  const weights = [0, 1, 2].map(
    (i) => 1 + 2.3 * Math.max(0, 1 - Math.abs(t - i)),
  );
  return `${(weights[index] / weights.reduce((sum, w) => sum + w, 0)) * 100}%`;
}

export default function TabletopStory() {
  const root = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false),
    [reduced, setReduced] = useState(false),
    [short, setShort] = useState(false),
    [narrow, setNarrow] = useState(false),
    [reading, setReading] = useState(false),
    [paused, setPaused] = useState(false),
    [mixing, setMixing] = useState(false),
    [active, setActive] = useState(0);
  const changeMode = useRef(false);
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end end"],
  });
  const p = useMotionValue(0);
  const enhanced = ready && !reduced && !short && !reading,
    motionLayout = !ready || enhanced;
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)"),
      width = matchMedia("(max-width:760px)"),
      small = matchMedia(
        "(min-width:761px) and (max-height:450px), (max-width:760px) and (max-height:740px)",
      );
    const update = () => {
      setReduced(media.matches);
      setShort(small.matches);
      setNarrow(width.matches);
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
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (enhanced && !paused) {
      p.set(value);
      setActive(phase(value));
      setMixing(value >= 0.43 && value < 0.57);
    }
  });
  useEffect(() => {
    if (enhanced && !paused) {
      const value = scrollYProgress.get();
      p.set(value);
      setActive(phase(value));
      setMixing(value >= 0.43 && value < 0.57);
    }
  }, [enhanced, paused, p, scrollYProgress]);
  useEffect(() => {
    if (!changeMode.current) return;
    changeMode.current = false;
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
      const detail = document.getElementById("tabletop-full-detail"),
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
  const calm = useTransform(p, (value) => width(0, value)),
    dramatic = useTransform(p, (value) => width(1, value)),
    intense = useTransform(p, (value) => width(2, value));
  const artOpacity = useTransform(p, [0, 0.44, 0.57, 1], [1, 1, 0, 0]),
    artScale = useTransform(p, [0.43, 0.58], [1, 0.86]);
  const uiOpacity = useTransform(p, [0.43, 0.55], [0, 1]),
    uiX = useTransform(p, [0.43, 0.58], ["30%", "0%"]);
  const screenY = useTransform(
    p,
    [0.5, 0.68, 0.91],
    [
      narrow ? "16.5%" : "13%",
      narrow ? "16.5%" : "13%",
      narrow ? "-36%" : "-28%",
    ],
  );
  const highlightTop = useTransform(p, [0.68, 0.91], ["36%", "63%"]),
    highlightHeight = useTransform(p, [0.68, 0.91], ["13%", "21%"]);
  const progress = useTransform(p, [0, 1], ["0%", "100%"]);
  const jump = (index: number) => {
    const element = root.current;
    if (!element) return;
    setPaused(false);
    window.scrollTo({
      top:
        element.getBoundingClientRect().top +
        scrollY +
        (element.offsetHeight - innerHeight) * anchors[index],
      behavior: "instant",
    });
  };
  const source =
    active < 3 ? art[active].src : "/images/tabletop-symphony/app-tablet.webp";
  return (
    <div className={styles.project}>
      <header className={styles.hero}>
        <Image
          src={art[0].src}
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroArt}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroGrid}>
          <div>
            <p className={styles.eyebrow}>
              Composer-built music / private alpha
            </p>
            <h1>
              Tabletop
              <br />
              Symphony
            </h1>
            <p className={styles.tagline}>
              A living score for every adventure.
            </p>
            <p className={styles.premise}>
              I’m exploring how music can follow live tabletop storytelling
              while keeping agency with the Game Master.
            </p>
            <p className={styles.role}>
              Product thesis, interaction model, visual language and working
              alpha · Daniel Nash
            </p>
            <a className={styles.heroCta} href="#tabletop-story">
              Follow the product idea ↓
            </a>
          </div>
          <figure className={styles.phone}>
            <div>
              <Image
                src="/images/tabletop-symphony/app-phone.webp"
                alt="Recorded private-alpha phone surface showing microphone unavailable, music paused and GM Control Ready."
                fill
                priority
                sizes="(min-width:900px) 320px,45vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption>Actual phone capture · private alpha</figcaption>
          </figure>
        </div>
        <p className={styles.heroArtLabel}>Background: scene concept artwork</p>
      </header>
      <section
        ref={root}
        id="tabletop-story"
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
        aria-label="From emotional vocabulary to GM control"
      >
        <noscript>
          <style>{`#tabletop-story{height:auto!important}#tabletop-story .${styles.animated}{display:none!important}#tabletop-story .${styles.reading}{display:block!important}#tabletop-story .${styles.toolbar} button{display:none!important}`}</style>
        </noscript>
        <header className={styles.toolbar}>
          <span>The room / the score / the storyteller</span>
          <div>
            {enhanced && (
              <button
                type="button"
                aria-pressed={paused}
                onClick={() => setPaused(!paused)}
              >
                {paused ? "Resume visual motion" : "Pause visual motion"}
              </button>
            )}
            <button
              data-mode-control
              type="button"
              disabled={reduced || short}
              onClick={() => {
                changeMode.current = true;
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
        <div className={styles.animated} aria-hidden={!motionLayout}>
          <div className={styles.stage}>
            <motion.div
              className={styles.triptych}
              style={{ opacity: artOpacity, scale: artScale }}
            >
              {art.map((scene, index) => (
                <motion.figure
                  key={scene.title}
                  style={{ width: [calm, dramatic, intense][index] }}
                >
                  <Image
                    src={scene.src}
                    alt=""
                    fill
                    sizes="65vw"
                    className="object-cover"
                  />
                  <figcaption>
                    <span>{scene.title}</span>
                    <small>{scene.detail}</small>
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
            <motion.div
              className={styles.appRegion}
              style={{ opacity: uiOpacity, x: uiX }}
            >
              <div className={styles.screenViewport}>
                <div className={styles.center}>
                  <motion.div
                    className={styles.screen}
                    style={{ y: screenY, scale: narrow ? 1.65 : 1.3 }}
                  >
                    <Image
                      src="/images/tabletop-symphony/app-tablet.webp"
                      alt=""
                      fill
                      sizes="150vw"
                      className="object-contain"
                    />
                    <motion.div
                      className={styles.focus}
                      style={{
                        left: "23.5%",
                        width: "53.5%",
                        top: highlightTop,
                        height: highlightHeight,
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
            <div className={styles.shade} />
            <div className={styles.kind}>
              {mixing
                ? "Scene concepts → recorded alpha capture"
                : active < 3
                  ? "Scene concept artwork · visual direction"
                  : "Actual private-alpha capture · music paused"}
            </div>
            <div className={styles.caption}>
              <p className={styles.eyebrow}>
                {active < 3
                  ? `${art[active].title} / ${art[active].detail}`
                  : active === 3
                    ? "Readiness / captured state"
                    : "GM controls / captured state"}
              </p>
              <h2>{copy[active].title}</h2>
              <p>{copy[active].body}</p>
              <a href={source} target="_blank" rel="noopener noreferrer">
                {active < 3
                  ? "Open original scene artwork"
                  : "Open full alpha capture"}{" "}
                ↗
              </a>
            </div>
            <nav
              className={styles.nav}
              aria-label="Choose Tabletop Symphony story detail"
            >
              {[
                "Calm artwork",
                "Dramatic artwork",
                "Intense artwork",
                "Readiness capture",
                "GM controls capture",
              ].map((label, index) => (
                <button
                  type="button"
                  key={label}
                  aria-label={`Inspect ${label}`}
                  aria-pressed={active === index}
                  onClick={() => jump(index)}
                >
                  <span>0{index + 1}</span>
                  <span>
                    {
                      [
                        "Calm",
                        "Dramatic",
                        "Intense",
                        "Readiness",
                        "GM control",
                      ][index]
                    }
                  </span>
                </button>
              ))}
            </nav>
            <div className={styles.progress}>
              <motion.div style={{ width: progress }} />
            </div>
          </div>
        </div>
        <div className={styles.reading}>
          {art.map((scene, index) => (
            <article key={scene.title}>
              <div className={styles.readingArt}>
                <Image
                  src={scene.src}
                  alt={`${scene.title} scene concept artwork: ${scene.detail}.`}
                  fill
                  sizes="(min-width:900px) 50vw,100vw"
                  className="object-cover"
                />
              </div>
              <div>
                <p className={styles.eyebrow}>Scene concept artwork</p>
                <h2>{scene.title}</h2>
                <p>{copy[index].body}</p>
                <a href={scene.src} target="_blank" rel="noopener noreferrer">
                  Open original artwork ↗
                </a>
              </div>
            </article>
          ))}
          <article>
            <div className={styles.readingUI}>
              <Image
                src="/images/tabletop-symphony/app-tablet.webp"
                alt="Actual alpha capture with Microphone Unavailable, Score Pack music paused, GM Control Ready, and Manual, Assist, Auto, Lock, Undo, Mute and intensity controls."
                fill
                sizes="(min-width:900px) 55vw,100vw"
                className="object-contain"
              />
            </div>
            <div>
              <p className={styles.eyebrow}>
                Actual private-alpha capture · paused
              </p>
              <h2>{copy[3].title}</h2>
              <p>{copy[3].body}</p>
              <h3>{copy[4].title}</h3>
              <p>{copy[4].body}</p>
              <a
                href="/images/tabletop-symphony/app-tablet.webp"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open full alpha capture ↗
              </a>
            </div>
          </article>
        </div>
      </section>
      <section className={styles.boundary}>
        <p className={styles.eyebrow}>The public boundary</p>
        <h2>
          Enough to see the work.
          <br />
          The engine stays private.
        </h2>
        <div>
          <p>{tabletopPublicBoundary.shared}</p>
          <p>{tabletopPublicBoundary.private}</p>
          <p className={styles.limit}>
            This case study uses artwork and recorded interfaces. It does not
            listen to a session, generate music, or run an adaptive score.
          </p>
        </div>
        <div className={styles.links}>
          <a
            href="#tabletop-full-detail"
            onClick={() => {
              const detail = document.getElementById("tabletop-full-detail");
              if (detail instanceof HTMLDetailsElement) detail.open = true;
            }}
          >
            Read the full process, alpha and design artifacts ↓
          </a>
          <Link href="/contact">Talk with Daniel ↗</Link>
        </div>
      </section>
    </div>
  );
}
