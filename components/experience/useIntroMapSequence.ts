"use client";
import { useEffect, type RefObject } from "react";
import {
  introMapController,
  type IntroMapGeometry,
} from "@/lib/experience/intro-map-sequence";

import {
  orchestraArrivalGuard,
  type OrchestraGeometry,
} from "@/lib/experience/orchestra-stop";

import {
  referralSwipeController,
  type ReferralGeometry,
} from "@/lib/experience/referral-swipe";

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
  const products = root.querySelector<HTMLElement>("#experience-products");
  const map = root.querySelector<HTMLElement>(
    '#experience-outcomes[data-container="navigation-case"][data-reading="false"]',
  );
  const stage = map?.querySelector<HTMLElement>(".outcome-stage");
  if (
    !hero ||
    !products ||
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
  const mapStart = map.getBoundingClientRect().top + scrollY - top;
  const nextSection = products.getBoundingClientRect().top + scrollY - top;
  if (
    !Number.isFinite(travel) ||
    travel <= 0 ||
    mapStart <= start ||
    nextSection <= mapStart + travel
  )
    return null;
  return { start, mapStart, travel, nextSection };
}

/** Match useScoreOverture's live sticky geometry; no generic section stop. */
function orchestraGeometry(root: HTMLElement): OrchestraGeometry | null {
  if (!matchMedia("(max-width: 759px), (pointer: coarse)").matches) return null;
  const score = root.querySelector<HTMLElement>(
    '[data-container="score-folio"][data-reading="false"]',
  );
  const stage = score?.querySelector<HTMLElement>(".outcome-stage");
  if (
    !score ||
    !stage ||
    stage.dataset.open === "true" ||
    stage.dataset.returning === "true"
  )
    return null;
  const travel = parseFloat(
    getComputedStyle(score).getPropertyValue("--score-overture-travel"),
  );
  if (!Number.isFinite(travel) || travel <= 0) return null;
  const top = parseFloat(getComputedStyle(stage).top) || 113;
  return { start: score.getBoundingClientRect().top + scrollY - top, travel };
}

/** Same start-start/end-end mapping as the recommendation ring's useScroll. */
function referralGeometry(root: HTMLElement): ReferralGeometry | null {
  if (!matchMedia("(max-width: 759px), (pointer: coarse)").matches) return null;
  const section = root.querySelector<HTMLElement>(
    '#experience-recommendations[data-static="false"]',
  );
  if (!section || document.querySelector(".experience-referral-detail[open]"))
    return null;
  const travel = section.clientHeight - innerHeight;
  const count = section.querySelectorAll(".experience-referral-card").length;
  if (travel <= 0 || !count) return null;
  return {
    start: section.getBoundingClientRect().top + scrollY,
    travel,
    count,
  };
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
      const duration =
        element.dataset.homePacing === "true" &&
        matchMedia("(max-width: 899px), (pointer: coarse)").matches
          ? 480
          : 320;
      const tick = (now: number) => {
        const t = Math.min(1, (now - started) / duration);
        window.scrollTo({
          top: from + (target - from) * (1 - (1 - t) ** 3),
          behavior: "instant",
        });
        frame = t < 1 ? requestAnimationFrame(tick) : 0;
      };
      frame = requestAnimationFrame(tick);
    };
    const host = {
      position: () => scrollY,
      native: (target: EventTarget | null) => nativeTarget(target, element),
      zoomed: () => (window.visualViewport?.scale ?? 1) > 1.01,
      move: (top: number) => window.scrollTo({ top, behavior: "instant" }),
      settle,
      cancel,
    };
    const intro = introMapController({
      ...host,
      geometry: () => geometry(element),
    });
    const orchestra = orchestraArrivalGuard({
      ...host,
      geometry: () => orchestraGeometry(element),
    });
    const referrals = referralSwipeController({
      ...host,
      geometry: () => referralGeometry(element),
    });
    const controllers = [intro, orchestra, referrals];
    const start = (event: TouchEvent) =>
      controllers.forEach((c) => c.start(event));
    const move = (event: TouchEvent) =>
      controllers.forEach((c) => c.move(event));
    const end = (event: TouchEvent) => controllers.forEach((c) => c.end(event));
    const abort = () => controllers.forEach((c) => c.abort());
    const scrolled = () => {
      orchestra.scrolled();
      referrals.scrolled();
    };
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
    window.addEventListener("scroll", scrolled, { passive: true });
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
      window.removeEventListener("scroll", scrolled);
      window.removeEventListener("wheel", abort);
      window.removeEventListener("keydown", abort);
      window.removeEventListener("hashchange", abort);
      window.removeEventListener("resize", resize);
    };
  }, [root, enabled]);
}
