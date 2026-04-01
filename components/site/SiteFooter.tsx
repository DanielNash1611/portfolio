import Link from "next/link";
import Container from "@/components/site/Container";
import { siteConfig } from "@/content/portfolio";

export default function SiteFooter(): JSX.Element {
  return (
    <footer className="mt-24 border-t border-black/6 bg-white/70">
      <Container className="grid gap-8 py-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-[color:var(--color-slate)]">
            Daniel Nash
          </p>
          <p className="max-w-md text-sm leading-6 text-[color:var(--color-slate)]/68">
            AI Product Leader / Senior Product Manager focused on enterprise AI,
            workflow modernization, and product systems that translate strategy
            into measurable outcomes.
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-slate)]/52">
            Built with Codex
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-teal)]/68">
            Navigate
          </p>
          <nav className="flex flex-col gap-2 text-sm text-[color:var(--color-slate)]/74">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-fit hover:text-[color:var(--color-slate)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-teal)]/68">
            Contact
          </p>
          <div className="space-y-2 text-sm text-[color:var(--color-slate)]/74">
            <a
              href={siteConfig.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <br />
            <Link href={siteConfig.contactHref}>Contact form</Link>
            <br />
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <br />
            <a
              href={siteConfig.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Spotify
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
