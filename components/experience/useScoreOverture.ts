"use client";

import { useMotionValue, useMotionValueEvent } from "framer-motion";
import { useCallback, useEffect, useState, type RefObject } from "react";
import { mapUnfoldTravel } from "@/lib/experience/map-unfold";
import { scoreOvertureTravel } from "@/lib/experience/score-sequence";

export function useScoreOverture(
  root: RefObject<HTMLElement | null>,
  stage: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  paused: boolean,
  kind: "score" | "map" = "score",
) {
  const progress = useMotionValue(1);
  const [distance, setDistance] = useState(0);
  const [ready, setReady] = useState(true);
  const travel = enabled ? distance : 0;
  useMotionValueEvent(progress, "change", (value) => setReady(value >= 0.995));
  useEffect(() => {
    if (!enabled) {
      progress.set(1);
      return;
    }
    const element = stage.current;
    if (!element) return;
    const measure = () =>
      setDistance(
        kind === "map"
          ? mapUnfoldTravel(element.clientHeight)
          : scoreOvertureTravel(element.clientHeight),
      );
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    measure();
    return () => resize.disconnect();
  }, [enabled, kind, progress, stage]);
  // Read live DOM geometry at interaction time; ref identity remains stable.
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const start = useCallback(() => {
    if (!root.current || !stage.current) return 0;
    const top = parseFloat(getComputedStyle(stage.current).top) || 113;
    return root.current.getBoundingClientRect().top + scrollY - top;
  }, [root, stage]);
  useEffect(() => {
    if (!enabled || !travel || paused) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      progress.set(Math.max(0, Math.min(1, (scrollY - start()) / travel)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [enabled, paused, progress, start, travel]);
  const seek = useCallback(
    (value: number) => {
      window.scrollTo({
        top: start() + Math.max(0, Math.min(1, value)) * travel,
        behavior: "instant",
      });
    },
    [start, travel],
  );
  return { progress, travel, ready: !enabled || ready, seek };
}
