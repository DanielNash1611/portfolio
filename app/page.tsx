import type { Metadata } from "next";
import Link from "next/link";
import Portrait, { getPortrait } from "@/components/Portrait";
import CaseStudyCard from "@/components/site/CaseStudyCard";
import Container from "@/components/site/Container";
import CTASection from "@/components/site/CTASection";
import EssayCard from "@/components/site/EssayCard";
import HeroSection from "@/components/site/HeroSection";
import MetricStrip from "@/components/site/MetricStrip";
import MotionReveal from "@/components/site/MotionReveal";
import ProductCard from "@/components/site/ProductCard";
import SectionHeader from "@/components/site/SectionHeader";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import {
  getFeaturedTestimonials,
  getProductEntry,
  getThinkingEntry,
  getWorkEntry,
  homeContent,
} from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Daniel Nash | AI Systems Product Leader",
  description:
    "Premium portfolio for Daniel Nash, an AI Systems Product Leader / Senior Product Manager focused on turning emerging AI capabilities into production-ready products.",
};

const featuredWork = homeContent.featuredWork
  .map((slug) => getWorkEntry(slug))
  .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

const featuredProducts = homeContent.featuredProducts
  .map((slug) => getProductEntry(slug))
  .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

const featuredThinking = homeContent.featuredThinking
  .map((slug) => getThinkingEntry(slug))
  .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

const creativePortrait = getPortrait("casual");

export default function HomePage(): JSX.Element {
  return (
    <div className="space-y-14 pb-20 md:space-y-16 md:pb-24">
      <Container className="pt-6">
        <HeroSection
          eyebrow={homeContent.hero.eyebrow}
          title={homeContent.hero.title}
          description={homeContent.hero.description}
          primaryAction={homeContent.hero.primaryAction}
          secondaryAction={homeContent.hero.secondaryAction}
        />
      </Container>

      <Container className="-mt-4 md:-mt-6">
        <MotionReveal>
          <MetricStrip metrics={homeContent.metrics} variant="compact" />
        </MotionReveal>
      </Container>

      <Container>
        <MotionReveal>
          <section className="grid gap-6 rounded-[2rem] border border-black/6 bg-white/82 px-6 py-6 shadow-[0_20px_60px_rgba(58,61,64,0.08)] md:px-8 md:py-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-teal)]/68">
                {homeContent.positioning.eyebrow}
              </p>
              <h2 className="text-balance text-2xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-3xl">
                {homeContent.positioning.title}
              </h2>
              <p className="max-w-xl text-base leading-7 text-[color:var(--color-slate)]/72">
                {homeContent.positioning.description}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {homeContent.positioning.categories.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.35rem] border border-[color:var(--color-teal)]/8 bg-[color:var(--color-background)]/84 px-4 py-4"
                >
                  <h3 className="text-base font-semibold text-[color:var(--color-slate)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/68">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </MotionReveal>
      </Container>

      <Container className="space-y-8">
        <MotionReveal>
          <SectionHeader
            eyebrow="Featured case studies"
            title="The case studies that make the strongest case fastest"
            description="Each one shows a different dimension of senior AI product leadership: enterprise adoption, platform thinking, and systems-level business impact."
          />
        </MotionReveal>
        <div className="grid gap-6 xl:grid-cols-3">
          {featuredWork.map((entry, index) => (
            <MotionReveal key={entry.slug} delay={index * 0.05}>
              <CaseStudyCard entry={entry} />
            </MotionReveal>
          ))}
        </div>
      </Container>

      <Container className="space-y-8">
        <MotionReveal>
          <SectionHeader
            eyebrow="Live products"
            title="AI-native products that show execution, not just ideas"
            description="From live alpha builds to early-stage concepts, these projects show AI-native product execution with clear scope, working artifacts, and honest stage framing."
          />
        </MotionReveal>
        <div className="grid gap-6 xl:grid-cols-3">
          {featuredProducts.map((entry, index) => (
            <MotionReveal key={entry.slug} delay={index * 0.05}>
              <ProductCard entry={entry} />
            </MotionReveal>
          ))}
        </div>
      </Container>

      <Container className="space-y-8">
        <MotionReveal>
          <SectionHeader
            eyebrow="How I think"
            title="A product point of view shaped by operating models, not slogans"
            description="Short essays that make the leadership logic visible behind the case studies."
          />
        </MotionReveal>
        <div className="grid gap-6 lg:grid-cols-2">
          {featuredThinking.map((entry, index) => (
            <MotionReveal key={entry.slug} delay={index * 0.05}>
              <EssayCard entry={entry} />
            </MotionReveal>
          ))}
        </div>
      </Container>

      <Container>
        <MotionReveal>
          <TestimonialsSection
            eyebrow="Recommendations"
            title="Selected recommendations from leaders and technical partners"
            description="Short excerpts that reinforce the same signal as the work itself: business impact, strategic clarity, and strong cross-functional trust."
            testimonials={getFeaturedTestimonials()}
          />
        </MotionReveal>
      </Container>

      <Container>
        <MotionReveal>
          <section className="grid gap-8 rounded-[2rem] border border-black/6 bg-white/84 px-6 py-8 shadow-[0_24px_70px_rgba(58,61,64,0.09)] md:px-8 md:py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,360px)] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-teal)]/68">
                Creative edge
              </p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-4xl">
                Music stays in the portfolio as a differentiator, not a detour
              </h2>
              <p className="text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
                {homeContent.creativeHighlight.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={homeContent.creativeHighlight.href}
                  className="inline-flex items-center rounded-full bg-[color:var(--color-teal)] px-5 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-[color:var(--color-slate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
                >
                  Explore creative work
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center rounded-full border border-[color:var(--color-teal)]/14 bg-white px-5 py-3 text-sm font-semibold text-[color:var(--color-teal)] transition hover:bg-[color:var(--color-cream)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
                >
                  Read the full story
                </Link>
              </div>
            </div>
            {creativePortrait ? (
              <Portrait
                variant="casual"
                portrait={creativePortrait}
                className="rounded-[1.7rem] border border-[color:var(--color-teal)]/10"
              />
            ) : null}
          </section>
        </MotionReveal>
      </Container>

      <Container>
        <CTASection
          title={homeContent.finalCta.title}
          description={homeContent.finalCta.description}
          primaryAction={homeContent.finalCta.primaryAction}
          secondaryAction={homeContent.finalCta.secondaryAction}
        />
      </Container>
    </div>
  );
}
