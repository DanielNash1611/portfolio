"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Progressive emphasis only: content is visible even before hydration or without JS. */
export default function ScrollReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("enterprise-in-view");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    root.current
      .querySelectorAll(
        ".enterprise-prose > *, .enterprise-prose > div > div, .enterprise-oms section .motion-reveal > *, .enterprise-artifact",
      )
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={root} className="enterprise-scroll-reveals">
      {children}
    </div>
  );
}
