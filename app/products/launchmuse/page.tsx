import type { Metadata } from "next";
import Image from "next/image";
import ProductHero from "@/components/launchmuse/ProductHero";
import WaitlistForm from "@/components/launchmuse/WaitlistForm";
import Portrait, { getPortrait } from "@/components/Portrait";

const roadmapExists = false;

export const metadata: Metadata = {
  title: "LaunchMuse - AI Fan Engagement & Release Planning",
  description:
    "Plan, launch, and grow your music with an AI-native MVP prototype-built in 10 hours to validate release planning for artists. Join the LaunchMuse early access waitlist."
};

const placeholder = (
  <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-brand-slate/10 bg-white/60 shadow-soft">
    <Image
      src="/images/profile-placeholder.svg"
      alt="Portrait illustration placeholder for Daniel Nash"
      fill
      sizes="(min-width: 1024px) 320px, 100vw"
      className="object-cover"
    />
  </div>
);

export default function LaunchMusePage(): JSX.Element {
  const waitlistPortrait = getPortrait("cta-left");

  return (
    <div className="container space-y-12 py-10">
      <ProductHero
        title="LaunchMuse - AI Fan Engagement & Release Planning"
        subtitle="Plan, launch, and grow your music with an AI-native MVP, prototype-built in 10 hours (after a decade away from code) to test the core value of release planning for artists."
        status="Early Access"
        primaryCta={{ href: "#waitlist", label: "Join early access" }}
        secondaryCta={
          roadmapExists
            ? { href: "/products/launchmuse/roadmap", label: "View roadmap" }
            : undefined
        }
      />

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-brand-teal">Case study overview</h2>
        <p className="text-brand-slate/80">
          LaunchMuse is an AI-native tool that helps artists, managers, and small labels plan six-week release campaigns for singles, EPs, and albums. It&apos;s designed to answer a simple question:
        </p>
        <blockquote className="border-l-4 border-brand-teal/40 pl-4 text-brand-slate/80 italic">
          &quot;How can tell my story more effectively than, check out my release&quot;
        </blockquote>
        <p className="text-brand-slate/80">
          As both a composer and an AI Product Manager, I wanted to validate a core hypothesis:
        </p>
        <blockquote className="border-l-4 border-brand-teal/40 pl-4 text-brand-slate/80 italic">
          &quot;A focused, AI-powered MVP can generate a complete six-week campaign around a release date, so artists can spend more time making music and less time building spreadsheets.&quot;
        </blockquote>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-brand-teal">Problem: release campaigns feel like a second job</h2>
        <p className="text-brand-slate/80">
          For most independent artists and small teams, a release campaign means:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-brand-slate/80">
          <li>Building a calendar from scratch for 4&ndash;6 weeks of content.</li>
          <li>Deciding what to post on each channel (Instagram, TikTok, YouTube, email, etc.).</li>
          <li>Remembering key milestones (pre-saves, teasers, behind-the-scenes, launch day, follow-up).</li>
          <li>Translating the story behind the music into consistent, audience-ready content.</li>
        </ul>
        <p className="text-brand-slate/80">The result: a lot of creative energy is spent on logistics instead of the art itself.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-brand-teal">Approach: ship a working AI MVP, not just a concept</h2>
        <p className="text-brand-slate/80">I had not written production code in about a decade.</p>
        <p className="text-brand-slate/80">Using Codes and ChatGPT (OpenAI APIs) as a force multiplier, I:</p>
        <ul className="list-disc space-y-2 pl-6 text-brand-slate/80">
          <li>Spun up a modern Next.js app and basic design system.</li>
          <li>Implemented an AI-powered campaign generator driven by structured prompts.</li>
          <li>Wired it into a simple UI where artists can input their release details.</li>
          <li>Deployed a live, working MVP that real artists can try.</li>
        </ul>
        <p className="text-brand-slate/80">
          Total time from blank repo to working prototype: <strong>~10 hours</strong>.
        </p>
        <p className="text-brand-slate/80">
          This wasn&apos;t a slide deck or a static mockup&mdash;it was a functioning AI-native MVP built specifically to test whether the core value proposition resonated with real users.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-brand-teal">What the current MVP does</h2>
        <p className="text-brand-slate/80">
          Today&apos;s LaunchMuse MVP focuses on a single, high-leverage feature: a <strong>six-week release campaign generator</strong>.
        </p>
        <p className="text-brand-slate/80">Given a release, it can:</p>
        <ul className="list-disc space-y-2 pl-6 text-brand-slate/80">
          <li>
            <strong>Generate a structured six-week plan</strong> around your release date, including pre-launch, launch week, and post-launch follow-up.
          </li>
          <li>
            <strong>Propose post ideas and themes per channel</strong> (e.g., Instagram, TikTok, YouTube, email newsletter) that you can adapt to your voice.
          </li>
          <li>
            <strong>Surface key milestones and reminders</strong>, like pre-save pushes, teaser content, story-driven posts, and fan-engagement prompts.
          </li>
          <li>
            <strong>Create an iteration loop</strong> so you can regenerate, refine, and customize campaigns as you learn what resonates with your audience.
          </li>
        </ul>
        <p className="text-brand-slate/80">
          It&apos;s intentionally narrow in scope: one job, done well. That&apos;s the point of the MVP&mdash;validate the core value before expanding the product surface.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-brand-teal">Try the open alpha (live MVP)</h2>
        <p className="text-brand-slate/80">You can try the core feature today.</p>
        <p className="font-semibold text-brand-teal">
          Open alpha - 6-week campaign generator
        </p>
        <a
          href="https://launchmuse.musicofdanielnash.com/"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-teal/40 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-teal transition hover:-translate-y-0.5 hover:border-brand-teal/60 hover:text-brand-teal/90 focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-teal/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open alpha - LaunchMuse Campaign Generator
        </a>
        <p className="text-brand-slate/80">In the open alpha, you can:</p>
        <ul className="list-disc space-y-2 pl-6 text-brand-slate/80">
          <li>Input basic details about your release (single, EP, or album).</li>
          <li>Generate a draft six-week campaign.</li>
          <li>See how AI structures the timeline, themes, and touchpoints.</li>
          <li>Share feedback that shapes what LaunchMuse becomes next.</li>
        </ul>
        <p className="text-brand-slate/80">
          This is not a mockup&mdash;the open alpha is the actual working MVP I built with Codes and ChatGPT to test real-world value.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-brand-teal">My role as AI Product Manager</h2>
        <p className="text-brand-slate/80">LaunchMuse is a personal demonstration of how I approach AI-native product development:</p>
        <ul className="list-disc space-y-4 pl-6 text-brand-slate/80">
          <li>
            <strong>Vision &amp; problem framing</strong>
            <br />
            Define a concrete, painful problem for a specific user (independent artists and small labels planning releases).
          </li>
          <li>
            <strong>AI-native solution design</strong>
            <br />
            Start from, &quot;What becomes possible if AI is built into the workflow from day one?&quot; rather than bolting AI on later.
          </li>
          <li>
            <strong>Rapid, AI-assisted prototyping</strong>
            <br />
            Use Codes and ChatGPT to go from problem statement to working MVP in hours&mdash;not months&mdash;while still respecting UX and reliability.
          </li>
          <li>
            <strong>Experiment design &amp; validation</strong>
            <br />
            Ship a focused MVP (the six-week campaign generator) and observe: Do artists find it useful? Do they adapt the output? Where does it fall short?
          </li>
          <li>
            <strong>Full-stack ownership</strong>
            <br />
            Own the experience end-to-end: problem framing, UX, prompt design, application architecture, and deployment.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-brand-teal">What&apos;s next</h2>
        <p className="text-brand-slate/80">From here, the roadmap includes:</p>
        <ul className="list-disc space-y-2 pl-6 text-brand-slate/80">
          <li>Deeper personalization based on genre, audience size, and artist brand.</li>
          <li>Built-in asset and content tracking, so posts, videos, and stories live alongside the campaign plan.</li>
          <li>Integrations with scheduling tools and analytics, closing the loop from planning to performance.</li>
          <li>Collaboration workflows for managers, labels, and band members.</li>
        </ul>
        <p className="text-brand-slate/80">
          LaunchMuse is my proof that AI doesn&apos;t just help us prototype ideas&mdash;it lets us ship working MVPs that validate the core value of the products we want to build.
        </p>
      </section>

      <section
        id="waitlist"
        aria-labelledby="launchmuse-waitlist"
        className="space-y-6 rounded-3xl border border-brand-slate/10 bg-white/85 p-10 shadow-soft"
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
          {waitlistPortrait ? (
            <Portrait
              variant="cta-left"
              portrait={waitlistPortrait}
              className="w-full max-w-sm justify-self-center rounded-2xl border border-brand-slate/10 shadow-soft"
            />
          ) : (
            placeholder
          )}
          <div className="space-y-4">
            <div className="space-y-3">
              <h2 id="launchmuse-waitlist" className="text-3xl font-semibold text-brand-teal">
                Join the LaunchMuse waitlist
              </h2>
              <p className="text-brand-slate/80">
                Join the early access list. We&apos;ll invite cohorts in waves and share progress.
              </p>
            </div>
            <WaitlistForm />
          </div>
        </div>
      </section>

      <footer className="rounded-3xl border border-brand-slate/10 bg-brand-teal/10 p-6 text-sm text-brand-slate/80">
        LaunchMuse is developed independently by Daniel Nash. Not affiliated with any past employer.
      </footer>
    </div>
  );
}
