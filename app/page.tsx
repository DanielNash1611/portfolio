import type { Metadata } from "next";
import StudioSystemsHomePage from "@/components/homepage/StudioSystemsHomePage";

export const metadata: Metadata = {
  title: "Daniel Nash | AI Product Leader",
  description:
    "Portfolio for Daniel Nash, an AI product leader building systems that create measurable business value while advancing trust, creativity, and better human work.",
};

export default function HomePage(): JSX.Element {
  return <StudioSystemsHomePage />;
}
