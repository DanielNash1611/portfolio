"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useRef,
  useState,
  useEffect,
  type CSSProperties,
} from "react";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { ArrowDown, MessageSquare, Pause, Play } from "lucide-react";
import { careerNarrative } from "@/content/experience-narrative";
import type { ExperienceHomeContent } from "@/content/experience-home";
import ExperienceHome from "./ExperienceHome";
import GravityChapter from "./GravityChapter";
import GravityPlayer from "./GravityPlayer";
import DirectionChapter from "./DirectionChapter";
import OutcomeChapter from "./OutcomeChapter";
import CinematicBridge from "./CinematicBridge";
import Workflow from "./Workflow";
import { useContinuity } from "./useContinuity";
import { useInitialChapterAnchor } from "./useInitialChapterAnchor";
import PortfolioAssistantTrigger from "@/components/portfolio/PortfolioAssistantTrigger";
import PersonalityPortrait from "./PersonalityPortrait";
import ClarityField from "./ClarityField";
import ConductorCue from "./ConductorCue";
import { useIntroLayoutFits, useIntroProgress } from "./useIntroProgress";
import { portraitPhases } from "@/lib/experience/portrait-scroll";
import { revealExperienceTarget } from "@/lib/experience/reveal-target";
import "./experience.css";
import "./personality-portrait.css";
import "./opening-outcomes.css";
import "./leadership-metaphors.css";
import "./navigation-case.css";
import "./score-folio.css";
import "./score-sequence.css";
import "./map-unfold.css";

