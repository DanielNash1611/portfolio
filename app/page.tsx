import type { Metadata } from "next";
import Script from "next/script";
import { getPortrait } from "@/components/Portrait";
import FeaturedWork from "@/sections/FeaturedWork";
import HomeHero from "@/sections/HomeHero";
import HomeStats from "@/sections/HomeStats";
import AboutInline from "@/sections/AboutInline";
import NarrativeBridge from "@/sections/NarrativeBridge";
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
    "AI product leader and composer building high-performing user journeys, experimentation programs, and music tech.",
  openGraph: {
    title: "Daniel Nash — Senior AI Product Manager & Composer",
    description:
      "AI product leader and composer building high-performing user journeys, experimentation programs, and music tech.",
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
    title: "Daniel Nash — Senior AI Product Manager & Composer",
    description:
      "AI product leader and composer building high-performing user journeys, experimentation programs, and music tech.",
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
      <HomeHero />
      <HomeStats />
      <AboutInline portraitSrc="/portraits/hero_square_photo.jpg" />
      <FeaturedWork />
      <NarrativeBridge />
      <HomeTestimonials />
    </div>
  );
}
