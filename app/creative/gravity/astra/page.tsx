import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Minus,
} from "lucide-react";
import GravityEvolutionSlides from "@/components/creative/GravityEvolutionSlides";
import Container from "@/components/site/Container";
import MediaFrame from "@/components/site/MediaFrame";
import MotionReveal from "@/components/site/MotionReveal";

const appUrl = "https://gravity.danielnash.co";

const capabilities = [
  {
    number: "01",
    title: "A space you can enter",
    body: "Free movement, cello and performer perspectives, and an audible listener position turned the field from a scene into a place.",
  },
  {
    number: "02",
    title: "Orbits with real depth",
    body: "Each performer now moves through its own trajectory-defined orbital plane. The renderer and spatial-audio engine read the same position.",
  },
  {
    number: "03",
    title: "Three-dimensional worlds",
    body: "The static Atomic and Celestial backdrops became complete environments, with four quantum regions and four galaxies staged at different distances.",
  },
  {
    number: "04",
    title: "Blender-built musical bodies",
    body: "Astra made Blender part of the working loop. The cello and six mobile instrument types gained stronger 3D forms, better animation, distinct silhouettes, and a textured cello surface.",
  },
  {
    number: "05",
    title: "An embodied input layer",
    body: "Local webcam processing lets a visitor point, grab, follow, turn, zoom, and launch new sounds while keeping mouse and keyboard controls intact.",
  },
  {
    number: "06",
    title: "A way to study the experience",
    body: "Local session recording pairs Gravity audio and a camera inset with a timestamped event log, making interaction problems observable instead of anecdotal.",
  },
] as const;

const blenderEvolution = [
  {
    number: "01",
    label: "Model",
    title: "Recognizable bodies",
    body: "A Blender-authored cello and instrument family replaced flatter geometric approximations with more convincing three-dimensional forms.",
  },
  {
    number: "02",
    label: "Surface + motion",
    title: "Texture that could move",
    body: "The cello gained a material texture, while stronger animation made each instrument feel like a body traveling through space rather than a marker crossing a screen.",
  },
  {
    number: "03",
    label: "World",
    title: "Depth all the way out",
    body: "Once the objects had volume, the static backdrop broke the illusion. Atomic and Celestial became 3D environments with galaxies placed at varying distances.",
  },
] as const;

const filmTranscript = [
  {
    time: "00–08",
    text: "Reach into the music. Grab a sound. Pull back. Let go.",
  },
  {
    time: "08–15",
    text: "Every shape carries a sound. Independent musical patterns, pulled into orbit.",
  },
  {
    time: "15–22",
    text: "The cello is the center. The other performers move around it, each in their own time.",
  },
  {
    time: "22–31",
    text: "Move through the music. Two hands change where you listen.",
  },
  {
    time: "31–39",
    text: "Hear it from inside the orbit. Grab a performer to follow its journey.",
  },
  {
    time: "39–47",
    text: "One composition. Two worlds. Point to both sides: Celestial becomes Atomic.",
  },
  {
    time: "47–54",
    text: "Astra opened a new creative door. Music × Blender × hand tracking × spatial audio.",
  },
  {
    time: "54–60",
    text: "Gravity. Reach into the music.",
  },
] as const;

const decisionChanges = [
  {
    label: "World switching",
    before: "Wave or use broad two-hand expansion and contraction gestures.",
    after:
      "Point at the two visible side controls together, or choose a world in Explore.",
  },
  {
    label: "Holding and launching",
    before:
      "Depend on a precise pinch and let finger closure move the cursor.",
    after:
      "Use a relaxed grab, anchor the target before closure, and move with the palm. Pinch remains an alternate input.",
  },
  {
    label: "Feedback",
    before: "Ask the visitor to infer whether the system understood them.",
    after:
      "Show the target, dwell progress, spring tension, release state, and a clear path to cancel.",
  },
  {
    label: "Scope",
    before: "Treat a larger gesture vocabulary as a more magical experience.",
    after:
      "Ship a smaller reliable grammar. Keep swipes and full-hand world gestures as documented experiments.",
  },
] as const;

