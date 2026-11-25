import PlatformFlagship from "@/components/overnight-cases/PlatformFlagship";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import Container from "@/components/site/Container";
import MediaFrame from "@/components/site/MediaFrame";
import MotionReveal from "@/components/site/MotionReveal";
import SoundSynthesistSystemDiagram from "@/components/site/SoundSynthesistSystemDiagram";
import { SoundSeekerWidget } from "@/components/sound-seeker/SoundSeekerWidget";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import { getSelectedRecommendation } from "@/content/recommendations";
import { getTestimonialsByIds } from "@/data/testimonials";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

export const metadata: Metadata = {
  title: "From AI experiments to platform foundations",
  description:
    "A strategy story about how an early customer-facing AI prototype and UX validation shaped reusable systems thinking, workflow-based adoption, and platform direction.",
};

const platformCards = [
  {
    label: "Platform focus",
    body: "Reusable AI systems",
    supportingText:
      "I became focused on what should be reusable across use cases, not just what worked once.",
  },
  {
    label: "Adoption pattern",
    body: "Workflow-based adoption",
    supportingText:
      "The best AI opportunities fit naturally into how customers and employees already move through work.",
  },
  {
    label: "Execution style",
    body: "Platform-led iteration",
    supportingText:
      "Start with a real problem, validate quickly, identify reusable patterns, and use them to shape a stronger foundation.",
  },
];

const omnichannelCaptions = [
  {
    title: "Concept: Ecommerce",
    caption:
      "A conversational layer embedded into the digital journey to help customers find the right products more naturally.",
  },
  {
    title: "Concept: In-store",
    caption:
      "An assisted experience that could help store teams guide customers with more consistency and speed.",
  },
  {
    title: "Concept: Contact center",
    caption:
      "An AI-supported interaction model to help agents understand customer intent and respond with tailored guidance.",
  },
];

const learnings = [
  "Real customer value can be validated early",
  "Fast validation does not guarantee scale",
  "AI is strongest when tied to real workflows",
  "Go-to-market focus matters as much as model capability",
  "Reusable patterns matter more than one-off novelty",
  "Strong ideas need the right system around them to last",
];

const daniel = getSelectedRecommendation("daniel-das");
const relatedTestimonials = [
  ...getTestimonialsByIds(["sean-richardson"]),
  daniel.testimonial,
];
const pageContext = getPageContextByPath("/work/ai-platform-mcp");
const portfolioContext = getPortfolioContext();

function SectionLead({
  eyebrow,
  title,
  children,
  invert = false,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  invert?: boolean;
}): React.JSX.Element {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
      <div>
        <p
          className={`text-[11px] font-bold uppercase tracking-[0.28em] ${
            invert
              ? "text-[color:var(--color-tan)]"
              : "text-[color:var(--color-orange)]"
          }`}
        >
          {eyebrow}
        </p>
        <h2
          className={`mt-5 max-w-[12ch] text-balance text-4xl font-medium leading-[0.96] tracking-[-0.04em] md:text-6xl ${
            invert
              ? "text-[color:var(--color-cream)]"
              : "text-[color:var(--color-slate)]"
          }`}
        >
          {title}
        </h2>
      </div>
      {children ? <div className="space-y-5 lg:pt-8">{children}</div> : null}
    </div>
  );
}

