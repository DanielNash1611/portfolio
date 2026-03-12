import { APPROVED_METRICS } from "@/data/positioning";

export type UnifiedImpactMetric = {
  id: string;
  category: string;
  value: string;
  support: string;
  intent: "revenue" | "efficiency" | "cx" | "org";
};

const metricById = (id: string) =>
  APPROVED_METRICS.find((metric) => metric.id === id);

const checkoutImpact = metricById("checkout-impact");
const checkoutSpeed = metricById("checkout-speed");
const returnsHours = metricById("returns-hours");
const contactCenterPilot = metricById("contact-center-pilot");
const chatgptRollout = metricById("chatgpt-rollout");

export const UNIFIED_IMPACT_METRICS: UnifiedImpactMetric[] = [
  {
    id: checkoutImpact?.id ?? "checkout-impact",
    category: "Commerce impact",
    value: checkoutImpact?.value ?? "~$16M annualized impact",
    support:
      checkoutImpact?.detail ??
      "Driven by a ~3.5% conversion lift and 50% faster checkout in a redesigned ecommerce flow.",
    intent: "revenue",
  },
  {
    id: checkoutSpeed?.id ?? "checkout-speed",
    category: "Customer experience",
    value: checkoutSpeed?.value ?? "50% faster",
    support:
      checkoutSpeed?.detail ??
      "Reduced friction across the checkout experience while improving completion speed and clarity.",
    intent: "cx",
  },
  {
    id: APPROVED_METRICS[2].id,
    category: "Workflow modernization",
    value: "16 systems reduced to 9",
    support:
      "Simplified fragmented returns tooling and saved roughly 2,000 annual hours.",
    intent: "efficiency",
  },
  {
    id: contactCenterPilot?.id ?? "contact-center-pilot",
    category: "AI pilot impact",
    value: contactCenterPilot?.value ?? "~$2.7M estimated annual lift",
    support:
      contactCenterPilot?.detail ??
      "Measured from a controlled pilot that validated AI-assisted workflows in the contact center.",
    intent: "revenue",
  },
  {
    id: chatgptRollout?.id ?? "chatgpt-rollout",
    category: "AI adoption",
    value: chatgptRollout?.value ?? "~1,000 licensed users / ~800 DAU",
    support:
      chatgptRollout?.detail ??
      "Scaled adoption with enablement, governance, and repeatable rollout patterns across the organization.",
    intent: "org",
  },
  {
    id: returnsHours?.id ?? "returns-hours",
    category: "Operational efficiency",
    value: returnsHours?.value ?? "~2,000 annual hours saved",
    support:
      returnsHours?.detail ??
      "Reduced team overhead by modernizing returns workflows and removing avoidable tool switching.",
    intent: "efficiency",
  },
];
