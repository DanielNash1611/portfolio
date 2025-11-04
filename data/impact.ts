export type UnifiedImpactMetric = {
  id: string;
  category: string;
  value: string; // e.g., "$18M+/yr", "~67 FTE", "+3% conversion", "Enterprise-wide"
  support: string; // short line
  intent: "revenue" | "efficiency" | "cx" | "org";
};

export const UNIFIED_IMPACT_METRICS: UnifiedImpactMetric[] = [
  {
    id: "rev",
    category: "Business Impact",
    value: "$18M+/yr",
    support: "From AI pilot lift (+$2.7M) and digital conversion (~$16M)",
    intent: "revenue",
  },
  {
    id: "ops",
    category: "Operational Efficiency",
    value: "~67 FTE",
    support: "Through scaled AI adoption and process automation",
    intent: "efficiency",
  },
  {
    id: "cx",
    category: "Customer Experience",
    value: "+3% conversion, 50% faster checkout",
    support: "Derived from experimentation, A/B testing, and UX advocacy",
    intent: "cx",
  },
  {
    id: "org",
    category: "Organizational Reach",
    value: "Enterprise-wide enablement",
    support: "Leading AI rollout, PM framework adoption, and C-suite alignment",
    intent: "org",
  },
];
