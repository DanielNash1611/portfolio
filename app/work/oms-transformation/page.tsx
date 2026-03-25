import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyTemplate from "@/components/site/CaseStudyTemplate";
import Container from "@/components/site/Container";
import { getWorkEntry } from "@/content/portfolio";

const entry = getWorkEntry("oms-transformation");

export const metadata: Metadata = {
  title: "OMS Transformation",
  description:
    "A systems-focused case study spanning checkout transformation, returns modernization, and order-management simplification.",
};

export default function OmsTransformationPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <Container className="space-y-8 pt-6">
      <CaseStudyTemplate entry={entry} />
    </Container>
  );
}
