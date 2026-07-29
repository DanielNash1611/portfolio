import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUpRight } from "lucide-react";
import MotionReveal from "@/components/site/MotionReveal";

const processSteps = [
  {
    number: "01",
    title: "Start with attention",
    body: "Running a world, reading the table, and pacing a story already demand a GM’s full attention. I began with a simple product constraint: the score should support that work without becoming another instrument panel to operate.",
  },
  {
    number: "02",
    title: "Make emotion legible",
    body: "I reduced the experience to a small, readable emotional language. Calm, Dramatic, and Intense give the score enough range to feel responsive while staying understandable at a glance.",
  },
  {
    number: "03",
    title: "Prototype the room, not the demo",
    body: "Early iterations used replayable scenes and live tabletop conversation to test pacing, trust, and the moments when a GM needs to guide the experience directly.",
  },
  {
    number: "04",
    title: "Let the system recede",
    body: "The working alpha became a tap-first companion: clear readiness, visible score state, and direct control when it matters. The complexity stays behind the experience.",
  },
] as const;

const productPrinciples = [
  {
    title: "Story first",
    description: "The music serves the scene instead of competing with it.",
  },
  {
    title: "Composer built",
    description: "Authored musical worlds, shaped to adapt with intention.",
  },
  {
    title: "GM controlled",
    description:
      "The storyteller keeps the final say without babysitting audio.",
  },
] as const;

const sceneStates = [
  {
    title: "Calm",
    description: "Exploration and discovery",
    image: "/images/tabletop-symphony/scene-calm.jpg",
    accent: "#6fa8a1",
  },
  {
    title: "Dramatic",
    description: "Tension and consequence",
    image: "/images/tabletop-symphony/scene-dramatic.jpg",
    accent: "#a979c9",
  },
  {
    title: "Intense",
    description: "Danger and climax",
    image: "/images/tabletop-symphony/scene-intense.jpg",
    accent: "#d66a4a",
  },
] as const;

