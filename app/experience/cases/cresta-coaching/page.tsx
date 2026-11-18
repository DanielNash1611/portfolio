import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cresta coaching rollout — case study in development",
  robots: { index: false, follow: false },
};

export default function CrestaCasePlaceholder() {
  return (
    <section className="min-h-[70svh] bg-[#f3eee4] px-6 py-20 text-[#142733]">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.15em] text-[#a14835]">
          Case study in development
        </p>
        <h1 className="mt-6 font-serif text-5xl leading-tight">
          Cresta coaching rollout
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed">
          How a technology choice became a working coaching practice.
        </p>
        <p className="mt-5 max-w-xl leading-relaxed">
          The dedicated write-up hasn’t been added yet. Explore the rollout
          summary and before-and-after workflow in the portfolio.
        </p>
        <div className="mt-10 flex flex-wrap gap-5">
          <Link
            className="inline-flex min-h-11 items-center bg-[#173f3d] px-5 text-sm text-[#f3eee4]"
            href="/experience#experience-work"
          >
            Explore the rollout →
          </Link>
          <Link
            className="inline-flex min-h-11 items-center text-sm underline underline-offset-4"
            href="/experience#experience-systems"
          >
            View the related roadmap →
          </Link>
        </div>
      </div>
    </section>
  );
}
