import { CASE_STUDIES } from "@/data/caseStudies";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import CheckoutRedesignPage from "@/app/work/checkout-redesign/page";
import ChatGptEnterprisePage from "@/app/work/chatgpt-enterprise/page";
import "@/components/overnight-cases/cases.css";

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  if (!cs) notFound();

  // Keep historical case URLs useful without maintaining a thinner second story.
  if (cs.slug === "checkout-velocity") return <CheckoutRedesignPage />;
  if (cs.slug === "contact-center-ai" || cs.slug === "chatgpt-org-scale") {
    return <ChatGptEnterprisePage />;
  }

  return (
    <main className="oc-case mx-auto max-w-3xl px-6 py-16">
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
