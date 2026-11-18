"use client";
import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PortfolioFilm } from "@/motion-film/PortfolioFilm";
gsap.registerPlugin(ScrollTrigger);
export default function CinematicPlayer({
  paused,
  reduced,
}: {
  paused: boolean;
  reduced: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<PlayerRef>(null);
  const frameHost = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState(16 / 9);
  const directControl = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 760,
  );
  useEffect(() => {
    const element = frameHost.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setAspect(width / height);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const query = matchMedia("(max-width:759px)");
    const change = () => setMobile(query.matches);
    change();
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const ref = player.current;
    if (!ref) return;
    const tick = ({ detail }: { detail: { frame: number } }) =>
      setFrame(detail.frame);
    const stop = () => setPlaying(false);
    ref.addEventListener("frameupdate", tick);
    ref.addEventListener("pause", stop);
    ref.addEventListener("ended", stop);
    return () => {
      ref.removeEventListener("frameupdate", tick);
      ref.removeEventListener("pause", stop);
      ref.removeEventListener("ended", stop);
    };
  }, []);
  useEffect(() => {
    if (paused) player.current?.pause();
    const hidden = () => {
      if (document.hidden) player.current?.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) player.current?.pause();
    });
    if (host.current) observer.observe(host.current);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [paused]);
  useEffect(() => {
    if (reduced) {
      player.current?.seekTo(220);
      return;
    }
    const trigger = ScrollTrigger.create({
      trigger: host.current?.closest(".experience-film"),
      start: () =>
        `top top+=${parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--portfolio-header-height")) + 52 || 113}`,
      end: "bottom bottom",
      onRefresh: (self) => {
        if (!directControl.current)
          player.current?.seekTo(Math.round(self.progress * 239));
      },
      onUpdate: (self) => {
        if (!self.isActive && !directControl.current) player.current?.pause();
        if (!directControl.current) {
          player.current?.pause();
          player.current?.seekTo(Math.round(self.progress * 239));
        }
      },
    });
    const scrolling = () => {
      directControl.current = false;
    };
    const pointer = (event: PointerEvent) => {
      if (!host.current?.contains(event.target as Node)) scrolling();
    };
    const key = (event: KeyboardEvent) => {
      if (
        !host.current?.contains(event.target as Node) &&
        [
          "PageDown",
          "PageUp",
          "Home",
          "End",
          "ArrowDown",
          "ArrowUp",
          " ",
        ].includes(event.key)
      )
        scrolling();
    };
    window.addEventListener("wheel", scrolling, { passive: true });
    window.addEventListener("touchmove", scrolling, { passive: true });
    window.addEventListener("pointerdown", pointer);
    window.addEventListener("keydown", key);
    return () => {
      trigger.kill();
      window.removeEventListener("wheel", scrolling);
      window.removeEventListener("touchmove", scrolling);
      window.removeEventListener("pointerdown", pointer);
      window.removeEventListener("keydown", key);
    };
  }, [reduced, mobile]);
  return (
    <div ref={host} className="experience-film-player" data-frame={frame}>
      <div className="experience-film-controls">
        <button
          onClick={() => {
            directControl.current = true;
            if (playing) player.current?.pause();
            else {
              const section = host.current?.closest(".experience-film");
              const offset =
                (parseFloat(
                  getComputedStyle(document.documentElement).getPropertyValue(
                    "--portfolio-header-height",
                  ),
                ) || 61) + 52;
              if (section) {
                const bounds = host.current!.getBoundingClientRect();
                if (bounds.top < offset || bounds.bottom > innerHeight) {
                  window.scrollTo({
                    top:
                      section.getBoundingClientRect().top +
                      scrollY -
                      offset +
                      1,
                    behavior: "smooth",
                  });
                }
              }
              if (frame >= 239) player.current?.seekTo(0);
              player.current?.play();
              setPlaying(true);
            }
          }}
          disabled={paused}
          aria-pressed={playing}
        >
          {playing ? "Pause film" : "Play film"}
        </button>
        <label>
          <span className="sr-only">Film position</span>
          <input
            aria-label="Film position"
            type="range"
            min="0"
            max="239"
            value={frame}
            onFocus={() => {
              directControl.current = true;
            }}
            onKeyDown={() => {
              directControl.current = true;
            }}
            onChange={(event) => {
              directControl.current = true;
              player.current?.pause();
              player.current?.seekTo(Number(event.target.value));
            }}
          />
        </label>
        <span>Scroll to play · 8-second silent film</span>
      </div>
      <div ref={frameHost} className="experience-film-frame" aria-hidden="true">
        <Player
          ref={player}
          component={PortfolioFilm}
          durationInFrames={240}
          fps={30}
          compositionWidth={mobile ? 900 : 1600}
          compositionHeight={Math.round((mobile ? 900 : 1600) / aspect)}
          inputProps={{ compact: mobile }}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          autoPlay={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          acknowledgeRemotionLicense
        />
      </div>
    </div>
  );
}
