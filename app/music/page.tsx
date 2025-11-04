import MotionDiv from "@/components/MotionDiv";

export const metadata = {
  title: "Music | Daniel Nash",
  description:
    "Selected music by Daniel Nash at the intersection of classical training, electronic texture, and rhythm."
};

export default function MusicPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-10">
      <MotionDiv className="mb-6 text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-[#2C4F52] via-[#D17A5F] to-[#DBBF96] bg-clip-text text-transparent">
          Music by Daniel Nash
        </h1>
        <p className="text-base md:text-lg text-slate-300/90 max-w-2xl mx-auto">
          Selected pieces that sit at the intersection of classical training,
          electronic texture, and a slightly odd sense of rhythm.
        </p>
      </MotionDiv>

      {/* A Beautiful Mess */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">A Beautiful Mess</h2>
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/track/3p1KWUJ6kp6UXwIhAxU37f?utm_source=generator"
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
        <p className="text-sm text-slate-200/90">
          A spontaneous collaboration with Spencer Danielson on sax and flute. I
          performed keys, synth bass, and hand-played electronic drums— layering
          improvisation, rhythm, and emotion until the piece found its own order
          within chaos.
        </p>
      </section>

      {/* Odd Optimism */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Odd Optimism</h2>
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/track/7dla5bFVDI51S69ZsxhN8N?utm_source=generator"
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
        <p className="text-sm text-slate-200/90">
          An ode to asymmetry and persistence. Built around complex time
          signatures, <em>Odd Optimism</em> turns irregular patterns into
          momentum—a quiet statement that hope can have strange timing.
        </p>
      </section>

      {/* Kodama */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Kodama</h2>
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/track/1oYkTFQQXUl0fiGkxD5lSc?utm_source=generator"
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
        <p className="text-sm text-slate-200/90">
          Named after the spirits said to dwell within trees, <em>Kodama</em> drifts
          between acoustic resonance and digital breath. It’s a meditation on
          stillness—the sound of something alive but unseen.
        </p>
      </section>

      {/* Respite */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Respite</h2>
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/track/5N2N6PN7we8FO8OO4PePtK?utm_source=generator"
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
        <p className="text-sm text-slate-200/90">
          A small pause between larger movements. Sparse piano lines and ambient
          textures invite a moment to breathe before stepping forward again.
        </p>
      </section>

      {/* Marimba Duet */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">
          Marimba Duet for Soloist (Live + Video)
        </h2>
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/c5fJgwHkXiY"
          title="Marimba Duet for Soloist"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
        <p className="text-sm text-slate-200/90">
          A performance work for solo marimbist and projected video. The
          pre-recorded track reverses over time so the live performer eventually plays{" "}
          <em>with themself in reverse</em>—a dialogue between memory and
          immediacy.
        </p>
      </section>
    </div>
  );
}
