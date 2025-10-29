"use client";

import { useMemo, useState } from "react";
import CaseCard from "@/components/CaseCard";
import Button from "@/components/Button";
import type { Case } from "@/data/cases";

interface CaseGridFilterProps {
  items: Case[];
}

const CaseGridFilter = ({ items }: CaseGridFilterProps): JSX.Element => {
  const tags = useMemo(
    () => ["All", ...new Set(items.flatMap((item) => item.tags))],
    [items]
  );
  const [activeTag, setActiveTag] = useState<string>("All");
  const filtered =
    activeTag === "All"
      ? items
      : items.filter((item) => item.tags.includes(activeTag));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Button
            key={tag}
            type="button"
            variant={activeTag === tag ? "primary" : "secondary"}
            onClick={() => setActiveTag(tag)}
            aria-pressed={activeTag === tag}
          >
            {tag}
          </Button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => {
          const status = item.kpis?.find(
            (metric) => metric.label.toLowerCase() === "status"
          )?.value;
          return (
            <CaseCard
              key={item.slug}
              {...item}
              status={status}
              ctaLabel={
                item.href
                  ? `Explore ${item.title.split("–")[0].trim()}`
                  : undefined
              }
              ariaLabel={
                item.href
                  ? `Open ${item.title} product page`
                  : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default CaseGridFilter;
