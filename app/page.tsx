import type { Metadata } from "next";
import Hero from "@/components/Hero";
import StatTile from "@/components/StatTile";
import CaseCard from "@/components/CaseCard";
import { cases } from "@/data/cases";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore product leadership and music composition work from Daniel Nash, blending AI strategy with human-centered design."
};

const statData = [
  {
    value: 50,
    suffix: "% faster",
    label: "Checkout redesign completion time reduction"
  },
  {
    value: 3,
    suffix: "% conversion",
    label: "Net lift in conversion through experimentation"
  },
  {
    value: 16,
    prefix: "$",
    suffix: "M/yr impact",
    label: "Incremental annualized revenue influence"
  }
];

export default function HomePage(): JSX.Element {
  const featuredCases = cases.filter((item) =>
    ["checkout-redesign", "sound-synthesist"].includes(item.slug)
  );

  return (
    <div className="space-y-16 pb-24">
      <div className="container pt-6">
        <Hero
          title="Bridging Creativity & Strategy — Senior AI Product Manager & Composer"
          subtitle="I design AI-powered products and high-performing user journeys that convert."
          primaryCta={{ href: "/work", label: "Explore Product Work" }}
          secondaryCta={{
            href: "/music",
            label: "Listen to My Music",
            variant: "secondary"
          }}
        />
      </div>

      <section className="container">
        <div className="grid gap-6 md:grid-cols-3">
          {statData.map((stat) => (
            <StatTile key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="container space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal/70">
            Featured Work
          </p>
          <h2 className="text-3xl font-semibold text-brand-teal">
            Case studies that blend AI, design, and experimentation
          </h2>
          <p className="text-brand-slate/80">
            Browse a selection of recent initiatives, from reinventing checkout
            to composing AI-driven soundscapes.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredCases.map((item) => (
            <CaseCard key={item.slug} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
}
