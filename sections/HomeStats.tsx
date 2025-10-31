import Stats from "@/components/Stats";

const HomeStats = (): JSX.Element => {
  return (
    <section className="container">
      <header className="mb-6 space-y-2 text-left sm:text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2C4F52]/70">
          Proven outcomes
        </p>
        <h2 className="text-3xl font-semibold text-[#2C4F52] sm:text-4xl">
          Real metrics from shipped experiences
        </h2>
        <p className="text-sm text-[#3A3D40]/80">
          Results from experimentation, AI-driven enhancements, and cross-team delivery.
        </p>
      </header>
      <Stats />
    </section>
  );
};

export default HomeStats;
