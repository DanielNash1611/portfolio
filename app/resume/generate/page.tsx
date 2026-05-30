import type { Metadata } from "next";
import Container from "@/components/site/Container";
import PageHero from "@/components/site/PageHero";
import ResumeGenerator from "./ResumeGenerator";

export const metadata: Metadata = {
  title: "Generate a role-specific resume",
  description:
    "Paste or upload a job description to generate a role-specific PDF resume for Daniel Nash, built from verified experience. Download directly with no email required, or opt into email delivery.",
};

export default function ResumeGeneratePage(): JSX.Element {
  return (
    <Container className="space-y-8 pt-6">
      <PageHero
        eyebrow="Role-specific resume"
        title="Generate a resume tailored to your role"
        description="Paste the job description and generate a role-specific PDF resume for Daniel Nash. Generation usually takes about 10 minutes. Download it directly with no email required, or have it emailed to you."
        metrics={[
          { label: "Typical time", value: "~10 minutes" },
          { label: "Email", value: "Optional" },
          { label: "Source", value: "Verified experience" },
        ]}
      />

      {/* Crawlable, agent-readable description of the workflow. */}
      <p className="sr-only">
        Recruiters and hiring managers can upload or paste a job description to
        generate a role-specific PDF resume for Daniel Nash. Generation usually
        takes about 10 minutes. The PDF can be downloaded directly without
        providing an email address, or delivered by email on request. Including
        Daniel on the email thread is opt-in. The generated resume is created
        only from Daniel&apos;s verified experience and does not invent
        employers, titles, dates, or outcomes.
      </p>

      <ResumeGenerator />
    </Container>
  );
}
