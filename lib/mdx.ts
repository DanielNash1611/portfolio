import { compileMDX } from "next-mdx-remote/rsc";
import path from "node:path";
import { readFile } from "node:fs/promises";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import MetricCard from "@/components/MetricCard";
import ProConList from "@/components/ProConList";
import BeforeAfter from "@/components/BeforeAfter";

export type CaseFrontmatter = {
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
};

export async function getCaseMdx(slug: string) {
  const filePath = path.join(process.cwd(), "content", "cases", `${slug}.mdx`);
  const source = await readFile(filePath, "utf8");

  return compileMDX<CaseFrontmatter>({
    source,
    components: {
      MetricCard,
      ProConList,
      BeforeAfter
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              properties: {
                className: ["heading-anchor"]
              }
            }
          ]
        ]
      }
    }
  });
}
