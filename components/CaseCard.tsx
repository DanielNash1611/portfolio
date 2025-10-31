import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type CaseCardMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type CaseCardProps = {
  title: string;
  description: string;
  href: string;
  tags: string[];
  media: CaseCardMedia;
  status?: string;
  chips?: string[];
  className?: string;
};

const tagClasses =
  "inline-flex items-center rounded-full border border-[#2C4F52]/15 bg-[#F2E3D5]/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2C4F52]";

const chipClasses =
  "inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs text-[#2C4F52] ring-1 ring-[#2C4F52]/10";

const CaseCard = ({
  title,
  description,
  href,
  tags,
  media,
  status,
  chips,
  className
}: CaseCardProps): JSX.Element => {
  const cardLabel = `View ${title}`;

  return (
    <article
      className={clsx(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-[#2C4F52]/12 bg-white/90 shadow-soft transition focus-within:-translate-y-1 focus-within:shadow-lg hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <Link
        href={href}
        aria-label={cardLabel}
        className="relative block overflow-hidden focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          sizes="(min-width: 1280px) 380px, (min-width: 768px) 45vw, 90vw"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2C4F52]/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className={tagClasses}>
              {tag}
            </span>
          ))}
          {status ? (
            <span className={tagClasses} aria-label={`Status: ${status}`}>
              {status}
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[#2C4F52]">
            <Link
              href={href}
              className="focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label={cardLabel}
            >
              {title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-[#3A3D40]/80">
            {description}
          </p>
        </div>

        {chips?.length ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span key={chip} className={chipClasses}>
                {chip}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-[#2C4F52]/90 px-5 py-2 text-sm font-semibold text-[#F2E3D5] transition hover:bg-[#2C4F52] focus-visible:outline-none focus-visible:ring focus-visible:ring-[#D17A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label={cardLabel}
          >
            View case study
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CaseCard;
