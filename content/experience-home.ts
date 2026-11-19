import {
  homeContent,
  getWorkEntry,
  getProductEntry,
  getThinkingEntry,
  creativeEntries,
} from "./portfolio";
import { testimonials } from "@/data/testimonials";
import { getExperienceOutcomes } from "./experience-outcomes";
import { experienceToolkit } from "./experience-toolkit";
import { getExperienceLeadershipCases } from "./experience-leadership";
import { omsLeadershipSummary } from "./projects/oms-delivery";

const recommendationGroups = [
  {
    label: "Leadership & strategy",
    ids: ["don-worsham", "zac-bogart", "sumanth-cherukuri", "david-lawrence"],
  },
  {
    label: "Engineering & security",
    ids: [
      "daniel-das",
      "domnic-nadar",
      "sean-richardson",
      "christopher-pruneau",
    ],
  },
  {
    label: "Product & design",
    ids: ["matt-winick", "ian-booth", "colin-greene"],
  },
  {
    label: "Business & insights",
    ids: ["colleen-ashmore", "scott-tesar", "cassie-dean"],
  },
  { label: "Creative collaboration", ids: ["derek-peterson"] },
] as const;

// Editorial excerpts for this preview; project facts and qualifications remain
// in the linked public case studies and the metric details below.
const workStories: Record<
  string,
  { title: string; focus: string; description: string }
> = {
  "ai-platform-mcp": {
    title: "AI platform direction",
    focus: "Set the platform direction",
    description:
      "I used prototype and UX evidence to shape a direction for reusable connectors, permissions, and review steps.",
  },
  "checkout-redesign": {
    title: "Checkout redesign",
    focus: "Give delivery teams the context",
    description:
      "I paired context-rich product writing with continued design involvement, keeping implementation decisions connected to the customer intent.",
  },
};

const productDecisions: Record<string, string> = {
  "oms-chatgpt-app": omsLeadershipSummary,
  "ai-career-operating-system":
    "I built the evidence and review workflow so tailored claims stay inspectable and final approval remains human.",
  "immunology-scout":
    "I built formal evals with a scientific collaborator, turning expert feedback into checks for useful, trustworthy outputs.",
};

/** A compact public projection of the same content used by the current homepage. */
export function getExperienceHomeContent(presentation: "home" | "preview" = "preview") {
  return {
    hero: homeContent.hero,
    outcomes: getExperienceOutcomes(presentation),
    toolkit: experienceToolkit,
    metrics: homeContent.metrics,
    positioning: homeContent.positioning,
    work: getExperienceLeadershipCases(presentation),
    supportingWork: homeContent.featuredWork
      .filter((slug) => slug !== "chatgpt-enterprise")
      .map((slug) => {
        const entry = getWorkEntry(slug)!;
        const story = workStories[slug];
        return {
          slug,
          href: entry.href,
          action: "Read the case study",
          previewLabel: `Preview ${story?.title ?? entry.title}`,
          title: story?.title ?? entry.title,
          description: story?.description ?? entry.description,
          eyebrow: story?.focus ?? entry.eyebrow,
          image: entry.heroImage,
          alt: entry.heroImageAlt,
          // Outcome cards already carry revenue, adoption and checkout impact.
          // Retain the distinct UX signal that informed the platform direction.
          metrics:
            slug === "ai-platform-mcp"
              ? entry.featuredMetrics.filter(
                  (metric) => metric.label === "CUSTOMER SIGNAL",
                )
              : [],
        };
      }),
    products: homeContent.featuredProducts.map((slug) => {
      const entry = getProductEntry(slug)!;
      return {
        slug,
        href: entry.href,
        title: entry.title,
        description: productDecisions[slug] ?? entry.description,
        status: entry.status,
        image: entry.heroImage,
        alt: entry.heroImageAlt,
      };
    }),
    creative: ["jumping-on-coals", "tabletop-symphony", "gravity-astra"].map(
      (slug) => {
        const entry = creativeEntries.find((item) => item.slug === slug)!;
        return {
          slug,
          href: entry.href,
          title: entry.title,
          eyebrow: entry.eyebrow,
          description: entry.summary,
          image:
            slug === "jumping-on-coals"
              ? "/images/jumping-on-coals/coals-traversal.png"
              : slug === "gravity-astra"
                ? "/images/gravity/astra/cello-perspective.webp"
                : entry.heroImage!,
          alt: entry.heroImageAlt ?? entry.title,
        };
      },
    ),
    thinking: homeContent.featuredThinking.map((slug) => {
      const entry = getThinkingEntry(slug)!;
      return {
        slug,
        href: entry.href,
        title: entry.cardTitle ?? entry.title,
        description: entry.cardDescription ?? entry.description,
        readTime: entry.readTime,
        ideas: entry.keyIdeas.slice(0, 3),
      };
    }),
    recommendations: recommendationGroups.map((group) => ({
      label: group.label,
      people: group.ids.map((id) => {
        const person = testimonials.find((item) => item.id === id)!;
        return {
          id: person.id,
          quote: person.short,
          fullQuote: person.full,
          name: person.name,
          avatarUrl: `/images/experience/recommenders/${person.id}.webp`,
          title: person.title,
          relationship: person.roleLabel,
          capacity: person.relationshipCapacity,
          source: person.source,
          href: person.profileUrl,
        };
      }),
    })),
  };
}
export type ExperienceHomeContent = ReturnType<typeof getExperienceHomeContent>;
