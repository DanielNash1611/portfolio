"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { RESUME_TRACKS } from "@/data/positioning";
import { fadeSlide } from "@/lib/motion";

const ResumeAccess = (): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();

  const content = (
    <>
      <header className="space-y-3 text-left sm:text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C4F52]/70">
          Resume access
        </p>
        <h2 className="text-3xl font-semibold text-[#2C4F52] sm:text-4xl">
          Recruiter-friendly resume tracks
        </h2>
        <p className="mx-auto max-w-3xl text-sm text-[#3A3D40]/80">
          The site now supports three distinct hiring narratives. Use the
          matching resume track for the role you are evaluating.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        {RESUME_TRACKS.map((track) => (
          <article
            key={track.id}
            id={track.id}
            className="flex h-full flex-col gap-4 rounded-3xl border border-[#2C4F52]/12 bg-white/92 p-6 shadow-md"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-[#2C4F52]">
                {track.label}
              </h3>
              <p className="text-sm leading-relaxed text-[#3A3D40]/82">
                {track.audience}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-[#3A3D40]/78">
              {track.focus}
            </p>
            <div className="rounded-2xl border border-dashed border-[#2C4F52]/20 bg-[#F2E3D5]/55 p-4 text-sm text-[#2C4F52]/80">
              <p>{track.availabilityNote}</p>
              <p className="mt-2 font-mono text-xs text-[#2C4F52]/65">
                File: {track.filePath}
              </p>
            </div>
            <div className="mt-auto flex flex-wrap gap-3">
              <Link
                href={track.resumeHref}
                className="inline-flex items-center rounded-full bg-[#2C4F52] px-4 py-2 text-sm font-semibold text-[#F2E3D5] transition hover:bg-[#2C4F52]/90 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                View resume page
              </Link>
              <Link
                href={track.downloadHref}
                className="inline-flex items-center rounded-full bg-[#2C4F52] px-4 py-2 text-sm font-semibold text-[#F2E3D5] transition hover:bg-[#2C4F52]/90 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Download PDF
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-[#2C4F52]/20 bg-white px-4 py-2 text-sm font-semibold text-[#2C4F52] transition hover:bg-[#F2E3D5]/45 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Contact me
              </Link>
            </div>
          </article>
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

export default ResumeAccess;
