import type { Metadata } from "next";
import CareerStory from "@/components/overnight-builders/CareerStory";

export const metadata: Metadata = {
  title: "AI Career Operating System",
  description:
    "A governed AI workflow for turning approved career evidence into recruiter-ready artifacts through source-audited retrieval, evals, and human review.",
  openGraph: {
    title: "AI Career Operating System",
    description:
      "A governed AI workflow for turning approved career evidence into recruiter-ready artifacts.",
    images: [
      {
        url: "/images/products/ai-career-operating-system/governed-ai-workflow-career-evidence.png",
        width: 1693,
        height: 929,
        alt: "Governed AI workflow from approved career evidence to a human-approved artifact.",
      },
    ],
  },
};

export default function AiCareerOperatingSystemPage(): React.JSX.Element {
  return <CareerStory />;
}
