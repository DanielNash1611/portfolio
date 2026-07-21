import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowUpRight,
  Download,
  FileText,
  Headphones,
  Music2,
  Play,
} from "lucide-react";
import Container from "@/components/site/Container";
import JumpingOnCoalsHero from "@/components/site/JumpingOnCoalsHero";
import MotionReveal from "@/components/site/MotionReveal";
import ResponsiveVideoEmbed from "@/components/site/ResponsiveVideoEmbed";

const gameUrl = "https://jumpingoncoals.danielnash.co/";
const sourceUrl = "https://github.com/DanielNash1611/jumpingoncoalsgame";
const submissionUrl = "https://devpost.com/software/jumping-on-coals";
const demoUrl = "https://www.youtube.com/watch?v=M3uy8KRM_-E";
const demoEmbedUrl = "https://www.youtube.com/embed/M3uy8KRM_-E";
const fullExplanationUrl = "/audio/jumping-on-coals-full-explanation.mp3";
const transcriptUrl = "/audio/jumping-on-coals-full-explanation-transcript.txt";

const streamingLinks = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/album/311oflqBUpmD0atlbCL7Z0",
    primary: true,
  },
  {
    label: "Apple Music",
    href: "https://music.apple.com/us/album/jumping-on-coals/1530750385",
    primary: false,
  },
  {
    label: "TIDAL",
    href: "https://tidal.com/album/221161927",
    primary: false,
  },
  {
    label: "Pandora",
    href: "https://www.pandora.com/artist/daniel-nash/jumping-on-coals/ALrz5b3z9trpcVg",
    primary: false,
  },
] as const;

const chapters = [
  {
    number: "01",
    title: "Back in the Swing",
    description:
      "Build momentum, collect fireflies, and decide when to jump away from the safety of repetition.",
  },
  {
    number: "02",
    title: "Losing Balance",
    description:
      "Cross a narrow beam by reading the environment instead of relying on a conventional balance meter.",
  },
  {
    number: "03",
    title: "Jumping on Coals",
    description:
      "Manage Heat and Flow across a 26,400-pixel route while a wall of fire closes in behind you.",
  },
  {
    number: "04",
    title: "Digging In",
    description:
      "Keep working as productive effort quietly turns into compulsion, exhaustion, and collapse.",
  },
  {
    number: "05",
    title: "At the Bottom",
    description:
      "Use breath, focus, and memory to recover the ability to stand instead of treating recovery as another score.",
  },
  {
    number: "06",
    title: "Digging Out",
    description:
      "Turn alternating shovel strikes into a difficult ascent through the same earth you once dug into.",
  },
  {
    number: "07",
    title: "By the Shovel",
    description:
      "Rest beneath an opening sky, then choose whether to leave the playground or return to the swing.",
  },
  {
    number: "08",
    title: "Back in the Swing (Again)",
    description:
      "Return to a satisfying familiar motion and decide for yourself when—or whether—to step away.",
  },
] as const;

const audioChapters = [
  {
    time: "0:00",
    title: "The personal origin",
    description: "Work, the first PTO day, and the weekend the album appeared.",
  },
  {
    time: "1:55",
    title: "The swing-and-coals metaphor",
    description: "Safety, momentum, burnout, the hole, recovery, and return.",
  },
  {
    time: "4:26",
    title: "One sound, many states",
    description: "How a single cello pizzicato became the entire sound world.",
  },
  {
    time: "5:56",
    title: "Trying to make it interactive",
    description:
      "The early GDD, prototype, visual experiments, and false starts.",
  },
  {
    time: "9:54",
    title: "Returning during Build Week",
    description:
      "Why the existing foundation was kept and how the full arc emerged.",
  },
  {
    time: "11:52",
    title: "An album-driven game",
    description:
      "Mechanics that sustain attention without turning it into a rhythm game.",
  },
  {
    time: "14:09",
    title: "The ambiguous ending",
    description: "What the work is meant to make players feel and discuss.",
  },
] as const;

