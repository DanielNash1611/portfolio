import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/site/Container";
import CTASection from "@/components/site/CTASection";
import PageHero from "@/components/site/PageHero";
import { resumeVariants, siteConfig } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Generate a role-specific PDF resume for Daniel Nash from a job description, or download a ready-made variant. Direct download needs no email; email delivery is optional.",
};

export default function ResumePage(): JSX.Element {
  return (
    <Container className="space-y-8 pt-6">
      <PageHero
        eyebrow="Resume"
        title="Generate a resume tailored to your exact role"
        description="Paste a job description and generate a role-specific PDF resume for Daniel Nash in about 10 minutes — no email required. Prefer something ready-made? Three static variants are below."
        actions={[
          { href: "/resume/generate", label: "Generate tailored resume" },
          { href: siteConfig.contactHref, label: "Contact Daniel" },
        ]}
        metrics={[
          { label: "Tailored option", value: "Role-specific generator" },
          { label: "Ready-made", value: "3 live variants" },
          { label: "Delivery", value: "Download or email" },
        ]}
      />

      {/* Role-specific resume generator — primary, high-emphasis panel */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[color:var(--color-slate)] px-6 py-9 text-[color:var(--color-cream)] shadow-[0_30px_80px_rgba(58,61,64,0.22)] md:px-10 md:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(219,191,150,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(209,122,95,0.24),_transparent_44%)]"
        />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-cream)]/25 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-cream)]/80">
              Recommended · Role-specific generator
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Get the most relevant version of my resume
            </h2>

            {/* Crawlable, agent-readable copy (requirement 8). */}
            <p className="max-w-2xl text-base leading-7 text-[color:var(--color-cream)]/82 md:text-lg">
              Recruiters and hiring managers can upload or paste a job
              description to generate a role-specific PDF resume for Daniel Nash.
              The generated resume is created from Daniel&apos;s verified
              experience across AI product strategy, enterprise AI adoption,
              workflow-heavy platforms, order management, contact center
              technology, ecommerce, and 0→1 AI prototyping.
            </p>

            <ul className="grid gap-3 sm:grid-cols-2">
              <HubPoint
                title="Takes about 10 minutes"
                body="Paste a JD and the tailored PDF is generated for you."
              />
              <HubPoint
                title="No email required"
                body="The direct download path never asks for an email address."
              />
              <HubPoint
                title="Email delivery is optional"
                body="Prefer it in your inbox? Choose email delivery instead."
              />
              <HubPoint
                title="CC Daniel is opt-in"
                body="Looping Daniel into the email thread is off by default."
              />
            </ul>

            <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-cream)]/70">
              The generated resume is built only from Daniel&apos;s verified
              experience. It does not invent employers, titles, dates, or
              outcomes.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/resume/generate"
                className="inline-flex items-center rounded-full border border-[color:var(--color-cream)] bg-[color:var(--color-cream)] px-7 py-3.5 text-sm font-semibold text-[color:var(--color-slate)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-slate)]"
              >
                Generate tailored resume
              </Link>
              <Link
                href={siteConfig.contactHref}
                className="inline-flex items-center rounded-full border border-white/25 bg-transparent px-7 py-3.5 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-slate)]"
              >
                Contact Daniel
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-6 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-cream)]/72">
              How it works
            </p>
            <ol className="mt-4 space-y-4 text-sm text-[color:var(--color-cream)]/85">
              <HowStep n={1} text="Paste or upload the job description." />
              <HowStep
                n={2}
                text="Add the role and company if you'd like (optional)."
              />
              <HowStep
                n={3}
                text="Choose to download here or have it emailed."
              />
              <HowStep
                n={4}
                text="Get a tailored PDF built from verified experience."
              />
            </ol>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
            Prefer a ready-made version?
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-[color:var(--color-slate)]/72">
            These three static PDFs match common hiring narratives. Use them when
            you want a quick download without generating a role-specific version.
          </p>
        </div>

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
                <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
                  {variant.title}
                </h3>
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
        title="Want the most relevant version of my resume?"
        description="Upload a job description and generate a role-specific PDF resume, or reach out directly if you’d rather talk through the role."
        primaryAction={{
          href: "/resume/generate",
          label: "Generate tailored resume",
        }}
        secondaryAction={{
          href: siteConfig.contactHref,
          label: "Contact Daniel",
        }}
      />
    </Container>
  );
}

function HubPoint({
  title,
  body,
}: {
  title: string;
  body: string;
}): JSX.Element {
  return (
    <li className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3">
      <p className="text-sm font-semibold text-[color:var(--color-cream)]">
        {title}
      </p>
      <p className="mt-1 text-xs leading-5 text-[color:var(--color-cream)]/72">
        {body}
      </p>
    </li>
  );
}

function HowStep({ n, text }: { n: number; text: string }): JSX.Element {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[color:var(--color-cream)] text-xs font-semibold text-[color:var(--color-slate)]">
        {n}
      </span>
      <span className="leading-6">{text}</span>
    </li>
  );
}
