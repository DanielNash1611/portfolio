import { Github, Instagram, Linkedin, Spotify } from "lucide-react";

const socials = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/daniel-a-nash/details/recommendations/?detailScreenTabIndex=0",
    icon: Linkedin
  },
  {
    name: "GitHub",
    href: "https://github.com/DanielNash1611",
    icon: Github
  },
  {
    name: "Spotify",
    href: "https://open.spotify.com/artist/7AQPw7ZDSwdnCW9ciNW3U5",
    icon: Spotify
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/danash1611/",
    icon: Instagram
  }
];

const Footer = (): JSX.Element => {
  return (
    <footer className="border-t border-[#2C4F52]/15 bg-[#F2E3D5]/95">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-[#2C4F52]/90">
            Bridging creativity and strategy across AI-native products and composition.
          </p>
          <p className="text-xs text-[#3A3D40]/80">
            © 2025 Daniel Nash. All rights reserved.
          </p>
        </div>
        <nav aria-label="Social media" className="flex items-center gap-3">
          {socials.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${name} profile`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2C4F52]/15 text-[#2C4F52] transition hover:bg-[#2C4F52]/10 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2E3D5]"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
      <div className="bg-[#2C4F52]/5 py-4">
        <p className="container text-xs text-[#3A3D40]/70">
          Originally prototyped during my time at Guitar Center; this independent demo is rebuilt from scratch using public data and OpenAI APIs. No proprietary assets.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
