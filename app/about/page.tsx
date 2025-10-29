import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import Portrait, { getPortrait } from "@/components/Portrait";
import { siteOrigin } from "@/lib/site";

const aboutHeaderPortrait = getPortrait("about-header");
const defaultOgImage = {
  url: "/og-default.svg",
  width: 1200,
  height: 630,
  alt: "Abstract gradient in brand palette for Daniel Nash"
};
const aboutHeaderPath = aboutHeaderPortrait
  ? `/portraits/${aboutHeaderPortrait.file}`
  : defaultOgImage.url;

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Daniel Nash connects AI product leadership with a lifelong dedication to music and composition.",
  openGraph: {
    images: [
      aboutHeaderPortrait
        ? {
            url: aboutHeaderPath,
            width: aboutHeaderPortrait.width,
            height: aboutHeaderPortrait.height,
            alt: aboutHeaderPortrait.alt,
            type: "image/jpeg"
          }
        : defaultOgImage
    ]
  },
  twitter: {
    images: [aboutHeaderPath]
  }
};

export default function AboutPage(): JSX.Element {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Daniel Nash",
    primaryImageOfPage: `${siteOrigin}${aboutHeaderPath}`,
    url: `${siteOrigin}/about`
  };
  const inlinePortrait = getPortrait("inline");
  const ctaPortrait = getPortrait("cta-right");

  const placeholder = (className?: string) => (
    <div
      className={`relative overflow-hidden rounded-2xl border border-brand-slate/10 bg-white/60 shadow-soft ${className ?? ""}`}
    >
      <Image
        src="/images/profile-placeholder.svg"
        alt="Portrait illustration placeholder for Daniel Nash"
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover"
      />
    </div>
  );

  return (
    <div className="container space-y-10 py-10">
      <Script id="about-jsonld" type="application/ld+json">
        {JSON.stringify(aboutJsonLd)}
      </Script>
      <article className="space-y-6 rounded-3xl border border-brand-slate/10 bg-white/80 p-10 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal/70">
          About
        </p>
        {aboutHeaderPortrait ? (
          <Portrait
            variant="about-header"
            portrait={aboutHeaderPortrait}
            className="mb-8 w-full max-w-xs rounded-2xl border border-brand-slate/10 shadow-soft lg:max-w-md"
          />
        ) : (
          placeholder("mb-8 aspect-[3/4] w-full max-w-xs lg:max-w-md")
        )}
        <h1 className="text-4xl font-semibold text-brand-teal">
          Leading AI products with a composer&apos;s intuition
        </h1>
        {inlinePortrait ? (
          <Portrait
            variant="inline"
            portrait={inlinePortrait}
            className="my-6 rounded-xl border border-brand-slate/10 shadow-soft lg:float-left lg:mr-6 lg:w-1/3"
          />
        ) : (
          placeholder("my-6 aspect-[3/4] lg:float-left lg:mr-6 lg:w-1/3")
        )}
        <p className="text-lg text-brand-slate/80">
          I&apos;m Daniel Nash, a Senior AI Product Manager and composer building experiences that harmonize human insight with machine intelligence. Over the last decade, I&apos;ve led growth and platform initiatives across retail, marketplaces, and creative tooling, shipping outcomes that balance business impact, responsible AI, and elegant UX.
        </p>
        <p className="text-brand-slate/80">
          My background spans orchestral composition, studio production, and product experimentation. Whether guiding an AI platform roadmap or scoring an immersive installation, I focus on craft, collaboration, and measurable outcomes.
        </p>
        <p className="text-brand-slate/80">
          Away from launch plans you&apos;ll find me arranging for chamber ensembles, building generative synth patches, or mentoring product teams exploring AI-assisted creativity.
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
      <aside className="space-y-6 rounded-3xl border border-brand-slate/10 bg-brand-teal/5 p-8 shadow-soft">
        <h2 className="text-lg font-semibold text-brand-teal">
          Collaboration highlights
        </h2>
        {ctaPortrait ? (
          <Portrait
            variant="cta-right"
            portrait={ctaPortrait}
            className="w-full rounded-2xl border border-brand-slate/10 shadow-soft"
          />
        ) : (
          placeholder("aspect-[3/4] w-full")
        )}
        <ul className="space-y-3 text-sm text-brand-slate/80">
          <li>- AI product leadership & experimentation programs</li>
          <li>- Creative technology prototypes and demos</li>
          <li>- Music scoring, sound design, and installations</li>
          <li>- Workshops and conference talks</li>
        </ul>
        <div className="space-y-1 text-sm text-brand-slate/70">
          <p>Based in Los Angeles. Collaborating with design, engineering, and data partners across time zones.</p>
          <p>When I&apos;m not shipping experiments you&apos;ll find me scoring short films or playing with modular synth patches.</p>
        </div>
      </aside>
    </div>
  );
}
