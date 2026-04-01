import type { ReactNode } from "react";
import clsx from "clsx";
import CTASection from "@/components/site/CTASection";
import EssayEvidenceFigure from "@/components/site/EssayEvidenceFigure";
import MotionReveal from "@/components/site/MotionReveal";

export type EditorialEssayBlock =
  | {
      type: "paragraph";
      text: string;
      emphasis?: boolean;
    }
  | {
      type: "list";
      items: string[];
    };

export type EditorialEssaySection = {
  title: string;
  blocks: EditorialEssayBlock[];
  tone?: "default" | "closing";
  artifact?: {
    eyebrow?: string;
    src: string;
    alt: string;
    width?: "hero" | "wide" | "support" | "compact";
    aspectClassName?: string;
    imageClassName?: string;
    priority?: boolean;
    caption?: string;
  };
};

type EditorialEssayLayoutProps = {
  eyebrow: string;
  title: string;
  readTime: string;
  tags: string[];
  introParagraphs: string[];
  sections: EditorialEssaySection[];
  articleLabel?: string;
  ctaDescription?: string;
  afterHero?: ReactNode;
};

function renderBlock(block: EditorialEssayBlock): JSX.Element {
  if (block.type === "list") {
    return (
      <ul className="space-y-4 pt-1">
        {block.items.map((item) => (
          <li
            key={item}
            className="flex gap-4 text-base leading-7 text-[color:var(--color-slate)]/74 md:text-lg"
          >
            <span
              aria-hidden="true"
              className="mt-3 h-1.5 w-1.5 rounded-full bg-[color:var(--color-orange)]"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p
      className={clsx(
        "text-base leading-7 text-[color:var(--color-slate)]/74 md:text-lg md:leading-8",
        block.emphasis
          ? "pt-2 text-xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-[1.9rem] md:leading-[1.3]"
          : "",
      )}
    >
      {block.text}
    </p>
  );
}

export default function EditorialEssayLayout({
  eyebrow,
  title,
  readTime,
  tags,
  introParagraphs,
  sections,
  articleLabel = "Essay",
  ctaDescription = "The essays are here to make the operating model visible, not to pad the portfolio. Happy to go deeper in a conversation.",
  afterHero,
}: EditorialEssayLayoutProps): JSX.Element {
  return (
    <>
      <section className="relative overflow-hidden rounded-[2.4rem] border border-black/6 bg-white/86 px-6 py-9 shadow-[0_30px_80px_rgba(58,61,64,0.1)] md:px-10 md:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(44,79,82,0.05),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(209,122,95,0.045),_transparent_36%)]"
        />
        <div className="relative max-w-[50rem] space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--color-teal)]/70">
              {eyebrow}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-teal)]/62">
              <span>{readTime}</span>
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-[color:var(--color-orange)]"
              />
              <span>{articleLabel}</span>
            </div>
            <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-6xl">
              {title}
            </h1>
          </div>

          <div className="space-y-5">
            {introParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-7 text-[color:var(--color-slate)]/74 md:text-lg md:leading-8"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded-full border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/92 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/74"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {afterHero}

      <div className="space-y-14 md:space-y-16">
        {sections.map((section, index) => (
          <MotionReveal
            key={section.title}
            delay={Math.min(index * 0.04, 0.24)}
          >
            <article
              className={clsx(
                section.tone === "closing"
                  ? "rounded-[2.2rem] border border-[color:var(--color-teal)]/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.86),rgba(242,227,213,0.76))] px-6 py-8 shadow-[0_24px_60px_rgba(58,61,64,0.08)] md:px-8 md:py-10"
                  : "border-t border-black/7 pt-10 md:pt-14",
              )}
            >
              <div className="mx-auto max-w-[46rem] space-y-5">
                <h2 className="text-balance text-3xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-5xl">
                  {section.title}
                </h2>
                {section.blocks.map((block) =>
                  block.type === "paragraph" ? (
                    <div key={block.text}>{renderBlock(block)}</div>
                  ) : (
                    <div key={block.items.join("|")}>{renderBlock(block)}</div>
                  ),
                )}
              </div>

              {section.artifact ? (
                <div className="mt-10 md:mt-12">
                  <EssayEvidenceFigure
                    eyebrow={section.artifact.eyebrow}
                    caption={section.artifact.caption}
                    src={section.artifact.src}
                    alt={section.artifact.alt}
                    width={section.artifact.width}
                    aspectClassName={section.artifact.aspectClassName}
                    imageClassName={section.artifact.imageClassName}
                    priority={section.artifact.priority}
                  />
                </div>
              ) : null}
            </article>
          </MotionReveal>
        ))}
      </div>

      <CTASection
        title="If this point of view feels aligned, let's talk."
        description={ctaDescription}
        primaryAction={{
          href: "https://www.linkedin.com/in/daniel-a-nash/",
          label: "Connect on LinkedIn",
          external: true,
        }}
        secondaryAction={{
          href: "/work",
          label: "See the work",
        }}
      />
    </>
  );
}
