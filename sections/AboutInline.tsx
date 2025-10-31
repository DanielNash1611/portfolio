'use client';

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  portraitSrc: string;
};

const contentAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" }
  }
};

export default function AboutInline({ portraitSrc }: Props): JSX.Element {
  const reduce = useReducedMotion();

  return (
    <motion.section
      variants={contentAnimation}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8"
      aria-labelledby="about-inline-title"
      transition={reduce ? { duration: 0 } : undefined}
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
            I build AI-powered products and experimentation programs that drive measurable impact.
            My background as a composer keeps me relentlessly focused on craft and audience experience.
            Recently: AI Platform & Strategy leadership, ChatGPT Enterprise rollout, and LaunchMuse prototype.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/work"
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
          <div className="relative ml-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200">
            <Image
              src={portraitSrc}
              alt="Daniel Nash portrait"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 420px"
              priority={false}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/10"
            />
            <p className="absolute bottom-3 left-3 rounded-full bg-white/75 px-3 py-1 text-xs text-slate-700 shadow ring-1 ring-slate-200">
              Composer • Product Leader • AI Advocate
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
