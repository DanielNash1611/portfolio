import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/site/Container";
import EssayTemplate from "@/components/site/EssayTemplate";
import { getThinkingEntry } from "@/content/portfolio";

const entry = getThinkingEntry("ai-strategy");

export const metadata: Metadata = {
  title: "AI Strategy",
  description:
    "Daniel Nash on why AI strategy is really adoption design, not just model selection.",
};

export default function AiStrategyPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <Container className="space-y-8 pt-6">
      <EssayTemplate entry={entry} />
    </Container>
  );
}
