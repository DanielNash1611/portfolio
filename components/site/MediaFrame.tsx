"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { ImageOff } from "lucide-react";

type MediaFrameProps = {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  fallbackTitle?: string;
  priority?: boolean;
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
  children,
}: MediaFrameProps): JSX.Element {
  const [hasError, setHasError] = useState(!src);

  useEffect(() => {
    setHasError(!src);
  }, [src]);

  const showImage = Boolean(src) && !hasError;
  const isSvg = src?.endsWith(".svg") ?? false;

  return (
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
    </div>
  );
}
