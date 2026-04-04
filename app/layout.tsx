import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import MainContainer from "@/components/MainContainer";
import SEOReviews from "@/components/SEOReviews";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.danielnash.co"),
  title: {
    default: "Daniel Nash | AI Product Leader",
    template: "%s | Daniel Nash",
  },
  description:
    "Portfolio for Daniel Nash, an AI Product Leader / Senior Product Manager focused on turning new AI capability into practical products, workflows, and systems that teams use, trust, and scale.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "Daniel Nash | AI Product Leader",
    description:
      "Portfolio for Daniel Nash, an AI Product Leader / Senior Product Manager focused on turning new AI capability into practical products, workflows, and systems that teams use, trust, and scale.",
    url: "https://www.danielnash.co",
    siteName: "Daniel Nash",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Abstract gradient in Daniel Nash portfolio brand palette.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Nash | AI Product Leader",
    description:
      "Portfolio for Daniel Nash, an AI Product Leader / Senior Product Manager focused on turning new AI capability into practical products, workflows, and systems that teams use, trust, and scale.",
    images: ["/og-default.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <SEOReviews />
        <SiteHeader />
        <MainContainer>{children}</MainContainer>
        <SiteFooter />
      </body>
    </html>
  );
}
