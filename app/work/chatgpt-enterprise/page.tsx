import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowLeft } from "lucide-react";
import CaseStudyTemplate from "@/components/site/CaseStudyTemplate";
import Container from "@/components/site/Container";
import MediaFrame from "@/components/site/MediaFrame";
import MotionReveal from "@/components/site/MotionReveal";
import { getWorkEntry } from "@/content/portfolio";

const entry = getWorkEntry("chatgpt-enterprise");

export const metadata: Metadata = {
  title: "ChatGPT Enterprise",
  description:
    "How Daniel Nash proved enterprise AI value in the contact center, built the operating model for safe scale, and turned one pilot into a broader adoption engine.",
};

export default function ChatGptEnterprisePage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <div className="overflow-hidden pb-20 md:pb-28">
      <section className="relative isolate overflow-hidden bg-[color:var(--color-slate)] text-[color:var(--color-cream)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-16 h-80 w-80 rounded-full bg-[color:var(--color-orange)]/12 blur-3xl"
        />

        <Container className="relative grid gap-12 py-10 md:py-14 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[minmax(0,0.78fr)_minmax(500px,1.22fr)] lg:items-center lg:gap-16 lg:py-16">
          <MotionReveal className="flex h-full flex-col justify-between">
            <div>
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--color-cream)]/60 transition hover:text-[color:var(--color-tan)]"
              >
                <ArrowLeft
                  className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                />
                All case studies
              </Link>

              <div className="mt-14 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-tan)] md:mt-20">
                <span className="h-px w-10 bg-current" aria-hidden="true" />
                {entry.eyebrow}
              </div>

              <h1 className="mt-7 text-balance font-serif font-medium tracking-[-0.06em]">
                <span className="block text-[clamp(3.6rem,7vw,7.6rem)] leading-[0.82] text-[color:var(--color-cream)]">
                  ChatGPT
                  <br />
                  Enterprise
                </span>
                <span className="mt-5 block max-w-[12ch] text-[clamp(2rem,3.35vw,4.1rem)] leading-[0.94] text-[color:var(--color-tan)]">
                  from pilot to operating model
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-pretty text-base leading-7 text-[color:var(--color-cream)]/72 md:text-lg md:leading-8">
                {entry.summary}
              </p>
            </div>

            <dl className="mt-12 grid border-t border-white/16 sm:grid-cols-3 lg:mt-16">
              {[
                ["Role", entry.role],
                ["Company", entry.company],
                ["Timeline", entry.timeframe],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-b border-white/16 py-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
                >
                  <dt className="text-[9px] font-bold uppercase tracking-[0.22em] text-[color:var(--color-tan)]/64">
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-[color:var(--color-cream)]/78">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </MotionReveal>

          <MotionReveal delay={0.12} className="lg:self-stretch">
            <div className="flex h-full flex-col justify-center">
              <div className="relative pb-6 pr-4 sm:pb-8 sm:pr-7">
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 top-8 w-[44%] bg-[color:var(--color-tan)]"
                />
                <MediaFrame
                  src={entry.heroImage}
                  alt={entry.heroImageAlt}
                  fallbackTitle={entry.title}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  priority
                  expandable
                  expandLabel={`Expand ${entry.title} operating model`}
                  className="aspect-[16/10] border border-white/16 bg-white shadow-[0_24px_80px_rgba(4,16,24,0.28)]"
                  imageClassName="object-contain transition-transform duration-700 hover:scale-[1.015]"
                />
              </div>

              <div className="flex flex-col gap-5 border-t border-white/16 pt-5 sm:flex-row sm:items-start sm:justify-between">
                <p className="max-w-lg text-sm leading-6 text-[color:var(--color-cream)]/58">
                  A sanitized view of the path from workflow discovery and
                  governance through measured pilot, enablement, and scale.
                </p>
                <a
                  href="#case-study"
                  className="group inline-flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--color-tan)] transition hover:text-[color:var(--color-orange)]"
                >
                  Read the case
                  <ArrowDown
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-y-1"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <Container id="case-study" className="scroll-mt-24 pt-12 md:pt-18">
        <div className="[&>div>section:first-child]:hidden">
          <CaseStudyTemplate entry={entry} />
        </div>
      </Container>
    </div>
  );
}