function StoryImage({
  src,
  alt,
  title,
  description,
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  title: string;
  description?: string;
  className?: string;
  imageClassName?: string;
}): React.JSX.Element {
  return (
    <figure className="group">
      <MediaFrame
        src={src}
        alt={alt}
        fallbackTitle={title}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={
          className ??
          "aspect-[16/10] border border-[color:var(--color-slate)]/14 bg-white"
        }
        imageClassName={`transition duration-700 group-hover:scale-[1.012] ${
          imageClassName ?? ""
        }`}
        expandable
      />
      <figcaption className="grid gap-2 border-b border-[color:var(--color-slate)]/14 py-4 sm:grid-cols-[minmax(150px,0.45fr)_minmax(0,1fr)] sm:gap-8">
        <h3 className="text-lg font-medium tracking-[-0.02em] text-[color:var(--color-slate)]">
          {title}
        </h3>
        {description ? (
          <p className="text-sm leading-6 text-[color:var(--color-slate)]/62">
            {description}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}

export default function AiPlatformMcpPage(): React.JSX.Element {
  return (
    <PlatformFlagship
      guide={
        pageContext ? (
          <PortfolioGuide
            pageContext={pageContext}
            portfolioContext={portfolioContext}
          />
        ) : null
      }
      demo={
        <section
          id="sound-seeker-live-demo"
          className="scroll-mt-24 bg-[#edc7b7] py-16 md:py-24"
        >
          <Container>
            <MotionReveal>
              <SectionLead
                eyebrow="Supporting artifact"
                title="Sound Seeker live demo"
              >
                <p className="text-xl leading-8 text-[color:var(--color-slate)]/82 md:text-2xl md:leading-9">
                  A public-facing rebuild of the hackathon concept, included
                  here as a working artifact inside the broader platform story.
                </p>
              </SectionLead>
            </MotionReveal>

            <div className="mt-14 grid gap-10 xl:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] xl:items-start xl:gap-16">
              <MotionReveal>
                <div className="space-y-5 text-base leading-7 text-[color:var(--color-slate)]/70">
                  <p>
                    To make the hackathon concept more tangible, I rebuilt the
                    original idea as a public-facing prototype. The demo shows
                    how an AI assistant can help musicians move from a tonal
                    reference to a concrete rig and signal chain, while making
                    the interaction pattern visible to others exploring what
                    these systems could become.
                  </p>
                  <p>
                    In this context, the demo serves as a working artifact of
                    the concept that helped spark broader thinking around
                    platform potential.
                  </p>
                  <p className="border-y border-[color:var(--color-slate)]/16 py-4 text-sm leading-6 text-[color:var(--color-slate)]/62">
                    This is a public-safe rebuild of the interaction pattern,
                    not the original internal implementation.
                  </p>
                </div>
              </MotionReveal>

              <MotionReveal delay={0.08}>
                <SoundSeekerWidget />
              </MotionReveal>
            </div>
          </Container>
        </section>
      }
    >
      {/* A native fragment may open this uncontrolled detail before hydration. */}
      <details className="pff-record" suppressHydrationWarning>
        <summary>The complete prototype and platform-learning case</summary>
        <p className="pff-record-intro">
          The full narrative, original photograph, published explanatory
          visuals, conceptual system map, lessons and collaborator
          recommendations remain below. The original finalist pitch pages in the
          main sequence are separate source artifacts. I did not own the final
          implementation path; these materials do not establish a deployed MCP
          platform.
        </p>
        <div className="pff-record-body">
          <section
            id="origin"
            className="scroll-mt-24 bg-[#ead7a7] py-16 md:py-24"
          >
            <Container>
              <MotionReveal>
                <SectionLead
                  eyebrow="Where this started"
                  title="A functional prototype and an early customer signal"
                >
                  <p className="text-xl leading-8 text-[color:var(--color-slate)]/84 md:text-2xl md:leading-9">
                    During a company hackathon, I led a team to design and build
                    a functional AI prototype for Guitar Center customers.
                  </p>
                  <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
                    The concept addressed a real product discovery problem and
                    was envisioned as an experience that could support customers
                    across ecommerce, in-store, and contact center touchpoints.
                  </p>
                  <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
                    In a follow-up UX study, 87% of participants said they would
                    use it again.
                  </p>
                  <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
                    That result mattered more than the award. It showed that AI
                    could create real customer value quickly when grounded in a
                    clear use case.
                  </p>
                </SectionLead>
              </MotionReveal>

              <MotionReveal delay={0.08}>
                <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                  <StoryImage
                    src="/images/sound-synthesist/hackathon-photo.jpg"
                    alt="Hackathon photo showing Daniel Nash and teammates holding the winning check at Guitar Center's ChatGPT hackathon."
                    title="Hackathon winner"
                    description="The original hackathon photograph preserves the team context behind the winning concept."
                    className="aspect-square border border-[color:var(--color-slate)]/14 bg-[color:var(--color-background-soft)]"
                    imageClassName="object-cover object-center"
                  />
                  <StoryImage
                    src="/images/sound-synthesist/product-visual.png"
                    alt="Sound Synthesist concept visual showing the functional custom GPT experience."
                    title="Functional custom GPT prototype"
                    description="Published product illustration of the custom-GPT experience. The original pitch pages are available in the main evidence sequence above."
                    className="aspect-square border border-[color:var(--color-slate)]/14 bg-white"
                    imageClassName="object-contain bg-white p-3"
                  />
                </div>
              </MotionReveal>
            </Container>
          </section>

          <section
            id="platform-validation"
            className="bg-[#d7e8df] py-16 md:py-24"
          >
            <Container>
              <MotionReveal>
                <SectionLead
                  eyebrow="What changed"
                  title="Validation was the beginning, not the finish line"
                >
                  <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
                    The prototype created momentum. It also clarified something
                    bigger:
                  </p>
                  <p className="border-l-2 border-[color:var(--color-orange)] pl-6 font-serif text-3xl leading-[1.04] tracking-[-0.035em] text-[color:var(--color-slate)] md:text-5xl">
                    Early customer validation is not the same thing as scalable
                    adoption.
                  </p>
                  <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
                    Turning promising AI ideas into durable value requires more
                    than a strong concept. It requires ownership, workflow fit,
                    reusable patterns, and structural support.
                  </p>
                  <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
                    This experience also reinforced how important focused
                    go-to-market strategy is for AI products. Early launches are
                    often strongest when centered on one high-value use case,
                    paired with a refined interaction model and a clear adoption
                    path.
                  </p>
                  <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
                    That became the bridge from experimentation to platform
                    thinking.
                  </p>
                </SectionLead>
              </MotionReveal>
            </Container>
          </section>

          <section
            id="platform-direction"
            className="oc-dark bg-[#173f3d] py-16 text-[color:var(--color-cream)] md:py-24"
          >
            <Container>
              <MotionReveal>
                <SectionLead
                  eyebrow="Platform lens"
                  title="The ideas that shaped my approach"
                  invert
                />
              </MotionReveal>

              <MotionReveal delay={0.08}>
                <div className="mt-14 border-t border-white/16">
                  {platformCards.map((item, index) => (
                    <article
                      key={item.label}
                      className="grid gap-4 border-b border-white/16 py-7 md:grid-cols-[3rem_minmax(180px,0.52fr)_minmax(0,1fr)] md:gap-8"
                    >
                      <span className="font-mono text-xs tracking-[0.18em] text-[color:var(--color-tan)]">
                        0{index + 1}
                      </span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--color-cream)]/46">
                          {item.label}
                        </p>
                        <h3 className="mt-2 text-2xl font-medium tracking-[-0.03em]">
                          {item.body}
                        </h3>
                      </div>
                      <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-cream)]/62">
                        {item.supportingText}
                      </p>
                    </article>
                  ))}
                </div>
              </MotionReveal>
            </Container>
          </section>

          <section className="bg-[#d8e5ed] py-16 md:py-24">
            <Container>
              <MotionReveal>
                <SectionLead
                  eyebrow="Customer validation"
                  title="Users wanted it back"
                >
                  <p className="text-xl leading-8 text-[color:var(--color-slate)]/82 md:text-2xl md:leading-9">
                    A follow-up UX study showed strong reuse intent and positive
                    sentiment, reinforcing that the concept solved a meaningful
                    customer problem.
                  </p>
                </SectionLead>
              </MotionReveal>

              <MotionReveal delay={0.08} className="mt-14">
                <StoryImage
                  src="/images/sound-synthesist/ux-validation.png"
                  alt="UX validation visual showing user research feedback and the 87 percent would-use-again result."
                  title="UX validation results"
                  description="Published summary of reported reuse intent; the supplied exhibit does not include the sample size, questionnaire, or study dates. It does not establish observed retention or production adoption."
                  className="aspect-[3/2] border border-[color:var(--color-slate)]/14 bg-white"
                  imageClassName="object-contain bg-white p-2"
                />
              </MotionReveal>
            </Container>
          </section>

          <section className="bg-[#ecd9ac] py-16 md:py-24">
            <Container>
              <MotionReveal>
                <SectionLead
                  eyebrow="Omnichannel concept"
                  title="How the experience could extend across channels"
                >
                  <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
                    Based on the validated prototype, I explored how a unified
                    AI experience could extend across Guitar Center touchpoints.
                  </p>
                  <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
                    These visuals represent conceptual experience designs
                    grounded in the prototype&rsquo;s behavior and capabilities.
                    They show product direction and experience exploration, not
                    final production implementation.
                  </p>
                </SectionLead>
              </MotionReveal>

              <MotionReveal delay={0.08} className="mt-14">
                <StoryImage
                  src="/images/sound-synthesist/omnichannel-concepts.png"
                  alt="Concept visual showing how the Sound Synthesist experience could extend across ecommerce, in-store, and contact center touchpoints."
                  title="Conceptual omnichannel extension"
                  description="Conceptual experience designs grounded in the prototype's behavior and capabilities, not final production implementation."
                  className="aspect-[3/2] border border-[color:var(--color-slate)]/14 bg-white"
                  imageClassName="object-contain bg-white p-2"
                />
              </MotionReveal>

              <MotionReveal delay={0.12}>
                <div className="mt-10 border-t border-[color:var(--color-slate)]/16">
                  {omnichannelCaptions.map((item, index) => (
                    <article
                      key={item.title}
                      className="grid gap-3 border-b border-[color:var(--color-slate)]/16 py-6 sm:grid-cols-[3rem_minmax(170px,0.48fr)_minmax(0,1fr)] sm:gap-7"
                    >
                      <span className="font-mono text-xs tracking-[0.16em] text-[color:var(--color-orange)]">
                        0{index + 1}
                      </span>
                      <h3 className="text-xl font-medium tracking-[-0.02em] text-[color:var(--color-slate)]">
                        {item.title}
                      </h3>
                      <p className="max-w-xl text-sm leading-6 text-[color:var(--color-slate)]/64">
                        {item.caption}
                      </p>
                    </article>
                  ))}
                </div>
              </MotionReveal>
            </Container>
          </section>

          <section
            id="platform-learning"
            className="bg-[#d7e8df] py-16 md:py-24"
          >
            <Container>
              <MotionReveal>
                <SectionLead
                  eyebrow="System design"
                  title="One recommendation engine, multiple touchpoints"
                >
                  <p className="text-xl leading-8 text-[color:var(--color-slate)]/82 md:text-2xl md:leading-9">
                    The prototype validated value in a single interface. From
                    there, I explored how the same AI layer could support
                    product discovery across ecommerce, in-store, and contact
                    center workflows.
                  </p>
                </SectionLead>
              </MotionReveal>
              <MotionReveal delay={0.08} className="mt-14">
                <p className="mb-6 text-sm leading-7">
                  Conceptual system map, retained from the published case. Its
                  channel, context and integration labels describe exploration,
                  not verified deployed APIs or a production MCP platform.
                </p>
                <SoundSynthesistSystemDiagram />
              </MotionReveal>
            </Container>
          </section>

          <section className="bg-[#ecc5b7] py-16 md:py-24">
            <Container>
              <MotionReveal>
                <div className="grid gap-12 border-b border-[color:var(--color-slate)]/16 pb-16 md:pb-24 lg:grid-cols-2 lg:gap-20">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                      Influence
                    </p>
                    <h2 className="mt-5 max-w-[12ch] text-balance text-4xl font-medium leading-[0.96] tracking-[-0.04em] md:text-5xl">
                      What the work helped shape
                    </h2>
                    <div className="mt-8 space-y-5 text-base leading-7 text-[color:var(--color-slate)]/70">
                      <p>
                        The concept generated strong internal interest and
                        contributed to broader thinking around AI-enabled
                        customer experiences.
                      </p>
                      <p>
                        While I did not own the final implementation path, the
                        work sharpened my view of what it takes to move from
                        early momentum to durable organizational value.
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                      Key learnings
                    </p>
                    <h2 className="mt-5 text-balance text-4xl font-medium leading-[0.96] tracking-[-0.04em] md:text-5xl">
                      What stayed with me
                    </h2>
                    <ol className="mt-8 border-t border-[color:var(--color-slate)]/16">
                      {learnings.map((item, index) => (
                        <li
                          key={item}
                          className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-b border-[color:var(--color-slate)]/16 py-4 text-base leading-7 text-[color:var(--color-slate)]/76"
                        >
                          <span className="font-mono text-xs tracking-[0.14em] text-[color:var(--color-orange)]">
                            0{index + 1}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </MotionReveal>

              <MotionReveal>
                <section className="grid gap-8 py-16 md:py-24 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                      Why it matters
                    </p>
                    <h2 className="mt-5 max-w-[12ch] text-balance text-4xl font-medium leading-[0.96] tracking-[-0.04em] md:text-6xl">
                      The foundation of my AI platform thinking
                    </h2>
                  </div>
                  <p className="max-w-3xl self-end text-pretty text-xl leading-8 text-[color:var(--color-slate)]/82 md:text-2xl md:leading-9">
                    This experience shaped how I approach AI product work today:
                    solve a real problem, validate quickly, and design the
                    surrounding system so early value can become something
                    repeatable and durable.
                  </p>
                </section>
              </MotionReveal>

              <MotionReveal>
                <TestimonialsSection
                  eyebrow="Recommendations"
                  title="How collaborators described this work"
                  description="Two adjacent perspectives that reinforce the same pattern: translating early AI momentum into practical systems, stronger guardrails, and credible cross-functional execution."
                  testimonials={relatedTestimonials}
                  footerLink={{
                    href: daniel.href,
                    label: "View Daniel Kingston’s recommendation",
                  }}
                />
              </MotionReveal>
            </Container>
          </section>
        </div>
      </details>
    </PlatformFlagship>
  );
}
