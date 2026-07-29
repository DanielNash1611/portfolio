import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import Container from "@/components/site/Container";
import CTASection from "@/components/site/CTASection";
import MediaFrame from "@/components/site/MediaFrame";
import MotionReveal from "@/components/site/MotionReveal";
import { getProductEntry, siteConfig } from "@/content/portfolio";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

const entry = getProductEntry("oms-chatgpt-app");
const pageContext = getPageContextByPath("/products/oms-chatgpt-app");
const portfolioContext = getPortfolioContext();

const whatItDoes = [
  "Retrieve order details through natural language",
  "Execute order cancellations with confirmation and safeguards",
  "Provide transparent reasoning behind actions",
  "Maintain user control throughout the interaction",
];

const prototypeToSystemWork = [
  "Evaluated SSO integration for secure user access",
  "Defined PII-safe interaction patterns",
  "Built an internal MCP server to support agent workflows",
  "Explored a production-oriented architecture using Java for team alignment and a Python wrapper for the Agents SDK",
];

const proofPoints = [
  "AI can operate within enterprise constraints when designed intentionally",
  "Prototypes can unlock faster alignment than strategy documents alone",
  "Product leaders can de-risk platform investments through hands-on builds",
];

const prototypeNotes = [
  "Uses simulated data to respect the sensitivity of OMS systems",
  "Represents a functional concept rather than a production deployment",
  "Focused on validating interaction patterns, not replacing existing systems",
];

const prototypeScreens = [
  {
    title: "Order lookup inside ChatGPT",
    description:
      "Natural-language lookup returns a structured order view with status, shipping details, totals, and expandable items.",
    src: "/images/oms-chatgpt-app/order-items-chatgpt.png",
    alt: "OMS ChatGPT App order summary view inside ChatGPT showing order details and expanded line items.",
  },
  {
    title: "Cancellation with guardrails",
    description:
      "The confirmation state makes the risk explicit, requires a deliberate phrase, and keeps the user in control before submission.",
    src: "/images/oms-chatgpt-app/cancellation-guardrails-chatgpt.png",
    alt: "OMS ChatGPT App cancellation confirmation flow inside ChatGPT showing warning text and explicit confirmation controls.",
  },
  {
    title: "Completed state after action",
    description:
      "After confirmation, the assistant shows the updated order state clearly instead of hiding the result behind a generic success message.",
    src: "/images/oms-chatgpt-app/cancelled-state-chatgpt.png",
    alt: "OMS ChatGPT App order summary after cancellation showing the updated cancelled state.",
  },
];

export const metadata: Metadata = {
  title: "OMS ChatGPT App",
  description:
    "Conversational AI interface for Order Management workflows, designed to make common support and operations tasks faster, clearer, and safer to execute.",
};

function SectionLead({
  eyebrow,
  title,
  children,
  invert = false,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  invert?: boolean;
}): JSX.Element {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
      <div>
        <p
          className={`text-[11px] font-bold uppercase tracking-[0.28em] ${
            invert
              ? "text-[color:var(--color-tan)]"
              : "text-[color:var(--color-orange)]"
          }`}
        >
          {eyebrow}
        </p>
        <h2
          className={`mt-5 max-w-[12ch] text-balance text-4xl font-medium leading-[0.96] tracking-[-0.04em] md:text-6xl ${
            invert
              ? "text-[color:var(--color-cream)]"
              : "text-[color:var(--color-slate)]"
          }`}
        >
          {title}
        </h2>
      </div>
      {children ? <div className="space-y-5 lg:pt-8">{children}</div> : null}
    </div>
  );
}

