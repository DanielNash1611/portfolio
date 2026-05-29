"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import SectionHeader from "@/components/site/SectionHeader";
import type { AboutTimelineMilestone } from "@/content/portfolio";

type AboutJourneyTimelineProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: AboutTimelineMilestone[];
};

type ThemeTone = {
  dot: string;
  badge: string;
  abstract: string;
  accent: string;
};

const themeTones: Record<AboutTimelineMilestone["theme"], ThemeTone> = {
  music: {
    dot: "bg-[color:var(--color-orange)]",
    badge:
      "border-[color:var(--color-orange)]/18 bg-[color:var(--color-orange)]/10 text-[color:var(--color-orange)]",
    abstract:
      "border-[color:var(--color-orange)]/16 bg-[linear-gradient(135deg,rgba(209,122,95,0.18),rgba(242,227,213,0.7))]",
    accent: "text-[color:var(--color-orange)]",
  },
  systems: {
    dot: "bg-[color:var(--color-teal)]",
    badge:
      "border-[color:var(--color-teal)]/16 bg-[color:var(--color-teal)]/8 text-[color:var(--color-teal)]",
    abstract:
      "border-[color:var(--color-teal)]/14 bg-[linear-gradient(135deg,rgba(44,79,82,0.14),rgba(247,245,242,0.82))]",
    accent: "text-[color:var(--color-teal)]",
  },
  commerce: {
    dot: "bg-[color:var(--color-tan)]",
    badge:
      "border-[color:var(--color-tan)]/22 bg-[color:var(--color-tan)]/12 text-[color:var(--color-slate)]",
    abstract:
      "border-[color:var(--color-tan)]/18 bg-[linear-gradient(135deg,rgba(219,191,150,0.22),rgba(247,245,242,0.78))]",
    accent: "text-[color:var(--color-slate)]",
  },
  ai: {
    dot: "bg-[color:var(--color-slate)]",
    badge:
      "border-[color:var(--color-slate)]/14 bg-[color:var(--color-slate)]/8 text-[color:var(--color-slate)]",
    abstract:
      "border-[color:var(--color-slate)]/14 bg-[linear-gradient(135deg,rgba(58,61,64,0.14),rgba(247,245,242,0.82))]",
    accent: "text-[color:var(--color-slate)]",
  },
  builder: {
    dot: "bg-[color:var(--color-teal)]",
    badge:
      "border-[color:var(--color-orange)]/18 bg-[color:var(--color-orange)]/10 text-[color:var(--color-orange)]",
    abstract:
      "border-[color:var(--color-orange)]/16 bg-[linear-gradient(135deg,rgba(44,79,82,0.14),rgba(209,122,95,0.16),rgba(247,245,242,0.86))]",
    accent: "text-[color:var(--color-teal)]",
  },
};

