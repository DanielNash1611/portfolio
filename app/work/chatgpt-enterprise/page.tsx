import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PilotEvidenceDossier } from "@/components/overnight-enterprise/PilotDossier";
import EnterpriseOrgChapter from "@/components/overnight-cases/EnterpriseOrgChapter";
import EnterpriseFlagship from "@/components/overnight-cases/EnterpriseFlagship";
import CaseStudyTemplate from "@/components/site/CaseStudyTemplate";
import { getWorkEntry } from "@/content/portfolio";

const entry = getWorkEntry("chatgpt-enterprise");
export const metadata: Metadata = {
  title: "ChatGPT Enterprise",
  description:
    "How Daniel Nash proved enterprise AI value in the contact center, built the operating model for safe scale, and turned one pilot into a broader adoption engine.",
};
export default function ChatGptEnterprisePage(): React.JSX.Element {
  if (!entry) notFound();
  // Page-local qualifications preserve shared evidence ownership while keeping
  // measured comparisons, an annualized estimate, and adoption scopes distinct.
  const reviewedEntry = {
    ...entry,
    summary:
      "I led a controlled contact-center pilot and helped build the workflows, practical governance, and peer enablement for broader ChatGPT Enterprise adoption.",
    heroDetails: [
      "I started with a deliberately scoped contact-center experiment, then helped turn useful workflows into shared practice through governance, training, and cross-functional support.",
      "The pilot informed the business case for expansion. Observed cohort measures, an estimated annualized impact, and later company-wide adoption describe different evidence and scopes.",
    ],
    featuredMetrics: [
      {
        label: "Estimated annualized pilot impact",
        value: "~$2.7M",
        detail:
          "A business-case estimate from the six-month pilot, not realized annual revenue or a figure derived here from the source comparison.",
      },
      {
        label: "Company-wide licensed users",
        value: "~150 → ~1,000",
        detail:
          "Approximate reported adoption endpoints; separate from the 15-agent pilot and ~350-agent contact-center expansion.",
      },
      {
        label: "Company-wide active users",
        value: "~40 → ~800",
        detail:
          "Approximate reported usage endpoints. No intermediate adoption curve or matching observation dates are supplied here.",
      },
    ],
    impact: [
      {
        label: "Annualized pilot estimate",
        value: "~$2.7M",
        detail:
          "Reported business-case estimate, not realized revenue. Model inputs are not reproduced in the slide-12 table.",
      },
      {
        label: "Company-wide licensed users",
        value: "~150 → ~1,000",
        detail: "Later adoption scope, distinct from contact-center expansion.",
      },
      {
        label: "Company-wide active users",
        value: "~40 → ~800",
        detail:
          "Reported endpoints associated with the broader rollout; not a denominator for pilot impact.",
      },
    ],
    results: [
      "The pilot supported a business case for expanding ChatGPT Enterprise to the contact center, approximately 350 agents. Source slide 12 reports average order value, conversion, and revenue per call for both the test and adjusted-control groups. Both cohorts improved conversion and revenue per call; the full test-group change is not, by itself, a causal AI lift.",
      "The six-month pilot produced a reported annualized impact estimate of approximately $2.7M. This is a business-case estimate, not realized annual revenue. Source slide 13 reports longer conversations for test agents, so the evidence does not support a blanket reduction in handle time.",
      "Later company-wide adoption grew from approximately 150 licensed users and 40 active users to approximately 1,000 licensed users and 800 active users. These are separate reported adoption endpoints, not pilot cohort counts or a measured adoption time series. The supporting source does not establish the activity window.",
    ],
    artifactSectionDescription:
      "Published sanitized explanatory exhibits from the portfolio case. These illustrate the practice; they are not raw internal workspace screenshots or measurement records.",
    visuals: entry.visuals.map((asset) => ({
      ...asset,
      description: `${asset.description} Published sanitized explanatory exhibit; inspect the original rather than treating its illustration as a raw internal system capture.`,
    })),
  };
  return (
    <EnterpriseFlagship
      pilot={<PilotEvidenceDossier />}
      organization={<EnterpriseOrgChapter />}
    >
      <details className="eef-source-record" suppressHydrationWarning>
        <summary>The pilot method, partnership, and limits</summary>
        <p>
          The case account describes a six-month, 15-agent test cohort with a
          control matched on tenure, skill, and call mix. The control-group size
          is not published. Reported weekly values are preserved in the original
          source table; its control column is labeled adjusted.
        </p>
        <p>
          Daniel partnered with supervisors and frontline agents on workflow
          opportunities, and with EIS and Legal on acceptable use of basic CRM
          context: agents were not to paste PCI or PII, and reviewed generated
          copy before sending. These are documented usage boundaries, not
          evidence of an automated enforcement system or a new certification.
        </p>
        <p>
          Slide 13 reports longer conversations for test agents. A separate
          survey estimate of time saved does not establish objectively lower
          handle time. The annualized impact estimate and expansion decision
          remain separate from observed cohort measures and later company-wide
          adoption.
        </p>
      </details>
      <details className="eef-source-record" suppressHydrationWarning>
        <summary>The full leadership case and published exhibits</summary>
        <p>
          The complete narrative retains workflow discovery, options and
          tradeoffs, delivery, enablement, and collaborator recommendations. The
          published sanitized illustrations are explanatory portfolio exhibits.
          The original measurement slide above is a separate source.
        </p>
        <CaseStudyTemplate entry={reviewedEntry} hideHero />
      </details>
    </EnterpriseFlagship>
  );
}
