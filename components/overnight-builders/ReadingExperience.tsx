"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Progressive emphasis, never hidden content. No scroll listeners or interception. */
export default function ReadingExperience({
  children,
}: {
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPaused(true);
      return;
    }
    if (!window.IntersectionObserver) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-reading-seen", "true");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    root.current
      ?.querySelectorAll("section p, section li, section figure")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className="builders-reading"
      ref={root}
      data-motion={paused ? "off" : "on"}
    >
      <div className="builders-motion-toolbar">
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? "Motion paused" : "Pause motion"}
        </button>
      </div>
      {children}
    </div>
  );
}
