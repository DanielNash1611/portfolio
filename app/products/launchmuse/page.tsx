import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LaunchMuseStory from "@/components/overnight-builders/LaunchMuseStory";
import { getProductEntry } from "@/content/portfolio";

const entry = getProductEntry("launchmuse");

export const metadata: Metadata = {
  title: "LaunchMuse",
  description:
    "Focused AI-native product that helps artists turn the meaning behind a release into a cohesive six-week narrative.",
};

export default function LaunchMusePage(): React.JSX.Element {
  if (!entry) {
    notFound();
  }

  return <LaunchMuseStory entry={entry} />;
}
