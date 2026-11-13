import Link from "next/link";
import Container from "@/components/site/Container";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import type { ProductEntry } from "@/content/portfolio";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

export default function PrivateProductExample({
  entry,
}: {
  entry: ProductEntry;
}) {
  const pageContext = getPageContextByPath(entry.href);
  const sections = [
    { title: "The problem", body: entry.problem },
    { title: "My contribution", body: entry.solution },
    ...entry.productExperience.map((step) => ({
      title: step.title,
      body: [step.description],
    })),
    { title: "Product judgment", body: entry.learnings },
    { title: "Status & evidence", body: entry.evaluationAndTrust ?? [] },
  ];
  return (
    <Container className="py-12 md:py-20">
      <Link
        href="/products"
        className="text-sm font-bold text-[color:var(--color-teal)] underline"
      >
        Back to products
      </Link>
      <header className="max-w-3xl border-b border-[color:var(--color-slate)]/16 py-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-orange)]">
          {entry.eyebrow} / {entry.status}
        </p>
        <h1 className="mt-6 font-serif text-5xl tracking-tight md:text-7xl">
          {entry.title}
        </h1>
        <p className="mt-6 text-lg leading-8">{entry.summary}</p>
      </header>
      <div className="max-w-3xl">
        {sections.map((section) => (
          <section
            key={section.title}
            className="border-b border-[color:var(--color-slate)]/16 py-8"
          >
            <h2 className="font-serif text-2xl md:text-3xl">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-4 leading-8 text-[color:var(--color-slate)]/75"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
      {pageContext ? (
        <PortfolioGuide
          pageContext={pageContext}
          portfolioContext={getPortfolioContext()}
        />
      ) : null}
    </Container>
  );
}
