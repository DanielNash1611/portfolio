"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, RotateCcw, Sun } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import MethodBuildPreview from "./MethodBuildPreview";
import ClarityPrinciples from "./ClarityPrinciples";
import {
  LIGHT_JOURNEY_APPROACH,
  lightJourneyFrame,
  lightJourneyGeometry,
} from "@/lib/experience/light-journey";
import type { ExperienceHomeContent } from "@/content/experience-home";
import {
  loopSteps,
  systemChapters,
  systemHref,
} from "@/content/product-system";
import "./clarity-chapter.css";

type Toolkit = ExperienceHomeContent["toolkit"];
const environment = {
  far: "/images/experience/clarity-journey/forest-distance-v1.webp",
  sunrise: "/images/experience/clarity-journey/forest-sunrise-v1.webp",
  middle: "/images/experience/clarity-journey/forest-middle-v1.webp",
  near: "/images/experience/clarity-journey/forest-near-v1.webp",
};
const methodSources = [
  { slug: "ideas-strategy", section: 0 },
  { slug: "development-loop", section: 1 },
  { slug: "ai-native-building", section: 1 },
  { slug: "testing-evidence", section: 2 },
  { slug: "idea-lifecycle", section: 3 },
];
const journeyPath = [
  [44, 49],
  [54, 47],
  [46, 51],
  [55, 48],
  [50, 49],
];
const approachLead = LIGHT_JOURNEY_APPROACH;
const flightStops = [-0.5, -0.4, -0.24, 0.24, 0.36, 0.5, 0.8];
const compactPath = [
  [49, 50],
  [51, 48],
  [49, 50],
  [51, 48],
  [50, 49],
];

function ForestPlane({
  travel,
  offset,
  source,
  flipped = false,
  paused,
}: {
  travel: ReturnType<typeof useMotionValue<number>>;
  offset: number;
  source: string;
  flipped?: boolean;
  paused: boolean;
}) {
  const distance = useTransform(travel, (value) => value - offset);
  const z = useTransform(
    distance,
    [-1.7, -0.8, 0, 0.55, 0.95],
    [-2200, -800, 0, 600, 900],
  );
  const opacity = useTransform(
    distance,
    [-1.7, -0.8, 0, 0.55, 0.95],
    [0, 0.18, 0.72, 0.45, 0],
  );
  const y = useTransform(distance, [-1.7, 0.95], [-30, 45]);
  const blur = useTransform(
    distance,
    [-1.7, -0.8, 0, 0.55, 0.95],
    [8, 3, 0, 1, 6],
  );
  const filter = useMotionTemplate`blur(${blur}px)`;
  return (
    <motion.div
      className="clarity-forest-plane"
      aria-hidden="true"
      style={{
        z,
        y,
        opacity: paused ? 0 : opacity,
        scaleX: flipped ? -1 : 1,
        filter,
      }}
    >
      <Image
        src={source}
        alt=""
        fill
        unoptimized
        sizes="100vw"
        loading="eager"
      />
    </motion.div>
  );
}

