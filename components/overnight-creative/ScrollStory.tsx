"use client";

import { useEffect, useRef, useState } from "react";
import StoryGraphic, { type StoryKind } from "./StoryGraphic";
import styles from "./scroll-story.module.css";

export type StoryScene = {
  title: string;
  eyebrow?: string;
  body: readonly string[];
};

/** Reading order is normal document flow. Scrolling only directs the illustration. */
export default function ScrollStory({
  kind,
  label,
  scenes,
  caption,
}: {
  kind: StoryKind;
  label: string;
  scenes: readonly StoryScene[];
  caption: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const manualUntil = useRef(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (paused || performance.now() < manualUntil.current) return;
      const rows = Array.from(
        element.querySelectorAll<HTMLElement>("[data-story-scene]"),
      );
      let index = 0;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].getBoundingClientRect().top <= innerHeight * 0.5) index = i;
      }
      setActive(index);
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(element);
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    update();
    return () => {
      observer.disconnect();
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
      cancelAnimationFrame(frame);
    };
  }, [paused]);
  const still = paused || reduced || !inView;
  return (
    <div
      ref={root}
      className={styles.story}
      data-kind={kind}
      data-still={still}
      aria-label={label}
    >
      <figure className={styles.visual}>
        <div className={styles.graphic}>
          <StoryGraphic kind={kind} stage={active} count={scenes.length} />
        </div>
        <figcaption>
          <span className={styles.current}>
            {String(active + 1).padStart(2, "0")} / {scenes[active].title}
          </span>
          <p>{caption}</p>
        </figcaption>
        <div className={styles.controls}>
          <div role="group" aria-label={`${label} illustration steps`}>
            {scenes.map((scene, index) => (
              <button
                key={scene.title}
                type="button"
                aria-label={`Show illustration: ${scene.title}`}
                aria-pressed={active === index}
                onClick={() => {
                  manualUntil.current = performance.now() + 500;
                  setActive(index);
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            aria-pressed={paused}
          >
            {paused ? "Resume motion" : "Pause motion"}
          </button>
        </div>
      </figure>
      <ol className={styles.scenes}>
        {scenes.map((scene, index) => (
          <li
            key={scene.title}
            data-story-scene
            data-current={active === index}
          >
            <p className={styles.eyebrow}>
              {String(index + 1).padStart(2, "0")} / {scene.eyebrow || label}
            </p>
            <h3>{scene.title}</h3>
            {scene.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
