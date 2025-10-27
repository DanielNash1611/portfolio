"use client";

import { useEffect, useMemo, useState } from "react";

interface StatTileProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

const StatTile = ({
  value,
  label,
  prefix,
  suffix,
  duration = 1200
}: StatTileProps): JSX.Element => {
  const [displayValue, setDisplayValue] = useState(0);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let start: number | null = null;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayValue(Math.round(progress * value));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [duration, prefersReducedMotion, value]);

  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-brand-slate/10 bg-white/70 p-6 text-left shadow-soft">
      <p
        className="text-3xl font-semibold text-brand-teal"
        aria-live="polite"
        aria-atomic="true"
      >
        {prefix}
        {displayValue}
        {suffix}
      </p>
      <p className="text-sm text-brand-slate/80">{label}</p>
    </div>
  );
};

export default StatTile;
