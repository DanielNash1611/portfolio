import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/site/Container";
import ProductTemplate from "@/components/site/ProductTemplate";
import { getProductEntry } from "@/content/portfolio";

const entry = getProductEntry("launchmuse");

export const metadata: Metadata = {
  title: "LaunchMuse",
  description:
    "AI-native release planning product and live alpha built by Daniel Nash.",
};

export default function LaunchMusePage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  const launchMuseEntry = {
    ...entry,
    heroImage: "/images/launchmuse-product-hero.png",
    heroImageAlt:
      "LaunchMuse campaign plan screen showing a detailed release story and weekly plan.",
    heroImageClassName: "object-top",
    heroImageExpandable: true,
  };

  return (
    <Container className="space-y-8 pt-6">
      <ProductTemplate entry={launchMuseEntry} />
    </Container>
  );
}
