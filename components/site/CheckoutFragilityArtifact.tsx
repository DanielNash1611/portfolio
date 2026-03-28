"use client";

import { useId, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const fragilityNodes = [
  {
    title: "Product types",
    detail:
      "Different products triggered different checkout rules and edge cases.",
  },
  {
    title: "Delivery type",
    detail:
      "Fulfillment choice changed what fields, steps, and options appeared.",
  },
  {
    title: "Sale types",
    detail: "Promotions and sale conditions changed how the journey behaved.",
  },
  {
    title: "Stocking status",
    detail: "Availability changed what combinations were valid in the flow.",
  },
  {
    title: "Guest or signed in",
    detail: "Customer state changed saved information, defaults, and friction.",
  },
  {
    title: "Payment options",
    detail: "Tender choice affected validation, sequencing, and fallbacks.",
  },
  {
    title: "Saved payments",
    detail: "Stored payment methods changed the interaction path mid-flow.",
  },
  {
    title: "Saved addresses",
    detail: "Known addresses changed what users needed to enter or confirm.",
  },
  {
    title: "Location",
    detail: "Geography influenced availability, taxes, and eligible paths.",
  },
  {
    title: "Quantity",
    detail: "Cart quantity could change what combinations were allowed.",
  },
];

const mobileGroups = [
  {
    title: "Cart and product state",
    items: ["Product types", "Sale types", "Stocking status", "Quantity"],
  },
  {
    title: "Fulfillment and location",
    items: ["Delivery type", "Location"],
  },
  {
    title: "Customer state",
    items: ["Guest or signed in", "Saved addresses"],
  },
  {
    title: "Payment state",
    items: ["Payment options", "Saved payments"],
  },
];

function ScenarioNode({
  title,
  detail,
}: {
  title: string;
  detail: string;
}): JSX.Element {
  return (
    <article className="rounded-[1.25rem] border border-[color:var(--color-teal)]/10 bg-white/86 px-4 py-4 shadow-[0_14px_36px_rgba(58,61,64,0.06)]">
      <p className="text-sm font-semibold text-[color:var(--color-slate)]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--color-slate)]/64">
        {detail}
      </p>
    </article>
  );
}

function MobileGroup({
  title,
  items,
}: {
  title: string;
  items: string[];
}): JSX.Element {
  return (
    <article className="rounded-[1.25rem] border border-[color:var(--color-teal)]/10 bg-white/88 px-4 py-4 shadow-[0_14px_36px_rgba(58,61,64,0.06)]">
      <p className="text-sm font-semibold text-[color:var(--color-slate)]">
        {title}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex rounded-full border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/88 px-3 py-1 text-xs font-medium text-[color:var(--color-slate)]/68"
          >
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

function CenterCard({
  isExpanded,
  panelId,
  onToggle,
}: {
  isExpanded: boolean;
  panelId: string;
  onToggle: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      aria-expanded={isExpanded}
      aria-controls={panelId}
      onClick={onToggle}
      className="relative w-full overflow-hidden rounded-[1.6rem] border border-[color:var(--color-teal)]/12 bg-white/92 px-5 py-6 text-center shadow-[0_18px_48px_rgba(58,61,64,0.08)] transition hover:-translate-y-[1px] hover:shadow-[0_22px_56px_rgba(58,61,64,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-orange)]/35 to-transparent"
      />
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-teal)]/62">
        High-variation paths across checkout
      </p>
      <h4 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--color-slate)]">
        One redesign had to hold up across many real customer journeys
      </h4>
      <p className="mt-3 text-sm leading-6 text-[color:var(--color-slate)]/66">
        Each variable changed what the customer could do next, what the system
        had to validate, and what could go wrong at launch.
      </p>
        <div className="mt-5 rounded-[1.1rem] border border-[color:var(--color-orange)]/12 bg-[color:var(--color-orange)]/8 px-4 py-4 text-left text-sm leading-6 text-[color:var(--color-slate)]/72">
          I mapped roughly 400 billion theoretical combinations, then
          translated that complexity into a focused 20-30 scenario QA plan
          covering the highest-risk paths before launch.
        </div>
      <div className="mt-5 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-teal)]/14 bg-[color:var(--color-background)] px-4 py-2 text-sm font-semibold text-[color:var(--color-teal)]">
          {isExpanded ? (
            <>
              Hide variables
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            <>
              Show variables
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </span>
      </div>
    </button>
  );
}

export default function CheckoutFragilityArtifact(): JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = useId();
  const leftNodes = fragilityNodes.slice(0, 5);
  const rightNodes = fragilityNodes.slice(5);

  const nodeTransition = (delay: number) => ({
    duration: 0.42,
    ease: "easeOut",
    delay,
  });

  return (
    <div className="mt-7 space-y-5 rounded-[1.8rem] border border-[color:var(--color-teal)]/10 bg-[color:var(--color-background)]/76 px-5 py-6 shadow-[0_18px_48px_rgba(58,61,64,0.07)] md:px-6 md:py-7">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--color-teal)]/62">
          Supporting artifact
        </p>
        <h3 className="text-balance text-2xl font-semibold tracking-tight text-[color:var(--color-slate)] md:text-[2rem]">
          Why checkout was so fragile
        </h3>
        <p className="text-base leading-7 text-[color:var(--color-slate)]/68">
          Checkout behavior changed based on product types, delivery options,
          sale conditions, payment methods, saved information, customer state,
          and more. The redesign had to simplify the experience without breaking
          the flexibility required for real customer journeys.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="rounded-full border border-[color:var(--color-orange)]/12 bg-[color:var(--color-orange)]/8 px-4 py-2 text-sm font-medium text-[color:var(--color-slate)]/70">
          Many combinations, one critical revenue path
        </div>
        <div className="rounded-full border border-[color:var(--color-teal)]/12 bg-white/78 px-4 py-2 text-sm font-medium text-[color:var(--color-slate)]/70">
          Roughly 400 billion theoretical combinations across key checkout
          variables
        </div>
      </div>

      <div className="hidden xl:grid xl:grid-cols-[minmax(0,1fr)_320px_minmax(0,1fr)] xl:items-center xl:gap-4">
        <div className="grid min-h-[520px] gap-3">
          {leftNodes.map((node, index) => (
            <motion.div
              key={node.title}
              initial={shouldReduceMotion ? false : false}
              animate={
                shouldReduceMotion
                  ? undefined
                  : isExpanded
                    ? {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        filter: "blur(0px)",
                      }
                    : {
                        opacity: 0,
                        x: 44,
                        scale: 0.96,
                        filter: "blur(4px)",
                      }
              }
              transition={nodeTransition(0.08 + index * 0.045)}
              className={!isExpanded ? "pointer-events-none" : ""}
            >
              <ScenarioNode title={node.title} detail={node.detail} />
            </motion.div>
          ))}
        </div>

        <div className="relative">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-[-42%] right-[-42%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[color:var(--color-teal)]/18 to-transparent"
            initial={shouldReduceMotion ? false : false}
            animate={
              shouldReduceMotion
                ? undefined
                : isExpanded
                  ? { opacity: 1, scaleX: 1 }
                  : { opacity: 0, scaleX: 0.7 }
            }
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
          />

          <motion.div
            initial={
              shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }
            }
            whileInView={
              shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
            }
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <CenterCard
              isExpanded={isExpanded}
              panelId={panelId}
              onToggle={() => setIsExpanded((value) => !value)}
            />
          </motion.div>
        </div>

        <div className="grid min-h-[520px] gap-3">
          {rightNodes.map((node, index) => (
            <motion.div
              key={node.title}
              initial={shouldReduceMotion ? false : false}
              animate={
                shouldReduceMotion
                  ? undefined
                  : isExpanded
                    ? {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        filter: "blur(0px)",
                      }
                    : {
                        opacity: 0,
                        x: -44,
                        scale: 0.96,
                        filter: "blur(4px)",
                      }
              }
              transition={nodeTransition(0.08 + index * 0.045)}
              className={!isExpanded ? "pointer-events-none" : ""}
            >
              <ScenarioNode title={node.title} detail={node.detail} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-4 xl:hidden">
        <motion.div
          initial={
            shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }
          }
          whileInView={
            shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
          }
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <CenterCard
            isExpanded={isExpanded}
            panelId={panelId}
            onToggle={() => setIsExpanded((value) => !value)}
          />
        </motion.div>

        <motion.div
          id={panelId}
          initial={false}
          animate={
            isExpanded
              ? { height: "auto", opacity: 1 }
              : { height: 0, opacity: 0 }
          }
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="space-y-4 pt-1">
            <motion.div
              aria-hidden="true"
              className="mx-auto h-8 w-px bg-gradient-to-b from-[color:var(--color-teal)]/28 via-[color:var(--color-teal)]/12 to-transparent"
              initial={shouldReduceMotion ? false : false}
              animate={
                shouldReduceMotion
                  ? undefined
                  : isExpanded
                    ? { opacity: 1, scaleY: 1 }
                    : { opacity: 0, scaleY: 0.4 }
              }
              transition={{ duration: 0.3, ease: "easeOut" }}
            />

            <div className="grid gap-3">
              {mobileGroups.map((group, index) => (
                <motion.div
                  key={group.title}
                  initial={shouldReduceMotion ? false : false}
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : isExpanded
                        ? { opacity: 1, y: 0, scale: 1 }
                        : { opacity: 0, y: 14, scale: 0.98 }
                  }
                  transition={nodeTransition(0.06 + index * 0.05)}
                >
                  <MobileGroup title={group.title} items={group.items} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
