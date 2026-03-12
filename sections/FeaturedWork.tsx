"use client";

import { motion, useReducedMotion } from "framer-motion";
import CaseCard from "@/components/CaseCard";
import { featuredWork } from "@/data/featuredWork";
import { NARRATIVE_ORDER, NARRATIVES } from "@/data/positioning";
import { fadeSlide } from "@/lib/motion";

const FeaturedWork = (): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();
  const groupedWork = NARRATIVE_ORDER.map((narrativeId) => {
    const narrative = NARRATIVES.find((item) => item.id === narrativeId);
    return {
      narrative,
      items: featuredWork.filter((item) =>
        item.featuredFor.includes(narrativeId),
      ),
    };
  }).filter(
    (
      group,
    ): group is {
      narrative: (typeof NARRATIVES)[number];
      items: typeof featuredWork;
    } => Boolean(group.narrative),
  );

  const content = (
    <>
      <header className="space-y-3 text-left sm:text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C4F52]/70">
          Featured work
        </p>
        <h2 className="text-3xl font-semibold text-[#2C4F52] sm:text-4xl">
          Case studies organized by hiring intent
        </h2>
        <p className="mx-auto max-w-3xl text-sm text-[#3A3D40]/80">
          The same portfolio can support broad-market Senior PM roles, more
          technical builder opportunities, and product leadership conversations.
          Each section below surfaces the work most relevant to that lens.
        </p>
      </header>
      <div className="space-y-10">
        {groupedWork.map(({ narrative, items }) => (
          <section
            key={narrative.id}
            id={narrative.id}
            aria-labelledby={narrative.id}
            className="space-y-4"
          >
            <div className="space-y-2">
              <h3
                id={narrative.id}
                className="inline-flex rounded-full border border-[#2C4F52]/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2C4F52]/80"
              >
                {narrative.name}
              </h3>
              <p className="max-w-3xl text-sm text-[#3A3D40]/80">
                {narrative.positioning}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {items.map((item) => (
                <CaseCard
                  key={item.slug}
                  title={item.title}
                  description={item.description}
                  href={item.href}
                  tags={item.tags}
                  status={item.status}
                  media={item.media}
                  chips={item.chips}
                  bestFor={item.bestFor}
                  ctaLabel="View work"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );

  if (prefersReducedMotion) {
    return <section className="container space-y-8">{content}</section>;
  }

  return (
    <motion.section
      className="container space-y-8"
      variants={fadeSlide}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
    >
      {content}
    </motion.section>
  );
};

export default FeaturedWork;
