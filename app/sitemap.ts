import type { MetadataRoute } from "next";
import { systemChapters, systemHref } from "@/content/product-system";
import {
  creativeEntries,
  productEntries,
  thinkingEntries,
  workEntries,
} from "@/content/portfolio";

const baseUrl = "https://www.danielnash.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/work",
    "/products",
    "/thinking",
    "/product-system",
    "/creative",
    "/about",
    "/resume",
    "/resume/generate",
    "/llms.txt",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const contentRoutes = [
    ...systemChapters.map((chapter) => systemHref(chapter.slug)),
    ...workEntries.map((entry) => entry.href),
    ...productEntries.map((entry) => entry.href),
    ...thinkingEntries.map((entry) => entry.href),
    ...creativeEntries.map((entry) => entry.href),
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...contentRoutes];
}
