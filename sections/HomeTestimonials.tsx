"use client";

import { motion, useReducedMotion } from "framer-motion";
import Testimonials from "@/components/Testimonials";
import { featuredTestimonials } from "@/data/testimonials";
import { fadeSlide } from "@/lib/motion";

const HomeTestimonials = (): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();

  const content = (
    <>
      <header className="space-y-2 text-left sm:text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C4F52]/70">
          Recommendations
        </p>
        <h2 className="text-3xl font-semibold text-[#2C4F52] sm:text-4xl">
          Trusted by partners, leaders, and builders
        </h2>
        <p className="text-sm text-[#3A3D40]/80">
          Select recommendation highlights that reinforce the same themes across
          the portfolio: business impact, roadmap ownership, AI leadership, and
          strong cross-functional trust.
        </p>
      </header>
      <Testimonials items={featuredTestimonials} max={4} />
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

export default HomeTestimonials;
