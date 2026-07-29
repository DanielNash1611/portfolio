import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/site/Container";
import { siteConfig } from "@/content/portfolio";

export default function SiteFooter(): JSX.Element {
  return (
    <footer className="border-t border-white/12 bg-[color:var(--color-slate)] text-[color:var(--color-cream)]">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 border-b border-white/16 pb-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(420px,0.65fr)] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#e6a286]">
              Build what matters
            </p>
            <p className="mt-4 max-w-[16ch] font-serif text-4xl leading-[0.98] tracking-[-0.045em] md:text-6xl">
              Systems thinking, human outcomes, and the craft to make it real.
            </p>
          </div>
          <a
            href={siteConfig.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between border-t border-white/24 py-4 text-sm font-bold uppercase tracking-[0.13em] transition hover:border-[#e6a286] hover:text-[#e6a286]"
          >
            Start a conversation
            <ArrowUpRight
              className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>

        <div className="grid gap-10 pt-8 md:grid-cols-[1.35fr_0.8fr_0.8fr]">
          <div>
            <p className="font-serif text-xl">Daniel Nash</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-[color:var(--color-cream)]/62">
              AI product leader, builder, and composer focused on measurable
              value, trusted adoption, and better human work.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[color:var(--color-cream)]/42">
              Navigate
            </p>
            <nav className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 text-sm text-[color:var(--color-cream)]/68">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-fit hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[color:var(--color-cream)]/42">
              Elsewhere
            </p>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 text-sm text-[color:var(--color-cream)]/68">
              <Link href={siteConfig.contactHref}>Contact</Link>
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href={siteConfig.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Spotify
              </a>
              <a
                href={siteConfig.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-cream)]/34">
          Built with Codex · Designed as an evolving studio
        </p>
      </Container>
    </footer>
  );
}
