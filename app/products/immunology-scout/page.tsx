import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ScoutStory from "@/components/overnight-builders/ScoutStory";
import { getProductEntry } from "@/content/portfolio";

const entry = getProductEntry("immunology-scout");

export const metadata: Metadata = {
  title: "Immunology Scout",
  description:
    "Paper-and-patent scouting product concept for immunology teams, designed for grounded evidence review, novelty checks, and next-step hypothesis support.",
};

export default function ImmunologyScoutPage(): React.JSX.Element {
  if (!entry) {
    notFound();
  }

  return <ScoutStory entry={entry} />;
}