const workingMethod = [
  {
    number: "01",
    title: "Turn the artistic intent into a contract.",
    body: "I kept the PRD as the center of the work: the cello stays fixed, performers stay autonomous, and every visible position must agree with what the listener hears.",
  },
  {
    number: "02",
    title: "Let the medium change the stack.",
    body: "Astra made it practical to bring Blender into the iteration loop, carry richer assets into the browser, and judge the models, motion, materials, and environment as one experience.",
  },
  {
    number: "03",
    title: "Ask for whole-system changes.",
    body: "With Astra, a product observation could travel through interaction rules, physics, rendering, audio, accessibility, documentation, and tests in one connected loop.",
  },
  {
    number: "04",
    title: "Inspect the experience, not just the code.",
    body: "I used browser captures, full-session recordings, event logs, performance profiles, and repeatable regressions to see where the rendered behavior diverged from the idea.",
  },
  {
    number: "05",
    title: "Let people overrule the prototype.",
    body: "Synthetic tests could prove that a gesture fired once. They could not prove that it felt immediate, comfortable, or worth learning. Human behavior made the final call.",
  },
] as const;

export const metadata: Metadata = {
  title: "Gravity with Astra",
  description:
    "How Daniel Nash used Astra and Blender to deepen Gravity's 3D spatial music system—and simplified the hand controls after watching real people, including his five-year-old, struggle with the first gesture model.",
  openGraph: {
    title: "Gravity with Astra | Daniel Nash",
    description:
      "A product and creative-technology follow-up about Astra, Blender, spatial interaction, and the decisions that changed after hands-on testing.",
    url: "https://www.danielnash.co/creative/gravity/astra",
    images: [
      {
        url: "/images/gravity/astra/celestial-orbits.webp",
        width: 1494,
        height: 900,
        alt: "Gravity's expanded Celestial field with sculptural performers orbiting a luminous cello in three dimensions.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gravity with Astra | Daniel Nash",
    description:
      "The next chapter of Gravity: a more capable spatial instrument shaped by a much simpler interaction model.",
    images: ["/images/gravity/astra/celestial-orbits.webp"],
  },
};

export default function GravityAstraPage(): JSX.Element {
  return (
    <div className="overflow-hidden bg-[#030708] text-[#eef7f4]">
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden border-b border-white/10">
        <Image
          src="/images/gravity/astra/celestial-orbits.webp"
          alt="Gravity's expanded Celestial field with sculptural performers orbiting a luminous cello in three dimensions."
          fill
          priority
          className="object-cover object-[58%_center]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,8,0.98)_0%,rgba(3,7,8,0.83)_40%,rgba(3,7,8,0.24)_72%,rgba(3,7,8,0.5)_100%),linear-gradient(0deg,rgba(3,7,8,0.92)_0%,transparent_42%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_58%_47%,rgba(219,159,71,0.12),transparent_28%),radial-gradient(circle_at_12%_20%,rgba(112,226,211,0.12),transparent_20%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-[1500px] flex-col justify-between px-5 py-8 sm:px-7 md:px-10 md:py-10 lg:px-14">
          <MotionReveal className="flex items-center justify-between gap-6">
            <Link
              href="/creative/gravity"
              className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/58 transition hover:text-white"
            >
              <ArrowLeft
                className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
              Gravity · chapter one
            </Link>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-[#efb65e] sm:block">
              Product field notes · 2026
            </span>
          </MotionReveal>

          <MotionReveal delay={0.08} className="max-w-[760px] pb-5 pt-20">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7fe0d3]">
              Gravity × Astra
            </p>
            <h1 className="mt-5 font-serif text-[clamp(5.2rem,12vw,10.5rem)] font-medium leading-[0.74] tracking-[-0.065em] text-white">
              Gravity
            </h1>
            <p className="mt-7 max-w-[18ch] text-balance font-serif text-[clamp(2rem,4vw,4.6rem)] leading-[0.95] tracking-[-0.045em] text-white">
              More capable. Less complicated.
            </p>
            <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-white/64 md:text-lg md:leading-8">
              Astra helped me push a browser composition into a navigable 3D
              spatial instrument. Testing taught me where to pull back.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#decisions"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#7fe0d3] px-6 py-3 text-sm font-semibold text-[#04100f] transition hover:-translate-y-0.5 hover:bg-white"
              >
                See what changed
                <ArrowDown
                  className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/24 bg-black/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-black/38"
              >
                Open Gravity
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </MotionReveal>

          <MotionReveal
            delay={0.16}
            className="grid gap-3 border-t border-white/14 pt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/44 sm:grid-cols-3"
          >
            <span>Spatial composition</span>
            <span>Human-tested interaction</span>
            <span className="sm:text-right">Astra + Blender</span>
          </MotionReveal>
        </div>
      </section>

      <section className="bg-[#e9ece5] text-[#0b1516]">
        <Container className="py-20 md:py-28 lg:py-32">
          <MotionReveal className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:gap-24">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#21796f]">
                The second build
              </p>
              <h2 className="mt-5 max-w-[10ch] text-balance font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-7xl">
                Astra widened the possible.
              </h2>
            </div>
            <div className="max-w-3xl self-end space-y-6 text-pretty text-lg leading-8 text-[#0b1516]/66 md:text-xl md:leading-9">
              <p>
                The first browser version proved the composition could work:
                independent performers, spatial audio, and two views of one
                gravitational system. With Astra, I could work at the scale of
                the whole experience rather than one feature at a time.
              </p>
              <p>
                A product observation could become a revised interaction rule,
                a physics and audio change, a visual treatment, a browser test,
                and a documented decision in the same working loop. That made a
                much more ambitious version practical—but it did not make every
                ambitious idea good.
              </p>
            </div>
          </MotionReveal>

          <dl className="mt-16 border-t border-[#0b1516]/18 md:mt-20">
            {capabilities.map((capability, index) => (
              <MotionReveal key={capability.number} delay={(index % 3) * 0.035}>
                <div className="grid gap-4 border-b border-[#0b1516]/14 py-7 md:grid-cols-[4rem_minmax(220px,0.7fr)_minmax(0,1.3fr)] md:items-baseline md:gap-8">
                  <dt className="text-xs font-semibold tracking-[0.18em] text-[#21796f]">
                    {capability.number}
                  </dt>
                  <dd className="font-serif text-2xl tracking-[-0.025em] md:text-3xl">
                    {capability.title}
                  </dd>
                  <dd className="max-w-2xl text-sm leading-7 text-[#0b1516]/58 md:text-base">
                    {capability.body}
                  </dd>
                </div>
              </MotionReveal>
            ))}
          </dl>
        </Container>
      </section>

      <section
        id="blender"
        className="relative overflow-hidden border-y border-white/10 bg-[#071011]"
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_84%_18%,rgba(127,224,211,0.1),transparent_28%),radial-gradient(circle_at_16%_82%,rgba(239,182,94,0.08),transparent_24%)]"
          aria-hidden="true"
        />
        <Container className="relative py-20 md:py-28 lg:py-32">
          <MotionReveal className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7fe0d3]">
                The Blender turn
              </p>
              <h2 className="mt-5 max-w-[10ch] text-balance font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-7xl">
                Better objects made the flat world feel wrong.
              </h2>
            </div>
            <div className="self-end">
              <p className="max-w-3xl text-pretty font-serif text-3xl leading-[1.08] tracking-[-0.03em] text-white/90 md:text-5xl">
                As soon as the instruments had volume, the world around them
                had to gain depth.
              </p>
              <div className="mt-8 max-w-3xl space-y-5 text-base leading-8 text-white/58 md:text-lg">
                <p>
                  Astra made it practical to bring Blender into the working
                  loop—not as a detached asset pass, but as part of continuous
                  product iteration. I could improve the cello and mobile
                  instruments, bring those assets back into the browser, and
                  judge the models, motion, material, lighting, and audio
                  together.
                </p>
                <p>
                  That changed the ambition of the environment. A static, flat
                  background could no longer support objects that looked and
                  moved in three dimensions, so the backdrop became a
                  navigable 3D space with galaxies positioned at different
                  depths.
                </p>
              </div>
            </div>
          </MotionReveal>

          <ol className="mt-16 grid border-y border-white/14 md:mt-20 md:grid-cols-3">
            {blenderEvolution.map((step, index) => (
              <MotionReveal key={step.number} delay={index * 0.05}>
                <li
                  className={`h-full py-8 md:px-8 md:py-10 ${
                    index > 0
                      ? "border-t border-white/12 md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.24em] text-[#7fe0d3]">
                    <span>{step.label}</span>
                    <span className="text-white/28">{step.number}</span>
                  </div>
                  <h3 className="mt-8 max-w-[12ch] font-serif text-3xl leading-[1.02] tracking-[-0.035em] md:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-5 max-w-md text-sm leading-7 text-white/50 md:text-base">
                    {step.body}
                  </p>
                </li>
              </MotionReveal>
            ))}
          </ol>

          <MotionReveal className="mt-10 flex items-start gap-4 border-l border-[#efb65e]/70 pl-5 md:ml-auto md:max-w-3xl">
            <p className="font-serif text-2xl leading-tight text-white/82 md:text-3xl">
              This was not a decorative background upgrade. The assets became
              convincing enough to require a more convincing world.
            </p>
          </MotionReveal>
        </Container>
      </section>

      <section id="film" className="border-y border-white/10 bg-[#020607]">
        <Container className="py-20 md:py-28 lg:py-32">
          <MotionReveal className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-24">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#efb65e]">
                60-second film
              </p>
              <h2 className="mt-5 max-w-[9ch] text-balance font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-7xl">
                Reach into the music.
              </h2>
            </div>
            <div className="self-end">
              <p className="max-w-3xl text-pretty font-serif text-3xl leading-[1.08] tracking-[-0.03em] text-white/88 md:text-5xl">
                The product decisions become clearer when the whole system is
                moving.
              </p>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/56 md:text-lg">
                This short film moves from hand-launched sounds to independent
                orbits, listener navigation, performer follow, and the two
                three-dimensional worlds enabled by the Astra-and-Blender
                build.
              </p>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.06} className="mt-14 md:mt-20">
            <figure>
              <div className="aspect-video overflow-hidden border border-white/16 bg-black">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster="/videos/gravity/gravity-reach-into-the-music-poster.jpg"
                  title="Gravity — Reach into the music"
                  aria-describedby="gravity-film-caption"
                  className="h-full w-full bg-black object-contain"
                >
                  <source
                    src="/videos/gravity/gravity-reach-into-the-music.mp4"
                    type="video/mp4"
                  />
                  <track
                    kind="captions"
                    src="/videos/gravity/gravity-reach-into-the-music.en.vtt"
                    srcLang="en"
                    label="English"
                  />
                  Your browser does not support HTML video.
                </video>
              </div>
              <figcaption
                id="gravity-film-caption"
                className="flex flex-col gap-2 border-b border-white/14 py-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42 sm:flex-row sm:items-center sm:justify-between"
              >
                <span>Original Gravity session audio</span>
                <span>01:00 · no narration</span>
              </figcaption>
            </figure>
          </MotionReveal>

          <MotionReveal className="mt-8">
            <details className="group border-b border-white/14 pb-7">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-3 text-sm font-semibold text-white/72 transition hover:text-white">
                <span>Read the film transcript</span>
                <span
                  className="text-xl font-light text-[#7fe0d3] transition group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <ol className="mt-5 grid gap-x-10 border-t border-white/10 md:grid-cols-2">
                {filmTranscript.map((cue) => (
                  <li
                    key={cue.time}
                    className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-white/10 py-5 text-sm leading-7"
                  >
                    <span className="font-mono text-xs text-[#7fe0d3]">
                      {cue.time}
                    </span>
                    <span className="text-white/52">{cue.text}</span>
                  </li>
                ))}
              </ol>
            </details>
          </MotionReveal>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-[#061011]">
        <Container className="py-20 md:py-28 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
            <MotionReveal className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7fe0d3]">
                The earlier signal
              </p>
              <h2 className="mt-5 max-w-[10ch] text-balance font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-7xl">
                One tester tried to move through the music.
              </h2>
              <div className="mt-8 max-w-lg space-y-5 text-base leading-8 text-white/60 md:text-lg">
                <p>
                  While I watched people use the earlier version, one person
                  treated the field like a place. They wanted to navigate
                  through it, not just switch views from outside.
                </p>
                <p>
                  That instinct clarified the product direction. Perspective
                  was not a camera feature; it was part of the composition.
                  Moving closer to a performer should change both what you see
                  and what you hear.
                </p>
              </div>
              <div className="mt-9 border-l border-[#7fe0d3]/55 pl-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7fe0d3]">
                  Product decision
                </p>
                <p className="mt-3 max-w-md font-serif text-2xl leading-tight text-white/88">
                  Build Free view, dimensional cello and performer perspectives,
                  and one shared visual-and-audible listener pose.
                </p>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.08}>
              <figure className="group">
                <MediaFrame
                  src="/images/gravity/astra/performer-follow.webp"
                  alt="A close Gravity view following a clarinet performer as sculptural instruments orbit the cello in Celestial space."
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="aspect-[1494/900] border border-white/12 bg-black"
                  imageClassName="object-cover transition duration-700 group-hover:scale-[1.012]"
                  expandable
                  expandLabel="Expand the performer-follow view"
                />
                <figcaption className="grid gap-3 border-b border-white/12 py-5 sm:grid-cols-[8rem_1fr]">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7fe0d3]">
                    Performer view
                  </span>
                  <p className="text-sm leading-6 text-white/48">
                    The listener can follow an autonomous instrument while its
                    audio continues to move from the same rendered position.
                  </p>
                </figcaption>
              </figure>

              <figure className="group mt-14 ml-auto w-[88%]">
                <MediaFrame
                  src="/images/gravity/astra/cello-perspective.webp"
                  alt="Gravity viewed from close beside and below the spectral cello, with other instruments suspended in the surrounding Atomic field."
                  sizes="(min-width: 1024px) 50vw, 88vw"
                  className="aspect-[1494/900] border border-white/12 bg-black"
                  imageClassName="object-cover transition duration-700 group-hover:scale-[1.012]"
                  expandable
                  expandLabel="Expand the close cello listening perspective"
                />
                <figcaption className="border-b border-white/12 py-5 text-sm leading-6 text-white/48">
                  The close cello perspective makes scale and listener position
                  perceptible rather than merely configurable.
                </figcaption>
              </figure>
            </MotionReveal>
          </div>
        </Container>
      </section>

      <section id="decisions" className="scroll-mt-24 bg-[#e3a956] text-[#171006]">
        <Container className="py-20 md:py-28 lg:py-32">
          <MotionReveal className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:gap-24">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5d3b0d]">
                The five-year-old test
              </p>
              <h2 className="mt-5 max-w-[9ch] text-balance font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-7xl">
                The magic was making it clunky.
              </h2>
            </div>
            <div className="self-end">
              <p className="max-w-3xl text-pretty font-serif text-3xl leading-[1.08] tracking-[-0.03em] md:text-5xl">
                The clearest signal came from frustrating my five-year-old.
              </p>
              <div className="mt-8 max-w-3xl space-y-5 text-base leading-8 text-[#171006]/66 md:text-lg">
                <p>
                  Waving to change worlds sounded natural. In use, it was
                  inconsistent, slow to confirm, and too easy to confuse with
                  ordinary movement. The full gesture set asked a visitor to
                  remember too much while waiting to learn whether Gravity had
                  understood them.
                </p>
                <p>
                  I first treated that as a recognition problem. Testing showed
                  it was a product problem. More gestures did not create more
                  agency; they created more uncertainty. So I pulled back.
                </p>
              </div>
            </div>
          </MotionReveal>

          <div className="mt-16 border-t border-[#171006]/25 md:mt-20">
            <div className="hidden grid-cols-[0.42fr_1fr_1fr] gap-8 border-b border-[#171006]/18 py-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#171006]/54 md:grid">
              <span>Decision</span>
              <span>Before testing</span>
              <span>After testing</span>
            </div>
            {decisionChanges.map((decision, index) => (
              <MotionReveal key={decision.label} delay={(index % 3) * 0.04}>
                <div className="grid gap-6 border-b border-[#171006]/20 py-7 md:grid-cols-[0.42fr_1fr_1fr] md:gap-8">
                  <h3 className="font-serif text-2xl tracking-[-0.025em]">
                    {decision.label}
                  </h3>
                  <div className="flex gap-3 text-sm leading-7 text-[#171006]/55 md:text-base">
                    <Minus className="mt-2 h-4 w-4 shrink-0" aria-hidden="true" />
                    <p>{decision.before}</p>
                  </div>
                  <div className="flex gap-3 text-sm leading-7 text-[#171006]/78 md:text-base">
                    <Check className="mt-1.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <p>{decision.after}</p>
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>

          <MotionReveal className="mt-12 border-l-2 border-[#171006] pl-6 md:ml-[29%] md:max-w-3xl">
            <p className="font-serif text-2xl leading-tight md:text-3xl">
              Waving, palm swipes, and full-hand world switching remain useful
              research. They are no longer the default product.
            </p>
            <p className="mt-4 text-sm leading-7 text-[#171006]/62 md:text-base">
              The live grammar now favors visible pointing, relaxed grabbing,
              explicit dwell progress, and conventional controls that remain
              available alongside the webcam.
            </p>
          </MotionReveal>
        </Container>
      </section>

      <section className="bg-[#020607]">
        <GravityEvolutionSlides />

        <Container className="py-20 md:py-28 lg:py-32">
          <MotionReveal className="max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7fe0d3]">
              What stayed ambitious
            </p>
            <h2 className="mt-5 max-w-[12ch] text-balance font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-7xl">
              Simpler control. A much richer instrument.
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/58 md:text-lg">
              Pulling back on gesture novelty created room to deepen the parts
              that actually make Gravity feel alive.
            </p>
          </MotionReveal>

          <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2 md:mt-20">
            <MotionReveal>
              <figure className="group">
                <MediaFrame
                  src="/images/gravity/astra/atomic-orbits.webp"
                  alt="Gravity's Atomic field filled with sculptural performers moving through dimensional orbital planes around the cello."
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[1494/900] border border-white/12 bg-black"
                  imageClassName="object-cover transition duration-700 group-hover:scale-[1.015]"
                  expandable
                  expandLabel="Expand the dimensional Atomic field"
                />
                <figcaption className="border-b border-white/12 py-5">
                  <h3 className="font-serif text-2xl">Spatial orbits</h3>
                  <p className="mt-2 text-sm leading-6 text-white/48">
                    Performers no longer share a flat stage. Their individual
                    orbital planes feed both the scene and the spatial mix.
                  </p>
                </figcaption>
              </figure>
            </MotionReveal>

            <MotionReveal delay={0.06} className="md:mt-24">
              <figure className="group">
                <MediaFrame
                  src="/images/gravity/astra/hand-launch.webp"
                  alt="Gravity's hand-control interface showing a visitor pulling back a Viola spring before launching it into Celestial space."
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[1494/900] border border-white/12 bg-black"
                  imageClassName="object-cover transition duration-700 group-hover:scale-[1.015]"
                  expandable
                  expandLabel="Expand the hand-launched Viola interaction"
                />
                <figcaption className="border-b border-white/12 py-5">
                  <h3 className="font-serif text-2xl">Physical invitation</h3>
                  <p className="mt-2 text-sm leading-6 text-white/48">
                    A visible spring makes the grab, pull, and release model
                    legible—and turns launch direction into musical physics.
                  </p>
                </figcaption>
              </figure>
            </MotionReveal>

            <MotionReveal>
              <figure className="group">
                <MediaFrame
                  src="/images/gravity/astra/session-recording.webp"
                  alt="Gravity recording a local evaluation session with an elapsed timer, marked moment, camera inset, and Atomic cello view."
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[8/5] border border-white/12 bg-black"
                  imageClassName="object-cover transition duration-700 group-hover:scale-[1.015]"
                  expandable
                  expandLabel="Expand the local session recording view"
                />
                <figcaption className="border-b border-white/12 py-5">
                  <h3 className="font-serif text-2xl">An evaluation instrument</h3>
                  <p className="mt-2 text-sm leading-6 text-white/48">
                    A local recording and matching event log make recognition
                    delays and misunderstood intent inspectable after a session.
                  </p>
                </figcaption>
              </figure>
            </MotionReveal>

            <MotionReveal delay={0.06} className="md:mt-24">
              <figure className="group">
                <MediaFrame
                  src="/images/gravity/astra/cello-dissolving.webp"
                  alt="The central Celestial cello fading into sparse starlight after the last sound of the composition."
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[1494/900] border border-white/12 bg-black"
                  imageClassName="object-cover transition duration-700 group-hover:scale-[1.015]"
                  expandable
                  expandLabel="Expand the cello's final starlight dissolution"
                />
                <figcaption className="border-b border-white/12 py-5">
                  <h3 className="font-serif text-2xl">A composed ending</h3>
                  <p className="mt-2 text-sm leading-6 text-white/48">
                    After the final audio tail, the cello dissolves into
                    starlight. Replay rebuilds the instrument without changing
                    the visitor&apos;s chosen world.
                  </p>
                </figcaption>
              </figure>
            </MotionReveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-[#081213]">
        <Container className="py-20 md:py-28 lg:py-32">
          <MotionReveal className="grid gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:gap-24">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7fe0d3]">
                My approach
              </p>
              <h2 className="mt-5 max-w-[10ch] text-balance font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-7xl">
                Direct the system. Test the feeling.
              </h2>
            </div>
            <div className="self-end">
              <p className="max-w-3xl text-pretty text-xl leading-9 text-white/66 md:text-2xl md:leading-10">
                Astra changed the scale and continuity of the collaboration. It
                could carry a decision across a large, interdependent product.
                My job was to keep deciding what the product should become.
              </p>
            </div>
          </MotionReveal>

          <ol className="mt-16 border-t border-white/15 md:mt-20">
            {workingMethod.map((step, index) => (
              <MotionReveal key={step.number} delay={(index % 3) * 0.04}>
                <li className="grid gap-4 border-b border-white/12 py-7 md:grid-cols-[4rem_minmax(260px,0.8fr)_minmax(0,1.2fr)] md:items-baseline md:gap-8">
                  <span className="text-xs font-semibold tracking-[0.18em] text-[#7fe0d3]">
                    {step.number}
                  </span>
                  <h3 className="font-serif text-2xl tracking-[-0.025em] md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="max-w-2xl text-sm leading-7 text-white/52 md:text-base">
                    {step.body}
                  </p>
                </li>
              </MotionReveal>
            ))}
          </ol>

          <MotionReveal className="mt-14 grid gap-8 border-y border-[#7fe0d3]/22 py-9 md:grid-cols-2 md:gap-14">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#7fe0d3]">
                Astra accelerated
              </p>
              <p className="mt-4 max-w-xl font-serif text-2xl leading-tight text-white/88 md:text-3xl">
                Blender-to-browser asset iteration, cross-system implementation,
                edge-case exploration, and a deeper automated-and-browser
                validation loop.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#efb65e]">
                I remained responsible for
              </p>
              <p className="mt-4 max-w-xl font-serif text-2xl leading-tight text-white/88 md:text-3xl">
                The composition, product thesis, experience principles, human
                observation, tradeoffs, and the call on what deserved to ship.
              </p>
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="relative min-h-[72svh] overflow-hidden">
        <Image
          src="/images/gravity/astra/celestial-orbits.webp"
          alt=""
          fill
          className="object-cover object-center opacity-52"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,7,0.98)_0%,rgba(2,6,7,0.78)_50%,rgba(2,6,7,0.35)_100%),linear-gradient(0deg,rgba(2,6,7,0.96),transparent_60%)]"
          aria-hidden="true"
        />
        <Container className="relative flex min-h-[72svh] items-center py-20">
          <MotionReveal className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7fe0d3]">
              The result
            </p>
            <h2 className="mt-5 max-w-[11ch] text-balance font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-7xl">
              Better because I knew what to remove.
            </h2>
            <p className="mt-7 max-w-xl text-pretty text-base leading-8 text-white/62 md:text-lg">
              Gravity is now a deeper spatial world with dimensional,
              textured instruments, a more expressive musical system, and a
              more honest interaction design. The model expanded the build.
              Watching people use it sharpened the product.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#7fe0d3] px-6 py-3 text-sm font-semibold text-[#04100f] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Experience Gravity
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
              <Link
                href="/creative/gravity"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/24 bg-black/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-black/38"
              >
                Read chapter one
                <ArrowLeft
                  className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </MotionReveal>
        </Container>
      </section>
    </div>
  );
}
