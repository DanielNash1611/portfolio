import type { Metadata } from "next";
import CaseGridFilter from "@/components/CaseGridFilter";
import { cases } from "@/data/cases";

export const metadata: Metadata = {
  title: "Product Portfolio",
  description:
    "Filter case studies across AI platforms, checkout redesign, and creative experimentation."
};

export default function WorkPage(): JSX.Element {
  return (
    <div className="container space-y-10 py-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal/70">
          Portfolio
        </p>
        <h1 className="text-4xl font-semibold text-brand-teal">
          Strategic product leadership across AI, commerce, and sound
        </h1>
        <p className="max-w-2xl text-brand-slate/80">
          Explore experimentation programs, AI platform initiatives, and
          creative technology demos. Use the filters to focus on categories that
          matter most to you.
        </p>
      </header>
      <CaseGridFilter items={cases} />
    </div>
  );
}
