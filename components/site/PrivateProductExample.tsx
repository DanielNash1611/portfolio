import Link from "next/link";
import Container from "@/components/site/Container";
import MediaFrame from "@/components/site/MediaFrame";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import type { ProductEntry } from "@/content/portfolio";
import ProductScreenshotCredit from "@/components/site/ProductScreenshotCredit";
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
      {entry.visuals.length > 0 ? (
        <section
          className="my-10 max-w-5xl space-y-8"
          aria-label="Product screenshots"
        >
          {entry.visuals.map((visual, index) => (
            <figure key={visual.title} className="space-y-3">
              <MediaFrame
                src={visual.image}
                alt={visual.alt ?? visual.title}
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="aspect-[1512/682] border border-[color:var(--color-slate)]/12 bg-white"
                imageClassName="!object-contain"
                priority={index === 0}
              />
              <figcaption className="text-sm leading-6 text-[color:var(--color-slate)]/70">
                <span className="font-semibold">{visual.title}.</span>{" "}
                {visual.description}
                {visual.image ? (
                  <a
                    href={visual.image}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-1 underline"
                  >
                    Open full-size screenshot
                  </a>
                ) : null}
                <ProductScreenshotCredit slug={entry.slug} />
              </figcaption>
            </figure>
          ))}
        </section>
      ) : null}
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
