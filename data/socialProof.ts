import type { NarrativeId } from "@/data/positioning";
import { testimonials } from "@/data/testimonials";

export type SocialProofSnippet = {
  label: string;
  quote: string;
  detail: string;
  author: string;
  title: string;
  roleLabel: string;
  profileUrl?: string;
  source: "LinkedIn" | "Direct";
  mode?: "quote" | "paraphrase";
};

const testimonialMap = new Map(
  testimonials.map((testimonial) => [testimonial.id, testimonial]),
);

const fromTestimonial = (
  testimonialId: string,
  snippet: Omit<
    SocialProofSnippet,
    "author" | "title" | "roleLabel" | "profileUrl" | "source"
  >,
): SocialProofSnippet => {
  const testimonial = testimonialMap.get(testimonialId);

  if (!testimonial) {
    throw new Error(`Unknown testimonial: ${testimonialId}`);
  }

  return {
    ...snippet,
    author: testimonial.name,
    title: testimonial.title,
    roleLabel: testimonial.roleLabel,
    profileUrl: testimonial.profileUrl,
    source: testimonial.source,
  };
};

export const narrativeSocialProof: Record<NarrativeId, SocialProofSnippet> = {
  "senior-product-manager": fromTestimonial("zac-bogart", {
    label: "External validation",
    quote: "A true business partner, not just a glorified project manager.",
    detail:
      "Zac also emphasized roadmap ownership, connecting analytics to real user experience, and driving change that tied directly to business outcomes.",
  }),
  "builder-pm": fromTestimonial("zac-bogart", {
    label: "External validation",
    quote: "Tip-of-the-spear of AI adoption.",
    detail:
      "That Builder PM story is reinforced by Sumanth's recommendation around reusable GPT tools, strong AI and platform architecture, and a high-ROI ChatGPT Enterprise pilot.",
  }),
  "product-leader": fromTestimonial("sumanth-cherukuri", {
    label: "External validation",
    quote: "Articulates big-picture vision while securing executive buy-in.",
    detail:
      "Sumanth also credits Dan with the first 3-year roadmap, scaled enablement, and automation that saved thousands of hours annually.",
  }),
};

export const aboutSocialProof: SocialProofSnippet[] = [
  fromTestimonial("zac-bogart", {
    label: "Trusted by partners",
    quote:
      "Connected the dots from data and analytics to the real user experience.",
    detail:
      "Zac ties that to roadmap leadership, business partnership, modernization work, and measurable outcomes for customers and gear advisors.",
  }),
  fromTestimonial("sumanth-cherukuri", {
    label: "Trusted by leaders",
    quote: "One of the most transformative product leaders I've worked with.",
    detail:
      "Sumanth connects that praise to GPT-powered tools, the first ChatGPT Enterprise pilot, and the executive trust to scale AI responsibly.",
  }),
];

export const caseStudySocialProof: Record<string, SocialProofSnippet[]> = {
  "chatgpt-contact-center": [
    fromTestimonial("zac-bogart", {
      label: "Business-partner view",
      quote: "A true business partner, not just a glorified project manager.",
      detail:
        "Zac framed the work as roadmap leadership that connected analytics, agent experience, and modernization into real business outcomes.",
    }),
    fromTestimonial("sumanth-cherukuri", {
      label: "Leadership-partner view",
      quote: "Led the first ChatGPT Enterprise pilot with huge ROI.",
      detail:
        "Sumanth also connected this work to reusable GPT tools, contact-center roadmap ownership, and operational gains at scale.",
    }),
  ],
  "chatgpt-org-scale": [
    fromTestimonial("zac-bogart", {
      label: "Business-partner view",
      quote: "Tip-of-the-spear of AI adoption.",
      detail:
        "Just as important, Zac said Dan brought the broader company with him instead of letting AI stay trapped with a few early adopters.",
    }),
    fromTestimonial("sumanth-cherukuri", {
      label: "Leadership-partner view",
      quote:
        "Rare combination of strategic foresight and executional excellence.",
      detail:
        "Sumanth highlighted training, super-user enablement, platform strategy, and the ability to secure executive buy-in for the rollout.",
    }),
  ],
};
