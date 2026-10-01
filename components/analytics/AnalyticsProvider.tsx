"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { classifyPage, track } from "@/lib/analytics";

const scrollThresholds = [25, 50, 75, 100] as const;

function isDownloadLink(anchor: HTMLAnchorElement, url: URL): boolean {
  if (anchor.hasAttribute("download")) return true;
  return /\.(pdf|docx?|xlsx?|pptx?|zip)$/i.test(url.pathname);
}

export default function AnalyticsProvider(): null {
  const pathname = usePathname();
  const reachedThresholds = useRef<Set<number>>(new Set());

  useEffect(() => {
    track("page_viewed", {
      page_group: classifyPage(pathname),
    });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const anchor = event.target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (url.origin === window.location.origin) {
        if (isDownloadLink(anchor, url)) {
          track("download_clicked", {
            from_path: pathname,
            target_path: url.pathname,
          });
          return;
        }

        track("internal_link_clicked", {
          from_path: pathname,
          target_path: url.pathname,
          target_group: classifyPage(url.pathname),
        });
        return;
      }

      if (url.protocol === "http:" || url.protocol === "https:") {
        track("external_link_clicked", {
          from_path: pathname,
          target_host: url.hostname,
        });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  useEffect(() => {
    reachedThresholds.current = new Set();

    let frame = 0;
    const measure = () => {
      frame = 0;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight <= 0
          ? 100
          : Math.min(
              100,
              Math.round((window.scrollY / scrollableHeight) * 100),
            );

      for (const threshold of scrollThresholds) {
        if (
          progress >= threshold &&
          !reachedThresholds.current.has(threshold)
        ) {
          reachedThresholds.current.add(threshold);
          track("scroll_depth_reached", {
            threshold,
            page_group: classifyPage(pathname),
          });
        }
      }
    };

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
