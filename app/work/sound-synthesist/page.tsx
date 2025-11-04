import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import CaseStudyHeader from "@/components/CaseStudyHeader";
import { cases } from "@/data/cases";
import { getCaseMdx } from "@/lib/mdx";
import { SoundSynthesistWidget } from "@/components/sound-synthesist/SoundSynthesistWidget";

const slug = "sound-synthesist";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getCaseMdx(slug);
  return {
    title: frontmatter.title,
    description:
      frontmatter.summary ||
      "An AI assistant that helps musicians quickly discover the gear, signal chains, and production techniques behind the sounds they love."
  };
}

export default async function SoundSynthesistPage(): Promise<JSX.Element> {
  const { frontmatter } = await getCaseMdx(slug);
  const caseData = cases.find((item) => item.slug === slug);

  const heroChips = ["Product Leadership", "AI Strategy", "Rapid Prototyping", "Music Tech"];
  const heroMetrics = [
    {
      title: "Prototype Velocity",
      value: "4 hours",
      description: "From maybe too crazy idea to the first working hackathon demo.",
      tone: "light",
    },
    {
      title: "Portfolio Rebuild",
      value: "1 hour",
      description: "PM-led text-based web demo built via Codex + ChatGPT  no dedicated dev time.",
      tone: "light",
    },
    {
      title: "Would Use Again",
      value: "87%",
      description: "Musicians in usability testing who said they would use Sound Synthesist again.",
      tone: "dark",
    },
  ];
  const outcomeCards = [
    {
      title: "Hackathon Outcome",
      value: "1st place — Guitar Center ChatGPT Hackathon",
      description: "Judged by the C-suite, positioning Sound Synthesist as a flagship AI concept.",
    },
    {
      title: "Organizational Impact",
      value: "Inspired Rig Advisor",
      description: "Sparked the internal Rig Advisor project, later announced publicly by Guitar Centers CEO.",
    },
    {
      title: "AI Leadership",
      value: "ChatGPT Champions",
      description: "Helped establish the ChatGPT Champions group and positioned Daniel as a key AI adoption lead.",
    },
  ];
  const approachSteps = [
    'Ranked hackathon ideas by feasibility vs. impact; Sound Synthesist landed in the "low feasibility / high impact" quadrant and was initially deprioritized.',
    "After shipping two safer ideas, Daniel tested the concept in GPT-4.1 and found it already suggested believable gear chains.",
    "Using Codex + ChatGPT, he built a one-hour text demo in a Next.js portfolio app with guided follow-ups (live vs. studio, pickups, DAW vs. amp, budget).",
  ];
  const howItWorks = [
    {
      title: "1 · Prompt Input",
      body: 'Musicians describe a tone, song, artist, or vibe — for example, "How do I sound like Olafur Arnalds?"',
    },
    {
      title: "2 · AI Recommendation",
      body: "Sound Synthesist suggests amps, pedals, mics, plugins, and starter settings.",
    },
    {
      title: "3 · Smart Follow-ups",
      body: "Clarifying questions about context, rig, and budget refine the rig to each player.",
    },
    {
      title: "4 · Education Layer",
      body: "Each answer explains why the choices work so players learn sound design, not just settings.",
    },
  ];
  const technology = [
    "Models: GPT-4.1 and GPT-5 with grounded web search for up-to-date gear info.",
    "Frontend: Next.js, TypeScript, Tailwind, deployed on Vercel.",
    "Build style: PM-led build using Codex + ChatGPT; text-only experience focused on guidance quality rather than audio rendering.",
  ];
  const learnings = [
    'Big ideas are not always hard: "Low feasibility / high impact" labels disappear once you prototype with AI.',
    "PMs can ship real demos: AI pair-programming lets Product Managers build and test concepts before engineering commits.",
    "Explainability wins trust: musicians prefer transparent, explainable help over opaque magic answers.",
  ];
  const strengths = [
    {
      title: "Guided gear discovery",
      body: "Moves musicians from vague tonal goals to concrete rigs.",
    },
    {
      title: "Built-in teaching",
      body: 'Every recommendation includes a quick "why this works" explanation.',
    },
    {
      title: "AI-accelerated prototyping",
      body: "Shows how AI tools let a PM deliver polished prototypes quickly.",
    },
  ];
  const opportunities = [
    {
      title: "Personalization",
      body: "Use each player's rig, genre, and budget to tailor rigs.",
    },
    {
      title: "Workflow integration",
      body: "Bring the assistant into DAWs or plugins so it lives where people create.",
    },
    {
      title: "Commerce links",
      body: 'Connect rigs to "buy this gear" and "find an alternative" options.',
    },
  ];
  const sources = [
    "Public gear specs, manufacturer documentation, and reputable online sources.",
    "Feedback from working musicians to sanity-check tone suggestions.",
    "No proprietary Guitar Center data — only public information and OpenAI models.",
  ];
  const whatsNext = [
    "Harden the public demo with guardrails, rate limiting, and curated prompts.",
    "Add presets and good / better / best rigs at different price points.",
    "Explore DAW or plugin-style integrations and share the best prompt patterns.",
  ];

  return (
    <div className="container space-y-10 py-10">
      <Link href="/work">
        <Button variant="ghost" className="mb-4">
          Back to portfolio
        </Button>
      </Link>
      <div className="rounded-3xl border border-brand-slate/10 bg-gradient-to-br from-brand-cream/80 to-brand-tan/60 p-10 shadow-soft">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold text-brand-teal md:text-5xl">
            {frontmatter.title}
          </h1>
          <p className="text-lg text-brand-slate/80">
            An AI assistant that helps musicians jump from &ldquo;I love that sound&rdquo; to a concrete rig: gear, signal chain, and starter settings.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#sound-synthesist-demo" className="inline-flex items-center rounded-full bg-brand-teal px-6 py-2.5 text-sm font-semibold text-brand-cream shadow-sm">
              Open Demo
            </a>
            <p className="text-sm text-brand-slate/70">
              Working text-based demo embedded below. Rebuilt independently using public data and OpenAI APIs; no proprietary assets.
            </p>
          </div>
        </div>
      </div>
      <CaseStudyHeader
        title="Project Summary"
        subtitle={
          frontmatter.summary ||
          'An AI assistant that helps musicians jump from "I love that sound" to a concrete rig: gear, signal chain, and starter settings.'
        }
        kpis={caseData?.kpis}
      />
      <article className="space-y-10 rounded-3xl border border-brand-slate/10 bg-white/90 p-6 shadow-soft md:p-10">
        <section className="rounded-3xl bg-gradient-to-br from-[#DBBF96] via-[#F2E3D5] to-[#D17A5F] p-6 text-[#2C4F52] shadow-lg md:p-10">
          <div className="grid items-center gap-8 md:grid-cols-[2fr,1.5fr]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">Case Study</p>
              <h2 className="text-3xl font-semibold md:text-4xl">Sound Synthesist  AI Gear Recommender for Musicians</h2>
              <p className="text-sm text-[#3A3D40] md:text-base">
                An AI assistant that helps musicians jump from &ldquo;I love that sound&rdquo; to a concrete rig: gear, signal chain, and starter settings. Born
                in Guitar Center&rsquo;s first ChatGPT Hackathon, later rebuilt as an independent demo using public data and OpenAI APIs.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {heroChips.map((chip) => (
                  <span key={chip} className="inline-flex items-center rounded-full bg-[#2C4F52] px-3 py-1 text-xs font-semibold text-[#F2E3D5]">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-4 text-sm md:text-base">
              {heroMetrics.map((metric) => (
                <div
                  key={metric.title}
                  className={`rounded-2xl p-4 shadow-sm ${
                    metric.tone === "dark" ? "bg-[#2C4F52] text-[#F2E3D5]" : "bg-white/80 text-[#2C4F52]"
                  }`}
                >
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{metric.title}</p>
                  <p className="mt-1 text-lg font-semibold">{metric.value}</p>
                  <p className="mt-1 text-xs text-slate-700">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/40 pt-4 text-xs text-[#3A3D40] md:text-sm">
            <a href="#sound-synthesist-demo" className="rounded-full bg-[#2C4F52] px-4 py-2 font-semibold text-[#F2E3D5] shadow-sm">
              Open Demo
            </a>
            <p>Working text-based demo embedded below. Rebuilt independently using public data and OpenAI APIs; no proprietary assets.</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {outcomeCards.map((card) => (
            <div key={card.title} className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.title}</h3>
              <p className="mt-2 text-sm font-semibold text-[#2C4F52]">{card.value}</p>
              <p className="mt-1 text-xs text-slate-700">{card.description}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-base font-semibold text-[#2C4F52]">The Challenge</h3>
            <p className="text-sm text-slate-800">
              Musicians burn hours chasing tones across videos and forum threads. We wanted a faster path from &ldquo;I love that sound&rdquo; to
              &ldquo;here is how to set up my rig&rdquo; — without handing creativity to a black box.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-semibold text-[#2C4F52]">Approach</h3>
            <ol className="list-inside list-decimal space-y-2 text-sm text-slate-800">
              {approachSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="rounded-3xl bg-[#F2E3D5] p-6 md:p-8">
          <h3 className="mb-4 text-base font-semibold text-[#2C4F52] md:text-lg">How Sound Synthesist Works</h3>
          <div className="grid gap-4 text-sm text-slate-800 md:grid-cols-4">
            {howItWorks.map((item) => (
              <div key={item.title} className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.title}</p>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-base font-semibold text-[#2C4F52]">Technology</h3>
            <ul className="space-y-2 text-sm text-slate-800">
              {technology.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-base font-semibold text-[#2C4F52]">Learnings</h3>
            <ul className="space-y-2 text-sm text-slate-800">
              {learnings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-10 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-[#2C4F52]">Strengths</h3>
            <ul className="space-y-2 text-sm text-slate-800">
              {strengths.map((item) => (
                <li key={item.title}>
                  <span className="font-semibold">{item.title}:</span> {item.body}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-[#2C4F52]">Opportunities</h3>
            <ul className="space-y-2 text-sm text-slate-800">
              {opportunities.map((item) => (
                <li key={item.title}>
                  <span className="font-semibold">{item.title}:</span> {item.body}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-base font-semibold text-[#2C4F52]">Whats Next</h3>
          <ul className="space-y-2 text-sm text-slate-800">
            {whatsNext.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-base font-semibold text-[#2C4F52]">Sources</h3>
          <ul className="space-y-2 text-sm text-slate-800">
            {sources.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-base font-semibold text-[#2C4F52]">Summary</h3>
          <p className="text-sm text-slate-800">
            Sound Synthesist went from a deprioritized hackathon idea to a 1st-place prototype that helped shift Guitar Center&rsquo;s AI strategy. The
            independent demo on this page shows how curiosity plus AI tools let a Product Manager ship meaningful, musician-facing prototypes fast.
          </p>
        </section>
      </article>

      <section id="sound-synthesist-demo" className="rounded-3xl bg-[#2C4F52] p-6 text-[#F2E3D5] shadow-soft md:p-8">
        <h2 className="text-base font-semibold md:text-lg">Try the Sound Synthesist prototype</h2>
        <p className="mt-2 text-sm text-[#F2E3D5]/80">
          This interactive demo taps GPT-5 with grounded web search to recommend gear chains, plugin setups, and production tweaks tailored to the tone
          you describe. Try one of the prompts below or type your own.
        </p>
        <div className="mt-6">
          <SoundSynthesistWidget />
        </div>
      </section>
      <p className="rounded-full bg-[#F2E3D5] px-4 py-2 text-center text-[0.7rem] text-[#3A3D40]">
        Originally prototyped during my time at Guitar Center; this independent demo is rebuilt from scratch using public data and OpenAI APIs. No
        proprietary assets.
      </p>
    </div>
  );
}



