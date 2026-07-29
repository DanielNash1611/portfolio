import clsx from "clsx";
import type { VisualAsset } from "@/content/portfolio";
import MediaFrame from "@/components/site/MediaFrame";

type VisualPlaceholderProps = {
  asset: VisualAsset;
  className?: string;
};

export default function VisualPlaceholder({
  asset,
  className,
}: VisualPlaceholderProps): JSX.Element {
  const imageFitClassName =
    asset.imageFit === "contain" ? "object-contain" : "object-cover";

  return (
    <article
      className={clsx(
        "overflow-hidden border border-[color:var(--color-slate)]/16 bg-[color:var(--color-background)]",
        className,
      )}
    >
      {asset.image ? (
        <MediaFrame
          src={asset.image}
          alt={asset.alt ?? asset.title}
          fallbackTitle={asset.title}
          sizes="(min-width: 1280px) 760px, (min-width: 1024px) 50vw, 100vw"
          className="aspect-[3/2] border-b border-[color:var(--color-slate)]/14 bg-[color:var(--color-background-soft)]"
          imageClassName={imageFitClassName}
          expandable={asset.expandable}
          expandLabel={`Expand ${asset.title}`}
        />
      ) : (
        <div className="flex min-h-[220px] items-center justify-center border-b border-dashed border-[color:var(--color-teal)]/18 bg-[color:var(--color-background-soft)] px-6 text-center text-sm font-medium text-[color:var(--color-teal)]/76">
          Reserved for a public-safe artifact
        </div>
      )}

      <div className="space-y-3 p-5 md:p-6">
        <h3 className="font-serif text-2xl font-medium tracking-[-0.03em] text-[color:var(--color-slate)]">
          {asset.title}
        </h3>
        <p className="text-base leading-7 text-[color:var(--color-slate)]/70">
          {asset.description}
        </p>
        {asset.todo ? (
          <p className="border-l-2 border-[color:var(--color-orange)] bg-[color:var(--color-background-soft)]/70 px-4 py-3 text-sm leading-6 text-[color:var(--color-slate)]/72">
            {asset.todo}
          </p>
        ) : null}
      </div>
    </article>
  );
}
