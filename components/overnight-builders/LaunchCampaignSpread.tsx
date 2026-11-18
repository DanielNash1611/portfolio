"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import {
  launchCampaignArtifacts,
  launchBriefFocus,
} from "./launch-campaign-content";

function BriefReader({
  active = true,
  initialFocus = 0,
}: {
  active?: boolean;
  initialFocus?: number;
}) {
  const [focus, setFocus] = useState(initialFocus);
  const view = launchBriefFocus[focus];
  return (
    <div className="launch-brief-reader">
      <div
        className="launch-focus-controls"
        role="group"
        aria-label="Read the existing content brief"
      >
        {launchBriefFocus.map((item, index) => (
          <button
            key={item.label}
            onClick={() => setFocus(index)}
            disabled={!active}
            aria-pressed={focus === index}
            aria-controls="launch-brief-focus"
          >
            {item.label}
          </button>
        ))}
      </div>
      <figure>
        <div
          className="launch-brief-focus"
          id="launch-brief-focus"
          style={{ aspectRatio: `610 / ${view.height}` }}
        >
          <Image
            unoptimized
            src={launchCampaignArtifacts[1].image}
            alt={
              focus === 0
                ? launchCampaignArtifacts[1].alt
                : `${view.caption} from the existing Two Tuning Systems Colliding brief.`
            }
            width={610}
            height={736}
            style={{ top: `${(-view.top / view.height) * 100}%` }}
          />
        </div>
        <figcaption aria-live="polite">
          <span>{view.caption}</span>
          <a tabIndex={active ? 0 : -1} href="#launch-brief-transcript">
            Read as text ↓
          </a>
          <a
            tabIndex={active ? 0 : -1}
            href={launchCampaignArtifacts[1].image}
            target="_blank"
            rel="noreferrer"
          >
            Open original ↗
          </a>
        </figcaption>
      </figure>
    </div>
  );
}

