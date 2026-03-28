import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import ArtifactBlock from "@/components/site/ArtifactBlock";
import CheckoutFragilityArtifact from "@/components/site/CheckoutFragilityArtifact";
import Container from "@/components/site/Container";
import ContentSection from "@/components/site/ContentSection";
import MediaFrame from "@/components/site/MediaFrame";
import PageHero from "@/components/site/PageHero";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import UsabilityResultsBlock from "@/components/site/UsabilityResultsBlock";
import { getTestimonialsByIds, getWorkEntry } from "@/content/portfolio";

const entry = getWorkEntry("checkout-redesign");

const roleChanges = [
  "Developers had enough context to make stronger product decisions during implementation.",
  "UX stayed actively involved during development instead of handing off designs and stepping away.",
];

const buildParagraphs = [
  "One of the biggest lessons from this work was that developers build better when they are given enough context to think, not just enough detail to comply.",
  "Previously, design was treated more like a handoff. On this project, I made sure the UX designer remained available throughout development. That meant that when feasibility issues came up, they turned into live product and design conversations rather than isolated engineering compromises.",
  "That mattered because the designer did not just have one solution in mind. He had multiple directions he could take. So instead of drifting into a weaker fallback path, the team could quickly choose another option that was still intentional, still user-centered, and more feasible to build.",
  "That reduced rework, improved implementation decisions, and helped the team move faster with more confidence.",
];

const deliveryParagraphs = [
  "We delivered the redesign in 12 weeks, which was fast for a journey this sensitive.",
  "More importantly, the launch was unusually clean. We saw almost no interruption to services after release, even though checkout was a high-risk area where problems would have shown up immediately.",
  "Part of that came from turning extreme scenario complexity into a practical QA plan. I mapped roughly 400 billion theoretical checkout combinations, then focused the team on 20-30 scenarios that covered the highest-risk paths before launch.",
  "That outcome came from the execution model as much as the redesign itself: stronger shared context, tighter UX-engineering collaboration, and better in-flight decisions.",
];

const resultBullets = [
  "30% faster checkout",
  "~3% conversion lift",
  "~$16M estimated annualized revenue impact",
  "12-week delivery timeline",
  "Minimal service disruption after launch",
  "Immediate positive signal through post-launch A/B testing",
];

const jiraNotes = [
  "User-centered framing",
  "Clear implementation guidance",
  "Enough context for better engineering decisions",
];

const beforeAfterArtifacts = [
  {
    label: "BEFORE",
    src: "/images/checkout-redesign/checkout-before.png",
    alt: "Legacy Guitar Center checkout showing a dense multi-step form with more cluttered layout and lower scanability.",
  },
  {
    label: "AFTER",
    src: "/images/checkout-redesign/checkout-after.png",
    alt: "Redesigned Guitar Center checkout showing a clearer delivery step with improved hierarchy and scanability.",
  },
];

const relatedTestimonials = getTestimonialsByIds([
  "christopher-pruneau",
  "matt-winick",
]);

export const metadata: Metadata = {
  title: "Checkout Redesign",
  description:
    "How better execution turned a checkout redesign into measurable growth.",
};

