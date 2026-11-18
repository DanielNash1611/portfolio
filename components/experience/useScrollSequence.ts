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
import {
  sequenceIndex,
  sequenceTarget,
} from "@/lib/experience/reveal-sequence";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function useSequenceFits() {
  const [fits, setFits] = useState(false);
  useEffect(() => {
    const query = matchMedia("(min-height:540px)");
    const update = () => setFits(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return fits;
}

/** Native sticky layout, with optional chapter buttons and no scroll interception. */
export function useScrollSequence(
  ref: RefObject<HTMLElement | null>,
  count: number,
  enabled: boolean,
) {
  const progress = useMotionValue(0);
  const [index, setIndex] = useState(0);
  const trigger = useRef<ScrollTrigger | null>(null);
  useGSAP(
    () => {
      if (!enabled || !ref.current) return;
      const update = (self: ScrollTrigger) => {
        progress.set(self.progress);
        setIndex(sequenceIndex(self.progress, count));
      };
      const current = ScrollTrigger.create({
        trigger: ref.current,
        start: () =>
          `top top+=${(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--portfolio-header-height")) || 61) + 52}`,
        end: "bottom bottom",
        onUpdate: update,
        onRefresh: update,
      });
      trigger.current = current;
      update(current);
      return () => {
        current.kill();
        trigger.current = null;
      };
    },
    { scope: ref, dependencies: [enabled, count], revertOnUpdate: true },
  );
  const select = useCallback(
    (next: number) => {
      const current = trigger.current;
      if (!current) return;
      window.scrollTo({
        top:
          current.start +
          sequenceTarget(next, count) * (current.end - current.start),
        behavior: "instant",
      });
    },
    [count],
  );
  return { progress, index, select };
}
