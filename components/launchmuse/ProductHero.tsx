import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import Portrait, { getPortrait } from "@/components/Portrait";
import StatusBadge from "@/components/launchmuse/StatusBadge";

interface ProductHeroProps {
  title: string;
  subtitle: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  status?: string;
}

const ProductHero = ({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  status
}: ProductHeroProps): JSX.Element => {
  const ctaPortrait = getPortrait("cta-right");

  const placeholder = (
    <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-brand-slate/10 bg-white/60 shadow-soft">
      <Image
        src="/images/profile-placeholder.svg"
        alt="Portrait illustration placeholder for Daniel Nash"
        fill
        sizes="(min-width: 1024px) 280px, 100vw"
        className="object-cover"
      />
    </div>
  );

  return (
    <section className="rounded-3xl border border-brand-slate/10 bg-white/85 p-10 shadow-soft">
      <div className="grid gap-8 lg:grid-cols-[1.6fr,1fr] lg:items-center">
        <div className="space-y-6">
          <div className="space-y-4">
            {status ? <StatusBadge label={status} /> : null}
            <h1 className="text-balance text-4xl font-semibold text-brand-teal md:text-5xl">
              {title}
            </h1>
            <p className="text-lg text-brand-slate/80">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href={primaryCta.href}>
              <Button variant="primary">{primaryCta.label}</Button>
            </Link>
            {secondaryCta ? (
              <Link href={secondaryCta.href}>
                <Button variant="secondary">{secondaryCta.label}</Button>
              </Link>
            ) : null}
          </div>
        </div>
        {ctaPortrait ? (
          <Portrait
            variant="cta-right"
            portrait={ctaPortrait}
            className="w-full max-w-sm justify-self-center rounded-2xl border border-brand-slate/10 shadow-soft"
          />
        ) : (
          placeholder
        )}
      </div>
    </section>
  );
};

export default ProductHero;
