import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Code2,
  FileText,
  Headphones,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import GravityHero from "@/components/creative/GravityHero";
import Container from "@/components/site/Container";
import MediaFrame from "@/components/site/MediaFrame";
import MotionReveal from "@/components/site/MotionReveal";

const processSteps = [
  {
    number: "01",
    eyebrow: "Brainstorm",
    title: "Begin with the artistic question",
    body: [
      "Gravity began as an interdisciplinary concert work for cello and mobile instrumentalists. I returned to it by asking what the original performance could not do: let a listener move inside the composition and hear the same system from its center, its edge, or alongside a performer.",
      "Before choosing technology, I defined the experience principles. The cello would remain the gravitational center. Performers would enter, orbit, escape, and return. Most importantly, every performer would keep an independent musical timeline—no shared tempo, quantization, or hidden conductor.",
    ],
    icon: Sparkles,
  },
  {
    number: "02",
    eyebrow: "Product requirements",
    title: "Turn the idea into a PRD",
    body: [
      "I wrote the product requirements document as the creative contract: origin, audience, journey, core objects, musical and spatial-audio behavior, interface requirements, accessibility, MVP boundaries, and 28 explicit acceptance criteria.",
      "That document made subjective intent testable. “Make gravity audible” became visible and audible lifecycle agreement. “Preserve musical independence” became a prohibition on shared musical clocks, phase locking, and synchronized entrances.",
    ],
    icon: FileText,
  },
  {
    number: "03",
    eyebrow: "Design document",
    title: "Make the visual system buildable",
    body: [
      "Next came a focused design system rather than a loose mood board. It defined a visual thesis, interaction verbs, color and type tokens, performer shapes, eight trail cadences, listener cues, motion, accessibility, and the DOM/canvas boundary.",
      "I generated four concept images for the entry gate, Atomic field, Celestial field, and cello listening perspective. Then I converted them into named, deterministic acceptance fixtures so the build could be compared against a stable target instead of a vague request to “make it feel better.”",
    ],
    icon: ImageIcon,
  },
  {
    number: "04",
    eyebrow: "MVP",
    title: "Build the smallest complete composition",
    body: [
      "The MVP uses Vite and TypeScript, native Web Audio behind a replaceable engine boundary, and one shared simulation feeding the visual renderer and every spatial source position.",
      "Original cello and violin recordings are decoded in the browser. Each performer receives its own loop source, playback state, spatial graph, lifecycle, trail, and return schedule. The result can accumulate toward a dense field, release naturally, and return to cello alone without turning the work into a sequencer.",
    ],
    icon: Code2,
  },
] as const;

const appUrl = "https://gravity.danielnash.co";

const audioClips = [
  {
    title: "Cello sustain",
    detail: "The solitary opening and returning center of the form.",
    src: "/audio/gravity/cello-sustain-loop.m4a",
  },
  {
    title: "Violin · Pattern 1",
    detail: "A short independent loop used by an entering performer.",
    src: "/audio/gravity/violin-pattern-1-variation-1.wav",
  },
  {
    title: "Violin · Pattern 5",
    detail: "A longer contrasting pattern that drifts against the others.",
    src: "/audio/gravity/violin-pattern-5-variation-1.wav",
  },
] as const;

const conceptImages = [
  {
    title: "Entry gate",
    description:
      "Audio activation treated as an opening scene: cello alone, one action, and generous negative space.",
    src: "/images/gravity/concept/gravity-concept-entry.webp",
    alt: "Generated Gravity concept showing a luminous cello at the center of a dark gravitational field with an Enter the field action.",
  },
  {
    title: "Atomic field",
    description:
      "A cool, intimate interpretation where shape and trail cadence distinguish autonomous performers.",
    src: "/images/gravity/concept/gravity-concept-atomic.webp",
    alt: "Generated Gravity concept showing an Atomic field with a luminous cello and several orbiting performer forms.",
  },
  {
    title: "Celestial field",
    description:
      "The same system at another scale: warm light, dust-fine paths, and an invented celestial vocabulary.",
    src: "/images/gravity/concept/gravity-concept-celestial.webp",
    alt: "Generated Gravity concept showing a warm Celestial field with a star-like cello and orbiting performer forms.",
  },
  {
    title: "Listening from the cello",
    description:
      "A perspective study for hearing and seeing the piece from its gravitational center.",
    src: "/images/gravity/concept/gravity-concept-cello.webp",
    alt: "Generated Gravity concept showing a listener perspective attached to the cello with performers at several depths.",
  },
] as const;

