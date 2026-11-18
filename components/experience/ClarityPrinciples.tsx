"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ExperienceHomeContent } from "@/content/experience-home";
import {
  stackArrival,
  sequenceIndex,
  sequenceTarget,
} from "@/lib/experience/reveal-sequence";

type Values = ExperienceHomeContent["positioning"]["categories"];
const questions = [
  "What should change for the people using it?",
  "Can people understand and trust the change?",
  "What can people do better?",
];

function PrincipleCard({
  value,
  index,
  progress,
  animated,
  active,
}: {
  value: Values[number];
  index: number;
  progress: MotionValue<number>;
  animated: boolean;
  active: boolean;
}) {
  const y = useTransform(
    progress,
    (p) => `${(1 - stackArrival(p, index, 3)) * 140}%`,
  );
  const rotate = useTransform(
    progress,
    (p) => (1 - stackArrival(p, index, 3)) * (index % 2 ? 4 : -4),
  );
  return (
    <motion.article
      className="clarity-principle-card"
      data-active={active}
      style={
        animated ? { y, rotate, top: index * 48, zIndex: index + 1 } : undefined
      }
    >
      <header>
        <span>0{index + 1}</span>
        <h4>{value.title}</h4>
      </header>
      <div aria-hidden={animated && !active}>
        <p>{value.description}</p>
        <p className="clarity-principle-question">{questions[index]}</p>
      </div>
    </motion.article>
  );
}

export default function ClarityPrinciples({
  values,
  reading,
  paused,
}: {
  values: Values;
  reading: boolean;
  paused: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(false);
  useEffect(() => {
    const query = matchMedia("(min-height: 640px)");
    const update = () => setFits(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const animated = fits && !reading && !paused;
  const progress = useMotionValue(0);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const element = root.current;
    const stage = element?.querySelector<HTMLElement>(
      ".clarity-principles-stage",
    );
    if (!animated || !element || !stage) return;
    let frame = 0;
    let start = 0;
    let distance = 1;
    let nearby = true;
    const update = () => {
      frame = 0;
      const value = Math.max(0, Math.min(1, (scrollY - start) / distance));
      progress.set(value);
      setIndex((previous) => {
        const next = sequenceIndex(value, values.length);
        return previous === next ? previous : next;
      });
    };
    const schedule = () => {
      if (nearby && !document.hidden && !frame)
        frame = requestAnimationFrame(update);
    };
    const measure = () => {
      const top = parseFloat(getComputedStyle(stage).top) || 113;
      start = element.getBoundingClientRect().top + scrollY - top;
      distance = Math.max(1, element.offsetHeight - stage.offsetHeight);
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(stage);
    const page = element.closest(".experience");
    if (page) observer.observe(page);
    const visibility = new IntersectionObserver(
      ([entry]) => {
        nearby = entry.isIntersecting;
        if (!nearby) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
        update();
      },
      { rootMargin: "200px 0px" },
    );
    visibility.observe(element);
    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [animated, progress, values.length]);
  function select(next: number) {
    const element = root.current;
    const stage = element?.querySelector<HTMLElement>(
      ".clarity-principles-stage",
    );
    if (!element || !stage) return;
    const top = parseFloat(getComputedStyle(stage).top) || 113;
    const travel = Math.max(1, element.offsetHeight - stage.offsetHeight);
    window.scrollTo({
      top:
        scrollY +
        element.getBoundingClientRect().top -
        top +
        sequenceTarget(next, values.length) * travel,
      behavior: "instant",
    });
  }
  useEffect(() => {
    if (
      !["#experience-principles", "#clarity-principles"].includes(location.hash)
    )
      return;
    const frame = requestAnimationFrame(() =>
      root.current
        ?.closest("section")
        ?.scrollIntoView({ block: "start", behavior: "instant" }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div ref={root} className="clarity-principles" data-stacked={animated}>
      <div className="clarity-principles-stage">
        <div className="clarity-principles-deck">
          {values.map((value, i) => (
            <PrincipleCard
              key={value.title}
              value={value}
              index={i}
              progress={progress}
              animated={animated}
              active={index === i}
            />
          ))}
        </div>
        {animated && (
          <nav aria-label="Choose a guiding principle">
            {values.map((value, i) => (
              <button
                key={value.title}
                aria-current={index === i ? "step" : undefined}
                onClick={() => select(i)}
              >
                {value.title}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