function MethodJourney({ paused }: { paused: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const immersiveOwner = useId();
  const travel = useMotionValue(-approachLead);
  const progress = useTransform(travel, (value) =>
    Math.max(0, Math.min(4, value)),
  );
  const relative = useTransform(
    travel,
    (value) => value - Math.max(0, Math.min(4, Math.round(value))),
  );
  const advance = useTransform(travel, [-approachLead, 4.53], [0, 1]);
  const [stage, setStage] = useState({
    index: 0,
    readable: false,
    reward: false,
  });
  const current = stage.index;
  const readable = !stage.reward && (paused || stage.readable);
  const [viewport, setViewport] = useState({ compact: true, fits: true });
  const path = viewport.compact ? compactPath : journeyPath;
  const lightX = useTransform(
    progress,
    [0, 1, 2, 3, 4],
    path.map((p) => `${p[0]}%`),
  );
  const lightY = useTransform(
    progress,
    [0, 1, 2, 3, 4],
    path.map((p) => `${p[1]}%`),
  );
  const apertureWidth = viewport.compact ? "90%" : "42%";
  const aperture = useMotionTemplate`radial-gradient(ellipse ${apertureWidth} 62% at ${lightX} ${lightY}, transparent 18%, #000 88%)`;
  const fogOpacity = useTransform(
    progress,
    [0, 1, 2, 3, 4],
    [1, 0.96, 0.86, 0.69, 0],
  );
  const fogDrift = useTransform(advance, [0, 1], [50, -80]);
  const fogScale = useTransform(advance, [0, 1], [1, 1.15]);
  const landscapeDrift = useTransform(advance, [0, 1], [-12, 12]);
  const landscapeY = useTransform(advance, [0, 1], [14, -24]);
  const landscapeScale = useTransform(advance, [0, 1], [1, 1.32]);
  const shadeOpacity = useTransform(travel, [0, 4, 4.95], [1, 0.65, 0]);
  const rewardOpacity = useTransform(travel, [4.1, 4.95], [0, 1]);
  const sceneInk = useTransform(travel, [4.4, 4.95], [1, 0]);
  const planeDepth = useTransform(
    relative,
    flightStops,
    [-900, -560, 0, 0, 340, 760, 960],
  );
  const planeOpacity = useTransform(
    relative,
    flightStops,
    [0, 0.2, 1, 1, 0.65, 0, 0],
  );
  const planeBlur = useTransform(
    relative,
    flightStops,
    [18, 9, 0, 0, 4, 16, 20],
  );
  const planeFilter = useMotionTemplate`blur(${planeBlur}px)`;
  const planeY = useTransform(
    relative,
    flightStops,
    [24, 16, 0, 0, -18, -64, -90],
  );
  const planeTilt = useTransform(
    relative,
    flightStops,
    viewport.compact ? [3, 2, 0, 0, -1, -3, -4] : [6, 4, 0, 0, -2, -6, -8],
  );
  const nearFogOpacity = useTransform(
    relative,
    [-0.5, -0.38, -0.24, 0.24, 0.38, 0.5, 0.8],
    [0, 0.28, 0, 0, 0.38, 0, 0],
  );
  const nearFogScale = useTransform(relative, [-0.5, 0.5], [0.65, 1.65]);
  const nearFogX = useTransform(relative, [-0.5, 0.5], [-40, 70]);
  const scaleX = useTransform(progress, [0, 4], [0, 1]);

  useEffect(() => {
    const coarse = matchMedia("(pointer: coarse)");
    const assess = () => {
      const next = {
        compact: innerWidth < 900 || coarse.matches,
        fits: innerHeight >= 600,
      };
      setViewport((previous) =>
        previous.compact === next.compact && previous.fits === next.fits
          ? previous
          : next,
      );
    };
    assess();
    window.addEventListener("resize", assess);
    coarse.addEventListener("change", assess);
    return () => {
      window.removeEventListener("resize", assess);
      coarse.removeEventListener("change", assess);
    };
  }, []);

  useEffect(() => {
    const element = root.current;
    const canvas = scene.current;
    if (!viewport.fits || !element || !canvas) return;
    let frame = 0;
    let geometry = lightJourneyGeometry(0, 600, 0);
    let measuredStep = 0;
    let nearby = true;
    let previous = -1;
    let previousReadable = false;
    let previousReward = false;
    let disposed = false;
    const update = () => {
      frame = 0;
      const state = lightJourneyFrame(scrollY, geometry);
      const { immersive } = state;
      if (immersive) {
        if (
          document.documentElement.dataset.clarityImmersive !== immersiveOwner
        )
          document.documentElement.dataset.clarityImmersive = immersiveOwner;
      } else if (
        document.documentElement.dataset.clarityImmersive === immersiveOwner
      ) {
        delete document.documentElement.dataset.clarityImmersive;
      }
      if (travel.get() !== state.position) travel.set(state.position);
      const { index: active, readable: inLight, reward } = state;
      if (
        !inLight &&
        document.activeElement?.closest(".clarity-scene-method")
      ) {
        canvas.focus({ preventScroll: true });
      }
      if (
        active !== previous ||
        inLight !== previousReadable ||
        reward !== previousReward
      ) {
        previous = active;
        previousReadable = inLight;
        previousReward = reward;
        setStage({ index: active, readable: inLight, reward });
      }
    };
    const schedule = () => {
      if (nearby && !document.hidden && !frame)
        frame = requestAnimationFrame(update);
    };
    const measure = () => {
      // All geometry reads precede writes; scrolling samples only scrollY.
      geometry = lightJourneyGeometry(
        element.getBoundingClientRect().top + scrollY,
        canvas.getBoundingClientRect().height,
        parseFloat(getComputedStyle(canvas).top) || 0,
      );
      if (measuredStep !== geometry.step) {
        measuredStep = geometry.step;
        element.style.setProperty("--journey-step", `${geometry.step}px`);
        element.style.setProperty("--journey-travel", `${geometry.distance}px`);
      }
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    // Earlier disclosures, fonts and images can move the journey without
    // resizing its sticky scene. Invalidate the cached document position too.
    const page = element.closest(".experience");
    if (page) observer.observe(page);
    const visibility = new IntersectionObserver(
      ([entry]) => {
        nearby = entry.isIntersecting;
        if (!nearby) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
        // Reconcile both edges once, including releasing immersive chrome.
        update();
      },
      { rootMargin: "200px 0px" },
    );
    visibility.observe(element);
    measure();
    const hash = location.hash;
    const arrival = /^#clarity-method-(journey|[0-4])$/.test(hash)
      ? hash === "#clarity-method-journey"
        ? element
        : element.querySelector<HTMLElement>(hash)
      : null;
    let arrivalFrame = 0;
    if (arrival) {
      void document.fonts.ready.then(() => {
        if (!disposed)
          arrivalFrame = requestAnimationFrame(() => {
            arrival.scrollIntoView({ block: "start", behavior: "instant" });
            canvas.focus({ preventScroll: true });
            update();
          });
      });
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      disposed = true;
      if (document.documentElement.dataset.clarityImmersive === immersiveOwner)
        delete document.documentElement.dataset.clarityImmersive;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(arrivalFrame);
      observer.disconnect();
      visibility.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [travel, viewport.fits, immersiveOwner]);

  function pageThroughMethods(event: KeyboardEvent<HTMLDivElement>) {
    if (
      !["PageDown", "PageUp"].includes(event.key) ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
      return;
    const canvas = event.currentTarget;
    const pinnedTop = parseFloat(getComputedStyle(canvas).top) || 0;
    // Only page the methods while this focused scene is pinned in view.
    if (Math.abs(canvas.getBoundingClientRect().top - pinnedTop) > 2) return;
    const direction = event.key === "PageDown" ? 1 : -1;
    if (stage.reward && direction > 0) return;
    const offset = travel.get() - current;
    const settle = !paused && (direction > 0 ? offset < -0.24 : offset > 0.24);
    const target = settle ? current : current + direction;
    if (target < 0 || target > loopSteps.length) return;
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    root.current
      ?.querySelector(
        target === loopSteps.length
          ? "#clarity-method-clearing"
          : `#clarity-method-${target}`,
      )
      ?.scrollIntoView({
        block: "start",
        behavior: paused ? "instant" : "smooth",
      });
  }

  if (!viewport.fits) {
    return (
      <div
        className="clarity-method"
        data-static="true"
        id="clarity-method-journey"
      >
        <div className="clarity-method-copy">
          {loopSteps.map((item, i) => (
            <MethodWords key={item.title} index={i} />
          ))}
        </div>
      </div>
    );
  }

  const step = loopSteps[current];
  const chapter = systemChapters.find(
    (item) => item.slug === methodSources[current].slug,
  )!;
  return (
    <>
      <div
        ref={root}
        className="clarity-journey"
        id="clarity-method-journey"
        data-current={current}
        data-rendering={viewport.compact ? "compact" : "full"}
      >
        <div className="clarity-journey-stops" aria-hidden="true">
          <span
            id="clarity-method-clearing"
            className="clarity-journey-stop"
            style={{ top: "calc(var(--journey-step, 70svh) * 5.52)" }}
          />
          {loopSteps.map((item, i) => (
            <span
              key={item.title}
              className="clarity-journey-stop"
              id={`clarity-method-${i}`}
              style={{
                top: `calc(var(--journey-step, 70svh) * ${i + approachLead})`,
              }}
            />
          ))}
        </div>
        <div
          ref={scene}
          className="clarity-fog-scene"
          role="region"
          aria-label="Travel through the five stages of the product method"
          aria-describedby="clarity-journey-keyboard"
          aria-keyshortcuts="PageDown PageUp"
          tabIndex={-1}
          onKeyDown={pageThroughMethods}
        >
          <motion.div
            className="clarity-scene-landscape"
            aria-hidden="true"
            style={{
              x: paused ? 0 : landscapeDrift,
              y: paused ? 0 : landscapeY,
              scale: paused ? 1 : viewport.compact ? 1.06 : landscapeScale,
            }}
          >
            <Image
              src={environment.far}
              alt=""
              fill
              unoptimized
              sizes="100vw"
            />
          </motion.div>
          <motion.div
            className="clarity-scene-reward"
            aria-hidden="true"
            style={{ opacity: rewardOpacity }}
          >
            <Image
              src={environment.sunrise}
              alt=""
              fill
              unoptimized
              sizes="100vw"
            />
          </motion.div>
          <motion.div
            className="clarity-scene-shade"
            aria-hidden="true"
            style={{ opacity: shadeOpacity }}
          />
          <motion.div
            className="clarity-journey-fog"
            aria-hidden="true"
            style={{
              maskImage: viewport.compact ? undefined : aperture,
              WebkitMaskImage: viewport.compact ? undefined : aperture,
              opacity: paused ? 0 : fogOpacity,
            }}
          >
            <motion.div
              className="clarity-fog clarity-fog-a"
              style={{ x: fogDrift, scale: fogScale }}
            />
            <div className="clarity-fog clarity-fog-b" />
            <div className="clarity-fog clarity-fog-c" />
            <div className="clarity-journey-mist" />
          </motion.div>
          <motion.div
            className="clarity-scene-vignette"
            aria-hidden="true"
            style={{ opacity: sceneInk }}
          />
          {!viewport.compact && (
            <div className="clarity-forest-space" aria-hidden="true">
              <ForestPlane
                travel={travel}
                offset={0.1}
                source={environment.near}
                paused={paused}
              />
              <ForestPlane
                travel={travel}
                offset={1.2}
                source={environment.middle}
                flipped
                paused={paused}
              />
              <ForestPlane
                travel={travel}
                offset={2.3}
                source={environment.near}
                flipped
                paused={paused}
              />
              <ForestPlane
                travel={travel}
                offset={3.4}
                source={environment.middle}
                paused={paused}
              />
            </div>
          )}
          <motion.span
            className="clarity-scene-glow"
            aria-hidden="true"
            style={{
              left: viewport.compact ? "50%" : lightX,
              top: viewport.compact ? "49%" : lightY,
              opacity: sceneInk,
            }}
          />
          <motion.div
            className="clarity-scene-heading"
            style={{ opacity: sceneInk }}
            aria-hidden={stage.reward}
          >
            <span>The product method</span>
            <span>0{current + 1} / 05</span>
          </motion.div>
          <motion.div
            className="clarity-scene-focus"
            style={{
              left: viewport.compact ? "50%" : lightX,
              top: viewport.compact ? "49%" : lightY,
              opacity: sceneInk,
            }}
          >
            <span className="clarity-scene-lens" aria-hidden="true">
              <Sun size={24} strokeWidth={1.1} />
            </span>
            <motion.article
              key={current}
              className="clarity-scene-method"
              style={{
                z: paused || viewport.compact ? 0 : planeDepth,
                y: paused ? 0 : planeY,
                rotateX: paused || viewport.compact ? 0 : planeTilt,
                opacity: paused ? 1 : planeOpacity,
                filter: paused || viewport.compact ? "none" : planeFilter,
              }}
              data-readable={readable}
              aria-hidden={!readable}
              aria-labelledby={`clarity-scene-title-${current}`}
            >
              <p className="clarity-scene-eyebrow">
                0{current + 1} / A clearer next move
              </p>
              <h4 id={`clarity-scene-title-${current}`}>{step.title}</h4>
              <p className="clarity-scene-question">{step.question}</p>
              <p className="clarity-scene-body">{step.body}</p>
              <div className="clarity-scene-output">
                <span>The next useful artifact</span>
                <strong>{step.output}</strong>
              </div>
              <Link
                className="clarity-scene-link"
                href={systemHref(chapter.slug)}
                tabIndex={readable ? 0 : -1}
              >
                Explore {step.title.toLowerCase()} in depth{" "}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </motion.article>
          </motion.div>
          <motion.div
            className="clarity-near-fog"
            aria-hidden="true"
            style={{
              opacity: paused ? 0 : nearFogOpacity,
              scale: nearFogScale,
              x: nearFogX,
            }}
          />
          <motion.div
            className="clarity-scene-footer"
            style={{
              opacity: sceneInk,
              pointerEvents: stage.reward ? "none" : undefined,
            }}
            aria-hidden={stage.reward}
          >
            <p>
              {current === 4
                ? "Clarity for the next decision"
                : "Scroll forward into the light"}
              <ArrowDown size={13} aria-hidden="true" />
            </p>
            <nav aria-label="Jump to a method stage">
              {loopSteps.map((item, i) => (
                <a
                  key={item.title}
                  href={`#clarity-method-${i}`}
                  aria-current={current === i ? "step" : undefined}
                  aria-label={`Jump to ${item.title}`}
                  tabIndex={stage.reward ? -1 : undefined}
                  onClick={(event) => {
                    if (
                      event.button === 0 &&
                      !event.metaKey &&
                      !event.ctrlKey &&
                      !event.shiftKey &&
                      !event.altKey
                    ) {
                      requestAnimationFrame(() =>
                        scene.current?.focus({ preventScroll: true }),
                      );
                    }
                  }}
                >
                  <span>0{i + 1}</span>
                </a>
              ))}
            </nav>
            <div className="clarity-journey-progress" aria-hidden="true">
              <motion.span style={{ scaleX }} />
            </div>
          </motion.div>
          <p className="sr-only" role="status">
            {stage.reward
              ? "A clear way forward. Continue scrolling for the method in practice."
              : `${current + 1} of 5. ${step.title}.`}
          </p>
          <p id="clarity-journey-keyboard" className="sr-only">
            Use Page Down and Page Up to move between methods.
          </p>
        </div>
      </div>
    </>
  );
}

function MethodNotes() {
  return (
    <details className="clarity-method-notes">
      <summary>
        The method, in practice
        <span>
          Five exercises and the full chapters{" "}
          <ArrowDown size={15} aria-hidden="true" />
        </span>
      </summary>
      <div>
        {loopSteps.map((item, i) => (
          <section key={item.title}>
            <h4>
              0{i + 1} / {item.title}
            </h4>
            <MethodDepth index={i} />
          </section>
        ))}
      </div>
    </details>
  );
}

function MethodDepth({ index }: { index: number }) {
  const source = methodSources[index];
  const chapter = systemChapters.find((item) => item.slug === source.slug)!;
  const section = chapter.sections[source.section];
  return (
    <>
      <div className="clarity-method-depth">
        <h5>{section.title}</h5>
        <p>{section.body}</p>
        {section.items && (
          <ul>
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="clarity-exercise">
        <h5>{chapter.exercise.title}</h5>
        <p>{chapter.exercise.body}</p>
      </div>
      <Link className="clarity-text-link" href={systemHref(chapter.slug)}>
        Read {chapter.title.toLowerCase()} <ArrowUpRight size={15} />
      </Link>
    </>
  );
}

function MethodWords({ index }: { index: number }) {
  const step = loopSteps[index];
  return (
    <article className="clarity-method-words" id={`clarity-method-${index}`}>
      <div className="clarity-method-intro">
        <p className="clarity-kicker">
          0{index + 1} / {step.title}
        </p>
        <h4>{step.question}</h4>
        <p>{step.body}</p>
      </div>
      <div className="clarity-method-more">
        <div className="clarity-output">
          <span>The next useful artifact</span>
          <strong>{step.output}</strong>
        </div>
        <details className="clarity-step-depth" open>
          <summary>
            Explore {step.title.toLowerCase()} in practice{" "}
            <ArrowDown size={14} aria-hidden="true" />
          </summary>
          <MethodDepth index={index} />
        </details>
      </div>
    </article>
  );
}

function Practice({
  item,
  paused,
}: {
  item: Toolkit[number];
  paused: boolean;
}) {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const teamArrival = location.hash === "#clarity-team-practice";
    const legacyPlanning =
      item.id === "planning" && location.hash === "#gift-detail-coaching";
    if (
      !teamArrival &&
      !legacyPlanning &&
      location.hash !== `#gift-detail-${item.id}`
    )
      return;
    const frame = requestAnimationFrame(() =>
      (teamArrival
        ? title.current?.closest("section")
        : title.current
      )?.scrollIntoView({ block: "start", behavior: "instant" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [item.id]);

  return (
    <article
      className="clarity-practice"
      data-practice={item.id}
      aria-labelledby={`gift-detail-${item.id}`}
    >
      <div className="clarity-practice-copy">
        <p className="clarity-kicker">{item.capability}</p>
        <h4 ref={title} id={`gift-detail-${item.id}`}>
          {item.heading}
        </h4>
        <p>{item.description}</p>
        <Link className="clarity-text-link" href={item.href}>
          {item.action} <ArrowUpRight size={16} />
        </Link>
      </div>
      <figure className="clarity-practice-art">
        {item.id === "prototyping" ? (
          <MethodBuildPreview paused={paused} />
        ) : item.artifact.kind === "image" ? (
          <Image
            src={item.artifact.image}
            alt={item.artifact.alt}
            width={1536}
            height={1024}
            sizes="(min-width: 900px) 45vw, 90vw"
          />
        ) : (
          <div className="clarity-practice-sheet">
            <p>{item.artifact.label}</p>
            <dl>
              {item.artifact.topics.map((topic, i) => (
                <div key={topic.title}>
                  <span aria-hidden="true">0{i + 1}</span>
                  <dt>{topic.title}</dt>
                  <dd>{topic.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <figcaption>{item.caption}</figcaption>
      </figure>
    </article>
  );
}

export default function ClarityChapter({
  items,
  values,
  reading,
  paused,
}: {
  items: Toolkit;
  values: ExperienceHomeContent["positioning"]["categories"];
  reading: boolean;
  paused: boolean;
}) {
  const [phase, setPhase] = useState<"closed" | "lighting" | "open">("closed");
  const [practice, setPractice] = useState(0);
  const root = useRef<HTMLElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const heading = useRef<HTMLHeadingElement | null>(null);
  const focusOnOpen = useRef(false);
  const focusOnReturn = useRef(false);
  const open = reading || phase === "open";

  useEffect(() => {
    if (phase === "closed" || !focusOnOpen.current) return;
    // A tap starts the reveal, but a later swipe/key/wheel owns navigation.
    // Do not pull a visitor back when the delayed opening animation finishes.
    const interrupted = () => {
      focusOnOpen.current = false;
    };
    window.addEventListener("touchstart", interrupted, { passive: true });
    window.addEventListener("pointerdown", interrupted, { passive: true });
    window.addEventListener("wheel", interrupted, { passive: true });
    window.addEventListener("keydown", interrupted);
    return () => {
      window.removeEventListener("touchstart", interrupted);
      window.removeEventListener("pointerdown", interrupted);
      window.removeEventListener("wheel", interrupted);
      window.removeEventListener("keydown", interrupted);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "lighting") return;
    const timer = setTimeout(() => setPhase("open"), paused ? 0 : 1050);
    return () => clearTimeout(timer);
  }, [phase, paused]);
  useEffect(() => {
    const revealFragment = () => {
      if (
        /^#clarity-(method-(journey|[0-4])|team-practice|principles)$/.test(
          location.hash,
        )
      ) {
        setPhase("open");
      }
      if (location.hash === "#experience-principles") {
        setPhase("open");
        root.current
          ?.querySelector("#clarity-principles")
          ?.scrollIntoView({ block: "start", behavior: "instant" });
      }
      const index = items.findIndex(
        (item) =>
          location.hash === `#gift-detail-${item.id}` ||
          (item.id === "planning" && location.hash === "#gift-detail-coaching"),
      );
      if (index >= 0) {
        setPractice(index);
        setPhase("open");
      }
    };
    revealFragment();
    addEventListener("hashchange", revealFragment);
    return () => removeEventListener("hashchange", revealFragment);
  }, [items]);

  function illuminate() {
    const top = root.current?.getBoundingClientRect().top;
    if (top !== undefined && top < 113) {
      window.scrollTo({ top: scrollY + top - 113, behavior: "instant" });
    }
    focusOnOpen.current = true;
    setPhase(paused ? "open" : "lighting");
  }
  function enterJourney() {
    const canvas =
      root.current?.querySelector<HTMLElement>(".clarity-fog-scene");
    (canvas ?? heading.current)?.focus({ preventScroll: true });
    root.current
      ?.querySelector("#clarity-method-journey")
      ?.scrollIntoView({ block: "start", behavior: "instant" });
  }
  return (
    <section
      ref={root}
      id="experience-toolkit"
      className="clarity-chapter experience-toolkit experience-home-section"
      aria-labelledby="experience-toolkit-heading"
      data-open={open}
      data-phase={phase}
      data-paused={paused}
      data-reading={reading}
    >
      <span
        id="experience-principles"
        className="clarity-legacy-anchor"
        aria-hidden="true"
      />
      <header className="clarity-intro">
        <div>
          <p className="experience-home-eyebrow">The way I work</p>
          <h2 id="experience-toolkit-heading">
            Make the next move <em>clear.</em>
          </h2>
        </div>
        <p>
          How I connect a question, a working artifact, and the evidence for
          what comes next.
        </p>
      </header>

      <div className="clarity-canvas" id="clarity-guide">
        <AnimatePresence initial={false} mode="wait">
          {!open ? (
            <motion.div
              key="fog"
              className="clarity-gate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.025 }}
              transition={{ duration: paused ? 0 : 0.35 }}
              onAnimationComplete={() => {
                if (focusOnReturn.current) {
                  opener.current?.focus({ preventScroll: true });
                  focusOnReturn.current = false;
                }
              }}
            >
              <Image
                src={environment.far}
                alt=""
                fill
                unoptimized
                sizes="95vw"
                className="clarity-gate-art"
              />
              <div className="clarity-beam" aria-hidden="true" />
              <div className="clarity-fog clarity-fog-a" aria-hidden="true" />
              <div className="clarity-fog clarity-fog-b" aria-hidden="true" />
              <div className="clarity-fog clarity-fog-c" aria-hidden="true" />
              <div className="clarity-fragments" aria-hidden="true">
                <span>An idea</span>
                <span>A constraint</span>
                <span>An assumption</span>
                <span>A question</span>
              </div>
              <button
                ref={(node) => {
                  opener.current = node;
                  if (node && paused && focusOnReturn.current) {
                    node.focus({ preventScroll: true });
                    focusOnReturn.current = false;
                  }
                }}
                className="clarity-beacon"
                onClick={illuminate}
                disabled={phase === "lighting"}
                aria-expanded={false}
                aria-controls="clarity-guide"
              >
                <span className="clarity-beacon-lens">
                  <Sun size={29} strokeWidth={1.2} aria-hidden="true" />
                </span>
                <span className="clarity-beacon-label">
                  {phase === "lighting"
                    ? "Coming into focus…"
                    : "Bring it into focus"}
                </span>
                <span className="clarity-beacon-hint">
                  A method. A shared practice. A next move.
                </span>
              </button>
              <Link href={systemHref()} className="clarity-gate-link">
                Read the full product method <ArrowUpRight size={15} />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="guide"
              className="clarity-guide"
              initial={reading || paused ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: paused ? 0 : 0.4 }}
              onAnimationComplete={() => {
                if (focusOnOpen.current) {
                  enterJourney();
                  focusOnOpen.current = false;
                }
              }}
            >
              {!reading && <MethodJourney paused={paused} />}
              <header className="clarity-guide-head">
                <h3
                  ref={(node) => {
                    heading.current = node;
                    if (node && paused && focusOnOpen.current) {
                      enterJourney();
                      focusOnOpen.current = false;
                    }
                  }}
                  tabIndex={-1}
                >
                  {reading
                    ? "The method and the practice"
                    : "The product method"}
                </h3>
                {!reading && (
                  <button
                    className="clarity-replay"
                    onClick={() => {
                      focusOnReturn.current = true;
                      setPhase("closed");
                    }}
                  >
                    <RotateCcw size={14} aria-hidden="true" /> Revisit the light
                  </button>
                )}
              </header>
              {!reading && (
                <nav
                  className="clarity-view-nav"
                  aria-label="Explore the field guide"
                >
                  <a
                    href="#clarity-method-journey"
                    onClick={(event) => {
                      if (
                        event.button === 0 &&
                        !event.metaKey &&
                        !event.ctrlKey &&
                        !event.shiftKey &&
                        !event.altKey
                      ) {
                        requestAnimationFrame(enterJourney);
                      }
                    }}
                  >
                    <span>01</span>Product method
                  </a>
                  <a href="#clarity-team-practice">
                    <span>02</span>Team practice
                  </a>
                  <a href="#clarity-principles">
                    <span>03</span>Principles
                  </a>
                </nav>
              )}

              {reading ? (
                <div
                  className="clarity-method"
                  data-static={reading}
                  id="clarity-method-journey"
                >
                  <div className="clarity-method-copy">
                    {loopSteps.map((item, i) => (
                      <MethodWords key={item.title} index={i} />
                    ))}
                  </div>
                </div>
              ) : (
                <MethodNotes />
              )}

              <section
                className="clarity-team-practice"
                id="clarity-team-practice"
                aria-labelledby="clarity-practice-title"
              >
                <h3
                  className="clarity-reading-title"
                  id="clarity-practice-title"
                >
                  Build the practice.
                </h3>
                {!reading && (
                  <div
                    className="clarity-practice-nav"
                    role="group"
                    aria-label="Explore team practices"
                  >
                    {items.map((item, i) => (
                      <button
                        key={item.id}
                        aria-pressed={practice === i}
                        onClick={() => setPractice(i)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
                {reading ? (
                  items.map((item) => (
                    <Practice key={item.id} item={item} paused={paused} />
                  ))
                ) : (
                  <Practice item={items[practice]} paused={paused} />
                )}
              </section>

              <section
                className="clarity-principles-section"
                id="clarity-principles"
                aria-labelledby="clarity-principles-title"
              >
                <h3
                  className="clarity-reading-title"
                  id="clarity-principles-title"
                >
                  Guiding principles.
                </h3>
                <ClarityPrinciples
                  values={values}
                  reading={reading}
                  paused={paused}
                />
              </section>

              <footer className="clarity-guide-footer">
                <div>
                  <p className="clarity-kicker">Take it into the work</p>
                  <p>
                    A living definition. Shared context. Evidence for the next
                    decision.
                  </p>
                </div>
                <Link href={systemHref("playbook")}>
                  Try the playbook <ArrowUpRight size={17} />
                </Link>
              </footer>
              <details className="clarity-directory" open={reading}>
                <summary>
                  Explore the full product method{" "}
                  <span>
                    8 chapters <ArrowUpRight size={15} />
                  </span>
                </summary>
                <div>
                  {systemChapters.map((chapter) => (
                    <Link href={systemHref(chapter.slug)} key={chapter.slug}>
                      <span>{chapter.number}</span>
                      <div>
                        <strong>{chapter.title}</strong>
                        <p>{chapter.question}</p>
                      </div>
                      <ArrowUpRight size={16} />
                    </Link>
                  ))}
                </div>
              </details>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
