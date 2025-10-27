import Link from "next/link";
import clsx from "clsx";
import Button from "@/components/Button";

type CTA = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

interface HeroProps {
  title: string;
  subtitle: string;
  kicker?: string;
  primaryCta: CTA;
  secondaryCta?: CTA;
  alignment?: "left" | "center";
}

const Hero = ({
  title,
  subtitle,
  kicker,
  primaryCta,
  secondaryCta,
  alignment = "left"
}: HeroProps): JSX.Element => {
  const alignClass =
    alignment === "center" ? "text-center mx-auto" : "text-left";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-brand-slate/10 bg-white/80 p-10 shadow-soft backdrop-blur">
      <div className={clsx("mx-auto max-w-3xl space-y-6", alignClass)}>
        {kicker ? (
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal/80">
            {kicker}
          </span>
        ) : null}
        <h1 className="text-balance text-4xl font-semibold text-brand-teal md:text-5xl">
          {title}
        </h1>
        <p className="text-lg leading-relaxed text-brand-slate/80">{subtitle}</p>
        <div
          className={clsx(
            "flex flex-wrap items-center gap-4",
            alignment === "center" ? "justify-center" : "justify-start"
          )}
        >
          <Link href={primaryCta.href}>
            <Button variant={primaryCta.variant ?? "primary"}>
              {primaryCta.label}
            </Button>
          </Link>
          {secondaryCta ? (
            <Link href={secondaryCta.href}>
              <Button variant={secondaryCta.variant ?? "secondary"}>
                {secondaryCta.label}
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Hero;
