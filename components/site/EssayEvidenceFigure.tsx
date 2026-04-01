import clsx from "clsx";
import MediaFrame from "@/components/site/MediaFrame";

type EssayEvidenceFigureProps = {
  src: string;
  alt: string;
  eyebrow?: string;
  caption?: string;
  width?: "hero" | "wide" | "support" | "compact";
  aspectClassName?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  expandable?: boolean;
  expandLabel?: string;
};

const widthClasses: Record<
  NonNullable<EssayEvidenceFigureProps["width"]>,
  string
> = {
  hero: "max-w-[72rem]",
  wide: "max-w-[64rem]",
  support: "max-w-[56rem]",
  compact: "max-w-[46rem]",
};

const sizeMap: Record<
  NonNullable<EssayEvidenceFigureProps["width"]>,
  string
> = {
  hero: "(min-width: 1280px) 1120px, 100vw",
  wide: "(min-width: 1280px) 960px, (min-width: 768px) 84vw, 100vw",
  support: "(min-width: 1280px) 860px, (min-width: 768px) 78vw, 100vw",
  compact: "(min-width: 1280px) 720px, (min-width: 768px) 70vw, 100vw",
};

export default function EssayEvidenceFigure({
  src,
  alt,
  eyebrow,
  caption,
  width = "support",
  aspectClassName = "aspect-[16/10]",
  className,
  imageClassName,
  sizes,
  priority = false,
  expandable = true,
  expandLabel,
}: EssayEvidenceFigureProps): JSX.Element {
  return (
    <figure
      className={clsx("mx-auto space-y-4", widthClasses[width], className)}
    >
      {eyebrow || caption ? (
        <figcaption className="space-y-2 px-1">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-teal)]/68">
              {eyebrow}
            </p>
          ) : null}
          {caption ? (
            <p className="max-w-2xl text-sm leading-6 text-[color:var(--color-slate)]/62">
              {caption}
            </p>
          ) : null}
        </figcaption>
      ) : null}

      <MediaFrame
        src={src}
        alt={alt}
        sizes={sizes ?? sizeMap[width]}
        priority={priority}
        expandable={expandable}
        expandLabel={expandLabel ?? `Expand ${eyebrow ?? "evidence"} image`}
        className={clsx(
          "overflow-hidden rounded-[2rem] border border-black/6 bg-white/86 shadow-[0_24px_60px_rgba(58,61,64,0.08)]",
          aspectClassName,
        )}
        imageClassName={clsx(
          "object-contain bg-[linear-gradient(180deg,rgba(250,249,247,0.96),rgba(247,245,242,0.92))] p-3 md:p-6",
          imageClassName,
        )}
      />
    </figure>
  );
}
