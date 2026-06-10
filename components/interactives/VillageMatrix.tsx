"use client";

import { useState } from "react";
import { VILLAGES, VILLAGE_CRITERIA } from "@/data/khetlapur";

export default function VillageMatrix() {
  const [activeCriteria, setActiveCriteria] = useState<boolean[]>(VILLAGE_CRITERIA.map(() => true));

  const toggle = (i: number) =>
    setActiveCriteria((prev) => prev.map((v, j) => (j === i ? !v : v)));

  // which active criteria are covered by the guidebook's selected four?
  const selected = VILLAGES.slice(0, 4);
  const coverage = VILLAGE_CRITERIA.map((_, ci) => selected.some((v) => v.flags[ci]));

  return (
    <div className="rounded-(--radius-soft) border border-teal-200 bg-white overflow-hidden">
      <div className="p-4 flex flex-wrap gap-2 border-b border-teal-50">
        {VILLAGE_CRITERIA.map((c, i) => (
          <button
            key={c}
            onClick={() => toggle(i)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
              activeCriteria[i]
                ? "bg-peri-700 text-white border-peri-700"
                : "bg-white text-navy/50 border-teal-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-140">
          <thead>
            <tr className="text-left text-xs text-navy/60">
              <th className="p-3 font-bold">Village</th>
              {VILLAGE_CRITERIA.map((c, i) =>
                activeCriteria[i] ? <th key={c} className="p-3 font-semibold text-center">{c}</th> : null
              )}
              <th className="p-3 font-bold text-center">Criteria met</th>
            </tr>
          </thead>
          <tbody>
            {VILLAGES.map((v, vi) => {
              const met = v.flags.filter((f, i) => f && activeCriteria[i]).length;
              const chosen = vi < 4;
              return (
                <tr key={v.name} className={`border-t border-teal-50 ${chosen ? "bg-teal-50/50" : ""}`}>
                  <td className="p-3 font-semibold text-teal-900 whitespace-nowrap">
                    {v.name} {chosen && <span className="text-[10px] font-bold text-teal-600 align-middle ml-1">SELECTED</span>}
                  </td>
                  {v.flags.map((f, i) =>
                    activeCriteria[i] ? (
                      <td key={i} className="p-3 text-center">
                        {f ? <span className="text-teal-600 font-bold">✓</span> : <span className="text-teal-200">—</span>}
                      </td>
                    ) : null
                  )}
                  <td className="p-3 text-center font-bold text-peri-700">{met}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="p-3.5 text-xs text-navy/70 border-t border-teal-50 leading-relaxed">
        Khetlapur&apos;s team selected four villages (shaded) so every active criterion is covered at least once
        {coverage.every((c, i) => !activeCriteria[i] || c)
          ? " — with the current criteria, coverage is complete."
          : " — toggle criteria to see where coverage would break."}
      </p>
    </div>
  );
}
