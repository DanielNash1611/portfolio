import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import Portrait, { getPortrait } from "@/components/Portrait";
import SocialProofSnippet from "@/components/SocialProofSnippet";
import { aboutSocialProof } from "@/data/socialProof";
import { siteOrigin } from "@/lib/site";

const aboutHeaderPortrait = getPortrait("about-header");
const defaultOgImage = {
  url: "/og-default.svg",
  width: 1200,
  height: 630,
  alt: "Abstract gradient in brand palette for Daniel Nash",
};
const aboutHeaderPath = aboutHeaderPortrait
  ? `/portraits/${aboutHeaderPortrait.file}`
  : defaultOgImage.url;

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Daniel Nash approaches Senior Product Manager, Builder PM, and Product Leader opportunities across ecommerce, contact center, platforms, and AI strategy.",
  openGraph: {
    images: [
      aboutHeaderPortrait
        ? {
            url: aboutHeaderPath,
            width: aboutHeaderPortrait.width,
            height: aboutHeaderPortrait.height,
            alt: aboutHeaderPortrait.alt,
            type: "image/jpeg",
          }
        : defaultOgImage,
    ],
  },
  twitter: {
    images: [aboutHeaderPath],
  },
};

export default function AboutPage(): JSX.Element {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Daniel Nash",
    primaryImageOfPage: `${siteOrigin}${aboutHeaderPath}`,
    url: `${siteOrigin}/about`,
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
          Senior Product Manager with range across execution, systems, and scale
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
          I&apos;m Daniel Nash, a Senior Product Manager with 9 years of
          product-related work across ecommerce, contact center, platforms, and
          AI strategy. I&apos;m known for ramping quickly, building trust across
          functions, and turning ambiguity into clear priorities, measurable
          outcomes, and shipped work.
        </p>
        <p className="text-brand-slate/80">
          My work increasingly extends into frontier AI applications, including
          emerging work connected to Immiatrics, a startup focused on advancing
          immunology research. I&apos;m especially interested in how product
          systems and AI can support scientific discovery, and I describe that
          work modestly because the opportunity is still early.
        </p>
        <p className="text-brand-slate/80">
          My background in composition remains the differentiator. It sharpens
          systems thinking, pattern recognition, craft, storytelling, empathy,
          and the structured creativity that helps teams solve ambiguous product
          problems without defaulting to generic answers.
        </p>
        <div className="flex flex-wrap gap-3 pt-4">
          <Link href="/work">
            <Button variant="primary">Explore product portfolio</Button>
          </Link>
          <Link href="/resume">
            <Button variant="secondary">View resume tracks</Button>
          </Link>
          <Link href="/music">
            <Button variant="ghost">Visit music page</Button>
          </Link>
        </div>
      </article>
      <section className="space-y-5 rounded-3xl border border-brand-slate/10 bg-white/85 p-8 shadow-soft">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal/70">
            Trusted by leaders and partners
          </p>
          <h2 className="text-2xl font-semibold text-brand-teal md:text-3xl">
            What collaborators consistently validate
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-brand-slate/80">
            Recommendations from senior partners consistently describe me as a
            strategic business partner who can pair roadmap ownership with
            AI-platform execution, operational modernization, and executive
            trust.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {aboutSocialProof.map((item) => (
            <SocialProofSnippet
              key={`${item.author}-${item.quote}`}
              item={item}
              showSourceLink
            />
          ))}
        </div>
      </section>
      <aside className="space-y-6 rounded-3xl border border-brand-slate/10 bg-brand-teal/5 p-8 shadow-soft">
        <h2 className="text-lg font-semibold text-brand-teal">Best fit</h2>
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
          <li>
            - Senior PM roles across commerce, platform, and AI-enabled products
          </li>
          <li>
            - Builder PM roles focused on 0-to-1 workflows, prototypes, and
            internal tools
          </li>
          <li>
            - Product leadership roles centered on governance, enablement, and
            operating model
          </li>
          <li>
            - Select speaking, workshops, and music collaborations as a
            secondary track
          </li>
        </ul>
        <div className="space-y-1 text-sm text-brand-slate/70">
          <p>
            Based in Los Angeles. Collaborating with design, engineering, and
            data partners across time zones.
          </p>
          <p>
            Currently targeting Senior Product Manager, Builder PM, and Product
            Leader opportunities.
          </p>
        </div>
      </aside>
    </div>
  );
}
