import CaseCard from "@/components/CaseCard";
import { featuredWork } from "@/data/featuredWork";

const FeaturedWork = (): JSX.Element => {
  return (
    <section className="container space-y-8">
      <header className="space-y-2 text-left sm:text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C4F52]/70">
          Case Studies
        </p>
        <h2 className="text-3xl font-semibold text-[#2C4F52] sm:text-4xl">
          Case studies that blend AI, design, and experimentation
        </h2>
        <p className="text-sm text-[#3A3D40]/80">
          A sampling of product, experimentation, and music-tech launches that
          blended strategy, craft, and measurable impact.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredWork.map((item) => (
          <CaseCard
            key={item.slug}
            title={item.title}
            description={item.description}
            href={item.href}
            tags={item.tags}
            status={item.status}
            media={item.media}
            chips={item.chips}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedWork;
