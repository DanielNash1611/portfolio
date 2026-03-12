import type { Metadata } from "next";
import CaseGridFilter from "@/components/CaseGridFilter";
import { cases } from "@/data/cases";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies and capability snapshots organized around Senior Product Manager, Builder PM, and Product Leader hiring narratives.",
};

export default function WorkPage(): JSX.Element {
  return (
    <div className="container space-y-10 py-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal/70">
          Portfolio
        </p>
        <h1 className="text-4xl font-semibold text-brand-teal">
          Work organized for hiring intent
        </h1>
        <p className="max-w-2xl text-brand-slate/80">
          This portfolio spans measurable business outcomes, systems and
          platform thinking, customer experience transformation, AI-enabled
          product development, and leadership through product practice. Use the
          hiring-lens filters to focus on the version of my work most relevant
          to the role.
        </p>
      </header>
      <CaseGridFilter items={cases} />
    </div>
  );
}
