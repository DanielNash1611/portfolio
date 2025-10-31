import { motion, useReducedMotion } from "framer-motion";

const NarrativeBridge = (): JSX.Element => {
  const prefersReducedMotion = useReducedMotion();

  const content = (
    <div className="relative overflow-hidden rounded-3xl border border-[#2C4F52]/15 bg-gradient-to-r from-[#F2E3D5] via-white to-[#DBBF96]/60 p-10 text-center shadow-md">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(44,79,82,0.08),_transparent_55%)]" aria-hidden="true" />
      <div className="relative space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2C4F52]/70">
          Craft + impact
        </p>
        <h2 className="text-3xl font-semibold text-[#2C4F52] sm:text-4xl">
          Where craft meets impact
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-[#3A3D40]/85">
          I blend data-driven experimentation with human creativity - optimizing checkout for millions and composing music that responds to emotion.
        </p>
      </div>
    </div>
  );

  if (prefersReducedMotion) {
    return <section className="container py-10">{content}</section>;
  }

  return (
    <motion.section
      className="container py-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {content}
    </motion.section>
  );
};

export default NarrativeBridge;
