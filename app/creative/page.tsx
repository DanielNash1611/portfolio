import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    <Container className="space-y-12 pb-20 pt-8 md:pb-28">
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

      <div className="grid gap-x-10 gap-y-12 lg:grid-cols-2">
        {creativeEntries.map((entry, index) => (
          <MotionReveal key={entry.slug} delay={index * 0.05}>
            <article className="group flex h-full flex-col border-t border-[color:var(--color-slate)]/20 pt-5">
              {entry.heroImage ? (
                <div className="relative aspect-[16/10] overflow-hidden border border-[color:var(--color-slate)]/16 bg-[color:var(--color-background-soft)]">
                  <Image
                    src={entry.heroImage}
                    alt={entry.heroImageAlt ?? entry.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.025]"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--color-orange)]">
                  {entry.eyebrow}
                </p>
                <h2 className="mt-4 max-w-[17ch] font-serif text-3xl font-medium leading-[1.04] tracking-[-0.035em] text-[color:var(--color-slate)] md:text-4xl">
                  {entry.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[color:var(--color-slate)]/68">
                  {entry.description}
                </p>
                <Link
                  href={entry.href}
                  className="mt-auto inline-flex w-fit items-center gap-2 border-b border-[color:var(--color-teal)] pb-1 pt-7 text-sm font-bold text-[color:var(--color-teal)] transition hover:border-[color:var(--color-orange)] hover:text-[color:var(--color-orange)]"
                >
                  Explore page
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </MotionReveal>
        ))}
      </div>
    </Container>
  );
}
