"use client";
import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import CaseStudyArtwork from "./CaseStudyArtwork";
import CheckoutArtwork from "./CheckoutArtwork";
import PhoneArtwork from "./PhoneArtwork";
import ScoutArtwork from "./ScoutArtwork";
import LeadershipArtwork from "./LeadershipArtwork";
const refreshed = new Set([
  "product-practice",
  "cresta-coaching",
  "checkout-redesign",
  "chatgpt-enterprise",
  "ai-platform-mcp",
  "oms-chatgpt-app",
  "ai-career-operating-system",
  "immunology-scout",
  "tabletop-symphony",
]);
export const hasProjectArtwork = (slug: string) => refreshed.has(slug);
export default function ProjectArtwork({
  slug,
  progress,
  quiet,
}: {
  slug: string;
  progress: MotionValue<number>;
  quiet: boolean;
}) {
  const lift = useTransform(progress, [0, 1], [22, -18]);
  if (slug === "product-practice" || slug === "cresta-coaching")
    return <LeadershipArtwork slug={slug} />;
  if (slug === "checkout-redesign") return <CheckoutArtwork />;
  if (slug === "tabletop-symphony") return <PhoneArtwork />;
  if (slug === "immunology-scout")
    return <ScoutArtwork progress={progress} quiet={quiet} />;
  if (
    [
      "chatgpt-enterprise",
      "ai-platform-mcp",
      "ai-career-operating-system",
    ].includes(slug)
  )
    return <CaseStudyArtwork slug={slug} progress={progress} quiet={quiet} />;
  return (
    <figure className="experience-artwork experience-artwork-interface experience-artwork-oms">
      <p className="experience-artwork-kicker">
        OMS ChatGPT App / Working prototype
      </p>
      <motion.div
        className="experience-artwork-interface-frame"
        style={quiet ? undefined : { y: lift }}
      >
        <Image
          src="/images/oms-chatgpt-app/web-prototype.png"
          alt="Original OMS web prototype interface."
          fill
          sizes="(min-width:900px) 48vw, 90vw"
        />
      </motion.div>
      <figcaption>
        A real workflow, with the decision in the user’s hands.
      </figcaption>
    </figure>
  );
}
