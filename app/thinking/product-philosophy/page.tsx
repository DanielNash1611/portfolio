import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/site/Container";
import EssayTemplate from "@/components/site/EssayTemplate";
import { getThinkingEntry } from "@/content/portfolio";

const entry = getThinkingEntry("product-philosophy");

export const metadata: Metadata = {
  title: "Product Philosophy",
  description:
    "Daniel Nash on product leadership as systems design with accountability.",
};

export default function ProductPhilosophyPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <Container className="space-y-8 pt-6">
      <EssayTemplate entry={entry} />
    </Container>
  );
}
