import type { Metadata } from "next";

const releases = [
  {
    title: "Aurora Knots EP",
    description:
      "Cinematic electronica exploring AI-assisted modulation and live cello layers.",
    platform: "Spotify",
    embedUrl:
      "https://open.spotify.com/embed/album/1A2GTWGtFfWp7KSQTwWOyo?utm_source=generator"
  },
  {
    title: "Resonant Futures (Live Session)",
    description:
      "Improvised performance scored using Sound Synthesist parameters.",
    platform: "YouTube",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    title: "Signal Run OST",
    description:
      "Soundtrack sketches for an indie game concept, blending granular synths and upright piano.",
    platform: "Spotify",
    embedUrl:
      "https://open.spotify.com/embed/track/2takcwOaAZWiXQijPHIx7B?utm_source=generator"
  }
];

export const metadata: Metadata = {
  title: "Music",
  description:
    "Listen to a cross-section of Daniel Nash's recorded work, blending orchestration with AI-assisted synthesis."
};

export default function MusicPage(): JSX.Element {
  return (
    <div className="container space-y-10 py-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal/70">
          Music Catalog
        </p>
        <h1 className="text-4xl font-semibold text-brand-teal">
          Compositions, live sessions, and collaborations
        </h1>
        <p className="max-w-2xl text-brand-slate/80">
          A snapshot of recent releases and experiments. Streams are embedded from public platforms—no autoplay, all accessible.
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        {releases.map((release) => (
          <article
            key={release.title}
            className="flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-brand-slate/10 bg-white/80 p-6 shadow-soft"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-brand-teal">
                {release.title}
              </h2>
              <p className="text-sm text-brand-slate/80">
                {release.description}
              </p>
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-brand-teal/70">
                {release.platform}
              </span>
            </div>
            <div className="aspect-video overflow-hidden rounded-2xl border border-brand-slate/10">
              <iframe
                title={`${release.title} — ${release.platform} embed`}
                src={release.embedUrl}
                allow="encrypted-media; accelerometer; clipboard-write; gyroscope; picture-in-picture"
                loading="lazy"
                className="h-full w-full border-0"
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
