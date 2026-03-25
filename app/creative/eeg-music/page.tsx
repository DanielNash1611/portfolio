import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/site/Container";
import CreativeTemplate from "@/components/site/CreativeTemplate";
import { getCreativeEntry } from "@/content/portfolio";

const entry = getCreativeEntry("eeg-music");

export const metadata: Metadata = {
  title: "EEG Music",
  description:
    "Creative technology experiments exploring the relationship between biological signals and musical systems.",
};

export default function EegMusicPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <Container className="space-y-8 pt-6">
      <CreativeTemplate entry={entry} />
    </Container>
  );
}
