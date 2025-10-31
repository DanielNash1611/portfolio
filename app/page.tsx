import type { Metadata } from "next";
import Script from "next/script";
import Hero from "@/components/Hero";
import CaseCard from "@/components/CaseCard";
import Portrait, { getPortrait } from "@/components/Portrait";
import SocialRow from "@/components/SocialRow";
import Stats from "@/components/Stats";
import { featuredWork } from "@/data/featuredWork";
import HomeTestimonials from "@/sections/HomeTestimonials";
import { siteOrigin } from "@/lib/site";

export const dynamic = "force-static";

const heroPortrait = getPortrait("hero");
const defaultOgImage = {
  url: "/og-default.svg",
  width: 1200,
  height: 630,
  alt: "Abstract gradient in brand palette for Daniel Nash"
};
const heroImagePath = heroPortrait
  ? `/portraits/${heroPortrait.file}`
  : defaultOgImage.url;

export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore product leadership and music composition work from Daniel Nash, blending AI strategy with human-centered design.",
  openGraph: {
    images: heroPortrait
      ? [
          {
            url: heroImagePath,
            width: heroPortrait.width,
            height: heroPortrait.height,
            alt: heroPortrait.alt,
            type: "image/jpeg"
          }
        ]
      : [defaultOgImage]
  },
  twitter: {
    images: [heroImagePath]
  }
};

export default function HomePage(): JSX.Element {
  const heroJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Daniel Nash",
    image: [
      `${siteOrigin}/portraits/hero_square.avif`,
      `${siteOrigin}/portraits/hero_square.webp`,
      `${siteOrigin}${heroImagePath}`
    ],
    url: siteOrigin,
    jobTitle: "Senior AI Product Manager & Composer"
  };

  return (
    <div className="space-y-16 pb-24">
      <Script id="home-profile-jsonld" type="application/ld+json">
        {JSON.stringify(heroJsonLd)}
      </Script>
      <div className="container pt-6">
        <div className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
          <Hero
            title="Bridging Creativity & Strategy — Senior AI Product Manager & Composer"
            subtitle="I design AI-powered products and high-performing user journeys that convert."
            primaryCta={{ href: "/work", label: "Explore Product Work" }}
            secondaryCta={{
              href: "/music",
              label: "Listen to My Music",
              variant: "ghost"
            }}
          />
          <Portrait variant="hero" className="rounded-2xl shadow-xl" />
        </div>
      </div>

      <Portrait
        variant="divider"
        className="mx-auto h-[44vh] w-[min(92rem,calc(100vw-2.5rem))] rounded-3xl md:h-[52vh]"
      />

      <section className="container">
        <Stats />
      </section>

      <Portrait
        variant="divider"
        className="mx-auto h-[44vh] w-[min(92rem,calc(100vw-2.5rem))] rounded-3xl md:h-[52vh]"
      />

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredWork.map((item) => (
            <CaseCard
              key={item.slug}
              title={item.title}
              description={item.description}
              href={item.href}
              tags={item.tags}
              status={item.status}
              media={item.media}
              chips={item.chips}
            />
          ))}
        </div>
      </section>

      <HomeTestimonials />

      <section className="container">
        <SocialRow />
      </section>
    </div>
  );
}

