import { Github, Instagram, Linkedin, Music2 } from "lucide-react";
import clsx from "clsx";

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
    icon: Music2
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/danash1611/",
    icon: Instagram
  }
];

type SocialRowProps = {
  className?: string;
};

const SocialRow = ({ className }: SocialRowProps): JSX.Element => {
  return (
    <div
      className={clsx(
        "flex flex-wrap items-center justify-center gap-4 rounded-full border border-[#2C4F52]/15 bg-white/70 px-6 py-3 shadow-soft backdrop-blur",
        className
      )}
    >
      {socials.map(({ name, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${name} profile`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#2C4F52] transition hover:bg-[#2C4F52]/10 focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
};

export default SocialRow;
