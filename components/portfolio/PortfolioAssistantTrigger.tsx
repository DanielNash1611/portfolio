"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { usePortfolioAssistant } from "./PortfolioAssistantProvider";

/** An in-place entry usable by server and client pages without a navigation link. */
export default function PortfolioAssistantTrigger({
  children,
  lens = false,
  ...props
}: Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "id" | "aria-label"
> & { children: ReactNode; lens?: boolean }) {
  const assistant = usePortfolioAssistant();
  if (!assistant?.enabled) return null;
  return (
    <button
      {...props}
      type="button"
      data-portfolio-assistant-trigger="true"
      aria-controls="portfolio-assistant-panel"
      aria-expanded={assistant.isOpen}
      onClick={() => assistant.open(lens)}
    >
      {children}
    </button>
  );
}
