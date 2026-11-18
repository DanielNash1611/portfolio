"use client";

import { useMotionValue } from "framer-motion";
import { useCallback, useEffect, useState, type RefObject } from "react";
import {
  canPinProductProof,
  productProofTarget,
  productProofTravel,
} from "@/lib/experience/product-proof";

/** Ordinary document scrolling owns the story. No wheel/touch interception. */
export function useProductProof(
  root: RefObject<HTMLElement | null>,
  stage: RefObject<HTMLDivElement | null>,
  reading: boolean,
  paused: boolean,
) {
  const progress = useMotionValue(0);
  const [fits, setFits] = useState(false);
  const [travel, setTravel] = useState(0);
  const enabled = fits && !reading;
  useEffect(() => {
    const update = () => setFits(canPinProductProof(innerWidth, innerHeight));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  useEffect(() => {
    const element = stage.current;
    if (!enabled || !element) return;
    const measure = () => setTravel(productProofTravel(element.clientHeight));
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, [enabled, stage]);
  // Read live DOM geometry at interaction time; ref identity remains stable.
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const start = useCallback(() => {
    if (!root.current || !stage.current) return scrollY;
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
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [enabled, travel, paused, progress, start]);
  const select = useCallback(
    (project: number, step: number) => {
      const value = productProofTarget(project, step);
      progress.set(value);
      window.scrollTo({ top: start() + value * travel, behavior: "instant" });
    },
    [progress, start, travel],
  );
  return { enabled, progress, travel: enabled ? travel : 0, select };
}
