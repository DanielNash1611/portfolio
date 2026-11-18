"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionValue } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";
import {
  portraitHandoffOffset,
  portraitPhases,
} from "@/lib/experience/portrait-scroll";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Keep the already-turned still when there isn't room for the whole stage. */
export function useIntroLayoutFits() {
  const [fits, setFits] = useState(false);
  useEffect(() => {
    const query = matchMedia(
      "(max-width:759px) and (min-height:540px), (min-width:760px) and (min-height:720px)",
    );
    const update = () => setFits(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return fits;
}

export function useIntroProgress(
  scene: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const progress = useMotionValue(0);
  const portraitOffset = useMotionValue(0);
  useGSAP(
    () => {
      if (!enabled || !scene.current) {
        progress.set(0);
        portraitOffset.set(0);
        return;
      }
      const element = scene.current;
      let travel = 1;
      const update = (self: ScrollTrigger) => {
        progress.set(self.progress);
        portraitOffset.set(
          portraitHandoffOffset((window.scrollY - self.start) / travel, travel),
        );
        const handoff = String(self.progress > portraitPhases.look);
        if (element.dataset.handoff !== handoff)
          element.setAttribute("data-handoff", handoff);
      };
      const trigger = ScrollTrigger.create({
        trigger: element,
        start: () => {
          const header =
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--portfolio-header-height",
              ),
            ) || 61;
          const toolbar =
            scene.current?.parentElement
              ?.querySelector(".experience-control-bar")
              ?.getBoundingClientRect().height ?? 52;
          return `top top+=${header + toolbar}`;
        },
        // The HTML releases at the look. The footage keeps seeking through the
        // native handoff while its portrait compensates for the outgoing stage.
        end: () => {
          const stage = element.querySelector<HTMLElement>(
            ".experience-career-hero",
          );
          const pinSpace =
            element.getBoundingClientRect().height -
            (stage?.getBoundingClientRect().height ?? 0);
          travel = Math.max(1, pinSpace / portraitPhases.look);
          return `+=${travel}`;
        },
        onUpdate: update,
        onRefresh: update,
      });
      update(trigger);
      // MainContainer measures the fixed header and animates its padding after
      // hydration. Re-measure once that settles so frame zero stays at page top.
      const main = document.getElementById("main");
      const settled = (event: TransitionEvent) => {
        if (event.target === main && event.propertyName === "padding-top")
          trigger.refresh();
      };
      main?.addEventListener("transitionend", settled);
      let disposed = false;
      void document.fonts.ready.then(() => {
        if (!disposed) trigger.refresh();
      });
      return () => {
        disposed = true;
        main?.removeEventListener("transitionend", settled);
        trigger.kill();
        delete element.dataset.handoff;
        portraitOffset.set(0);
      };
    },
    { scope: scene, dependencies: [enabled], revertOnUpdate: true },
  );
  return { progress, portraitOffset };
}
