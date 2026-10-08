import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

export default function ThinkingPage(): React.JSX.Element {
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

      <Link
        href="/product-system"
        className="group grid overflow-hidden bg-[color:var(--color-teal)] text-[color:var(--color-cream)] md:grid-cols-2"
      >
        <div className="p-7 md:p-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#dec29d]">
            The field guide
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.04em]">
            Product Operating System
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#e1e3d7]">
            How ideas become products through a living definition, shared
            context, and evidence. Find the starting point for your role.
          </p>
          <span className="mt-6 inline-flex items-center gap-4 text-xs font-bold">
            Explore the method{" "}
            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-1"
            />
          </span>
        </div>
        <div className="relative min-h-[260px]">
          <Image
            src="/images/product-system/iterative-paper-study.webp"
            alt="Paper studies evolving from loose forms into a deliberate structure."
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </Link>

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
