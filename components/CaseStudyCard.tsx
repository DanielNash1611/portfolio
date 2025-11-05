"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type MetricChip = { label: string; value: string };

export type CaseStudyCardProps = {
  slug: string;
  title: string;
  summary: string;
  headlineMetrics?: MetricChip[]; // e.g., [{ label: "Conversion", value: "+3%" }]
  thumbnailUrl?: string;
  href?: string;
};

export default function CaseStudyCard({
  slug,
  title,
  summary,
  headlineMetrics,
  thumbnailUrl,
  href,
}: CaseStudyCardProps) {
  const destination = href ?? `/case-studies/${slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 hover:shadow-md"
    >
      {thumbnailUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumbnailUrl} alt="" className="h-40 w-full object-cover" />
      )}
      <div className="p-5">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">
          <Link href={destination} className="hover:underline">
            {title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{summary}</p>

        {headlineMetrics && headlineMetrics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Measured metrics">
            {headlineMetrics.slice(0, 2).map((m, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                aria-label={`Measured: ${m.label} ${m.value}`}
              >
                <span className="font-semibold">{m.value}</span>
                <span className="text-slate-500">{m.label}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
