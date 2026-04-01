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
    "About Daniel Nash: AI Systems Product Leader / Senior Product Manager with a builder mindset and creative background.",
};

export default function AboutPage(): JSX.Element {
  return (
    <Container className="space-y-8 pt-6">
      <PageHero
        eyebrow="About"
        title={aboutContent.title}
        description={aboutContent.summary}
        metrics={[
          { label: "Base", value: siteConfig.location },
          { label: "Focus", value: "AI, product systems, measurable impact" },
          { label: "Differentiator", value: "Creative builder mindset" },
        ]}
      />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          <ContentSection
            title="The through-line"
            description="How the portfolio hangs together across different kinds of work."
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
            description="The operating principles I keep returning to."
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
        eyebrow="LinkedIn recommendations"
        title="Full recommendation set"
        description="Actual recommendation content is already wired into the content layer. Placeholder entries also exist in the same file so it is obvious where to paste future LinkedIn recommendations."
        testimonials={getRenderableTestimonials()}
      />

      <CTASection
        title="The quickest way to continue the conversation"
        description="If the mix of strategic product leadership, AI systems thinking, and builder energy feels relevant, send a note on LinkedIn or by email."
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
