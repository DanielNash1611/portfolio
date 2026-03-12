import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MainContainer from "@/components/MainContainer";
import SEOReviews from "@/components/SEOReviews";
import portraits from "@/public/portraits/metadata.json";

const defaultOgImage = {
  url: "/og-default.svg",
  width: 1200,
  height: 630,
  alt: "Abstract gradient in brand palette for Daniel Nash",
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
    default: "Daniel Nash | Senior Product Manager",
  },
  description:
    "Senior Product Manager with experience across ecommerce, contact center, platforms, and AI strategy.",
  openGraph: {
    title: "Daniel Nash | Senior Product Manager",
    description:
      "Senior Product Manager with experience across ecommerce, contact center, platforms, and AI strategy.",
    url: "https://danielnash.com",
    siteName: "Daniel Nash",
    images: [
      heroPortrait
        ? {
            url: heroImagePath,
            width: heroPortrait.width,
            height: heroPortrait.height,
            alt: heroPortrait.alt,
            type: "image/jpeg",
          }
        : defaultOgImage,
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Nash | Senior Product Manager",
    description:
      "Senior Product Manager with experience across ecommerce, contact center, platforms, and AI strategy.",
    images: [heroImagePath],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-brand-gradient text-brand-slate">
        <SEOReviews />
        <Header />
        <MainContainer>{children}</MainContainer>
        <Footer />
      </body>
    </html>
  );
}
