"use client";
import { useEffect, useRef, useState } from "react";

export default function useNarrativeStages() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reading, setReading] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      () => {
        // Read current geometry rather than old observer entries after a jump.
        const stages = [
          ...element.querySelectorAll<HTMLElement>("[data-enterprise-stage]"),
        ].map((section) => {
          const rect = section.getBoundingClientRect();
          return {
            index: Number(section.dataset.enterpriseStage),
            top: rect.top,
            bottom: rect.bottom,
          };
        });
        const current = nearestVisibleStage(stages, window.innerHeight);
        if (current !== undefined) setActive(current);
      },
      { rootMargin: "-20% 0px -45% 0px", threshold: 0 },
    );
    element
      .querySelectorAll("[data-enterprise-stage]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  function choose(index: number) {
    setActive(index);
    const section = root.current?.querySelector<HTMLElement>(
      `[data-enterprise-stage="${index}"]`,
    );
    section?.scrollIntoView({ behavior: "instant", block: "start" });
  }
  return { root, active, choose, reading, setReading, ready };
}

export function nearestVisibleStage(
  stages: readonly { index: number; top: number; bottom: number }[],
  height: number,
): number | undefined {
  return stages
    .filter((stage) => stage.bottom > height * 0.2 && stage.top < height * 0.55)
    .sort(
      (a, b) => Math.abs(a.top - height * 0.3) - Math.abs(b.top - height * 0.3),
    )[0]?.index;
}
