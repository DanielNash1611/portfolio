"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import {
  relaySections,
  sampleContinuity,
  type RelayAnchor,
} from "@/lib/experience/continuity";
gsap.registerPlugin(useGSAP, ScrollTrigger);
/** Each handoff transforms the section's actual HTML. No persistent ornament. */
export function useContinuity(
  root: RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  useGSAP(
    () => {
      if (!enabled || !root.current) return;
      const element = root.current;
      let anchors: RelayAnchor[] = [];
      const measure = () => {
        anchors = [
          { id: "intro", y: element.getBoundingClientRect().top + scrollY },
        ];
        for (const section of relaySections) {
          const node = element.querySelector<HTMLElement>(section.selector);
          if (node && !node.closest("details:not([open])"))
            anchors.push({
              id: section.id,
              y: node.getBoundingClientRect().top + scrollY - innerHeight * 0.2,
            });
        }
        anchors.sort((a, b) => a.y - b.y);
      };
      let chapter = "";
      const update = () => {
        const next = sampleContinuity(anchors, scrollY).section;
        if (next !== chapter) {
          chapter = next;
          element.setAttribute("data-chapter", next);
        }
      };
      measure();
      update();
      const director = ScrollTrigger.create({
        trigger: element,
        start: "top top",
        end: "bottom bottom",
        onUpdate: update,
        onRefresh: () => {
          measure();
          update();
        },
      });
      for (const section of relaySections) {
        const node = element.querySelector<HTMLElement>(section.selector);
        if (!node || node.closest("details:not([open])")) continue;
        node.style.setProperty("--handoff-from", section.from);
        node.style.setProperty("--handoff-to", section.to);
        // These chapters own their viewport composition and scroll reveals.
        // A second heading transform would move type into the eyebrow above it.
        if (
          [
            "outcomes",
            "products",
            "work",
            "gravity",
            "recommendation",
            "impact",
            "direction",
            "ai",
            "toolkit",
            "voices",
          ].includes(section.id)
        )
          continue;
        const heading = node.querySelector("h2");
        if (heading)
          gsap.fromTo(
            heading,
            { y: 38, rotate: -1.3 },
            {
              y: -12,
              rotate: 0,
              ease: "none",
              scrollTrigger: {
                trigger: node,
                start: "top bottom",
                end: "center center",
                scrub: true,
              },
            },
          );
        const visual = node.querySelector(
          ".experience-story-visual, .experience-open-decisions article, .experience-portrait",
        );
        if (visual)
          gsap.fromTo(
            visual,
            { clipPath: "inset(10% 4% 6% 4% round 28px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              ease: "none",
              scrollTrigger: {
                trigger: visual,
                start: "top 90%",
                end: "top 45%",
                scrub: true,
              },
            },
          );
      }
      // Layout changes from fonts and lazy media refresh after scrolling settles.
      let pending = false,
        lastHeight = element.offsetHeight;
      const refresh = () => {
        if (!ScrollTrigger.isScrolling()) {
          pending = false;
          ScrollTrigger.refresh();
        } else pending = true;
      };
      const settled = () => {
        if (pending) refresh();
      };
      const resize = new ResizeObserver(() => {
        const height = element.offsetHeight;
        if (Math.abs(height - lastHeight) > 2) {
          lastHeight = height;
          refresh();
        }
      });
      resize.observe(element);
      ScrollTrigger.addEventListener("scrollEnd", settled);
      let active = true;
      void document.fonts.ready.then(() => {
        if (active) refresh();
      });
      return () => {
        active = false;
        resize.disconnect();
        director.kill();
        ScrollTrigger.removeEventListener("scrollEnd", settled);
        delete element.dataset.chapter;
      };
    },
    { scope: root, dependencies: [enabled], revertOnUpdate: true },
  );
}
