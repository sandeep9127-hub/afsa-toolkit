"use client";

import { useState } from "react";
import { MARKET } from "@/data/khetlapur";

export default function MarketScene() {
  const [open, setOpen] = useState<string | null>(MARKET[0].type);

  return (
    <div className="rounded-(--radius-soft) border border-teal-200 bg-white divide-y divide-teal-50">
      {MARKET.map((m) => {
        const isOpen = open === m.type;
        return (
          <button
            key={m.type}
            onClick={() => setOpen(isOpen ? null : m.type)}
            className="w-full text-left p-4 sm:px-5 hover:bg-teal-50/40 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-teal-900">{m.type}</p>
              <span className={`text-teal-600 font-bold transition-transform ${isOpen ? "rotate-90" : ""}`}>›</span>
            </div>
            {isOpen && <p className="mt-2 text-sm text-navy/85 leading-relaxed">{m.finding}</p>}
          </button>
        );
      })}
    </div>
  );
}
