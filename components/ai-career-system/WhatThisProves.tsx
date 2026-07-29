import Container from "@/components/site/Container";
import MotionReveal from "@/components/site/MotionReveal";

export default function WhatThisProves(): JSX.Element {
  return (
    <section
      className="border-y border-white/12 bg-[#173f3d] text-[color:var(--color-cream)]"
      aria-labelledby="what-this-proves-heading"
    >
      <Container className="py-16 md:py-24">
        <MotionReveal className="grid gap-8 lg:grid-cols-[minmax(240px,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[color:var(--color-tan)]">
              Transferable AI product judgment
            </p>
            <h2
              id="what-this-proves-heading"
              className="mt-5 max-w-[9ch] text-balance font-serif text-4xl font-medium leading-[0.94] tracking-[-0.045em] md:text-6xl"
            >
              What this proves
            </h2>
          </div>
          <p className="max-w-4xl self-end text-pretty font-serif text-2xl font-medium leading-9 tracking-[-0.02em] text-[color:var(--color-cream)]/86 md:text-3xl md:leading-10">
            This system shows Daniel can design AI products where models are
            useful but constrained: retrieval is source-aware, claims are
            bounded, unsafe gaps are surfaced instead of hidden, outputs are
            reviewed, and quality is measured through evals before being
            represented publicly.
          </p>
        </MotionReveal>
      </Container>
    </section>
  );
}