export default function LaunchCampaignSpread() {
  const ref = useRef<HTMLElement>(null);
  const [eligible, setEligible] = useState(false);
  const [reading, setReading] = useState(false);
  useEffect(() => {
    const fits = matchMedia("(min-width:1100px) and (min-height:680px)");
    const reduced = matchMedia("(prefers-reduced-motion:reduce)");
    const deepLink = Boolean(location.hash);
    const update = () =>
      setEligible(fits.matches && !reduced.matches && !deepLink);
    update();
    fits.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fits.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);
  const animated = eligible && !reading;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [panel, setPanel] = useState(0);
  const [weekVisible, setWeekVisible] = useState(true);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (animated) {
      setPanel(value < 0.55 ? 0 : 1);
      setWeekVisible(value < 0.4);
    }
  });
  const weekX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4, 1],
    ["0%", "0%", "-110%", "-110%"],
  );
  const weekOpacity = useTransform(scrollYProgress, [0.15, 0.4], [1, 0]);
  const briefOpacity = useTransform(scrollYProgress, [0.36, 0.55], [0, 1]);
  const briefY = useTransform(scrollYProgress, [0.36, 0.55], [12, 0]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const select = (index: number, behavior: ScrollBehavior = "smooth") => {
    const el = ref.current;
    if (!el) return;
    const start = el.getBoundingClientRect().top + scrollY;
    window.scrollTo({
      top:
        start + (el.offsetHeight - innerHeight) * (index === 0 ? 0.04 : 0.94),
      behavior,
    });
  };
  const toggleReading = () => {
    const next = !reading;
    setReading(next);
    requestAnimationFrame(() => {
      if (next)
        document
          .getElementById(launchCampaignArtifacts[panel].id)
          ?.scrollIntoView({ block: "start", behavior: "instant" });
      else select(panel, "instant");
    });
  };
  return (
    <>
      <section
        ref={ref}
        id="launch-output"
        className="launch-campaign-spread"
        data-animated={animated}
        aria-label="Explore the actual LaunchMuse campaign output"
      >
        <div className="launch-spread-toolbar">
          <p>
            Published product artifacts <span>Generated planning output</span>
          </p>
          {eligible ? (
            <button onClick={toggleReading} aria-pressed={reading}>
              {reading
                ? "Return to the campaign spread"
                : "Read without motion"}
            </button>
          ) : (
            <span>Reading view / Both artifacts</span>
          )}
        </div>
        {animated ? (
          <div className="launch-spread-pin">
            <header>
              <p className="launch-kicker">
                From a week’s theme to one creative brief
              </p>
              <nav aria-label="Campaign spread chapters">
                <button
                  onClick={() => select(0)}
                  aria-current={panel === 0 ? "step" : undefined}
                >
                  01 / The week
                </button>
                <button
                  onClick={() => select(1)}
                  aria-current={panel === 1 ? "step" : undefined}
                >
                  02 / The brief
                </button>
              </nav>
            </header>
            <div className="launch-spread-layout">
              <div className="launch-spread-copy">
                <p className="launch-kicker">
                  {panel === 0 ? "01 / Week two" : "02 / A content brief"}
                </p>
                <h2>{launchCampaignArtifacts[panel].title}</h2>
                <p>{launchCampaignArtifacts[panel].detail}</p>
                {panel === 0 ? (
                  <span className="launch-scroll-cue">
                    Scroll to open the explainer →
                  </span>
                ) : (
                  <p className="launch-output-boundary">
                    Output structure is visible here. Audience response and
                    campaign performance have not been established.
                  </p>
                )}
              </div>
              <div
                className="launch-spread-window"
                aria-label="Campaign artifact viewer"
              >
                <motion.figure
                  className="launch-week-plane"
                  aria-hidden={!weekVisible}
                  style={{
                    x: weekX,
                    opacity: weekOpacity,
                    pointerEvents: weekVisible ? "auto" : "none",
                  }}
                >
                  <div className="launch-week-crop">
                    <Image
                      unoptimized
                      priority
                      src={launchCampaignArtifacts[0].image}
                      alt="First-row crop of the existing LaunchMuse week-two overview, showing the tuning-systems explainer, DAW walkthrough and microclip. Generated planning output, not campaign results."
                      width={1966}
                      height={1542}
                    />
                  </div>
                  <figcaption>
                    Week-two overview · First-row crop{" "}
                    <a
                      tabIndex={weekVisible ? 0 : -1}
                      href={launchCampaignArtifacts[0].image}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open original ↗
                    </a>
                  </figcaption>
                </motion.figure>
                <motion.div
                  className="launch-brief-plane"
                  aria-hidden={panel !== 1}
                  style={{
                    opacity: briefOpacity,
                    y: briefY,
                    pointerEvents: panel === 1 ? "auto" : "none",
                  }}
                >
                  <BriefReader active={panel === 1} initialFocus={2} />
                </motion.div>
              </div>
            </div>
            <div className="launch-spread-progress" aria-hidden="true">
              <motion.div style={{ scaleX: lineScale }} />
            </div>
          </div>
        ) : (
          <div className="launch-static-spread">
            {launchCampaignArtifacts.map((item, index) => (
              <article key={item.id} id={item.id}>
                <header>
                  <p className="launch-kicker">
                    0{index + 1} / {item.label}
                  </p>
                  <h2>{item.title}</h2>
                  <p>{item.detail}</p>
                </header>
                {index === 0 ? (
                  <figure>
                    <Image
                      unoptimized
                      src={item.image}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                    />
                    <figcaption>
                      Existing week-two overview{" "}
                      <a href={item.image} target="_blank" rel="noreferrer">
                        Open original ↗
                      </a>
                    </figcaption>
                  </figure>
                ) : (
                  <BriefReader />
                )}
              </article>
            ))}
          </div>
        )}
      </section>
      <div className="launch-brief-text">
        <details>
          <summary>Read the existing brief as text</summary>
          <div id="launch-brief-transcript">
            <p className="launch-kicker">
              Transcribed from the existing generated output
            </p>
            <h2>Explainer: Two Tuning Systems Colliding</h2>
            <dl>
              <div>
                <dt>Post copy</dt>
                <dd>
                  I wrote this melody using a Chinese tuning system, then placed
                  it inside a Western Just Intonation harmony world. Listen:
                  first you’ll hear a simple line in standard Western tuning.
                  Then I’ll switch to the version that mixes Chinese tuning with
                  Just Intonation. The small pitch differences are exactly how
                  the in-between feels: not wrong, but never quite where people
                  expect.
                </dd>
              </div>
              <div>
                <dt>Visual direction</dt>
                <dd>
                  Side-by-side audio comparison in one vertical video: label
                  each section clearly with on-screen text. Simple DAW or tuner
                  visualization in the background.
                </dd>
              </div>
              <div>
                <dt>Call to action</dt>
                <dd>
                  Comment if you can hear the difference and tell me which
                  version feels more like &quot;home&quot; to you.
                </dd>
              </div>
              <div>
                <dt>Platforms</dt>
                <dd>Instagram · TikTok · YouTube Shorts</dd>
              </div>
            </dl>
            <a
              href={launchCampaignArtifacts[1].image}
              target="_blank"
              rel="noreferrer"
            >
              Compare with the original capture ↗
            </a>
          </div>
        </details>
      </div>
      <p className="launch-campaign-limit">
        These existing product outputs show campaign structure. They do not
        establish publication, audience growth or engagement uplift.
      </p>
    </>
  );
}
