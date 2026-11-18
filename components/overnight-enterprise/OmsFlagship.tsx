"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import "./oms-flagship.css";
import useOmsScrollProgress, { omsHeaderOffset } from "./useOmsScrollProgress";

import {
  omsCrops as crops,
  omsBeats as beats,
  omsBeatAt,
  omsBeatTarget,
  omsLookupPan,
  omsFocusTargets,
  type OmsScreen as Screen,
} from "./oms-evidence";

export function OmsArtifactCrop({
  screen,
  index,
  children,
}: {
  screen: Screen;
  index: number;
  children?: ReactNode;
}) {
  const crop = crops[index];
  const style = {
    "--oms-crop-ratio": `${crop.width} / ${crop.height}`,
    "--oms-source-width": `${(crop.sourceWidth / crop.width) * 100}%`,
    "--oms-source-left": `${(-crop.x / crop.width) * 100}%`,
    "--oms-source-top": `${(-crop.y / crop.height) * 100}%`,
  } as CSSProperties;
  return (
    <div className="oms-authentic-crop" style={style}>
      <Image
        src={screen.src}
        alt={screen.alt}
        width={crop.sourceWidth}
        height={crop.sourceHeight}
        unoptimized
        priority
        className="oms-source-image"
      />
      {children}
    </div>
  );
}

function StaticSequence({ screens }: { screens: readonly Screen[] }) {
  return (
    <div className="oms-static-sequence">
      {screens.map((screen, index) => (
        <article key={screen.src} className="oms-static-scene">
          <div className="oms-static-narrative">
            <p className="oms-kicker">
              {index === 0
                ? "01 / Read the order"
                : index === 1
                  ? "02–04 / The confirmation boundary"
                  : "05 / Inspect the result"}
            </p>
            <h3>
              {index === 0
                ? "Read the order."
                : index === 1
                  ? "A warning. A phrase. A choice."
                  : "Verify the recorded result."}
            </h3>
            {beats
              .filter((beat) => beat.screen === index)
              .map((beat) => (
                <div className="oms-reading-beat" key={beat.nav}>
                  {index === 1 ? <h4>{beat.title}</h4> : null}
                  <p>{beat.detail}</p>
                </div>
              ))}
          </div>
          <figure>
            <OmsArtifactCrop screen={screen} index={index} />
            <figcaption>
              Actual prototype screen · simulated order data.{" "}
              <a href={screen.src} target="_blank" rel="noreferrer">
                Inspect the full original ↗
              </a>
            </figcaption>
          </figure>
        </article>
      ))}
    </div>
  );
}

