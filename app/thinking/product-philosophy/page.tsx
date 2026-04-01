import type { Metadata } from "next";
import clsx from "clsx";
import { notFound } from "next/navigation";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import CTASection from "@/components/site/CTASection";
import Container from "@/components/site/Container";
import EssayEvidenceFigure from "@/components/site/EssayEvidenceFigure";
import MotionReveal from "@/components/site/MotionReveal";
import { getThinkingEntry } from "@/content/portfolio";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

const entry = getThinkingEntry("product-philosophy");
const pageContext = getPageContextByPath("/thinking/product-philosophy");
const portfolioContext = getPortfolioContext();

type SectionBlock =
  | {
      type: "paragraph";
      text: string;
      emphasis?: boolean;
    }
  | {
      type: "list";
      items: string[];
    };

type EssaySection = {
  title: string;
  blocks: SectionBlock[];
  tone?: "default" | "closing";
  artifact?: {
    eyebrow?: string;
    src: string;
    alt: string;
    width?: "hero" | "wide" | "support" | "compact";
    aspectClassName?: string;
    imageClassName?: string;
    priority?: boolean;
    caption?: string;
  };
};

const introParagraphs = [
  "I don’t think product leadership is primarily about roadmap judgment.",
  "It’s about designing how decisions get made—how ideas are shaped, how tradeoffs are evaluated, and how teams connect their work to outcomes.",
  "In most organizations, these systems are implicit, inconsistent, and highly dependent on individuals. That creates friction, misalignment, and uneven product quality.",
];

