import type { Metadata } from "next";
import CaseStudyTemplate from "@/components/site/CaseStudyTemplate";
import { zimmerAiPrototypes } from "@/content/projects/zimmer-ai-prototypes";

export const metadata: Metadata = {
  title: zimmerAiPrototypes.title,
  description: zimmerAiPrototypes.description,
};

export default function ZimmerAiPrototypesPage(): React.JSX.Element {
  return <CaseStudyTemplate entry={zimmerAiPrototypes} />;
}
