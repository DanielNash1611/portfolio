"use client";

import { motion, useInView, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { useFormationProgress } from "./useFormationProgress";

export default function PrototypeReveal({
  children,
  quiet,
}: {
  children: ReactNode;
  quiet: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, {
    once: true,
    amount: 0.5,
    margin: "0px 0px -45% 0px",
  });
  const { progress, replay } = useFormationProgress(visible, quiet);
  const opacity = useTransform(progress, [0, 0.7, 1], [1, 0.95, 0]);
  const clipPath = useTransform(progress, (p) => `inset(0 ${p * 100}% 0 0)`);
  return (
    <div className="experience-prototype-reveal" ref={ref}>
      {children}
      <motion.div
        className="prototype-sketch"
        style={{
          opacity: quiet ? 0 : visible ? opacity : 1,
          clipPath: quiet
            ? "inset(0 100% 0 0)"
            : visible
              ? clipPath
              : "inset(0 0 0 0)",
        }}
        aria-hidden="true"
      >
        <p>
          Workflow sketch <span>/ Illustrative</span>
        </p>
        <svg viewBox="0 0 600 360" fill="none">
          <defs>
            <pattern
              id="prototype-paper-grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path d="M20 0H0V20" stroke="currentColor" opacity="0.12" />
            </pattern>
          </defs>
          <rect width="600" height="360" fill="url(#prototype-paper-grid)" />
          <g className="prototype-pencil">
            <rect x="50" y="50" width="500" height="258" rx="5" />
            <path d="M50 80H550M65 65H72M80 65H87M95 65H102" />
            <rect x="85" y="110" width="430" height="44" rx="4" />
            <path d="M105 132H280M105 190H190M105 210H320M105 230H240" />
            <rect x="350" y="181" width="135" height="70" rx="4" />
            <path d="M365 201H466M365 218H438" />
            <path d="M285 260V280H350M340 273L350 280L340 287" />
            <rect x="350" y="266" width="135" height="27" rx="4" />
          </g>
          <g fill="currentColor" className="prototype-annotations">
            <text x="89" y="38">
              Find the order
            </text>
            <text x="357" y="171">
              Review the evidence
            </text>
            <text x="77" y="335">
              Confirm before an action →
            </text>
          </g>
        </svg>
      </motion.div>
      {!quiet && (
        <button className="prototype-replay" onClick={replay}>
          <RotateCcw size={12} aria-hidden="true" />
          Sketch → prototype
        </button>
      )}
    </div>
  );
}
