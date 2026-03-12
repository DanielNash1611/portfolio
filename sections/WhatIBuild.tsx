"use client";

import Link from "next/link";
import { Briefcase, Layers3, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { NARRATIVES } from "@/data/positioning";
import { fadeSlide } from "@/lib/motion";

const icons = {
  "senior-product-manager": Briefcase,
  "builder-pm": Layers3,
  "product-leader": Users,
} as const;

const WhatIBuild = (): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();

  const content = (
    <>
      <header className="space-y-3 text-left sm:text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C4F52]/70">
          Choose the lens
        </p>
        <h2 className="text-3xl font-semibold text-[#2C4F52] sm:text-4xl">
          Three ways to evaluate the same body of work
        </h2>
        <p className="mx-auto max-w-3xl text-sm text-[#3A3D40]/80">
          The default framing is Senior Product Manager. If you are hiring for a
          more 0-to-1 builder profile or a player-coach product leader, you can
          use the cards below to jump to the most relevant version of the story.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        {NARRATIVES.map((narrative) => {
          const Icon = icons[narrative.id];

          return (
            <article
              key={narrative.id}
              className="flex h-full flex-col gap-5 rounded-3xl border border-[#2C4F52]/12 bg-white/92 p-6 shadow-md ring-1 ring-white/60"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2E3D5] text-[#2C4F52] ring-1 ring-[#2C4F52]/10">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="rounded-full border border-[#2C4F52]/15 bg-[#F2E3D5]/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2C4F52]/75">
                  {narrative.name}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-[#3A3D40]/85">
                  {narrative.summary}
                </p>
                <ul className="space-y-2 text-sm text-[#2C4F52]">
                  {narrative.proofPoints.slice(0, 4).map((proofPoint) => (
                    <li key={proofPoint} className="flex gap-2">
                      <span aria-hidden="true" className="mt-1 text-[#D17A5F]">
                        •
                      </span>
                      <span>{proofPoint}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex flex-wrap gap-3 pt-2">
                <Link
                  href={narrative.workHref}
                  className="inline-flex items-center rounded-full bg-[#2C4F52] px-4 py-2 text-sm font-semibold text-[#F2E3D5] transition hover:bg-[#2C4F52]/90 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Explore work
                </Link>
                <Link
                  href={narrative.resumeHref}
                  className="inline-flex items-center rounded-full border border-[#2C4F52]/20 bg-white px-4 py-2 text-sm font-semibold text-[#2C4F52] transition hover:bg-[#F2E3D5]/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  View resume track
                </Link>
              </div>
            </article>
          );
        })}
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

export default WhatIBuild;
