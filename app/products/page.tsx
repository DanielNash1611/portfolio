import type { Metadata } from "next";
import StudioCollectionPage from "@/components/site/StudioCollectionPage";
import { productEntries } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Live products, product concepts, and AI-native prototypes built or shaped by Daniel Nash.",
};

export default function ProductsPage(): JSX.Element {
  return (
    <StudioCollectionPage
      eyebrow="Products & prototypes"
      title="Building is how I think."
      description="Focused products, live experiments, and production-shaped concepts. Each one turns an emerging capability into something concrete enough to use, test, and improve."
      collectionEyebrow="The product shelf"
      collectionTitle="Ideas made tangible."
      proofItems={[
        { label: "Surface area", value: "Live alpha + concepts" },
        { label: "Build stance", value: "Focused, testable MVPs" },
        { label: "Throughline", value: "Human-centered systems" },
      ]}
      entries={productEntries.map((entry) => ({
        slug: entry.slug,
        href: entry.href,
        title: entry.title,
        eyebrow: entry.eyebrow,
        meta: entry.status,
        description: entry.description,
        image: entry.heroImage,
        imageAlt: entry.heroImageAlt,
        imageClassName:
          entry.heroImageClassName ??
          (entry.slug === "ai-career-operating-system"
            ? "object-contain bg-white p-4"
            : "object-cover"),
        metrics: entry.featuredMetrics,
      }))}
    />
  );
}
