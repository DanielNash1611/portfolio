"use client";
import { useEffect, useState } from "react";

/** Tall quote/diagram stages become readable documents in short landscape views. */
export function useShortViewport() {
  const [short, setShort] = useState(false);
  useEffect(() => {
    const query = matchMedia("(max-height:550px)");
    const update = () => setShort(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return short;
}
