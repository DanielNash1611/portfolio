"use client";
import { useEffect, useRef } from "react";
import { usePortfolioAssistant } from "./PortfolioAssistantProvider";
import {
  registerPortfolioTools,
  subscribePortfolioToolCancellation,
  type ModelContext,
} from "@/lib/portfolio-agent/webmcp";

export default function PortfolioWebMCP() {
  const assistant = usePortfolioAssistant();
  const latest = useRef(assistant);
  latest.current = assistant;
  const enabled = assistant?.enabled && assistant.webmcpEnabled;
  const catalog = assistant?.catalog;
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext })
      .modelContext;
    if (!enabled || !catalog || typeof context?.registerTool !== "function")
      return;
    const controller = new AbortController();
    void registerPortfolioTools(
      context,
      catalog,
      {
        open: () => latest.current?.open(true),
        currentSurface: () => latest.current!.surface,
        navigate: (slug, signal) => latest.current!.navigate(slug, signal),
        evidence: async (slug, signal) => {
          const response = await fetch(
            `/api/portfolio-agent/evidence?slug=${encodeURIComponent(slug)}`,
            { signal },
          );
          if (!response.ok)
            throw new Error("Public evidence is temporarily unavailable.");
          return response.json();
        },
      },
      controller.signal,
    ).catch((error) => {
      controller.abort();
      if (error?.name !== "AbortError")
        console.warn("Portfolio WebMCP registration unavailable.");
    });
    const unsubscribeCancellation = subscribePortfolioToolCancellation(
      context,
      window,
      () => latest.current?.cancel(),
    );
    return () => {
      controller.abort();
      unsubscribeCancellation();
    };
  }, [enabled, catalog]);
  return null;
}
