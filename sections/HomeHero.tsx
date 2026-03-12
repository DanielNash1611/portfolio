import Hero from "@/components/Hero";

const HomeHero = (): JSX.Element => {
  return (
    <section className="container pt-6 pb-4">
      <Hero
        kicker="Senior Product Manager"
        title="Senior Product Manager building AI-enabled products, platforms, and customer experiences."
        subtitle="I lead end-to-end product work across commerce, contact center, service operations, platforms, and AI strategy, turning ambiguity into clear roadmaps, measurable outcomes, and shipped products through strong cross-functional execution."
        impactLine="Selected proof: ~$16M checkout impact, ~$2.7M AI pilot lift, and ~1,000 licensed users / ~800 DAU."
        primaryCta={{
          href: "/work",
          label: "Explore Work",
        }}
        secondaryCta={{
          href: "/resume",
          label: "View Resumes",
          variant: "ghost",
        }}
      />
    </section>
  );
};

export default HomeHero;
