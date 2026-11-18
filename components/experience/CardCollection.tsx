"use client";

import NavigationCase, { MapPageArtwork } from "./NavigationCase";
import ScoreFolio, { ScorePageArtwork } from "./ScoreFolio";
import CollectionLeaf from "./CollectionLeaf";
import LeadershipEnsemble from "./LeadershipEnsemble";
import { useScoreOverture } from "./useScoreOverture";
import { scoreSequenceFrame } from "@/lib/experience/score-sequence";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, CornerDownLeft } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  outcomeReadingFrame,
  outcomeReadingRange,
  outcomeRestTravel,
  canPinCardCollection,
} from "@/lib/experience/outcome-reading";

export default function CardCollection<T>({
  items,
  reading,
  paused,
  id,
  className = "",
  eyebrow,
  heading,
  instructions,
  collectionLabel,
  container = "box",
  next,
  getKey,
  getLabel,
  renderFace,
  renderDetails,
}: {
  items: readonly T[];
  reading: boolean;
  paused: boolean;
  id: string;
  className?: string;
  eyebrow: string;
  heading: ReactNode;
  instructions: ReactNode;
  collectionLabel: string;
  container?: "box" | "navigation-case" | "score-folio";
  next: { href: string; label: string };
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  renderFace: (
    item: T,
    index: number,
    expanded: boolean,
    titleId: string,
  ) => ReactNode;
  renderDetails: (item: T) => ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const reader = useRef<HTMLDivElement>(null);
  const folio = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const cycle = useRef({ start: 0, distance: 240, shift: 0 });
  const openRef = useRef(false);
  const readingReady = useRef(false);
  const selectedRef = useRef(0);
  const restoreFocus = useRef(false);
  const openingFrame = useRef(0);
  const y = useMotionValue(0);
  const progress = useMotionValue(0);
  const [fits, setFits] = useState(false);
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [returning, setReturning] = useState(false);
  const [extraTravel, setExtraTravel] = useState(0);
  const [hasRead, setHasRead] = useState(false);
  const interactive = fits && !reading;
  const musical = container === "score-folio";
  const navigation = container === "navigation-case";
  const unfolding = musical || navigation;
  const overture = useScoreOverture(
    section,
    stage,
    interactive && unfolding,
    paused,
    navigation ? "map" : "score",
  );
  const scoreBackground = useTransform(
    overture.progress,
    [0.29, 0.54],
    ["#173f3d", "#f3eee4"],
  );
  const scoreHeading = useTransform(
    overture.progress,
    (p) => scoreSequenceFrame(p).heading,
  );
  const active = items[selected];
  const pinnedStart = useCallback(() => {
    const node = section.current;
    const scene = stage.current;
    if (!node || !scene) return window.scrollY;
    const top = parseFloat(getComputedStyle(scene).top) || 113;
    return (
      node.getBoundingClientRect().top + window.scrollY - top + overture.travel
    );
  }, [overture.travel]);
  const returnCard = useCallback(
    (manual = false) => {
      if (!openRef.current) return;
      openRef.current = false;
      restoreFocus.current =
        manual || Boolean(paper.current?.contains(document.activeElement));
      setReturning(true);
      setOpen(false);
      setHasRead(true);
      setExtraTravel(
        outcomeRestTravel(
          window.scrollY,
          pinnedStart(),
          stage.current?.clientHeight ?? 700,
        ),
      );
    },
    [pinnedStart],
  );
  useEffect(() => {
    const update = () => setFits(canPinCardCollection(window.innerHeight));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  useEffect(() => {
    if (interactive) return;
    cancelAnimationFrame(openingFrame.current);
    openRef.current = false;
    setOpen(false);
    setReturning(false);
    setExtraTravel(0);
    y.set(0);
    progress.set(0);
  }, [interactive, progress, y]);
  useEffect(() => () => cancelAnimationFrame(openingFrame.current), []);
  useEffect(() => {
    const heading = intro.current;
    const canvas = stage.current;
    if (!interactive || !heading || !canvas) return;
    const measure = () =>
      canvas.style.setProperty(
        "--collection-intro-height",
        `${heading.getBoundingClientRect().height}px`,
      );
    const observer = new ResizeObserver(measure);
    observer.observe(heading);
    measure();
    return () => observer.disconnect();
  }, [interactive]);
  const select = (index: number) => {
    if (openRef.current || returning || (unfolding && !overture.ready)) return;
    const start = Math.max(0, pinnedStart());
    cycle.current = { start, distance: 1000, shift: 0 };
    selectedRef.current = index;
    openRef.current = true;
    readingReady.current = false;
    y.set(0);
    progress.set(0);
    setSelected(index);
    setHasRead(false);
    setExtraTravel(
      Math.max(0, start - pinnedStart()) +
        1000 +
        Math.max(360, (stage.current?.clientHeight ?? 700) * 0.65),
    );
    // Commit the pinning space and align in either scroll direction before
    // shared-layout measurement. A late click must not lift an offscreen card.
    openingFrame.current = requestAnimationFrame(() => {
      window.scrollTo({ top: start, behavior: "instant" });
      openingFrame.current = requestAnimationFrame(() => setOpen(true));
    });
  };
  useEffect(() => {
    if (!interactive || !open || !paper.current || !reader.current) return;
    const measure = () => {
      if (!paper.current || !reader.current) return;
      const range = outcomeReadingRange(
        paper.current.scrollHeight,
        reader.current.clientHeight,
      );
      cycle.current = { ...cycle.current, ...range };
      setExtraTravel(
        Math.max(0, cycle.current.start - pinnedStart()) +
          range.distance +
          Math.max(360, (stage.current?.clientHeight ?? 700) * 0.65),
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(paper.current);
    observer.observe(reader.current);
    measure();
    paper.current.focus({ preventScroll: true });
    return () => observer.disconnect();
  }, [interactive, open, selected, pinnedStart]);
  useEffect(() => {
    if (!interactive) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!openRef.current) {
        // Re-entering from the opening starts with a compact collection again.
        if (window.scrollY < cycle.current.start - 60 && !returning)
          setExtraTravel(0);
        return;
      }
      if (!readingReady.current) return;
      const current = cycle.current;
      const value = outcomeReadingFrame(
        window.scrollY,
        current.start,
        current.distance,
        current.shift,
      );
      y.set(value.y);
      progress.set(value.progress);
      if (value.finished) returnCard();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [interactive, returning, returnCard, progress, y]);
  const beginReading = () => {
    if (!openRef.current || readingReady.current) return;
    cycle.current.start = window.scrollY;
    readingReady.current = true;
    setExtraTravel(
      Math.max(0, window.scrollY - pinnedStart()) +
        cycle.current.distance +
        Math.max(360, (stage.current?.clientHeight ?? 700) * 0.65),
    );
  };
  const finishReturn = () => {
    setReturning(false);
    y.set(0);
    if (restoreFocus.current)
      requestAnimationFrame(() =>
        buttons.current[selectedRef.current]?.focus({ preventScroll: true }),
      );
  };
  const motionDuration = paused ? 0 : 0.72;
  const restingTilt =
    container === "box"
      ? { rotateX: 8, rotateY: -14, rotateZ: -5 }
      : { rotateX: 3, rotateY: 0, rotateZ: 0 };
  return (
    <motion.section
      ref={section}
      className={`experience-card-collection experience-home-section ${className}`}
      id={id}
      aria-labelledby={`${id}-heading`}
      data-reading={!interactive}
      data-container={container}
      data-score-ready={!musical || overture.ready}
      data-navigation-ready={!navigation || overture.ready}
      data-anchor-offset={musical && interactive ? overture.travel : undefined}
      style={
        interactive
          ? ({
              "--outcome-travel": `${extraTravel}px`,
              "--score-overture-travel": `${overture.travel}px`,
              "--navigation-unfold-travel": `${overture.travel}px`,
              backgroundColor: musical ? scoreBackground : undefined,
            } as CSSProperties)
          : undefined
      }
    >
      {musical && (
        <span
          id="experience-ensemble"
          className="score-sequence-anchor"
          aria-hidden="true"
        />
      )}
      <LayoutGroup id={`${id}-collection`}>
        <div
          ref={stage}
          className="outcome-stage"
          data-open={open}
          data-returning={returning}
        >
          {musical && (
            <LeadershipEnsemble
              progress={overture.progress}
              enabled={interactive}
              paused={paused}
              stage={stage}
              folio={folio}
              seek={overture.seek}
            />
          )}
          <motion.div
            className="score-heading-visibility"
            style={
              musical && interactive ? { opacity: scoreHeading } : undefined
            }
          >
            <div ref={intro} className="experience-outcomes-intro">
              <div>
                <p className="experience-home-eyebrow">{eyebrow}</p>
                <h2 id={`${id}-heading`}>{heading}</h2>
              </div>
              <p>
                {interactive
                  ? instructions
                  : "Read the leadership and evidence."}
              </p>
            </div>
          </motion.div>
          {interactive ? (
            <>
              <div
                ref={folio}
                className="outcome-vault"
                role="group"
                aria-label={`Choose a card: ${collectionLabel}`}
                aria-hidden={open || returning}
                data-open={open || returning}
              >
                {container === "navigation-case" ? (
                  <NavigationCase progress={overture.progress} />
                ) : container === "score-folio" ? (
                  <ScoreFolio progress={overture.progress} />
                ) : (
                  <>
                    <div className="outcome-vault-back" aria-hidden="true" />
                    <div className="outcome-vault-floor" aria-hidden="true" />
                  </>
                )}
                <div className="outcome-vault-cards">
                  {items.map((item, index) => (
                    <CollectionLeaf
                      key={getKey(item)}
                      kind={navigation ? "map" : musical ? "score" : undefined}
                      index={index}
                      progress={overture.progress}
                    >
                      <motion.article
                        className="outcome-docked-card"
                        data-tone={index}
                        key={getKey(item)}
                        layoutId={`${id}-card-${getKey(item)}`}
                        animate={{
                          opacity: open && selected !== index ? 0.28 : 1,
                        }}
                        transition={{
                          layout: {
                            duration: motionDuration,
                            ease: [0.22, 0.75, 0.2, 1],
                          },
                          opacity: { duration: 0.25 },
                        }}
                        whileHover={
                          open || returning || paused
                            ? undefined
                            : { filter: "brightness(1.06)" }
                        }
                      >
                        {navigation && (
                          <MapPageArtwork
                            index={index}
                            progress={overture.progress}
                          />
                        )}
                        {musical && (
                          <ScorePageArtwork
                            index={index}
                            progress={overture.progress}
                          />
                        )}
                        <button
                          ref={(node) => {
                            buttons.current[index] = node;
                          }}
                          onClick={() => select(index)}
                          disabled={
                            open || returning || (unfolding && !overture.ready)
                          }
                          aria-expanded={open && selected === index}
                          aria-label={getLabel(item)}
                        >
                          {renderFace(
                            item,
                            index,
                            false,
                            `${id}-title-${getKey(item)}`,
                          )}
                          <span className="outcome-card-open">
                            Explore the story
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </span>
                        </button>
                      </motion.article>
                    </CollectionLeaf>
                  ))}
                </div>
                {container === "box" && (
                  <div className="outcome-vault-front" aria-hidden="true">
                    <span>{collectionLabel}</span>
                    <span>{items.length} stories</span>
                  </div>
                )}
              </div>
              <div
                ref={reader}
                className="outcome-reader"
                data-active={open || returning}
              >
                <motion.div className="outcome-paper-scroll" style={{ y }}>
                  <AnimatePresence onExitComplete={finishReturn}>
                    {open ? (
                      <motion.article
                        ref={paper}
                        onAnimationComplete={beginReading}
                        tabIndex={-1}
                        className="outcome-lifted-paper"
                        data-tone={selected}
                        layoutId={`${id}-card-${getKey(active)}`}
                        key={getKey(active)}
                        aria-labelledby={`${id}-title-${getKey(active)}`}
                        initial={{
                          ...restingTilt,
                          opacity: 1,
                        }}
                        animate={{
                          rotateX: 0,
                          rotateY: 0,
                          rotateZ: 0,
                          opacity: 1,
                        }}
                        exit={{
                          ...restingTilt,
                          opacity: 1,
                        }}
                        transition={{
                          duration: motionDuration,
                          ease: [0.22, 0.75, 0.2, 1],
                        }}
                      >
                        {renderFace(
                          active,
                          selected,
                          true,
                          `${id}-title-${getKey(active)}`,
                        )}
                        {renderDetails(active)}
                        <div className="outcome-paper-end">
                          <span>
                            You’ve reached the end of this card.
                            <br />
                            <small>
                              Keep scrolling to return it to the collection.
                            </small>
                          </span>
                          <button onClick={() => returnCard(true)}>
                            <CornerDownLeft size={16} aria-hidden="true" />
                            Return this card
                          </button>
                        </div>
                      </motion.article>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              </div>
              {navigation && !overture.ready && (
                <p className="navigation-unfold-caption">
                  Scroll to unfold the map, left to right.
                </p>
              )}
              <div
                className="outcome-stage-footer"
                aria-hidden={unfolding && !overture.ready}
              >
                {open ? (
                  <>
                    <button onClick={() => returnCard(true)}>
                      <CornerDownLeft size={15} aria-hidden="true" />
                      Return to collection
                    </button>
                    <span>
                      Scroll to read the card
                      <ArrowDown size={14} aria-hidden="true" />
                    </span>
                    <div className="outcome-read-track" aria-hidden="true">
                      <motion.div style={{ scaleX: progress }} />
                    </div>
                  </>
                ) : (
                  <>
                    <span role="status">
                      {returning
                        ? "Returning the card…"
                        : hasRead
                          ? "Choose another card, or keep scrolling."
                          : "Choose a card, or keep scrolling."}
                    </span>
                    <a
                      href={next.href}
                      tabIndex={unfolding && !overture.ready ? -1 : undefined}
                    >
                      {next.label}
                      <ArrowDown size={15} aria-hidden="true" />
                    </a>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="outcome-linear-stories">
              {items.map((item, index) => (
                <article
                  className="outcome-lifted-paper"
                  data-tone={index}
                  key={getKey(item)}
                >
                  {renderFace(item, index, true, `${id}-title-${getKey(item)}`)}
                  {renderDetails(item)}
                </article>
              ))}
            </div>
          )}
        </div>
      </LayoutGroup>
      {!interactive ? (
        <div className="experience-outcomes-next">
          <a href={next.href}>
            {next.label}
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      ) : null}
    </motion.section>
  );
}
