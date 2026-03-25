import type { Metadata } from "next";
import Container from "@/components/site/Container";
import MotionReveal from "@/components/site/MotionReveal";
import PageHero from "@/components/site/PageHero";
import ProductCard from "@/components/site/ProductCard";
import { productEntries } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Live products, product concepts, and AI-native prototypes built or shaped by Daniel Nash.",
};

export default function ProductsPage(): JSX.Element {
  return (
    <Container className="space-y-8 pt-6">
      <PageHero
        eyebrow="Products"
        title="Live products and concept work that reinforce the builder story"
        description="These pages show how I move from product framing to AI-native workflows, prototypes, and public-facing artifacts without losing strategic rigor."
        metrics={[
          { label: "Surface area", value: "Live alpha + concepts" },
          { label: "Bias", value: "Focused MVPs" },
          { label: "Why it matters", value: "Builder credibility" },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {productEntries.map((entry, index) => (
          <MotionReveal key={entry.slug} delay={index * 0.05}>
            <ProductCard entry={entry} />
          </MotionReveal>
        ))}
      </div>
    </Container>
  );
}
