"use client";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Headphones,
  Pause,
  Play,
  Volume2,
  VolumeX,
  ArrowUpRight,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { ExperienceAudio } from "@/lib/experience/audio";
import {
  chapterProgress,
  isGravityActive,
  narrativeFrame,
} from "@/lib/experience/narrative";
import type { SceneInput } from "@/lib/experience/scene";
import type { Perspective, SpatialFrame } from "@/lib/experience/types";
import MotionBoundary from "./MotionBoundary";
import "./gravity-annotation.css";
const ExperienceCanvas = dynamic(() => import("./ExperienceCanvas"), {
  ssr: false,
});

export default function GravityChapter({
  paused,
  reading,
  suspended,
  onGravity,
}: {
  paused: boolean;
  reading: boolean;
  suspended: boolean;
  onGravity(): void;
}) {
  const story = useRef<HTMLElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const audio = useRef<ExperienceAudio | null>(null);
  const activation = useRef(0);
  const initialAnchorHandled = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const visible = useRef(false);
  const input = useRef<SceneInput>({
    progress: 0,
    paused,
    perspective: "audience",
    pointer: [0, 0],
    stage: 0,
    suspended: true,
  });
  const [near, setNear] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const [failed, setFailed] = useState(false);
  const [phase, setPhase] = useState("arrival");
  const [perspective, setPerspective] = useState<Perspective>("audience");
  const [sound, setSound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [error, setError] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({
    target: story,
    offset: ["start start", "end end"],
  });
  const background = useTransform(
    scrollYProgress,
    [0, 0.14, 0.7, 0.88, 1],
    ["#041018", "#041018", "#041018", "#142f33", "#e5e8e1"],
  );
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.62, 0.8],
    [1, 1, 1, 0],
  );
  const copyY = useTransform(
    scrollYProgress,
    [0, 0.14, 0.62, 0.8],
    [55, 0, 0, -45],
  );
  const copyVisibility = useTransform(scrollYProgress, (value) =>
    value >= 0.8 ? "hidden" : "visible",
  );
  const endVisibility = useTransform(scrollYProgress, (value) =>
    value >= 0.9 ? "visible" : "hidden",
  );
  const endOpacity = useTransform(scrollYProgress, [0.9, 0.98, 1], [0, 1, 1]);
  const stopSound = useCallback(() => {
    activation.current++;
    audio.current?.stop();
    setSound(false);
    setLoading(false);
  }, []);
  const ready = useCallback(() => setEnhanced(true), []);
  const failure = useCallback(() => {
    setFailed(true);
    setEnhanced(false);
    stopSound();
  }, [stopSound]);
  const spatial = useCallback((frame: SpatialFrame) => {
    audio.current?.update(frame);
    // Expose rendered coordinates for deterministic preview verification.
    if (surface.current) {
      surface.current.dataset.renderedSources = JSON.stringify(frame.sources);
      surface.current.dataset.listener = JSON.stringify(frame.listener);
      surface.current.dataset.renderedProgress = String(input.current.progress);
    }
  }, []);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    input.current.progress = progress;
    if (surface.current)
      surface.current.dataset.inputProgress = String(progress);
    window.dispatchEvent(new Event("experience-input"));
    setPhase(narrativeFrame(progress).chapter);
    if (enhanced && !isGravityActive(progress)) stopSound();
    surface.current?.setAttribute(
      "data-dissolve",
      narrativeFrame(progress).dissolve.toFixed(3),
    );
  });
  useEffect(() => {
    const engine = new ExperienceAudio();
    audio.current = engine;
    const hide = () => {
      if (document.hidden) stopSound();
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      engine.dispose();
      audio.current = null;
    };
  }, [stopSound]);
  useEffect(() => {
    if (!story.current) return;
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          preload.disconnect();
        }
      },
      { rootMargin: "900px" },
    );
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      input.current.suspended = suspended || !entry.isIntersecting;
      if (!entry.isIntersecting) stopSound();
      window.dispatchEvent(new Event("experience-input"));
    });
    preload.observe(story.current);
    observer.observe(story.current);
    return () => {
      preload.disconnect();
      observer.disconnect();
    };
  }, [suspended, stopSound]);
  useEffect(() => {
    input.current.paused = paused;
    input.current.perspective = perspective;
    input.current.playing = sound;
    input.current.suspended = suspended || !visible.current;
    if (reading || failed) setEnhanced(false);
    window.dispatchEvent(new Event("experience-input"));
  }, [paused, perspective, sound, suspended, reading, failed, stopSound]);
  useEffect(() => {
    if (suspended || reading) stopSound();
  }, [suspended, reading, stopSound]);
  const jump = useCallback(() => {
    if (!story.current) return;
    const header =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--portfolio-header-height",
        ),
      ) || 60;
    const height = window.innerHeight - header - 52;
    const top =
      story.current.getBoundingClientRect().top + scrollY - header - 52;
    window.scrollTo({
      top:
        top + (story.current.offsetHeight - height) * chapterProgress.gravity,
      behavior: "instant",
    });
  }, []);
  useEffect(() => {
    const onHash = () => {
      if (enhanced && location.hash === "#experience-gravity") jump();
    };
    if (enhanced && !initialAnchorHandled.current) {
      initialAnchorHandled.current = true;
      onHash();
    }
    window.addEventListener("hashchange", onHash);
    window.addEventListener("experience-gravity-jump", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("experience-gravity-jump", onHash);
    };
  }, [enhanced, jump]);
  useEffect(() => {
    if (enhanced) return;
    audio.current?.update({
      sources: [
        [0, 0, 0],
        [1.65, 0, 0],
        [-2.25, 0, 0],
      ],
      listener: perspective === "cello" ? [0.7, 0.3, 3.5] : [0, 0.15, 7.5],
      forward: [0, 0, -1],
      up: [0, 1, 0],
    });
  }, [enhanced, perspective]);
  const play = async () => {
    if (sound || loading) {
      stopSound();
      return;
    }
    if (enhanced && !isGravityActive(input.current.progress)) jump();
    const attempt = ++activation.current;
    setLoading(true);
    setError(null);
    try {
      const started = await audio.current?.enable();
      if (attempt === activation.current) setSound(Boolean(started));
    } catch (error) {
      if (attempt === activation.current)
        setError(
          error instanceof Error
            ? error.message
            : "Sound is unavailable. Try again.",
        );
    } finally {
      if (attempt === activation.current) setLoading(false);
    }
  };
  const point = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.pointerType === "touch") {
      if (!touch.current) return;
      const dx = event.clientX - touch.current.x,
        dy = event.clientY - touch.current.y;
      if (Math.abs(dx) > Math.abs(dy))
        input.current.pointer = [Math.max(-1, Math.min(1, dx / 100)), 0];
    } else
      input.current.pointer = [
        ((event.clientX - rect.left) / rect.width - 0.5) * 2,
        -((event.clientY - rect.top) / rect.height - 0.5) * 2,
      ];
    window.dispatchEvent(new Event("experience-input"));
  };
  return (
    <section
      ref={story}
      id="experience-gravity"
      className="experience-gravity-story"
      data-motion={!reading && !failed}
      data-live={enhanced && !reading && !failed}
      data-phase={phase}
      data-perspective={perspective}
      aria-labelledby="experience-gravity-title"
    >
      <motion.div
        ref={surface}
        className="experience-gravity-stage"
        style={enhanced ? { backgroundColor: background } : undefined}
      >
        {near && !reading && !failed ? (
          <div
            className="experience-gravity-canvas"
            data-testid="experience-canvas"
            aria-hidden="true"
          >
            <MotionBoundary onFailure={failure}>
              <ExperienceCanvas
                inputs={input}
                onReady={ready}
                onFailure={failure}
                onSpatial={spatial}
              />
            </MotionBoundary>
          </div>
        ) : null}
        <motion.div
          className="experience-gravity-copy"
          hidden={enhanced && phase === "dissolve"}
          style={
            enhanced
              ? { opacity: copyOpacity, y: copyY, visibility: copyVisibility }
              : undefined
          }
        >
          <p className="experience-home-eyebrow">Creative exploration</p>
          <h2 id="experience-gravity-title">
            Gravity<span>A composition you can enter.</span>
          </h2>
          <p className="experience-gravity-description">
            An original composition becomes a space you can move through.
            Independent performers. One gravitational center. A different piece
            from every perspective.
          </p>
          <div
            className="experience-perspectives"
            role="group"
            aria-label="Listening perspective"
          >
            {(["audience", "cello"] as const).map((value) => (
              <button
                key={value}
                aria-pressed={perspective === value}
                onClick={() => setPerspective(value)}
              >
                {value === "audience" ? "Audience" : "At the cello"}
              </button>
            ))}
          </div>
          <div className="experience-audio">
            <button onClick={play} disabled={loading} aria-pressed={sound}>
              {sound ? <Pause size={14} /> : <Headphones size={15} />}{" "}
              {loading
                ? "Loading sound…"
                : sound
                  ? "Stop music"
                  : "Play this scene"}
            </button>
            {sound ? (
              <>
                <button
                  aria-label={muted ? "Unmute" : "Mute"}
                  aria-pressed={muted}
                  onClick={() => {
                    setMuted(!muted);
                    audio.current?.setMuted(!muted);
                  }}
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <label>
                  <span className="sr-only">Volume</span>
                  <input
                    aria-label="Volume"
                    type="range"
                    min="0"
                    max="1"
                    step=".05"
                    value={volume}
                    onChange={(event) => {
                      setVolume(Number(event.target.value));
                      audio.current?.setVolume(Number(event.target.value));
                    }}
                  />
                </label>
              </>
            ) : (
              <small>Best with headphones</small>
            )}
          </div>
          {sound ? (
            <p className="experience-now-playing" role="status">
              Playing · cello + two independent violins
            </p>
          ) : null}
          {error ? <p role="alert">{error}</p> : null}
          <div className="experience-gravity-links">
            <button
              onClick={() => {
                stopSound();
                onGravity();
              }}
            >
              <Play size={14} /> Enter the full Gravity experience
            </button>
            <Link href="/creative/gravity/astra">
              Read the case study <ArrowUpRight size={14} />
            </Link>
            <a
              href="https://gravity.danielnash.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Gravity <ArrowUpRight size={14} />
            </a>
          </div>
          <p className="experience-gravity-scroll">
            Scroll to move through the orbits, then let the composition go ↓
          </p>
        </motion.div>
        {!enhanced ? (
          <div className="experience-gravity-poster">
            <Image
              src="/images/gravity/astra/celestial-orbits.webp"
              alt="Gravity’s cello and spatial performers."
              fill
              sizes="(min-width:760px) 50vw,100vw"
            />
          </div>
        ) : null}
        {enhanced ? (
          <div
            className="experience-touch-surface"
            role="img"
            aria-label="Drag sideways to change perspective, or use the listening perspective buttons."
            onPointerMove={point}
            onPointerDown={(event) => {
              if (event.pointerType === "touch")
                touch.current = { x: event.clientX, y: event.clientY };
            }}
            onPointerUp={() => {
              touch.current = null;
            }}
            onPointerCancel={() => {
              touch.current = null;
            }}
            onPointerLeave={() => {
              touch.current = null;
              input.current.pointer = [0, 0];
            }}
          />
        ) : null}
        <motion.div
          className="experience-gravity-afterword"
          hidden={!enhanced || phase !== "dissolve"}
          style={{ opacity: endOpacity, visibility: endVisibility }}
        >
          <p>Curiosity makes room for possibility.</p>
          <h2>What matters next.</h2>
          <a href="#experience-thinking">Explore the essays ↓</a>
        </motion.div>
        {failed ? (
          <p className="experience-fallback-note" role="status">
            The 3D scene is unavailable. Explore the project or play the spatial
            excerpt.
          </p>
        ) : null}
        {enhanced ? (
          <a
            className="experience-gravity-image-credit"
            href="https://esawebb.org/images/sombrerogalaxy1/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sombrero · NASA, ESA, CSA, STScI
          </a>
        ) : null}
      </motion.div>
    </section>
  );
}
