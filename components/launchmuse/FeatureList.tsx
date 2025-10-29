interface Feature {
  title: string;
  description: string;
}

interface FeatureListProps {
  features: Feature[];
}

const FeatureList = ({ features }: FeatureListProps): JSX.Element => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {features.map((feature) => (
        <article
          key={feature.title}
          className="flex h-full flex-col gap-3 rounded-3xl border border-brand-slate/10 bg-brand-cream/70 p-6 shadow-soft"
        >
          <h3 className="text-xl font-semibold text-brand-teal">
            {feature.title}
          </h3>
          <p className="text-sm text-brand-slate/80">{feature.description}</p>
        </article>
      ))}
    </div>
  );
};

export default FeatureList;
