'use client';

import { motion, useReducedMotion } from "framer-motion";
import Stats from "@/components/Stats";
import { fadeSlide } from "@/lib/motion";

const HomeStats = (): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();

  const content = (
    <>
      <header className="mb-6 space-y-2 text-left sm:text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C4F52]/70">
          Proven outcomes
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-[#2C4F52] sm:text-4xl">
          Real metrics from shipped experiences
        </h2>
        <p className="text-sm text-[#3A3D40]/80">
          Results from experimentation, AI-driven enhancements, and cross-team
          delivery.
        </p>
      </header>
      <Stats />
    </>
  );

  if (prefersReducedMotion) {
    return <section className="container">{content}</section>;
  }

  return (
    <motion.section
      className="container"
      variants={fadeSlide}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
    >
      {content}
    </motion.section>
  );
};

export default HomeStats;
