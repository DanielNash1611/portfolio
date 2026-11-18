"use client";

import { useState } from "react";
import MediaFrame from "@/components/site/MediaFrame";

export type ArtifactStep = {
  label: string;
  title: string;
  detail: string;
  image: string;
  alt: string;
  ratio?: string;
};

export default function ArtifactExplorer({
  steps,
  label,
  caption,
}: {
  steps: ArtifactStep[];
  label: string;
  caption: string;
}) {
  const [selected, setSelected] = useState(0);
  const step = steps[selected];
  return (
    <div className="builders-walkthrough">
      <div>
        <div role="group" aria-label={label} className="builders-selectors">
          {steps.map((item, index) => (
            <button
              key={item.label}
              onClick={() => setSelected(index)}
              aria-pressed={selected === index}
              aria-controls={`${label.replaceAll(" ", "-").toLowerCase()}-artifact`}
            >
              <span>0{index + 1}</span>
              {item.label}
            </button>
          ))}
        </div>
        <p className="builders-caption">{caption}</p>
      </div>
      <article
        className="builders-stage"
        key={step.label}
        id={`${label.replaceAll(" ", "-").toLowerCase()}-artifact`}
        aria-live="polite"
      >
        <h3>{step.title}</h3>
        <p className="mb-7">{step.detail}</p>
        <MediaFrame
          src={step.image}
          alt={step.alt}
          fallbackTitle={step.title}
          sizes="(min-width: 900px) 65vw, 94vw"
          className={`${step.ratio || "aspect-[16/10]"} bg-white border border-[#173f3d30]`}
          imageClassName="object-contain"
          expandable
          expandLabel={`Expand ${step.label.toLowerCase()} screenshot`}
        />
      </article>
    </div>
  );
}
