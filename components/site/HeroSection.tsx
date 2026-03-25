import Link from "next/link";
import Portrait, { getPortrait } from "@/components/Portrait";
import MotionReveal from "@/components/site/MotionReveal";
import type { ActionLink } from "@/content/portfolio";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: ActionLink;
  secondaryAction: ActionLink;
};

function HeroAction({
  action,
  primary,
}: {
  action: ActionLink;
  primary: boolean;
}) {
  const className = primary
    ? "inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[color:var(--color-teal)] bg-[color:var(--color-teal)] px-5 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-[color:var(--color-slate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
    : "inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[color:var(--color-teal)]/16 bg-white px-5 py-3 text-sm font-semibold text-[color:var(--color-teal)] transition hover:bg-[color:var(--color-cream)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]";

  if (action.external) {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {action.label}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  );
}

export default function HeroSection({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}: HeroSectionProps): JSX.Element {
  const heroPortrait = getPortrait("hero");

  return (
    <MotionReveal>
      <section className="relative overflow-hidden rounded-[2.25rem] border border-black/6 bg-white/84 px-5 py-8 shadow-[0_34px_90px_rgba(58,61,64,0.12)] sm:px-6 md:px-8 md:py-10 xl:px-10 xl:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(44,79,82,0.05),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(209,122,95,0.04),_transparent_28%),radial-gradient(circle_at_right,_rgba(44,79,82,0.03),_transparent_42%)]"
        />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,430px)] lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(380px,450px)]">
          <div className="space-y-7 lg:pr-2">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[color:var(--color-teal)]/68">
                {eyebrow}
              </p>
              <h1 className="max-w-[12ch] text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-[color:var(--color-slate)] md:text-6xl xl:text-[4.35rem]">
                {title}
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-8 text-[color:var(--color-slate)]/74">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <HeroAction action={primaryAction} primary />
              <HeroAction action={secondaryAction} primary={false} />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[470px] lg:justify-self-end">
            <div className="relative w-full pt-2 lg:pt-4">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-[68%] rounded-[2.75rem] bg-[radial-gradient(circle_at_top,_rgba(44,79,82,0.11),_transparent_62%)] blur-2xl"
              />
              {heroPortrait ? (
                <div className="relative z-[1] ml-auto w-full rounded-[2.1rem] border border-white/55 bg-white/72 p-3 shadow-[0_32px_90px_rgba(44,79,82,0.15)] backdrop-blur-sm sm:p-4">
                  <Portrait
                    variant="hero"
                    portrait={heroPortrait}
                    altOverride="Daniel Nash smiling in a close-up portrait with a colorful painting softly blurred behind him."
                    className="overflow-hidden rounded-[1.8rem] border border-white/45 shadow-[0_28px_80px_rgba(44,79,82,0.16)]"
                  />
                  {/* TODO: Reuse the secondary "insight" portrait in a future About/Approach section if we want a second editorial image lower on the page. */}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </MotionReveal>
  );
}
