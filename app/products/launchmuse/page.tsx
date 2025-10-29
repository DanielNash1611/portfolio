import type { Metadata } from "next";
import Image from "next/image";
import ProductHero from "@/components/launchmuse/ProductHero";
import FeatureList from "@/components/launchmuse/FeatureList";
import DemoFrame from "@/components/launchmuse/DemoFrame";
import WaitlistForm from "@/components/launchmuse/WaitlistForm";
import Portrait, { getPortrait } from "@/components/Portrait";

const features = [
  {
    title: "AI Campaign Generator",
    description: "Six-week plans tailored to your release date and vibe."
  },
  {
    title: "Audience Insights",
    description: "Pull signals to shape content that resonates."
  },
  {
    title: "Prompt Studio",
    description: "Editable, reusable prompts for posts, emails, and ads."
  },
  {
    title: "Release Timeline",
    description: "Single source of truth from idea to launch."
  }
];

const roadmapExists = false;

export const metadata: Metadata = {
  title: "LaunchMuse - AI Fan Engagement & Release Planning",
  description:
    "Plan, launch, and grow your music with AI-assisted campaigns and audience insights. Join the LaunchMuse early access waitlist."
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
        subtitle="Plan, launch, and grow your music with AI-assisted campaigns and audience insights."
        status="Early Access"
        primaryCta={{ href: "#waitlist", label: "Join early access" }}
        secondaryCta={
          roadmapExists
            ? { href: "/products/launchmuse/roadmap", label: "View roadmap" }
            : undefined
        }
      />

      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-3xl font-semibold text-brand-teal">What&apos;s inside</h2>
          <p className="text-brand-slate/80">
            LaunchMuse pairs AI assists with human control so you can stay on top of every release milestone.
          </p>
        </header>
        <FeatureList features={features} />
      </section>

      <section aria-labelledby="launchmuse-demo" className="space-y-4">
        <h2 id="launchmuse-demo" className="text-3xl font-semibold text-brand-teal">
          Demo preview
        </h2>
        <DemoFrame text="Interactive demo is in closed beta. Join Early Access to try it." />
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
