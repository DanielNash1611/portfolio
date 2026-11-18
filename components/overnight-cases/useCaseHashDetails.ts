"use client";
import { useEffect, useRef } from "react";

/** Preserve native deep links into uncontrolled source disclosures after hydration. */
export default function useCaseHashDetails() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const reveal = () => {
      frame = 0;
      let id: string;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      const target = id ? document.getElementById(id) : null;
      if (!target || !root.current?.contains(target)) return;
      let changed = false;
      for (
        let node = target.parentElement;
        node && root.current.contains(node);
        node = node.parentElement
      ) {
        if (node instanceof HTMLDetailsElement && !node.open) {
          node.open = true;
          changed = true;
        }
      }
      if (changed)
        frame = requestAnimationFrame(() =>
          target.scrollIntoView({ block: "start", behavior: "instant" }),
        );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(reveal);
    };
    schedule();
    addEventListener("hashchange", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("hashchange", schedule);
    };
  }, []);
  return root;
}
