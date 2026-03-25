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
  compact = false,
}: PageHeroProps): JSX.Element {
  const actionClassName =
    "inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]";

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-black/6 bg-white/84 px-6 py-8 shadow-[0_30px_80px_rgba(58,61,64,0.1)] md:px-8 md:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(44,79,82,0.04),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(209,122,95,0.035),_transparent_42%)]"
      />
      <div
        className={clsx(
          "relative grid gap-8",
          image ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,380px)]" : "",
        )}
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-teal)]/70">
              {eyebrow}
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-5xl">
              {title}
            </h1>
            <p className="max-w-3xl text-pretty text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
              {description}
            </p>
          </div>

          {tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/75"
                >
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
                          : "border-[color:var(--color-teal)]/16 bg-white text-[color:var(--color-teal)]",
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
                        : "border-[color:var(--color-teal)]/16 bg-white text-[color:var(--color-teal)]",
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
                "grid gap-4",
                compact ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {metrics.map((metric) => (
                <div
                  key={`${metric.label}-${metric.value}`}
                  className="rounded-[1.5rem] border border-[color:var(--color-teal)]/10 bg-white/78 px-4 py-4"
                >
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/68">
                    {metric.label}
                  </dt>
                  <dd className="mt-2 text-2xl font-semibold text-[color:var(--color-slate)]">
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
          <MediaFrame
            src={image}
            alt={imageAlt ?? ""}
            fallbackTitle={title}
            sizes="(min-width: 1024px) 380px, 100vw"
            className="min-h-[280px] rounded-[1.75rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/80"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(247,245,242,0)_40%,rgba(58,61,64,0.18)_100%)]" />
          </MediaFrame>
        ) : null}
      </div>
    </section>
  );
}
