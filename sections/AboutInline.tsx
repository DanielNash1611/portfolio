"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type Props = { portraitSrc: string };

export default function AboutInline({ portraitSrc }: Props): JSX.Element {
  const reduce = useReducedMotion();
  const anim = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.35, ease: "easeOut" }
    }
  };

  return (
    <motion.section
      variants={anim}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8"
      aria-labelledby="about-inline-title"
    >
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <h2
            id="about-inline-title"
            className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl"
          >
            The person behind the outcomes
          </h2>
          <p className="mt-3 max-w-prose text-slate-700">
            I build AI-powered products and scalable frameworks that drive measurable impact across
            organizations - from a $2.7 M annual lift in Contact Center AI pilots and a 3% conversion gain
            (~$16 M / yr) in e-commerce to company-wide enablement initiatives in AI strategy and Product
            Management excellence through Jira Product Discovery.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/case-studies"
              className="inline-flex items-center rounded-full bg-[#2C4F52] px-5 py-2.5 text-white shadow transition hover:opacity-95 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label="Explore case studies"
            >
              Explore case studies
            </a>
            <a
              href="/music"
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-slate-900 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label="Listen to my music"
            >
              Listen to my music
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <div
            className="relative ml-auto w-full max-w-sm md:max-w-md overflow-hidden
                       rounded-2xl ring-1 ring-slate-200 shadow-md
                       h-64 sm:h-72 md:h-80 lg:h-[420px] min-h-[256px]"
          >
            <Image
              src={portraitSrc}
              alt="Daniel Nash portrait"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 480px"
              priority={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
            <p className="absolute bottom-3 left-3 rounded-full bg-white/75 px-3 py-1 text-xs text-slate-700 shadow ring-1 ring-slate-200">
              Composer / Product Leader / AI Advocate
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
