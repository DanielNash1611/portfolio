import type { Metadata } from "next";
import Script from "next/script";
import { getPortrait } from "@/components/Portrait";
import AboutInline from "@/sections/AboutInline";
import FeaturedWork from "@/sections/FeaturedWork";
import HomeHero from "@/sections/HomeHero";
import ImpactAtScale from "@/components/ImpactAtScale";
import NarrativeBridge from "@/sections/NarrativeBridge";
import HomeTestimonials from "@/sections/HomeTestimonials";
import ResumeAccess from "@/sections/ResumeAccess";
import WhatIBuild from "@/sections/WhatIBuild";
import { siteOrigin } from "@/lib/site";

export const dynamic = "force-static";

const heroPortrait = getPortrait("hero");
const defaultOgImage = {
  url: "/og-default.svg",
  width: 1200,
  height: 630,
  alt: "Abstract gradient in brand palette for Daniel Nash",
};
const heroImagePath = heroPortrait
  ? `/portraits/${heroPortrait.file}`
  : defaultOgImage.url;

export const metadata: Metadata = {
  title: {
    absolute: "Daniel Nash | Senior Product Manager",
  },
  description:
    "Senior Product Manager with experience across ecommerce, contact center, platforms, and AI strategy, with clear resume paths for Senior PM, Builder PM, and Product Leader roles.",
  openGraph: {
    title: "Daniel Nash | Senior Product Manager",
    description:
      "Senior Product Manager with experience across ecommerce, contact center, platforms, and AI strategy, with clear resume paths for Senior PM, Builder PM, and Product Leader roles.",
    images: heroPortrait
      ? [
          {
            url: heroImagePath,
            width: heroPortrait.width,
            height: heroPortrait.height,
            alt: heroPortrait.alt,
            type: "image/jpeg",
          },
        ]
      : [defaultOgImage],
  },
  twitter: {
    title: "Daniel Nash | Senior Product Manager",
    description:
      "Senior Product Manager with experience across ecommerce, contact center, platforms, and AI strategy, with clear resume paths for Senior PM, Builder PM, and Product Leader roles.",
    images: [heroImagePath],
  },
};

export default function HomePage(): JSX.Element {
  const heroJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Daniel Nash",
    image: [
      `${siteOrigin}/portraits/hero_square.avif`,
      `${siteOrigin}/portraits/hero_square.webp`,
      `${siteOrigin}${heroImagePath}`,
    ],
    url: siteOrigin,
    jobTitle: "Senior Product Manager",
  };

  return (
    <div className="space-y-16 pb-24">
      <Script id="home-profile-jsonld" type="application/ld+json">
        {JSON.stringify(heroJsonLd)}
      </Script>
      <HomeHero />
      <WhatIBuild />
      <ImpactAtScale />
      <NarrativeBridge />
      <FeaturedWork />
      <ResumeAccess />
      <AboutInline portraitSrc="/portraits/hero_square_photo.jpg" />
      <HomeTestimonials />
    </div>
  );
}
