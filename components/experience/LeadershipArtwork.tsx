"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import "./leadership-artwork.css";

const coachingViews = [
  {
    label: "Before",
    title: "Coaching apart from the call.",
    steps: [
      ["Recordings", "Saved for three days, then deleted."],
      ["Call insight", "Limited to call duration."],
      ["Coaching", "Captured in a separate Salesforce form."],
    ],
  },
  {
    label: "After",
    title: "Call evidence becomes part of coaching.",
    steps: [
      ["Recordings", "Persistent transcripts and recordings."],
      ["Call insight", "Categorized, searchable AI summaries."],
      ["Coaching", "Integrated directly with call data."],
    ],
  },
] as const;

/** Authored explanations of sourced practices, clearly distinct from UI captures. */
export default function LeadershipArtwork({ slug }: { slug: string }) {
  const [view, setView] = useState(1);
  if (slug === "product-practice")
    return (
      <figure className="experience-leadership-artwork experience-practice-artwork">
        <p className="experience-home-eyebrow">
          From quarterly lists to shared decisions
        </p>
        <div className="experience-practice-shift">
          <div>
            <span>Before</span>
            <strong>A quarterly reset.</strong>
            <p>
              Stakeholder wishlists.
              <br />A handoff to delivery.
            </p>
          </div>
          <ArrowRight aria-hidden="true" />
          <div>
            <span>The practice I introduced</span>
            <strong>A continuous partnership.</strong>
            <ul>
              <li>Common decision criteria</li>
              <li>Visible priorities and dependencies</li>
              <li>Coaching in real planning work</li>
            </ul>
          </div>
        </div>
        <figcaption>
          Authored process summary · Based on the published planning and
          enablement case.
        </figcaption>
      </figure>
    );

  const current = coachingViews[view];
  return (
    <figure className="experience-leadership-artwork experience-coaching-artwork">
      <div className="experience-coaching-artwork-header">
        <p className="experience-home-eyebrow">Cresta / Coaching workflow</p>
        <div role="group" aria-label="Compare coaching before and after Cresta">
          {coachingViews.map((entry, index) => (
            <button
              key={entry.label}
              aria-pressed={view === index}
              onClick={() => setView(index)}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>
      <div className="experience-coaching-view" aria-live="polite">
        <strong>{current.title}</strong>
        <dl>
          {current.steps.map(([label, detail]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </div>
      <figcaption>
        Authored workflow comparison · Based on the Contact Center progress
        review.
      </figcaption>
    </figure>
  );
}
