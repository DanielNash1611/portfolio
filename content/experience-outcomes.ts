import { getWorkEntry } from "./portfolio";
import { systemsSource, systemsMilestones } from "./experience-systems";
import { testimonials } from "@/data/testimonials";

/** Leadership stories for the preview. Outcomes retain their public-source
 * qualifications; the planning/onboarding example links to its own case study. */
export function getExperienceOutcomes() {
  const checkout = getWorkEntry("checkout-redesign")!;
  const adoption = getWorkEntry("chatgpt-enterprise")!;
  const roadmap = testimonials.find(
    (person) => person.id === "david-lawrence",
  )!;
  return [
    {
      id: "systems",
      category: "Vision & strategy",
      title: "Create direction",
      value: `${systemsSource.before} → ${systemsSource.after}`,
      measure: "Systems in the frontline workflow",
      qualification: "Reported result after one year.",
      heading: "Give fragmented work a shared direction.",
      role: "I built the Contact Center technology roadmap, sought out internal expertise, and presented it to the Management Committee.",
      decision:
        "Connect everyday workflow problems to a sequenced roadmap, explicit quarterly targets, and a review of what actually changed.",
      evidence: systemsMilestones[systemsMilestones.length - 1].detail,
      href: "#experience-systems",
      action: "Explore the roadmap and reported result",
      image: null,
      alt: null,
      caption: "Executive perspective · Contact Center roadmap",
      quote: roadmap.short,
      attribution: `${roadmap.name} · ${roadmap.roleLabel}`,
      practice: {
        title: "Build the product practice, too.",
        description:
          "I also established shared prioritization and coached PMs and cross-functional partners, helping a planning practice spread beyond a single team.",
        href: "/case-studies/jira-product-discovery",
        action: "Read the planning and enablement case",
      },
    },
    {
      id: "adoption",
      category: "Alignment & adoption",
      title: "Mobilize people",
      value: adoption.featuredMetrics[0].value,
      measure: "Annualized pilot impact estimate",
      qualification: "Six-month pilot with a matched control group.",
      heading: "Build the conditions for adoption.",
      role: "I led the pilot and worked across Legal, Security, Engineering, and Operations on workflows, governance, and enablement. I also started the grassroots ChatGPT Champions model.",
      decision:
        "Prove value in a controlled frontline pilot, then scale the workflows, guardrails, training, and champions network together.",
      evidence: `${adoption.featuredMetrics[1].value} licensed users. ${adoption.featuredMetrics[1].detail}`,
      href: adoption.href,
      action: "Read the adoption and enablement case",
      image: "/images/chatgpt-enterprise/enterprise-ai-operating-model.webp",
      alt: "Sanitized enterprise AI operating model showing discovery, governance, pilot, scale, and feedback loops.",
      caption: "Sanitized exhibit · Enterprise AI operating model",
      quote: null,
      attribution: null,
      practice: null,
    },
    {
      id: "checkout",
      category: "Execution & impact",
      title: "Deliver change",
      value: checkout.featuredMetrics[0].value,
      measure: "Estimated annualized revenue impact",
      qualification: "From the post-launch A/B test.",
      heading: "Keep teams aligned through the build.",
      role: "I aligned product, UX, and engineering, and kept the designer involved throughout development so the product intent carried through to delivery.",
      decision:
        "Make feasibility issues shared product and design decisions, keeping the team aligned on the customer experience while choosing a workable implementation.",
      evidence: `${checkout.featuredMetrics[1].value} checkout. ${checkout.featuredMetrics[1].detail}`,
      href: checkout.href,
      action: "Read the cross-functional delivery case",
      image: "/images/checkout-redesign/checkout-after.png",
      alt: "Original screen from the redesigned Guitar Center checkout.",
      caption: "Original product screen · Redesigned checkout",
      quote: null,
      attribution: null,
      practice: null,
    },
  ];
}
