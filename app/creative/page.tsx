import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/site/Container";
import MotionReveal from "@/components/site/MotionReveal";
import PageHero from "@/components/site/PageHero";
import { creativeEntries } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Creative",
  description:
    "Creative technology and music work that deepen Daniel Nash's product portfolio.",
};

export default function CreativePage(): JSX.Element {
  return (
    <Container className="space-y-8 pt-6">
      <PageHero
        eyebrow="Creative"
        title="Creative practice that sharpens product judgment"
        description="This section is intentionally secondary to the work portfolio, but it matters. It shows the systems-thinking, experimentation, and narrative craft that feed how I build products."
        metrics={[
          { label: "Role", value: "Differentiator" },
          { label: "Themes", value: "Music + creative tech" },
          { label: "Usefulness", value: "Taste, pattern, pacing" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {creativeEntries.map((entry, index) => (
          <MotionReveal key={entry.slug} delay={index * 0.05}>
            <article className="overflow-hidden rounded-[1.75rem] border border-black/6 bg-white/86 shadow-[0_24px_60px_rgba(58,61,64,0.08)]">
              {entry.heroImage ? (
                <div className="relative aspect-[16/10] border-b border-black/6 bg-[color:var(--color-cream)]/70">
                  <Image
                    src={entry.heroImage}
                    alt={entry.heroImageAlt ?? entry.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                </div>
              ) : null}
              <div className="space-y-4 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--color-teal)]/68">
                  {entry.eyebrow}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
                  {entry.title}
                </h2>
                <p className="text-sm leading-6 text-[color:var(--color-slate)]/70">
                  {entry.description}
                </p>
                <Link
                  href={entry.href}
                  className="inline-flex items-center rounded-full bg-[color:var(--color-teal)] px-5 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-[color:var(--color-slate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
                >
                  Explore page
                </Link>
              </div>
            </article>
          </MotionReveal>
        ))}
      </div>
    </Container>
  );
}
