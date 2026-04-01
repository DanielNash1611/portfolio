import type { Metadata } from "next";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import Container from "@/components/site/Container";
import ContentSection from "@/components/site/ContentSection";
import MediaFrame from "@/components/site/MediaFrame";
import SoundSynthesistSystemDiagram from "@/components/site/SoundSynthesistSystemDiagram";
import { SoundSeekerWidget } from "@/components/sound-seeker/SoundSeekerWidget";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import { getTestimonialsByIds } from "@/content/portfolio";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

export const metadata: Metadata = {
  title: "From AI experiments to platform foundations",
  description:
    "A strategy story about how an early customer-facing AI prototype and UX validation shaped reusable systems thinking, workflow-based adoption, and platform direction.",
};

const heroMetrics = [
  {
    label: "ORIGIN POINT",
    value: "Hackathon-winning AI concept",
  },
  {
    label: "CUSTOMER SIGNAL",
    value: "87% would use again",
  },
  {
    label: "STRATEGIC SHIFT",
    value: "From isolated wins to reusable AI thinking",
  },
];

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
    wide: true,
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

const relatedTestimonials = getTestimonialsByIds([
  "sean-richardson",
  "daniel-das",
]);
const pageContext = getPageContextByPath("/work/ai-platform-mcp");
const portfolioContext = getPortfolioContext();

