import type { Metadata } from "next";
import ExperiencePreview from "@/components/experience/ExperiencePreview";
import { getExperienceHomeContent } from "@/content/experience-home";

export const metadata: Metadata = {
  title: "Portfolio in motion — preview",
  description:
    "Daniel Nash builds AI products and the product capability around them. An interactive journey from clear direction to working products and repeatable practices.",
  robots: { index: false, follow: false },
};

export default function ExperiencePage() {
  return <ExperiencePreview home={getExperienceHomeContent()} />;
}
