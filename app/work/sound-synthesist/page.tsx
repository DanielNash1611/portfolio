import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import CaseStudyHeader from "@/components/CaseStudyHeader";
import { cases } from "@/data/cases";
import { getCaseMdx } from "@/lib/mdx";

const slug = "sound-synthesist";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getCaseMdx(slug);
  return {
    title: frontmatter.title,
    description:
      frontmatter.summary ||
      "Sound Synthesist demo blending AI prompts with modular synthesis."
  };
}

export default async function SoundSynthesistPage(): Promise<JSX.Element> {
  const { frontmatter, content } = await getCaseMdx(slug);
  const caseData = cases.find((item) => item.slug === slug);

  return (
    <div className="container space-y-10 py-10">
      <Link href="/work">
        <Button variant="ghost" className="mb-4">
          ← Back to portfolio
        </Button>
      </Link>
      <div className="rounded-3xl border border-brand-slate/10 bg-gradient-to-br from-brand-cream/80 to-brand-tan/60 p-10 shadow-soft">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold text-brand-teal md:text-5xl">
            {frontmatter.title}
          </h1>
          <p className="text-lg text-brand-slate/80">
            AI-guided sound design playground that keeps musicians in command of
            the creative process.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" disabled aria-disabled="true">
              Open Demo (Coming Soon)
            </Button>
            <p className="text-sm text-brand-slate/70">
              Prototype rebuilt independently for portfolio demonstration; no
              proprietary data.
            </p>
          </div>
        </div>
      </div>
      <CaseStudyHeader
        title="Project Summary"
        subtitle={
          frontmatter.summary ||
          "Harnessing AI to generate composable soundscapes with clear human-in-the-loop controls."
        }
        kpis={caseData?.kpis}
      />
      <article className="space-y-8 rounded-3xl border border-brand-slate/10 bg-white/80 p-10 shadow-soft prose prose-lg max-w-none text-brand-slate prose-headings:font-serif prose-headings:text-brand-teal">
        {content}
      </article>
      <footer className="rounded-3xl border border-brand-slate/10 bg-brand-cream/80 p-6 text-sm text-brand-slate/80">
        Originally prototyped during my time at Guitar Center; this independent
        demo is rebuilt from scratch using public data and OpenAI APIs. No
        proprietary assets.
      </footer>
    </div>
  );
}