export default function OmsFlagship({
  screens,
  prototypeHref,
  assistant,
  children,
}: {
  screens: readonly Screen[];
  prototypeHref: string;
  assistant?: ReactNode;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const evidenceRef = useRef<HTMLDivElement>(null);
  const activeBeatRef = useRef(0);
  const [lookupPan, setLookupPan] = useState(0);
  const [ready, setReady] = useState(false),
    [fits, setFits] = useState(false),
    [reading, setReading] = useState(false),
    [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    setReady(true);
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduced(motionQuery.matches);
    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);
    const query = matchMedia(
      "(min-width:900px) and (min-height:650px), (max-width:899px) and (min-height:760px)",
    );
    const update = () => setFits(query.matches);
    update();
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      motionQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);
  const animated = ready && fits && !reduced && !reading;
  useEffect(() => {
    if (!animated || !evidenceRef.current || !("ResizeObserver" in window))
      return;
    const element = evidenceRef.current;
    const update = () => {
      element.style.setProperty(
        "--oms-evidence-height",
        `${element.clientHeight}px`,
      );
      setLookupPan(omsLookupPan(element.clientWidth, element.clientHeight));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [animated]);
  const scrollYProgress = useOmsScrollProgress(root, animated);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = omsBeatAt(value);
    if (next !== activeBeatRef.current) {
      activeBeatRef.current = next;
      setActive(next);
    }
  });
  const lookupOpacity = useTransform(
    scrollYProgress,
    [0, 0.16, 0.22, 1],
    [1, 1, 0, 0],
  );
  const confirmOpacity = useTransform(
    scrollYProgress,
    [0, 0.16, 0.22, 0.77, 0.84, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const resultOpacity = useTransform(
    scrollYProgress,
    [0, 0.77, 0.84, 1],
    [0, 0, 1, 1],
  );
  const lookupY = useTransform(
    scrollYProgress,
    [0, 0.16, 0.22],
    [0, lookupPan, lookupPan - 35],
  );
  const confirmY = useTransform(
    scrollYProgress,
    [0.16, 0.22, 0.77, 0.84],
    [35, 0, 0, -35],
  );
  const resultY = useTransform(scrollYProgress, [0.77, 0.84, 1], [35, 0, 0]);
  const warningFocusOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.24, 0.38, 0.4, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const phraseFocusOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.44, 0.58, 0.6, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const choiceFocusOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 0.64, 0.78, 0.8, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const focusOpacities = [
    warningFocusOpacity,
    phraseFocusOpacity,
    choiceFocusOpacity,
  ];
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  function followSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (!reduced && !reading) return;
    event.preventDefault();
    window.history.pushState(null, "", `#${id}`);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "instant", block: "start" });
  }
  function toggleReading() {
    setReading((value) => !value);
    requestAnimationFrame(() => {
      if (root.current)
        window.scrollTo({
          top:
            root.current.getBoundingClientRect().top +
            window.scrollY -
            omsHeaderOffset(),
          behavior: "instant",
        });
    });
  }
  function select(index: number) {
    if (!root.current) return;
    const top =
      root.current.getBoundingClientRect().top +
      window.scrollY -
      omsHeaderOffset();
    const distance =
      root.current.offsetHeight - window.innerHeight + omsHeaderOffset();
    window.scrollTo({
      top: top + distance * omsBeatTarget(index),
      behavior: "instant",
    });
    activeBeatRef.current = index;
    setActive(index);
  }
  return (
    <div className="oms-flagship" data-reading={reading || Boolean(reduced)}>
      <header className="oms-flagship-hero">
        <div className="oms-hero-copy">
          <Link className="oms-back" href="/products">
            ← Products
          </Link>
          <p className="oms-kicker">OMS ChatGPT App / Mock-data prototype</p>
          <h1>
            A conversation.
            <br />
            <em>A confirmation.</em>
          </h1>
          <p className="oms-hero-intro">
            I prototyped order lookup and guarded cancellation inside ChatGPT,
            keeping the final choice in human hands.
          </p>
          <div className="oms-hero-actions">
            <a
              href="#oms-order-story"
              onClick={(event) => followSection(event, "oms-order-story")}
            >
              Follow one order ↓
            </a>
            <a href={prototypeHref} target="_blank" rel="noreferrer">
              Open the public prototype ↗
            </a>
          </div>
          <p className="oms-source-note">
            Public demo: simulated data.{" "}
            <a
              href="#oms-full-detail"
              onClick={(event) => followSection(event, "oms-full-detail")}
            >
              Role and internal delivery record ↓
            </a>
          </p>
        </div>
        <figure className="oms-hero-artifact">
          <span className="oms-artifact-caption">The consequential moment</span>
          <OmsArtifactCrop screen={screens[1]} index={1} />
          <figcaption>
            ChatGPT-hosted prototype · Actual confirmation UI.
          </figcaption>
          <a href={screens[1].src} target="_blank" rel="noreferrer">
            Inspect the uncropped screen ↗
          </a>
        </figure>
      </header>
      <section
        ref={root}
        id="oms-order-story"
        className="oms-order-story"
        data-animated={animated}
        aria-labelledby="oms-order-story-title"
      >
        <div className="oms-story-theater">
          <div className="oms-theater-top">
            <div>
              <p className="oms-kicker">Mock-data prototype / Five decisions</p>
              <h2 id="oms-order-story-title">
                From request to recorded result.
              </h2>
            </div>
            {ready && (reduced || !fits) ? (
              <p className="oms-mode-note">
                {reduced
                  ? "Reduced motion · Full sequence"
                  : "Reading view · Short viewport"}
              </p>
            ) : (
              <button
                type="button"
                disabled={!ready}
                className="oms-reading-toggle"
                aria-pressed={reading}
                onClick={toggleReading}
              >
                {reading
                  ? "Return to the scroll story"
                  : "Read the sequence without motion"}
              </button>
            )}
          </div>
          {animated ? (
            <>
              <nav className="oms-beat-nav" aria-label="Order story stages">
                {beats.map((beat, index) => (
                  <button
                    type="button"
                    key={beat.nav}
                    aria-current={active === index ? "step" : undefined}
                    onClick={() => select(index)}
                  >
                    <span>0{index + 1}</span>
                    {beat.nav}
                  </button>
                ))}
                <motion.span
                  className="oms-scroll-rail"
                  style={{ scaleX: railScale }}
                  aria-hidden="true"
                />
              </nav>
              <div className="oms-scene-composition">
                <div
                  className="oms-beat-copy"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <p className="oms-kicker">{beats[active].eyebrow}</p>
                  <h3>{beats[active].title}</h3>
                  <p>{beats[active].detail}</p>
                  <span className="oms-scroll-cue">
                    Scroll to inspect the next decision ↓
                  </span>
                </div>
                <div className="oms-evidence-stage" ref={evidenceRef}>
                  <motion.div
                    className="oms-evidence-layer oms-evidence-lookup"
                    aria-hidden={active !== 0}
                    style={{
                      opacity: lookupOpacity,
                      y: lookupY,
                      visibility: active === 0 ? "visible" : "hidden",
                    }}
                  >
                    <OmsArtifactCrop screen={screens[0]} index={0} />
                  </motion.div>
                  <motion.div
                    className="oms-evidence-layer oms-evidence-confirm"
                    aria-hidden={active < 1 || active > 3}
                    style={{
                      opacity: confirmOpacity,
                      y: confirmY,
                      visibility:
                        active >= 1 && active <= 3 ? "visible" : "hidden",
                    }}
                  >
                    <OmsArtifactCrop screen={screens[1]} index={1}>
                      {omsFocusTargets.map((target, index) => (
                        <motion.span
                          key={target.field}
                          className="oms-control-focus"
                          data-focus-field={target.field}
                          aria-hidden="true"
                          style={{
                            top: `${target.top}%`,
                            height: `${target.height}%`,
                            left: `${target.left}%`,
                            width: `${target.width}%`,
                            opacity: focusOpacities[index],
                            visibility:
                              active === target.beat ? "visible" : "hidden",
                          }}
                        />
                      ))}
                    </OmsArtifactCrop>
                  </motion.div>
                  <motion.div
                    className="oms-evidence-layer oms-evidence-result"
                    aria-hidden={active !== 4}
                    style={{
                      opacity: resultOpacity,
                      y: resultY,
                      visibility: active === 4 ? "visible" : "hidden",
                    }}
                  >
                    <OmsArtifactCrop screen={screens[2]} index={2} />
                  </motion.div>
                </div>
              </div>
              <div className="oms-theater-footer">
                <span>Recorded prototype screens · simulated order data</span>
                <a
                  href={screens[beats[active].screen].src}
                  target="_blank"
                  rel="noreferrer"
                >
                  Inspect this original screen ↗
                </a>
              </div>
            </>
          ) : (
            <StaticSequence screens={screens} />
          )}
        </div>
      </section>
      <section className="oms-evidence-limit">
        <p className="oms-kicker">What the artifact establishes</p>
        <p>
          These screens show the interface and its confirmation choices. They do
          not prove backend enforcement, production adoption, or business
          impact.
        </p>
      </section>
      <section id="oms-full-detail" className="oms-full-detail">
        <div className="oms-detail-heading">
          <p className="oms-kicker">Role / Rationale / Delivery</p>
          <h2>
            The work behind
            <br />
            <em>the interaction.</em>
          </h2>
        </div>
        <div className="oms-detail-body">{children}</div>
      </section>
      <div className="oms-assistant-entry">{assistant}</div>
      <footer className="oms-flagship-close">
        <p className="oms-kicker">Keep exploring</p>
        <h2>
          Inspect the prototype.
          <br />
          Talk through the decisions.
        </h2>
        <div>
          <a href={prototypeHref} target="_blank" rel="noreferrer">
            Open the mock-data prototype ↗
          </a>
          <Link href="/contact">Get in touch ↗</Link>
        </div>
      </footer>
    </div>
  );
}
