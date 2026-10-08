import type { Metadata } from "next";
import { SystemOverview } from "@/components/product-system/SystemOverview";

export const metadata: Metadata = {
  title: "Product Operating System",
  description:
    "Daniel Nash’s field guide to turning ideas into products: a living definition, an iterative development loop, shared context for AI, and evidence for the next decision.",
  alternates: { canonical: "/product-system" },
  twitter: {
    card: "summary_large_image",
    title: "Product Operating System | Daniel Nash",
    description:
      "A field guide to building, learning, and working together. Find the starting point for your role.",
    images: ["/images/product-system/iterative-paper-study.webp"],
  },
  openGraph: {
    title: "Product Operating System | Daniel Nash",
    description:
      "A field guide to building, learning, and working together. Find the starting point for your role.",
    url: "/product-system",
    images: [
      {
        url: "/images/product-system/iterative-paper-study.webp",
        width: 1536,
        height: 1024,
        alt: "An architectural paper study evolves from loose curls into structure.",
      },
    ],
  },
};

export default function ProductSystemPage() {
  return <SystemOverview />;
}
