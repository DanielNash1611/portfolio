import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import ArtifactBlock from "@/components/site/ArtifactBlock";
import CheckoutFragilityArtifact from "@/components/site/CheckoutFragilityArtifact";
import Container from "@/components/site/Container";
import MediaFrame from "@/components/site/MediaFrame";
import MotionReveal from "@/components/site/MotionReveal";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import UsabilityResultsBlock from "@/components/site/UsabilityResultsBlock";
import { getWorkEntry } from "@/content/portfolio";
import { getTestimonialsByIds } from "@/data/testimonials";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

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
const pageContext = getPageContextByPath("/work/checkout-redesign");
const portfolioContext = getPortfolioContext();

export const metadata: Metadata = {
  title: "Checkout Redesign",
  description:
    "How better execution turned a checkout redesign into measurable growth.",
};

export default function CheckoutRedesignPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <div className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-[#1c3040] text-[color:var(--color-cream)]">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden w-[48%] bg-[color:var(--color-orange)] lg:block"
        />
        <Container className="relative py-6 md:py-8">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 border-b border-white/24 pb-1 text-sm font-semibold text-[color:var(--color-cream)]/78 transition hover:border-[color:var(--color-orange)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-slate)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to work
          </Link>
        </Container>

        <Container className="relative">
          <div className="grid min-h-[calc(100svh-10rem)] items-center gap-12 pb-14 pt-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:pb-20 lg:pt-12">
            <MotionReveal>
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff826d]">
                  {entry.eyebrow} · Commerce
                </p>
                <h1 className="mt-5 text-balance font-serif text-[clamp(3.35rem,7vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.055em]">
                  Faster checkout.
                  <br />
                  Measurable growth.
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-xl leading-8 text-white md:text-2xl md:leading-9">
                  How better execution turned a checkout redesign into
                  measurable growth
                </p>
                <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-[color:var(--color-cream)]/68 md:text-lg md:leading-8">
                  {entry.summary}
                </p>

                <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-cream)]/48">
                  {entry.tags.map((tag) => (
                    <li
                      key={tag}
                      className="relative after:absolute after:-right-3 after:text-white/20 after:content-['/'] last:after:hidden"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <dl className="mt-7 grid gap-5 border-t border-white/16 pt-6 sm:grid-cols-3">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-cream)]/46">
                      Role
                    </dt>
                    <dd className="mt-2 text-sm leading-6 text-[color:var(--color-cream)]/88">
                      {entry.role}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-cream)]/46">
                      Company
                    </dt>
                    <dd className="mt-2 text-sm leading-6 text-[color:var(--color-cream)]/88">
                      {entry.company}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-cream)]/46">
                      Year
                    </dt>
                    <dd className="mt-2 text-sm leading-6 text-[color:var(--color-cream)]/88">
                      {entry.timeframe}
                    </dd>
                  </div>
                </dl>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.12}>
              <div className="relative lg:translate-x-8">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-5 -left-5 h-full w-full border border-white/24"
                />
                <MediaFrame
                  src={entry.heroImage}
                  alt={entry.heroImageAlt}
                  sizes="(min-width: 1400px) 700px, (min-width: 1024px) 48vw, 100vw"
                  className="aspect-[16/11] bg-[#f1f1f3]"
                  imageClassName="object-cover"
                  priority
                />
              </div>
            </MotionReveal>
          </div>
        </Container>

        <div className="relative border-t border-white/14">
          <Container>
            <dl className="grid md:grid-cols-3">
              {entry.featuredMetrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="border-b border-white/14 py-7 md:border-b-0 md:py-9 md:pr-7 [&:not(:first-child)]:md:border-l [&:not(:first-child)]:md:border-white/14 [&:not(:first-child)]:md:pl-7"
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ff826d]">
                    0{index + 1} · {metric.label}
                  </dt>
                  <dd className="mt-3 font-serif text-4xl leading-none tracking-[-0.04em] text-white md:text-5xl">
                    {metric.value}
                  </dd>
                  <dd className="mt-3 max-w-sm text-sm leading-6 text-[color:var(--color-cream)]/56">
                    {metric.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </section>

      <section className="bg-[color:var(--color-background)] py-12 md:py-18">
        <Container className="space-y-14">
          {pageContext ? (
            <PortfolioGuide
              pageContext={pageContext}
              portfolioContext={portfolioContext}
            />
          ) : null}

          {entry.heroDetails?.[0] ? (
            <MotionReveal>
              <section className="grid gap-8 border-y border-[color:var(--color-slate)]/14 py-12 md:py-16 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,1.42fr)] lg:gap-20">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                  The case in one sentence
                </p>
                <p className="max-w-4xl text-pretty font-serif text-2xl leading-9 tracking-[-0.02em] text-[color:var(--color-slate)] md:text-4xl md:leading-[1.2]">
                  {entry.heroDetails[0]}
                </p>
              </section>
            </MotionReveal>
          ) : null}
        </Container>
      </section>

      <section className="bg-[#ecd9ac] py-16 md:py-24">
        <Container>
          <MotionReveal>
            <div>
              <div className="grid gap-9 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
                <div className="space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                    The stakes
                  </p>
                  <h2 className="max-w-[11ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] text-[color:var(--color-slate)] md:text-6xl">
                    A critical revenue journey with very little room for error.
                  </h2>
                </div>
                <div className="space-y-6 border-t border-[color:var(--color-slate)]/14 pt-6 lg:mt-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-slate)]/46">
                    Why delivery mattered as much as the interface
                  </p>
                  {entry.context.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="max-w-3xl text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg md:leading-8"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              <CheckoutFragilityArtifact />
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="bg-[#d8e5ed] py-16 md:py-24">
        <Container>
          <MotionReveal>
            <div>
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                    My role
                  </p>
                  <h2 className="mt-5 max-w-[10ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] text-[color:var(--color-slate)] md:text-6xl">
                    Improve decision quality during execution.
                  </h2>
                </div>

                <div>
                  <p className="max-w-3xl text-lg leading-8 text-[color:var(--color-slate)]/76">
                    I helped drive the effort across product, UX, and
                    engineering from problem definition through rollout. That
                    included aligning the team around the stakes of the
                    redesign, shaping the work clearly enough that people could
                    make good decisions during execution, and improving how
                    collaboration happened during the build.
                  </p>
                  <ol className="mt-9 border-t border-[color:var(--color-slate)]/14">
                    {roleChanges.map((item, index) => (
                      <li
                        key={item}
                        className="grid gap-3 border-b border-[color:var(--color-slate)]/14 py-6 sm:grid-cols-[3rem_minmax(0,1fr)]"
                      >
                        <span className="font-mono text-xs tracking-[0.18em] text-[color:var(--color-orange)]">
                          0{index + 1}
                        </span>
                        <p className="max-w-2xl text-base leading-7 text-[color:var(--color-slate)]/72">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-7 font-serif text-2xl tracking-[-0.02em] text-[color:var(--color-slate)]">
                    That improved decision quality throughout the project.
                  </p>
                </div>
              </div>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <MotionReveal>
        <section className="bg-[#264640] py-16 text-[color:var(--color-cream)] md:py-24">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff826d]">
                  The operating model
                </p>
                <h2 className="max-w-[10ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] md:text-6xl">
                  Better collaboration produced a better build.
                </h2>
              </div>
              <div className="border-t border-white/16">
                {buildParagraphs.map((paragraph, index) => (
                  <article
                    key={paragraph}
                    className="grid gap-4 border-b border-white/16 py-6 sm:grid-cols-[3rem_minmax(0,1fr)]"
                  >
                    <span className="font-mono text-xs tracking-[0.18em] text-[#ff826d]">
                      0{index + 1}
                    </span>
                    <p className="max-w-3xl text-base leading-7 text-[color:var(--color-cream)]/72">
                      {paragraph}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </MotionReveal>

      <section className="bg-[#f4e8d8] py-16 md:py-24">
        <Container className="space-y-16 md:space-y-24">
          <MotionReveal>
            <ArtifactBlock
              title="Context-rich implementation ticket"
              caption="A representative story showing how I framed user need, expected behavior, and business rationale so engineering could make stronger in-flight decisions."
              notes={jiraNotes}
            >
              <MediaFrame
                src="/images/checkout-redesign/jira-ticket.png"
                alt="Jira ticket screenshot showing a user story, implementation details, and business rationale for a checkout-related change."
                sizes="(min-width: 1280px) 820px, (min-width: 768px) 70vw, 100vw"
                className="aspect-[16/9] border border-[color:var(--color-slate)]/12 bg-white"
                imageClassName="object-contain bg-white p-2 md:p-4"
                expandable
                expandLabel="Expand Jira implementation artifact"
              />
            </ArtifactBlock>
          </MotionReveal>

          <MotionReveal>
            <ArtifactBlock
              title="Before & After"
              caption="The redesign simplified a dense multi-step checkout into a clearer, easier-to-scan flow."
            >
              <div className="grid gap-px bg-[color:var(--color-slate)]/14 lg:grid-cols-2">
                {beforeAfterArtifacts.map((artifact) => (
                  <figure key={artifact.label} className="bg-white">
                    <figcaption className="border-b border-[color:var(--color-slate)]/12 px-5 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[color:var(--color-orange)]">
                      {artifact.label}
                    </figcaption>
                    <MediaFrame
                      src={artifact.src}
                      alt={artifact.alt}
                      sizes="(min-width: 1280px) 620px, (min-width: 1024px) 48vw, 100vw"
                      className="aspect-[16/10] bg-[color:var(--color-background)]/84"
                      imageClassName="object-contain bg-[color:var(--color-background)]/84 p-4 object-top"
                      expandable
                      expandLabel={`Expand ${artifact.label.toLowerCase()} checkout screenshot`}
                    />
                  </figure>
                ))}
              </div>
            </ArtifactBlock>
          </MotionReveal>
        </Container>
      </section>

      <section className="bg-[#d7e8e1] py-16 md:py-24">
        <Container className="space-y-16 md:space-y-24">
          <MotionReveal>
            <section className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                  Delivery
                </p>
                <h2 className="max-w-[10ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] text-[color:var(--color-slate)] md:text-6xl">
                  Fast timeline, unusually clean release.
                </h2>
              </div>
              <div className="border-t border-[color:var(--color-slate)]/14">
                {deliveryParagraphs.map((paragraph, index) => (
                  <article
                    key={paragraph}
                    className="grid gap-4 border-b border-[color:var(--color-slate)]/14 py-6 sm:grid-cols-[3rem_minmax(0,1fr)]"
                  >
                    <span className="font-mono text-xs tracking-[0.18em] text-[color:var(--color-orange)]">
                      0{index + 1}
                    </span>
                    <p className="max-w-3xl text-base leading-7 text-[color:var(--color-slate)]/72">
                      {paragraph}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </MotionReveal>

          <MotionReveal>
            <UsabilityResultsBlock />
          </MotionReveal>
        </Container>
      </section>

      <MotionReveal>
        <section className="bg-[#1c3040] py-16 text-[color:var(--color-cream)] md:py-24">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff826d]">
                  After launch
                </p>
                <h2 className="mt-5 max-w-[9ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] md:text-6xl">
                  The redesign moved the business.
                </h2>
                <p className="mt-6 max-w-md text-base leading-7 text-[color:var(--color-cream)]/62">
                  The measurable outcomes stayed grounded in observed speed,
                  validated conversion lift, and a clean delivery outcome.
                </p>
              </div>

              <div>
                <ul className="border-t border-white/16">
                  {resultBullets.map((item, index) => (
                    <li
                      key={item}
                      className="grid gap-4 border-b border-white/16 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:items-baseline"
                    >
                      <span className="font-mono text-xs tracking-[0.18em] text-[#ff826d]">
                        0{index + 1}
                      </span>
                      <span className="font-serif text-2xl tracking-[-0.02em] text-[color:var(--color-cream)] md:text-3xl">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 max-w-3xl text-base leading-7 text-[color:var(--color-cream)]/68">
                  The annualized upside estimate came from the post-launch A/B
                  test, which gave us a grounded way to measure business impact
                  rather than relying on assumptions.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </MotionReveal>

      <section className="bg-[#e9c4b6] py-16 md:py-24">
        <Container className="space-y-16 md:space-y-24">
          <MotionReveal>
            <section className="border-b border-[color:var(--color-slate)]/14 pb-16 md:pb-24">
              <TestimonialsSection
                eyebrow="Key recommendations"
                title="How close collaborators described the work"
                description="Two partner perspectives that reinforce the same story: stronger execution quality during build led to a better outcome."
                testimonials={relatedTestimonials}
              />
            </section>
          </MotionReveal>

          <MotionReveal>
            <section className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                  Reflection
                </p>
                <h2 className="mt-5 max-w-[10ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] text-[color:var(--color-slate)] md:text-6xl">
                  What this case says about how I work.
                </h2>
              </div>
              <div className="space-y-6 border-t border-[color:var(--color-slate)]/14 pt-6">
                {entry.reflection.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-3xl text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg md:leading-8"
                  >
                    {paragraph}
                  </p>
                ))}
                <Link
                  href="/work"
                  className="group mt-4 inline-flex items-center gap-3 border-b border-[color:var(--color-slate)]/24 pb-2 text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--color-slate)] transition hover:border-[color:var(--color-orange)] hover:text-[color:var(--color-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-4"
                >
                  Explore all case studies
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </section>
          </MotionReveal>
        </Container>
      </section>
    </div>
  );
}
