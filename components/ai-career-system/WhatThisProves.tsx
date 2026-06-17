export default function WhatThisProves(): JSX.Element {
  return (
    <section
      className="rounded-[2rem] border border-white/8 bg-[color:var(--color-slate)] px-6 py-8 text-[color:var(--color-cream)] shadow-[0_26px_70px_rgba(58,61,64,0.16)] md:px-8 md:py-10"
      aria-labelledby="what-this-proves-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-tan)]">
        Transferable AI product judgment
      </p>
      <h2
        id="what-this-proves-heading"
        className="mt-3 max-w-[18ch] text-balance text-3xl font-semibold tracking-tight md:text-4xl"
      >
        What this proves
      </h2>
      <p className="mt-5 max-w-4xl text-pretty text-lg leading-8 text-[color:var(--color-cream)]/82">
        This system shows Daniel can design AI products where models are useful
        but constrained: retrieval is source-aware, claims are bounded, unsafe
        gaps are surfaced instead of hidden, outputs are reviewed, and quality
        is measured through evals before being represented publicly.
      </p>
    </section>
  );
}
