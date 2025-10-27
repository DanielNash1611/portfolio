import type { MetadataRoute } from "next";
import { cases } from "@/data/cases";

const baseUrl = "https://danielnash.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/work",
    "/music",
    "/about",
    "/contact"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  const caseRoutes = cases.map((item) => ({
    url: `${baseUrl}/work/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  return [...staticRoutes, ...caseRoutes];
}
