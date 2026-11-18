"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

/** Native disclosure keeps optional depth keyboard accessible and linkable. */
export default function ExperienceDisclosure({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: (open: boolean) => ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className={`experience-disclosure ${className}`}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>
        <span>
          <strong>{title}</strong>
          {description ? <span>{description}</span> : null}
        </span>
        <ChevronDown size={20} aria-hidden="true" />
      </summary>
      <div className="experience-disclosure-body">{children(open)}</div>
    </details>
  );
}