export const metadata: Metadata = {
  title: "Jumping on Coals",
  description:
    "Jumping on Coals is Daniel Nash's original album about burnout, transformed into a tactile eight-chapter browser game.",
  openGraph: {
    title: "Jumping on Coals | Daniel Nash",
    description:
      "An original album about ambition, burnout, recovery, and repetition—made playable as an eight-chapter browser game.",
    url: "https://www.danielnash.co/creative/jumping-on-coals",
    images: [
      {
        url: "/images/jumping-on-coals/title-screen.png",
        width: 1920,
        height: 1080,
        alt: "Jumping on Coals title screen at a pixel-art playground.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jumping on Coals | Daniel Nash",
    description:
      "An original album about burnout, transformed into a tactile eight-chapter browser game.",
    images: ["/images/jumping-on-coals/title-screen.png"],
  },
};

export default function JumpingOnCoalsPage(): JSX.Element {
  return (
    <div className="overflow-hidden pb-20 md:pb-24">
      <JumpingOnCoalsHero />

      <Container id="overview" className="scroll-mt-28 py-16 md:py-24">
        <MotionReveal>
          <section className="grid gap-10 border-b border-[color:var(--color-slate)]/12 pb-14 md:pb-20 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b4a31]">
                The whole idea, quickly
              </p>
              <h2 className="max-w-[11ch] text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-5xl">
                The album is the game.
              </h2>
            </div>

            <div className="space-y-8">
              <p className="max-w-3xl text-pretty text-xl leading-8 text-[color:var(--color-slate)]/82 md:text-2xl md:leading-9">
                Eight non-looping songs become eight playable chapters. The
                music sets each chapter&apos;s duration and emotional shape; the
                mechanics let you inhabit the story instead of hearing it
                explained.
              </p>
              <p className="max-w-3xl text-base leading-7 text-[color:var(--color-slate)]/70">
                It is not a rhythm game, and the music is not interchangeable
                background audio. When a song reaches silence, the game opens a
                final action or choice—but never makes that choice for you.
              </p>
              <dl className="grid gap-6 border-t border-[color:var(--color-slate)]/12 pt-6 sm:grid-cols-3">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-slate)]/48">
                    Experience
                  </dt>
                  <dd className="mt-2 text-base font-semibold text-[color:var(--color-slate)]">
                    37–42 minutes
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-slate)]/48">
                    Structure
                  </dt>
                  <dd className="mt-2 text-base font-semibold text-[color:var(--color-slate)]">
                    8 songs / 8 chapters
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-slate)]/48">
                    Best experienced
                  </dt>
                  <dd className="mt-2 text-base font-semibold text-[color:var(--color-slate)]">
                    With headphones
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </MotionReveal>
      </Container>

      <Container className="pb-16 md:pb-24">
        <MotionReveal>
          <section className="relative overflow-hidden rounded-[1.8rem] bg-[#21100e] px-6 py-8 text-[#fff1d6] shadow-[0_26px_70px_rgba(57,24,17,0.16)] sm:px-8 md:py-10 lg:px-10">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,173,97,0.22),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(255,241,214,0.08),transparent_38%)]"
            />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:items-end lg:gap-14">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#ffb66f]">
                  <Music2 aria-hidden="true" className="h-5 w-5" />
                  <p className="text-xs font-semibold uppercase tracking-[0.28em]">
                    Listen to the album
                  </p>
                </div>
                <h2 className="max-w-[14ch] text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                  Hear the eight songs that shape the game.
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-[#fff1d6]/64 md:text-base md:leading-7">
                  Stream the original 2018 album before you play, or return to
                  it after experiencing how each track became a chapter.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                {streamingLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      link.primary
                        ? "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#fff1d6] px-5 py-3 text-sm font-semibold text-[#24110e] transition duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#21100e]"
                        : "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#fff1d6]/22 bg-white/5 px-5 py-3 text-sm font-semibold text-[#fff1d6] transition duration-200 hover:-translate-y-0.5 hover:border-[#fff1d6]/42 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#21100e]"
                    }
                  >
                    {link.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                ))}
              </div>
            </div>
          </section>
        </MotionReveal>
      </Container>

      <Container className="pb-16 md:pb-24">
        <MotionReveal>
          <figure className="group overflow-hidden rounded-[1.8rem] bg-[#180c0b] shadow-[0_30px_80px_rgba(41,20,16,0.18)]">
            <div className="relative aspect-video">
              <Image
                src="/images/jumping-on-coals/coals-traversal.png"
                alt="The player running and jumping over glowing coals while the Heat and Flow system tracks momentum."
                fill
                sizes="(min-width: 1200px) 1136px, 100vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.015]"
              />
            </div>
            <figcaption className="flex flex-col gap-2 border-t border-white/8 px-5 py-4 text-[#fff1d6] sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span className="text-sm font-semibold">
                Chapter 03 / Jumping on Coals
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-[#fff1d6]/55">
                Heat + Flow + a pursuing fire
              </span>
            </figcaption>
          </figure>
        </MotionReveal>
      </Container>

      <Container className="pb-16 md:pb-24">
        <MotionReveal>
          <section className="space-y-10">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b4a31]">
                  The playable arc
                </p>
                <h2 className="mt-4 max-w-[11ch] text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-5xl">
                  Every mechanic carries part of the metaphor.
                </h2>
              </div>
              <p className="max-w-3xl self-end text-base leading-7 text-[color:var(--color-slate)]/70 md:text-lg md:leading-8">
                The experience moves from comfortable repetition to risk,
                compulsion, collapse, recovery, and an ending that remains
                deliberately unresolved.
              </p>
            </div>

            <div className="grid gap-x-12 md:grid-cols-2">
              {chapters.map((chapter) => (
                <article
                  key={chapter.number}
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-t border-[color:var(--color-slate)]/14 py-6"
                >
                  <p className="pt-1 text-xs font-semibold tabular-nums tracking-[0.18em] text-[#a34e31]">
                    {chapter.number}
                  </p>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
                      {chapter.title}
                    </h3>
                    <p className="text-sm leading-6 text-[color:var(--color-slate)]/68">
                      {chapter.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </MotionReveal>
      </Container>

      <MotionReveal>
        <section className="bg-[#190d0d] text-[#fff1d6]">
          <Container className="grid gap-0 px-0 md:px-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)] lg:items-stretch">
            <div className="relative min-h-[360px] overflow-hidden lg:min-h-[620px]">
              <Image
                src="/images/jumping-on-coals/return-or-leave.png"
                alt="The game's final choice asking whether to return to the swing or leave the playground."
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(25,13,13,0.62)_100%)] lg:bg-[linear-gradient(90deg,transparent_68%,rgba(25,13,13,0.82)_100%)]"
              />
            </div>

            <div className="flex items-center px-6 py-12 sm:px-8 md:px-12 lg:px-14 lg:py-16">
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ffb66f]">
                  Why I made it
                </p>
                <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                  A cycle I could hear before I could show it.
                </h2>
                <div className="space-y-5 text-base leading-7 text-[#fff1d6]/72">
                  <p>
                    Years ago, I was putting nearly all of my energy into work.
                    The work improved, but I was becoming angry, isolated, and
                    creatively empty. I finally took my first paid PTO day on a
                    Friday—and wrote the entire album over that weekend.
                  </p>
                  <p>
                    As I composed, a visual story appeared: a child leaves the
                    safe repetition of a swing, lands on hot coals, digs down
                    for relief, recovers at the bottom, climbs out, and has to
                    decide whether to leave or begin the cycle again.
                  </p>
                  <p>
                    The full album uses one cello pizzicato transformed through
                    different effects: one person moving through many emotional
                    states. The game follows the same idea.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </MotionReveal>

      <Container className="py-16 md:py-24">
        <MotionReveal>
          <section className="space-y-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b4a31]">
                  From idea to playable work
                </p>
                <h2 className="max-w-[12ch] text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-5xl">
                  An existing point of view, finally carried into a new medium.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-7 text-[color:var(--color-slate)]/70">
                <p>
                  I had imagined an interactive version for years, but did not
                  have the game-development background or budget to make it.
                  With ChatGPT, I first translated the concept into a game
                  design document, then used Codex to attempt a Phaser
                  prototype. The first three chapters existed, but the physics,
                  visuals, and full arc were not yet working together.
                </p>
                <p>
                  During OpenAI Build Week, I returned to that foundation with
                  Codex and GPT-5.6. The work expanded the stalled three-chapter
                  prototype into the complete eight-chapter experience, while I
                  continued directing the mechanics around the album&apos;s
                  emotional purpose and how each interaction felt to play.
                </p>
              </div>
            </div>

            <div className="grid gap-10 border-y border-[color:var(--color-slate)]/14 py-8 md:grid-cols-2 md:gap-16 md:py-10">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-slate)]/46">
                  Already existed
                </p>
                <p className="text-lg leading-8 text-[color:var(--color-slate)]/82">
                  The original eight-track album, central metaphor, creative
                  direction, Phaser foundation, and rough three-chapter vertical
                  slice.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9b4a31]">
                  Build Week transformation
                </p>
                <p className="text-lg leading-8 text-[color:var(--color-slate)]/82">
                  Six later scene implementations, rebuilt swing and balance,
                  the long coal route, recovery and escape chapters, the
                  leave/return loop, responsive presentation, touch controls,
                  and browser-ready audio.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-teal)]/16 bg-white px-5 py-3 text-sm font-semibold text-[color:var(--color-teal)] transition hover:border-[color:var(--color-teal)]/28 hover:bg-[color:var(--color-cream)]/45"
              >
                View the source
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <a
                href={submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-teal)]/16 bg-white px-5 py-3 text-sm font-semibold text-[color:var(--color-teal)] transition hover:border-[color:var(--color-teal)]/28 hover:bg-[color:var(--color-cream)]/45"
              >
                Build Week submission
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </section>
        </MotionReveal>
      </Container>

      <Container className="pb-16 md:pb-24">
        <MotionReveal>
          <section className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-center lg:gap-16">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9b4a31]">
                Watch first
              </p>
              <h2 className="text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-5xl">
                Get the three-minute version.
              </h2>
              <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
                The Build Week demo shows the arc, the mechanics, and the
                before-and-after story in 2:45. The complete explanation is
                below if you want the personal and creative context too.
              </p>
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-teal)] underline decoration-[color:var(--color-teal)]/30 underline-offset-4 transition hover:decoration-[color:var(--color-teal)]"
              >
                <Play aria-hidden="true" className="h-4 w-4" />
                Watch on YouTube
              </a>
            </div>
            <ResponsiveVideoEmbed
              title="Jumping on Coals Build Week demo"
              src={demoEmbedUrl}
            />
          </section>
        </MotionReveal>
      </Container>

      <MotionReveal>
        <section
          id="full-story"
          className="scroll-mt-24 bg-[#21100e] py-16 text-[#fff1d6] md:py-24"
        >
          <Container className="space-y-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ffb66f]">
                  Optional deep dive
                </p>
                <h2 className="max-w-[11ch] text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                  Hear the complete story.
                </h2>
              </div>
              <div className="space-y-6">
                <p className="max-w-3xl text-lg leading-8 text-[#fff1d6]/76">
                  This is my full, uncut 16-minute Build Week explanation: how
                  the album came from burnout, how the visual metaphor formed,
                  why the first prototype stalled, and what changed when the
                  complete game finally became possible.
                </p>
                <div className="rounded-[1.4rem] border border-[#fff1d6]/14 bg-black/20 p-4 sm:p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffad61] text-[#24110e]">
                      <Headphones aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">
                        Jumping on Coals: complete explanation
                      </p>
                      <p className="text-xs text-[#fff1d6]/52">
                        Original recording / web-compressed / untrimmed
                      </p>
                    </div>
                  </div>
                  <audio
                    controls
                    preload="metadata"
                    className="w-full accent-[#ffad61]"
                    aria-label="Play the full Jumping on Coals explanation"
                  >
                    <source src={fullExplanationUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="flex flex-wrap gap-4 text-sm font-semibold text-[#fff1d6]/74">
                  <a
                    href={fullExplanationUrl}
                    download
                    className="inline-flex items-center gap-2 transition hover:text-[#ffb66f]"
                  >
                    <Download aria-hidden="true" className="h-4 w-4" />
                    Download audio
                  </a>
                  <a
                    href={transcriptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition hover:text-[#ffb66f]"
                  >
                    <FileText aria-hidden="true" className="h-4 w-4" />
                    Read timestamped transcript
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-x-12 border-t border-[#fff1d6]/14 md:grid-cols-2">
              {audioChapters.map((chapter) => (
                <div
                  key={chapter.time}
                  className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-4 border-b border-[#fff1d6]/12 py-5"
                >
                  <p className="pt-0.5 text-xs font-semibold tabular-nums tracking-[0.12em] text-[#ffb66f]">
                    {chapter.time}
                  </p>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {chapter.title}
                    </h3>
                    <p className="text-sm leading-6 text-[#fff1d6]/58">
                      {chapter.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </MotionReveal>

      <Container className="pt-16 md:pt-24">
        <MotionReveal>
          <section className="relative overflow-hidden rounded-[2rem] bg-[#d8663c] px-6 py-10 text-[#24110e] shadow-[0_30px_80px_rgba(83,32,18,0.2)] md:px-10 md:py-14">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,232,185,0.5),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(77,20,13,0.18),transparent_38%)]"
            />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#24110e]/62">
                  Your turn
                </p>
                <h2 className="max-w-[15ch] text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                  The ending only works if you choose it.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-[#24110e]/72 md:text-lg">
                  Play the full eight-chapter experience in your browser. No
                  install required; headphones make the album&apos;s arc easier
                  to feel.
                </p>
              </div>
              <a
                href={gameUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#24110e] px-6 py-3 text-sm font-semibold text-[#fff1d6] transition hover:-translate-y-0.5 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24110e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#d8663c]"
              >
                Play Jumping on Coals
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </section>
        </MotionReveal>
      </Container>
    </div>
  );
}
