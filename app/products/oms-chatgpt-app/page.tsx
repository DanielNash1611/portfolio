import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import Container from "@/components/site/Container";
import ContentSection from "@/components/site/ContentSection";
import CTASection from "@/components/site/CTASection";
import MediaFrame from "@/components/site/MediaFrame";
import MetricStrip from "@/components/site/MetricStrip";
import PageHero from "@/components/site/PageHero";
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

function ListCard({
  children,
}: {
  children: string;
}): JSX.Element {
  return (
    <li className="rounded-[1.2rem] border border-[color:var(--color-teal)]/10 bg-white/80 px-4 py-4 text-base leading-7 text-[color:var(--color-slate)]/74">
      {children}
    </li>
  );
}

function ScreenshotCard({
  title,
  description,
  src,
  alt,
}: {
  title: string;
  description: string;
  src: string;
  alt: string;
}): JSX.Element {
  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-black/6 bg-white/88 shadow-[0_20px_55px_rgba(58,61,64,0.08)]">
      <MediaFrame
        src={src}
        alt={alt}
        fallbackTitle={title}
        sizes="(min-width: 1280px) 32vw, (min-width: 768px) 50vw, 100vw"
        className="aspect-[16/10] border-b border-black/6 bg-[color:var(--color-slate)]"
        imageClassName="object-cover object-top"
        expandable
      />

      <div className="space-y-3 p-5">
        <h3 className="text-lg font-semibold text-[color:var(--color-slate)]">
          {title}
        </h3>
        <p className="text-sm leading-6 text-[color:var(--color-slate)]/68">
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

  return (
    <Container className="space-y-8 pt-6 pb-16">
      <PageHero
        eyebrow={entry.eyebrow}
        title={entry.title}
        description={entry.summary}
        tags={entry.tags}
        actions={entry.actions}
        metrics={entry.featuredMetrics}
        image={entry.heroImage}
        imageAlt={entry.heroImageAlt}
      />

      <div className="rounded-[1.5rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/90 px-5 py-4 text-sm leading-6 text-[color:var(--color-slate)]/70 shadow-[0_18px_45px_rgba(44,79,82,0.06)]">
        Designed to explore how AI agents can safely operate within enterprise
        workflows.
      </div>

      {pageContext ? (
        <PortfolioGuide
          pageContext={pageContext}
          portfolioContext={portfolioContext}
        />
      ) : null}

      <MetricStrip metrics={entry.featuredMetrics} />

      <ContentSection
        eyebrow="Product overview"
        title="What it is"
        description="A tangible workflow artifact, not just a concept statement."
      >
        <p className="max-w-3xl text-base leading-7 text-[color:var(--color-slate)]/74">
          A conversational AI interface for Order Management workflows, designed
          to make common support and operations tasks faster, clearer, and
          safer to execute.
        </p>
      </ContentSection>

      <ContentSection
        eyebrow="Problem framing"
        title="Why I built it"
        tone="muted"
      >
        <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
          OMS workflows are often fragmented across multiple tools, slow to
          execute, and difficult to automate safely because of PII constraints.
        </p>
        <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
          At the same time, early AI efforts were typically either standalone
          experiences or embedded inside existing workflows. There was not yet a
          clear pattern for AI interacting directly with internal systems
          through conversation.
        </p>
        <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
          This prototype explored that pattern.
        </p>
      </ContentSection>

      <ContentSection
        eyebrow="Workflow scope"
        title="What it does"
        description="Focused on a narrow slice of OMS work where trust and control matter."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {whatItDoes.map((item) => (
            <ListCard key={item}>{item}</ListCard>
          ))}
        </ul>
      </ContentSection>

      <ContentSection
        eyebrow="Interaction design"
        title="How it works"
        tone="muted"
      >
        <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
          Built as a custom ChatGPT App, the prototype uses mock OMS data to
          simulate real workflows without exposing PII. It was designed to live
          inside the existing AI platform environment employees were already
          using.
        </p>
        <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
          The goal was not just to simulate functionality. It was to design for
          trust, clarity, and safe execution.
        </p>
      </ContentSection>

      <ContentSection
        eyebrow="Prototype walkthrough"
        title="Live product states"
        description="Actual screens from the prototype showing how lookup, confirmation, and completed actions are handled across the workflow."
      >
        <article className="overflow-hidden rounded-[1.7rem] border border-black/6 bg-white/88 shadow-[0_24px_60px_rgba(58,61,64,0.09)]">
          <MediaFrame
            src="/images/oms-chatgpt-app/web-prototype-stylized.png"
            alt="Stylized presentation of the OMS ChatGPT App web prototype used as the primary product artifact image."
            fallbackTitle="OMS ChatGPT App web prototype"
            sizes="100vw"
            className="aspect-[16/9] border-b border-black/6 bg-[color:var(--color-slate)]"
            imageClassName="object-cover"
            expandable
            priority
          />
          <div className="grid gap-3 p-5 md:grid-cols-[minmax(0,1fr)_260px] md:items-start">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-tight text-[color:var(--color-slate)]">
                Public web prototype
              </h3>
              <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
                The standalone web version makes the core interaction pattern
                visible outside the ChatGPT shell while preserving the same OMS
                workflow structure and guardrail logic.
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/86 px-4 py-4 text-sm leading-6 text-[color:var(--color-slate)]/68">
              This is the live experience linked from the page.
            </div>
          </div>
        </article>

        <div className="grid gap-4 lg:grid-cols-3">
          {prototypeScreens.map((screen) => (
            <ScreenshotCard
              key={screen.title}
              title={screen.title}
              description={screen.description}
              src={screen.src}
              alt={screen.alt}
            />
          ))}
        </div>
      </ContentSection>

      <ContentSection
        eyebrow="Strategic takeaway"
        title="Why it matters"
        tone="muted"
      >
        <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
          This prototype introduced a new interaction model: AI acting directly
          on internal systems through conversation.
        </p>
        <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
          It helped shift thinking from AI as a standalone tool toward AI as an
          active participant in real workflows. Framed carefully, it represented
          an early example of a new pattern for conversational interaction with
          internal systems.
        </p>
      </ContentSection>

      <ContentSection
        eyebrow="Follow-on work"
        title="From prototype to real system work"
      >
        <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
          The prototype created alignment to move forward and explore production
          viability.
        </p>
        <ul className="grid gap-4 md:grid-cols-2">
          {prototypeToSystemWork.map((item) => (
            <ListCard key={item}>{item}</ListCard>
          ))}
        </ul>
      </ContentSection>

      <ContentSection
        eyebrow="Builder signal"
        title="What this proves"
        tone="muted"
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {proofPoints.map((item) => (
            <ListCard key={item}>{item}</ListCard>
          ))}
        </ul>
      </ContentSection>

      <ContentSection
        eyebrow="Scope note"
        title="Notes on the prototype"
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {prototypeNotes.map((item) => (
            <ListCard key={item}>{item}</ListCard>
          ))}
        </ul>
      </ContentSection>

      <CTASection
        title="Interested in the product logic, guardrails, or enterprise workflow angle?"
        description="This page is structured to make the prototype easy to discuss with recruiters, builders, and teams thinking about AI in real operating environments."
        primaryAction={{
          href: entry.actions?.[0]?.href ?? siteConfig.linkedinUrl,
          label: entry.actions?.[0]?.label ?? "Live prototype",
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
