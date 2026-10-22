import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import MainContainer from "@/components/MainContainer";
import SEOReviews from "@/components/SEOReviews";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import PortfolioAssistantProvider from "@/components/portfolio/PortfolioAssistantProvider";
import PortfolioAssistantShell from "@/components/portfolio/PortfolioAssistantShell";
import { getPublicSurfaceCatalog } from "@/lib/portfolio-agent/catalog";

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
    "Portfolio for Daniel Nash, an AI product leader building systems that create measurable business value while advancing trust, creativity, and better human work.",
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
      "AI product leadership focused on measurable business impact, trusted adoption, creativity, and better human work.",
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
      "AI product leadership focused on measurable business impact, trusted adoption, creativity, and better human work.",
    images: ["/og-default.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      {process.env.NEXT_PUBLIC_WEBMCP_ORIGIN_TRIAL_TOKEN ? (
        <head>
          <meta
            httpEquiv="origin-trial"
            content={process.env.NEXT_PUBLIC_WEBMCP_ORIGIN_TRIAL_TOKEN}
          />
        </head>
      ) : null}
      <body>
        <AnalyticsProvider />
        <SEOReviews />
        <PortfolioAssistantProvider
          catalog={getPublicSurfaceCatalog()}
          enabled={
            process.env.NEXT_PUBLIC_PORTFOLIO_ASSISTANT_ENABLED === "true"
          }
          webmcpEnabled={
            process.env.NEXT_PUBLIC_PORTFOLIO_WEBMCP_ENABLED === "true"
          }
        >
          <div id="portfolio-site-content">
            <SiteHeader />
            <MainContainer>{children}</MainContainer>
            <SiteFooter />
            <FeedbackButton />
          </div>
          <PortfolioAssistantShell />
        </PortfolioAssistantProvider>
      </body>
    </html>
  );
}
