import ContentSection from "@/components/site/ContentSection";

type ComparisonRowProps = {
  label: string;
  before?: string;
  after: string;
  beforePrefix?: string;
};

type EvidenceCardProps = {
  title: string;
  speedLabel?: string;
  interpretation: string;
  rows: ComparisonRowProps[];
  tone?: "default" | "nuanced";
};

const resultsCards: EvidenceCardProps[] = [
  {
    title: "Full checkout flow",
    speedLabel: "32% faster",
    interpretation: "Faster overall flow with stronger perceived usability",
    rows: [
      { label: "Time", before: "3:00", after: "2:03" },
      { label: "Difficulty", before: "3.8", after: "5.0" },
      { label: "Success", before: "6/6", after: "6/6" },
    ],
  },
  {
    title: "Entering a discount code",
    speedLabel: "37% faster",
    interpretation: "Eliminated a previous failure point",
    rows: [
      { label: "Time", before: "0:46", after: "0:29" },
      { label: "Difficulty", before: "3.8", after: "4.6" },
      { label: "Success", before: "5/6", after: "6/6" },
    ],
  },
  {
    title: "Changing item quantity",
    speedLabel: "Slower, but clearer",
    interpretation: "More deliberate interaction, higher clarity",
    tone: "nuanced",
    rows: [
      { label: "Time", before: "0:57", after: "1:10" },
      { label: "Difficulty", before: "3.5", after: "5.0" },
      { label: "Success", before: "6/6", after: "6/6" },
    ],
  },
  {
    title: "Changing shipping method/location",
    interpretation: "Higher confidence with fewer user errors",
    rows: [
      { label: "Difficulty", before: "3.6", after: "5.0" },
      {
        label: "Success",
        after: "6/6",
        beforePrefix: "Improved to",
      },
    ],
  },
];

const quotes = [
  "Very easy to use",
  "Everything I needed was right there",
  "Not confusing at all",
];

function ComparisonRow({
  label,
  before,
  after,
  beforePrefix,
}: ComparisonRowProps): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[1rem] border border-black/6 bg-[color:var(--color-background)]/78 px-3 py-3">
      <span className="text-sm font-medium text-[color:var(--color-slate)]/78">
        {label}
      </span>
      <div className="flex min-w-0 items-center gap-2 text-sm">
        {before ? (
          <>
            <span className="rounded-full bg-black/4 px-2.5 py-1 font-medium text-[color:var(--color-slate)]/56">
              {before}
            </span>
            <span
              aria-hidden="true"
              className="text-[color:var(--color-teal)]/28"
            >
              →
            </span>
          </>
        ) : beforePrefix ? (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/48">
            {beforePrefix}
          </span>
        ) : null}
        <span className="rounded-full bg-[color:var(--color-teal)]/10 px-2.5 py-1 font-semibold text-[color:var(--color-teal)]">
          {after}
        </span>
      </div>
    </div>
  );
}

function EvidenceCard({
  title,
  speedLabel,
  interpretation,
  rows,
  tone = "default",
}: EvidenceCardProps): JSX.Element {
  const toneClasses =
    tone === "nuanced"
      ? {
          pill: "border-[color:var(--color-orange)]/14 bg-[color:var(--color-orange)]/10 text-[color:var(--color-slate)]/74",
          footer:
            "border-[color:var(--color-orange)]/10 bg-[color:var(--color-orange)]/7 text-[color:var(--color-slate)]/70",
        }
      : {
          pill: "border-[color:var(--color-teal)]/12 bg-[color:var(--color-teal)]/8 text-[color:var(--color-teal)]/78",
          footer:
            "border-[color:var(--color-teal)]/10 bg-[color:var(--color-teal)]/6 text-[color:var(--color-slate)]/70",
        };

  return (
    <article className="flex h-full flex-col rounded-[1.55rem] border border-black/6 bg-white/90 p-5 shadow-[0_22px_55px_rgba(58,61,64,0.08)]">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <h3 className="max-w-[18ch] text-xl font-semibold tracking-tight text-[color:var(--color-slate)]">
          {title}
        </h3>
        {speedLabel ? (
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${toneClasses.pill}`}
          >
            {speedLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3">
        {rows.map((row) => (
          <ComparisonRow
            key={`${title}-${row.label}`}
            label={row.label}
            before={row.before}
            after={row.after}
            beforePrefix={row.beforePrefix}
          />
        ))}
      </div>

      <div
        className={`mt-5 rounded-[1.1rem] border px-4 py-4 text-sm leading-6 ${toneClasses.footer}`}
      >
        {interpretation}
      </div>
    </article>
  );
}

function QuotePanel(): JSX.Element {
  return (
    <aside className="h-full rounded-[1.65rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/88 px-5 py-6 shadow-[0_20px_52px_rgba(58,61,64,0.06)] md:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-teal)]/62">
        Supporting evidence
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
        What users said
      </h3>

      <div className="mt-5 space-y-3">
        {quotes.map((quote) => (
          <blockquote
            key={quote}
            className="rounded-[1.1rem] border border-white/40 bg-white/82 px-4 py-4 text-base leading-7 text-[color:var(--color-slate)]/74 shadow-[0_12px_32px_rgba(58,61,64,0.04)]"
          >
            “{quote}”
          </blockquote>
        ))}
      </div>

      <p className="mt-5 rounded-[1.15rem] border border-[color:var(--color-orange)]/12 bg-[color:var(--color-orange)]/8 px-4 py-4 text-sm leading-6 text-[color:var(--color-slate)]/72">
        Post-launch A/B testing later validated measurable conversion lift.
      </p>
    </aside>
  );
}

export default function UsabilityResultsBlock(): JSX.Element {
  return (
    <ContentSection
      title="Usability Results: Before vs After"
      description="Follow-up usability testing validated the redesigned experience across real checkout tasks."
      tone="muted"
    >
      <div className="rounded-[1.4rem] border border-[color:var(--color-teal)]/12 bg-white/86 px-5 py-5 shadow-[0_16px_40px_rgba(58,61,64,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-teal)]/62">
          Key takeaway
        </p>
        <p className="mt-3 max-w-4xl text-base leading-7 text-[color:var(--color-slate)]/72 md:text-lg">
          The redesign improved perceived usability across every featured task,
          eliminated failure on discount-code entry, and reduced full checkout
          time from 3:00 to 2:03.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_320px]">
        <div className="grid gap-4 md:grid-cols-2">
          {resultsCards.map((card) => (
            <EvidenceCard
              key={card.title}
              title={card.title}
              speedLabel={card.speedLabel}
              interpretation={card.interpretation}
              rows={card.rows}
              tone={card.tone}
            />
          ))}
        </div>

        <QuotePanel />
      </div>
    </ContentSection>
  );
}
