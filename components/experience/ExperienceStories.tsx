"use client";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { MotionValue } from "framer-motion";
import type { ExperienceHomeContent } from "@/content/experience-home";
import type { ExperienceWorkStory } from "@/content/experience-leadership";
import ProjectArtwork, { hasProjectArtwork } from "./ProjectArtwork";
import ExperienceDisclosure from "./ExperienceDisclosure";
import LeadershipCaseChapter from "./LeadershipCaseChapter";
import PrototypeReveal from "./PrototypeReveal";

function CareerStoryVisual({
  progress,
  quiet,
}: {
  progress: MotionValue<number>;
  quiet: boolean;
}) {
  const runway = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const { scrollYProgress } = useScroll({
    target: runway,
    offset: ["start 20%", "end 85%"],
  });
  useEffect(() => {
    const query = matchMedia("(max-width: 899px) and (min-height: 600px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return (
    <div ref={runway} className="experience-story-runway" data-quiet={quiet}>
      <div className="experience-story-visual">
        <ProjectArtwork
          slug="ai-career-operating-system"
          progress={compact && !quiet ? scrollYProgress : progress}
          quiet={quiet}
        />
      </div>
    </div>
  );
}

function Story({
  image,
  alt,
  children,
  paused,
  recording = false,
  slug,
}: {
  image: string | null;
  alt: string | null;
  children: ReactNode;
  paused: boolean;
  recording?: boolean;
  slug: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (paused || reduced) {
      element.pause();
      return;
    }
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden) void element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      element.pause();
    };
  }, [paused, reduced]);
  return (
    <article ref={ref} className="experience-project-story" data-project={slug}>
      {slug === "ai-career-operating-system" ? (
        <CareerStoryVisual
          progress={scrollYProgress}
          quiet={paused || Boolean(reduced)}
        />
      ) : (
        <motion.div
          className="experience-story-visual"
          style={paused || reduced ? undefined : { y, scale }}
        >
          {slug === "oms-chatgpt-app" ? (
            <PrototypeReveal quiet={paused || Boolean(reduced)}>
              <ProjectArtwork
                slug={slug}
                progress={scrollYProgress}
                quiet={paused || Boolean(reduced)}
              />
            </PrototypeReveal>
          ) : hasProjectArtwork(slug) ? (
            <ProjectArtwork
              slug={slug}
              progress={scrollYProgress}
              quiet={paused || Boolean(reduced)}
            />
          ) : recording && !reduced ? (
            <video
              ref={video}
              muted
              loop
              playsInline
              preload="none"
              poster={image ?? undefined}
              aria-label="Recorded Gravity session"
            >
              <source
                src="/videos/experience/gravity-loop.mp4"
                type="video/mp4"
              />
            </video>
          ) : image ? (
            <Image
              src={image}
              alt={alt ?? ""}
              fill
              sizes="(min-width:900px) 55vw, 100vw"
            />
          ) : null}
        </motion.div>
      )}
      <div className="experience-story-copy">{children}</div>
    </article>
  );
}

export function Products({
  items,
  paused,
}: {
  items: ExperienceHomeContent["products"];
  paused: boolean;
}) {
  return (
    <section
      className="experience-products experience-home-section"
      id="experience-products"
      aria-labelledby="experience-products-heading"
    >
      <p className="experience-home-eyebrow">Hands-on product judgment</p>
      <h2 id="experience-products-heading">
        Lead through
        <br />
        <em>the build.</em>
      </h2>
      <div className="experience-story-list">
        {items.map((item, i) => (
          <Story
            key={item.slug}
            slug={item.slug}
            image={item.image}
            alt={item.alt}
            paused={paused}
          >
            <p className="experience-home-eyebrow">
              0{i + 1} / {item.status}
            </p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <Link href={item.href} className="experience-home-link">
              Explore the product <ArrowUpRight size={17} />
            </Link>
          </Story>
        ))}
      </div>
    </section>
  );
}

function WorkSummary({
  item,
  index,
  paused,
}: {
  item: ExperienceWorkStory;
  index: number;
  paused: boolean;
}) {
  return (
    <article
      className="experience-work-summary"
      data-leadership-case={item.slug}
    >
      <div>
        <p className="experience-home-eyebrow">
          0{index + 1} / {item.eyebrow}
        </p>
        <h3>{item.title}</h3>
      </div>
      <div>
        <p>{item.description}</p>
        {item.metrics.length ? (
          <dl className="experience-story-metrics">
            {item.metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
                {metric.detail ? <p>{metric.detail}</p> : null}
              </div>
            ))}
          </dl>
        ) : null}
        <Link href={item.href} className="experience-home-link">
          {item.action} <ArrowRight size={16} />
        </Link>
        <ExperienceDisclosure
          className="experience-work-reveal"
          title={item.previewLabel}
        >
          {(open) => (
            <Story
              slug={item.slug}
              image={item.image}
              alt={item.alt}
              paused={paused || !open}
            >
              <Link href={item.href} className="experience-home-link">
                {item.action} <ArrowUpRight size={16} />
              </Link>
            </Story>
          )}
        </ExperienceDisclosure>
      </div>
    </article>
  );
}

export function WorkTheater({
  items,
  supportingItems,
  paused,
  reading,
}: {
  items: ExperienceHomeContent["work"];
  supportingItems: ExperienceHomeContent["supportingWork"];
  paused: boolean;
  reading: boolean;
}) {
  return (
    <>
      <LeadershipCaseChapter items={items} reading={reading} paused={paused} />
      <div className="experience-more-work">
        <ExperienceDisclosure
          className="experience-supporting-work"
          title="More platform and delivery work"
          description="Explore the AI platform and checkout previews."
        >
          {(open) => (
            <div className="experience-supporting-work-list">
              {supportingItems.map((item, i) => (
                <WorkSummary
                  key={item.slug}
                  item={item}
                  index={i}
                  paused={paused || !open}
                />
              ))}
            </div>
          )}
        </ExperienceDisclosure>
      </div>
    </>
  );
}

export function CreativeWorlds({
  items,
  paused,
  onGravity,
}: {
  items: ExperienceHomeContent["creative"];
  paused: boolean;
  onGravity(): void;
}) {
  return (
    <section
      className="experience-creative experience-home-section"
      id="experience-creative"
      aria-labelledby="experience-creative-heading"
    >
      <p className="experience-home-eyebrow">Creative exploration</p>
      <h2 id="experience-creative-heading">
        Enter another
        <br />
        <em>state of mind.</em>
      </h2>
      <p className="experience-home-intro">
        Original music and interactive systems, built to be experienced.
      </p>
      <div className="experience-story-list">
        {items.map((item, i) => (
          <Story
            key={item.slug}
            slug={item.slug}
            image={item.image}
            alt={item.alt}
            paused={paused}
            recording={item.slug === "gravity-astra"}
          >
            <p className="experience-home-eyebrow">
              0{i + 1} / {item.eyebrow}
            </p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <Link href={item.href} className="experience-home-link">
              Explore the project <ArrowUpRight size={16} />
            </Link>
            {item.slug === "gravity-astra" ? (
              <button className="experience-home-link" onClick={onGravity}>
                <Play size={15} /> Enter the full Gravity experience
              </button>
            ) : null}
          </Story>
        ))}
      </div>
      <Link className="experience-home-link" href="/creative">
        View all creative work <ArrowRight size={16} />
      </Link>
    </section>
  );
}
