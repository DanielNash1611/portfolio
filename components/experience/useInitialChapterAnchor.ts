"use client";
import { useEffect, type RefObject } from "react";
import { revealExperienceTarget } from "@/lib/experience/reveal-target";

// Once per document, so a later App Router Back restores the visitor's position.
let alignedDocumentAnchor = false;
export function useInitialChapterAnchor(
  root: RefObject<HTMLDivElement | null>,
  ready: boolean,
) {
  useEffect(() => {
    if (!ready || alignedDocumentAnchor) return;
    const hash = location.hash;
    if (!/^#experience-[a-z-]+$/.test(hash)) {
      alignedDocumentAnchor = true;
      return;
    }
    if (root.current) revealExperienceTarget(root.current, hash);
    let disposed = false,
      interrupted = false,
      frame = 0;
    const cancel = () => {
      interrupted = true;
    };
    const events = ["wheel", "touchmove", "pointerdown", "keydown"] as const;
    const remove = () => {
      for (const event of events) window.removeEventListener(event, cancel);
    };
    for (const event of events)
      window.addEventListener(event, cancel, { passive: true });
    let attempts = 0;
    const align = () => {
      if (disposed) return;
      if (interrupted || location.hash !== hash) {
        remove();
        alignedDocumentAnchor = true;
        return;
      }
      // MainContainer animates its measured header padding for 300 ms. Wait
      // for that layout to settle before correcting the browser's early hash jump.
      const main = document.getElementById("main");
      const targetPadding = parseFloat(main?.style.paddingTop || "0");
      const actualPadding = main
        ? parseFloat(getComputedStyle(main).paddingTop)
        : 0;
      if (Math.abs(targetPadding - actualPadding) > 0.5 && attempts++ < 120) {
        frame = requestAnimationFrame(align);
        return;
      }
      remove();
      alignedDocumentAnchor = true;
      const target = root.current?.querySelector<HTMLElement>(hash);
      if (!target) return;
      const offset =
        (parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--portfolio-header-height",
          ),
        ) || 61) + 52;
      window.scrollTo({
        top:
          target.getBoundingClientRect().top +
          scrollY -
          offset +
          Number(target.dataset.anchorOffset || 0),
        behavior: "instant",
      });
    };
    void document.fonts.ready.then(() => {
      if (!disposed) frame = requestAnimationFrame(align);
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      remove();
    };
  }, [ready, root]);
}
