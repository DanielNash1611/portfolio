"use client";
import { useEffect, type RefObject } from "react";
import {
  introMapController,
  type IntroMapGeometry,
} from "@/lib/experience/intro-map-sequence";

function nativeTarget(target: EventTarget | null, root: HTMLElement) {
  if (
    !(target instanceof Element) ||
    target.closest(
      'input,textarea,select,canvas,video,audio,dialog,[role="dialog"],[contenteditable="true"]',
    )
  )
    return true;
  for (
    let node: Element | null = target;
    node && node !== root;
    node = node.parentElement
  ) {
    const style = getComputedStyle(node);
    if (
      (/(auto|scroll)/.test(style.overflowY) &&
        node.scrollHeight > node.clientHeight + 1) ||
      (/(auto|scroll)/.test(style.overflowX) &&
        node.scrollWidth > node.clientWidth + 1)
    )
      return true;
  }
  return false;
}

/** Measure only the actual hero and first three-leaf map, once per touch gesture. */
function geometry(root: HTMLElement): IntroMapGeometry | null {
  const hero = root.querySelector<HTMLElement>("#experience-intro");
  const ending = hero?.querySelector<HTMLElement>(".cue-animation-landing");
  const map = root.querySelector<HTMLElement>(
    '#experience-outcomes[data-container="navigation-case"][data-reading="false"]',
  );
  const stage = map?.querySelector<HTMLElement>(".outcome-stage");
  if (
    !hero ||
    !ending ||
    !map ||
    !stage ||
    stage.dataset.open === "true" ||
    stage.dataset.returning === "true"
  )
    return null;
  const travel = parseFloat(
    getComputedStyle(map).getPropertyValue("--navigation-unfold-travel"),
  );
  const top = parseFloat(getComputedStyle(stage).top) || 113;
  const start = Math.max(0, hero.getBoundingClientRect().top + scrollY - top);
  const heroEnd =
    ending.getBoundingClientRect().top + scrollY - innerHeight * 0.4;
  const mapStart = map.getBoundingClientRect().top + scrollY - top;
  if (
    !Number.isFinite(travel) ||
    travel <= 0 ||
    heroEnd <= start ||
    mapStart <= heroEnd
  )
    return null;
  return { start, heroEnd, mapStart, travel };
}

export function useIntroMapSequence(
  root: RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const element = root.current;
    if (!element || !enabled) return;
    let frame = 0;
    const cancel = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const settle = (target: number) => {
      cancel();
      const from = scrollY,
        started = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - started) / 320);
        window.scrollTo({
          top: from + (target - from) * (1 - (1 - t) ** 3),
          behavior: "instant",
        });
        frame = t < 1 ? requestAnimationFrame(tick) : 0;
      };
      frame = requestAnimationFrame(tick);
    };
    const { start, move, end, abort } = introMapController({
      position: () => scrollY,
      geometry: () => geometry(element),
      native: (target) => nativeTarget(target, element),
      zoomed: () => (window.visualViewport?.scale ?? 1) > 1.01,
      move: (top) => window.scrollTo({ top, behavior: "instant" }),
      settle,
      cancel,
    });
    // Collapsing phone browser chrome changes height during a swipe. Only
    // a width/orientation change invalidates and cancels this gesture.
    let width = innerWidth;
    const resize = () => {
      if (innerWidth !== width) {
        width = innerWidth;
        abort();
      }
    };
    const click = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest("a,button,summary"))
        abort();
    };
    element.addEventListener("touchstart", start, { passive: true });
    element.addEventListener("touchmove", move, { passive: false });
    element.addEventListener("touchend", end, { passive: true });
    element.addEventListener("touchcancel", abort, { passive: true });
    element.addEventListener("click", click, true);
    window.addEventListener("wheel", abort, { passive: true });
    window.addEventListener("keydown", abort);
    window.addEventListener("hashchange", abort);
    window.addEventListener("resize", resize);
    return () => {
      abort();
      element.removeEventListener("touchstart", start);
      element.removeEventListener("touchmove", move);
      element.removeEventListener("touchend", end);
      element.removeEventListener("touchcancel", abort);
      element.removeEventListener("click", click, true);
      window.removeEventListener("wheel", abort);
      window.removeEventListener("keydown", abort);
      window.removeEventListener("hashchange", abort);
      window.removeEventListener("resize", resize);
    };
  }, [root, enabled]);
}
