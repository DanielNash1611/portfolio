import Image from "next/image";
import Hero from "@/components/Hero";

const heroPortrait = {
  src: "/portraits/hero_square_photo.jpg",
  width: 4024,
  height: 4025,
  alt: "Portrait of Daniel Nash smiling confidently against a warm, muted background."
};

const HomeHero = (): JSX.Element => {
  return (
    <section className="container pt-6 pb-4">
      <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <Hero
          title="Bridging Creativity & Strategy — Senior AI Product Manager & Composer"
          subtitle="I design AI-powered products and high-performing user journeys that convert."
          primaryCta={{
            href: "/work",
            label: "Explore Product Work"
          }}
          secondaryCta={{
            href: "/music",
            label: "Listen to My Music",
            variant: "ghost"
          }}
        />
        <div className="relative isolate aspect-square overflow-hidden rounded-3xl border border-[#3A3D40]/15 bg-[#F2E3D5] shadow-md ring-1 ring-slate-200">
          <Image
            src={heroPortrait.src}
            alt={heroPortrait.alt}
            width={heroPortrait.width}
            height={heroPortrait.height}
            loading="lazy"
            sizes="(min-width: 1024px) 28rem, 60vw"
            className="h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#D17A5F]/20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-start bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent p-4"
          >
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-[#F2E3D5]">
              Composer • Product Leader • AI Advocate
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
