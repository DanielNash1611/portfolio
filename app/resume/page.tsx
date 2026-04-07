import type { Metadata } from "next";
import Container from "@/components/site/Container";
import CTASection from "@/components/site/CTASection";
import PageHero from "@/components/site/PageHero";
import { resumeVariants, siteConfig } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Download Daniel Nash resume variants for Senior Product Manager, Builder PM, and Product Leader conversations.",
};

export default function ResumePage(): JSX.Element {
  return (
    <Container className="space-y-8 pt-6">
      <PageHero
        eyebrow="Resume"
        title="Resume assets organized for different conversations"
        description="The site does most of the explanatory work, so this page stays simple: three live PDFs, light framing on when to use each one, and a fast path for recruiter handoff."
        metrics={[
          { label: "Primary use", value: "Recruiter handoff" },
          { label: "Delivery", value: "Open or download PDF" },
          { label: "Status", value: "3 live variants" },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {resumeVariants.map((variant) => (
          <article
            key={variant.id}
            className="flex h-full flex-col rounded-[1.75rem] border border-black/6 bg-white/84 p-6 shadow-[0_24px_60px_rgba(58,61,64,0.08)]"
          >
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-teal)]/68">
                Resume variant
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
                {variant.title}
              </h2>
              <p className="text-sm leading-6 text-[color:var(--color-slate)]/70">
                {variant.audience}
              </p>
            </div>

            <div className="mt-5 rounded-[1.25rem] bg-[color:var(--color-cream)]/78 px-4 py-4 text-sm leading-6 text-[color:var(--color-slate)]/72">
              <p className="font-semibold text-[color:var(--color-slate)]">
                Download file
              </p>
              <p className="mt-2 font-mono text-xs">{variant.filename}</p>
              <p className="mt-3">{variant.note}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[color:var(--color-slate)]/74">
                {variant.focusAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <a
                href={`/resumes/${variant.filename}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-[color:var(--color-teal)]/16 bg-white px-5 py-3 text-sm font-semibold text-[color:var(--color-teal)] transition hover:bg-[color:var(--color-cream)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
              >
                Open PDF
              </a>
              <a
                href={`/resumes/${variant.filename}`}
                download
                className="inline-flex items-center rounded-full bg-[color:var(--color-teal)] px-5 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-[color:var(--color-slate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
              >
                Download PDF
              </a>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-[2rem] border border-dashed border-[color:var(--color-teal)]/18 bg-[color:var(--color-cream)]/68 px-6 py-8 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-teal)]/68">
          Resume notes
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
          How these versions relate to the site
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-[color:var(--color-slate)]/72">
          The portfolio remains the higher-fidelity source for context,
          artifacts, and ownership nuance. These PDFs are meant to match common
          hiring narratives quickly, not replace the deeper case-study evidence.
        </p>
      </section>

      <CTASection
        title="Need a specific version for a role?"
        description="Happy to tailor the framing once there is a concrete opportunity or recruiter brief."
        primaryAction={{
          href: siteConfig.linkedinUrl,
          label: "Connect on LinkedIn",
          external: true,
        }}
        secondaryAction={{
          href: siteConfig.contactHref,
          label: "Send a message",
        }}
      />
    </Container>
  );
}
