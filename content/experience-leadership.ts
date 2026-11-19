import { getWorkEntry } from "./portfolio";
import { contactCenterRoadmap } from "./projects/contact-center-roadmap";

export type ExperienceWorkStory = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  action: string;
  previewLabel: string;
  image: string | null;
  alt: string | null;
  metrics: { label: string; value: string; detail?: string }[];
  caseStudyStatus?: "in-development";
  relatedEvidence?: { href: string; label: string };
  card?: {
    title: string;
    value: string;
    measure: string;
    qualification: string;
    decision: string;
  };
};

/** Selected for distinct leadership evidence. Scope is coaching and rollout,
 * not direct-report headcount or sole vendor-selection authority.
 * Sources: published JPD case; ResumeCustomizer career revision 4, claims
 * player-coach-pm-owner-coaching, executive-roadmaps-outcome-portfolios,
 * rolled-out-cresta-ai-coaching-across and cresta-coaching-quality-insights-modernization.
 */
export function getExperienceLeadershipCases(presentation: "home" | "preview" = "preview"): ExperienceWorkStory[] {
  const adoption = getWorkEntry("chatgpt-enterprise")!;
  const shared: ExperienceWorkStory[] = [
    {
      slug: "product-practice",
      card: {
        title: "Product practice",
        value: "4",
        measure: "PMs / POs coached concurrently",
        qualification: "Prioritization, backlogs, and delivery practices.",
        decision:
          "Make prioritization a shared decision, then coach people in real planning work so the practice carries beyond a template.",
      },
      title: "Building a product practice",
      eyebrow: "Grow product judgment",
      description:
        "I coached PMs and Product Owners and established shared decision standards, helping teams turn stakeholder roadmaps into outcome-driven portfolios.",
      href: "/case-studies/jira-product-discovery",
      action: "Read the planning and coaching case",
      previewLabel: "See the change in how teams work",
      image: "/images/jpd-hero.svg",
      alt: "Published Jira Product Discovery planning illustration.",
      metrics: [
        {
          label: "Player-coach leadership",
          value: "4 PMs / POs",
          detail:
            "Coached concurrently on backlog quality, prioritization, and delivery practices.",
        },
      ],
    },
    {
      slug: "chatgpt-enterprise",
      card: {
        title: "Enterprise adoption",
        value: "Scale",
        measure: "Governance, workflows, and champions",
        qualification: "Cross-functional pilot and rollout design.",
        decision:
          "Scale the workflows, guardrails, and enablement together, with champions supporting practical use across teams.",
      },
      title: "ChatGPT Enterprise",
      eyebrow: "Mobilize adoption across functions",
      description:
        "I led the pilot and rollout design, bringing Legal, Security, Engineering, and Operations into a shared approach to workflows, governance, and enablement.",
      href: adoption.href,
      action: "Read the adoption and enablement case",
      previewLabel: "Explore the discovery, operating model, and champions",
      image: adoption.heroImage,
      alt: adoption.heroImageAlt,
      // The opening cards already carry the qualified pilot and adoption metrics.
      metrics: [],
    },
  ];

  if (presentation === "home") {
    return [
      {
        slug: contactCenterRoadmap.slug,
        card: {
          title: "Establish product management",
          value: "First PM",
          measure: "Guitar Center Contact Center",
          qualification: "Three-year roadmap and PM handoff.",
          decision:
            "Use what agents do every day to sequence work with Contact Center and Technology leaders.",
        },
        title: contactCenterRoadmap.title,
        eyebrow: "Set a shared direction",
        description:
          "I started discovery before leadership requested a roadmap, brought business and technology leaders together, and trained the next PM on the practice.",
        href: contactCenterRoadmap.href,
        action: "Read the Contact Center roadmap case",
        previewLabel: "See how the tool map made the roadmap clear",
        image: contactCenterRoadmap.heroImage,
        alt: contactCenterRoadmap.heroImageAlt,
        metrics: [],
      },
      ...shared,
    ];
  }

  return [
    ...shared,
    {
      slug: "cresta-coaching",
      card: {
        title: "Cresta rollout",
        value: "250",
        measure: "People in the contact center rollout",
        qualification: "Cresta coaching · within two months.",
        decision:
          "Connect the technology choice to manager workflows, onboarding, and feedback, so coaching becomes part of daily work.",
      },
      title: "Cresta coaching rollout",
      eyebrow: "Carry an AI investment into daily use",
      description:
        "I helped select Cresta and led its coaching rollout, pairing executive alignment and onboarding with manager workflows and feedback-driven improvements.",
      href: "/experience/cases/cresta-coaching",
      action: "View case-study placeholder",
      caseStudyStatus: "in-development",
      relatedEvidence: {
        href: "#experience-systems",
        label: "Explore the wider roadmap",
      },
      previewLabel: "Compare the coaching workflow",
      // The preview is an authored workflow comparison, not a product screenshot.
      image: null,
      alt: null,
      metrics: [
        {
          label: "Rollout scope",
          value: "250-person contact center",
          detail: "Cresta coaching rolled out within two months.",
        },
      ],
    },
  ];
}
