"use client";

import { Info } from "lucide-react";
import { useState } from "react";

export function MetricPill({ label, tooltip }: { label: string; tooltip?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        className="group inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-teal-600" aria-hidden />
        {label}
        <Info className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-700" aria-hidden />
      </button>
      {open && tooltip && (
        <div
          role="dialog"
          className="absolute right-0 z-10 mt-2 max-w-xs rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-700 shadow-xl"
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
