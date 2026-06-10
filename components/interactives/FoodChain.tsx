"use client";

import { useState } from "react";
import { FOOD_CHAIN } from "@/data/khetlapur";

export default function FoodChain() {
  const [idx, setIdx] = useState(0);
  const step = FOOD_CHAIN[idx];
  const maxVal = Math.max(...FOOD_CHAIN.map((s) => s.valuePerKg));

  return (
    <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-5 sm:p-6">
      <p className="text-sm font-semibold text-teal-900">Black gram → dal, through Khetlapur&apos;s value chain</p>

      {/* chain */}
      <div className="mt-4 flex items-stretch gap-1.5 overflow-x-auto pb-2">
        {FOOD_CHAIN.map((s, i) => (
          <div key={s.stage} className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIdx(i)}
              className={`rounded-xl border px-3 py-2.5 min-w-24 text-center transition-colors ${
                i === idx ? "bg-teal-600 text-white border-teal-600" : "bg-white border-teal-200 text-teal-900 hover:border-teal-600"
              }`}
            >
              <p className="text-xs font-bold">{s.stage}</p>
              <p className={`text-[10px] mt-0.5 ${i === idx ? "text-teal-50" : "text-navy/60"}`}>{s.form}</p>
            </button>
            {i < FOOD_CHAIN.length - 1 && <span className="text-teal-400 font-bold">→</span>}
          </div>
        ))}
      </div>

      {/* value bar */}
      <div className="mt-3">
        <p className="text-xs font-bold text-navy/60 mb-1.5">VALUE PER KG ALONG THE CHAIN</p>
        <div className="flex items-end gap-1.5 h-20">
          {FOOD_CHAIN.map((s, i) => (
            <button
              key={s.stage}
              onClick={() => setIdx(i)}
              className={`flex-1 rounded-t-md transition-all ${i === idx ? "bg-coral-400" : "bg-teal-200 hover:bg-teal-400"}`}
              style={{ height: `${Math.max(6, (s.valuePerKg / maxVal) * 100)}%` }}
              title={`${s.stage}: ₹${s.valuePerKg}/kg`}
              aria-label={`${s.stage}: ${s.valuePerKg} rupees per kg`}
            />
          ))}
        </div>
        <div className="flex gap-1.5 text-[10px] text-navy/60 tabular-nums">
          {FOOD_CHAIN.map((s) => (
            <span key={s.stage} className="flex-1 text-center">{s.valuePerKg ? `₹${s.valuePerKg}` : "—"}</span>
          ))}
        </div>
      </div>

      {/* detail */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
        <div className="rounded-lg bg-teal-50/70 border border-teal-200 p-3.5 space-y-1.5">
          <p><span className="font-bold text-xs text-navy/60">ACTOR · </span><span className="text-navy/90">{step.actor}</span></p>
          <p><span className="font-bold text-xs text-navy/60">TECHNOLOGY & ENERGY · </span><span className="text-navy/90">{step.tech}</span></p>
          <p><span className="font-bold text-xs text-navy/60">WASTE & ITS USE · </span><span className="text-navy/90">{step.waste}</span></p>
        </div>
        <div className="rounded-lg bg-amber-300/20 border border-amber-300/60 p-3.5">
          <p className="font-bold text-xs text-navy mb-1">GAP / CHALLENGE AT THIS STEP</p>
          <p className="text-navy/90 leading-relaxed">{step.challenge}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-navy/85 border-t border-teal-50 pt-3.5 leading-relaxed">
        The farmer sells whole grain at <strong>₹62/kg</strong>; the village buys its own black gram back as dal at{" "}
        <strong>₹130/kg</strong>. The milling — and the margin — happens 18 km away. That gap is what the youth
        group&apos;s dal-mill vision is aimed at.
      </p>
    </div>
  );
}
