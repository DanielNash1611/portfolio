import { getTestimonialById } from "@/data/testimonials";

const selections = {
  "sumanth-cherukuri": {
    topic: "AI adoption and enablement",
    title: "Former VP of Software Engineering & AI",
    relationship: "My manager during the ChatGPT Enterprise rollout",
    excerpt:
      "Dan also led the adoption of AI with creating training videos and leading the super user group.",
    caseStudy: {
      href: "/work/chatgpt-enterprise#organization-enablement",
      label: "Enablement case study",
    },
  },
  "zac-bogart": {
    topic: "Business transformation",
    title: "SVP of Digital",
    relationship: "Executive partner on contact center modernization",
    excerpt:
      "He connected all the dots from our data & analytics to the real user experience of our customers and gear advisors to drive meaningful change that led directly to business outcomes.",
    caseStudy: {
      href: "/work/contact-center-roadmap",
      label: "Contact center roadmap",
    },
  },
  "colin-greene": {
    topic: "Teaching and mentorship",
    title: "Senior Technical Product Manager",
    relationship: "Peer on the Guitar Center product team",
    excerpt:
      "In addition, he was a pivotal resource for the team in configuring the various tools we used, was the primary teacher for the team in new tools like Atlassian's Jira Product Discovery tool as well as numerous other applications and tools the team eventually chose to use as standard across all members.",
    caseStudy: {
      href: "/case-studies/jira-product-discovery",
      label: "Jira Product Discovery",
    },
  },
  "don-worsham": {
    topic: "Cross-functional leadership",
    title: "Director of Strategic Contracts, Sourcing, and Spend",
    relationship: "Cross-functional partner on strategy, sourcing, and AI",
    excerpt:
      'What set Dan apart was his ability to sit in a room with executives who wanted transformation and engineers who were trying to figure out what "transformation" even meant — and make both groups feel heard while moving toward something concrete.',
    caseStudy: {
      href: "/work/chatgpt-enterprise",
      label: "ChatGPT Enterprise rollout",
    },
  },
  "matt-winick": {
    topic: "Creative problem-solving",
    title: "Senior UX and Product Designer",
    relationship: "Design partner on the GuitarCenter.com checkout redesign",
    excerpt:
      "Even from my earliest, more casual interactions with him, it was clear he was a transformative thinker, someone who approaches challenges with both rigor and imagination.",
    caseStudy: {
      href: "/work/checkout-redesign",
      label: "Checkout redesign",
    },
  },
  "daniel-das": {
    topic: "Technical product strategy",
    title: "Senior Software Engineer",
    relationship:
      "Engineering partner on AI platform work and ChatGPT integrations",
    excerpt:
      "What impressed me most was Dan's ability to take highly complex technical explorations—like scalable ChatGPT integrations, multi-agent architectures, and enterprise guardrails—and shape them into clear, actionable product strategies.",
    caseStudy: {
      href: "/work/ai-platform-mcp",
      label: "AI platform foundations",
    },
  },
};

type RecommendationId = keyof typeof selections;

export const recommendationsHref = "/recommendations";

export function getSelectedRecommendation(id: RecommendationId) {
  const testimonial = getTestimonialById(id);
  const { excerpt, ...selection } = selections[id];

  if (!testimonial || !testimonial.full.includes(excerpt)) {
    throw new Error(`Recommendation excerpt does not match its source: ${id}`);
  }

  return {
    ...selection,
    testimonial: { ...testimonial, short: excerpt },
    href: `${recommendationsHref}#${id}`,
  };
}

export const selectedRecommendations = (
  Object.keys(selections) as RecommendationId[]
).map(getSelectedRecommendation);
