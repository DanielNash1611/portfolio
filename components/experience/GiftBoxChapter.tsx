"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  CornerDownLeft,
  RotateCcw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ExperienceHomeContent } from "@/content/experience-home";
import "./gift-box.css";

type Toolkit = ExperienceHomeContent["toolkit"];
type Packet = Toolkit[number];
type Phase =
  | "closed"
  | "opening"
  | "presenting"
  | "ready"
  | "pulling"
  | "expanded"
  | "returning"
  | "settling"
  | "closing"
  | "sealing";

const lidPoses = {
  closed: { y: 0, z: 0, rotateX: 0, rotateZ: 0 },
  open: {
    y: [0, -145, 15],
    z: [0, 0, -240],
    rotateX: [0, -50, -115],
    rotateZ: [0, -4, -4],
  },
};

const packetPoses = {
  stowed: (i: number) => ({
    y: 0,
    x: 0,
    z: (i - 1) * 20,
    rotateZ: 0,
    opacity: 1,
  }),
  presented: (i: number) => ({
    y: i === 1 ? -225 : -195,
    x: (i - 1) * 190,
    z: (i - 1) * 20,
    rotateZ: (i - 1) * 7,
    opacity: 1,
  }),
  pulled: (i: number) => ({
    y: -300,
    x: (i - 1) * 190,
    z: 180,
    rotateZ: (i - 1) * 7,
    opacity: 1,
  }),
};

function PacketFace({ item, index }: { item: Packet; index: number }) {
  return (
    <div className="gift-packet-face">
      <span className="gift-packet-number">0{index + 1}</span>
      <strong>{item.label}</strong>
      <span className="gift-packet-affordance">
        Open the packet <ArrowUpRight size={18} aria-hidden="true" />
      </span>
    </div>
  );
}