export default function ExperiencePreview({
  home,
  personalVideo = false,
  presentation = "preview",
}: {
  home: ExperienceHomeContent;
  /** The public homepage uses the still portrait without loading personal footage. */
  personalVideo?: boolean;
  presentation?: "home" | "preview";
}) {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const hero = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const introFits = useIntroLayoutFits();
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reading, setReading] = useState(false);
  const [fullGravity, setFullGravity] = useState(false);
  const [portraitUnavailable, setPortraitUnavailable] = useState(false);
  useEffect(() => setMounted(true), []);
  useInitialChapterAnchor(root, mounted);
  const quiet = Boolean(reduced) || reading;
  const stopMotion = paused || quiet || fullGravity;
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    // Keep fragment navigation in the App Router, including after a visitor
    // changes a hash in the address bar or returns through browser history.
    let frame = 0,
      nextFrame = 0;
    const visitChapter = (href: string) => {
      const target = revealExperienceTarget(element, href);
      if (!target) return;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(nextFrame);
      // Opening a disclosure changes its child’s layout and motion mode.
      frame = requestAnimationFrame(() => {
        nextFrame = requestAnimationFrame(() => {
          if (href === "#experience-gravity" && target.dataset.live === "true")
            window.dispatchEvent(new Event("experience-gravity-jump"));
          else if (target.dataset.anchorOffset) {
            const top =
              (parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  "--portfolio-header-height",
                ),
              ) || 61) + 52;
            window.scrollTo({
              top:
                target.getBoundingClientRect().top +
                scrollY +
                Number(target.dataset.anchorOffset) -
                top,
              behavior: quiet ? "instant" : "smooth",
            });
          } else
            target.scrollIntoView({ behavior: quiet ? "instant" : "smooth" });
        });
      });
    };
    const onHash = () => visitChapter(location.hash);
    const chapterLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#experience-"]',
      );
      if (!anchor) return;
      const href = anchor.getAttribute("href")!;
      if (!element.querySelector<HTMLElement>(href)) return;
      event.preventDefault();
      router.push(href, { scroll: false });
      visitChapter(href);
    };
    element.addEventListener("click", chapterLink);
    window.addEventListener("hashchange", onHash);
    return () => {
      element.removeEventListener("click", chapterLink);
      window.removeEventListener("hashchange", onHash);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(nextFrame);
    };
  }, [quiet, router]);
  const closeGravity = useCallback(() => setFullGravity(false), []);
  const openGravity = useCallback(() => setFullGravity(true), []);
  const togglePause = useCallback(() => setPaused((value) => !value), []);
  const portraitFailure = useCallback(() => setPortraitUnavailable(true), []);
  useContinuity(root, mounted && !quiet);
  const introMotion =
    personalVideo && mounted && introFits && !quiet && !portraitUnavailable;
  const { progress: introProgress, portraitOffset } = useIntroProgress(
    hero,
    introMotion,
  );
  const portraitOpacity = useTransform(introProgress, [0.98, 1], [1, 0]);
  return (
    <div
      ref={root}
      className="experience experience-narrative"
      data-paused={stopMotion}
      data-motion={mounted && !quiet}
      data-personal-video={personalVideo}
      data-testid="experience-preview"
    >
      <div className="experience-control-bar">
        <div>
          <PortfolioAssistantTrigger
            className="experience-toolbar-assistant"
            aria-label="Open portfolio assistant"
          >
            <MessageSquare size={14} aria-hidden="true" />
            <span>Ask AI</span>
          </PortfolioAssistantTrigger>
          {!quiet ? (
            <button onClick={togglePause} aria-pressed={paused}>
              {paused ? <Play size={12} /> : <Pause size={12} />}{" "}
              {paused ? "Resume motion" : "Pause motion"}
            </button>
          ) : null}
          <button
            onClick={() => setReading((value) => !value)}
            disabled={Boolean(reduced)}
          >
            {reduced
              ? "Reading view"
              : reading
                ? "Explore in motion"
                : "Read without motion"}
          </button>
        </div>
      </div>
      <MotionConfig reducedMotion={stopMotion ? "always" : "user"}>
        {!personalVideo ? (
          <ConductorCue quiet={!mounted || quiet} paused={stopMotion} />
        ) : (
          <section
            className="experience-intro-scroll"
            id="experience-intro"
            ref={hero}
            data-scroll-enabled={introMotion}
            style={
              { "--intro-pin-fraction": portraitPhases.look } as CSSProperties
            }
            aria-labelledby="experience-intro-title"
          >
            <div className="experience-career-hero">
              <ClarityField quiet={!mounted || quiet} paused={stopMotion} />
              <div className="experience-career-copy">
                <p className="experience-home-eyebrow">
                  {careerNarrative.eyebrow}
                </p>
                <p className="experience-career-name">
                  Daniel Nash<span>.</span>
                </p>
                <h1 id="experience-intro-title">
                  I build clarity
                  <br />
                  where there
                  <br />
                  <em>isn’t any.</em>
                </h1>
                <p className="experience-career-description">
                  {careerNarrative.description}
                </p>
                <div className="experience-career-actions">
                  <a
                    className="experience-career-entry"
                    href="#experience-outcomes"
                  >
                    See how I lead <ArrowDown size={17} />
                  </a>
                  <a
                    className="experience-career-assistant"
                    href="#experience-products"
                  >
                    See working products{" "}
                    <ArrowDown size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
              <motion.div
                className="experience-career-portrait experience-personality-portrait"
                style={
                  introMotion
                    ? { y: portraitOffset, opacity: portraitOpacity }
                    : undefined
                }
              >
                <PersonalityPortrait
                  motionEnabled={introMotion && !stopMotion}
                  progress={introProgress}
                  onUnavailable={portraitFailure}
                />
              </motion.div>
              <nav
                className="experience-career-chapters"
                aria-label="Experience chapters"
              >
                <a
                  className="experience-outcomes-chapter"
                  href="#experience-outcomes"
                >
                  Leadership in practice{" "}
                  <ArrowDown size={14} aria-hidden="true" />
                </a>
                {careerNarrative.chapters.map((chapter, i) => (
                  <a key={chapter.id} href={`#experience-${chapter.id}`}>
                    <span>0{i + 1}</span>
                    {chapter.label}
                  </a>
                ))}
              </nav>
            </div>
          </section>
        )}
        <OutcomeChapter
          items={home.outcomes}
          reading={!mounted || quiet}
          paused={stopMotion}
        />
        <ExperienceHome
          content={home}
          paused={stopMotion}
          reading={!mounted || quiet}
          presentation={presentation}
          onGravity={openGravity}
          direction={(open) => (
            <>
              <DirectionChapter
                paused={stopMotion || !open}
                reading={quiet || !open}
              />
              <CinematicBridge
                paused={stopMotion || !open}
                reduced={quiet || !open}
              />
            </>
          )}
          workflow={(open) => (
            <Workflow reading={quiet || !open} paused={stopMotion || !open} />
          )}
          gravity={(open) => (
            <GravityChapter
              paused={stopMotion || !open}
              reading={!mounted || quiet || !open}
              suspended={fullGravity || !open}
              onGravity={openGravity}
            />
          )}
        />
      </MotionConfig>
      {fullGravity ? <GravityPlayer onClose={closeGravity} /> : null}
    </div>
  );
}
