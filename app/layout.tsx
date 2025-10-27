import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://danielnash.com"),
  title: {
    template: "%s | Daniel Nash",
    default: "Daniel Nash | Bridging Creativity & Strategy"
  },
  description:
    "Portfolio of Daniel Nash — Senior AI product leader and composer crafting high-impact journeys across digital products and sound.",
  openGraph: {
    title: "Daniel Nash | Bridging Creativity & Strategy",
    description:
      "Explore the AI-driven product and music portfolio from Daniel Nash, spanning checkout redesigns to immersive sound experiments.",
    url: "https://danielnash.com",
    siteName: "Daniel Nash Portfolio",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Abstract gradient in brand palette for Daniel Nash"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Nash | Bridging Creativity & Strategy",
    description:
      "Product portfolio & compositions by Daniel Nash, blending AI, design, and sound.",
    images: ["/og-default.svg"]
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-brand-orange focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="min-h-[60vh] scroll-mt-24 pt-24">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
