import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/site/Container";
import ProductTemplate from "@/components/site/ProductTemplate";
import { getProductEntry } from "@/content/portfolio";

const entry = getProductEntry("ai-agents-lab");

export const metadata: Metadata = {
  title: "AI Agents Lab",
  description:
    "A lab of AI prototypes and experiments, including the live Sound Seeker demo.",
};

export default function AiAgentsLabPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <Container className="space-y-8 pt-6">
      <ProductTemplate entry={entry} />
    </Container>
  );
}