function StoryHero(): JSX.Element {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-black/6 bg-white/84 px-6 py-8 shadow-[0_30px_80px_rgba(58,61,64,0.1)] md:px-8 md:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(44,79,82,0.04),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(209,122,95,0.035),_transparent_42%)]"
      />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-start">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-teal)]/70">
              Senior Product Manager, AI Platform Strategy
            </p>
            <p className="text-sm text-[color:var(--color-slate)]/58">
              Enterprise AI / Emerging Platform Work • 2024–2026
            </p>
            <h1 className="max-w-[14ch] text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-5xl">
              From AI experiments to platform foundations
            </h1>
            <p className="max-w-2xl text-pretty text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
              This work started with a customer-facing AI prototype, then grew
              into a broader point of view on how AI adoption really scales
              inside an organization.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {heroMetrics.map((metric, index) => (
              <article
                key={metric.label}
                className={`rounded-[1.35rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/88 px-4 py-4 ${
                  index === heroMetrics.length - 1 ? "sm:col-span-2" : ""
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/68">
                  {metric.label}
                </p>
                <p className="mt-2 text-[1.05rem] font-semibold leading-tight tracking-tight text-[color:var(--color-slate)] sm:text-[1.1rem]">
                  {metric.value}
                </p>
              </article>
            ))}
          </div>
        </div>

        <MediaFrame
          src="/images/sound-synthesist/product-visual.png"
          alt="Sound Synthesist product visual showing the functional custom GPT experience created for Guitar Center."
          fallbackTitle="Sound Synthesist product visual"
          sizes="(min-width: 1024px) 420px, 100vw"
          className="min-h-[280px] rounded-[1.75rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/80"
          imageClassName="object-contain bg-white p-2"
          expandable
        />
      </div>
    </section>
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
}): JSX.Element {
  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-black/6 bg-white/82">
      <MediaFrame
        src={src}
        alt={alt}
        fallbackTitle={title}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={className ?? "aspect-[16/10] border-b border-black/6"}
        imageClassName={imageClassName}
        expandable
      />
      <div className="space-y-2 p-5">
        <h3 className="text-lg font-semibold text-[color:var(--color-slate)]">
          {title}
        </h3>
        {description ? (
          <p className="text-sm leading-6 text-[color:var(--color-slate)]/68">
            {description}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default function AiPlatformMcpPage(): JSX.Element {
  return (
    <Container className="space-y-8 pt-6 pb-16">
      <StoryHero />

      {pageContext ? (
        <PortfolioGuide
          pageContext={pageContext}
          portfolioContext={portfolioContext}
        />
      ) : null}

      <ContentSection
        eyebrow="Where this started"
        title="A prototype that proved customers cared"
      >
        <div className="space-y-5">
          <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
            During a company hackathon, I led a team to design and build a
            functional AI prototype for Guitar Center customers.
          </p>
          <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
            The concept addressed a real product discovery problem and was
            envisioned as an experience that could support customers across
            ecommerce, in-store, and contact center touchpoints.
          </p>
          <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
            In a follow-up UX study, 87% of participants said they would use it
            again.
          </p>
          <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
            That result mattered more than the award. It showed that AI could
            create real customer value quickly when grounded in a clear use
            case.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <StoryImage
            src="/images/sound-synthesist/hackathon-photo.jpg"
            alt="Hackathon photo showing Daniel Nash and teammates holding the winning check at Guitar Center's ChatGPT hackathon."
            title="Hackathon winner"
            description="The original hackathon photo anchors the story in the real moment the concept gained internal traction."
            className="aspect-[5/4] border-b border-black/6 bg-[color:var(--color-background)]/80"
            imageClassName="object-cover object-center"
          />
          <StoryImage
            src="/images/sound-synthesist/product-visual.png"
            alt="Sound Synthesist concept visual showing the functional custom GPT experience."
            title="Functional custom GPT prototype"
            description="A product visual of the experience that made the functional prototype tangible beyond the original pitch."
            className="aspect-[16/11] border-b border-black/6 bg-[color:var(--color-background)]/80"
            imageClassName="object-contain bg-white p-2"
          />
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="What changed"
        title="Validation was the beginning, not the finish line"
        tone="muted"
      >
        <div className="space-y-5">
          <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
            The prototype created momentum. It also clarified something bigger:
          </p>
          <p className="text-2xl font-semibold leading-8 tracking-tight text-[color:var(--color-slate)] md:text-3xl">
            Early customer validation is not the same thing as scalable
            adoption.
          </p>
          <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
            Turning promising AI ideas into durable value requires more than a
            strong concept. It requires ownership, workflow fit, reusable
            patterns, and structural support.
          </p>
          <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
            This experience also reinforced how important focused go-to-market
            strategy is for AI products. Early launches are often strongest when
            centered on one high-value use case, paired with a refined
            interaction model and a clear adoption path.
          </p>
          <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
            That became the bridge from experimentation to platform thinking.
          </p>
        </div>
      </ContentSection>

      <section id="sound-seeker-live-demo">
        <ContentSection
          eyebrow="Supporting artifact"
          title="Sound Seeker live demo"
          description="A public-facing rebuild of the hackathon concept, included here as a working artifact inside the broader platform story."
        >
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] xl:items-start">
            <div className="space-y-4">
              <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
                To make the hackathon concept more tangible, I rebuilt the
                original idea as a public-facing prototype. The demo shows how
                an AI assistant can help musicians move from a tonal reference
                to a concrete rig and signal chain, while making the
                interaction pattern visible to others exploring what these
                systems could become.
              </p>
              <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
                In this context, the demo serves as a working artifact of the
                concept that helped spark broader thinking around platform
                potential.
              </p>
              <div className="rounded-[1.25rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/88 px-4 py-4 text-sm leading-6 text-[color:var(--color-slate)]/68">
                This is a public-safe rebuild of the interaction pattern, not
                the original internal implementation.
              </div>
            </div>

            <SoundSeekerWidget />
          </div>
        </ContentSection>
      </section>

      <ContentSection
        eyebrow="Platform lens"
        title="The ideas that shaped my approach"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {platformCards.map((card) => (
            <article
              key={card.label}
              className={`rounded-[1.35rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/88 px-5 py-5 ${
                card.wide ? "sm:col-span-2" : ""
              }`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/68">
                {card.label}
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--color-slate)]">
                {card.body}
              </p>
              <p className="mt-3 max-w-[52ch] text-sm leading-6 text-[color:var(--color-slate)]/68">
                {card.supportingText}
              </p>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Customer validation"
        title="Users wanted it back"
        tone="muted"
      >
        <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
          A follow-up UX study showed strong reuse intent and positive
          sentiment, reinforcing that the concept solved a meaningful customer
          problem.
        </p>

        <StoryImage
          src="/images/sound-synthesist/ux-validation.png"
          alt="UX validation visual showing user research feedback and the 87 percent would-use-again result."
          title="UX validation results"
          description="The strongest signal was not just positive sentiment, but clear evidence that musicians wanted to use the experience again."
          className="aspect-[3/2] border-b border-black/6 bg-[color:var(--color-background)]/80"
          imageClassName="object-contain bg-white p-2"
        />
      </ContentSection>

      <ContentSection
        eyebrow="Omnichannel concept"
        title="How the experience could extend across channels"
      >
        <div className="space-y-5">
          <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
            Based on the validated prototype, I explored how a unified AI
            experience could extend across Guitar Center touchpoints.
          </p>
          <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
            These visuals represent conceptual experience designs grounded in
            the prototype&rsquo;s behavior and capabilities. They show product
            direction and experience exploration, not final production
            implementation.
          </p>
        </div>

        <StoryImage
          src="/images/sound-synthesist/omnichannel-concepts.png"
          alt="Concept visual showing how the Sound Synthesist experience could extend across ecommerce, in-store, and contact center touchpoints."
          title="Conceptual omnichannel extension"
          description="Conceptual experience designs grounded in the prototype's behavior and capabilities, not final production implementation."
          className="aspect-[3/2] border-b border-black/6 bg-[color:var(--color-background)]/80"
          imageClassName="object-contain bg-white p-2"
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {omnichannelCaptions.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.25rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/88 px-4 py-4"
            >
              <h3 className="text-base font-semibold text-[color:var(--color-slate)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/68">
                {item.caption}
              </p>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="System design"
        title="One recommendation engine, multiple touchpoints"
        tone="muted"
      >
        <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
          The prototype validated value in a single interface. From there, I
          explored how the same AI layer could support product discovery across
          ecommerce, in-store, and contact center workflows.
        </p>

        <SoundSynthesistSystemDiagram />
      </ContentSection>

      <ContentSection eyebrow="Influence" title="What the work helped shape">
        <div className="space-y-5">
          <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
            The concept generated strong internal interest and contributed to
            broader thinking around AI-enabled customer experiences.
          </p>
          <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
            While I did not own the final implementation path, the work
            sharpened my view of what it takes to move from early momentum to
            durable organizational value.
          </p>
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Key learnings"
        title="What stayed with me"
        tone="muted"
      >
        <ul className="grid gap-3">
          {learnings.map((item) => (
            <li
              key={item}
              className="rounded-[1.15rem] border border-[color:var(--color-teal)]/10 bg-white/78 px-4 py-4 text-base leading-7 text-[color:var(--color-slate)]/74"
            >
              {item}
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection
        eyebrow="Why it matters"
        title="The foundation of my AI platform thinking"
      >
        <p className="max-w-3xl text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
          This experience shaped how I approach AI product work today: solve a
          real problem, validate quickly, and design the surrounding system so
          early value can become something repeatable and durable.
        </p>
      </ContentSection>

      <TestimonialsSection
        eyebrow="Recommendations"
        title="How collaborators described this work"
        description="Two adjacent perspectives that reinforce the same pattern: translating early AI momentum into practical systems, stronger guardrails, and credible cross-functional execution."
        testimonials={relatedTestimonials}
      />
    </Container>
  );
}
