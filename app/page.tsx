import type { Metadata } from "next";
import ExperiencePreview from "@/components/experience/ExperiencePreview";
import { homeContent } from "@/content/portfolio";
import { getExperienceHomeContent } from "@/content/experience-home";

export const metadata: Metadata = {
  title: { absolute: homeContent.metadata.title },
  description: homeContent.metadata.description,
  openGraph: {
    ...homeContent.metadata,
    url: "https://www.danielnash.co",
    siteName: "Daniel Nash",
    type: "website",
    images: [{ url: "/og-default.svg", width: 1200, height: 630 }],
  },
  twitter: {
    ...homeContent.metadata,
    card: "summary_large_image",
    images: ["/og-default.svg"],
  },
};

export default function HomePage(): React.JSX.Element {
  return (
    <ExperiencePreview
      home={getExperienceHomeContent("home")}
      personalVideo={false}
      presentation="home"
    />
  );
}
