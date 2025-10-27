"use client";

import { useState } from "react";
import Image from "next/image";

interface BeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfter = ({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After"
}: BeforeAfterProps): JSX.Element => {
  const [position, setPosition] = useState(50);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-brand-slate/10 bg-brand-teal/5">
        <Image
          src={beforeSrc}
          alt={`${beforeLabel} view`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          aria-hidden="true"
        >
          <Image
            src={afterSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
        <div
          className="absolute inset-y-0"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        >
          <div className="h-full w-1 bg-brand-orange shadow-soft" />
        </div>
        <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-brand-teal">
          {beforeLabel}
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-brand-teal">
          {afterLabel}
        </div>
      </div>
      <label className="flex items-center gap-3 text-sm text-brand-slate/80">
        <span>{beforeLabel}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-brand-teal/20 accent-brand-orange"
          aria-label="Before and after comparison slider"
        />
        <span>{afterLabel}</span>
      </label>
    </div>
  );
};

export default BeforeAfter;
