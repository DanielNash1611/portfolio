"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Expand, ImageOff, X } from "lucide-react";

type MediaFrameProps = {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  fallbackTitle?: string;
  priority?: boolean;
  expandable?: boolean;
  expandLabel?: string;
  children?: ReactNode;
};

export default function MediaFrame({
  src,
  alt,
  sizes,
  className,
  imageClassName,
  fallbackTitle,
  priority = false,
  expandable = false,
  expandLabel = "Expand image",
  children,
}: MediaFrameProps): JSX.Element {
  const [hasError, setHasError] = useState(!src);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setHasError(!src);
  }, [src]);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const showImage = Boolean(src) && !hasError;
  const isSvg = src?.endsWith(".svg") ?? false;

  return (
    <>
      <div className={clsx("relative isolate overflow-hidden", className)}>
      {showImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          unoptimized={isSvg}
          className={clsx("object-cover", imageClassName)}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex h-full min-h-full items-center justify-center bg-[linear-gradient(180deg,rgba(247,245,242,0.9),rgba(242,227,213,0.82))] p-6 text-center">
          <div className="max-w-[16rem] space-y-3">
            <div className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-teal)]/10 bg-white/84 text-[color:var(--color-teal)]/72">
              <ImageOff className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/68">
              Preview unavailable
            </p>
            {fallbackTitle ? (
              <p className="text-sm font-medium leading-6 text-[color:var(--color-slate)]/72">
                {fallbackTitle}
              </p>
            ) : null}
            <span className="sr-only">{alt}</span>
          </div>
        </div>
      )}
      {showImage ? children : null}
      {showImage && expandable ? (
        <button
          type="button"
          aria-label={expandLabel}
          onClick={() => setIsExpanded(true)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/35 bg-[color:var(--color-slate)]/72 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-sm transition hover:bg-[color:var(--color-slate)]/86 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-slate)]"
        >
          <Expand className="h-3.5 w-3.5" aria-hidden="true" />
          Expand
        </button>
      ) : null}
      </div>

      {showImage && expandable && isExpanded ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[color:var(--color-slate)]/88 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setIsExpanded(false)}
        >
          <button
            type="button"
            aria-label="Close expanded image"
            onClick={() => setIsExpanded(false)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <div
            className="relative h-full max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/12 bg-black/10 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={src as string}
              alt={alt}
              fill
              sizes="100vw"
              unoptimized={isSvg}
              className="object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
