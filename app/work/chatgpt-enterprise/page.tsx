import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyTemplate from "@/components/site/CaseStudyTemplate";
import Container from "@/components/site/Container";
import { getWorkEntry } from "@/content/portfolio";

const entry = getWorkEntry("chatgpt-enterprise");

export const metadata: Metadata = {
  title: "ChatGPT Enterprise",
  description:
    "How Daniel Nash proved enterprise AI value in the contact center, built the operating model for safe scale, and turned one pilot into a broader adoption engine.",
};

export default function ChatGptEnterprisePage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <Container className="space-y-8 pt-6">
      <CaseStudyTemplate entry={entry} />
    </Container>
  );
}
