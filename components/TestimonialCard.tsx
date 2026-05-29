"use client";

import clsx from "clsx";
import { ExternalLink, Quote, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import type { FC } from "react";
import type { Testimonial } from "@/data/testimonials";

type Props = {
  item: Testimonial;
  className?: string;
};

const initialsFor = (name: string): string =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const withNoFallback = (url: string): string => {
  if (!url.startsWith("https://unavatar.io/")) {
    return url;
  }
  return url.includes("?") ? `${url}&fallback=false` : `${url}?fallback=false`;
};

const deriveAvatar = (item: Testimonial): string | undefined => {
  if (item.avatarUrl) {
    return withNoFallback(item.avatarUrl);
  }
  if (item.profileUrl && item.profileUrl.includes("linkedin")) {
    return withNoFallback(
      `https://unavatar.io/${encodeURIComponent(item.profileUrl)}`,
    );
  }
  return undefined;
};

export const TestimonialCard: FC<Props> = ({ item, className }) => {
  const {
    name,
    title,
    relationship,
    relationshipCapacity,
    roleLabel,
    date,
    short,
    full,
    source,
    profileUrl,
  } = item;
  const headingId = React.useId();
  const bodyId = React.useId();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [avatarFailed, setAvatarFailed] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const derivedAvatar = avatarFailed ? undefined : deriveAvatar(item);

  const handleAvatarLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    const target = event.currentTarget;
    if (target.naturalWidth > 0 && target.naturalWidth < 150) {
      setAvatarFailed(true);
    }
  };

  React.useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    triggerRef.current?.focus();
  };

  const fullParagraphs = full.split(/\n+/).filter((paragraph) => paragraph.trim().length > 0);

  return (
    <>
      <figure
        className={clsx(
          "group relative flex h-full flex-col rounded-[1.75rem] border border-black/6 bg-white/88 p-5 shadow-[0_20px_50px_rgba(58,61,64,0.08)] transition hover:shadow-[0_28px_60px_rgba(58,61,64,0.12)] md:p-7",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex rounded-full border border-[color:var(--color-teal)]/14 bg-[color:var(--color-background)]/82 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/80">
            {roleLabel}
          </span>
          <span
            className={clsx(
              "whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
              source === "Direct"
                ? "border border-[color:var(--color-orange)]/30 bg-[color:var(--color-orange)]/10 text-[color:var(--color-orange)]"
                : "border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/88 text-[color:var(--color-teal)]/72",
            )}
            title={
              source === "Direct"
                ? "Provided directly to Daniel; not published on LinkedIn"
                : "Published on LinkedIn"
            }
          >
            {source}
          </span>
        </div>

        <div className="mt-5 flex items-start gap-3">
          <Quote
            className="mt-1 h-5 w-5 shrink-0 text-[color:var(--color-orange)]"
            aria-hidden="true"
          />
          <blockquote className="text-pretty text-lg leading-8 text-[color:var(--color-slate)] md:text-xl">
            {short}
          </blockquote>
        </div>

        <p className="mt-4 rounded-[1.1rem] bg-[color:var(--color-background)]/84 px-4 py-3 text-sm leading-6 text-[color:var(--color-slate)]/72">
          {relationshipCapacity}
        </p>

        <figcaption className="mt-auto flex items-start gap-3 border-t border-black/6 pt-5">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--color-teal)]/10 ring-1 ring-[color:var(--color-teal)]/20">
            {derivedAvatar ? (
              <Image
                src={derivedAvatar}
                alt=""
                width={44}
                height={44}
                loading="lazy"
                unoptimized
                onError={() => setAvatarFailed(true)}
                onLoad={handleAvatarLoad}
                className="h-full w-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-teal)]"
              >
                {initialsFor(name)}
              </span>
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[color:var(--color-slate)]">{name}</p>
            <p className="mt-0.5 text-sm leading-5 text-[color:var(--color-slate)]/74">
              {title}
            </p>
            {date ? (
              <p className="mt-0.5 text-xs text-[color:var(--color-slate)]/60">{date}</p>
            ) : null}
          </div>
        </figcaption>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            ref={triggerRef}
            onClick={handleOpen}
            aria-haspopup="dialog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-teal)] underline decoration-[color:var(--color-teal)]/30 underline-offset-4 transition hover:decoration-[color:var(--color-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Read full recommendation
          </button>
          {source === "LinkedIn" && profileUrl ? (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--color-slate)]/72 transition hover:text-[color:var(--color-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label={`View ${name}'s recommendation on LinkedIn`}
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              View on LinkedIn
            </a>
          ) : null}
        </div>
      </figure>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          aria-describedby={bodyId}
          onClick={handleClose}
        >
          <button
            type="button"
            ref={closeButtonRef}
            aria-label="Close recommendation"
            onClick={handleClose}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <div
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-2xl md:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--color-teal)]/10 ring-1 ring-[color:var(--color-teal)]/20">
                {derivedAvatar ? (
                  <Image
                    src={derivedAvatar}
                    alt=""
                    width={56}
                    height={56}
                    unoptimized
                    onError={() => setAvatarFailed(true)}
                    onLoad={handleAvatarLoad}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-teal)]"
                  >
                    {initialsFor(name)}
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <h2
                  id={headingId}
                  className="text-xl font-semibold text-[color:var(--color-slate)]"
                >
                  {name}
                </h2>
                <p className="mt-1 text-sm text-[color:var(--color-slate)]/76">
                  {title}
                </p>
                <p className="mt-1 text-xs text-[color:var(--color-slate)]/64">
                  {relationship}
                </p>
                <p className="mt-1 text-xs italic text-[color:var(--color-slate)]/60">
                  {relationshipCapacity}
                  {date ? ` · ${date}` : null}
                </p>
              </div>
            </div>

            <div
              id={bodyId}
              className="mt-6 space-y-4 text-base leading-7 text-[color:var(--color-slate)]/88"
            >
              {fullParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-4">
              {source === "LinkedIn" && profileUrl ? (
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-teal)] underline decoration-[color:var(--color-teal)]/30 underline-offset-4 hover:decoration-[color:var(--color-teal)]"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  View on LinkedIn
                </a>
              ) : (
                <span className="text-xs italic text-[color:var(--color-slate)]/64">
                  Provided directly to Daniel; not published on LinkedIn.
                </span>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="text-sm font-semibold text-[color:var(--color-slate)]/72 transition hover:text-[color:var(--color-slate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TestimonialCard;
