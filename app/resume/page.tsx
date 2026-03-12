import type { Metadata } from "next";
import Link from "next/link";
import { RESUME_TRACKS } from "@/data/positioning";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Three recruiter-friendly resume tracks for Senior Product Manager, Builder PM, and Product Leader roles.",
};

export default function ResumePage(): JSX.Element {
  return (
    <div className="container space-y-10 py-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal/70">
          Resume
        </p>
        <h1 className="text-4xl font-semibold text-brand-teal">
          Resume tracks for three hiring narratives
        </h1>
        <p className="max-w-3xl text-brand-slate/80">
          The site is now structured around a broad Senior Product Manager
          default, plus alternate Builder PM and Product Leader lenses. Direct
          PDF links can be enabled by dropping each file into the expected
          `public/resumes` path listed below.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {RESUME_TRACKS.map((track) => (
          <article
            key={track.id}
            id={track.id}
            className="flex h-full flex-col gap-4 rounded-3xl border border-brand-slate/10 bg-white/85 p-6 shadow-soft"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-brand-teal">
                {track.label}
              </h2>
              <p className="text-sm leading-relaxed text-brand-slate/80">
                {track.audience}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-brand-slate/78">
              {track.focus}
            </p>
            <div className="rounded-2xl border border-dashed border-brand-teal/20 bg-brand-teal/5 p-4 text-sm text-brand-slate/80">
              <p>{track.placeholderNote}</p>
              <p className="mt-2 font-mono text-xs text-brand-slate/70">
                {track.placeholderPath}
              </p>
            </div>
            <div className="mt-auto flex flex-wrap gap-3">
              <Link
                href="/work"
                className="inline-flex items-center rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-brand-cream"
              >
                Explore related work
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-brand-teal/20 bg-white px-4 py-2 text-sm font-semibold text-brand-teal"
              >
                Contact me
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
