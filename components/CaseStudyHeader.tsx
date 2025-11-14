import Badge from "@/components/Badge";

interface CaseStudyHeaderProps {
  title: string;
  subtitle: string;
  kpis?: { label: string; value: string; description?: string }[];
  tags?: string[];
}

const CaseStudyHeader = ({
  title,
  subtitle,
  kpis,
  tags
}: CaseStudyHeaderProps): JSX.Element => {
  const displayTags =
    tags && tags.length > 0
      ? tags
      : ["Product Leadership", "AI Strategy", "Rapid Prototyping", "Experimentation"];

  return (
    <header className="space-y-6 rounded-3xl border border-brand-slate/15 bg-white/80 p-10 shadow-soft">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-teal/70">
          Case Study
        </p>
        <h1 className="text-4xl font-semibold text-brand-teal md:text-5xl">
          {title}
        </h1>
        <p className="text-lg leading-relaxed text-brand-slate/80">{subtitle}</p>
      </div>
      {kpis && kpis.length > 0 ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="flex flex-col gap-1 rounded-2xl border border-brand-teal/10 bg-brand-teal/5 p-5"
            >
              <dt className="text-sm uppercase tracking-[0.25em] text-brand-teal/80">
                {kpi.label}
              </dt>
              <dd className="text-2xl font-semibold text-brand-teal">
                {kpi.value}
              </dd>
              {kpi.description ? (
                <p className="text-xs text-brand-slate/70">{kpi.description}</p>
              ) : null}
            </div>
          ))}
        </dl>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </header>
  );
};

export default CaseStudyHeader;
