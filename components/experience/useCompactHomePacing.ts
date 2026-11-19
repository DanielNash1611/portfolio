"use client";
import { useEffect, useState, type RefObject } from "react";

/** Mobile pacing belongs to the public homepage, not every experience route. */
export function useCompactHomePacing(root: RefObject<HTMLElement | null>) {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    if (!root.current?.closest('.experience[data-home-pacing="true"]')) return;
    const query = matchMedia("(max-width: 899px), (pointer: coarse)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [root]);
  return compact;
}
