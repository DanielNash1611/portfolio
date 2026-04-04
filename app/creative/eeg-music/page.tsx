import type { Metadata } from "next";
import Image from "next/image";
import clsx from "clsx";
import { notFound } from "next/navigation";
import Container from "@/components/site/Container";
import ContentSection from "@/components/site/ContentSection";
import MediaFrame from "@/components/site/MediaFrame";
import ResponsiveVideoEmbed from "@/components/site/ResponsiveVideoEmbed";
import ResponsiveVideoPlayer from "@/components/site/ResponsiveVideoPlayer";
import { getCreativeEntry } from "@/content/portfolio";

const entry = getCreativeEntry("eeg-music");

const youtubeWatchUrl = "https://www.youtube.com/watch?v=D4u6WibLvMQ";
const youtubeEmbedUrl = "https://www.youtube.com/embed/D4u6WibLvMQ";
const interviewWatchUrl = "https://www.youtube.com/watch?v=b_6cR5kkjZI";
const interviewEmbedUrl = "https://www.youtube.com/embed/b_6cR5kkjZI";
const youtubeThumbnailUrl = "/images/farraginous-youtube-thumb.jpg";
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
        "overflow-hidden rounded-[1.6rem] border border-black/6 bg-white/86 shadow-[0_18px_50px_rgba(58,61,64,0.08)]",
        className,
      )}
    >
      <MediaFrame
        src={image}
        alt={alt}
        fallbackTitle={title}
        sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw"
        className={clsx(
          "aspect-[3/2] border-b border-black/6 bg-[color:var(--color-cream)]/78",
          mediaClassName,
        )}
        imageClassName={clsx("object-cover", imageClassName)}
        unoptimized={unoptimized}
        expandable
        expandLabel={`Expand ${title}`}
      />

      <div className="space-y-3 p-5 md:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/68">
          {eyebrow}
        </p>
        <h3 className="text-xl font-semibold tracking-tight text-[color:var(--color-slate)]">
          {title}
        </h3>
        <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
          {caption}
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-semibold text-[color:var(--color-teal)] underline decoration-[color:var(--color-teal)]/35 underline-offset-4 transition hover:decoration-[color:var(--color-teal)]"
          >
            Watch on YouTube
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
        "overflow-hidden rounded-[1.6rem] border border-black/6 bg-white/86 shadow-[0_18px_50px_rgba(58,61,64,0.08)]",
        className,
      )}
    >
      <ResponsiveVideoPlayer
        title={title}
        src={src}
        poster={poster}
        aspectClassName={aspectClassName}
      />

      <div className="space-y-3 p-5 md:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/68">
          Process video
        </p>
        <h3 className="text-xl font-semibold tracking-tight text-[color:var(--color-slate)]">
          {title}
        </h3>
        <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
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
    <Container className="space-y-8 pt-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-black/6 bg-white/84 px-6 py-8 shadow-[0_30px_80px_rgba(58,61,64,0.1)] md:px-8 md:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(44,79,82,0.04),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(209,122,95,0.035),_transparent_42%)]"
        />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.98fr)]">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-teal)]/70">
                Creative Technology / Original Composition / Center for
                Latter-day Saint Arts
              </p>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-5xl">
                Farraginous
              </h1>
              <p className="max-w-3xl text-pretty text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
                An experimental composition and video about mixed identity,
                shaped by hybrid tuning systems and biometric signals.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/88 px-5 py-5">
              <p className="text-lg leading-8 text-[color:var(--color-slate)]">
                “A song built from biometric signals about mixed identity,
                coexistence, and belonging.”
              </p>
            </div>
          </div>

          <div className="relative min-h-[360px] lg:min-h-[420px]">
            <div className="absolute inset-y-8 right-0 left-12 overflow-hidden rounded-[1.8rem] border border-[color:var(--color-teal)]/10 bg-white shadow-[0_28px_70px_rgba(58,61,64,0.12)]">
              <div className="relative h-full w-full">
                <Image
                  src={patchImageUrl}
                  alt="Raw Pure Data patch used in Farraginous."
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,245,242,0.18),rgba(58,61,64,0.12))]" />
                <div className="absolute right-5 top-5 rounded-full border border-white/35 bg-[color:var(--color-slate)]/72 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                  Raw Pure Data patch
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-[58%] max-w-[320px] overflow-hidden rounded-[1.6rem] border border-black/8 bg-white shadow-[0_24px_60px_rgba(58,61,64,0.16)] lg:-rotate-[4deg]">
              <div className="relative aspect-[4/5]">
                <Image
                  src={youtubeThumbnailUrl}
                  alt="Video still from Farraginous showing the EEG headset in frame."
                  fill
                  sizes="(min-width: 1024px) 18vw, 50vw"
                  className="object-cover object-[58%_center]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(58,61,64,0.04),rgba(58,61,64,0.28))]" />
              </div>
              <div className="space-y-1 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/68">
                  Final video still
                </p>
                <p className="text-sm leading-6 text-[color:var(--color-slate)]/72">
                  The released artifact, with the EEG headset still visible in
                  frame.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Project metadata"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metadataItems.map((item) => (
          <div
            key={item.label}
            className="rounded-[1.5rem] border border-[color:var(--color-teal)]/10 bg-white/84 px-5 py-5 shadow-[0_18px_40px_rgba(58,61,64,0.06)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/68">
              {item.label}
            </p>
            <p className="mt-2 text-base font-semibold leading-7 text-[color:var(--color-slate)]">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
        <ContentSection title="Overview">
          {overviewParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-7 text-[color:var(--color-slate)]/72"
            >
              {paragraph}
            </p>
          ))}

          <div className="space-y-4 border-t border-[color:var(--color-teal)]/12 pt-6">
            <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
              Why I made it
            </h3>
            {whyItExistsParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-7 text-[color:var(--color-slate)]/72"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </ContentSection>

        <ContentSection
          title="Watch the piece"
          description="The released video artifact for Farraginous."
        >
          <ResponsiveVideoEmbed
            title="Farraginous by Daniel Nash"
            src={youtubeEmbedUrl}
          />
          <p className="text-sm leading-6 text-[color:var(--color-slate)]/68">
            Watch Farraginous, the final video artifact for this project.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={youtubeWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-teal)] bg-[color:var(--color-teal)] px-5 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-[color:var(--color-slate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-cream)]"
            >
              Watch on YouTube
            </a>
          </div>
        </ContentSection>
      </section>

      <ContentSection
        title="How it works"
        description="The system stayed intentionally legible: tuning and biometrics shaped behavior, but the piece remained grounded in musical feeling rather than technical display."
      >
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {howItWorksItems.map((item) => (
            <article
              key={item.title}
              className="space-y-3 border-t border-[color:var(--color-teal)]/12 pt-4"
            >
              <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
                {item.title}
              </h3>
              <p className="text-base leading-7 text-[color:var(--color-slate)]/72">
                {item.body}
              </p>
            </article>
          ))}
        </div>

        <div className="rounded-[1.5rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/88 px-5 py-5">
          <p className="text-base leading-7 text-[color:var(--color-slate)]/76">
            Instead of treating biometric data as a novelty effect, I used it as
            compositional material. The result is a piece where identity is
            expressed not only through story and tuning, but through the
            behavior of the body itself. It is also an argument that different
            cultural systems can coexist without one needing to erase the other.
          </p>
        </div>
      </ContentSection>

      <ContentSection
        title="Process / System Artifacts"
        description="This material shows the project as documented creative R&D: the device, the patch, the live setup tests, and the way the system was actually handled during development."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <ArtifactCard
            eyebrow="Process artifact"
            title="Development portrait"
            caption="Using the Emotiv EPOC+ during development."
            image={emotivPortraitImageUrl}
            alt="Portrait of Daniel Nash wearing the Emotiv EPOC+ during development."
            mediaClassName="aspect-[4/5]"
            className="lg:row-span-1"
            unoptimized
          />
          <ArtifactCard
            eyebrow="Process artifact"
            title="Signal patch"
            caption="Patch environment used to map biometric behavior into sound."
            image={patchImageUrl}
            alt="Raw Pure Data patch used to shape signal behavior in Farraginous."
            className="lg:col-span-2"
            mediaClassName="aspect-[4/3]"
            imageClassName="object-contain bg-white p-2 md:p-4"
          />
          <ArtifactCard
            eyebrow="Process artifact"
            title="Device kit"
            caption="The EEG device used in the project."
            image={emotivKitImageUrl}
            alt="The Emotiv EPOC+ device and kit used in the project."
            mediaClassName="aspect-[4/3]"
            unoptimized
          />
          <VideoArtifactCard
            title="Home demo"
            caption="Home demo showing blink detection and patch behavior in real time."
            src={homeDemoVideoUrl}
            poster={homeDemoPosterImageUrl}
            aspectClassName="aspect-[4/5]"
          />
        </div>
      </ContentSection>

      <ContentSection
        title="Exhibition / Presented Publicly"
        description="Farraginous was presented as part of the Center for Latter-day Saint Arts exhibition environment, where the work was shown alongside other artists in a public event setting."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <ArtifactCard
            eyebrow="Installation"
            title="Installation view"
            caption="Installation view with Farraginous on display."
            image={installationViewImageUrl}
            alt="Installation view with Farraginous on display in the exhibition."
            className="lg:col-span-2"
            mediaClassName="aspect-[16/10]"
          />
          <ArtifactCard
            eyebrow="Credit"
            title="Program listing"
            caption="Program listing with composers credit."
            image={programCreditImageUrl}
            alt="Program listing showing Daniel Nash under the composers credit."
            mediaClassName="aspect-[4/5]"
            imageClassName="object-contain bg-[color:var(--color-background)] p-2"
            unoptimized
          />
          <ArtifactCard
            eyebrow="Exhibition"
            title="Exhibition context"
            caption="Exhibition context."
            image={exhibitionOverviewImageUrl}
            alt="Wide exhibition overview showing the broader gallery context."
            className="lg:col-span-3"
            mediaClassName="aspect-[16/9]"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.8fr)]">
          <div className="space-y-5">
            <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
              Seeing the piece presented publicly changed my understanding of
              what it had become. I got to watch people encounter it alongside
              paintings, installation work, and other artists connected to the
              exhibition, which made the piece feel less like a private system
              experiment and more like a shared act of interpretation.
            </p>
            <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
              One gentleman told me it helped him empathize more deeply with his
              mixed-race child. That stayed with me. It suggested the work was
              doing what I hoped: making in-betweenness felt rather than merely
              explained.
            </p>
          </div>

          <blockquote className="rounded-[1.5rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/88 px-5 py-5 text-base leading-7 text-[color:var(--color-slate)]">
            “The work showed me how two cultural systems could remain distinct,
            still live together, and sound beautiful without one forcing the
            other into its frame.”
          </blockquote>
        </div>
      </ContentSection>

      <ContentSection
        title="Artist Interview / Exhibition Context"
        tone="muted"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.78fr)]">
          <div className="space-y-5">
            <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
              I was also featured in the Center for Latter-day Saint Arts&apos;{" "}
              <em>I AM: Creation</em> interview, which provides additional
              context for the exhibition and the ideas surrounding Farraginous.
            </p>
            <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
              This is supporting context rather than the main artifact, but it
              helps place the piece within the larger exhibition conversation.
            </p>
            <a
              href={interviewWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-semibold text-[color:var(--color-teal)] underline decoration-[color:var(--color-teal)]/35 underline-offset-4 transition hover:decoration-[color:var(--color-teal)]"
            >
              Watch the interview on YouTube
            </a>
          </div>

          <div className="max-w-[540px] lg:justify-self-end">
            <ResponsiveVideoEmbed
              title="I AM: Creation interview"
              src={interviewEmbedUrl}
            />
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Why it belongs in this portfolio" tone="muted">
        <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
          This project belongs here not just as a piece of music, but as an
          example of how I think. Farraginous reflects the same instincts that
          shape my product work: translating ambiguous inputs into meaningful
          systems, designing around human signals, and using structure to turn
          complexity into something people can feel.
        </p>
        <p className="text-base leading-7 text-[color:var(--color-slate)]/74">
          It is a creative work, but it reveals the same systems thinking,
          experimentation, and narrative intent that drive the rest of my
          portfolio.
        </p>
      </ContentSection>
    </Container>
  );
}
