import type { Metadata } from "next";
import Container from "@/components/site/Container";
import EssayCard from "@/components/site/EssayCard";
import MotionReveal from "@/components/site/MotionReveal";
import PageHero from "@/components/site/PageHero";
import { thinkingEntries } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Thinking",
  description:
    "Short essays on AI strategy, product leadership, and systems thinking by Daniel Nash.",
};

export default function ThinkingPage(): JSX.Element {
  return (
    <Container className="space-y-8 pt-6">
      <PageHero
        eyebrow="Thinking"
        title="Product essays that make the operating model visible"
        description="These short pieces are here to clarify how I think about AI strategy, systems design, product leadership, and the role of creative practice in product judgment."
        metrics={[
          { label: "Format", value: "Short-form essays" },
          { label: "Focus", value: "AI + product systems" },
          { label: "Tone", value: "Strategic, concise, grounded" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {thinkingEntries.map((entry, index) => (
          <MotionReveal key={entry.slug} delay={index * 0.05}>
            <EssayCard entry={entry} />
          </MotionReveal>
        ))}
      </div>
    </Container>
  );
}
