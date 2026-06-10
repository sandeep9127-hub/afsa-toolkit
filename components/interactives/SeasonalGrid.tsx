"use client";

import { useState } from "react";
import { CALENDAR, SEASONS } from "@/data/khetlapur";

const LEVELS = [
  { label: "Scarce / market-dependent", cls: "bg-amber-300/35 text-[#8a5a1e]" },
  { label: "Partial / supplemented", cls: "bg-teal-50 text-teal-900" },
  { label: "Abundant from own & local", cls: "bg-teal-600 text-white" },
];

export default function SeasonalGrid() {
  const [active, setActive] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const toggle = (g: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });

  const activeRow = CALENDAR.find((r) => r.group === active);
  const visible = CALENDAR.filter((r) => !hidden.has(r.group));

  return (
    <div className="rounded-(--radius-soft) border border-teal-200 bg-white overflow-hidden">
      <div className="p-3.5 flex flex-wrap gap-1.5 border-b border-teal-50">
        {CALENDAR.map((r) => (
          <button
            key={r.group}
            onClick={() => toggle(r.group)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold border transition-colors ${
              hidden.has(r.group) ? "bg-white text-navy/40 border-teal-50" : "bg-teal-50 text-teal-900 border-teal-200"
            }`}
          >
            {r.group}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-120">
          <thead>
            <tr className="text-left text-xs text-navy/60">
              <th className="p-3 font-bold">Food group</th>
              {SEASONS.map((s) => (
                <th key={s} className="p-3 font-bold text-center">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr
                key={r.group}
                onClick={() => setActive(active === r.group ? null : r.group)}
                className={`border-t border-teal-50 cursor-pointer transition-colors ${active === r.group ? "bg-peri-100/40" : "hover:bg-teal-50/40"}`}
              >
                <td className="p-3 font-semibold text-teal-900 whitespace-nowrap">{r.group}</td>
                {r.values.map((v, i) => (
                  <td key={i} className="p-1.5">
                    <div className={`rounded-lg px-2 py-2 text-center text-[11px] font-bold ${LEVELS[v].cls}`}>
                      {v === 2 ? "●●●" : v === 1 ? "●●○" : "●○○"}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-teal-50 p-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-navy/70">
        {LEVELS.map((l) => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className={`inline-block size-3 rounded ${l.cls.split(" ")[0]} border border-teal-200`} /> {l.label}
          </span>
        ))}
      </div>
      <div className="border-t border-teal-50 p-4 text-sm text-navy/85 min-h-16">
        {activeRow ? (
          <p><span className="font-bold text-teal-900">{activeRow.group}: </span>{activeRow.note}</p>
        ) : (
          <p className="text-navy/65">Click a row for Khetlapur&apos;s story. Notice the column of pale cells in summer — that is the lean season the calendar exists to expose.</p>
        )}
      </div>
    </div>
  );
}
