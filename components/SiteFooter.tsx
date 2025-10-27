import Link from "next/link";
import { Github, Linkedin, Music2 } from "lucide-react";

const socials = [
  {
    href: "https://www.linkedin.com",
    label: "LinkedIn",
    icon: Linkedin
  },
  {
    href: "https://github.com",
    label: "GitHub",
    icon: Github
  },
  {
    href: "https://spotify.com",
    label: "Spotify",
    icon: Music2
  }
];

const SiteFooter = (): JSX.Element => {
  return (
    <footer className="border-t border-brand-slate/10 bg-brand-cream/90">
      <div className="container grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-center">
        <div className="space-y-4">
          <p className="text-sm text-brand-slate/80">
            Bridging creativity and strategy across AI-native product design
            and composition.
          </p>
          <p className="text-xs text-brand-slate/60">
            © {new Date().getFullYear()} Daniel Nash. All rights reserved.
          </p>
        </div>
        <nav aria-label="Social media" className="flex gap-4">
          {socials.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-slate/10 text-brand-slate transition hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="bg-brand-teal/10 py-4">
        <p className="container text-xs text-brand-slate/70">
          Originally prototyped during my time at Guitar Center; this
          independent demo is rebuilt from scratch using public data and OpenAI
          APIs. No proprietary assets.
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