export const metadata: Metadata = {
  title: "Tabletop Symphony",
  description:
    "A high-level look at Daniel Nash’s process creating Tabletop Symphony, a composer-built adaptive music companion for live tabletop storytelling.",
  openGraph: {
    title: "Tabletop Symphony | Daniel Nash",
    description:
      "A living score for every adventure—shown through the product idea, working alpha, concept evolution, and visual system.",
    url: "https://www.danielnash.co/creative/tabletop-symphony",
    images: [
      {
        url: "/images/tabletop-symphony/app-tablet.webp",
        width: 1600,
        height: 2560,
        alt: "Tabletop Symphony working alpha shown on a tablet.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tabletop Symphony | Daniel Nash",
    description:
      "A high-level look at the process behind a composer-built adaptive score for tabletop play.",
    images: ["/images/tabletop-symphony/app-tablet.webp"],
  },
};

export default function TabletopSymphonyPage(): JSX.Element {
  return (
    <div className="overflow-hidden bg-[#07111d] text-[#f4ebdd]">
      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden border-b border-[#d6a84f]/20">
        <Image
          src="/images/tabletop-symphony/tabletop-atmosphere.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(214,168,79,0.16),transparent_25%),radial-gradient(circle_at_15%_12%,rgba(169,121,201,0.12),transparent_24%),linear-gradient(90deg,rgba(7,17,29,0.98)_0%,rgba(7,17,29,0.92)_48%,rgba(7,17,29,0.64)_100%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-[1440px] items-center gap-10 px-5 py-10 sm:px-6 md:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.68fr)] lg:gap-14 lg:py-8">
          <MotionReveal className="relative z-10">
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d6a84f]">
              <span className="h-px w-12 bg-current" aria-hidden="true" />
              Adaptive music / private alpha
            </div>

            <h1 className="mt-7 max-w-[8ch] font-serif text-[clamp(4.25rem,7.2vw,7.5rem)] font-medium leading-[0.82] tracking-[-0.06em] text-[#f4ebdd]">
              Tabletop Symphony
            </h1>

            <p className="mt-6 max-w-[24ch] font-serif text-[clamp(1.5rem,2.4vw,2.2rem)] italic leading-[1.04] tracking-[-0.025em] text-[#d6a84f]">
              A living score for every adventure.
            </p>

            <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-[#f4ebdd]/68">
              I’m exploring how music can follow the emotional shape of live
              tabletop play—without asking the Game Master to manage another
              thing.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#process"
                className="inline-flex items-center gap-2 border border-[#d6a84f] bg-[#d6a84f] px-5 py-3 text-sm font-bold text-[#07111d] transition duration-300 hover:bg-[#f4ebdd] focus-visible:outline-[#d6a84f]"
              >
                See the process
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="border-l border-[#f4ebdd]/16 pl-4 text-xs uppercase tracking-[0.18em] text-[#f4ebdd]/52">
                Public preview · intentionally high-level
              </span>
            </div>
          </MotionReveal>

          <MotionReveal
            delay={0.12}
            className="relative mx-auto w-full max-w-[520px] self-end lg:mr-0"
          >
            <div
              className="absolute -inset-x-10 bottom-0 top-[18%] rounded-full bg-[#d6a84f]/10 blur-3xl"
              aria-hidden="true"
            />
            <figure className="relative ml-auto w-[min(82vw,400px)]">
              <div className="absolute -inset-3 rounded-[2rem] border border-[#d6a84f]/18" />
              <div className="relative aspect-[9/13] overflow-hidden rounded-[1.45rem] border border-[#d6a84f]/35 bg-[#0d1726] shadow-[0_40px_100px_rgba(0,0,0,0.62)]">
                <Image
                  src="/images/tabletop-symphony/app-phone.webp"
                  alt="The working Tabletop Symphony alpha on an Android phone, showing session readiness and three score states."
                  fill
                  priority
                  className="object-cover object-top transition duration-700 hover:scale-[1.015]"
                  sizes="(min-width: 1024px) 400px, 82vw"
                />
              </div>
              <figcaption className="mt-5 flex items-center justify-between border-t border-[#f4ebdd]/14 pt-4 text-[10px] uppercase tracking-[0.2em] text-[#f4ebdd]/48">
                <span>Working alpha</span>
                <span>Android companion</span>
              </figcaption>
            </figure>
          </MotionReveal>
        </div>
      </section>

      <section className="bg-[#f4ebdd] text-[#111827]">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-20 sm:px-6 md:px-8 md:py-28 lg:grid-cols-[minmax(280px,0.66fr)_minmax(0,1.34fr)] lg:gap-24">
          <MotionReveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b681f]">
              The product idea
            </p>
            <h2 className="mt-5 max-w-[10ch] font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-6xl">
              Music should follow the room.
            </h2>
          </MotionReveal>

          <MotionReveal delay={0.08}>
            <p className="max-w-3xl text-pretty text-xl leading-9 text-[#111827]/72 md:text-2xl md:leading-10">
              The emotional timing of a tabletop session changes constantly.
              Most music tools still ask the GM to search, switch, and
              anticipate while they are already performing the hardest role at
              the table.
            </p>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#111827]/62 md:text-lg">
              Tabletop Symphony is my attempt to make the score feel present and
              responsive while keeping authorship in the music and agency with
              the GM.
            </p>

            <dl className="mt-12 border-t border-[#111827]/18">
              {productPrinciples.map((principle) => (
                <div
                  key={principle.title}
                  className="grid gap-2 border-b border-[#111827]/14 py-5 sm:grid-cols-[180px_1fr] sm:gap-8"
                >
                  <dt className="font-serif text-xl tracking-[-0.02em]">
                    {principle.title}
                  </dt>
                  <dd className="text-sm leading-6 text-[#111827]/60">
                    {principle.description}
                  </dd>
                </div>
              ))}
            </dl>
          </MotionReveal>
        </div>
      </section>

      <section
        id="process"
        className="scroll-mt-24 border-y border-[#d6a84f]/16 bg-[#0d1726]"
      >
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-6 md:px-8 md:py-28">
          <MotionReveal className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d6a84f]">
                Creating it
              </p>
              <h2 className="mt-5 max-w-[11ch] font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-6xl">
                From an attention problem to a working companion.
              </h2>
            </div>
            <p className="max-w-2xl self-end text-base leading-8 text-[#f4ebdd]/62 md:text-lg">
              I shaped the product thesis, interaction model, visual language,
              and working alpha as one connected system. Each iteration had to
              answer two questions: does the score feel emotionally aware, and
              does the GM still feel in control?
            </p>
          </MotionReveal>

          <ol className="mt-16 border-t border-[#f4ebdd]/15">
            {processSteps.map((step, index) => (
              <MotionReveal key={step.number} delay={index * 0.05}>
                <li className="grid gap-4 border-b border-[#f4ebdd]/12 py-8 md:grid-cols-[70px_minmax(220px,0.72fr)_minmax(0,1.28fr)] md:gap-8 md:py-10">
                  <span className="font-mono text-xs text-[#d6a84f]">
                    {step.number}
                  </span>
                  <h3 className="font-serif text-2xl leading-tight tracking-[-0.03em] md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="max-w-2xl text-sm leading-7 text-[#f4ebdd]/58 md:text-base">
                    {step.body}
                  </p>
                </li>
              </MotionReveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#f4ebdd] text-[#111827]">
        <div className="mx-auto max-w-[1380px] px-5 py-20 sm:px-6 md:px-8 md:py-28">
          <MotionReveal className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b681f]">
                The working alpha
              </p>
              <h2 className="mt-5 max-w-[10ch] font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-6xl">
                Built for the edge of the table.
              </h2>
            </div>
            <p className="max-w-2xl self-end text-base leading-8 text-[#111827]/62 md:text-lg">
              The current GM-facing surface runs across phone, tablet, and
              browser. The mechanics behind it remain private; the experience
              principle is visible: readiness is clear, the score state is
              readable, and guidance is always close at hand.
            </p>
          </MotionReveal>

          <div className="mt-14 grid items-end gap-6 lg:grid-cols-[0.74fr_1.26fr] lg:gap-10">
            <MotionReveal className="mx-auto w-full max-w-[480px] lg:mx-0">
              <figure>
                <div className="relative aspect-[9/20] overflow-hidden rounded-[1.6rem] bg-[#0d1726] shadow-[0_24px_70px_rgba(17,24,39,0.17)]">
                  <Image
                    src="/images/tabletop-symphony/app-phone.webp"
                    alt="Tabletop Symphony working alpha on a phone."
                    fill
                    className="object-cover object-top transition duration-700 hover:scale-[1.01]"
                    sizes="(min-width: 1024px) 36vw, 86vw"
                  />
                </div>
                <figcaption className="mt-4 border-t border-[#111827]/16 pt-3 text-xs leading-5 text-[#111827]/54">
                  Phone capture · the same GM control surface used in the
                  current alpha.
                </figcaption>
              </figure>
            </MotionReveal>

            <MotionReveal delay={0.08}>
              <figure>
                <div className="relative aspect-[5/8] overflow-hidden rounded-[1.6rem] bg-[#0d1726] shadow-[0_24px_70px_rgba(17,24,39,0.17)]">
                  <Image
                    src="/images/tabletop-symphony/app-tablet.webp"
                    alt="Tabletop Symphony working alpha scaled to a tablet."
                    fill
                    className="object-cover object-top transition duration-700 hover:scale-[1.01]"
                    sizes="(min-width: 1024px) 58vw, 100vw"
                  />
                </div>
                <figcaption className="mt-4 border-t border-[#111827]/16 pt-3 text-xs leading-5 text-[#111827]/54">
                  Tablet capture · the layout expands without turning into a
                  diagnostic dashboard.
                </figcaption>
              </figure>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d6a84f]/16 bg-[#07111d]">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-6 md:px-8 md:py-28">
          <MotionReveal className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d6a84f]">
              The emotional language
            </p>
            <h2 className="mt-5 max-w-[12ch] font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-6xl">
              Three states. One continuous story.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#f4ebdd]/60 md:text-lg">
              I kept the visible vocabulary intentionally small. That makes the
              experience easy to read while the artwork, score, and pacing carry
              the nuance.
            </p>
          </MotionReveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {sceneStates.map((state, index) => (
              <MotionReveal key={state.title} delay={index * 0.06}>
                <figure className="group">
                  <div className="relative aspect-[4/5] overflow-hidden border border-[#f4ebdd]/12 bg-[#111827]">
                    <Image
                      src={state.image}
                      alt={`${state.title} scene-state concept art.`}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.035]"
                      sizes="(min-width: 768px) 31vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07111d] via-transparent to-transparent" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-6">
                      <p
                        className="font-serif text-3xl tracking-[-0.035em]"
                        style={{ color: state.accent }}
                      >
                        {state.title}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#f4ebdd]/54">
                        {state.description}
                      </p>
                    </figcaption>
                  </div>
                </figure>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e7dbc9] text-[#111827]">
        <div className="mx-auto max-w-[1380px] px-5 py-20 sm:px-6 md:px-8 md:py-28">
          <MotionReveal className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b681f]">
                Concept to product
              </p>
              <h2 className="mt-5 max-w-[9ch] font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-6xl">
                A north star, not a specification.
              </h2>
            </div>
            <p className="max-w-2xl self-end text-base leading-8 text-[#111827]/62 md:text-lg">
              The first concept established atmosphere, hierarchy, and the idea
              of a single ritual-like activation moment. I used it to set
              direction, then simplified the working interface around what a GM
              actually needs during play.
            </p>
          </MotionReveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <MotionReveal className="lg:sticky lg:top-28">
              <figure>
                <div className="relative aspect-[9/16] overflow-hidden bg-[#07111d] shadow-[0_28px_70px_rgba(17,24,39,0.18)]">
                  <Image
                    src="/images/tabletop-symphony/concept-activation.webp"
                    alt="Early Tabletop Symphony activation-screen concept in a phone frame."
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 34vw, 100vw"
                  />
                </div>
                <figcaption className="mt-4 border-t border-[#111827]/16 pt-3 text-xs leading-5 text-[#111827]/54">
                  Early activation concept · atmosphere and hierarchy before
                  implementation.
                </figcaption>
              </figure>
            </MotionReveal>

            <MotionReveal delay={0.08}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden bg-[#07111d] shadow-[0_28px_70px_rgba(17,24,39,0.18)]">
                  <Image
                    src="/images/tabletop-symphony/concept-breakdown.webp"
                    alt="Tabletop Symphony implementation concept broken into interface, visual, and atmospheric layers."
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 58vw, 100vw"
                  />
                </div>
                <figcaption className="mt-4 border-t border-[#111827]/16 pt-3 text-xs leading-5 text-[#111827]/54">
                  Concept breakdown · separating interaction structure from
                  illustration and atmosphere.
                </figcaption>
              </figure>

              <div className="mt-10 grid gap-8 border-t border-[#111827]/16 pt-8 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8b681f]">
                    Kept
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#111827]/62">
                    A clear center of gravity, cinematic restraint, and a
                    compact emotional preview.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8b681f]">
                    Changed
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#111827]/62">
                    Less ornament, more operational clarity, and controls that
                    remain understandable in the middle of a session.
                  </p>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d6a84f]/16 bg-[#0d1726]">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-6 md:px-8 md:py-28">
          <MotionReveal className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d6a84f]">
                Design system
              </p>
              <h2 className="mt-5 max-w-[10ch] font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-6xl">
                Craft documented as a system.
              </h2>
            </div>
            <p className="max-w-2xl self-end text-base leading-8 text-[#f4ebdd]/60 md:text-lg">
              I documented the visual language early so the product surface,
              scene art, and storytelling all speak in the same voice. The
              system combines candlelit warmth, orchestral references, and
              restrained dark-mode utility.
            </p>
          </MotionReveal>

          <MotionReveal delay={0.08} className="mt-14">
            <figure>
              <div className="relative aspect-[1.414/1] overflow-hidden border border-[#d6a84f]/24 bg-[#07111d] shadow-[0_32px_90px_rgba(0,0,0,0.34)]">
                <Image
                  src="/images/tabletop-symphony/design-system.webp"
                  alt="Tabletop Symphony design system with brand foundation, logo, palette, typography, components, voice, and imagery."
                  fill
                  className="object-cover transition duration-700 hover:scale-[1.008]"
                  sizes="100vw"
                />
              </div>
              <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#f4ebdd]/12 pt-4 text-[10px] uppercase tracking-[0.18em] text-[#f4ebdd]/46">
                <span>Tabletop Symphony visual system</span>
                <span>Brand · interface · imagery · voice</span>
              </figcaption>
            </figure>
          </MotionReveal>
        </div>
      </section>

      <section className="bg-[#f4ebdd] text-[#111827]">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-20 sm:px-6 md:px-8 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <MotionReveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b681f]">
              The public boundary
            </p>
            <h2 className="mt-5 max-w-[10ch] font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-6xl">
              Enough to show the work. Not the playbook.
            </h2>
          </MotionReveal>

          <MotionReveal delay={0.08}>
            <p className="max-w-2xl text-lg leading-8 text-[#111827]/68">
              This page intentionally shares the product premise, experience
              principles, visual evolution, and current alpha surface.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#111827]/58">
              The mechanics, tuning decisions, evaluation data, music structure,
              and launch strategy stay private while the product is in
              development.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/creative"
                className="inline-flex items-center gap-2 border border-[#111827]/24 px-5 py-3 text-sm font-bold transition hover:border-[#111827] hover:bg-[#111827]/5"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                More creative work
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#111827] px-5 py-3 text-sm font-bold text-[#f4ebdd] transition hover:bg-[#8b681f]"
              >
                Talk with Daniel
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </MotionReveal>
        </div>
      </section>
    </div>
  );
}
