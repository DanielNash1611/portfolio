"use client";
import { useEffect, type RefObject } from "react";
import { useMotionValue } from "framer-motion";
import { omsScrollProgress } from "./oms-evidence";

export function omsHeaderOffset() {
  return (
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--portfolio-header-height",
      ),
    ) || 61
  );
}
/** Native window scrolling; at most one measurement per frame, never wheel interception. */
export default function useOmsScrollProgress(
  root: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const progress = useMotionValue(0);
  useEffect(() => {
    const element = root.current;
    if (!enabled || !element) {
      progress.set(0);
      return;
    }
    let pending = 0;
    const measure = () => {
      pending = 0;
      const rect = element.getBoundingClientRect();
      progress.set(
        omsScrollProgress(
          rect.top,
          element.offsetHeight,
          window.innerHeight,
          omsHeaderOffset(),
        ),
      );
    };
    const schedule = () => {
      if (!pending) pending = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer =
      "ResizeObserver" in window ? new ResizeObserver(schedule) : undefined;
    observer?.observe(element);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      if (pending) cancelAnimationFrame(pending);
    };
  }, [enabled, progress, root]);
  return progress;
}
