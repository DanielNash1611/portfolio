"use client";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { ExperienceHomeContent } from "@/content/experience-home";
import { referralOrder } from "@/content/experience-referrals";
import {
  referralCardPose,
  referralFeaturedCount,
  referralLayout,
  referralRingFrame,
  type ReferralLayout,
} from "@/lib/experience/referral-ring";
import { useShortViewport } from "./useShortViewport";

type Groups = ExperienceHomeContent["recommendations"];
type Person = Groups[number]["people"][number];
type VoiceEntry = {
  person: Person;
  discipline: string;
  group: number;
  rank: number;
};
function Portrait({ person }: { person: Person }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="experience-recommender-portrait" aria-hidden="true">
      {failed ? (
        <span>
          {person.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </span>
      ) : (
        <Image
          src={person.avatarUrl}
          alt=""
          width={44}
          height={44}
          loading="lazy"
          unoptimized
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
function Voice({
  person,
  discipline,
  active = true,
  onSelect,
}: {
  person: Person;
  discipline: string;
  active?: boolean;
  onSelect?: () => void;
}) {
  return (
    <figure>
      <p className="experience-voice-context">
        <span>{discipline}</span>
        <span>{person.relationship}</span>
      </p>
      <blockquote data-long={person.quote.length > 150}>
        “{person.quote}”
      </blockquote>
      <figcaption>
        <div className="experience-recommender-identity">
          <Portrait person={person} />
          <div className="experience-recommender-details">
            <strong>{person.name}</strong>
            <span>{person.title}</span>
          </div>
        </div>
        {onSelect ? (
          <button
            type="button"
            className="experience-recommender-read-more"
            onClick={onSelect}
          >
            Read full recommendation
          </button>
        ) : null}
        {person.href ? (
          <a
            href={person.href}
            target="_blank"
            rel="noreferrer"
            tabIndex={active ? 0 : -1}
          >
            LinkedIn recommendation <ArrowUpRight size={12} />
          </a>
        ) : (
          <small>Direct recommendation</small>
        )}
      </figcaption>
    </figure>
  );
}

const RingCard = memo(function RingCard({
  entry,
  index,
  count,
  progress,
  layout,
  active,
  grouped,
  onSelect,
}: {
  entry: VoiceEntry;
  index: number;
  count: number;
  progress: MotionValue<number>;
  layout: ReferralLayout;
  active: boolean;
  grouped: boolean;
  onSelect: (entry: VoiceEntry) => void;
}) {
  const pose = useTransform(progress, (p) =>
    referralCardPose(p, index, count, entry, layout),
  );
  const x = useTransform(pose, (p) => p.x),
    y = useTransform(pose, (p) => p.y),
    z = useTransform(pose, (p) => p.z);
  const rotateY = useTransform(pose, (p) => p.rotateY),
    rotateZ = useTransform(pose, (p) => p.rotateZ);
  const width = useTransform(pose, (p) => p.width),
    height = useTransform(pose, (p) => p.height);
  const fullOpacity = useTransform(pose, (p) => p.fullOpacity * p.bodyOpacity);
  const summaryOpacity = useTransform(pose, (p) => p.summaryOpacity);
  const deckOpacity = useTransform(pose, (p) => p.deckOpacity);
  const zIndex = useTransform(pose, (p) => Math.round(10000 + p.z));
  return (
    <motion.li
      className="experience-referral-card"
      data-person={entry.person.id}
      data-group={entry.group}
      data-rank={entry.rank}
      data-active={active && !grouped}
      style={{ x, y, z, rotateY, rotateZ, width, height, zIndex }}
    >
      <div className="experience-referral-front">
        <motion.div
          className="experience-referral-full"
          style={{ opacity: fullOpacity }}
          aria-hidden={!active || grouped}
        >
          <Voice
            person={entry.person}
            discipline={entry.discipline}
            active={active && !grouped}
          />
        </motion.div>
        <motion.div
          className="experience-referral-deck"
          style={{ opacity: deckOpacity }}
          aria-hidden="true"
        >
          <span>“</span>
          <strong>{entry.person.name}</strong>
          <small>{entry.person.relationship}</small>
          <i>Working together / Daniel Nash</i>
        </motion.div>
        <motion.div
          className="experience-referral-summary"
          style={{ opacity: summaryOpacity }}
          aria-hidden={!grouped}
        >
          <button
            type="button"
            className="experience-referral-select"
            disabled={!grouped || (layout.compact && entry.rank > 0)}
            aria-hidden={layout.compact && entry.rank > 0}
            aria-haspopup="dialog"
            aria-label={`Read ${entry.person.name}’s full recommendation`}
            onClick={() => onSelect(entry)}
          >
            <Portrait person={entry.person} />
            <span className="experience-recommender-details">
              <strong>{entry.person.name}</strong>
              <span>{entry.person.relationship}</span>
            </span>
            <span className="sr-only">{entry.discipline}</span>
          </button>
        </motion.div>
      </div>
    </motion.li>
  );
});

function Ring({
  groups,
  people,
  progress,
  active,
  grouped,
  readingQuotes,
  onSelect,
}: {
  groups: Groups;
  people: VoiceEntry[];
  progress: MotionValue<number>;
  active: number;
  grouped: boolean;
  readingQuotes: boolean;
  onSelect: (entry: VoiceEntry) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      const width = Math.round(rect.width),
        height = Math.round(rect.height);
      setSize((previous) =>
        previous.width === width && previous.height === height
          ? previous
          : { width, height },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const layout = useMemo(
    () =>
      referralLayout(
        Math.max(1, size.width),
        Math.max(1, size.height),
        groups.map((group) => group.people.length),
      ),
    [size, groups],
  );
  const groupOpacity = useTransform(progress, (p) =>
    Math.max(
      0,
      Math.min(1, (referralRingFrame(p, people.length).gather - 0.22) / 0.48),
    ),
  );
  return (
    <div
      ref={viewport}
      className="experience-referral-space"
      data-compact={layout.compact}
      data-ready={size.width > 0}
      role="group"
      aria-label="Featured recommendations rotate, then gather into browsable disciplines"
    >
      {size.width > 0 ? (
        <>
          <ol className="experience-referral-world">
            {people.map((entry, i) => (
              <RingCard
                key={entry.person.id}
                entry={entry}
                index={i}
                count={people.length}
                progress={progress}
                layout={layout}
                active={readingQuotes && active === i}
                grouped={grouped}
                onSelect={onSelect}
              />
            ))}
          </ol>
          <motion.div
            className="experience-referral-groups"
            style={{ opacity: groupOpacity }}
            aria-hidden={!grouped}
          >
            {groups.map((group, i) => (
              <div
                key={group.label}
                className="experience-referral-group-label"
                style={{
                  left: layout.groups[i].x,
                  top: layout.groups[i].y,
                  width: layout.groups[i].width,
                }}
              >
                <h3>
                  <button
                    type="button"
                    disabled={!grouped}
                    aria-haspopup="dialog"
                    aria-label={`Browse ${group.label}, ${group.people.length} recommendations`}
                    onClick={() =>
                      onSelect(people.find((entry) => entry.group === i)!)
                    }
                  >
                    {group.label}
                    <span>
                      {group.people.length}{" "}
                      {group.people.length === 1 ? "person" : "people"}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </span>
                  </button>
                </h3>
              </div>
            ))}
          </motion.div>
        </>
      ) : null}
    </div>
  );
}

function RecommendationDetail({
  groups,
  people,
  selected,
  onSelect,
  onClose,
}: {
  groups: Groups;
  people: VoiceEntry[];
  selected: VoiceEntry;
  onSelect: (entry: VoiceEntry) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current!;
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const position = window.scrollY;
    element.showModal();
    document.body.style.overflow = "hidden";
    // Some browsers scroll the page when moving focus into the top layer.
    window.scrollTo({ top: position, behavior: "instant" });
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      opener?.focus({ preventScroll: true });
      window.scrollTo({ top: position, behavior: "instant" });
    };
  }, []);
  const { person } = selected;
  return createPortal(
    <dialog
      ref={dialog}
      className="experience-referral-detail"
      aria-labelledby="experience-referral-detail-name"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <header className="experience-referral-detail-header">
        <p>
          In their own words <span>{people.length} recommendations</span>
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close recommendation"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <div className="experience-referral-detail-layout">
        <nav aria-label="Choose a recommender">
          <label>
            Browse by discipline
            <select
              value={selected.group}
              onChange={(event) =>
                onSelect(
                  people.find(
                    (entry) => entry.group === Number(event.target.value),
                  )!,
                )
              }
            >
              {groups.map((group, i) => (
                <option key={group.label} value={i}>
                  {group.label} ({group.people.length})
                </option>
              ))}
            </select>
          </label>
          <ul>
            {people
              .filter((entry) => entry.group === selected.group)
              .map((entry) => (
                <li key={entry.person.id}>
                  <button
                    type="button"
                    aria-pressed={entry.person.id === person.id}
                    onClick={() => onSelect(entry)}
                  >
                    <Portrait person={entry.person} />
                    <span>{entry.person.name}</span>
                  </button>
                </li>
              ))}
          </ul>
        </nav>
        <article>
          <div className="experience-recommender-identity">
            <Portrait person={person} />
            <div className="experience-recommender-details">
              <h2 id="experience-referral-detail-name">{person.name}</h2>
              <span>{person.title}</span>
            </div>
          </div>
          <p className="experience-referral-detail-capacity">
            {person.capacity}
          </p>
          <blockquote>
            {person.fullQuote
              .split(/\n+/)
              .filter(Boolean)
              .map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
          </blockquote>
          {person.href ? (
            <a href={person.href} target="_blank" rel="noreferrer">
              View on LinkedIn <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ) : (
            <p className="experience-referral-detail-source">
              Provided directly to Daniel.
            </p>
          )}
        </article>
      </div>
    </dialog>,
    document.body,
  );
}

export default function Recommendations({
  groups,
  reading,
}: {
  groups: Groups;
  paused: boolean;
  reading: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion(),
    short = useShortViewport();
  const [readAll, setReadAll] = useState(false);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<VoiceEntry | null>(null);
  const [phase, setPhase] =
    useState<ReturnType<typeof referralRingFrame>["phase"]>("overview");
  const people = useMemo(() => {
    const order: readonly string[] = referralOrder;
    const rank = groups.map(() => 0);
    return groups
      .flatMap((group, groupIndex) =>
        group.people.map((person) => ({
          person,
          discipline: group.label,
          group: groupIndex,
        })),
      )
      .sort((a, b) => {
        const index = (id: string) => {
          const n = order.indexOf(id);
          return n < 0 ? order.length : n;
        };
        return index(a.person.id) - index(b.person.id);
      })
      .map((entry) => ({ ...entry, rank: rank[entry.group]++ }));
  }, [groups]);
  const count = people.length;
  const staticView = reading || Boolean(reduced) || short || readAll;
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const frame = referralRingFrame(p, count);
    if (frame.index !== active) setActive(frame.index);
    if (frame.phase !== phase) setPhase(frame.phase);
  });
  return (
    <section
      ref={root}
      className="experience-recommendation experience-home-section experience-recommendation-flow"
      id="experience-recommendations"
      aria-labelledby="experience-recommendations-heading"
      data-mode="ring"
      data-phase={phase}
      data-static={staticView}
      style={
        {
          "--recommendation-featured-count": Math.min(
            referralFeaturedCount,
            count,
          ),
        } as CSSProperties
      }
    >
      <div className="experience-recommendation-stage">
        <header>
          <p className="experience-home-eyebrow">
            {count} recommendations / Leaders, managers, peers & partners
          </p>
          <h2 id="experience-recommendations-heading" tabIndex={-1}>
            What it feels like <em>to work together.</em>
          </h2>
        </header>
        {staticView ? (
          <div className="experience-recommendation-reading">
            {groups.map((group) => (
              <div key={group.label}>
                <h3>{group.label}</h3>
                {group.people.map((person) => (
                  <Voice
                    key={person.id}
                    person={person}
                    discipline={group.label}
                    onSelect={() =>
                      setSelected(
                        people.find((entry) => entry.person.id === person.id)!,
                      )
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <Ring
            groups={groups}
            people={people}
            progress={scrollYProgress}
            active={active}
            grouped={phase === "grouped"}
            readingQuotes={phase === "overview" || phase === "reading"}
            onSelect={setSelected}
          />
        )}
        <footer className="experience-voices-footer">
          <span>
            {staticView
              ? `${count} perspectives`
              : phase === "overview"
                ? `${count} recommendations`
                : phase === "reading"
                  ? `${String(active + 1).padStart(2, "0")} / ${Math.min(referralFeaturedCount, count)} featured`
                  : `${count} people · ${groups.length} disciplines`}
          </span>
          {!staticView ? (
            <span>
              {phase === "overview"
                ? "Scroll to turn the circle ↓"
                : phase === "reading"
                  ? "Scroll to browse by discipline ↓"
                  : phase === "sorting"
                    ? "Across the disciplines"
                    : "Select a person or discipline"}
            </span>
          ) : null}
          {!reading && !reduced && !short ? (
            <button
              aria-expanded={readAll}
              onClick={() => {
                setReadAll((value) => !value);
                requestAnimationFrame(() => {
                  root.current?.scrollIntoView({ block: "start" });
                  root.current
                    ?.querySelector("h2")
                    ?.focus({ preventScroll: true });
                });
              }}
            >
              {readAll ? "Explore in motion" : "Read all"}
            </button>
          ) : null}
        </footer>
      </div>
      {selected ? (
        <RecommendationDetail
          groups={groups}
          people={people}
          selected={selected}
          onSelect={setSelected}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </section>
  );
}