const essaySections: EssaySection[] = [
  {
    title: "When the system is missing",
    blocks: [
      {
        type: "paragraph",
        text: "When there is no shared operating model:",
      },
      {
        type: "list",
        items: [
          "Prioritization becomes subjective and difficult to compare across teams",
          "Planning disconnects from execution reality",
          "Work is visible in fragments, but not as a coherent system",
          "Product quality depends more on individual PM skill than team capability",
        ],
      },
      {
        type: "paragraph",
        text: "These are not just execution issues—they are product problems.",
      },
    ],
  },
  {
    title: "The operating model is part of the product",
    blocks: [
      {
        type: "paragraph",
        text: "I believe the team’s operating model is part of the product outcome.",
      },
      {
        type: "paragraph",
        text: "Strong product teams don’t just build features—they build systems that make good decisions repeatable.",
      },
      {
        type: "paragraph",
        text: "That means creating shared structures for:",
      },
      {
        type: "list",
        items: [
          "how ideas enter the system",
          "how they are evaluated",
          "how work is planned and delivered",
          "how impact is measured",
        ],
      },
    ],
  },
  {
    title: "Making the system visible",
    blocks: [
      {
        type: "paragraph",
        text: "In practice, this meant designing and standardizing a product operating model across the team.",
      },
      {
        type: "paragraph",
        text: "The goal was not to add process, but to make decision-making clearer, more comparable, and easier to scale.",
      },
    ],
  },
  {
    title: "A system that connects ideas to impact",
    blocks: [
      {
        type: "paragraph",
        text: "We defined a consistent lifecycle for every initiative—from early signals and problem definition through discovery, delivery, and impact measurement.",
      },
      {
        type: "paragraph",
        text: "This created a shared language across product, engineering, and stakeholders, and made it clear how any piece of work connected to outcomes.",
      },
    ],
    artifact: {
      eyebrow: "Operating model",
      src: "/images/thinking/product-leadership-systems-design/product-lifecycle.png",
      alt: "Product lifecycle diagram showing work moving from parking lot and discovery through prepare for delivery, delivery, impact, and done.",
      width: "hero",
      aspectClassName: "aspect-[1676/962]",
      imageClassName: "object-contain bg-white p-3 md:p-6",
      priority: true,
    },
  },
  {
    title: "Making decisions comparable across teams",
    blocks: [
      {
        type: "paragraph",
        text: "One of the core challenges was inconsistent prioritization. Different teams evaluated work differently, making tradeoffs difficult.",
      },
      {
        type: "paragraph",
        text: "We standardized a lightweight scoring model using RICE, paired with “napkin math” estimates grounded in available data. This allowed teams to compare opportunities on a shared scale and made prioritization discussions faster and more objective.",
      },
    ],
    artifact: {
      eyebrow: "Prioritization",
      src: "/images/thinking/product-leadership-systems-design/rice-definition.png",
      alt: "RICE scoring worksheet defining opportunity, reach, impact, confidence, effort, and RICE score.",
      width: "compact",
      aspectClassName: "aspect-[1086/596]",
      imageClassName: "object-contain bg-white p-3 md:p-5",
    },
  },
  {
    title: "Making work visible and reviewable",
    blocks: [
      {
        type: "paragraph",
        text: "We introduced a consistent product review cadence to connect strategy, execution, and outcomes.",
      },
      {
        type: "paragraph",
        text: "Teams regularly reviewed work across three states: what’s happening now, what’s coming next, and what impact has been delivered. This created alignment without heavy process and ensured that progress, risks, and results were visible across the organization.",
      },
    ],
    artifact: {
      eyebrow: "Review cadence",
      src: "/images/thinking/product-leadership-systems-design/product-review-format.png",
      alt: "Product review diagram showing a biweekly cadence across happening now, coming soon, measuring impact, and opportunity prioritization.",
      width: "support",
      aspectClassName: "aspect-[1680/712]",
      imageClassName: "object-contain bg-white p-3 md:p-6",
    },
  },
  {
    title: "Connecting planning to execution",
    blocks: [
      {
        type: "paragraph",
        text: "At the team level, we aligned sprint planning and execution with the broader operating model.",
      },
      {
        type: "paragraph",
        text: "Clear constraints on work in progress and a consistent sprint structure helped teams focus on delivering outcomes, not just managing backlog volume.",
      },
    ],
    artifact: {
      eyebrow: "Execution rhythm",
      src: "/images/thinking/product-leadership-systems-design/sprinting-guidelines.png",
      alt: "Sprint planning flow showing development backlog, planning, sprint backlog, development, review, and retrospective within a two-week loop.",
      width: "support",
      aspectClassName: "aspect-[1560/732]",
      imageClassName: "object-contain bg-white p-3 md:p-6",
    },
  },
  {
    title: "Planning across time horizons",
    blocks: [
      {
        type: "paragraph",
        text: "We standardized roadmap communication using a Now / Next / Later framework.",
      },
      {
        type: "paragraph",
        text: "This allowed teams to balance short-term delivery with longer-term strategy, while also making uncertainty explicit. Stakeholders could understand what was committed, what was being explored, and what was intentionally deprioritized.",
      },
    ],
    artifact: {
      eyebrow: "Roadmap language",
      src: "/images/thinking/product-leadership-systems-design/now-next-later-roadmapping.png",
      alt: "Now, Next, Later roadmap visual showing planning horizons and certainty decreasing over time.",
      width: "support",
      aspectClassName: "aspect-[1142/946]",
      imageClassName: "object-contain bg-white p-3 md:p-6",
    },
  },
  {
    title: "Scaling the system with AI-assisted workflows",
    blocks: [
      {
        type: "paragraph",
        text: "To reduce friction and improve consistency, we embedded AI-assisted workflows across the lifecycle.",
      },
      {
        type: "paragraph",
        text: "Custom GPTs supported idea generation, opportunity framing, ROI estimation, and PRD creation—ensuring that every initiative started with a consistent level of clarity and structure.",
      },
      {
        type: "paragraph",
        text: "This allowed teams to spend less time formatting work and more time evaluating and executing it.",
      },
    ],
  },
  {
    title: "Not all product work is the same",
    blocks: [
      {
        type: "paragraph",
        text: "One challenge we encountered was that all product work was implicitly evaluated as if it were consumer product work.",
      },
      {
        type: "paragraph",
        text: "This created misalignment—platform, data, and operational products were often measured against the wrong expectations, leading to unfair comparisons and poor prioritization decisions.",
      },
      {
        type: "paragraph",
        text: "To address this, we introduced a framework to clarify different product types, their metrics, time horizons, and dependencies.",
      },
      {
        type: "paragraph",
        text: "While this approach resonated strongly with product teams, it did not ultimately gain executive adoption.",
      },
      {
        type: "paragraph",
        text: "Even so, it highlighted an important gap: without shared understanding of product types, organizations struggle to evaluate work consistently.",
      },
    ],
    artifact: {
      eyebrow: "Product types",
      src: "/images/thinking/product-leadership-systems-design/product-types-chart.png",
      alt: "Product types chart comparing consumer, platform, growth, data, AI, and trust and safety product work across metrics, time horizons, and dependencies.",
      width: "wide",
      aspectClassName: "aspect-[1470/920]",
      imageClassName: "object-contain bg-white p-3 md:p-6",
    },
  },
  {
    title: "What this changed",
    tone: "closing",
    blocks: [
      {
        type: "paragraph",
        text: "This work improved more than execution—it improved how decisions were made across the organization.",
      },
      {
        type: "paragraph",
        text: "Teams were able to:",
      },
      {
        type: "list",
        items: [
          "Prioritize work on a shared, comparable scale",
          "Align more effectively across product, engineering, and stakeholders",
          "Connect delivery to measurable impact",
        ],
      },
      {
        type: "paragraph",
        text: "More importantly, it made the operating model visible—so it could be improved intentionally, rather than emerging by accident.",
      },
      {
        type: "paragraph",
        text: "That is the core of how I think about product leadership.",
        emphasis: true,
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "Product leadership is systems design",
  description:
    "Daniel Nash on why the operating model is part of the product outcome, and how that belief became a practical system for prioritization, planning, and delivery.",
};

function renderBlock(block: SectionBlock): JSX.Element {
  if (block.type === "list") {
    return (
      <ul className="space-y-4 pt-1">
        {block.items.map((item) => (
          <li
            key={item}
            className="flex gap-4 text-base leading-7 text-[color:var(--color-slate)]/74 md:text-lg"
          >
            <span
              aria-hidden="true"
              className="mt-3 h-1.5 w-1.5 rounded-full bg-[color:var(--color-orange)]"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p
      className={clsx(
        "text-base leading-7 text-[color:var(--color-slate)]/74 md:text-lg md:leading-8",
        block.emphasis
          ? "pt-2 text-xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-[1.9rem] md:leading-[1.3]"
          : "",
      )}
    >
      {block.text}
    </p>
  );
}

export default function ProductPhilosophyPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <Container className="space-y-10 pt-6 md:space-y-12">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-black/6 bg-white/86 px-6 py-9 shadow-[0_30px_80px_rgba(58,61,64,0.1)] md:px-10 md:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(44,79,82,0.05),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(209,122,95,0.045),_transparent_36%)]"
        />
        <div className="relative max-w-[50rem] space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-teal)]/70">
              {entry.eyebrow}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/62">
              <span>{entry.readTime}</span>
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-[color:var(--color-orange)]"
              />
              <span>Essay with evidence</span>
            </div>
            <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-6xl">
              Product leadership is systems design
            </h1>
          </div>

          <div className="space-y-5">
            {introParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-7 text-[color:var(--color-slate)]/74 md:text-lg md:leading-8"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded-full border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/92 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/74"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {pageContext ? (
        <PortfolioGuide
          pageContext={pageContext}
          portfolioContext={portfolioContext}
        />
      ) : null}

      <div className="space-y-14 md:space-y-16">
        {essaySections.map((section, index) => (
          <MotionReveal
            key={section.title}
            delay={Math.min(index * 0.04, 0.24)}
          >
            <article
              className={clsx(
                section.tone === "closing"
                  ? "rounded-[2.2rem] border border-[color:var(--color-teal)]/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(242,227,213,0.76))] px-6 py-8 shadow-[0_24px_60px_rgba(58,61,64,0.08)] md:px-8 md:py-10"
                  : "border-t border-black/7 pt-10 md:pt-14",
              )}
            >
              <div className="mx-auto max-w-[46rem] space-y-5">
                <h2 className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-5xl">
                  {section.title}
                </h2>
                {section.blocks.map((block) =>
                  block.type === "paragraph" ? (
                    <div key={block.text}>{renderBlock(block)}</div>
                  ) : (
                    <div key={block.items.join("|")}>{renderBlock(block)}</div>
                  ),
                )}
              </div>

              {section.artifact ? (
                <div className="mt-10 md:mt-12">
                  <EssayEvidenceFigure
                    eyebrow={section.artifact.eyebrow}
                    caption={section.artifact.caption}
                    src={section.artifact.src}
                    alt={section.artifact.alt}
                    width={section.artifact.width}
                    aspectClassName={section.artifact.aspectClassName}
                    imageClassName={section.artifact.imageClassName}
                    priority={section.artifact.priority}
                  />
                </div>
              ) : null}
            </article>
          </MotionReveal>
        ))}
      </div>

      <CTASection
        title="If this point of view feels aligned, let's talk."
        description="The essay is here to show how I think about product leadership in practice, not just in principle. Happy to go deeper on the operating model, the tradeoffs, or how this translated into day-to-day work."
        primaryAction={{
          href: "https://www.linkedin.com/in/daniel-a-nash/",
          label: "Connect on LinkedIn",
          external: true,
        }}
        secondaryAction={{
          href: "/work",
          label: "See the work",
        }}
      />
    </Container>
  );
}
