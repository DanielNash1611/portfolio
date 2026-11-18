"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionValue } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { canPinEnsemble } from "@/lib/experience/ensemble-scroll";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function useEnsembleScroll(
  root: RefObject<HTMLElement | null>,
  composition: RefObject<HTMLDivElement | null>,
  quiet: boolean,
) {
  const [fits, setFits] = useState(false);
  const trigger = useRef<ScrollTrigger | null>(null);
  const progress = useMotionValue(0);
  const enabled = fits && !quiet;
  useEffect(() => {
    const element = composition.current;
    if (!element) return;
    const measure = () => {
      const header =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--portfolio-header-height",
          ),
        ) || 61;
      setFits(canPinEnsemble(innerHeight, element.offsetHeight, header + 52));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [composition]);
  useGSAP(
    () => {
      if (!enabled || !root.current) return;
      const current = ScrollTrigger.create({
        trigger: root.current,
        start: () =>
          `top top+=${(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--portfolio-header-height")) || 61) + 52}`,
        end: "bottom bottom",
        onUpdate: (self) => progress.set(self.progress),
        onRefresh: (self) => progress.set(self.progress),
      });
      trigger.current = current;
      progress.set(current.progress);
      return () => {
        current.kill();
        trigger.current = null;
      };
    },
    { scope: root, dependencies: [enabled], revertOnUpdate: true },
  );
  const seek = useCallback((fraction: number) => {
    const current = trigger.current;
    if (!current) return;
    const p = Math.max(0, Math.min(1, fraction));
    window.scrollTo({
      top: current.start + p * (current.end - current.start),
      behavior: "instant",
    });
  }, []);
  return { enabled, progress, seek };
}
