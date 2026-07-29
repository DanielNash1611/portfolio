import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getPortrait } from "@/components/Portrait";
import MotionReveal from "@/components/site/MotionReveal";
import {
  getProductEntry,
  getThinkingEntry,
  getWorkEntry,
  homeContent,
} from "@/content/portfolio";
import { featuredTestimonials } from "@/data/testimonials";

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
const leadTestimonial = featuredTestimonials[0];

const scoreTracks = [
  {
    number: "01",
    label: "Outcomes",
    color: "#1948a8",
    shape: "rounded-full",
  },
  {
    number: "02",
    label: "Systems",
    color: "#ad3028",
    shape: "rounded-none",
  },
  {
    number: "03",
    label: "Humans",
    color: "#d66d13",
    shape: "rotate-45",
  },
  {
    number: "04",
    label: "Creative",
    color: "#3c6d3f",
    shape: "[clip-path:polygon(50%_0,100%_100%,0_100%)]",
  },
] as const;

export default function LivingScoreHomePage(): JSX.Element {
  return (
    <div
      data-home-look="score"
      className="overflow-hidden bg-[#f4f0e2] text-[#171b1d]"
    >
      <section className="relative border-b border-[#171b1d]/18 px-5 pb-14 pt-9 sm:px-6 md:px-8 md:pb-20 md:pt-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(23,27,29,0.32)_1px,transparent_1px)] [background-size:100%_72px]"
        />
        <div className="relative mx-auto max-w-[1440px]">
          <MotionReveal>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#171b1d]/20 pb-5">
              <p className="text-sm font-bold uppercase tracking-[0.22em]">
                Daniel Nash
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#171b1d]/55">
                AI Product Leader · Builder · Composer
              </p>
            </div>
          </MotionReveal>

          <div className="grid min-h-[calc(100svh-10rem)] items-center gap-12 py-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(520px,1.22fr)] lg:gap-16 lg:py-12">
            <MotionReveal>
              <div>
                <h1 className="max-w-[10ch] font-serif text-[clamp(3.7rem,6.5vw,7.4rem)] font-medium leading-[0.88] tracking-[-0.06em]">
                  Complex systems. Human outcomes.
                </h1>
                <span
                  aria-hidden="true"
                  className="mt-7 block h-0.5 w-16 bg-[#1948a8]"
                />
                <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-[#171b1d]/72 md:text-lg md:leading-8">
                  I lead AI products from ambiguity to adoption—combining
                  business evidence, systems thinking, and creative judgment.
                </p>
                <Link
                  href="/work"
                  className="group mt-8 inline-flex items-center gap-4 border-b border-[#1948a8] pb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#1948a8]"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center bg-[#1948a8] text-white">
                    <ArrowRight
                      className="h-4 w-4 transition group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                  Explore the portfolio
                </Link>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.08}>
              <div className="relative py-8">
                <div className="space-y-9">
                  {scoreTracks.map((track, index) => (
                    <div
                      key={track.label}
                      className="grid grid-cols-[38px_94px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[40px_112px_minmax(0,1fr)]"
                    >
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color: track.color }}
                      >
                        {track.number}
                      </span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.19em] sm:text-xs"
                        style={{ color: track.color }}
                      >
                        {track.label}
                      </span>
                      <span
                        className="relative block h-px"
                        style={{ backgroundColor: track.color }}
                      >
                        <span
                          className={`absolute left-[22%] top-1/2 h-3 w-3 -translate-y-1/2 ${track.shape}`}
                          style={{ backgroundColor: track.color }}
                        />
                        <span
                          className="absolute right-[14%] top-1/2 h-5 w-0.5 -translate-y-1/2"
                          style={{ backgroundColor: track.color }}
                        />
                        <span
                          className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 bg-[#f4f0e2]"
                          style={{ borderColor: track.color }}
                        />
                      </span>
                    </div>
                  ))}
                </div>

                {heroPortrait ? (
                  <div className="absolute left-[52%] top-1/2 h-48 w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[48%_48%_46%_46%/38%_38%_58%_58%] border-8 border-[#f4f0e2] bg-[#d9ceb6] shadow-[0_0_0_1px_rgba(23,27,29,0.18)] sm:h-64 sm:w-52">
                    <Image
                      src={`/portraits/${heroPortrait.file}`}
                      alt={heroPortrait.alt}
                      fill
                      priority
                      sizes="208px"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                <div className="mt-16 border-t border-[#171b1d]/28 pt-4">
                  <div className="relative h-12">
                    <span className="absolute inset-x-0 top-2 h-px bg-[#171b1d]/38" />
                    {["Begin", "Develop", "Deliver", "Scale", "Next"].map(
                      (label, index) => (
                        <span
                          key={label}
                          className="absolute top-0 -translate-x-1/2"
                          style={{ left: `${index * 24 + 2}%` }}
                        >
                          <span className="mx-auto block h-4 w-px bg-[#171b1d]/58" />
                          <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.16em] text-[#171b1d]/58">
                            {label}
                          </span>
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <MotionReveal>
            <div className="grid gap-6 border-b border-[#171b1d]/22 pb-7 md:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] md:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#1948a8]">
                  01 · Work
                </p>
                <h2 className="mt-3 font-serif text-4xl tracking-[-0.045em] md:text-6xl">
                  Selected movements
                </h2>
              </div>
              <p className="max-w-xl justify-self-start text-sm leading-6 text-[#171b1d]/64 md:justify-self-end md:text-base">
                Three chapters in the same practice: align the system, make the
                tradeoffs visible, and measure what changed.
              </p>
            </div>
          </MotionReveal>

          <div className="relative border-b border-[#171b1d]/20 pl-7 md:pl-12">
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-2 top-0 w-px bg-[#171b1d]/36 md:left-4"
            />
            {featuredWork.map((entry, index) => {
              const color = scoreTracks[index % scoreTracks.length].color;

              return (
                <MotionReveal key={entry.slug} delay={index * 0.04}>
                  <article className="group relative grid gap-5 border-t border-[#171b1d]/20 py-8 md:grid-cols-[88px_minmax(260px,0.85fr)_minmax(0,1fr)_48px] md:items-center md:gap-7 md:py-10">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[1.55rem] top-11 h-3 w-3 rounded-full border-2 bg-[#f4f0e2] md:-left-[2.32rem]"
                      style={{ borderColor: color }}
                    />
                    <p
                      className="font-serif text-3xl tracking-[-0.04em]"
                      style={{ color }}
                    >
                      0{index + 1}
                    </p>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#171b1d]/52">
                        {entry.role}
                      </p>
                      <h3
                        className="mt-2 font-serif text-3xl leading-[1.02] tracking-[-0.04em] md:text-4xl"
                        style={{ color }}
                      >
                        {entry.title}
                      </h3>
                    </div>
                    <div>
                      <p className="max-w-2xl text-sm leading-6 text-[#171b1d]/66">
                        {entry.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                        {entry.featuredMetrics.slice(0, 2).map((metric) => (
                          <span
                            key={metric.label}
                            className="text-xs font-semibold text-[#171b1d]/68"
                          >
                            <strong style={{ color }}>{metric.value}</strong>{" "}
                            {metric.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={entry.href}
                      aria-label={`Read ${entry.title}`}
                      className="inline-flex h-11 w-11 items-center justify-center border border-[#171b1d]/25 transition group-hover:-translate-y-1 group-hover:border-[#171b1d] group-hover:bg-[#171b1d] group-hover:text-[#f4f0e2]"
                    >
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </article>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[#171b1d]/18 bg-[#e8e0cb] px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <MotionReveal>
            <div className="grid gap-5 md:grid-cols-[0.65fr_1.35fr] md:items-end">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ad3028]">
                  02 · Products
                </p>
                <h2 className="mt-3 font-serif text-4xl tracking-[-0.045em] md:text-6xl">
                  Working studies
                </h2>
              </div>
              <p className="max-w-xl justify-self-end text-sm leading-6 text-[#171b1d]/64 md:text-base">
                Live and emerging products where strategy becomes a workflow
                someone can actually use.
              </p>
            </div>
          </MotionReveal>

          <div className="mt-9 grid border-b border-[#171b1d]/20 lg:grid-cols-3">
            {featuredProducts.map((entry, index) => {
              const track = scoreTracks[(index + 1) % scoreTracks.length];

              return (
                <MotionReveal
                  key={entry.slug}
                  delay={index * 0.04}
                  className="border-t border-[#171b1d]/20 lg:border-r lg:last:border-r-0"
                >
                  <article className="group flex h-full min-h-[360px] flex-col py-7 lg:px-7 lg:py-9">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color: track.color }}
                      >
                        0{index + 1}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.21em] text-[#171b1d]/48">
                        {entry.status}
                      </span>
                    </div>
                    <h3
                      className="mt-14 max-w-[12ch] font-serif text-4xl leading-[0.98] tracking-[-0.04em]"
                      style={{ color: track.color }}
                    >
                      {entry.title}
                    </h3>
                    <p className="mt-5 text-sm leading-6 text-[#171b1d]/65">
                      {entry.description}
                    </p>
                    <Link
                      href={entry.href}
                      className="mt-auto inline-flex items-center gap-3 pt-8 text-xs font-bold uppercase tracking-[0.16em]"
                      style={{ color: track.color }}
                    >
                      View product
                      <ArrowRight
                        className="h-4 w-4 transition group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </article>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
          <MotionReveal>
            <div className="lg:sticky lg:top-32">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d66d13]">
                03 · Thinking
              </p>
              <h2 className="mt-3 max-w-[11ch] font-serif text-4xl leading-[0.98] tracking-[-0.045em] md:text-6xl">
                Notes in the margin
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-[#171b1d]/64">
                Product principles drawn from the work: workflow before model,
                trust as a requirement, and human capability as an outcome.
              </p>
            </div>
          </MotionReveal>

          <div className="border-b border-[#171b1d]/20">
            {featuredThinking.map((entry, index) => {
              const color = scoreTracks[(index + 2) % scoreTracks.length].color;

              return (
                <MotionReveal key={entry.slug} delay={index * 0.04}>
                  <article className="group border-t border-[#171b1d]/20 py-8">
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color }}
                      >
                        0{index + 1}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#171b1d]/48">
                        {entry.readTime}
                      </span>
                    </div>
                    <h3 className="mt-7 max-w-[19ch] font-serif text-3xl leading-[1.02] tracking-[-0.04em] md:text-5xl">
                      {entry.cardTitle ?? entry.title}
                    </h3>
                    <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
                      <p className="max-w-2xl text-sm leading-6 text-[#171b1d]/64">
                        {entry.cardDescription ?? entry.description}
                      </p>
                      <Link
                        href={entry.href}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]"
                        style={{ color }}
                      >
                        Read essay
                        <ArrowUpRight
                          className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </article>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#1948a8] px-5 py-16 text-[#f4f0e2] sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.35fr_1.65fr]">
          <MotionReveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#f4f0e2]/62">
              04 · Witness
            </p>
          </MotionReveal>
          <MotionReveal delay={0.04}>
            <blockquote>
              <p className="max-w-[30ch] font-serif text-3xl leading-[1.1] tracking-[-0.035em] md:text-5xl">
                “{leadTestimonial?.short}”
              </p>
              {leadTestimonial ? (
                <footer className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4f0e2]/64">
                  {leadTestimonial.name} · {leadTestimonial.roleLabel}
                </footer>
              ) : null}
            </blockquote>
          </MotionReveal>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <MotionReveal>
          <div className="mx-auto grid max-w-[1440px] gap-10 border-t border-[#171b1d]/22 pt-9 lg:grid-cols-[0.45fr_1.55fr] lg:items-end">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#3c6d3f]">
              Finale · Next
            </p>
            <div className="flex flex-col justify-between gap-9 md:flex-row md:items-end">
              <h2 className="max-w-[15ch] font-serif text-4xl leading-[0.98] tracking-[-0.045em] md:text-6xl">
                Let&apos;s make the next system worth using.
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="bg-[#171b1d] px-5 py-3.5 text-sm font-bold text-[#f4f0e2] transition hover:bg-[#1948a8]"
                >
                  Contact Daniel
                </Link>
                <Link
                  href="/resume"
                  className="border border-[#171b1d]/28 px-5 py-3.5 text-sm font-bold transition hover:border-[#171b1d] hover:bg-[#171b1d]/5"
                >
                  View resume
                </Link>
              </div>
            </div>
          </div>
        </MotionReveal>
      </section>
    </div>
  );
}
