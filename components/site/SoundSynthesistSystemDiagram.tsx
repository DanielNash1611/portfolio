import type { ReactNode } from "react";

const touchpoints = [
  {
    title: "Ecommerce experience",
    detail:
      "Customers can discover gear recommendations inside the digital shopping journey.",
  },
  {
    title: "In-store experience",
    detail:
      "Store teams can guide customers with a shared recommendation experience.",
  },
  {
    title: "Contact center workflow",
    detail: "AI available to agents\nConversation context stored in Salesforce",
  },
];

const outputs = [
  "Gear recommendations",
  "Setup techniques",
  "Known gear when available",
];

function DiagramCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <article
      className={`rounded-[1.55rem] border border-[color:var(--color-teal)]/10 bg-white/92 px-5 py-5 shadow-[0_12px_28px_rgba(58,61,64,0.05)] ${className ?? ""}`}
    >
      {children}
    </article>
  );
}

export default function SoundSynthesistSystemDiagram(): JSX.Element {
  return (
    <section className="rounded-[1.75rem] border border-[color:var(--color-teal)]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(247,245,242,0.95))] px-5 py-6 shadow-[0_24px_60px_rgba(58,61,64,0.08)] md:px-7 md:py-7">
      <div className="space-y-6">
        <div className="space-y-5 lg:hidden">
          <DiagramCard className="min-h-[160px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-teal)]/62">
              01
            </p>
            <p className="mt-4 text-lg font-semibold leading-7 text-[color:var(--color-slate)]">
              I want to recreate the sound of [song, artist, or genre]. What do
              I need?
            </p>
          </DiagramCard>

          <ConnectorLabel>shared engine</ConnectorLabel>

          <DiagramCard className="min-h-[170px] border-[color:var(--color-teal)]/14 bg-[color:var(--color-background)]/94 shadow-[0_18px_40px_rgba(44,79,82,0.08)]">
            <div className="flex h-full min-h-[138px] flex-col items-center justify-center text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-teal)]/62">
                02
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
                Sound Synthesist GPT
              </h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/66">
                Underlying recommendation engine
              </p>
            </div>
          </DiagramCard>

          <ConnectorLabel>powers</ConnectorLabel>

          <div className="relative space-y-4 border-l border-[color:var(--color-teal)]/10 pl-4">
            {touchpoints.map((touchpoint, index) => (
              <DiagramCard key={touchpoint.title} className="relative">
                <div className="absolute -left-[1.1rem] top-6 h-2.5 w-2.5 rounded-full border border-[color:var(--color-teal)]/18 bg-[color:var(--color-background)]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/62">
                  0{index + 1}
                </p>
                <h4 className="mt-3 text-lg font-semibold text-[color:var(--color-slate)]">
                  {touchpoint.title}
                </h4>
                <div className="mt-3 space-y-2 text-sm leading-6 text-[color:var(--color-slate)]/68">
                  {touchpoint.detail.split("\n").map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </DiagramCard>
            ))}
          </div>

          <ConnectorLabel>outputs</ConnectorLabel>

          <DiagramCard>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-teal)]/62">
              03
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[color:var(--color-slate)]/74">
              {outputs.map((item) => (
                <li
                  key={item}
                  className="rounded-[1rem] bg-[color:var(--color-background)]/92 px-4 py-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          </DiagramCard>
        </div>

        <div className="hidden lg:block">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_28px_minmax(0,1.15fr)_28px_minmax(0,0.95fr)] lg:items-stretch">
            <DiagramCard className="flex min-h-[170px] items-center">
              <p className="text-lg font-semibold leading-7 text-[color:var(--color-slate)]">
                I want to recreate the sound of [song, artist, or genre]. What
                do I need?
              </p>
            </DiagramCard>

            <ArrowBridge />

            <DiagramCard className="flex min-h-[170px] items-center justify-center border-[color:var(--color-teal)]/14 bg-[color:var(--color-background)]/94 shadow-[0_18px_40px_rgba(44,79,82,0.08)]">
              <div className="max-w-[19rem] text-center">
                <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
                  Sound Synthesist GPT
                </h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/66">
                  Underlying recommendation engine
                </p>
              </div>
            </DiagramCard>

            <ArrowBridge />

            <DiagramCard className="flex min-h-[170px] items-center">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-teal)]/62">
                  Outputs
                </p>
                <ul className="space-y-3 text-sm leading-6 text-[color:var(--color-slate)]/74">
                  {outputs.map((item) => (
                    <li
                      key={item}
                      className="rounded-[1rem] bg-[color:var(--color-background)]/92 px-4 py-3"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </DiagramCard>
          </div>

          <div className="relative py-5">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[color:var(--color-teal)]/12" />
            <div className="flex justify-center">
              <span className="rounded-full border border-[color:var(--color-teal)]/10 bg-white/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/72 shadow-[0_6px_16px_rgba(58,61,64,0.04)]">
                powers
              </span>
            </div>

            <div className="relative mt-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 1000 96"
                preserveAspectRatio="none"
                className="block h-16 w-full"
              >
                <path
                  d="M500 0 V18 M500 18 H170 M500 18 H830 M170 18 V64 M500 18 V64 M830 18 V64"
                  fill="none"
                  stroke="rgba(44,79,82,0.18)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="170" cy="18" r="3.5" fill="rgba(44,79,82,0.22)" />
                <circle cx="500" cy="18" r="3.75" fill="rgba(44,79,82,0.22)" />
                <circle cx="830" cy="18" r="3.5" fill="rgba(44,79,82,0.22)" />
              </svg>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {touchpoints.map((touchpoint, index) => (
              <DiagramCard key={touchpoint.title} className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-[color:var(--color-teal)]/12 bg-[color:var(--color-background)]/88 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/78 shadow-[0_6px_16px_rgba(58,61,64,0.04)]">
                    0{index + 1}
                  </span>
                  <span className="h-px flex-1 bg-[color:var(--color-teal)]/10" />
                </div>
                <h4 className="text-lg font-semibold text-[color:var(--color-slate)]">
                  {touchpoint.title}
                </h4>
                <div className="mt-3 space-y-2 text-sm leading-6 text-[color:var(--color-slate)]/68">
                  {touchpoint.detail.split("\n").map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </DiagramCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ConnectorLabel({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="flex items-center gap-3 px-1">
      <span className="h-px flex-1 bg-[color:var(--color-teal)]/12" />
      <span className="rounded-full border border-[color:var(--color-teal)]/10 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-teal)]/72 shadow-[0_6px_16px_rgba(58,61,64,0.04)]">
        {children}
      </span>
      <span className="h-px flex-1 bg-[color:var(--color-teal)]/12" />
    </div>
  );
}

function ArrowBridge(): JSX.Element {
  return (
    <div className="flex items-center justify-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 32 16"
        className="h-4 w-8 text-[color:var(--color-teal)]/24"
      >
        <path
          d="M1 8 H27"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M22 3 L27 8 L22 13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
