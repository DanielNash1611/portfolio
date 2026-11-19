"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState, type ReactNode } from "react";
import { usePortfolioAssistant } from "@/components/portfolio/PortfolioAssistantProvider";
import { findRelevantWork } from "@/lib/portfolio-agent/capabilities";
import type { ExperienceHomeContent } from "@/content/experience-home";
import { contactCenterRoadmapHref } from "@/content/projects/contact-center-roadmap";
import { Products, WorkTheater, CreativeWorlds } from "./ExperienceStories";
import Recommendations from "./Recommendations";
import SystemsTransformation from "./SystemsTransformation";
import AssistantInvitation from "./AssistantInvitation";
import ClarityChapter from "./ClarityChapter";
import ExperienceDisclosure from "./ExperienceDisclosure";
import ProductProofChapter from "./ProductProofChapter";
import "./experience-home.css";
import "./scroll-stories.css";
import "./referral-ring.css";
import "./editorial-refresh.css";
import "./pacing.css";

function Enter({
  children,
  className = "",
  direction = 1,
}: {
  children: ReactNode;
  className?: string;
  direction?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 65, rotate: direction * 1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function RoleCompass() {
  const assistant = usePortfolioAssistant();
  const [lens, setLens] = useState("AI product leadership");
  const results = assistant
    ? findRelevantWork(assistant.catalog, lens).slice(0, 3)
    : [];
  return (
    <section
      className="experience-compass experience-home-section"
      id="experience-compass"
      aria-labelledby="experience-compass-heading"
    >
      <Enter>
        <p className="experience-home-eyebrow">A portfolio that listens</p>
        <h2 id="experience-compass-heading">
          Find your
          <br />
          <em>way in.</em>
        </h2>
        <p className="experience-home-intro">
          Choose a role or interest to surface the work worth examining first.
        </p>
      </Enter>
      <div className="experience-compass-layout">
        <div
          role="group"
          aria-label="Choose a portfolio lens"
          className="experience-lenses"
        >
          {[
            "AI product leadership",
            "Hands-on building",
            "Creative technology",
          ].map((label) => (
            <button
              key={label}
              aria-pressed={lens === label}
              onClick={() => setLens(label)}
            >
              {label}
              <ArrowRight size={17} />
            </button>
          ))}
        </div>
        <div className="experience-compass-results" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={lens}
              initial={{ opacity: 0, x: 45 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              {results.map((result, i) => (
                <Link key={result.slug} href={result.href}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{result.title}</h3>
                    <p>
                      {
                        assistant?.catalog.find(
                          (page) => page.slug === result.slug,
                        )?.oneLiner
                      }
                    </p>
                  </div>
                  <ArrowUpRight size={20} />
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <AssistantInvitation />
    </section>
  );
}

export default function ExperienceHome({
  content,
  paused,
  reading,
  onGravity,
  direction,
  workflow,
  gravity,
  presentation,
}: {
  content: ExperienceHomeContent;
  paused: boolean;
  reading: boolean;
  onGravity(): void;
  direction: (open: boolean) => ReactNode;
  workflow: (open: boolean) => ReactNode;
  gravity: (open: boolean) => ReactNode;
  presentation: "home" | "preview";
}) {
  const isHome = presentation === "home";
  return (
    <div className="experience-home" data-paused={paused}>
      {isHome ? (
        <ProductProofChapter
          items={content.products}
          paused={paused}
          reading={reading}
        />
      ) : (
        <Products items={content.products} paused={paused || reading} />
      )}
      {!isHome ? (
        <ExperienceDisclosure
          className="experience-depth-green"
          title="Inside the AI review decisions"
          description="Follow the evidence, human checks, and approval path."
        >
          {workflow}
        </ExperienceDisclosure>
      ) : null}
      <WorkTheater
        items={content.work}
        supportingItems={content.supportingWork}
        paused={paused}
        reading={reading}
      />
      {isHome ? (
        <div id="experience-impact" className="experience-roadmap-entry">
          <Link id="experience-systems" href={`${contactCenterRoadmapHref}#roadmap-exhibit`}>
            Explore the Contact Center roadmap exhibit <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <ExperienceDisclosure
          title="Inside the roadmap transformation"
          description="Explore the sequence from fragmented tools to a one-year review."
        >
          {(open) => (
            <section
              id="experience-impact"
              className="experience-impact experience-home-section"
              aria-label="Roadmap transformation"
            >
              <SystemsTransformation reading={reading || !open} />
            </section>
          )}
        </ExperienceDisclosure>
      )}
      <ClarityChapter
        items={content.toolkit}
        values={content.positioning.categories}
        reading={reading}
        paused={paused}
      />
      <div id="experience-voices">
        <Recommendations
          groups={content.recommendations}
          paused={paused}
          reading={reading}
        />
      </div>
      <section
        className="experience-contact experience-home-section"
        id="experience-contact"
        aria-labelledby="experience-contact-heading"
      >
        <Enter>
          <p className="experience-home-eyebrow">Let’s talk</p>
          <h2 id="experience-contact-heading">
            What are you
            <br />
            <em>building next?</em>
          </h2>
          <p>
            Building an AI product or strengthening a product practice? I’d
            welcome the conversation.
          </p>
          <div>
            <Link href="/contact">
              Contact Daniel <ArrowUpRight size={20} />
            </Link>
            <Link href="/resume">
              View resume <ArrowRight size={20} />
            </Link>
            <Link href="/resume/generate">
              Generate a tailored resume <ArrowRight size={20} />
            </Link>
          </div>
          <a
            className="experience-creative-continue"
            href="#experience-creative"
          >
            Keep exploring the creative work <ArrowRight size={16} />
          </a>
        </Enter>
      </section>
      <CreativeWorlds
        items={content.creative}
        paused={paused}
        onGravity={onGravity}
      />
      <div className="experience-extra-depth">
        <p className="experience-home-eyebrow">Go deeper</p>
        <ExperienceDisclosure
          title="Enter the Gravity walkthrough"
          description="A scroll-led musical world, with playable perspectives."
        >
          {gravity}
        </ExperienceDisclosure>
        <ExperienceDisclosure
          title="How I work through ambiguity"
          description="Explore the decision framework and short process film."
        >
          {direction}
        </ExperienceDisclosure>
        <ExperienceDisclosure
          title="Ideas behind the work"
          description="Essays on AI, judgment, and human capability."
        >
          {() => (
            <section
              className="experience-thinking experience-home-section"
              id="experience-thinking"
              aria-labelledby="experience-thinking-heading"
            >
              <h2 id="experience-thinking-heading">
                AI should expand
                <br />
                <em>human capability.</em>
              </h2>
              <div className="experience-open-thinking">
                {content.thinking.map((entry) => (
                  <article key={entry.slug}>
                    <p className="experience-home-eyebrow">{entry.readTime}</p>
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                    <Link href={entry.href} className="experience-home-link">
                      Read the essay <ArrowRight size={16} />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </ExperienceDisclosure>
        <ExperienceDisclosure
          title="Explore for a particular role"
          description="Choose a lens or ask the portfolio guide a question."
        >
          {() => <RoleCompass />}
        </ExperienceDisclosure>
      </div>
    </div>
  );
}
