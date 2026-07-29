import type { Metadata } from "next";
import Container from "@/components/site/Container";
import EssayCard from "@/components/site/EssayCard";
import MotionReveal from "@/components/site/MotionReveal";
import PageHero from "@/components/site/PageHero";
import { thinkingEntries } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Thinking",
  description:
    "Essays by Daniel Nash on AI product leadership, measurable impact, responsible adoption, human flourishing, and systems thinking.",
};

export default function ThinkingPage(): JSX.Element {
  return (
    <Container className="space-y-12 pb-20 pt-8 md:pb-28">
      <PageHero
        eyebrow="Thinking"
        title="A practical point of view on AI, products, and human work"
        description="These essays connect measurable business impact with the harder questions of trust, responsible adoption, creativity, systems design, and the future we want AI to help build."
        metrics={[
          { label: "Focus", value: "AI product leadership" },
          { label: "Standard", value: "Impact + responsibility" },
          { label: "Tone", value: "Practical, personal, grounded" },
        ]}
      />

      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-2">
        {thinkingEntries.map((entry, index) => (
          <MotionReveal key={entry.slug} delay={index * 0.05}>
            <EssayCard entry={entry} />
          </MotionReveal>
        ))}
      </div>
    </Container>
  );
}
