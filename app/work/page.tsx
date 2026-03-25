import type { Metadata } from "next";
import CaseStudyCard from "@/components/site/CaseStudyCard";
import Container from "@/components/site/Container";
import MotionReveal from "@/components/site/MotionReveal";
import PageHero from "@/components/site/PageHero";
import { workEntries } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected case studies covering real-world AI systems, platform thinking, workflow modernization, and measurable business impact.",
};

export default function WorkPage(): JSX.Element {
  return (
    <Container className="space-y-8 pt-6">
      <PageHero
        eyebrow="Work"
        title="Case studies in turning AI capabilities into production-ready systems"
        description="This work spans enterprise adoption, agent workflows, retrieval and system layers, workflow modernization, and measurable business impact. Each case study is structured to make the operating logic easy to scan."
        metrics={[
          { label: "Coverage", value: "AI + systems + operations" },
          { label: "Style", value: "Strategic and hands-on" },
          { label: "Signal", value: "Production reality, not demos" },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {workEntries.map((entry, index) => (
          <MotionReveal key={entry.slug} delay={index * 0.05}>
            <CaseStudyCard entry={entry} />
          </MotionReveal>
        ))}
      </div>
    </Container>
  );
}
