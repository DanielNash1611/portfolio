import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import portraits from "@/public/portraits/metadata.json";

const defaultOgImage = {
  url: "/og-default.svg",
  width: 1200,
  height: 630,
  alt: "Abstract gradient in brand palette for Daniel Nash"
};

const heroPortrait =
  portraits.find((entry) => entry.roles.includes("hero")) ?? null;
const heroImagePath = heroPortrait
  ? `/portraits/${heroPortrait.file}`
  : defaultOgImage.url;

export const metadata: Metadata = {
  metadataBase: new URL("https://danielnash.com"),
  title: {
    template: "%s | Daniel Nash",
    default: "Daniel Nash | Bridging Creativity & Strategy"
  },
  description:
    "Portfolio of Daniel Nash - Senior AI product leader and composer crafting high-impact journeys across digital products and sound.",
  openGraph: {
    title: "Daniel Nash | Bridging Creativity & Strategy",
    description:
      "Explore the AI-driven product and music portfolio from Daniel Nash, spanning checkout redesigns to immersive sound experiments.",
    url: "https://danielnash.com",
    siteName: "Daniel Nash Portfolio",
    images: [
      heroPortrait
        ? {
            url: heroImagePath,
            width: heroPortrait.width,
            height: heroPortrait.height,
            alt: heroPortrait.alt,
            type: "image/jpeg"
          }
        : defaultOgImage
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Nash | Bridging Creativity & Strategy",
    description:
      "Product portfolio and compositions by Daniel Nash, blending AI, design, and sound.",
    images: [heroImagePath]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-brand-gradient text-brand-slate">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main" className="min-h-[60vh] scroll-mt-24 pt-24">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
