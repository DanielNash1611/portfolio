import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/site/Container";
import ProductTemplate from "@/components/site/ProductTemplate";
import { getProductEntry } from "@/content/portfolio";

const entry = getProductEntry("immunology-scout");

export const metadata: Metadata = {
  title: "Immunology Scout",
  description:
    "Emerging AI + science product concept exploring literature scouting and hypothesis support in immunology.",
};

export default function ImmunologyScoutPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <Container className="space-y-8 pt-6">
      <ProductTemplate entry={entry} />
    </Container>
  );
}
