import type { Metadata } from "next";
import StudioCollectionPage from "@/components/site/StudioCollectionPage";
import { workEntries } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected case studies covering real-world AI systems, platform thinking, workflow modernization, and measurable business impact.",
};

export default function WorkPage(): JSX.Element {
  return (
    <StudioCollectionPage
      eyebrow="Selected case studies"
      title="Making AI real."
      description="The operating work behind credible AI products: finding the right problem, creating the conditions for trust, and turning early proof into durable business value."
      collectionEyebrow="The work"
      collectionTitle="Decisions, systems, outcomes."
      proofItems={[
        { label: "Practice", value: "AI product leadership" },
        { label: "Operating range", value: "Strategy through delivery" },
        { label: "Standard", value: "Evidence over theater" },
      ]}
      entries={workEntries.map((entry) => ({
        slug: entry.slug,
        href: entry.href,
        title: entry.title,
        eyebrow: entry.eyebrow,
        meta: `${entry.company} · ${entry.timeframe}`,
        description: entry.description,
        image: entry.heroImage,
        imageAlt: entry.heroImageAlt,
        imageClassName: "object-cover",
        metrics: entry.featuredMetrics,
      }))}
    />
  );
}
