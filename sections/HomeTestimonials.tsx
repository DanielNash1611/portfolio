'use client';

import { motion, useReducedMotion } from "framer-motion";
import Testimonials from "@/components/Testimonials";
import { testimonials } from "@/data/testimonials";
import { fadeSlide } from "@/lib/motion";

const HomeTestimonials = (): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();

  const content = (
    <>
      <header className="space-y-2 text-left sm:text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C4F52]/70">
          Testimonials
        </p>
        <h2 className="text-3xl font-semibold text-[#2C4F52] sm:text-4xl">
          What teammates say
        </h2>
        <p className="text-sm text-[#3A3D40]/80">
          A few words from designers, engineers, and leaders I have worked with.
        </p>
      </header>
      <Testimonials items={testimonials} />
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