const liveImages = [
  {
    title: "The browser entry",
    description:
      "The working audio gate keeps the cello recognizable and lets the field remain the product surface.",
    src: "/images/gravity/app/gravity-entry.png",
    alt: "Live Gravity browser MVP entry screen with a luminous cello, orbital field geometry, and an Enter the field button.",
  },
  {
    title: "Atomic",
    description:
      "Seven independent violin performers occupy one shared visual and spatial-audio coordinate system.",
    src: "/images/gravity/app/gravity-atomic-field.png",
    alt: "Live Gravity Atomic view with seven performers orbiting a luminous central cello.",
  },
  {
    title: "Celestial",
    description:
      "A warm visual interpretation of the same simulation state, with no reset to position or playback.",
    src: "/images/gravity/app/gravity-celestial-field.png",
    alt: "Live Gravity Celestial view with multiple performers around a warm luminous central cello.",
  },
] as const;

export const metadata: Metadata = {
  title: "Gravity",
  description:
    "Gravity is Daniel Nash's interactive spatial composition: an original concert work translated into a browser-native world of autonomous performers, spatial audio, and listener perspective.",
  openGraph: {
    title: "Gravity | Daniel Nash",
    description:
      "What if the audience could move inside a piece of music? The creative process behind Gravity, from brainstorm and PRD to concept art, Codex, and a working spatial-audio MVP.",
    url: "https://www.danielnash.co/creative/gravity",
    images: [
      {
        url: "/images/gravity/app/gravity-atomic-field.png",
        width: 1672,
        height: 941,
        alt: "Gravity Atomic view with independent performers orbiting a luminous central cello.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gravity | Daniel Nash",
    description:
      "An original concert work translated into an interactive spatial composition with Codex.",
    images: ["/images/gravity/app/gravity-atomic-field.png"],
  },
};

export default function GravityPage(): JSX.Element {
  return (
    <div className="overflow-hidden pb-20 md:pb-24">
      <GravityHero />

      <Container id="origin" className="scroll-mt-28 py-16 md:py-24">
        <MotionReveal>
          <section className="grid gap-10 border-b border-[color:var(--color-slate)]/12 pb-16 md:pb-24 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#287d76]">
                The original artistic question
              </p>
              <h2 className="max-w-[10ch] text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-6xl">
                Make an invisible force audible.
              </h2>
            </div>

            <div className="space-y-8">
              <p className="max-w-3xl text-pretty text-xl leading-8 text-[color:var(--color-slate)]/84 md:text-2xl md:leading-9">
                Gravity began as a live work for a cellist at the center of a
                roughly 200-seat performance space and approximately fourteen
                musicians moving around the audience.
              </p>
              <p className="max-w-3xl text-base leading-7 text-[color:var(--color-slate)]/70">
                Each mobile performer repeated one of eight patterns without
                synchronizing with anyone else. They approached the cello,
                curved into orbit, escaped through another edge of the room, and
                returned. The accumulation created the form: cello alone, a
                dense independent texture, then a gradual return to stillness.
              </p>

              <dl className="grid gap-6 border-t border-[color:var(--color-slate)]/12 pt-6 sm:grid-cols-3">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-slate)]/48">
                    Origin
                  </dt>
                  <dd className="mt-2 text-base font-semibold text-[color:var(--color-slate)]">
                    Senior recital
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-slate)]/48">
                    Core ensemble
                  </dt>
                  <dd className="mt-2 text-base font-semibold text-[color:var(--color-slate)]">
                    Cello + ~14 performers
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-slate)]/48">
                    Digital medium
                  </dt>
                  <dd className="mt-2 text-base font-semibold text-[color:var(--color-slate)]">
                    Spatial browser experience
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </MotionReveal>
      </Container>

      <MotionReveal>
        <section className="bg-[#02070b] py-8 md:py-12">
          <div className="relative mx-auto aspect-[1672/941] w-full max-w-[1672px] overflow-hidden">
            <Image
              src="/images/gravity/app/gravity-entry.png"
              alt="Live Gravity browser MVP entry screen with the cello alone in the field."
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <Container className="flex flex-col gap-3 pt-5 text-[#f4f4ed]/62 md:flex-row md:items-center md:justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#79e7d4]">
              Actual app capture
            </p>
            <p className="max-w-2xl text-sm leading-6 md:text-right">
              Browser audio activation became the opening scene, not a
              permissions modal.
            </p>
          </Container>
        </section>
      </MotionReveal>

      <section
        id="sound"
        className="scroll-mt-24 bg-[#071015] py-16 text-[#f4f4ed] md:py-24"
      >
        <Container>
          <MotionReveal>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#79e7d4]">
                  Hear the source material
                </p>
                <h2 className="max-w-[10ch] text-balance text-4xl font-semibold tracking-tight md:text-6xl">
                  One field. No shared clock.
                </h2>
                <p className="max-w-md text-base leading-7 text-[#f4f4ed]/62">
                  Start two violin clips close together and they will
                  immediately begin drifting. That independence is the musical
                  material, not an implementation accident.
                </p>
                <div className="inline-flex items-center gap-2 text-sm text-[#f4f4ed]/56">
                  <Headphones aria-hidden="true" className="h-4 w-4" />
                  Headphones recommended
                </div>
              </div>

              <div className="border-t border-[#f4f4ed]/14">
                {audioClips.map((clip, index) => (
                  <article
                    key={clip.src}
                    className="grid gap-5 border-b border-[#f4f4ed]/14 py-6 md:grid-cols-[3rem_minmax(0,1fr)] md:items-start"
                  >
                    <span className="pt-1 font-mono text-xs tracking-[0.18em] text-[#79e7d4]/72">
                      0{index + 1}
                    </span>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-semibold tracking-tight">
                          {clip.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-[#f4f4ed]/56">
                          {clip.detail}
                        </p>
                      </div>
                      <audio
                        controls
                        preload="metadata"
                        src={clip.src}
                        className="h-11 w-full max-w-xl"
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <Container id="process" className="scroll-mt-24 py-16 md:py-24">
        <MotionReveal>
          <div className="max-w-4xl space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#287d76]">
              The creative method
            </p>
            <h2 className="max-w-[13ch] text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-6xl">
              Brainstorm. Specify. Design. Build.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[color:var(--color-slate)]/68 md:text-lg">
              Codex accelerated each stage, but the sequence mattered. I did not
              begin with code; I began by deciding what the work had to
              preserve.
            </p>
          </div>
        </MotionReveal>

        <div className="mt-12 border-t border-[color:var(--color-slate)]/14">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <MotionReveal key={step.number} delay={index * 0.04}>
                <article className="grid gap-6 border-b border-[color:var(--color-slate)]/14 py-10 md:grid-cols-[5rem_minmax(220px,0.72fr)_minmax(0,1.28fr)] md:gap-10 md:py-14">
                  <div className="flex items-center gap-3 md:block">
                    <span className="font-mono text-xs tracking-[0.2em] text-[#287d76]">
                      {step.number}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className="h-5 w-5 text-[#287d76] md:mt-8 md:h-6 md:w-6"
                    />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#287d76]">
                      {step.eyebrow}
                    </p>
                    <h3 className="max-w-[13ch] text-3xl font-semibold tracking-tight text-[color:var(--color-slate)]">
                      {step.title}
                    </h3>
                  </div>
                  <div className="space-y-5 pt-1">
                    {step.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base leading-7 text-[color:var(--color-slate)]/70"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              </MotionReveal>
            );
          })}
        </div>
      </Container>

      <section className="bg-[#03080d] py-16 text-[#f4f4ed] md:py-24">
        <Container>
          <MotionReveal>
            <div className="grid gap-8 border-b border-[#f4f4ed]/14 pb-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-end">
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#79e7d4]">
                  Generated concept art
                </p>
                <h2 className="max-w-[11ch] text-balance text-4xl font-semibold tracking-tight md:text-6xl">
                  Images became requirements.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-[#f4f4ed]/62 md:justify-self-end md:text-lg">
                The concept images supplied composition, material, light, depth,
                and interface targets. They were never copied as static
                backdrops. Real simulation state, accessible controls, and
                truthful audio metadata always took priority.
              </p>
            </div>
          </MotionReveal>

          <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-2">
            {conceptImages.map((image, index) => (
              <MotionReveal key={image.src} delay={(index % 2) * 0.05}>
                <figure className="group">
                  <MediaFrame
                    src={image.src}
                    alt={image.alt}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="aspect-[1672/941] overflow-hidden border border-[#f4f4ed]/10 bg-black"
                    imageClassName="object-cover transition duration-700 group-hover:scale-[1.018]"
                    expandable
                    expandLabel={`Expand ${image.title} concept`}
                  />
                  <figcaption className="grid gap-2 border-b border-[#f4f4ed]/12 py-5 sm:grid-cols-[8rem_minmax(0,1fr)]">
                    <h3 className="text-lg font-semibold">{image.title}</h3>
                    <p className="text-sm leading-6 text-[#f4f4ed]/54">
                      {image.description}
                    </p>
                  </figcaption>
                </figure>
              </MotionReveal>
            ))}
          </div>

          <MotionReveal>
            <p className="mt-10 border-l border-[#79e7d4] pl-5 text-sm leading-6 text-[#f4f4ed]/56">
              The generated references included a few speculative instrument
              labels. The live app corrects those details: the current mobile
              library is violin, so the interface never claims clarinet or horn
              recordings that are not actually present.
            </p>
          </MotionReveal>
        </Container>
      </section>

      <Container className="py-16 md:py-24">
        <MotionReveal>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
            <div className="space-y-5 lg:sticky lg:top-32 lg:self-start">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a95836]">
                The Ultra visual-fidelity push
              </p>
              <h2 className="max-w-[11ch] text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-6xl">
                From working to worth entering.
              </h2>
              <p className="max-w-md text-base leading-7 text-[color:var(--color-slate)]/68">
                After the MVP worked, I used Codex in Ultra mode for a
                concentrated visual pass. The goal was not decoration. It was to
                close the gap between the live field and the intended atmosphere
                without breaking the musical system underneath it.
              </p>
            </div>

            <div className="border-t border-[color:var(--color-slate)]/14">
              {[
                {
                  title: "Turn references into a QA contract",
                  body: "Four deterministic fixtures fixed the viewport, simulation seed, performer count, listener state, theme, and renderer time. Each live capture could be compared side by side and as a 50% overlay.",
                },
                {
                  title: "Upgrade materials, not just color",
                  body: "The renderer gained dimensional performer forms, richer field geometry, restrained bloom, cello spectral detail, trail grammar, haze, and clearer foreground-to-distance separation.",
                },
                {
                  title: "Protect product truth",
                  body: "Visual trails still come from the same performer path used for spatial audio. Switching Atomic and Celestial preserves position and playback. Accessibility and performer autonomy remain higher priority than matching a generated pixel.",
                },
                {
                  title: "Test the actual browser",
                  body: "The pass ended in runtime captures across the entry scene, active fields, and cello perspective, plus tests for simulation, spatial mix, performer presence, visual fixtures, and renderer fallback.",
                },
              ].map((item, index) => (
                <article
                  key={item.title}
                  className="grid gap-4 border-b border-[color:var(--color-slate)]/14 py-8 sm:grid-cols-[3rem_minmax(0,1fr)]"
                >
                  <span className="pt-1 font-mono text-xs tracking-[0.18em] text-[#a95836]">
                    0{index + 1}
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
                      {item.title}
                    </h3>
                    <p className="text-base leading-7 text-[color:var(--color-slate)]/68">
                      {item.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </MotionReveal>
      </Container>

      <MotionReveal>
        <section className="bg-[#071015] py-8 md:py-12">
          <div className="relative mx-auto aspect-[1672/941] w-full max-w-[1672px] overflow-hidden">
            <Image
              src="/images/gravity/app/gravity-cello-perspective.png"
              alt="Live Gravity browser MVP from the cello listening perspective, with performers distributed across several distances."
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <Container className="grid gap-3 pt-5 text-[#f4f4ed]/62 md:grid-cols-[9rem_minmax(0,1fr)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#79e7d4]">
              Live perspective
            </p>
            <p className="max-w-3xl text-sm leading-6">
              Listening from the cello makes perspective compositional: nearby
              performers become immediate, distant performers recede into the
              shared acoustic field, and no audio timeline restarts.
            </p>
          </Container>
        </section>
      </MotionReveal>

      <Container className="py-16 md:py-24">
        <MotionReveal>
          <section className="border-y border-[color:var(--color-slate)]/14 py-12 md:py-16">
            <div className="grid gap-10 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:gap-16">
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#287d76]">
                  How Codex was used
                </p>
                <h2 className="max-w-[11ch] text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-5xl">
                  AI as translation, execution, and critique.
                </h2>
              </div>

              <div className="grid gap-8 sm:grid-cols-3">
                <div className="border-t border-[color:var(--color-slate)]/14 pt-5">
                  <FileText
                    className="h-5 w-5 text-[#287d76]"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 text-xl font-semibold text-[color:var(--color-slate)]">
                    Structure
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--color-slate)]/66">
                    Codex helped turn brainstorming into a PRD, design system,
                    implementation contract, and explicit testable boundaries.
                  </p>
                </div>
                <div className="border-t border-[color:var(--color-slate)]/14 pt-5">
                  <Code2
                    className="h-5 w-5 text-[#287d76]"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 text-xl font-semibold text-[color:var(--color-slate)]">
                    Build
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--color-slate)]/66">
                    It implemented the simulation, audio boundary, UI,
                    renderers, fixture states, tests, and browser QA workflow.
                  </p>
                </div>
                <div className="border-t border-[color:var(--color-slate)]/14 pt-5">
                  <Sparkles
                    className="h-5 w-5 text-[#287d76]"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 text-xl font-semibold text-[color:var(--color-slate)]">
                    Refine
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--color-slate)]/66">
                    Ultra mode drove the focused visual-fidelity loop against
                    the concept targets while keeping behavior and accessibility
                    intact.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-6 border-t border-[color:var(--color-slate)]/14 pt-8 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:gap-16">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#a95836]">
                The authorship boundary
              </p>
              <p className="max-w-3xl text-lg leading-8 text-[color:var(--color-slate)]/76">
                The original composition, central metaphor, musical material,
                performer-independence rule, product direction, concept
                selection, and final taste decisions are mine. Codex made it
                possible to carry that creative intent into a medium I could not
                have built this quickly on my own.
              </p>
            </div>
          </section>
        </MotionReveal>
      </Container>

      <section className="bg-[#02070b] py-16 text-[#f4f4ed] md:py-24">
        <Container>
          <MotionReveal>
            <div className="space-y-10">
              <div className="grid gap-8 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:items-end">
                <div className="space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#79e7d4]">
                    The live system
                  </p>
                  <h2 className="max-w-[10ch] text-balance text-4xl font-semibold tracking-tight md:text-6xl">
                    One simulation, two scales.
                  </h2>
                </div>
                <p className="max-w-2xl text-base leading-7 text-[#f4f4ed]/60 md:justify-self-end">
                  Atomic and Celestial are visual interpretations of one
                  composition. Every performer keeps its position, visit,
                  lifecycle, selection, and independent playback phase when the
                  view changes.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {liveImages.slice(1).map((image, index) => (
                  <figure key={image.src} className="group">
                    <MediaFrame
                      src={image.src}
                      alt={image.alt}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="aspect-[1672/941] border border-[#f4f4ed]/10 bg-black"
                      imageClassName="object-cover transition duration-700 group-hover:scale-[1.018]"
                      expandable
                      expandLabel={`Expand live ${image.title} capture`}
                    />
                    <figcaption className="grid gap-2 border-b border-[#f4f4ed]/12 py-5 sm:grid-cols-[7rem_minmax(0,1fr)]">
                      <h3 className="text-lg font-semibold">{image.title}</h3>
                      <p className="text-sm leading-6 text-[#f4f4ed]/54">
                        {image.description}
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <Container className="pt-16 md:pt-24">
        <MotionReveal>
          <section className="relative overflow-hidden rounded-[2rem] bg-[#79daca] px-6 py-10 text-[#071015] shadow-[0_30px_80px_rgba(17,72,67,0.16)] md:px-10 md:py-14">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,244,237,0.7),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(89,84,190,0.14),transparent_38%)]"
            />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#071015]/58">
                  What this changed
                </p>
                <h2 className="max-w-[16ch] text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                  The audience is no longer positioned only outside the work.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-[#071015]/70 md:text-lg">
                  Gravity can now be heard from perspectives that were
                  impossible in the concert hall. Everyone inhabits the same
                  composition, but no one has to hear exactly the same
                  performance.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/creative"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#071015]/24 px-6 py-3 text-sm font-semibold transition hover:bg-[#071015]/7"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Creative work
                </Link>
                <a
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#071015] px-6 py-3 text-sm font-semibold text-[#f4f4ed] transition hover:-translate-y-0.5 hover:bg-black"
                >
                  Open Gravity
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          </section>
        </MotionReveal>
      </Container>
    </div>
  );
}