function TimelineVisual({
  milestone,
}: {
  milestone: AboutTimelineMilestone;
}): JSX.Element {
  const tone = themeTones[milestone.theme];

  if (milestone.visual.kind === "image") {
    return (
      <div className="overflow-hidden rounded-[1.2rem] border border-black/6 bg-[color:var(--color-background)]/82 shadow-[0_14px_35px_rgba(58,61,64,0.08)]">
        <div className="relative aspect-[4/3]">
          <Image
            src={milestone.visual.src}
            alt={milestone.visual.alt}
            fill
            sizes="(min-width: 1024px) 160px, (min-width: 640px) 220px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-1 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/62">
            {milestone.visual.eyebrow ?? "Artifact"}
          </p>
          <p className={clsx("text-xs font-medium", tone.accent)}>{milestone.yearLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex min-h-[8.5rem] flex-col justify-between rounded-[1.2rem] border px-4 py-4 shadow-[0_14px_35px_rgba(58,61,64,0.06)]",
        tone.abstract,
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/66">
        {milestone.visual.eyebrow ?? "Milestone"}
      </p>
      <p className="text-sm font-medium leading-6 text-[color:var(--color-slate)]/76">
        {milestone.visual.label}
      </p>
      <p className={clsx("text-xs font-semibold uppercase tracking-[0.18em]", tone.accent)}>
        {milestone.yearLabel}
      </p>
    </div>
  );
}

function TimelineEntry({
  milestone,
  index,
  reducedMotion,
}: {
  milestone: AboutTimelineMilestone;
  index: number;
  reducedMotion: boolean;
}): JSX.Element {
  const tone = themeTones[milestone.theme];
  const isLeft = milestone.side === "left";

  const entryContent = (
    <article
      className={clsx(
        "group relative rounded-[1.75rem] border border-black/6 bg-white/88 p-5 shadow-[0_24px_60px_rgba(58,61,64,0.08)] backdrop-blur-sm md:p-6",
        "before:absolute before:top-7 before:h-px before:w-5 before:bg-[color:var(--color-teal)]/16 before:content-[''] lg:before:w-10",
        isLeft
          ? "before:-left-5 lg:before:-right-10 lg:before:left-auto"
          : "before:-left-5 lg:before:-left-10",
      )}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_168px] lg:items-start">
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={clsx(
                  "inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]",
                  tone.badge,
                )}
              >
                {milestone.yearLabel}
              </span>
            </div>
            <h3 className="text-balance text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
              {milestone.title}
            </h3>
            <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
              {milestone.summary}
            </p>
          </div>

          {milestone.href && milestone.linkLabel ? (
            <Link
              href={milestone.href}
              className="inline-flex items-center text-sm font-semibold text-[color:var(--color-teal)] underline decoration-[color:var(--color-teal)]/28 underline-offset-4 transition hover:decoration-[color:var(--color-teal)]"
            >
              {milestone.linkLabel}
            </Link>
          ) : null}
        </div>

        <TimelineVisual milestone={milestone} />
      </div>
    </article>
  );

  if (reducedMotion) {
    return (
      <div className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-x-5 lg:grid-cols-[minmax(0,1fr)_88px_minmax(0,1fr)] lg:gap-x-8">
        <div
          className={clsx(
            "relative flex justify-center pt-6 lg:col-start-2 lg:row-start-1",
          )}
        >
          <div
            aria-hidden="true"
            className={clsx(
              "relative z-[1] h-5 w-5 rounded-full border-4 border-[color:var(--color-background)] shadow-[0_0_0_6px_rgba(247,245,242,0.55)]",
              tone.dot,
            )}
          />
        </div>
        <div
          className={clsx(
            "pb-2 lg:row-start-1",
            isLeft ? "lg:col-start-1" : "lg:col-start-3",
          )}
        >
          {entryContent}
        </div>
      </div>
    );
  }

  return (
    <div className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-x-5 lg:grid-cols-[minmax(0,1fr)_88px_minmax(0,1fr)] lg:gap-x-8">
      <div className="relative flex justify-center pt-6 lg:col-start-2 lg:row-start-1">
        <motion.div
          aria-hidden="true"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -18% 0px" }}
          transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.03 }}
          className={clsx(
            "relative z-[1] h-5 w-5 rounded-full border-4 border-[color:var(--color-background)] shadow-[0_0_0_6px_rgba(247,245,242,0.55)]",
            tone.dot,
          )}
        />
      </div>

      <motion.div
        className={clsx(
          "pb-2 lg:row-start-1",
          isLeft ? "lg:col-start-1" : "lg:col-start-3",
        )}
        initial={{ opacity: 0, y: 22, x: isLeft ? -18 : 18 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.04 }}
      >
        {entryContent}
      </motion.div>
    </div>
  );
}

export default function AboutJourneyTimeline({
  eyebrow,
  title,
  description,
  items,
}: AboutJourneyTimelineProps): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.82", "end 0.2"],
  });

  const trunkScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const trunkOpacity = useTransform(scrollYProgress, [0, 0.08], [0.2, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden rounded-[2.25rem] border border-black/6 bg-white/84 px-6 py-8 shadow-[0_30px_80px_rgba(58,61,64,0.1)] md:px-8 md:py-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(44,79,82,0.045),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(209,122,95,0.04),_transparent_34%)]"
      />
      <div className="relative space-y-10">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[21px] top-2 w-px bg-[linear-gradient(180deg,rgba(44,79,82,0.08),rgba(44,79,82,0.2),rgba(44,79,82,0.08))] lg:left-1/2"
          />
          {reducedMotion ? (
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-[21px] top-2 w-px bg-[linear-gradient(180deg,rgba(209,122,95,0.56),rgba(44,79,82,0.82),rgba(44,79,82,0.4))] lg:left-1/2"
            />
          ) : (
            <motion.div
              aria-hidden="true"
              style={{ scaleY: trunkScale, opacity: trunkOpacity }}
              className="absolute bottom-0 left-[21px] top-2 w-px origin-top bg-[linear-gradient(180deg,rgba(209,122,95,0.72),rgba(44,79,82,0.92),rgba(44,79,82,0.42))] lg:left-1/2"
            />
          )}

          <div className="space-y-8 md:space-y-10">
            {items.map((milestone, index) => (
              <TimelineEntry
                key={milestone.id}
                milestone={milestone}
                index={index}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
