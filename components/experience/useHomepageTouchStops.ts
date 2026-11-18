"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  touchStopController,
  type TouchStops,
} from "@/lib/experience/touch-stops";

/** Forms, dialogs, media and independently scrolling widgets keep native touch. */
function nativeTouch(target: EventTarget | null, root: HTMLElement) {
  if (!(target instanceof Element)) return true;
  // Portaled overlays own their own touch; do not scroll the page behind them.
  if (
    !root.contains(target) &&
    !target.closest('[data-site-header="true"], footer')
  )
    return true;
  if (
    target.closest(
      'dialog, [role="dialog"], input, textarea, select, video, audio, canvas, [contenteditable="true"], [data-native-touch]',
    )
  )
    return true;
  for (
    let node: Element | null = target;
    node && node !== root && node !== document.body;
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

function measure(root: HTMLElement): TouchStops {
  const viewport = window.visualViewport?.height ?? innerHeight;
  const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
  const header =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--portfolio-header-height",
      ),
    ) || 61;
  const inset = header + 52;
  const top = (node: Element, offset = inset) =>
    Math.max(
      0,
      Math.min(max, node.getBoundingClientRect().top + scrollY - offset),
    );
  const landmarks = root.querySelectorAll<HTMLElement>(
    'section[id^="experience-"], .experience-disclosure, .experience-extra-depth, .clarity-guide-head, .clarity-team-practice, .clarity-principles-section',
  );
  const stops = [0, top(root), top(root, 0) + root.offsetHeight - inset, max];
  for (const node of landmarks) {
    if (node.getClientRects().length && node.getBoundingClientRect().height > 0)
      stops.push(top(node));
  }
  const scenes: TouchStops["scenes"][number][] = [];
  for (const journey of root.querySelectorAll<HTMLElement>(
    ".clarity-journey",
  )) {
    const canvas = journey.querySelector<HTMLElement>(".clarity-fog-scene");
    if (!canvas) continue;
    const start = top(journey, 0);
    const end = Math.min(
      max,
      start + journey.offsetHeight - canvas.offsetHeight,
    );
    const points = [
      start,
      ...Array.from(journey.querySelectorAll(".clarity-journey-stop"), (node) =>
        top(node, 0),
      ),
      end,
    ].sort((a, b) => a - b);
    scenes.push({ start, end, stops: points });
    stops.push(...points);
  }
  return {
    viewport,
    max,
    scenes,
    stops: [
      ...new Set(stops.map((value) => Math.max(0, Math.min(max, value)))),
    ].sort((a, b) => a - b),
  };
}

export function useHomepageTouchStops(
  root: RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  const navigate = useRef<(direction: number) => void>(() => {});
  useEffect(() => {
    const element = root.current;
    if (!enabled || !element) return;
    let animation = 0;
    const cancel = () => {
      cancelAnimationFrame(animation);
      animation = 0;
    };
    const zoomed = () => (window.visualViewport?.scale ?? 1) > 1.01;
    const settle = (target: number) => {
      cancel();
      const from = scrollY;
      const started = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - started) / 260);
        window.scrollTo({
          top: from + (target - from) * (1 - (1 - t) ** 3),
          behavior: "instant",
        });
        animation = t < 1 ? requestAnimationFrame(tick) : 0;
      };
      animation = requestAnimationFrame(tick);
    };
    const {
      start,
      move,
      end,
      abort,
      navigate: step,
    } = touchStopController({
      position: () => scrollY,
      // All layout reads happen once per gesture or button press.
      layout: () => measure(element),
      zoomed,
      native: (target) => nativeTouch(target, element),
      move: (top) => window.scrollTo({ top, behavior: "instant" }),
      settle,
      cancel,
    });
    const link = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest("a, button, summary"))
        abort();
    };
    navigate.current = step;
    document.addEventListener("touchstart", start, { passive: true });
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", end, { passive: true });
    document.addEventListener("touchcancel", abort, { passive: true });
    document.addEventListener("click", link, true);
    window.addEventListener("wheel", abort, { passive: true });
    window.addEventListener("keydown", abort);
    window.addEventListener("hashchange", abort);
    window.addEventListener("resize", abort);
    return () => {
      abort();
      navigate.current = () => {};
      document.removeEventListener("touchstart", start);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", end);
      document.removeEventListener("touchcancel", abort);
      document.removeEventListener("click", link, true);
      window.removeEventListener("wheel", abort);
      window.removeEventListener("keydown", abort);
      window.removeEventListener("hashchange", abort);
      window.removeEventListener("resize", abort);
    };
  }, [root, enabled]);
  return (direction: number) => navigate.current(direction);
}
