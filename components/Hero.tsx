'use client';

import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { fadeSlide } from "@/lib/motion";

type CTA = {
  label: string;
  href: string;
  variant?: "primary" | "ghost";
  ariaLabel?: string;
};

type HeroProps = {
  title: string;
  subtitle: string;
  kicker?: string;
  alignment?: "left" | "center";
  primaryCta: CTA;
  secondaryCta?: CTA;
};

const ctaStyles = {
  primary:
    "bg-[#2C4F52] text-[#F2E3D5] shadow-md hover:bg-[#2C4F52]/90",
  ghost:
    "border border-[#2C4F52]/40 bg-transparent text-[#2C4F52] hover:border-[#2C4F52]/60 hover:bg-[#2C4F52]/10"
} as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2E3D5]";

const Hero = ({
  title,
  subtitle,
  kicker,
  alignment = "left",
  primaryCta,
  secondaryCta
}: HeroProps): JSX.Element => {
  const alignmentClass =
    alignment === "center" ? "mx-auto text-center" : "text-left";

  const shouldReduceMotion = useReducedMotion();

  const content = (
    <div className={clsx("mx-auto max-w-3xl space-y-6", alignmentClass)}>
      {kicker ? (
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C4F52]/80">
          {kicker}
        </span>
      ) : null}
      <h1 className="text-balance text-4xl font-semibold text-[#2C4F52] md:text-5xl">
        {title}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-[#3A3D40]/85">{subtitle}</p>
      <div
        className={clsx(
          "flex flex-wrap items-center gap-3",
          alignment === "center" ? "justify-center" : "justify-start"
        )}
      >
        <Link
          href={primaryCta.href}
          aria-label={primaryCta.ariaLabel ?? primaryCta.label}
          className={clsx(
            "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition",
            ctaStyles[primaryCta.variant ?? "primary"],
            focusRing
          )}
        >
          {primaryCta.label}
        </Link>
        {secondaryCta ? (
          <Link
            href={secondaryCta.href}
            aria-label={secondaryCta.ariaLabel ?? secondaryCta.label}
            className={clsx(
              "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition",
              ctaStyles[secondaryCta.variant ?? "ghost"],
              focusRing
            )}
          >
            {secondaryCta.label}
          </Link>
        ) : null}
      </div>
    </div>
  );

  if (shouldReduceMotion) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-[#3A3D40]/15 bg-white/90 p-8 shadow-md ring-1 ring-slate-200 sm:p-12 mb-8 md:mb-10">
        {content}
      </section>
    );
  }

  return (
    <motion.section
      variants={fadeSlide}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      className="relative overflow-hidden rounded-3xl border border-[#3A3D40]/15 bg-white/90 p-8 shadow-md ring-1 ring-slate-200 sm:p-12 mb-8 md:mb-10"
    >
      {content}
    </motion.section>
  );
};

export default Hero;






