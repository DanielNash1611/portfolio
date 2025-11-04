"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Banknote, Gauge, Sparkles, Globe } from "lucide-react";
import { ReactNode } from "react";

const intentToBorder: Record<string, string> = {
  revenue: "border-t-4 border-emerald-700",
  efficiency: "border-t-4 border-indigo-700",
  cx: "border-t-4 border-orange-700",
  org: "border-t-4 border-teal-700",
};

const intentToIcon: Record<string, ReactNode> = {
  revenue: <Banknote className="h-5 w-5" aria-hidden />,
  efficiency: <Gauge className="h-5 w-5" aria-hidden />,
  cx: <Sparkles className="h-5 w-5" aria-hidden />,
  org: <Globe className="h-5 w-5" aria-hidden />,
};

function splitPrefixNumberSuffix(value: string): { prefix: string; number: number | null; suffix: string } {
  const m = value.match(/^(\s*[\$\+~]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return { prefix: "", number: null, suffix: value };
  const [, prefix, numStr, rest] = m;
  return { prefix, number: parseFloat(numStr), suffix: rest };
}

export function MetricCard({
  category,
  value,
  support,
  intent,
}: {
  category: string;
  value: string;
  support: string;
  intent?: "revenue" | "efficiency" | "cx" | "org";
}) {
  const { prefix, number, suffix } = splitPrefixNumberSuffix(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 ${intent ? intentToBorder[intent] : ""}`}
    >
      <div className="flex items-center gap-3 text-slate-700">
        {intent && <span className="text-slate-500">{intentToIcon[intent]}</span>}
        <h3 className="text-base font-semibold text-slate-800">{category}</h3>
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
        {number !== null ? (
          <>
            <span>{prefix}</span>
            <CountUp end={number} duration={1.2} separator="," />
            <span>{suffix}</span>
          </>
        ) : (
          value
        )}
      </div>
      <p className="mt-2 text-sm text-slate-600">{support}</p>
    </motion.div>
  );
}
