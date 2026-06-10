"use client";

import { useState } from "react";
import { LIVELIHOODS } from "@/data/khetlapur";

export default function LivelihoodSlider() {
  const [t, setT] = useState(1); // 0 = 20 years ago, 1 = today
  const maxHH = Math.max(...LIVELIHOODS.flatMap((l) => [l.now, l.then20]));

  return (
    <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <span className={`text-sm font-bold transition-colors ${t < 0.5 ? "text-teal-600" : "text-navy/40"}`}>20 years ago</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          className="flex-1 accent-teal-600"
          aria-label="Slide between 20 years ago and today"
        />
        <span className={`text-sm font-bold transition-colors ${t >= 0.5 ? "text-teal-600" : "text-navy/40"}`}>Today</span>
      </div>

      <div className="mt-6 space-y-3">
        {LIVELIHOODS.map((l) => {
          const v = Math.round(l.then20 + (l.now - l.then20) * t);
          const growing = l.now > l.then20;
          return (
            <div key={l.activity} className="grid grid-cols-[minmax(110px,1.4fr)_3fr_auto] items-center gap-3 text-sm">
              <span className="font-medium text-teal-900 leading-tight">{l.activity}</span>
              <div className="h-5 rounded-full bg-teal-50 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-150 ${growing ? "bg-coral-400" : "bg-teal-600"}`}
                  style={{ width: `${(v / maxHH) * 100}%` }}
                />
              </div>
              <span className="tabular-nums font-bold text-navy/80 w-14 text-right">{v} HH</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-[11px] text-navy/70">
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-teal-600 inline-block" /> shrinking since 20 years ago</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-coral-400 inline-block" /> growing</span>
        <span className="ml-auto">of ~140 households · avg income/HH shown in the print template</span>
      </div>

      <p className="mt-4 text-sm text-navy/85 leading-relaxed border-t border-teal-50 pt-4">
        {t > 0.7
          ? "Today: migrant wage labour has overtaken forest collection, and nearly every fourth household has someone away for half the year. Income enters the village — but so does the women's double burden."
          : t < 0.3
          ? "Twenty years ago: nearly every household cultivated, two-thirds kept large livestock, and the forest fed and paid a third of the village."
          : "Drag toward either end to read the story of the shift."}
      </p>
    </div>
  );
}
