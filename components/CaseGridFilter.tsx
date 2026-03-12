"use client";

import { useEffect, useState } from "react";
import CaseCard from "@/components/CaseCard";
import Button from "@/components/Button";
import type { Case } from "@/data/cases";
import { NARRATIVES, type NarrativeId } from "@/data/positioning";

interface CaseGridFilterProps {
  items: Case[];
}

const CaseGridFilter = ({ items }: CaseGridFilterProps): JSX.Element => {
  const [activeNarrative, setActiveNarrative] = useState<NarrativeId | "all">(
    "all",
  );
  const filters = [
    { id: "all" as const, label: "All work" },
    ...NARRATIVES.map((narrative) => ({
      id: narrative.id,
      label: narrative.name,
    })),
  ];
  const filtered =
    activeNarrative === "all"
      ? items
      : items.filter((item) => item.roleLens.includes(activeNarrative));

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      const match = NARRATIVES.find((narrative) => narrative.id === hash);

      setActiveNarrative(match ? match.id : "all");
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);

    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-teal/65">
          Filter by hiring lens
        </p>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              type="button"
              variant={activeNarrative === filter.id ? "primary" : "secondary"}
              onClick={() => {
                setActiveNarrative(filter.id);
                const hash = filter.id === "all" ? "" : `#${filter.id}`;
                window.history.replaceState(
                  null,
                  "",
                  `${window.location.pathname}${hash}`,
                );
              }}
              aria-pressed={activeNarrative === filter.id}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => {
          const status =
            item.cardType === "Emerging Work"
              ? "Emerging work"
              : item.cardType === "Capability Teaser"
                ? "Capability teaser"
                : item.kpis?.find(
                    (metric) => metric.label.toLowerCase() === "status",
                  )?.value;
          return (
            <CaseCard
              key={item.slug}
              title={item.title}
              description={item.summary}
              href={item.href}
              tags={item.tags}
              status={status}
              chips={item.chips}
              bestFor={item.bestFor}
              ctaLabel={
                item.cardType === "Case Study" ? "View work" : "Open detail"
              }
              media={{
                src: item.heroImage,
                width: 1200,
                height: 675,
                alt: `${item.title} preview artwork.`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CaseGridFilter;