function NumberedList({
  items,
  columns = false,
  invert = false,
}: {
  items: readonly string[];
  columns?: boolean;
  invert?: boolean;
}): JSX.Element {
  return (
    <ol
      className={`border-t ${
        invert
          ? "border-[color:var(--color-cream)]/16"
          : "border-[color:var(--color-slate)]/16"
      } ${columns ? "md:grid md:grid-cols-2" : ""}`}
    >
      {items.map((item, index) => (
        <li
          key={item}
          className={`grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 border-b py-5 text-base leading-7 ${
            invert
              ? "border-[color:var(--color-cream)]/16 text-[color:var(--color-cream)]/76"
              : "border-[color:var(--color-slate)]/16 text-[color:var(--color-slate)]/76"
          } ${
            columns && index % 2 === 0
              ? "md:border-r md:pr-8"
              : columns
                ? "md:pl-8"
                : ""
          }`}
        >
          <span
            className={`font-mono text-xs tracking-[0.16em] ${
              invert
                ? "text-[color:var(--color-tan)]"
                : "text-[color:var(--color-orange)]"
            }`}
          >
            0{index + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function PrototypeScreen({
  title,
  description,
  src,
  alt,
  index,
}: {
  title: string;
  description: string;
  src: string;
  alt: string;
  index: number;
}): JSX.Element {
  return (
    <article className="grid gap-7 border-t border-[color:var(--color-slate)]/16 py-9 lg:grid-cols-[minmax(0,1.22fr)_minmax(240px,0.58fr)] lg:items-center lg:gap-14">
      <div className={index % 2 === 1 ? "lg:order-2" : ""}>
        <MediaFrame
          src={src}
          alt={alt}
          fallbackTitle={title}
          sizes="(min-width: 1024px) 64vw, 100vw"
          className="group aspect-[16/10] border border-[color:var(--color-slate)]/14 bg-[color:var(--color-slate)]"
          imageClassName="object-cover object-top transition duration-700 group-hover:scale-[1.012]"
          expandable
        />
      </div>
      <div className={index % 2 === 1 ? "lg:order-1" : ""}>
        <p className="font-mono text-xs tracking-[0.16em] text-[color:var(--color-orange)]">
          0{index + 1}
        </p>
        <h3 className="mt-4 text-3xl font-medium leading-[1] tracking-[-0.035em] text-[color:var(--color-slate)] md:text-4xl">
          {title}
        </h3>
        <p className="mt-5 text-sm leading-7 text-[color:var(--color-slate)]/66">
          {description}
        </p>
      </div>
    </article>
  );
}

export default function OmsChatGptAppPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  const primaryAction = entry.actions?.[0];

  return (
    <div className="overflow-hidden pb-20 md:pb-28">
      <section className="relative overflow-hidden bg-[color:var(--color-slate)] text-[color:var(--color-cream)]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_83%_28%,rgba(223,196,149,0.12),transparent_28%),linear-gradient(112deg,rgba(23,63,61,0.52),transparent_52%)]"
        />
        <Container className="relative grid min-h-[calc(100svh-5rem)] items-center gap-12 py-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(440px,1.08fr)] lg:gap-16 lg:py-16">
          <MotionReveal>
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-tan)]">
                <span className="h-px w-12 bg-current" aria-hidden="true" />
                {entry.eyebrow} / {entry.status}
              </div>
              <h1 className="mt-8 max-w-[8ch] text-balance text-[clamp(4.5rem,7vw,8rem)] font-medium leading-[0.82] tracking-[-0.06em]">
                {entry.title}
              </h1>
              <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-[color:var(--color-cream)]/68 md:text-lg md:leading-8">
                {entry.summary}
              </p>
              <p className="mt-6 border-l-2 border-[color:var(--color-orange)] pl-4 text-sm leading-6 text-[color:var(--color-cream)]/58">
                Designed to explore how AI agents can safely operate within
                enterprise workflows.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                {primaryAction ? (
                  <a
                    href={primaryAction.href}
                    target={primaryAction.external ? "_blank" : undefined}
                    rel={
                      primaryAction.external ? "noopener noreferrer" : undefined
                    }
                    className="inline-flex items-center gap-2 border border-[color:var(--color-tan)] bg-[color:var(--color-tan)] px-5 py-3 text-sm font-bold text-[color:var(--color-slate)] transition hover:border-[color:var(--color-orange)] hover:bg-[color:var(--color-orange)]"
                  >
                    {primaryAction.label}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
                <a
                  href="#overview"
                  className="inline-flex items-center gap-2 border-b border-[color:var(--color-cream)]/44 pb-2 text-sm font-bold text-[color:var(--color-cream)]/76 transition hover:border-[color:var(--color-orange)] hover:text-[color:var(--color-orange)]"
                >
                  See how it works
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.12} className="relative lg:self-end">
            <div
              className="absolute -bottom-5 -right-5 h-[88%] w-[88%] bg-[color:var(--color-orange)]"
              aria-hidden="true"
            />
            <MediaFrame
              src={entry.heroImage}
              alt={entry.heroImageAlt}
              fallbackTitle={entry.title}
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="group aspect-[16/10] border border-white/14 bg-[#0d1e29]"
              imageClassName="object-cover object-top transition duration-700 group-hover:scale-[1.012]"
              priority
              expandable
            />
            <div className="relative mt-5 flex flex-wrap justify-between gap-3 border-t border-white/16 pt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-cream)]/48">
              <span>Public web prototype</span>
              <span>Simulated environment</span>
            </div>
          </MotionReveal>
        </Container>

        <Container className="relative border-t border-white/14">
          <dl className="grid md:grid-cols-3">
            {entry.featuredMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className={`py-6 md:px-7 ${
                  index > 0
                    ? "border-t border-white/14 md:border-l md:border-t-0"
                    : ""
                }`}
              >
                <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--color-tan)]">
                  {metric.label}
                </dt>
                <dd className="mt-3 text-xl font-medium">{metric.value}</dd>
                {metric.detail ? (
                  <p className="mt-3 max-w-[34ch] text-xs leading-5 text-[color:var(--color-cream)]/48">
                    {metric.detail}
                  </p>
                ) : null}
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-[color:var(--color-slate)]/14 pb-5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-slate)]/48"
            >
              {tag}
            </span>
          ))}
        </div>
        {pageContext ? (
          <PortfolioGuide
            pageContext={pageContext}
            portfolioContext={portfolioContext}
          />
        ) : null}
      </Container>

      <Container id="overview" className="scroll-mt-24 py-12 md:py-20">
        <MotionReveal>
          <SectionLead
            eyebrow="Product overview"
            title="A tangible workflow artifact, not just a concept statement."
          >
            <p className="text-xl leading-8 text-[color:var(--color-slate)]/84 md:text-2xl md:leading-9">
              A conversational AI interface for Order Management workflows,
              designed to make common support and operations tasks faster,
              clearer, and safer to execute.
            </p>
          </SectionLead>
        </MotionReveal>
      </Container>

      <section className="bg-[color:var(--color-background-soft)] py-16 md:py-24">
        <Container>
          <MotionReveal>
            <SectionLead eyebrow="Problem framing" title="Why I built it">
              <p className="text-xl leading-8 text-[color:var(--color-slate)]/82 md:text-2xl md:leading-9">
                OMS workflows are often fragmented across multiple tools, slow
                to execute, and difficult to automate safely because of PII
                constraints.
              </p>
              <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
                At the same time, early AI efforts were typically either
                standalone experiences or embedded inside existing workflows.
                There was not yet a clear pattern for AI interacting directly
                with internal systems through conversation.
              </p>
              <p className="font-serif text-2xl italic leading-8 text-[color:var(--color-slate)]">
                This prototype explored that pattern.
              </p>
            </SectionLead>
          </MotionReveal>
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        <MotionReveal>
          <SectionLead
            eyebrow="Workflow scope"
            title="What it does"
          >
            <p className="text-xl leading-8 text-[color:var(--color-slate)]/82 md:text-2xl md:leading-9">
              Focused on a narrow slice of OMS work where trust and control
              matter.
            </p>
          </SectionLead>
        </MotionReveal>
        <MotionReveal delay={0.08} className="mt-12">
          <NumberedList items={whatItDoes} columns />
        </MotionReveal>
      </Container>

      <section className="border-y border-[color:var(--color-slate)]/14 bg-white/34 py-16 md:py-24">
        <Container>
          <MotionReveal>
            <SectionLead eyebrow="Interaction design" title="How it works">
              <p className="text-xl leading-8 text-[color:var(--color-slate)]/82 md:text-2xl md:leading-9">
                Built as a custom ChatGPT App, the prototype uses mock OMS data
                to simulate real workflows without exposing PII. It was
                designed to live inside the existing AI platform environment
                employees were already using.
              </p>
              <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
                The goal was not just to simulate functionality. It was to
                design for trust, clarity, and safe execution.
              </p>
            </SectionLead>
          </MotionReveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <MotionReveal>
            <SectionLead
              eyebrow="Prototype walkthrough"
              title="Live product states"
            >
              <p className="text-xl leading-8 text-[color:var(--color-slate)]/82 md:text-2xl md:leading-9">
                Actual screens from the prototype showing how lookup,
                confirmation, and completed actions are handled across the
                workflow.
              </p>
            </SectionLead>
          </MotionReveal>

          <MotionReveal delay={0.08} className="mt-14">
            <figure>
              <MediaFrame
                src="/images/oms-chatgpt-app/web-prototype-stylized.png"
                alt="Stylized presentation of the OMS ChatGPT App web prototype used as the primary product artifact image."
                fallbackTitle="OMS ChatGPT App web prototype"
                sizes="100vw"
                className="group aspect-[16/9] border border-[color:var(--color-slate)]/14 bg-[color:var(--color-slate)]"
                imageClassName="object-cover transition duration-700 group-hover:scale-[1.012]"
                expandable
                priority
              />
              <figcaption className="grid gap-4 border-b border-[color:var(--color-slate)]/16 py-5 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.42fr)] md:gap-12">
                <div>
                  <h3 className="text-2xl font-medium tracking-[-0.025em] text-[color:var(--color-slate)]">
                    Public web prototype
                  </h3>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-[color:var(--color-slate)]/68">
                    The standalone web version makes the core interaction
                    pattern visible outside the ChatGPT shell while preserving
                    the same OMS workflow structure and guardrail logic.
                  </p>
                </div>
                <p className="border-l-2 border-[color:var(--color-orange)] pl-4 text-sm leading-6 text-[color:var(--color-slate)]/62">
                  This is the live experience linked from the page.
                </p>
              </figcaption>
            </figure>
          </MotionReveal>

          <div className="mt-8 border-b border-[color:var(--color-slate)]/16">
            {prototypeScreens.map((screen, index) => (
              <MotionReveal key={screen.title} delay={0.04 * index}>
                <PrototypeScreen {...screen} index={index} />
              </MotionReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[color:var(--color-slate)] py-16 text-[color:var(--color-cream)] md:py-24">
        <Container>
          <MotionReveal>
            <SectionLead
              eyebrow="Strategic takeaway"
              title="Why it matters"
              invert
            >
              <p className="text-xl leading-8 text-[color:var(--color-cream)]/82 md:text-2xl md:leading-9">
                This prototype introduced a new interaction model: AI acting
                directly on internal systems through conversation.
              </p>
              <p className="text-base leading-7 text-[color:var(--color-cream)]/62">
                It helped shift thinking from AI as a standalone tool toward AI
                as an active participant in real workflows. Framed carefully,
                it represented an early example of a new pattern for
                conversational interaction with internal systems.
              </p>
            </SectionLead>
          </MotionReveal>
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        <MotionReveal>
          <SectionLead
            eyebrow="Follow-on work"
            title="From prototype to real system work"
          >
            <p className="text-xl leading-8 text-[color:var(--color-slate)]/82 md:text-2xl md:leading-9">
              The prototype created alignment to move forward and explore
              production viability.
            </p>
          </SectionLead>
        </MotionReveal>
        <MotionReveal delay={0.08} className="mt-12">
          <NumberedList items={prototypeToSystemWork} columns />
        </MotionReveal>
      </Container>

      <section className="bg-[color:var(--color-background-soft)] py-16 md:py-24">
        <Container>
          <MotionReveal>
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                  Builder signal
                </p>
                <h2 className="mt-5 max-w-[11ch] text-balance text-4xl font-medium leading-[0.96] tracking-[-0.04em] md:text-5xl">
                  What this proves
                </h2>
                <div className="mt-9">
                  <NumberedList items={proofPoints} />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                  Scope note
                </p>
                <h2 className="mt-5 max-w-[11ch] text-balance text-4xl font-medium leading-[0.96] tracking-[-0.04em] md:text-5xl">
                  Notes on the prototype
                </h2>
                <div className="mt-9">
                  <NumberedList items={prototypeNotes} />
                </div>
              </div>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <Container className="pt-16 md:pt-24">
        <MotionReveal>
          <CTASection
            title="Interested in the product logic, guardrails, or enterprise workflow angle?"
            description="This page is structured to make the prototype easy to discuss with recruiters, builders, and teams thinking about AI in real operating environments."
            primaryAction={{
              href: primaryAction?.href ?? siteConfig.linkedinUrl,
              label: primaryAction?.label ?? "Live prototype",
              external: true,
            }}
            secondaryAction={{
              href: siteConfig.contactHref,
              label: "Send a message",
            }}
          />
        </MotionReveal>
      </Container>
    </div>
  );
}
