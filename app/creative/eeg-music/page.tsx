import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";
import { notFound } from "next/navigation";
import Container from "@/components/site/Container";
import MediaFrame from "@/components/site/MediaFrame";
import MotionReveal from "@/components/site/MotionReveal";
import ResponsiveVideoEmbed from "@/components/site/ResponsiveVideoEmbed";
import ResponsiveVideoPlayer from "@/components/site/ResponsiveVideoPlayer";
import { getCreativeEntry } from "@/content/portfolio";

const entry = getCreativeEntry("eeg-music");

const youtubeWatchUrl = "https://www.youtube.com/watch?v=D4u6WibLvMQ";
const youtubeEmbedUrl = "https://www.youtube.com/embed/D4u6WibLvMQ";
const interviewWatchUrl = "https://www.youtube.com/watch?v=b_6cR5kkjZI";
const interviewEmbedUrl = "https://www.youtube.com/embed/b_6cR5kkjZI";
const patchImageUrl = "/images/farraginous-puredata-patch.jpg";
const emotivPortraitImageUrl = "/images/farraginous/emotiv-portrait.jpg";
const emotivKitImageUrl = "/images/farraginous/emotiv-kit.jpg";
const installationViewImageUrl = "/images/farraginous/installation-view.jpg";
const exhibitionOverviewImageUrl =
  "/images/farraginous/exhibition-overview.jpg";
const programCreditImageUrl = "/images/farraginous/program-raw.jpg";
const homeDemoVideoUrl = "/videos/farraginous/home-demo.mp4";
const homeDemoPosterImageUrl = "/images/farraginous/home-demo-poster.png";

const metadataItems = [
  { label: "Year", value: "2021" },
  { label: "Context", value: "Center for Latter-day Saint Arts" },
  { label: "Medium", value: "Composition + Video" },
  { label: "Themes", value: "Identity, Tuning, Biometrics" },
] as const;

const overviewParagraphs = [
  "Farraginous is one of my most personal creative works: an experimental composition and video that translates the feeling of living in-between into sound.",
  "Created for the Center for Latter-day Saint Arts, the piece brings together a melody rooted in Chinese tuning, harmony shaped by Western Just Intonation, and biometric-driven experimentation to explore mixed identity, alienation, and the strange beauty of not fitting neatly into a single category.",
  "It is also a statement about coexistence. The tuning systems are not forced into the same frame. They remain distinct, yet they can still live together and create something harmonically rich without one tradition needing to flatten the other.",
] as const;

const whyItExistsParagraphs = [
  "I grew up half Taiwanese and half white in the United States, often feeling close to both worlds without being fully claimed by either. Farraginous came from that tension.",
  "I did not want to make a piece that only explained the idea intellectually. I wanted the music itself to carry that feeling. The tuning systems do not fully resolve into a single frame. The sound world stays beautiful, but unstable.",
  "I also wanted the piece to resist a more typical Western move, where another culture's musical language gets absorbed and normalized into a dominant system. Here, the different tuning systems are allowed to stay themselves. The result is a piece about identity, misreading, coexistence, and the middle space.",
] as const;

const howItWorksItems = [
  {
    title: "Melody",
    body: "The melodic language draws from Chinese tuning, giving the piece a tonal center that feels rooted but not conventionally Western.",
  },
  {
    title: "Harmony",
    body: "The harmonic world is shaped through Western Just Intonation, creating a different kind of stability and tension around the melodic material.",
  },
  {
    title: "Biometrics",
    body: "The piece also incorporates EEG-related and facial-expression-linked input. In particular, blinking influenced the melody, turning small physical gestures into musical events.",
  },
  {
    title: "System adaptation",
    body: "The original concept for Farraginous was to incorporate EEG-derived emotional readings, especially frustration, into the musical behavior. I was working with an Emotiv EPOC+, but by that stage the hardware was beginning to fail, and its emotional-state readings were no longer precise enough to use confidently. I also intended to incorporate live heartbeat, but I was not able to patch live Fitbit data into Pure Data reliably, so the BPM of the final piece oscillates between the highest and lowest heart rates I measured while working on it. Rather than overstate what the system could do, I adapted the piece around the signals that remained dependable, particularly blink-related and expression-linked input.",
  },
] as const;

export const metadata: Metadata = {
  title: "Farraginous",
  description:
    "A creative case study for Farraginous, Daniel Nash's 2021 composition and video about mixed identity, hybrid tuning systems, and biometric signals.",
};

