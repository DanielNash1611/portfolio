import Link from "next/link";
import { Github, Instagram, Linkedin, Music2 } from "lucide-react";

const socials = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/daniel-a-nash/details/recommendations/?detailScreenTabIndex=0",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    href: "https://github.com/DanielNash1611",
    icon: Github,
  },
  {
    name: "Spotify",
    href: "https://open.spotify.com/artist/7AQPw7ZDSwdnCW9ciNW3U5",
    icon: Music2,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/danash1611/",
    icon: Instagram,
  },
];

const quickLinks = [
  { href: "/work", label: "Work" },
  { href: "/resume", label: "Resume" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/music", label: "Music" },
];

const Footer = (): JSX.Element => {
  return (
    <footer className="border-t border-[#2C4F52]/15 bg-[#F2E3D5]/95">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.3fr,0.8fr,0.9fr]">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-[#2C4F52]">
            Senior Product Manager across commerce, AI, platforms, and service
            operations.
          </p>
          <p className="max-w-md text-sm text-[#2C4F52]/82">
            The portfolio is organized around three hiring narratives: Senior
            Product Manager, Builder PM, and Product Leader. Music remains part
            of the story, but secondary to the hiring path.
          </p>
          <a
            href="mailto:hello@danielnash.com"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#2C4F52]/20 bg-white/80 px-4 py-2 text-sm font-semibold text-[#2C4F52] transition hover:-translate-y-0.5 hover:border-[#2C4F52]/40 hover:text-[#2C4F52] focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2E3D5]"
          >
            Contact me
            <span className="text-xs font-normal text-[#3A3D40]/80">
              hello@danielnash.com
            </span>
          </a>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2C4F52]/70">
            Quick links
          </p>
          <nav className="flex flex-col gap-2 text-sm text-[#2C4F52]/82">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit transition hover:text-[#2C4F52]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2C4F52]/70">
            Elsewhere
          </p>
          <nav aria-label="Social media" className="flex items-center gap-3">
            {socials.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${name} profile`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2C4F52]/15 text-[#2C4F52] transition hover:-translate-y-0.5 hover:bg-[#2C4F52]/10 hover:text-[#2C4F52] focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2E3D5]"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </nav>
          <p className="text-sm text-[#3A3D40]/75">
            Music lives here as a differentiator, not the main hiring path.
          </p>
        </div>
      </div>
      <div className="bg-[#2C4F52]/5 py-4">
        <p className="container text-xs text-[#3A3D40]/70">
          (c) 2026 Daniel Nash. Portfolio updated to support Senior Product
          Manager, Builder PM, and Product Leader hiring conversations.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
