import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Daniel Nash connects AI product leadership with a lifelong dedication to music and composition."
};

export default function AboutPage(): JSX.Element {
  return (
    <div className="container grid gap-10 py-10 lg:grid-cols-[2fr,1fr]">
      <article className="space-y-6 rounded-3xl border border-brand-slate/10 bg-white/80 p-10 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal/70">
          About
        </p>
        <h1 className="text-4xl font-semibold text-brand-teal">
          Leading AI products with a composer’s intuition
        </h1>
        <p className="text-lg text-brand-slate/80">
          I’m Daniel Nash, a Senior AI Product Manager and composer building
          experiences that harmonize human insight with machine intelligence.
          Over the last decade, I’ve led growth and platform initiatives across
          retail, marketplaces, and creative tooling—shipping outcomes that
          balance business impact, responsible AI, and elegant UX.
        </p>
        <p className="text-brand-slate/80">
          My background spans orchestral composition, studio production, and
          product experimentation. Whether guiding an AI platform roadmap or
          scoring an immersive installation, I focus on craft, collaboration,
          and measurable outcomes.
        </p>
        <div className="flex flex-wrap gap-3 pt-4">
          <Link href="/work">
            <Button variant="primary">Explore product portfolio</Button>
          </Link>
          <Link href="/music">
            <Button variant="secondary">Listen to music</Button>
          </Link>
        </div>
      </article>
      <aside className="flex flex-col items-center gap-6">
        <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-3xl border border-brand-slate/10 bg-white/60 shadow-soft">
          <Image
            src="/images/profile-placeholder.svg"
            alt="Portrait illustration placeholder for Daniel Nash"
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-2 text-sm text-brand-slate/70">
          <p>
            Based in Los Angeles. Collaborating with design, engineering, and
            data partners across time zones.
          </p>
          <p>
            When I’m not shipping experiments you’ll find me scoring short films
            or playing with modular synth patches.
          </p>
        </div>
      </aside>
    </div>
  );
}
