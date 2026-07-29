import Link from "next/link";
import clsx from "clsx";
import type { ActionLink, Metric } from "@/content/portfolio";
import MediaFrame from "@/components/site/MediaFrame";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  tags?: string[];
  actions?: ActionLink[];
  metrics?: Metric[];
  image?: string;
  imageAlt?: string;
  imageClassName?: string;
  imageExpandable?: boolean;
  compact?: boolean;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  tags,
  actions,
  metrics,
  image,
  imageAlt,
  imageClassName,
  imageExpandable,
  compact = false,
}: PageHeroProps): JSX.Element {
  const actionClassName =
    "inline-flex items-center justify-center border px-5 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]";

  return (
    <section className="relative overflow-hidden border-y border-[color:var(--color-slate)]/18 py-10 md:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-24 w-24 border-l border-[color:var(--color-orange)]/28 bg-[color:var(--color-orange)]/8"
      />
      <div
        className={clsx(
          "relative grid gap-10",
          image
            ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.58fr)] lg:items-center"
            : "",
        )}
      >
        <div className="space-y-7">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="h-px w-10 bg-[color:var(--color-orange)]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-teal)]/72">
                {eyebrow}
              </p>
            </div>
            <h1 className="max-w-[18ch] text-balance font-serif text-[clamp(2.8rem,6vw,6.4rem)] font-medium leading-[0.93] tracking-[-0.052em] text-[color:var(--color-slate)]">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-pretty text-base leading-7 text-[color:var(--color-slate)]/68 md:text-lg md:leading-8">
              {description}
            </p>
          </div>

          {tags?.length ? (
            <div className="flex flex-wrap border-l border-[color:var(--color-slate)]/16">
              {tags.map((tag, index) => (
                <span
                  key={tag}
                  className="inline-flex items-center border-r border-[color:var(--color-slate)]/16 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[color:var(--color-teal)]/68"
                >
                  <span className="mr-2 font-mono text-[color:var(--color-orange)]">
                    0{index + 1}
                  </span>
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {actions?.length ? (
            <div className="flex flex-wrap gap-3">
              {actions.map((action, index) => {
                const primary = index === 0;

                if (action.external) {
                  return (
                    <a
                      key={`${action.href}-${action.label}`}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        actionClassName,
                        primary
                          ? "border-[color:var(--color-teal)] bg-[color:var(--color-teal)] text-[color:var(--color-cream)]"
                          : "border-[color:var(--color-teal)]/22 bg-transparent text-[color:var(--color-teal)] hover:bg-white/35",
                      )}
                    >
                      {action.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={`${action.href}-${action.label}`}
                    href={action.href}
                    className={clsx(
                      actionClassName,
                      primary
                        ? "border-[color:var(--color-teal)] bg-[color:var(--color-teal)] text-[color:var(--color-cream)]"
                        : "border-[color:var(--color-teal)]/22 bg-transparent text-[color:var(--color-teal)] hover:bg-white/35",
                    )}
                  >
                    {action.label}
                  </Link>
                );
              })}
            </div>
          ) : null}

          {metrics?.length ? (
            <dl
              className={clsx(
                "grid border-l border-t border-[color:var(--color-slate)]/16",
                compact ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {metrics.map((metric) => (
                <div
                  key={`${metric.label}-${metric.value}`}
                  className="border-b border-r border-[color:var(--color-slate)]/16 px-4 py-4"
                >
                  <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-teal)]/62">
                    {metric.label}
                  </dt>
                  <dd className="mt-2 font-serif text-xl leading-tight tracking-[-0.025em] text-[color:var(--color-slate)]">
                    {metric.value}
                  </dd>
                  {metric.detail ? (
                    <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/68">
                      {metric.detail}
                    </p>
                  ) : null}
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {image ? (
          <div className="relative mr-3">
            <div
              aria-hidden="true"
              className="absolute -bottom-3 -right-3 h-full w-full bg-[color:var(--color-tan)]"
            />
            <MediaFrame
              src={image}
              alt={imageAlt ?? ""}
              fallbackTitle={title}
              sizes="(min-width: 1024px) 430px, 100vw"
              className="min-h-[280px] border border-[color:var(--color-slate)]/18 bg-[color:var(--color-background-soft)]"
              imageClassName={clsx("object-cover", imageClassName)}
              expandable={imageExpandable}
              expandLabel={`Expand ${title} hero image`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(20,39,51,0.16)_100%)]" />
            </MediaFrame>
          </div>
        ) : null}
      </div>
    </section>
  );
}