function PacketDetails({ item }: { item: Packet }) {
  return (
    <div className="gift-packet-details">
      <p className="gift-packet-capability">{item.capability}</p>
      <h3 id={`gift-detail-${item.id}`}>{item.heading}</h3>
      <p className="gift-packet-description">{item.description}</p>
      <figure
        className={
          item.artifact.kind === "outline" ? "gift-practice-figure" : undefined
        }
      >
        {item.artifact.kind === "image" ? (
          <div className="gift-packet-image">
            <Image
              src={item.artifact.image}
              alt={item.artifact.alt}
              fill
              sizes="(min-width: 900px) 60vw, 90vw"
            />
          </div>
        ) : (
          <div
            className="gift-practice-sheet"
            role="group"
            aria-label={item.artifact.label}
          >
            <p>{item.artifact.label}</p>
            <dl>
              {item.artifact.topics.map((topic) => (
                <div key={topic.title}>
                  <dt>{topic.title}</dt>
                  <dd>{topic.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <figcaption>{item.caption}</figcaption>
      </figure>
      <Link href={item.href} className="gift-packet-link">
        {item.action}
        <ArrowUpRight size={17} aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function GiftBoxChapter({
  items,
  values,
  reading,
  paused,
}: {
  items: Toolkit;
  values: ExperienceHomeContent["positioning"]["categories"];
  reading: boolean;
  paused: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [selected, setSelected] = useState(0);
  const section = useRef<HTMLElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const packets = useRef<(HTMLButtonElement | null)[]>([]);
  const paper = useRef<HTMLElement>(null);
  const busy = useRef(false);
  const duration = paused ? 0 : 0.65;
  const lidOpen = phase !== "closed" && phase !== "sealing";
  const presented = [
    "presenting",
    "ready",
    "pulling",
    "expanded",
    "returning",
    "settling",
  ].includes(phase);
  const pulled = ["pulling", "expanded", "returning"].includes(phase);
  const detailOpen = phase === "expanded";
  const interactive = phase === "ready";

  const align = () => {
    const node = section.current;
    if (!node) return;
    const offset = parseFloat(getComputedStyle(node).scrollMarginTop) || 113;
    window.scrollTo({
      top: node.getBoundingClientRect().top + window.scrollY - offset,
      behavior: "instant",
    });
  };
  const unpack = () => {
    if (phase !== "closed") return;
    align();
    busy.current = true;
    setPhase("opening");
  };
  const select = (index: number) => {
    if (!interactive || busy.current) return;
    align();
    busy.current = true;
    setSelected(index);
    setPhase("pulling");
  };
  const returnPacket = () => {
    if (phase !== "expanded") return;
    busy.current = true;
    setPhase("returning");
  };
  const close = () => {
    if (!interactive || busy.current) return;
    busy.current = true;
    setPhase("closing");
  };

  useEffect(() => {
    if (phase === "ready") {
      busy.current = false;
      packets.current[selected]?.focus({ preventScroll: true });
    } else if (phase === "expanded") {
      paper.current?.focus({ preventScroll: true });
    } else if (phase === "closed") {
      if (busy.current) opener.current?.focus({ preventScroll: true });
      busy.current = false;
    }
  }, [phase, selected]);
  useEffect(() => {
    if (!reading) return;
    busy.current = false;
    setPhase("closed");
  }, [reading]);

  return (
    <section
      ref={section}
      id="experience-toolkit"
      className="experience-toolkit experience-home-section"
      aria-labelledby="experience-toolkit-heading"
      data-reading={reading}
      data-phase={phase}
      data-paused={paused}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        if (detailOpen) returnPacket();
        else if (interactive) close();
      }}
    >
      <span
        id="experience-principles"
        className="gift-legacy-anchor"
        aria-hidden="true"
      />
      <header className="gift-intro">
        <div>
          <p className="experience-home-eyebrow">The leadership toolkit</p>
          <h2 id="experience-toolkit-heading">
            Build the <em>practice.</em>
          </h2>
        </div>
        <p>The practices that turn individual work into team capability.</p>
      </header>
      {reading ? (
        <div className="gift-reading-packets">
          {items.map((item) => (
            <article
              key={item.id}
              className="gift-packet"
              data-packet={item.id}
            >
              <PacketDetails item={item} />
            </article>
          ))}
        </div>
      ) : (
        <LayoutGroup id="gift-packet-collection">
          <div className="gift-workspace">
            <div
              className="gift-object"
              data-presented={presented}
              aria-hidden={!interactive}
            >
              <div className="gift-scene">
                <div className="gift-box-shadow" aria-hidden="true" />
                <div className="gift-box-back" aria-hidden="true" />
                {items.map((item, i) => (
                  <motion.article
                    key={item.id}
                    className="gift-object-packet"
                    data-packet={item.id}
                    layoutId={`gift-packet-${item.id}`}
                    custom={i}
                    variants={packetPoses}
                    animate={
                      presented
                        ? pulled && selected === i
                          ? "pulled"
                          : "presented"
                        : "stowed"
                    }
                    transition={{
                      duration:
                        phase === "pulling" || phase === "settling"
                          ? paused
                            ? 0
                            : 0.42
                          : duration,
                      ease: [0.22, 0.75, 0.2, 1],
                      delay: phase === "presenting" && !paused ? i * 0.1 : 0,
                      layout: { duration, ease: [0.22, 0.75, 0.2, 1] },
                    }}
                    onAnimationComplete={(definition) => {
                      setPhase((current) => {
                        if (
                          definition === "presented" &&
                          current === "presenting" &&
                          i === items.length - 1
                        )
                          return "ready";
                        if (
                          definition === "pulled" &&
                          current === "pulling" &&
                          i === selected
                        )
                          return "expanded";
                        if (
                          definition === "presented" &&
                          current === "settling" &&
                          i === selected
                        )
                          return "ready";
                        if (
                          definition === "stowed" &&
                          current === "closing" &&
                          i === items.length - 1
                        )
                          return "sealing";
                        return current;
                      });
                    }}
                  >
                    <button
                      ref={(node) => {
                        packets.current[i] = node;
                      }}
                      disabled={!interactive}
                      tabIndex={interactive ? 0 : -1}
                      aria-label={`Open ${item.label} packet`}
                      aria-expanded={detailOpen && selected === i}
                      aria-controls={
                        detailOpen && selected === i
                          ? `gift-expanded-${item.id}`
                          : undefined
                      }
                      onClick={() => select(i)}
                    >
                      <PacketFace item={item} index={i} />
                    </button>
                  </motion.article>
                ))}
                <div className="gift-box-left" aria-hidden="true" />
                <div className="gift-box-right" aria-hidden="true" />
                <div className="gift-box-front" aria-hidden="true">
                  <span className="gift-ribbon" />
                  <span className="gift-box-inscription">
                    DANIEL NASH
                    <br />
                    <small>THE LEADERSHIP TOOLKIT</small>
                  </span>
                </div>
                <motion.div
                  className="gift-lid"
                  aria-hidden="true"
                  variants={lidPoses}
                  animate={lidOpen ? "open" : "closed"}
                  transition={{
                    duration: paused ? 0 : 0.9,
                    times: [0, 0.48, 1],
                    ease: [0.22, 0.75, 0.2, 1],
                  }}
                  onAnimationComplete={(definition) => {
                    setPhase((current) => {
                      if (definition === "open" && current === "opening")
                        return "presenting";
                      if (definition === "closed" && current === "sealing")
                        return "closed";
                      return current;
                    });
                  }}
                >
                  <div className="gift-lid-top">
                    <span />
                    <i />
                  </div>
                  <div className="gift-lid-front">
                    <span />
                  </div>
                  <div className="gift-lid-side" />
                  <div className="gift-lid-right" />
                </motion.div>
              </div>
            </div>
            {phase === "closed" ? (
              <button
                ref={opener}
                className="gift-open-button"
                aria-expanded={false}
                onClick={unpack}
              >
                <span>
                  Unpack the toolkit <ArrowRight size={18} aria-hidden="true" />
                </span>
                <small>Three practices. Built for others to use.</small>
              </button>
            ) : (
              <div className="gift-collection-footer">
                <span role="status">
                  {phase === "opening"
                    ? "Opening the box…"
                    : phase === "presenting"
                      ? "Unpacking the practices…"
                      : phase === "pulling"
                        ? `Opening ${items[selected].label.toLowerCase()}…`
                        : ["returning", "settling"].includes(phase)
                          ? "Returning the packet…"
                          : ["closing", "sealing"].includes(phase)
                            ? "Putting the toolkit away…"
                            : detailOpen
                              ? "Read the packet, then return it to the box."
                              : "Choose a packet to explore."}
                </span>
                <button onClick={close} disabled={!interactive}>
                  <RotateCcw size={15} aria-hidden="true" />
                  Close the box
                </button>
              </div>
            )}
            <div className="gift-reading-stage">
              <AnimatePresence
                onExitComplete={() =>
                  setPhase((current) =>
                    current === "returning" ? "settling" : current,
                  )
                }
              >
                {detailOpen ? (
                  <motion.article
                    ref={paper}
                    key={items[selected].id}
                    id={`gift-expanded-${items[selected].id}`}
                    className="gift-lifted-packet"
                    data-packet={items[selected].id}
                    tabIndex={-1}
                    aria-labelledby={`gift-detail-${items[selected].id}`}
                    layoutId={`gift-packet-${items[selected].id}`}
                    initial={{
                      rotateX: -10,
                      rotateY: -14,
                      rotateZ: (selected - 1) * 7,
                      opacity: 1,
                    }}
                    animate={{ rotateX: 0, rotateY: 0, rotateZ: 0, opacity: 1 }}
                    exit={{
                      rotateX: -10,
                      rotateY: -14,
                      rotateZ: (selected - 1) * 7,
                      opacity: 1,
                    }}
                    transition={{ duration, ease: [0.22, 0.75, 0.2, 1] }}
                  >
                    <header className="gift-expanded-header">
                      <PacketFace item={items[selected]} index={selected} />
                      <button className="gift-return" onClick={returnPacket}>
                        <CornerDownLeft size={16} aria-hidden="true" />
                        <span>Back to the box</span>
                      </button>
                    </header>
                    <PacketDetails item={items[selected]} />
                  </motion.article>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </LayoutGroup>
      )}
      <footer className="gift-values">
        <span>What I optimize for</span>
        <p>{values.map((value) => value.title).join(" · ")}</p>
      </footer>
    </section>
  );
}
