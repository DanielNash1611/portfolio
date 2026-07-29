import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Container from "@/components/site/Container";
import MediaFrame from "@/components/site/MediaFrame";
import MotionReveal from "@/components/site/MotionReveal";
import type { Metric } from "@/content/portfolio";

export type StudioCollectionEntry = {
  slug: string;
  href: string;
  title: string;
  eyebrow: string;
  meta: string;
  description: string;
  image: string;
  imageAlt: string;
  imageClassName?: string;
  metrics: Metric[];
};

type StudioCollectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  collectionEyebrow: string;
  collectionTitle: string;
  proofItems: Array<{
    label: string;
    value: string;
  }>;
  entries: StudioCollectionEntry[];
};

export default function StudioCollectionPage({
  eyebrow,
  title,
  description,
  collectionEyebrow,
  collectionTitle,
  proofItems,
  entries,
}: StudioCollectionPageProps): JSX.Element {
  const leadEntry = entries[0];

  return (
    <div className="overflow-hidden pb-20 md:pb-28">
      <Container className="py-12 md:py-20 lg:py-24">
        <section className="grid items-end gap-10 lg:grid-cols-[minmax(0,0.76fr)_minmax(440px,1.24fr)] lg:gap-16">
          <MotionReveal>
            <div className="pb-1">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-orange)]">
                <span className="h-px w-10 bg-current" aria-hidden="true" />
                {eyebrow}
              </div>
              <h1 className="mt-7 max-w-[9ch] text-balance font-serif text-[clamp(3.6rem,7.4vw,7.2rem)] font-medium leading-[0.86] tracking-[-0.06em] text-[color:var(--color-slate)]">
                {title}
              </h1>
              <p className="mt-7 max-w-[34rem] text-pretty text-base leading-8 text-[color:var(--color-slate)]/66 md:text-lg">
                {description}
              </p>
              <a
                href="#selected"
                className="group mt-8 inline-flex items-center gap-3 border-b border-[color:var(--color-teal)] pb-1.5 text-sm font-bold text-[color:var(--color-teal)] transition hover:border-[color:var(--color-orange)] hover:text-[color:var(--color-orange)]"
              >
                Browse the collection
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            </div>
          </MotionReveal>

          {leadEntry ? (
            <MotionReveal delay={0.1}>
              <Link
                href={leadEntry.href}
                aria-label={`View ${leadEntry.title}`}
                className="group block"
              >
                <div className="relative pb-6 pl-5 sm:pl-8">
                  <div
                    className="absolute bottom-0 left-0 top-8 w-[42%] bg-[color:var(--color-tan)]"
                    aria-hidden="true"
                  />
                  <MediaFrame
                    src={leadEntry.image}
                    alt={leadEntry.imageAlt}
                    fallbackTitle={leadEntry.title}
                    sizes="(min-width: 1024px) 56vw, 100vw"
                    priority
                    className="aspect-[16/11] border border-[color:var(--color-slate)]/12 bg-white"
                    imageClassName={leadEntry.imageClassName}
                  />
                </div>
                <div className="ml-5 flex items-start justify-between gap-5 border-t border-[color:var(--color-slate)]/16 pt-4 sm:ml-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--color-orange)]">
                      Featured
                    </p>
                    <p className="mt-2 font-serif text-xl leading-tight tracking-[-0.025em] text-[color:var(--color-slate)] md:text-2xl">
                      {leadEntry.title}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="mt-1 h-5 w-5 shrink-0 text-[color:var(--color-teal)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </MotionReveal>
          ) : null}
        </section>
      </Container>

      <section className="bg-[color:var(--color-slate)] text-[color:var(--color-cream)]">
        <Container>
          <dl className="grid md:grid-cols-3">
            {proofItems.map((item, index) => (
              <MotionReveal
                key={item.label}
                delay={index * 0.05}
                className="border-b border-white/12 py-7 last:border-b-0 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <dt className="text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--color-tan)]/70">
                  {item.label}
                </dt>
                <dd className="mt-3 font-serif text-2xl tracking-[-0.025em] text-[color:var(--color-cream)]">
                  {item.value}
                </dd>
              </MotionReveal>
            ))}
          </dl>
        </Container>
      </section>

      <Container id="selected" className="scroll-mt-24 pt-20 md:pt-28">
        <MotionReveal className="grid gap-8 border-b border-[color:var(--color-slate)]/16 pb-12 lg:grid-cols-[minmax(240px,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-orange)]">
              {collectionEyebrow}
            </p>
            <h2 className="mt-5 max-w-[10ch] text-balance font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] text-[color:var(--color-slate)] md:text-6xl">
              {collectionTitle}
            </h2>
          </div>
          <p className="max-w-2xl self-end text-pretty text-lg leading-8 text-[color:var(--color-slate)]/64 md:text-xl md:leading-9">
            Each project is presented as a working system: the choice that
            mattered, the evidence behind it, and what changed as a result.
          </p>
        </MotionReveal>

        <div>
          {entries.map((entry, index) => (
            <MotionReveal key={entry.slug} delay={index * 0.04}>
              <article className="group grid gap-6 border-b border-[color:var(--color-slate)]/16 py-10 md:py-14 lg:grid-cols-[52px_minmax(280px,0.88fr)_minmax(0,1.12fr)] lg:gap-10">
                <p className="font-mono text-xs text-[color:var(--color-orange)]">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <Link
                  href={entry.href}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="relative block self-start overflow-hidden bg-white"
                >
                  <MediaFrame
                    src={entry.image}
                    alt=""
                    fallbackTitle={entry.title}
                    sizes="(min-width: 1024px) 34vw, 100vw"
                    className="aspect-[16/10] border border-[color:var(--color-slate)]/12"
                    imageClassName={`transition-transform duration-700 group-hover:scale-[1.025] ${
                      entry.imageClassName ?? ""
                    }`}
                  />
                </Link>

                <div className="flex h-full flex-col">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/68">
                      {entry.eyebrow}
                    </p>
                    <span
                      className="hidden h-1 w-1 rounded-full bg-[color:var(--color-orange)] sm:block"
                      aria-hidden="true"
                    />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-slate)]/46">
                      {entry.meta}
                    </p>
                  </div>

                  <h3 className="mt-5 max-w-[15ch] text-balance font-serif text-3xl font-medium leading-[1] tracking-[-0.04em] text-[color:var(--color-slate)] md:text-4xl">
                    {entry.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-7 text-[color:var(--color-slate)]/66">
                    {entry.description}
                  </p>

                  <dl className="mt-8 grid grid-cols-2 gap-5 border-t border-[color:var(--color-slate)]/12 pt-5">
                    {entry.metrics.slice(0, 2).map((metric) => (
                      <div key={metric.label}>
                        <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-slate)]/44">
                          {metric.label}
                        </dt>
                        <dd className="mt-2 font-serif text-xl tracking-[-0.025em] text-[color:var(--color-slate)]">
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <Link
                    href={entry.href}
                    className="mt-8 inline-flex w-fit items-center gap-2 border-b border-[color:var(--color-teal)] pb-1 text-sm font-bold text-[color:var(--color-teal)] transition hover:border-[color:var(--color-orange)] hover:text-[color:var(--color-orange)]"
                  >
                    View project
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            </MotionReveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
