import Hero from "@/components/Hero";

const HomeHero = (): JSX.Element => {
  return (
    <section className="container pt-6 pb-4">
      <Hero
        title="Bridging Creativity & Strategy - Senior AI Product Manager & Composer"
        subtitle="I design AI-powered products and high-performing user journeys that convert."
        primaryCta={{
          href: "/work",
          label: "Explore Case Studies"
        }}
        secondaryCta={{
          href: "/music",
          label: "Listen to My Music",
          variant: "ghost"
        }}
      />
    </section>
  );
};

export default HomeHero;
