import type { Metadata } from "next";
import Portrait, { getPortrait } from "@/components/Portrait";
import AboutJourneyTimeline from "@/components/site/AboutJourneyTimeline";
import Container from "@/components/site/Container";
import ContentSection from "@/components/site/ContentSection";
import CTASection from "@/components/site/CTASection";
import PageHero from "@/components/site/PageHero";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import { aboutContent, siteConfig } from "@/content/portfolio";
import { testimonials } from "@/data/testimonials";

const aboutPortrait = getPortrait("about-header");

export const metadata: Metadata = {
  title: "About",
  description:
    "About Daniel Nash, an AI product leader focused on measurable business impact, trusted adoption, responsible change, and AI that improves human work.",
};

export default function AboutPage(): JSX.Element {
  return (
    <Container className="space-y-10 pt-6 md:space-y-12">
      <PageHero
        eyebrow="About Daniel Nash"
        title={aboutContent.title}
        description={aboutContent.summary}
        metrics={[
          {
            label: "Role",
            value: "AI Product Leader",
            detail: "Senior Product Manager who stays close to the system.",
          },
          {
            label: "Focus",
            value: "AI adoption + impact",
            detail:
              "Business outcomes, workflow transformation, trust, and responsible change.",
          },
          {
            label: "Scope",
            value: "Products, people, systems",
            detail:
              "Practical AI that improves the work and the experience of doing it.",
          },
        ]}
      />

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <ContentSection
          title="The through-line"
          description="The domains change, but the product logic underneath is consistent."
        >
          {aboutContent.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-7 text-[color:var(--color-slate)]/72"
            >
              {paragraph}
            </p>
          ))}
        </ContentSection>

        {aboutPortrait ? (
          <Portrait
            variant="about-header"
            portrait={aboutPortrait}
            className="rounded-[1.75rem] border border-[color:var(--color-teal)]/10"
          />
        ) : null}
      </section>

      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[color:var(--color-slate)] px-6 py-8 text-[color:var(--color-cream)] shadow-[0_26px_70px_rgba(58,61,64,0.18)] md:px-8 md:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(219,191,150,0.12),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(209,122,95,0.1),_transparent_38%)]"
        />
        <div className="relative space-y-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-tan)]">
              {aboutContent.humanFlourishing.eyebrow}
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              {aboutContent.humanFlourishing.title}
            </h2>
            <p className="text-base leading-7 text-[color:var(--color-cream)]/76 md:text-lg md:leading-8">
              {aboutContent.humanFlourishing.description}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="border-t border-white/14 pt-5">
              <h3 className="text-lg font-semibold">Professional focus</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--color-cream)]/72 md:text-base">
                {aboutContent.humanFlourishing.professional}
              </p>
            </div>
            <div className="border-t border-white/14 pt-5">
              <h3 className="text-lg font-semibold">Personal exploration</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--color-cream)]/72 md:text-base">
                {aboutContent.humanFlourishing.personal}
              </p>
            </div>
          </div>

          <blockquote className="max-w-4xl border-l-2 border-[color:var(--color-orange)] pl-5 text-xl font-semibold leading-8 text-[color:var(--color-cream)] md:text-2xl md:leading-9">
            {aboutContent.humanFlourishing.manifesto}
          </blockquote>
        </div>
      </section>

      <AboutJourneyTimeline
        eyebrow={aboutContent.timeline.eyebrow}
        title={aboutContent.timeline.title}
        description={aboutContent.timeline.description}
        items={aboutContent.timeline.items}
      />

      <ContentSection
        title="How I work"
        description="The operating principles that shape how I build, ship, and scale."
        tone="muted"
      >
        <ul className="space-y-4">
          {aboutContent.principles.map((principle) => (
            <li
              key={principle}
              className="rounded-[1.25rem] bg-white/72 px-5 py-4 text-base leading-7 text-[color:var(--color-slate)]/72"
            >
              {principle}
            </li>
          ))}
        </ul>
      </ContentSection>

      <TestimonialsSection
        id="recommendations"
        eyebrow="Recommendations"
        title="What leaders, engineers, and partners say about the work"
        description="Short excerpts pull out the strongest signal; tap any card to read the full recommendation and see how the person worked with me. LinkedIn recommendations link out for verification; direct recommendations are noted as such."
        testimonials={testimonials}
      />

      <CTASection
        title="If you're hiring for AI product leadership, let's talk"
        description="I'm most useful in conversations with hiring managers, recruiters, founders, and collaborators who need AI capability translated into practical products, workflows, and systems. If that sounds relevant, reach out on LinkedIn or through the contact form."
        primaryAction={{
          href: siteConfig.linkedinUrl,
          label: "Connect on LinkedIn",
          external: true,
        }}
        secondaryAction={{
          href: siteConfig.contactHref,
          label: "Send a message",
        }}
      />
    </Container>
  );
}