export default function OmsTransformationPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <Container className="space-y-8 pt-6">
      <Link
        href="/work"
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-teal)]/12 bg-white/84 px-4 py-2 text-sm font-semibold text-[color:var(--color-teal)] transition hover:bg-[color:var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to work
      </Link>

      <PageHero
        eyebrow={entry.eyebrow}
        title="How better execution turned a checkout redesign into measurable growth"
        description={entry.summary}
        tags={entry.tags}
        metrics={entry.featuredMetrics}
      />

      {entry.heroDetails?.[0] ? (
        <ContentSection tone="plain" className="space-y-5">
          <p className="max-w-4xl text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
            {entry.heroDetails[0]}
          </p>
        </ContentSection>
      ) : null}

      <ContentSection
        title="A critical revenue journey with very little room for error"
        description="The stakes behind the redesign and why the delivery model mattered as much as the interface."
      >
        {entry.context.map((paragraph) => (
          <p
            key={paragraph}
            className="text-base leading-7 text-[color:var(--color-slate)]/72"
          >
            {paragraph}
          </p>
        ))}
        <CheckoutFragilityArtifact />
      </ContentSection>

      <ContentSection
        title="How I led the work"
        description="My role was to improve decision quality during execution, not just define the roadmap."
      >
        <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
          I helped drive the effort across product, UX, and engineering from
          problem definition through rollout. That included aligning the team
          around the stakes of the redesign, shaping the work clearly enough
          that people could make good decisions during execution, and improving
          how collaboration happened during the build.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {roleChanges.map((item) => (
            <article
              key={item}
              className="rounded-[1.35rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/86 px-5 py-5"
            >
              <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
                {item}
              </p>
            </article>
          ))}
        </div>
        <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
          That improved decision quality throughout the project.
        </p>
      </ContentSection>

      <ContentSection
        title="Better collaboration produced a better build"
        description="Better execution here meant stronger product, design, and engineering decisions while the work was still in motion."
        tone="muted"
      >
        {buildParagraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-base leading-7 text-[color:var(--color-slate)]/74"
          >
            {paragraph}
          </p>
        ))}
      </ContentSection>

      <ArtifactBlock
        title="Context-rich implementation ticket"
        caption="A representative story showing how I framed user need, expected behavior, and business rationale so engineering could make stronger in-flight decisions."
        notes={jiraNotes}
      >
        <MediaFrame
          src="/images/checkout-redesign/jira-ticket.png"
          alt="Jira ticket screenshot showing a user story, implementation details, and business rationale for a checkout-related change."
          sizes="(min-width: 1280px) 820px, (min-width: 768px) 70vw, 100vw"
          className="aspect-[16/9] rounded-[1.6rem] border border-black/6 bg-white shadow-[0_20px_50px_rgba(58,61,64,0.08)]"
          imageClassName="object-contain bg-white p-2 md:p-4"
          expandable
          expandLabel="Expand Jira implementation artifact"
        />
      </ArtifactBlock>

      <ArtifactBlock
        title="Before & After"
        caption="The redesign simplified a dense multi-step checkout into a clearer, easier-to-scan flow."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {beforeAfterArtifacts.map((artifact) => (
            <figure
              key={artifact.label}
              className="overflow-hidden rounded-[1.6rem] border border-black/6 bg-white/88 shadow-[0_20px_50px_rgba(58,61,64,0.08)]"
            >
              <MediaFrame
                src={artifact.src}
                alt={artifact.alt}
                sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 100vw"
                className="aspect-[16/10] border-b border-black/6 bg-[color:var(--color-background)]/84"
                imageClassName="object-contain bg-[color:var(--color-background)]/84 p-4 object-top"
                expandable
                expandLabel={`Expand ${artifact.label.toLowerCase()} checkout screenshot`}
              >
                <div className="absolute left-4 top-4 rounded-full border border-[color:var(--color-teal)]/12 bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-teal)]/82 shadow-sm">
                  {artifact.label}
                </div>
              </MediaFrame>
            </figure>
          ))}
        </div>
      </ArtifactBlock>

      <ContentSection
        title="Fast timeline, unusually clean release"
        description="The delivery result mattered because checkout was a place where issues would have shown up immediately."
      >
        {deliveryParagraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-base leading-7 text-[color:var(--color-slate)]/72"
          >
            {paragraph}
          </p>
        ))}
      </ContentSection>

      <UsabilityResultsBlock />

      <ContentSection
        title="What changed after launch"
        description="The measurable outcomes stayed grounded in observed speed, validated conversion lift, and a clean delivery outcome."
        tone="contrast"
      >
        <ul className="grid gap-3 md:grid-cols-2">
          {resultBullets.map((item) => (
            <li
              key={item}
              className="rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-4 text-base leading-7 text-[color:var(--color-cream)]/88"
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="max-w-3xl text-base leading-7 text-[color:var(--color-cream)]/78">
          The annualized upside estimate came from the post-launch A/B test,
          which gave us a grounded way to measure business impact rather than
          relying on assumptions.
        </p>
      </ContentSection>

      <TestimonialsSection
        eyebrow="Key recommendations"
        title="How close collaborators described the work"
        description="Two partner perspectives that reinforce the same story: stronger execution quality during build led to a better outcome."
        testimonials={relatedTestimonials}
      />

      <ContentSection
        title="What this case says about how I work"
        description="The product principle this project reinforced."
      >
        {entry.reflection.map((paragraph) => (
          <p
            key={paragraph}
            className="text-base leading-7 text-[color:var(--color-slate)]/72"
          >
            {paragraph}
          </p>
        ))}
      </ContentSection>
    </Container>
  );
}
