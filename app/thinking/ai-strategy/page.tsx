import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/site/Container";
import EssayTemplate from "@/components/site/EssayTemplate";
import { getThinkingEntry } from "@/content/portfolio";

const entry = getThinkingEntry("ai-strategy");

export const metadata: Metadata = {
  title: entry?.title ?? "AI Strategy",
  description:
    entry?.summary ??
    "Daniel Nash on why enterprise AI succeeds through workflow fit, trust, enablement, and the systems around the model.",
};

export default function AiStrategyPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <Container className="space-y-10 pb-20 pt-8 md:pb-28">
      <EssayTemplate entry={entry} />
    </Container>
  );
}
