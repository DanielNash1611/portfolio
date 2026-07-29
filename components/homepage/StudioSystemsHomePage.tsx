import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Portrait, { getPortrait } from "@/components/Portrait";
import RoleIntentGuide from "@/components/portfolio/RoleIntentGuide";
import MediaFrame from "@/components/site/MediaFrame";
import MotionReveal from "@/components/site/MotionReveal";
import {
  creativeEntries,
  getProductEntry,
  getThinkingEntry,
  getWorkEntry,
  homeContent,
} from "@/content/portfolio";
import { featuredTestimonials } from "@/data/testimonials";
import {
  getAllCanonicalPageContexts,
  getPortfolioContext,
} from "@/lib/portfolio-guide/context";

const featuredWork = homeContent.featuredWork
  .map((slug) => getWorkEntry(slug))
  .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

const featuredProducts = homeContent.featuredProducts
  .map((slug) => getProductEntry(slug))
  .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

const featuredThinking = homeContent.featuredThinking
  .map((slug) => getThinkingEntry(slug))
  .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

const heroPortrait = getPortrait("hero");
const casualPortrait = getPortrait("casual");
const leadTestimonial = featuredTestimonials[0];
const pageCatalog = getAllCanonicalPageContexts();
const portfolioContext = getPortfolioContext();
const featuredProjectSlugs =
  portfolioContext.featuredProjects?.map((project) => project.slug) ?? [];
const studioCreativeEntries = creativeEntries.filter((entry) =>
  ["jumping-on-coals", "tabletop-symphony", "gravity"].includes(entry.slug),
);

