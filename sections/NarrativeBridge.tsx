"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import SocialProofSnippet from "@/components/SocialProofSnippet";
import {
  IMMIATRICS,
  MUSIC_NOTE,
  POSITIONING_EXPLAINER,
} from "@/data/positioning";
import { narrativeSocialProof } from "@/data/socialProof";
import { fadeSlide } from "@/lib/motion";

const NarrativeBridge = (): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();

  const content = (
    <div className="relative overflow-hidden rounded-3xl border border-[#2C4F52]/15 bg-gradient-to-r from-[#F2E3D5] via-white to-[#DBBF96]/60 p-10 shadow-md">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(44,79,82,0.08),_transparent_55%)]"
        aria-hidden="true"
      />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2C4F52]/70">
              How I&apos;m positioned
            </p>
            <h2 className="text-3xl font-semibold text-[#2C4F52] sm:text-4xl">
              Clear framing for different hiring conversations
            </h2>
            <p className="max-w-2xl text-sm text-[#3A3D40]/85">
              The work is consistent. The emphasis changes depending on whether
              you need a broad Senior PM, a 0-to-1 builder, or a player-coach
              leader improving how product teams operate.
            </p>
          </div>
          <div className="space-y-4">
            {POSITIONING_EXPLAINER.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/80 bg-white/85 p-5 shadow-sm ring-1 ring-[#2C4F52]/8"
              >
                <h3 className="text-base font-semibold text-[#2C4F52]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3A3D40]/82">
                  {item.body}
                </p>
                <SocialProofSnippet
                  item={narrativeSocialProof[item.narrativeId]}
                  compact
                  className="mt-4"
                />
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div
            id="immiatrics"
            className="rounded-2xl border border-[#2C4F52]/12 bg-white/90 p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2C4F52]/65">
              {IMMIATRICS.label}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[#2C4F52]">
              {IMMIATRICS.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-[#D17A5F]">
              {IMMIATRICS.category}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#3A3D40]/82">
              {IMMIATRICS.summary}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#3A3D40]/78">
              {IMMIATRICS.detail}
            </p>
          </div>

          <div className="rounded-2xl border border-[#2C4F52]/12 bg-[#2C4F52] p-6 text-[#F2E3D5] shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F2E3D5]/70">
              Differentiator
            </p>
            <h3 className="mt-2 text-2xl font-semibold">{MUSIC_NOTE.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#F2E3D5]/82">
              {MUSIC_NOTE.description}
            </p>
            <Link
              href={MUSIC_NOTE.href}
              className="mt-4 inline-flex items-center rounded-full border border-[#F2E3D5]/25 px-4 py-2 text-sm font-semibold text-[#F2E3D5] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2C4F52]"
            >
              Visit music page
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );

  if (prefersReducedMotion) {
    return <section className="container py-10">{content}</section>;
  }

  return (
    <motion.section
      className="container py-10"
      variants={fadeSlide}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
    >
      {content}
    </motion.section>
  );
};

export default NarrativeBridge;
