"use client";

import { useState } from "react";
import { HOUSEHOLDS } from "@/data/khetlapur";

export default function HouseholdCards() {
  const [idx, setIdx] = useState(0);
  const hh = HOUSEHOLDS[idx];

  return (
    <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap gap-2">
        {HOUSEHOLDS.map((h, n) => (
          <button
            key={h.name}
            onClick={() => setIdx(n)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
              n === idx ? "bg-teal-600 text-white border-teal-600" : "bg-white border-teal-200 text-navy hover:border-teal-600"
            }`}
          >
            {h.name}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-navy/85 leading-relaxed"><span className="font-bold text-teal-900">Profile: </span>{hh.profile}</p>

      <div className="mt-4">
        <p className="text-xs font-bold text-navy/60 mb-2">INCOME COMPOSITION</p>
        <div className="flex h-7 rounded-full overflow-hidden border border-teal-50">
          {hh.income.map((s, i) => (
            <div
              key={s.source}
              className={`h-full ${["bg-teal-600", "bg-peri-500", "bg-coral-400", "bg-amber-300"][i % 4]} flex items-center justify-center`}
              style={{ width: `${s.share}%` }}
              title={`${s.source}: ${s.share}%`}
            >
              {s.share >= 18 && <span className="text-[10px] font-bold text-white drop-shadow">{s.share}%</span>}
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-navy/70">
          {hh.income.map((s, i) => (
            <span key={s.source} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-full inline-block ${["bg-teal-600", "bg-peri-500", "bg-coral-400", "bg-amber-300"][i % 4]}`} />
              {s.source}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
        <div>
          <p className="text-xs font-bold text-navy/60 mb-1.5">SPENDING & DEBT</p>
          <ul className="space-y-1.5 text-navy/85">
            {hh.spending.map((s) => (
              <li key={s} className="flex gap-2"><span className="text-peri-700 font-bold shrink-0">·</span>{s}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg bg-teal-50 border border-teal-200 p-3">
            <p className="text-[11px] font-bold text-teal-900 mb-1">AGROECOLOGICAL PRACTICES</p>
            <ul className="space-y-1 text-xs text-navy/85">
              {hh.practices.good.map((s) => <li key={s}>✓ {s}</li>)}
            </ul>
          </div>
          <div className="rounded-lg bg-amber-300/20 border border-amber-300/60 p-3">
            <p className="text-[11px] font-bold text-navy mb-1">FLAGS FOR THE SCORECARD</p>
            <ul className="space-y-1 text-xs text-navy/85">
              {hh.practices.concern.map((s) => <li key={s}>⚠ {s}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