export default function StudioSystemsHomePage(): JSX.Element {
  return (
    <div
      data-home-look="studio"
      className="overflow-hidden bg-[#f3eee4] text-[#142733]"
    >
      <section className="relative border-b border-[#142733]/15 px-5 pb-12 pt-8 sm:px-6 md:px-8 md:pb-16 md:pt-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(#142733_0.65px,transparent_0.65px)] [background-size:7px_7px]"
        />
        <div className="relative mx-auto max-w-[1400px]">
          <MotionReveal>
            <div className="grid min-h-[calc(100svh-9rem)] items-center gap-10 lg:grid-cols-[minmax(0,1.06fr)_minmax(360px,0.72fr)] lg:gap-16">
              <div className="relative z-10 max-w-[820px]">
                <div className="mb-7 flex items-center gap-4">
                  <span className="h-px w-12 bg-[#db6048]" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.31em] text-[#254d4b]">
                    AI Product Leader
                  </p>
                </div>
                <h1 className="max-w-[13ch] text-balance font-serif text-[clamp(3.25rem,7.2vw,7.6rem)] font-medium leading-[0.88] tracking-[-0.055em]">
                  Building systems that move business and people forward.
                </h1>
                <div className="mt-8 grid gap-7 border-t border-[#142733]/18 pt-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                  <p className="max-w-2xl text-pretty text-base leading-7 text-[#142733]/72 md:text-lg md:leading-8">
                    I turn emerging AI capability into measurable outcomes,
                    trusted adoption, and better human work.
                  </p>
                  <Link
                    href="/work"
                    className="group inline-flex w-fit items-center gap-3 bg-[#173f3d] px-5 py-3.5 text-sm font-bold text-[#f3eee4] transition hover:bg-[#db6048] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#db6048] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f3eee4]"
                  >
                    Explore selected work
                    <ArrowRight
                      className="h-4 w-4 transition group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[540px] lg:justify-self-end">
                <div
                  aria-hidden="true"
                  className="absolute -left-12 -top-10 h-40 w-40 rounded-full border border-[#173f3d]/25"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-8 -right-8 h-28 w-28 bg-[#db6048]"
                />
                {heroPortrait ? (
                  <Portrait
                    variant="hero"
                    portrait={heroPortrait}
                    className="!rounded-none border border-[#142733]/18 shadow-[18px_22px_0_#dcbf8f]"
                  />
                ) : null}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 420 180"
                  className="pointer-events-none absolute -bottom-14 -left-24 z-10 hidden w-[520px] overflow-visible text-[#db6048] md:block"
                >
                  <path
                    d="M4 118C74 160 111 164 173 126C235 88 251 34 321 34C365 34 392 61 416 81"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.08}>
            <dl className="grid border-x border-t border-[#142733]/18 sm:grid-cols-2 lg:grid-cols-4">
              {homeContent.metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="border-b border-[#142733]/18 px-5 py-5 sm:px-6 lg:border-r lg:last:border-r-0"
                >
                  <dt className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.21em] text-[#254d4b]/70">
                    <span className="font-mono text-[#db6048]">
                      0{index + 1}
                    </span>
                    {metric.label}
                  </dt>
                  <dd className="mt-3 font-serif text-3xl tracking-[-0.04em] md:text-4xl">
                    {metric.value}
                  </dd>
                  {metric.detail ? (
                    <p className="mt-1 text-xs leading-5 text-[#142733]/58">
                      {metric.detail}
                    </p>
                  ) : null}
                </div>
              ))}
            </dl>
          </MotionReveal>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto max-w-[1400px]">
          <MotionReveal>
            <div className="mb-7 grid gap-4 border-b border-[#142733]/18 pb-5 md:grid-cols-[0.55fr_1.45fr] md:items-end">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#db6048]">
                A portfolio that listens
              </p>
              <p className="max-w-2xl text-sm leading-6 text-[#142733]/64">
                Give the site a role or brief and it will suggest the strongest
                evidence to examine first.
              </p>
            </div>
            <RoleIntentGuide
              pageCatalog={pageCatalog}
              featuredProjectSlugs={featuredProjectSlugs}
            />
          </MotionReveal>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <MotionReveal>
            <div className="mb-10 flex flex-col justify-between gap-5 border-b border-[#142733]/20 pb-6 md:flex-row md:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#db6048]">
                  Selected work
                </p>
                <h2 className="mt-3 max-w-[14ch] font-serif text-4xl leading-[0.98] tracking-[-0.045em] md:text-6xl">
                  Evidence, not theater.
                </h2>
              </div>
              <p className="max-w-lg text-sm leading-6 text-[#142733]/65 md:text-base">
                Enterprise adoption, platform strategy, and customer
                experience—each tied to concrete decisions and observed
                outcomes.
              </p>
            </div>
          </MotionReveal>

          <div className="space-y-0 border-b border-[#142733]/18">
            {featuredWork.map((entry, index) => (
              <MotionReveal key={entry.slug} delay={index * 0.04}>
                <article className="group grid gap-6 border-t border-[#142733]/18 py-7 md:grid-cols-[72px_minmax(240px,0.72fr)_minmax(0,1fr)] md:items-center md:gap-8 md:py-9">
                  <p className="font-mono text-xs text-[#db6048]">
                    0{index + 1}
                  </p>
                  <MediaFrame
                    src={entry.heroImage}
                    alt={entry.heroImageAlt}
                    fallbackTitle={entry.title}
                    priority={index === 0}
                    sizes="(min-width: 768px) 36vw, 100vw"
                    className="aspect-[16/10] bg-[#e2d4be]"
                    imageClassName="grayscale-[0.15] transition duration-500 group-hover:scale-[1.025]"
                  />
                  <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#254d4b]/64">
                        {entry.eyebrow}
                      </p>
                      <h3 className="mt-3 max-w-[18ch] font-serif text-3xl leading-[1.02] tracking-[-0.035em] md:text-4xl">
                        {entry.title}
                      </h3>
                      <p className="mt-4 max-w-2xl text-sm leading-6 text-[#142733]/66">
                        {entry.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                        {entry.featuredMetrics.slice(0, 2).map((metric) => (
                          <span
                            key={metric.label}
                            className="text-xs font-semibold text-[#142733]/74"
                          >
                            <strong className="text-[#db6048]">
                              {metric.value}
                            </strong>{" "}
                            {metric.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={entry.href}
                      aria-label={`Read ${entry.title}`}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#142733]/25 transition group-hover:border-[#db6048] group-hover:bg-[#db6048] group-hover:text-white"
                    >
                      <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#173f3d] px-5 py-16 text-[#f3eee4] sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <MotionReveal>
            <div className="grid gap-7 border-b border-[#f3eee4]/20 pb-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#e6a286]">
                  Live products
                </p>
                <h2 className="mt-3 max-w-[12ch] font-serif text-4xl leading-[0.98] tracking-[-0.04em] md:text-6xl">
                  Building is part of how I think.
                </h2>
              </div>
              <p className="max-w-xl self-end text-base leading-7 text-[#f3eee4]/70">
                Working products make the tradeoffs visible. They create a place
                to test the workflow, the trust model, and the experience rather
                than stopping at a strategy deck.
              </p>
            </div>
          </MotionReveal>

          <div className="grid border-b border-[#f3eee4]/18 lg:grid-cols-3">
            {featuredProducts.map((entry, index) => (
              <MotionReveal
                key={entry.slug}
                delay={index * 0.04}
                className="border-t border-[#f3eee4]/18 lg:border-r lg:last:border-r-0"
              >
                <article className="group flex h-full flex-col px-0 py-7 lg:px-7 lg:py-9">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#e6a286]">
                      0{index + 1}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#f3eee4]/48">
                      {entry.status}
                    </span>
                  </div>
                  <h3 className="mt-8 font-serif text-3xl leading-[1.03] tracking-[-0.035em]">
                    {entry.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-[#f3eee4]/64">
                    {entry.description}
                  </p>
                  <Link
                    href={entry.href}
                    className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold text-[#e6a286] transition group-hover:text-white"
                  >
                    View product
                    <ArrowRight
                      className="h-4 w-4 transition group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#142733]/16 bg-[#dfc495] px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <MotionReveal>
            <div className="grid gap-7 border-b border-[#142733]/20 pb-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#a63d2f]">
                  Creative systems
                </p>
                <h2 className="mt-3 max-w-[12ch] font-serif text-4xl leading-[0.98] tracking-[-0.04em] md:text-6xl">
                  Composition, play, and interaction.
                </h2>
              </div>
              <p className="max-w-xl self-end text-base leading-7 text-[#142733]/68">
                These projects are not a separate side of the portfolio. They
                show the same systems thinking through music, game mechanics,
                listener perspective, and live human choice.
              </p>
            </div>
          </MotionReveal>

          <div className="grid border-b border-[#142733]/18 lg:grid-cols-3">
            {studioCreativeEntries.map((entry, index) => (
              <MotionReveal
                key={entry.slug}
                delay={index * 0.04}
                className="border-t border-[#142733]/18 lg:border-r lg:last:border-r-0"
              >
                <article className="group flex h-full flex-col py-7 lg:px-6 lg:py-8">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono text-xs text-[#a63d2f]">
                      0{index + 1}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#142733]/48">
                      {entry.eyebrow}
                    </span>
                  </div>
                  {entry.heroImage ? (
                    <MediaFrame
                      src={entry.heroImage}
                      alt={entry.heroImageAlt ?? entry.title}
                      fallbackTitle={entry.title}
                      sizes="(min-width: 1024px) 30vw, 100vw"
                      className="aspect-[16/10] border border-[#142733]/18 bg-[#efe1c7]"
                      imageClassName="transition duration-500 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="aspect-[16/10] border border-[#142733]/18 bg-[radial-gradient(circle_at_35%_40%,rgba(219,96,72,0.7),transparent_2%),radial-gradient(circle_at_58%_55%,rgba(23,63,61,0.8),transparent_3%),linear-gradient(135deg,#e9d5b2,#d7b77f)]"
                    />
                  )}
                  <h3 className="mt-6 max-w-[15ch] font-serif text-3xl leading-[1.02] tracking-[-0.035em]">
                    {entry.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-[#142733]/66">
                    {entry.summary}
                  </p>
                  <Link
                    href={entry.href}
                    className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-bold text-[#173f3d] transition hover:text-[#a63d2f]"
                  >
                    Explore project
                    <ArrowRight
                      className="h-4 w-4 transition group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </article>
              </MotionReveal>
            ))}
          </div>

          <MotionReveal>
            <div className="mt-7 flex justify-end">
              <Link
                href="/creative"
                className="inline-flex items-center gap-2 border-b border-[#142733] pb-1 text-sm font-bold"
              >
                View all creative work
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <MotionReveal>
            <div className="lg:sticky lg:top-32">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#db6048]">
                Point of view
              </p>
              <h2 className="mt-3 max-w-[11ch] font-serif text-4xl leading-[0.98] tracking-[-0.04em] md:text-6xl">
                AI should expand human capability.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-[#142733]/66">
                The strongest systems improve the numbers and the experience of
                doing the work. My essays make the operating principles behind
                that belief explicit.
              </p>
            </div>
          </MotionReveal>

          <div className="border-b border-[#142733]/18">
            {featuredThinking.map((entry, index) => (
              <MotionReveal key={entry.slug} delay={index * 0.04}>
                <article className="group grid gap-5 border-t border-[#142733]/18 py-8 md:grid-cols-[56px_minmax(0,1fr)_auto] md:items-center">
                  <span className="font-mono text-xs text-[#db6048]">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#254d4b]/60">
                      {entry.readTime}
                    </p>
                    <h3 className="mt-2 max-w-[18ch] font-serif text-3xl leading-[1.05] tracking-[-0.035em]">
                      {entry.cardTitle ?? entry.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#142733]/64">
                      {entry.cardDescription ?? entry.description}
                    </p>
                  </div>
                  <Link
                    href={entry.href}
                    aria-label={`Read ${entry.title}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#142733]/24 transition group-hover:bg-[#142733] group-hover:text-[#f3eee4]"
                  >
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#142733]/16 bg-[#dfc495] px-5 py-16 sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.55fr)] lg:items-center">
          <MotionReveal>
            <blockquote>
              <p className="font-serif text-3xl leading-[1.12] tracking-[-0.03em] md:text-5xl">
                “{leadTestimonial?.short}”
              </p>
              {leadTestimonial ? (
                <footer className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#142733]/62">
                  {leadTestimonial.name} · {leadTestimonial.roleLabel}
                </footer>
              ) : null}
            </blockquote>
          </MotionReveal>

          <MotionReveal delay={0.06}>
            <div className="relative">
              {casualPortrait ? (
                <Portrait
                  variant="casual"
                  portrait={casualPortrait}
                  className="!rounded-none border border-[#142733]/18"
                />
              ) : null}
              <div className="absolute -bottom-5 -left-5 bg-[#db6048] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                Builder · Composer · Product leader
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="bg-[#142733] px-5 py-16 text-[#f3eee4] sm:px-6 md:px-8 md:py-24">
        <MotionReveal>
          <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-10 border-t border-[#f3eee4]/22 pt-9 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#e6a286]">
                Let&apos;s talk
              </p>
              <h2 className="mt-3 max-w-[17ch] font-serif text-4xl leading-[0.98] tracking-[-0.04em] md:text-6xl">
                Need someone who can understand the system, not just the
                roadmap?
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="bg-[#f3eee4] px-5 py-3.5 text-sm font-bold text-[#142733] transition hover:bg-[#e6a286]"
              >
                Contact Daniel
              </Link>
              <Link
                href="/resume"
                className="border border-[#f3eee4]/35 px-5 py-3.5 text-sm font-bold transition hover:bg-white/10"
              >
                View resume
              </Link>
            </div>
          </div>
        </MotionReveal>
      </section>
    </div>
  );
}
