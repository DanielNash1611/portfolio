import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import CaseStudyHeader from "@/components/CaseStudyHeader";
import { cases } from "@/data/cases";
import { getCaseMdx } from "@/lib/mdx";

const slug = "jira-product-discovery";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getCaseMdx(slug);
  return {
    title: frontmatter.title,
    description:
      frontmatter.summary ||
      "Standardized prioritization and planning in Jira Product Discovery, turning quarterly wishlists into a continuous partnership between product, business, and technology."
  };
}

export default async function JiraProductDiscoveryPage(): Promise<JSX.Element> {
  const { frontmatter, content } = await getCaseMdx(slug);
  const caseData = cases.find((item) => item.slug === slug);

  return (
    <div className="container space-y-10 py-10">
      <Link href="/work">
        <Button variant="ghost" className="mb-4">
          Back to portfolio
        </Button>
      </Link>
      <CaseStudyHeader
        title={frontmatter.title}
        subtitle={
          frontmatter.summary ||
          "Transforming quarterly wishlists into a continuous, transparent partnership model between product, business, and technology."
        }
        kpis={caseData?.kpis}
        tags={caseData?.tags}
      />
      <article className="prose prose-lg max-w-none space-y-8 rounded-3xl border border-brand-slate/10 bg-white/80 p-10 text-brand-slate shadow-soft prose-headings:font-serif prose-headings:text-brand-teal">
        {content}
      </article>
    </div>
  );
}
