import type { Metadata } from "next";
import Link from "next/link";
import CaseStudyHeader from "@/components/CaseStudyHeader";
import { cases } from "@/data/cases";
import { getCaseMdx } from "@/lib/mdx";
import Button from "@/components/Button";

const slug = "checkout-redesign";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getCaseMdx(slug);
  return {
    title: frontmatter.title,
    description:
      frontmatter.summary ||
      "Checkout redesign that accelerated transactions and drove conversion lift."
  };
}

export default async function CheckoutRedesignPage(): Promise<JSX.Element> {
  const { frontmatter, content } = await getCaseMdx(slug);
  const caseData = cases.find((item) => item.slug === slug);

  return (
    <div className="container space-y-10 py-10">
      <Link href="/work">
        <Button variant="ghost" className="mb-4">
          ← Back to portfolio
        </Button>
      </Link>
      <CaseStudyHeader
        title={frontmatter.title}
        subtitle={
          frontmatter.summary ||
          "Rearchitecting checkout to cut latency, boost conversion, and unlock experimentation."
        }
        kpis={caseData?.kpis}
      />
      <article className="space-y-8 rounded-3xl border border-brand-slate/10 bg-white/80 p-10 shadow-soft prose prose-lg max-w-none text-brand-slate prose-headings:font-serif prose-headings:text-brand-teal">
        {content}
      </article>
    </div>
  );
}
