import { CASE_STUDIES } from "@/data/caseStudies";
import { MDXRemote } from "next-mdx-remote/rsc";

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cs = CASE_STUDIES.find((c) => c.slug === params.slug);
  if (!cs) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">{cs.title}</h1>
      <p className="mt-2 text-slate-600">{cs.summary}</p>

      {/* Render MDX body as plain content */}
      {cs.body && (
        <div className="prose prose-slate mt-8 max-w-none">
          <MDXRemote source={cs.body} />
        </div>
      )}
    </main>
  );
}