type ArtifactCardProps = {
  eyebrow?: string;
  title: string;
  caption: string;
  alt: string;
  image: string;
  href?: string;
  className?: string;
  mediaClassName?: string;
  imageClassName?: string;
  unoptimized?: boolean;
};

function ArtifactCard({
  eyebrow = "Artifact",
  title,
  caption,
  alt,
  image,
  href,
  className,
  mediaClassName,
  imageClassName,
  unoptimized = false,
}: ArtifactCardProps): JSX.Element {
  return (
    <article
      className={clsx(
        "group flex h-full flex-col border-t border-[color:var(--color-slate)]/16 pt-5",
        className,
      )}
    >
      <MediaFrame
        src={image}
        alt={alt}
        fallbackTitle={title}
        sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw"
        className={clsx(
          "aspect-[3/2] border border-[color:var(--color-slate)]/12 bg-white",
          mediaClassName,
        )}
        imageClassName={clsx(
          "object-cover transition-transform duration-700 group-hover:scale-[1.02]",
          imageClassName,
        )}
        unoptimized={unoptimized}
        expandable
        expandLabel={`Expand ${title}`}
      />

      <div className="flex flex-1 flex-col pt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--color-orange)]">
          {eyebrow}
        </p>
        <h3 className="mt-3 font-serif text-2xl font-medium tracking-[-0.03em] text-[color:var(--color-slate)]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[color:var(--color-slate)]/64">
          {caption}
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-fit items-center gap-2 border-b border-[color:var(--color-teal)] pb-1 text-sm font-bold text-[color:var(--color-teal)] transition hover:border-[color:var(--color-orange)] hover:text-[color:var(--color-orange)]"
          >
            Watch on YouTube
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

type VideoArtifactCardProps = {
  title: string;
  caption: string;
  src: string;
  poster?: string;
  aspectClassName?: string;
  className?: string;
};

function VideoArtifactCard({
  title,
  caption,
  src,
  poster,
  aspectClassName,
  className,
}: VideoArtifactCardProps): JSX.Element {
  return (
    <article
      className={clsx(
        "flex h-full flex-col border-t border-[color:var(--color-slate)]/16 pt-5",
        className,
      )}
    >
      <div className="overflow-hidden border border-[color:var(--color-slate)]/12 bg-white">
        <ResponsiveVideoPlayer
          title={title}
          src={src}
          poster={poster}
          aspectClassName={aspectClassName}
        />
      </div>

      <div className="pt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--color-orange)]">
          Process video
        </p>
        <h3 className="mt-3 font-serif text-2xl font-medium tracking-[-0.03em] text-[color:var(--color-slate)]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[color:var(--color-slate)]/64">
          {caption}
        </p>
      </div>
    </article>
  );
}

export default function EegMusicPage(): JSX.Element {
  if (!entry) {
    notFound();
  }

  return (
    <div className="overflow-hidden pb-20 md:pb-28">
      <section className="bg-[color:var(--color-slate)] text-[color:var(--color-cream)]">
        <Container className="py-10 md:py-14 lg:py-20">
          <Link
            href="/creative"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--color-tan)]/68 transition hover:text-[color:var(--color-tan)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Creative studio
          </Link>

          <div className="mt-10 grid items-end gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(440px,1.14fr)] lg:gap-16">
            <MotionReveal>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-orange)]">
                  Composition / creative technology
                </p>
                <h1 className="mt-6 max-w-[8ch] font-serif text-[clamp(4rem,7vw,6.5rem)] font-medium leading-[0.82] tracking-[-0.06em]">
                  Farraginous
                </h1>
                <p className="mt-7 max-w-lg text-pretty font-serif text-2xl italic leading-[1.18] tracking-[-0.02em] text-[color:var(--color-tan)] md:text-3xl">
                  The sound of living in-between.
                </p>
                <p className="mt-6 max-w-xl text-base leading-8 text-[color:var(--color-cream)]/64">
                  An experimental composition and video about mixed identity,
                  shaped by hybrid tuning systems and biometric signals.
                </p>
                <a
                  href="#watch"
                  className="group mt-8 inline-flex items-center gap-3 border border-[color:var(--color-tan)] bg-[color:var(--color-tan)] px-5 py-3 text-sm font-bold text-[color:var(--color-slate)] transition hover:bg-[color:var(--color-cream)]"
                >
                  Watch the piece
                  <Play
                    className="h-3.5 w-3.5 fill-current transition-transform group-hover:scale-110"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </MotionReveal>

            <MotionReveal delay={0.1}>
              <figure>
                <div className="relative pb-6 pl-5 sm:pl-8">
                  <div
                    className="absolute bottom-0 left-0 top-8 w-[36%] bg-[color:var(--color-orange)]"
                    aria-hidden="true"
                  />
                  <MediaFrame
                    src={installationViewImageUrl}
                    alt="Farraginous displayed in the Center for Latter-day Saint Arts exhibition."
                    fallbackTitle="Farraginous installation"
                    sizes="(min-width: 1024px) 56vw, 100vw"
                    priority
                    className="aspect-[16/11] border border-white/14 bg-black"
                    imageClassName="object-cover"
                  />
                </div>
                <figcaption className="ml-5 flex justify-between gap-5 border-t border-white/16 pt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-cream)]/46 sm:ml-8">
                  <span>Installation view</span>
                  <span>Center for Latter-day Saint Arts</span>
                </figcaption>
              </figure>
            </MotionReveal>
          </div>

          <dl
            aria-label="Project metadata"
            className="mt-14 grid border-t border-white/14 sm:grid-cols-2 lg:grid-cols-4"
          >
            {metadataItems.map((item, index) => (
              <MotionReveal
                key={item.label}
                delay={index * 0.04}
                className="border-b border-white/12 py-5 sm:px-5 sm:odd:border-r lg:border-b-0 lg:border-r lg:odd:border-r lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <dt className="text-[9px] font-bold uppercase tracking-[0.22em] text-[color:var(--color-tan)]/54">
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm font-semibold leading-6 text-[color:var(--color-cream)]/84">
                  {item.value}
                </dd>
              </MotionReveal>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="py-20 md:py-28">
        <MotionReveal>
          <section className="grid gap-10 border-b border-[color:var(--color-slate)]/16 pb-20 md:pb-28 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-orange)]">
                The work
              </p>
              <h2 className="mt-5 max-w-[9ch] text-balance font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] text-[color:var(--color-slate)] md:text-6xl">
                Two systems, neither erased.
              </h2>
            </div>
            <div className="space-y-6">
              {overviewParagraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === 0
                      ? "max-w-3xl text-pretty text-xl leading-9 text-[color:var(--color-slate)]/82 md:text-2xl md:leading-10"
                      : "max-w-3xl text-base leading-8 text-[color:var(--color-slate)]/64"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </MotionReveal>

        <MotionReveal>
          <section className="grid gap-10 pt-20 md:pt-28 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-orange)]">
                Why I made it
              </p>
              <p className="mt-5 max-w-[13ch] font-serif text-3xl italic leading-[1.12] tracking-[-0.035em] text-[color:var(--color-slate)] md:text-4xl">
                “I wanted the music itself to carry the feeling.”
              </p>
            </div>
            <div className="space-y-6">
              {whyItExistsParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-3xl text-base leading-8 text-[color:var(--color-slate)]/66"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </MotionReveal>
      </Container>

      <section
        id="watch"
        className="scroll-mt-24 bg-[#102b30] py-20 text-[color:var(--color-cream)] md:py-28"
      >
        <Container>
          <MotionReveal className="grid items-start gap-10 lg:grid-cols-[minmax(260px,0.62fr)_minmax(0,1.38fr)] lg:gap-16">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-tan)]/68">
                Final artifact
              </p>
              <h2 className="mt-5 max-w-[7ch] font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] md:text-6xl">
                Watch the piece.
              </h2>
              <p className="mt-6 max-w-sm text-base leading-7 text-[color:var(--color-cream)]/60">
                The released video carries the composition, the body, and the
                visual narrative as one artifact.
              </p>
              <a
                href={youtubeWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 border-b border-[color:var(--color-tan)] pb-1 text-sm font-bold text-[color:var(--color-tan)] transition hover:text-white"
              >
                Open on YouTube
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <div className="border border-white/14 bg-black">
              <ResponsiveVideoEmbed
                title="Farraginous by Daniel Nash"
                src={youtubeEmbedUrl}
              />
            </div>
          </MotionReveal>
        </Container>
      </section>

      <Container className="py-20 md:py-28">
        <MotionReveal className="grid gap-10 lg:grid-cols-[minmax(260px,0.62fr)_minmax(0,1.38fr)] lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-orange)]">
              Inside the system
            </p>
            <h2 className="mt-5 max-w-[9ch] text-balance font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] text-[color:var(--color-slate)] md:text-6xl">
              Body becomes material.
            </h2>
            <p className="mt-6 max-w-sm text-base leading-7 text-[color:var(--color-slate)]/62">
              Tuning and biometrics shaped behavior, but the piece remained
              grounded in musical feeling rather than technical display.
            </p>
          </div>

          <ol className="border-t border-[color:var(--color-slate)]/16">
            {howItWorksItems.map((item, index) => (
              <li
                key={item.title}
                className="grid gap-4 border-b border-[color:var(--color-slate)]/14 py-7 sm:grid-cols-[44px_160px_1fr] sm:gap-7"
              >
                <span className="font-mono text-[10px] text-[color:var(--color-orange)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[color:var(--color-slate)]">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-[color:var(--color-slate)]/64">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </MotionReveal>

        <MotionReveal>
          <blockquote className="mt-16 border-l-4 border-[color:var(--color-orange)] py-2 pl-6 font-serif text-2xl italic leading-[1.3] tracking-[-0.025em] text-[color:var(--color-slate)] md:ml-[32%] md:mt-20 md:pl-8 md:text-3xl">
            Different cultural systems can coexist without one needing to erase
            the other.
          </blockquote>
        </MotionReveal>
      </Container>

      <section className="border-y border-[color:var(--color-slate)]/12 bg-[color:var(--color-background-soft)] py-20 md:py-28">
        <Container>
          <MotionReveal className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-orange)]">
                Process / system artifacts
              </p>
              <h2 className="mt-5 max-w-[10ch] font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] text-[color:var(--color-slate)] md:text-6xl">
                The apparatus stayed visible.
              </h2>
            </div>
            <p className="max-w-2xl self-end text-base leading-8 text-[color:var(--color-slate)]/62 md:text-lg">
              The device, patch, and live setup tests show Farraginous as
              documented creative R&amp;D—not an abstract technology story.
            </p>
          </MotionReveal>

          <div className="mt-14 grid gap-x-7 gap-y-12 lg:grid-cols-12">
            <MotionReveal className="lg:col-span-4">
              <ArtifactCard
                eyebrow="Process artifact"
                title="Development portrait"
                caption="Using the Emotiv EPOC+ during development."
                image={emotivPortraitImageUrl}
                alt="Portrait of Daniel Nash wearing the Emotiv EPOC+ during development."
                mediaClassName="aspect-[4/5]"
                unoptimized
              />
            </MotionReveal>
            <MotionReveal delay={0.05} className="lg:col-span-8">
              <ArtifactCard
                eyebrow="Process artifact"
                title="Signal patch"
                caption="The Pure Data environment used to map biometric behavior into sound."
                image={patchImageUrl}
                alt="Raw Pure Data patch used to shape signal behavior in Farraginous."
                mediaClassName="aspect-[4/3]"
                imageClassName="object-contain bg-white p-2 md:p-4 group-hover:scale-100"
              />
            </MotionReveal>
            <MotionReveal className="lg:col-span-6">
              <ArtifactCard
                eyebrow="Process artifact"
                title="Device kit"
                caption="The EEG device used in the project."
                image={emotivKitImageUrl}
                alt="The Emotiv EPOC+ device and kit used in the project."
                mediaClassName="aspect-[4/3]"
                unoptimized
              />
            </MotionReveal>
            <MotionReveal delay={0.05} className="lg:col-span-6">
              <VideoArtifactCard
                title="Home demo"
                caption="Blink detection and patch behavior running together in real time."
                src={homeDemoVideoUrl}
                poster={homeDemoPosterImageUrl}
                aspectClassName="aspect-[4/3]"
              />
            </MotionReveal>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <MotionReveal className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-orange)]">
                Presented publicly
              </p>
              <h2 className="mt-5 max-w-[10ch] font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] text-[color:var(--color-slate)] md:text-6xl">
                The experiment entered a room.
              </h2>
            </div>
            <div className="space-y-5 self-end">
              <p className="max-w-2xl text-base leading-8 text-[color:var(--color-slate)]/64">
                Farraginous was presented as part of the Center for Latter-day
                Saint Arts exhibition, alongside other artists in a public
                event setting.
              </p>
              <p className="max-w-2xl text-base leading-8 text-[color:var(--color-slate)]/64">
                Seeing people encounter it changed my understanding of the
                piece. One visitor told me it helped him empathize more deeply
                with his mixed-race child. It suggested the work was doing what
                I hoped: making in-betweenness felt rather than merely
                explained.
              </p>
            </div>
          </MotionReveal>

          <MotionReveal className="mt-14">
            <MediaFrame
              src={exhibitionOverviewImageUrl}
              alt="Wide exhibition overview showing the broader gallery context."
              fallbackTitle="Exhibition context"
              sizes="100vw"
              className="aspect-[16/9] border border-[color:var(--color-slate)]/12 bg-white"
              imageClassName="object-cover"
              expandable
              expandLabel="Expand exhibition context"
            />
            <div className="flex flex-col gap-2 border-b border-[color:var(--color-slate)]/16 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-slate)]/46 sm:flex-row sm:items-center sm:justify-between">
              <span>Exhibition context</span>
              <span>Center for Latter-day Saint Arts</span>
            </div>
          </MotionReveal>

          <div className="mt-12 grid gap-x-7 gap-y-12 lg:grid-cols-[1.4fr_0.6fr]">
            <MotionReveal>
              <ArtifactCard
                eyebrow="Installation"
                title="Installation view"
                caption="Farraginous on display within the exhibition."
                image={installationViewImageUrl}
                alt="Installation view with Farraginous on display in the exhibition."
                mediaClassName="aspect-[16/10]"
              />
            </MotionReveal>
            <MotionReveal delay={0.05}>
              <ArtifactCard
                eyebrow="Credit"
                title="Program listing"
                caption="Program listing with composers credit."
                image={programCreditImageUrl}
                alt="Program listing showing Daniel Nash under the composers credit."
                mediaClassName="aspect-[4/5]"
                imageClassName="object-contain bg-[color:var(--color-background-soft)] p-2 group-hover:scale-100"
                unoptimized
              />
            </MotionReveal>
          </div>

          <MotionReveal>
            <blockquote className="mx-auto mt-20 max-w-4xl border-y border-[color:var(--color-slate)]/16 py-10 text-center font-serif text-2xl italic leading-[1.3] tracking-[-0.03em] text-[color:var(--color-slate)] md:text-4xl">
              “The work showed me how two cultural systems could remain
              distinct, still live together, and sound beautiful without one
              forcing the other into its frame.”
            </blockquote>
          </MotionReveal>
        </Container>
      </section>

      <section className="bg-[color:var(--color-slate)] py-20 text-[color:var(--color-cream)] md:py-28">
        <Container>
          <MotionReveal className="grid gap-10 lg:grid-cols-[minmax(260px,0.62fr)_minmax(0,1.38fr)] lg:gap-16">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-tan)]/62">
                Artist interview
              </p>
              <h2 className="mt-5 max-w-[8ch] font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] md:text-6xl">
                The wider conversation.
              </h2>
              <p className="mt-6 max-w-sm text-base leading-7 text-[color:var(--color-cream)]/60">
                The Center for Latter-day Saint Arts&apos;{" "}
                <em>I AM: Creation</em> interview adds context for the
                exhibition and the ideas surrounding Farraginous.
              </p>
              <p className="mt-4 max-w-sm text-sm leading-7 text-[color:var(--color-cream)]/46">
                Supporting context rather than the main artifact, it places the
                piece within the exhibition&apos;s larger conversation.
              </p>
              <a
                href={interviewWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 border-b border-[color:var(--color-tan)] pb-1 text-sm font-bold text-[color:var(--color-tan)] transition hover:text-white"
              >
                Watch the interview
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <div className="border border-white/14 bg-black">
              <ResponsiveVideoEmbed
                title="I AM: Creation interview"
                src={interviewEmbedUrl}
              />
            </div>
          </MotionReveal>
        </Container>
      </section>

      <Container className="py-20 md:py-28">
        <MotionReveal className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--color-orange)]">
              Why it belongs here
            </p>
            <h2 className="mt-5 max-w-[9ch] font-serif text-4xl font-medium leading-[0.96] tracking-[-0.045em] text-[color:var(--color-slate)] md:text-6xl">
              A creative work. The same way of thinking.
            </h2>
          </div>
          <div className="space-y-6 self-end">
            <p className="max-w-2xl text-lg leading-8 text-[color:var(--color-slate)]/68">
              Farraginous reflects the same instincts that shape my product
              work: translating ambiguous inputs into meaningful systems,
              designing around human signals, and using structure to turn
              complexity into something people can feel.
            </p>
            <p className="max-w-2xl text-base leading-8 text-[color:var(--color-slate)]/60">
              It is a creative work, but it reveals the systems thinking,
              experimentation, and narrative intent that drive the rest of my
              portfolio.
            </p>
            <Link
              href="/creative"
              className="inline-flex items-center gap-2 border-b border-[color:var(--color-teal)] pb-1 text-sm font-bold text-[color:var(--color-teal)] transition hover:border-[color:var(--color-orange)] hover:text-[color:var(--color-orange)]"
            >
              Explore more creative work
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </MotionReveal>
      </Container>
    </div>
  );
}
