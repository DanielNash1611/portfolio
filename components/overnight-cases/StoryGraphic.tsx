"use client";

import { useEffect, useRef, useState } from "react";
import "./cases.css";

export type StoryKind = "checkout" | "adoption" | "platform" | "planning";
const stories = {
  checkout: {
    label: "Simplify the path. Preserve the choices.",
    caption:
      "Illustrated workflow: many checkout conditions converge into a clearer customer journey. The actual before/after screens remain the product evidence.",
    labels: ["Many conditions", "Shared context", "Clearer flow"],
  },
  adoption: {
    label: "Proof, trust, then a wider network.",
    caption:
      "Illustrated adoption model: a measured pilot connects to governance and enablement, then wider company adoption. The pilot estimate and later usage figures describe separate stages.",
    labels: ["Measured pilot", "Governance + champions", "Broader adoption"],
  },
  platform: {
    label: "A prototype becomes a question about reuse.",
    caption:
      "Conceptual capability sketch: the prototype informed reusable-systems thinking across possible channels. These connections do not depict a deployed architecture.",
    labels: ["Prototype", "Reusable patterns", "Channel concepts"],
  },
  planning: {
    label: "From quarterly resets to a rolling conversation.",
    caption:
      "Illustrated planning model: opportunities enter a shared workspace, move through prioritization, and return as learning. The graphic summarizes the documented JPD approach.",
    labels: ["Capture ideas", "Compare together", "Review + iterate"],
  },
};

export default function StoryGraphic({ kind }: { kind: StoryKind }) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!ref.current) return;
      const bounds = ref.current.getBoundingClientRect();
      setProgress(
        media.matches
          ? 1
          : Math.max(
              0,
              Math.min(
                1,
                (innerHeight - bounds.top) / (innerHeight + bounds.height),
              ),
            ),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        window.addEventListener("scroll", schedule, { passive: true });
        schedule();
      } else window.removeEventListener("scroll", schedule);
    });
    if (ref.current) observer.observe(ref.current);
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, []);
  const story = stories[kind];
  const x = 75 + progress * 650;
  return (
    <figure
      ref={ref}
      id="case-motion"
      className={`oc-motion-graphic oc-graphic-${kind}`}
      data-progress={progress.toFixed(2)}
    >
      <div className="oc-graphic-heading">
        <span>Follow the decision</span>
        <h2>{story.label}</h2>
      </div>
      <svg viewBox="0 0 800 230" role="img" aria-label={story.label}>
        <g
          className="oc-graphic-lines"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {kind === "checkout" && (
            <>
              {[42, 78, 114, 150, 186].map((y) => (
                <path
                  key={y}
                  d={`M40 ${y} C190 ${y} 210 114 335 114 L440 114 C550 114 565 ${78 + (y - 42) / 2} 730 ${78 + (y - 42) / 2}`}
                />
              ))}
              {[42, 78, 114, 150, 186].map((y) => (
                <rect
                  key={`r${y}`}
                  x="24"
                  y={y - 7}
                  width="32"
                  height="14"
                  rx="3"
                />
              ))}
              <rect x="335" y="77" width="105" height="74" rx="6" />
              <path d="M359 99h56M359 114h56M359 129h34" />
              {[78, 114, 150].map((y) => (
                <rect
                  key={`s${y}`}
                  x="713"
                  y={y - 9}
                  width="56"
                  height="18"
                  rx="3"
                />
              ))}
            </>
          )}
          {kind === "adoption" && (
            <>
              <circle cx="100" cy="114" r="42" />
              <circle cx="100" cy="114" r="20" />
              <path d="M142 114H330M460 114H610M395 42v144" />
              <rect x="330" y="70" width="130" height="88" rx="44" />
              <path d="M374 113l15 15 30-31" />
              {[42, 78, 114, 150, 186].map((y, i) => (
                <g key={y}>
                  <path d={`M610 114L${665 + (i % 2) * 40} ${y}`} />
                  <circle cx={665 + (i % 2) * 40} cy={y} r="14" />
                  <path d={`M${679 + (i % 2) * 40} ${y}L765 ${y}`} />
                  <circle cx="765" cy={y} r="7" />
                </g>
              ))}
            </>
          )}
          {kind === "platform" && (
            <>
              <rect x="50" y="72" width="94" height="84" rx="6" />
              <path d="M70 94h54M70 112h40M70 130h27M144 114H330" />
              {[0, 1, 2].map((i) => (
                <rect
                  key={i}
                  x={330 + i * 38}
                  y={74 + i * 9}
                  width="30"
                  height="62"
                  rx="3"
                />
              ))}
              {[45, 114, 183].map((y) => (
                <g key={y}>
                  <path d={`M445 114C530 114 550 ${y} 650 ${y}`} />
                  <rect x="650" y={y - 18} width="100" height="36" rx="4" />
                </g>
              ))}
            </>
          )}
          {kind === "planning" && (
            <>
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <rect
                    x={32 + i * 22}
                    y={82 + i * 12}
                    width="62"
                    height="45"
                    rx="3"
                  />
                  <path d={`M${94 + i * 22} ${104 + i * 12}L220 114`} />
                </g>
              ))}
              <path d="M220 114H330M435 114H580M650 148C650 217 230 217 230 148" />
              <rect x="330" y="72" width="105" height="84" rx="5" />
              <path d="M349 94h66M349 114h49M349 134h30" />
              <circle cx="650" cy="114" r="43" />
              <path d="M633 100h28v28M661 100l-25 28M230 148l-7 12M230 148l10 9" />
            </>
          )}
        </g>
        <circle cx={x} cy="114" r="7" className="oc-graphic-traveler" />
        {story.labels.map((label, i) => (
          <text
            key={label}
            x={[100, 395, 690][i]}
            y="225"
            textAnchor="middle"
            fill="currentColor"
            fontSize="13"
          >
            {label}
          </text>
        ))}
      </svg>
      <figcaption>{story.caption}</figcaption>
    </figure>
  );
}
