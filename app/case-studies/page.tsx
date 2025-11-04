import type { Metadata } from "next";
import CaseStudyCard from "@/components/CaseStudyCard";
import { CASE_STUDIES } from "@/data/caseStudies";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Measured case studies spanning AI strategy, experimentation, and enablement.",
};

export default function CaseStudiesPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Case Studies</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Measured outcomes across AI, experimentation, and enablement
        </h1>
        <p className="text-base text-slate-600">
          Explore a selection of programs and pilots with quantified impact. Each card spotlights the most relevant
          measured results; dive into the case study for deeper context and implementation detail.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CASE_STUDIES.map((cs) => (
          <CaseStudyCard
            key={cs.slug}
            slug={cs.slug}
            title={cs.title}
            summary={cs.summary}
            headlineMetrics={cs.headlineMetrics}
          />
        ))}
      </div>
    </main>
  );
}
