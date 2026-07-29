import Link from "next/link";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import ExampleCampaignOutputSection from "@/components/launchmuse/ExampleCampaignOutputSection";
import PortfolioGuide from "@/components/portfolio/PortfolioGuide";
import Container from "@/components/site/Container";
import MediaFrame from "@/components/site/MediaFrame";
import MotionReveal from "@/components/site/MotionReveal";
import {
  siteConfig,
  type ActionLink,
  type ProductEntry,
} from "@/content/portfolio";
import {
  getPageContextByPath,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

type ProductTemplateProps = {
  entry: ProductEntry;
};

function ProductAction({
  action,
  primary = false,
  invert = false,
}: {
  action: ActionLink;
  primary?: boolean;
  invert?: boolean;
}): JSX.Element {
  const className = clsx(
    "group inline-flex items-center justify-center gap-2 border px-5 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-4",
    invert
      ? primary
        ? "border-[color:var(--color-cream)] bg-[color:var(--color-cream)] text-[color:var(--color-slate)] hover:border-[#e6a286] hover:bg-[#e6a286] focus-visible:ring-offset-[color:var(--color-slate)]"
        : "border-white/24 text-[color:var(--color-cream)] hover:border-white/50 hover:bg-white/8 focus-visible:ring-offset-[color:var(--color-slate)]"
      : primary
        ? "border-[color:var(--color-slate)] bg-[color:var(--color-slate)] text-[color:var(--color-cream)] hover:border-[color:var(--color-orange)] hover:bg-[color:var(--color-orange)] focus-visible:ring-offset-[color:var(--color-background)]"
        : "border-[color:var(--color-slate)]/24 text-[color:var(--color-slate)] hover:border-[color:var(--color-orange)] hover:text-[color:var(--color-orange)] focus-visible:ring-offset-[color:var(--color-background)]",
  );
  const icon = action.external ? (
    <ArrowUpRight
      className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      aria-hidden="true"
    />
  ) : (
    <ArrowRight
      className="h-4 w-4 transition-transform group-hover:translate-x-1"
      aria-hidden="true"
    />
  );

  if (action.external) {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {action.label}
        {icon}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {action.label}
      {icon}
    </Link>
  );
}

export default function ProductTemplate({
  entry,
}: ProductTemplateProps): JSX.Element {
  const pageContext = getPageContextByPath(entry.href);
  const portfolioContext = getPortfolioContext();
  const isLaunchMuse = entry.slug === "launchmuse";

  return (
    <div className="overflow-hidden pb-20 md:pb-28">
      <section className="relative isolate overflow-hidden bg-[color:var(--color-slate)] text-[color:var(--color-cream)]">
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-1/2 w-full bg-[linear-gradient(115deg,transparent_45%,rgba(219,96,72,0.18)_100%)]"
        />
        <Container className="relative py-6 md:py-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border-b border-white/24 pb-1 text-sm font-semibold text-[color:var(--color-cream)]/72 transition hover:border-[#ff826d] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff826d] focus-visible:ring-offset-4 focus-visible:ring-offset-[color:var(--color-slate)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to products
          </Link>
        </Container>

        <Container className="relative">
          <div className="grid min-h-[calc(100svh-9rem)] items-center gap-12 pb-14 pt-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16 lg:pb-20 lg:pt-12">
            <MotionReveal>
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff826d]">
                    {entry.eyebrow}
                  </p>
                  <span
                    aria-hidden="true"
                    className="h-px w-8 bg-white/22"
                  />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-cream)]/52">
                    {entry.status}
                  </p>
                </div>
                <h1 className="mt-5 text-balance font-serif text-[clamp(3.8rem,8vw,8.5rem)] font-medium leading-[0.86] tracking-[-0.06em]">
                  {entry.title}
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-[color:var(--color-cream)]/76 md:text-xl">
                  {entry.summary}
                </p>

                {entry.tags.length ? (
                  <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-cream)]/44">
                    {entry.tags.map((tag) => (
                      <li
                        key={tag}
                        className="relative after:absolute after:-right-3 after:text-white/20 after:content-['/'] last:after:hidden"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {entry.actions?.length ? (
                  <div className="mt-9 flex flex-wrap gap-3">
                    {entry.actions.map((action, index) => (
                      <ProductAction
                        key={`${action.href}-${action.label}`}
                        action={action}
                        primary={index === 0}
                        invert
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </MotionReveal>

            <MotionReveal delay={0.12}>
              <div className="relative lg:translate-x-8">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-5 -left-5 h-full w-full border border-white/22"
                />
                <MediaFrame
                  src={entry.heroImage}
                  alt={entry.heroImageAlt}
                  fallbackTitle={entry.title}
                  sizes="(min-width: 1400px) 760px, (min-width: 1024px) 52vw, 100vw"
                  className="group aspect-video border border-white/12 bg-[color:var(--color-background-soft)]"
                  imageClassName={clsx(
                    "object-cover transition-transform duration-700 group-hover:scale-[1.015]",
                    entry.heroImageClassName,
                  )}
                  expandable={entry.heroImageExpandable}
                  expandLabel={`Expand ${entry.title} hero image`}
                  priority
                />
              </div>
            </MotionReveal>
          </div>
        </Container>

        <div className="relative border-t border-white/14">
          <Container>
            <dl className="grid md:grid-cols-3">
              {entry.featuredMetrics.map((metric, index) => (
                <div
                  key={`${metric.label}-${metric.value}`}
                  className="border-b border-white/14 py-7 md:border-b-0 md:py-9 md:pr-7 [&:not(:first-child)]:md:border-l [&:not(:first-child)]:md:border-white/14 [&:not(:first-child)]:md:pl-7"
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ff826d]">
                    0{index + 1} · {metric.label}
                  </dt>
                  <dd className="mt-3 font-serif text-3xl leading-[1.04] tracking-[-0.04em] text-white md:text-4xl">
                    {metric.value}
                  </dd>
                  {metric.detail ? (
                    <dd className="mt-3 max-w-sm text-sm leading-6 text-[color:var(--color-cream)]/56">
                      {metric.detail}
                    </dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </section>

      <Container className="space-y-16 pt-14 md:space-y-24 md:pt-20">
        {pageContext ? (
          <PortfolioGuide
            pageContext={pageContext}
            portfolioContext={portfolioContext}
          />
        ) : null}

        <MotionReveal>
          <section className="grid gap-8 border-y border-[color:var(--color-slate)]/14 py-12 md:py-16 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,1.42fr)] lg:gap-20">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
              Product framing
            </p>
            <p className="max-w-4xl text-pretty font-serif text-2xl leading-9 tracking-[-0.02em] text-[color:var(--color-slate)] md:text-4xl md:leading-[1.2]">
              {entry.description}
            </p>
          </section>
        </MotionReveal>

        <MotionReveal>
          <section className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <article>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                01 · Problem
              </p>
              <h2 className="mt-5 max-w-[11ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] text-[color:var(--color-slate)] md:text-6xl">
                The friction this product addresses.
              </h2>
              <div className="mt-8 border-t border-[color:var(--color-slate)]/14">
                {entry.problem.map((item, index) => (
                  <p
                    key={item}
                    className="grid gap-4 border-b border-[color:var(--color-slate)]/14 py-6 text-base leading-7 text-[color:var(--color-slate)]/72 sm:grid-cols-[2.5rem_minmax(0,1fr)]"
                  >
                    <span className="font-mono text-xs tracking-[0.16em] text-[color:var(--color-orange)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </article>

            <article>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                02 · Solution
              </p>
              <h2 className="mt-5 max-w-[11ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] text-[color:var(--color-slate)] md:text-6xl">
                An intentionally narrow product wedge.
              </h2>
              <div className="mt-8 border-t border-[color:var(--color-slate)]/14">
                {entry.solution.map((item, index) => (
                  <p
                    key={item}
                    className="grid gap-4 border-b border-[color:var(--color-slate)]/14 py-6 text-base leading-7 text-[color:var(--color-slate)]/72 sm:grid-cols-[2.5rem_minmax(0,1fr)]"
                  >
                    <span className="font-mono text-xs tracking-[0.16em] text-[color:var(--color-orange)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </article>
          </section>
        </MotionReveal>

        {entry.whyThisMatters?.length ? (
          <MotionReveal>
            <section className="grid gap-10 border-y border-[color:var(--color-slate)]/14 py-12 md:py-16 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                  Why this matters
                </p>
                <h2 className="mt-5 max-w-[11ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] text-[color:var(--color-slate)] md:text-6xl">
                  The value beyond simple content planning.
                </h2>
              </div>
              <div className="space-y-6 border-t border-[color:var(--color-slate)]/14 pt-6">
                {entry.whyThisMatters.map((item) => (
                  <p
                    key={item}
                    className="max-w-3xl text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg md:leading-8"
                  >
                    {item}
                  </p>
                ))}
              </div>
            </section>
          </MotionReveal>
        ) : null}
      </Container>

      <MotionReveal>
        <section className="mt-16 bg-[color:var(--color-slate)] py-16 text-[color:var(--color-cream)] md:mt-24 md:py-24">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] lg:gap-20">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff826d]">
                  Product experience
                </p>
                <h2 className="mt-5 max-w-[9ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] md:text-6xl">
                  What the user actually does.
                </h2>
              </div>
              <div className="border-t border-white/16">
                {entry.productExperience.map((step, index) => (
                  <article
                    key={step.title}
                    className="group grid gap-5 border-b border-white/16 py-7 sm:grid-cols-[3rem_minmax(0,0.78fr)_minmax(0,1.22fr)] sm:items-start"
                  >
                    <span className="font-mono text-xs tracking-[0.18em] text-[#ff826d]">
                      0{index + 1}
                    </span>
                    <h3 className="font-serif text-2xl leading-tight tracking-[-0.025em] text-white transition-colors group-hover:text-[#ff826d] md:text-3xl">
                      {step.title}
                    </h3>
                    <p className="max-w-2xl text-base leading-7 text-[color:var(--color-cream)]/64">
                      {step.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </MotionReveal>

      <Container className="space-y-16 py-16 md:space-y-24 md:py-24">
        {entry.visuals.length ? (
          <MotionReveal>
            <section>
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] lg:gap-20">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                    Visual evidence
                  </p>
                  <h2 className="mt-5 max-w-[9ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] text-[color:var(--color-slate)] md:text-6xl">
                    See the product at work.
                  </h2>
                </div>
                <p className="max-w-2xl border-t border-[color:var(--color-slate)]/14 pt-6 text-base leading-7 text-[color:var(--color-slate)]/68 md:text-lg">
                  Current product visuals and public-safe artifacts from the
                  working experience.
                </p>
              </div>

              <div className="mt-10 border-t border-[color:var(--color-slate)]/14">
                {entry.visuals.map((asset, index) => (
                  <figure
                    key={asset.title}
                    className="grid gap-7 border-b border-[color:var(--color-slate)]/14 py-8 lg:grid-cols-[minmax(0,1.42fr)_minmax(260px,0.58fr)] lg:items-start lg:gap-10"
                  >
                    {asset.image ? (
                      <MediaFrame
                        src={asset.image}
                        alt={asset.alt ?? asset.title}
                        fallbackTitle={asset.title}
                        sizes="(min-width: 1280px) 900px, (min-width: 1024px) 68vw, 100vw"
                        className="group aspect-video border border-[color:var(--color-slate)]/12 bg-[color:var(--color-background-soft)]"
                        imageClassName={clsx(
                          asset.imageFit === "contain"
                            ? "object-contain"
                            : "object-cover",
                          "transition-transform duration-700 group-hover:scale-[1.012]",
                        )}
                        expandable={asset.expandable}
                        expandLabel={`Expand ${asset.title}`}
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center border border-dashed border-[color:var(--color-slate)]/22 bg-[color:var(--color-background-soft)] px-6 text-center text-sm font-medium text-[color:var(--color-slate)]/60">
                        Reserved for a public-safe artifact
                      </div>
                    )}
                    <figcaption className="lg:pt-1">
                      <p className="font-mono text-xs tracking-[0.18em] text-[color:var(--color-orange)]">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-4 font-serif text-3xl font-medium tracking-[-0.035em] text-[color:var(--color-slate)]">
                        {asset.title}
                      </h3>
                      <p className="mt-4 text-base leading-7 text-[color:var(--color-slate)]/68">
                        {asset.description}
                      </p>
                      {asset.todo ? (
                        <p className="mt-5 border-l-2 border-[color:var(--color-orange)] pl-4 text-sm leading-6 text-[color:var(--color-slate)]/64">
                          {asset.todo}
                        </p>
                      ) : null}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          </MotionReveal>
        ) : null}

        {entry.evaluationAndTrust?.length ? (
          <MotionReveal>
            <section className="grid gap-10 border-y border-[color:var(--color-slate)]/14 py-12 md:py-16 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] lg:gap-20">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                  Evaluation & trust
                </p>
                <h2 className="mt-5 max-w-[10ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] text-[color:var(--color-slate)] md:text-6xl">
                  Define quality before claiming confidence.
                </h2>
                <p className="mt-6 max-w-md text-base leading-7 text-[color:var(--color-slate)]/64">
                  How quality was defined, tested, and improved in a high-stakes
                  domain.
                </p>
              </div>
              <div className="border-t border-[color:var(--color-slate)]/14">
                {entry.evaluationAndTrust.map((item, index) => (
                  <article
                    key={item}
                    className="grid gap-4 border-b border-[color:var(--color-slate)]/14 py-6 sm:grid-cols-[3rem_minmax(0,1fr)]"
                  >
                    <span className="font-mono text-xs tracking-[0.18em] text-[color:var(--color-orange)]">
                      0{index + 1}
                    </span>
                    <p className="max-w-3xl text-base leading-7 text-[color:var(--color-slate)]/72">
                      {item}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </MotionReveal>
        ) : null}

        {isLaunchMuse ? (
          <MotionReveal>
            <ExampleCampaignOutputSection />
          </MotionReveal>
        ) : null}

        <MotionReveal>
          <section className="grid gap-10 border-y border-[color:var(--color-slate)]/14 py-12 md:py-16 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                What I learned
              </p>
              <h2 className="mt-5 max-w-[9ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] text-[color:var(--color-slate)] md:text-6xl">
                The product and leadership lessons.
              </h2>
            </div>
            <ol className="border-t border-[color:var(--color-slate)]/14">
              {entry.learnings.map((item, index) => (
                <li
                  key={item}
                  className="grid gap-4 border-b border-[color:var(--color-slate)]/14 py-6 sm:grid-cols-[3rem_minmax(0,1fr)]"
                >
                  <span className="font-mono text-xs tracking-[0.18em] text-[color:var(--color-orange)]">
                    0{index + 1}
                  </span>
                  <p className="max-w-3xl text-base leading-7 text-[color:var(--color-slate)]/72">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </MotionReveal>
      </Container>

      {entry.buildStory?.length ? (
        <MotionReveal>
          <section className="bg-[color:var(--color-background-soft)] py-16 md:py-24">
            <Container>
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] lg:gap-20">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-orange)]">
                    Build story
                  </p>
                  <h2 className="mt-5 max-w-[9ch] text-balance font-serif text-4xl font-medium tracking-[-0.04em] text-[color:var(--color-slate)] md:text-6xl">
                    From concept to working MVP.
                  </h2>
                  <p className="mt-6 max-w-md text-base leading-7 text-[color:var(--color-slate)]/64">
                    How the product moved from concept to working MVP and why
                    that matters.
                  </p>
                </div>
                <div className="border-t border-[color:var(--color-slate)]/14">
                  {entry.buildStory.map((item, index) => (
                    <article
                      key={item}
                      className="grid gap-4 border-b border-[color:var(--color-slate)]/14 py-6 sm:grid-cols-[3rem_minmax(0,1fr)]"
                    >
                      <span className="font-mono text-xs tracking-[0.18em] text-[color:var(--color-orange)]">
                        0{index + 1}
                      </span>
                      <p className="max-w-3xl text-base leading-7 text-[color:var(--color-slate)]/72">
                        {item}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        </MotionReveal>
      ) : null}

      <section className="bg-[color:var(--color-slate)] py-16 text-[color:var(--color-cream)] md:py-20">
        <Container>
          <MotionReveal>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff826d]">
                  Contact
                </p>
                <h2 className="mt-5 max-w-[16ch] text-balance font-serif text-4xl font-medium leading-[1.02] tracking-[-0.04em] md:text-6xl">
                  Interested in the build, prototype process, or product logic?
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--color-cream)]/68 md:text-lg">
                  These pages are intentionally structured so the product story
                  is easy to discuss with recruiters, founders, or future
                  teammates.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ProductAction
                  action={{
                    href: siteConfig.linkedinUrl,
                    label: "Connect on LinkedIn",
                    external: true,
                  }}
                  primary
                  invert
                />
                <ProductAction
                  action={{
                    href: siteConfig.contactHref,
                    label: "Send a message",
                  }}
                  invert
                />
              </div>
            </div>
          </MotionReveal>
        </Container>
      </section>
    </div>
  );
}
