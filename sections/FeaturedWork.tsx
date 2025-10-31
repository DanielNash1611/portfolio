'use client';

import { motion, useReducedMotion } from "framer-motion";
import CaseCard from "@/components/CaseCard";
import { featuredWork } from "@/data/featuredWork";
import { fadeSlide } from "@/lib/motion";

const FeaturedWork = (): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();

  const content = (
    <>
      <header className="space-y-2 text-left sm:text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C4F52]/70">
          Case Studies
        </p>
        <h2 className="text-3xl font-semibold text-[#2C4F52] sm:text-4xl">
          Case studies that blend AI, design, and experimentation
        </h2>
        <p className="text-sm text-[#3A3D40]/80">
          A sampling of product, experimentation, and music-tech launches that
          blended strategy, craft, and measurable impact.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredWork.map((item, index) => (
          <CaseCard
            key={item.slug}
            title={item.title}
            description={item.description}
            href={item.href}
            tags={item.tags}
            status={item.status}
            media={item.media}
            chips={item.chips}
            className={index % 2 === 0 ? "" : "md:mt-4"}
          />
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
