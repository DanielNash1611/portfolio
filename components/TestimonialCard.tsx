'use client';

import clsx from "clsx";
import { ExternalLink, Quote } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import type { FC } from "react";
import type { Testimonial } from "@/data/testimonials";

type Props = {
  item: Testimonial;
  index: number;
  className?: string;
};

const baseBackground = (index: number): string => {
  void index;
  return "bg-white/95";
};

const initialsFor = (name: string): string =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const TestimonialCard: FC<Props> = ({ item, index, className }) => {
  const { name, title, relationship, date, medium, short, source, profileUrl, avatarUrl } = item;
  const quoteId = React.useId();
  const [isCondensed, setIsCondensed] = React.useState<boolean>(true);

  const derivedAvatar =
    avatarUrl ??
    (profileUrl && profileUrl.includes("linkedin")
      ? `https://unavatar.io/${encodeURIComponent(profileUrl)}`
      : undefined);

  return (
    <figure
      className={clsx(
        "snap-start min-w-[320px] flex h-full flex-col overflow-hidden rounded-3xl p-6 shadow-md ring-1 ring-[#2C4F52]/12 transition-colors md:min-w-[420px] lg:min-w-[520px]",
        baseBackground(index),
        className
      )}
    >
      <blockquote
        id={quoteId}
        className="text-[#2C4F52]"
        aria-label={`Testimonial from ${name}`}
      >
        <div className="mb-4 flex items-start gap-3 text-[#3A3D40]/90">
          <Quote
            className="mt-1 h-5 w-5 shrink-0 text-[#2C4F52]"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            {isCondensed ? short : medium}
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-[#2C4F52] underline decoration-[#2C4F52]/40 underline-offset-4 transition hover:decoration-[#2C4F52] focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-controls={quoteId}
          aria-expanded={!isCondensed}
          onClick={() => setIsCondensed((value) => !value)}
        >
          {isCondensed ? "Show more" : "Show less"}
        </button>
      </blockquote>

      <figcaption className="mt-6 flex items-start justify-between gap-4 border-t border-[#2C4F52]/12 pt-4 text-[#3A3D40]">
        <div className="flex items-start gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#2C4F52]/10 ring-1 ring-[#2C4F52]/20">
            {derivedAvatar ? (
              <Image
                src={derivedAvatar}
                alt=""
                width={40}
                height={40}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="text-xs font-semibold uppercase tracking-wide text-[#2C4F52]"
              >
                {initialsFor(name)}
              </span>
            )}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#2C4F52]">{name}</span>
              {source === "Direct" ? (
                <span
                  className="inline-flex items-center rounded-full bg-[#F2E3D5] px-2 py-0.5 text-xs text-[#2C4F52] ring-1 ring-[#2C4F52]/12"
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
                  className="inline-flex items-center gap-1 text-xs text-[#3A3D40]/90 transition hover:text-[#2C4F52] focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label={`View ${name}'s recommendation on LinkedIn`}
                  title="View on LinkedIn"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  LinkedIn
                </a>
              ) : null}
            </div>
            <div className="text-sm text-[#3A3D40]/90">
              {title} - {relationship}
            </div>
            <div className="text-xs text-[#3A3D40]/80">{date}</div>
          </div>
        </div>
      </figcaption>
    </figure>
  );
};

export default TestimonialCard;
