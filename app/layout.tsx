import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEOReviews from "@/components/SEOReviews";
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
    template: "%s — Daniel Nash",
    default: "Daniel Nash — Senior AI Product Manager & Composer"
  },
  description:
    "AI product leader and composer building high-performing user journeys, experimentation programs, and music tech.",
  openGraph: {
    title: "Daniel Nash — Senior AI Product Manager & Composer",
    description:
      "AI product leader and composer building high-performing user journeys, experimentation programs, and music tech.",
    url: "https://danielnash.com",
    siteName: "Daniel Nash",
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
    title: "Daniel Nash — Senior AI Product Manager & Composer",
    description:
      "AI product leader and composer building high-performing user journeys, experimentation programs, and music tech.",
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
        <SEOReviews />
        <Header />
        <main id="main" className="min-h-[60vh] scroll-mt-24 pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
