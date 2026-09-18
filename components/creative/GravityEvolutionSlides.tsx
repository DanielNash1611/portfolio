"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import Container from "@/components/site/Container";

const slides = [
  {
    id: "orbits",
    number: "01",
    title: "From a field to spatial behavior.",
    description:
      "The first build made performer motion legible from the audience. Blender-built instruments and stronger animation now travel through paths that the renderer and spatial mix both understand in three dimensions.",
    before: {
      src: "/images/gravity/app/gravity-atomic-field.png",
      alt: "The original Gravity Atomic field with performers arranged around the cello on a largely shared visual plane.",
      label: "Original build",
      caption: "One legible field",
    },
    after: {
      src: "/images/gravity/astra/atomic-orbits.webp",
      alt: "The Astra Gravity build with sculptural performers following individual three-dimensional orbital planes around the cello.",
      label: "Astra + Blender",
      caption: "Individual spatial orbits",
    },
  },
  {
    id: "worlds",
    number: "02",
    title: "From a flat backdrop to a world with depth.",
    description:
      "Once the instruments gained convincing volume, the static background exposed the illusion. Celestial became a navigable 3D environment with galaxies staged at different distances.",
    before: {
      src: "/images/gravity/app/gravity-celestial-field.png",
      alt: "The original Gravity Celestial field with a luminous cello and geometric performers against a dark background.",
      label: "Original build",
      caption: "A static celestial field",
    },
    after: {
      src: "/images/gravity/astra/celestial-orbits.webp",
      alt: "The Astra Gravity Celestial world with sculptural instruments orbiting in depth against a complete galaxy environment.",
      label: "Astra + Blender",
      caption: "Galaxies at varied depth",
    },
  },
  {
    id: "perspective",
    number: "03",
    title: "From a symbol to a textured instrument.",
    description:
      "The original cello perspective proved the listening idea. Blender gave the central instrument volume and surface texture, while the new world lets the visitor move around it and hear the mix change with them.",
    before: {
      src: "/images/gravity/app/gravity-cello-perspective.png",
      alt: "The original Gravity cello perspective looking toward the cello scroll across a mostly planar field.",
      label: "Original build",
      caption: "A fixed listening preset",
    },
    after: {
      src: "/images/gravity/astra/cello-perspective.webp",
      alt: "The Astra Gravity build viewed close beside the dimensional spectral cello with performers suspended around it.",
      label: "Astra + Blender",
      caption: "A textured, inhabitable cello",
    },
  },
] as const;

export default function GravityEvolutionSlides(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <div className="border-b border-white/10 bg-[#050b0c]">
      <Container className="py-20 md:py-28 lg:py-32">
        <div className="grid gap-9 lg:grid-cols-[0.7fr_1.3fr] lg:items-end lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7fe0d3]">
              Before / after
            </p>
            <h2 className="mt-5 max-w-[9ch] text-balance font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-7xl">
              The change is easier to see.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-white/56 md:text-lg">
            The original MVP established the musical system. These paired
            runtime captures show where the Astra-and-Blender build added depth,
            material presence, and a stronger sense of place.
          </p>
        </div>

        <div
          className="mt-14 md:mt-20"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              showPrevious();
            }
            if (event.key === "ArrowRight") {
              showNext();
            }
          }}
        >
          <div className="relative aspect-[5/6] overflow-hidden border-y border-white/14 bg-black md:aspect-[10/3]">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                aria-hidden={index !== activeIndex}
                className={`absolute inset-0 grid transition duration-500 ease-out md:grid-cols-2 ${
                  index === activeIndex
                    ? "z-10 opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                {[slide.before, slide.after].map((state, stateIndex) => (
                  <figure
                    key={state.label}
                    className={`relative overflow-hidden ${
                      stateIndex === 0
                        ? "border-b border-white/20 md:border-b-0 md:border-r"
                        : ""
                    }`}
                  >
                    <Image
                      src={state.src}
                      alt={state.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/88 to-transparent"
                      aria-hidden="true"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5 md:p-6">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/62">
                          {state.label}
                        </p>
                        <p className="mt-1 font-serif text-xl leading-tight text-white sm:text-2xl">
                          {state.caption}
                        </p>
                      </div>
                      <span className="hidden rounded-full border border-white/24 bg-black/28 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/72 backdrop-blur sm:inline-flex">
                        {stateIndex === 0 ? "Before" : "After"}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>

          <div className="grid gap-8 border-b border-white/14 py-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12">
            <div aria-live="polite">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#7fe0d3]">
                Slide {activeSlide.number} / 03
              </p>
              <h3 className="mt-3 max-w-[22ch] font-serif text-3xl leading-[1.02] tracking-[-0.035em] md:text-4xl">
                {activeSlide.title}
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/50 md:text-base">
                {activeSlide.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-5 md:justify-end">
              <div className="flex items-center gap-2" aria-label="Choose comparison slide">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show slide ${slide.number}: ${slide.title}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-[#7fe0d3] ${
                      index === activeIndex
                        ? "w-10 bg-[#7fe0d3]"
                        : "w-5 bg-white/22 hover:bg-white/42"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Show previous comparison"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 text-white/72 transition hover:border-white/48 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Show next comparison"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 text-white/72 transition hover:border-white/48 hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
