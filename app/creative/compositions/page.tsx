import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/site/Container";
import CreativeTemplate from "@/components/site/CreativeTemplate";
import { getCreativeEntry } from "@/content/portfolio";

const entry = getCreativeEntry("compositions");

export const metadata: Metadata = {
  title: "Compositions",
  description: "Selected music and performance work by Daniel Nash.",
};

export default function CompositionsPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <Container className="space-y-8 pt-6">
      <CreativeTemplate entry={entry} />
    </Container>
  );
}
