import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyTemplate from "@/components/site/CaseStudyTemplate";
import Container from "@/components/site/Container";
import { getWorkEntry } from "@/content/portfolio";

const entry = getWorkEntry("ai-platform-mcp");

export const metadata: Metadata = {
  title: "AI Platform MCP",
  description:
    "A case study in AI platform strategy, connectors, governance, and MCP-informed workflow design.",
};

export default function AiPlatformMcpPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <Container className="space-y-8 pt-6">
      <CaseStudyTemplate entry={entry} />
    </Container>
  );
}
