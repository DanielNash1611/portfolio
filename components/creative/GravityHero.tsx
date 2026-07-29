"use client";

import Image from "next/image";
import { ArrowUpRight, Headphones } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Container from "@/components/site/Container";

const appUrl = "https://gravity.danielnash.co";

export default function GravityHero(): JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 900], [0, 74]);
  const imageScale = useTransform(scrollY, [0, 900], [1.02, 1.075]);

  return (
    <section className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[#02070b] text-[#f4f4ed] md:min-h-[calc(100svh-5rem)]">
      <motion.div
        aria-hidden="true"
        className="absolute -inset-x-3 -inset-y-20"
        style={{
          y: shouldReduceMotion ? 0 : imageY,
          scale: shouldReduceMotion ? 1.02 : imageScale,
        }}
      >
        <Image
          src="/images/gravity/app/gravity-atomic-field.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,11,0.97)_0%,rgba(2,7,11,0.84)_29%,rgba(2,7,11,0.18)_62%,rgba(2,7,11,0.28)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,7,11,0.1)_0%,transparent_40%,rgba(2,7,11,0.86)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_72%_44%,rgba(105,231,210,0.12),transparent_24%),radial-gradient(circle_at_18%_72%,rgba(152,135,255,0.1),transparent_22%)]"
      />

      <Container className="relative flex min-h-[calc(100svh-4.5rem)] items-end py-10 sm:py-12 md:min-h-[calc(100svh-5rem)] md:items-center md:py-20">
        <div className="max-w-[700px] space-y-6 md:space-y-7">
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-[#79e7d4]"
          >
            Interactive spatial composition
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.08, ease: "easeOut" }}
            className="space-y-5"
          >
            <h1 className="text-balance text-[clamp(4.5rem,12vw,9rem)] font-medium leading-[0.78] tracking-[-0.06em] text-[#f4f1e8]">
              Gravity
            </h1>
            <p className="max-w-[580px] text-pretty text-lg leading-8 text-[#f4f4ed]/82 md:text-2xl md:leading-9">
              What if the audience could move inside a piece of music?
            </p>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
            className="flex flex-wrap gap-3"
          >
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#79e7d4] px-6 py-3 text-sm font-semibold text-[#04100f] transition duration-200 hover:-translate-y-0.5 hover:bg-[#a1f4e5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#02070b]"
            >
              Open Gravity
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="#sound"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#f4f4ed]/28 bg-[#02070b]/30 px-6 py-3 text-sm font-semibold text-[#f4f4ed] backdrop-blur-sm transition duration-200 hover:border-[#f4f4ed]/55 hover:bg-[#02070b]/52 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79e7d4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#02070b]"
            >
              <Headphones aria-hidden="true" className="h-4 w-4" />
              Hear the source loops
            </a>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="flex flex-col gap-4 border-t border-[#f4f4ed]/16 pt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f4f4ed]/58 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>Composition / spatial audio / browser-native MVP</span>
            <span>Headphones recommended</span>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
