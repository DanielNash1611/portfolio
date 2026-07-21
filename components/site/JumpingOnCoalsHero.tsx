"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight, Headphones } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Container from "@/components/site/Container";

const gameUrl = "https://jumpingoncoals.danielnash.co/";

export default function JumpingOnCoalsHero(): JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 900], [0, 86]);

  return (
    <section className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[#1a0e0c] text-[#fff3d7] md:min-h-[calc(100svh-5rem)]">
      <motion.div
        aria-hidden="true"
        className="absolute -inset-x-3 -inset-y-24"
        style={{ y: shouldReduceMotion ? 0 : backgroundY }}
      >
        <Image
          src="/images/jumping-on-coals/playground-sunset.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_center]"
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,8,8,0.92)_0%,rgba(25,12,10,0.68)_38%,rgba(25,12,10,0.16)_72%,rgba(17,8,8,0.3)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,8,8,0.16)_0%,transparent_36%,rgba(17,8,8,0.78)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-55 [background-image:radial-gradient(circle_at_18%_82%,rgba(255,128,60,0.24),transparent_20%),radial-gradient(circle_at_72%_16%,rgba(255,199,120,0.12),transparent_24%)]"
      />

      <Container className="relative flex min-h-[calc(100svh-4.5rem)] items-end py-10 sm:py-12 md:min-h-[calc(100svh-5rem)] md:items-center md:py-20">
        <div className="max-w-[760px] space-y-6 md:space-y-7">
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ffc078]"
          >
            Interactive album / browser game
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.08, ease: "easeOut" }}
            className="space-y-4"
          >
            <h1 className="text-balance text-[clamp(3.75rem,10vw,7.5rem)] font-semibold leading-[0.82] tracking-[-0.055em] text-[#fff3d7]">
              Jumping{" "}
              <span className="mt-2 block text-[#ffad61]">on Coals</span>
            </h1>
            <p className="max-w-[610px] text-pretty text-base leading-7 text-[#fff3d7]/82 sm:text-lg md:text-xl md:leading-8">
              An original album about ambition, burnout, recovery, and the loops
              we choose to re-enter—made playable across eight tactile chapters.
            </p>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
            className="flex flex-wrap gap-3"
          >
            <a
              href={gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#fff3d7] px-6 py-3 text-sm font-semibold text-[#24110e] transition duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#24110e]"
            >
              Play the game
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="#full-story"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#fff3d7]/35 bg-[#1b0d0b]/28 px-6 py-3 text-sm font-semibold text-[#fff3d7] backdrop-blur-sm transition duration-200 hover:border-[#fff3d7]/60 hover:bg-[#1b0d0b]/48 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffad61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#24110e]"
            >
              <Headphones aria-hidden="true" className="h-4 w-4" />
              Hear the full story
            </a>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="flex flex-col gap-4 border-t border-[#fff3d7]/18 pt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fff3d7]/64 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>37–42 min / headphones recommended / keyboard or touch</span>
            <a
              href="#overview"
              className="inline-flex items-center gap-2 text-[#fff3d7]/80 transition hover:text-[#ffbd79]"
            >
              Explore the story
              <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
