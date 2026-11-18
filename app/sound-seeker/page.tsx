import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SoundSeekerWidget } from "@/components/sound-seeker/SoundSeekerWidget";
import SoundBrief from "@/components/overnight-creative/SoundBrief";
import styles from "@/components/overnight-creative/sound-seeker.module.css";

export const metadata: Metadata = {
  title: "Sound Seeker",
  description:
    "An AI gear-consultant prototype for exploring the instruments, effects and techniques behind a reference sound.",
};

export default function SoundSeekerPage() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <div className={styles.masthead}>
          <p>Music tools / interactive prototype</p>
          <Link href="/work/ai-platform-mcp">
            The platform story <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <h1>
          Sound Seeker<span aria-hidden="true">↗</span>
        </h1>
        <div className={styles.introBottom}>
          <p>
            Find a place to start
            <br />
            with the sound in your head.
          </p>
          <div>
            <p>
              Explore instruments, effects and playing techniques behind a
              reference sound.
            </p>
            <nav aria-label="Sound Seeker workspace">
              <a href="#tone-workspace">01 / Try the prototype ↓</a>
              <a href="#sound-brief">02 / Shape a question ↓</a>
              <a href="#listen-check">03 / Listen and verify ↓</a>
            </nav>
          </div>
        </div>
      </header>
      <section
        id="tone-workspace"
        aria-labelledby="workspace-title"
        className={styles.workspace}
      >
        <div className={styles.workspaceNote}>
          <p className={styles.eyebrow}>01 / Tone workspace</p>
          <h2 id="workspace-title">
            What are you <br />
            chasing?
          </h2>
          <p>
            Begin with a song, artist or sonic detail. Use an example to fill
            the prompt, or describe your own reference.
          </p>
          <a href="#sound-brief">
            Need a more specific question? Build a brief ↓
          </a>
          <div className={styles.boundary}>
            <p>Prototype / AI recommendations</p>
            <p>
              “Generate Recommendations” sends your prompt for an AI response.
              Examples only fill the field.
            </p>
          </div>
        </div>
        <div className={styles.instrument}>
          <div className={styles.label}>
            <span>Reference → practical exploration</span>
            <span>Prototype</span>
          </div>
          <SoundSeekerWidget />
        </div>
      </section>
      <SoundBrief />
      <section
        className={styles.verify}
        id="listen-check"
        aria-labelledby="verify-title"
      >
        <p className={styles.eyebrow}>03 / Listen and verify</p>
        <h2 id="verify-title">
          A recommendation
          <br />
          is the beginning.
        </h2>
        <div>
          <article>
            <span>01</span>
            <h3>Play it.</h3>
            <p>
              Try the technique and settings with the instrument and gear you
              already have. Compare what you hear with the specific part of the
              reference.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Check the claim.</h3>
            <p>
              A suggested way to approximate a sound is different from a
              documented recording chain. Verify exact credits, equipment and
              settings before treating an answer as historical fact.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Refine the question.</h3>
            <p>
              Describe what is still different—attack, movement, space or
              texture—and bring that detail into the next question.
            </p>
          </article>
        </div>
      </section>
      <footer className={styles.contextFooter}>
        <p>
          This is the interactive prototype. The wider case study explains how
          it informed the platform direction.
        </p>
        <Link href="/work/ai-platform-mcp#sound-seeker-live-demo">
          Read the platform story <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </footer>
    </div>
  );
}
