import ContentSection from "@/components/site/ContentSection";
import MediaFrame from "@/components/site/MediaFrame";

const gridCaption =
  "This is a single week in the campaign. Each piece of content is intentionally designed with narrative context, platform fit, and clear calls to action.";

const cardCaption =
  "Each output is structured - combining storytelling, execution guidance, and engagement strategy in one place.";

const calloutParagraphs = [
  "Most AI tools generate content.",
  "LaunchMuse generates a cohesive story.",
  "Instead of isolated posts, artists get a connected narrative that builds engagement before, during, and after a release.",
];

export default function ExampleCampaignOutputSection(): JSX.Element {
  return (
    <ContentSection
      title="Example campaign output"
      description="LaunchMuse generates structured, story-driven content across a full campaign timeline."
    >
      <div className="space-y-8 md:space-y-10">
        <figure className="space-y-4 md:space-y-5">
          <MediaFrame
            src="/images/launchmuse/week-2-grid.png"
            alt="LaunchMuse campaign week showing structured content plan"
            sizes="(min-width: 1280px) 860px, (min-width: 768px) 72vw, 100vw"
            className="group aspect-[1966/1542] rounded-[1.6rem] border border-black/6 bg-[color:var(--color-background)]/86 shadow-[0_20px_48px_rgba(58,61,64,0.08)]"
            imageClassName="object-contain bg-[color:var(--color-background)]/86 p-2 transition-transform duration-500 group-hover:scale-[1.02] md:p-4"
            expandable
            expandLabel="Expand LaunchMuse campaign week screenshot"
          />
          <figcaption className="max-w-3xl text-sm leading-6 text-[color:var(--color-slate)]/68 md:text-base md:leading-7">
            {gridCaption}
          </figcaption>
        </figure>

        <div className="max-w-[38rem]">
          <figure className="space-y-4 md:space-y-5">
            <MediaFrame
              src="/images/launchmuse/tuning-systems-card.png"
              alt="LaunchMuse content card showing storytelling and visual direction"
              sizes="(min-width: 1280px) 520px, (min-width: 768px) 60vw, 100vw"
              className="group aspect-[610/736] rounded-[1.6rem] border border-black/6 bg-white shadow-[0_20px_48px_rgba(58,61,64,0.08)]"
              imageClassName="object-contain bg-white transition-transform duration-500 group-hover:scale-[1.02]"
              expandable
              expandLabel="Expand LaunchMuse campaign content card"
            />
            <figcaption className="max-w-2xl text-sm leading-6 text-[color:var(--color-slate)]/68 md:text-base md:leading-7">
              {cardCaption}
            </figcaption>
          </figure>
        </div>

        <aside className="rounded-[1.5rem] border border-[color:var(--color-teal)]/10 border-l-4 border-l-[color:var(--color-teal)] bg-[color:var(--color-background)]/92 px-5 py-5 shadow-[0_16px_36px_rgba(44,79,82,0.06)] md:px-6 md:py-6">
          <div className="max-w-3xl space-y-3">
            {calloutParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-7 text-[color:var(--color-slate)]/76"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </ContentSection>
  );
}
