import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import Portrait, { getPortrait } from "@/components/Portrait";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send a note about Senior Product Manager, Builder PM, Product Leader, or select speaking opportunities.",
};

export default function ContactPage(): JSX.Element {
  const ctaPortrait = getPortrait("cta-right");

  const placeholder = (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-brand-slate/10 bg-white/60 shadow-soft">
      <Image
        src="/images/profile-placeholder.svg"
        alt="Portrait illustration placeholder for Daniel Nash"
        fill
        sizes="(min-width: 1024px) 320px, 100vw"
        className="object-cover"
      />
    </div>
  );

  return (
    <div className="container grid gap-10 py-10 lg:grid-cols-[2fr,1fr]">
      <section className="space-y-6 rounded-3xl border border-brand-slate/10 bg-white/80 p-10 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal/70">
          Contact
        </p>
        <h1 className="text-4xl font-semibold text-brand-teal">
          Let&apos;s connect
        </h1>
        <p className="text-brand-slate/80">
          Share a few details about the role, team, or project. I reply within
          two business days.
        </p>
        <ContactForm />
      </section>
      <aside className="space-y-6 rounded-3xl border border-brand-slate/10 bg-brand-teal/5 p-8 shadow-soft">
        {ctaPortrait ? (
          <Portrait
            variant="cta-right"
            portrait={ctaPortrait}
            className="w-full rounded-2xl border border-brand-slate/10 shadow-soft"
          />
        ) : (
          placeholder
        )}
        <h2 className="text-lg font-semibold text-brand-teal">
          Common conversations
        </h2>
        <ul className="space-y-3 text-sm text-brand-slate/80">
          <li>
            - Senior Product Manager roles across commerce, AI, and platform
            work
          </li>
          <li>
            - Builder PM conversations around prototypes, workflows, and
            internal tools
          </li>
          <li>
            - Product leadership opportunities focused on governance,
            enablement, and PM practice
          </li>
          <li>- Select workshops, speaking, and music collaborations</li>
        </ul>
        <div className="space-y-1 text-sm text-brand-slate/70">
          <p>Based in Los Angeles (Pacific Time).</p>
          <p>Available for remote or on-site engagements worldwide.</p>
        </div>
      </aside>
    </div>
  );
}
