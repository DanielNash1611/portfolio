import type { Metadata } from "next";
import StudioSystemsHomePage from "@/components/homepage/StudioSystemsHomePage";
import { homeContent } from "@/content/portfolio";

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

export default function HomePage(): JSX.Element {
  return <StudioSystemsHomePage />;
}
