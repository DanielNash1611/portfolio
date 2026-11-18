"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "./cases.css";

/** Enhancement only: every paragraph remains in normal flow and visible. */
export default function CaseMotion({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scope = root.current;
    if (!scope || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = scope.querySelectorAll<HTMLElement>(
      ".motion-reveal h1, .motion-reveal h2, .motion-reveal h3, .motion-reveal p, .motion-reveal li, .motion-reveal figure, .motion-reveal .oc-sequence, .motion-reveal .oc-comparison, .oc-jpd-body article > *, .oc-jpd-hero > div:first-child",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.dataset.ocReveal = preference.matches ? "still" : "entered";
          observer.unobserve(element);
        });
      },
      { threshold: 0.06 },
    );
    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
