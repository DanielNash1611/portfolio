import Hero from "@/components/Hero";

const HomeHero = (): JSX.Element => {
  return (
    <section className="container pt-6 pb-4">
      <Hero
        title="Building the Future of Creative AI — Product Leader & Composer"
        subtitle="I lead teams to design and build AI-powered products that empower creators and transform user experiences."
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
