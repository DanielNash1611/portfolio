"use client";

import clsx from "clsx";
import { Info } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Tooltip from "@/components/ui/Tooltip";
import { fadeSlide } from "@/lib/motion";

type Item = {
  kpi: string;
  label: string;
  tooltip: string;
};

const ITEMS: Item[] = [
  {
    kpi: "$2.7M+",
    label: "annual impact from Contact Center AI pilot",
    tooltip:
      "Measured lift from the initial ChatGPT Enterprise pilot in the Contact Center (150 licenses)."
  },
  {
    kpi: "+3%",
    label: "conversion (~$16M/yr)",
    tooltip:
      "Annualized revenue lift from the checkout redesign that reduced completion time by half."
  },
  {
    kpi: "~67 FTE",
    label: "time saved from scaled AI adoption",
    tooltip:
      "Scaled from 10 FTE at 150 licenses to roughly 67 FTE at 1,000 licenses after expansion."
  },
  {
    kpi: "Org-wide",
    label: "AI enablement & Product Management advocacy",
    tooltip:
      "Driving company-wide AI adoption and enterprise-scale rollout of Jira Product Discovery and prioritization frameworks."
  }
];

const cardAccents = [
  "ring-[#2C4F52]/30 hover:ring-[#2C4F52]/45",
  "ring-[#3A3D40]/20 hover:ring-[#3A3D40]/35",
  "ring-[#D17A5F]/30 hover:ring-[#D17A5F]/45",
  "ring-[#DBBF96]/35 hover:ring-[#DBBF96]/50"
] as const;

const iconAccents = [
  "border-[#2C4F52]/35 text-[#2C4F52]",
  "border-[#3A3D40]/30 text-[#3A3D40]",
  "border-[#D17A5F]/35 text-[#D17A5F]",
  "border-[#DBBF96]/45 text-[#3A3D40]"
] as const;

const ImpactHighlights = (): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();

  const sectionContent = (
    <>
      <header className="mb-6 space-y-2 text-left sm:text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C4F52]/70">
          Impact highlights
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-[#2C4F52] sm:text-4xl">
          Universal metrics that show durable outcomes
        </h2>
        <p className="text-sm text-[#3A3D40]/80">
          Centering the proof first across AI pilots, experimentation, and scaled enablement wins.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ITEMS.map((item, index) => {
          const accent = cardAccents[index % cardAccents.length];
          const iconAccent = iconAccents[index % iconAccents.length];
          return (
            <article
              key={item.label}
              className={clsx(
                "group relative flex h-full flex-col justify-between rounded-3xl bg-white/95 p-6 shadow-md ring-1 transition-all duration-200 ease-out backdrop-blur-sm hover:-translate-y-1.5 hover:shadow-lg",
                accent
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold tracking-tight text-[#2C4F52] sm:text-4xl">
                    {item.kpi}
                  </p>
                  <p className="mt-2 text-sm text-[#3A3D40]/85">{item.label}</p>
                </div>
                <Tooltip
                  placement="top"
                  content={<span>{item.tooltip}</span>}
                >
                  <button
                    type="button"
                    className={clsx(
                      "inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white/90 text-[#2C4F52] transition hover:bg-white focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                      iconAccent
                    )}
                    aria-label={`How ${item.kpi} was measured`}
                  >
                    <Info className="h-4 w-4" aria-hidden="true" />
                  </button>
                </Tooltip>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );

  if (prefersReducedMotion) {
    return <section className="container mt-0 mb-10 md:mb-12">{sectionContent}</section>;
  }

  return (
    <motion.section
      className="container mt-0 mb-10 md:mb-12"
      variants={fadeSlide}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
    >
      {sectionContent}
    </motion.section>
  );
};

export default ImpactHighlights;
