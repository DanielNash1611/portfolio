import type { Metadata } from "next";
import Portrait, { getPortrait } from "@/components/Portrait";
import Container from "@/components/site/Container";
import ContentSection from "@/components/site/ContentSection";
import CTASection from "@/components/site/CTASection";
import PageHero from "@/components/site/PageHero";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import {
  aboutContent,
  getRenderableTestimonials,
  siteConfig,
} from "@/content/portfolio";

const aboutPortrait = getPortrait("about-header");

export const metadata: Metadata = {
  title: "About",
  description:
    "About Daniel Nash, an AI Product Leader / Senior Product Manager focused on practical AI products, workflow modernization, and enterprise adoption.",
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
            value: "Enterprise AI adoption",
            detail: "Workflow modernization, trust, governance, and measurable outcomes.",
          },
          {
            label: "Scope",
            value: "Products, workflows, systems",
            detail: "Across ecommerce, contact center, and enterprise AI adoption.",
          },
        ]}
      />

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-10">
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
        </div>

        {aboutPortrait ? (
          <Portrait
            variant="about-header"
            portrait={aboutPortrait}
            className="rounded-[1.75rem] border border-[color:var(--color-teal)]/10"
          />
        ) : null}
      </section>

      <TestimonialsSection
        eyebrow="Recommendations"
        title="More recommendations from leaders and technical partners"
        description="These excerpts reinforce the same signal as the work itself: business impact, strategic clarity, and strong cross-functional trust."
        testimonials={getRenderableTestimonials()}
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
