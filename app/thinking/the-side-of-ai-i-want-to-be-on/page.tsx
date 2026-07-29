import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/site/Container";
import EssayTemplate from "@/components/site/EssayTemplate";
import { getThinkingEntry } from "@/content/portfolio";

const entry = getThinkingEntry("the-side-of-ai-i-want-to-be-on");

export const metadata: Metadata = {
  title: entry?.title ?? "The Side of AI I Want to Be On",
  description:
    entry?.summary ??
    "Daniel Nash on measurable AI business value, responsible adoption, creativity, trust, and human flourishing.",
  openGraph: {
    title: entry?.title ?? "The Side of AI I Want to Be On",
    description:
      entry?.summary ??
      "A personal point of view on building AI for measurable impact, responsible adoption, and human flourishing.",
    type: "article",
    url: "/thinking/the-side-of-ai-i-want-to-be-on",
  },
};

export default function TheSideOfAiPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <Container className="space-y-10 pb-20 pt-8 md:pb-28">
      <EssayTemplate entry={entry} />
    </Container>
  );
}
