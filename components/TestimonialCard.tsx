'use client';

import { ExternalLink, Quote } from "lucide-react";
import * as React from "react";
import type { FC } from "react";

export type Testimonial = {
  name: string;
  title: string;
  relationship: string;
  date: string;
  short: string;
  medium: string;
  source: "LinkedIn" | "Direct";
  profileUrl?: string;
};

type Props = {
  item: Testimonial;
  variant?: "default" | "compact";
};

const sr = (s: string) => (
  <span className="sr-only">{s}</span>
);

export const TestimonialCard: FC<Props> = ({ item, variant = "default" }) => {
  const { name, title, relationship, date, medium, short, source, profileUrl } = item;
  const quoteId = React.useId();
  const [showShort, setShowShort] = React.useState<boolean>(variant === "compact");

  return (
    <figure
      className="group relative flex h-full flex-col justify-between rounded-2xl bg-[#F2E3D5] p-6 shadow-sm ring-1 ring-slate-200"
    >
      <blockquote
        id={quoteId}
        className="text-slate-900"
        aria-label={`Testimonial from ${name}`}
      >
        <div className="mb-3 flex items-start gap-2 text-slate-700">
          <Quote className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="leading-relaxed">
            {showShort ? short : medium}
          </p>
        </div>
        <button
          type="button"
          className="mt-1 text-sm underline decoration-slate-400 underline-offset-4 hover:decoration-slate-800 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F]"
          aria-controls={quoteId}
          aria-expanded={!showShort}
          onClick={() => setShowShort((v) => !v)}
        >
          {showShort ? "Show more" : "Show less"}
        </button>
      </blockquote>

      <figcaption className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <div className="min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-semibold text-slate-950">{name}</span>
            {source === "Direct" ? (
              <span
                className="ml-1 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 ring-1 ring-slate-200"
                aria-label="Provided directly to Daniel; not yet published on LinkedIn"
                title="Provided directly to Daniel; not yet published on LinkedIn"
              >
                Direct
              </span>
            ) : profileUrl ? (
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded text-xs text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F]"
                aria-label="View on LinkedIn"
                title="View on LinkedIn"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                LinkedIn
              </a>
            ) : null}
          </div>
          <div className="text-sm text-slate-600">
            {title} • {relationship}
          </div>
          <div className="text-xs text-slate-500">{date}</div>
        </div>
      </figcaption>
    </figure>
  );
};

export default TestimonialCard;
