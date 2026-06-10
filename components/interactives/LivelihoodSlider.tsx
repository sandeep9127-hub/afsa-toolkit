"use client";

import { useRef, useState } from "react";
import { LIVELIHOODS } from "@/data/khetlapur";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode, type Mode } from "@/components/Assess";

type YourRow = { activity: string; now: number; then20: number; incomeK: number };

const STARTER_ROWS: YourRow[] = [
  { activity: "Crop cultivation", now: 0, then20: 0, incomeK: 0 },
  { activity: "Livestock rearing", now: 0, then20: 0, incomeK: 0 },
  { activity: "Local wage labour", now: 0, then20: 0, incomeK: 0 },
  { activity: "Migrant wage labour", now: 0, then20: 0, incomeK: 0 },
];

export default function LivelihoodSlider() {
  const [mode, setMode] = useMode();
  const [t, setT] = useState(1);
  const [yourRows, setYourRows] = useLocalState<YourRow[]>("afsa.livelihood.rows", STARTER_ROWS);
  const [meta, setMeta] = useMeta();
  const chartRef = useRef<HTMLDivElement>(null);
  const yours = mode === "yours";

  const maxHH = Math.max(...LIVELIHOODS.flatMap((l) => [l.now, l.then20]));
  const yourMax = Math.max(1, ...yourRows.flatMap((l) => [l.now, l.then20]));

  const update = (i: number, patch: Partial<YourRow>) =>
    setYourRows(yourRows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const tableHtml = () =>
    rowsToTable(
      ["Livelihood activity", "Households today", "Households 20 years ago", "Avg annual income (₹ thousand)"],
      yourRows.filter((r) => r.activity.trim()).map((r) => [r.activity, r.now, r.then20, r.incomeK || "—"])
    );

  const num = (v: number, set: (n: number) => void, label: string) => (
    <input
      type="number"
      min={0}
      value={v || ""}
      placeholder="0"
      aria-label={label}
      onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))}
      className="w-20 rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-sm text-center focus:outline-none focus:border-teal-600"
    />
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
        {yours && <span className="text-xs text-navy/60">List each livelihood and the households involved — today vs 20 years ago.</span>}
      </div>

      {yours ? (
        <div>
          <div className="mb-5 rounded-(--radius-soft) border border-coral-400/50 bg-coral-400/8 p-4">
            <MetaFields meta={meta} setMeta={setMeta} />
          </div>

          <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-bold text-navy/60">
                  <th className="py-1.5 pr-2">LIVELIHOOD ACTIVITY</th>
                  <th className="py-1.5 px-1 text-center">HH TODAY</th>
                  <th className="py-1.5 px-1 text-center">HH 20 YRS AGO</th>
                  <th className="py-1.5 px-1 text-center">INCOME ₹K/YR</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {yourRows.map((r, i) => (
                  <tr key={i} className="border-t border-teal-50">
                    <td className="py-2 pr-2">
                      <input
                        type="text"
                        value={r.activity}
                        placeholder="e.g. Goat rearing"
                        onChange={(e) => update(i, { activity: e.target.value })}
                        className="w-full min-w-36 rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:border-teal-600"
                      />
                    </td>
                    <td className="py-2 px-1 text-center">{num(r.now, (n) => update(i, { now: n }), "households today")}</td>
                    <td className="py-2 px-1 text-center">{num(r.then20, (n) => update(i, { then20: n }), "households 20 years ago")}</td>
                    <td className="py-2 px-1 text-center">{num(r.incomeK, (n) => update(i, { incomeK: n }), "average income")}</td>
                    <td className="py-2 pl-1">
                      <button
                        onClick={() => setYourRows(yourRows.filter((_, j) => j !== i))}
                        className="text-navy/40 hover:text-coral-400 font-bold px-1.5"
                        aria-label={`Remove ${r.activity || "row"}`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setYourRows([...yourRows, { activity: "", now: 0, then20: 0, incomeK: 0 }])}
              className="mt-3 rounded-full border border-teal-200 px-4 py-1.5 text-sm font-semibold text-teal-600 hover:border-teal-600 transition-colors"
            >
              + Add livelihood
            </button>
          </div>

          <div ref={chartRef} className="mt-4 rounded-(--radius-soft) border border-teal-200 bg-white p-5">
            <ChartCaption meta={meta} toolName="Livelihood Shift Map (20 years ago → today)" />
            <div className="space-y-3.5">
              {yourRows.filter((r) => r.activity.trim()).map((r) => (
                <div key={r.activity} className="grid grid-cols-[minmax(110px,1.4fr)_3fr] items-center gap-3 text-sm">
                  <span className="font-medium text-teal-900 leading-tight">{r.activity}</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3.5 rounded-full bg-teal-50 overflow-hidden">
                        <div className="h-full rounded-full bg-peri-500" style={{ width: `${(r.then20 / yourMax) * 100}%` }} />
                      </div>
                      <span className="tabular-nums text-[11px] text-navy/60 w-16">{r.then20} HH then</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3.5 rounded-full bg-teal-50 overflow-hidden">
                        <div className={`h-full rounded-full ${r.now > r.then20 ? "bg-coral-400" : "bg-teal-600"}`} style={{ width: `${(r.now / yourMax) * 100}%` }} />
                      </div>
                      <span className="tabular-nums text-[11px] font-bold text-navy/80 w-16">{r.now} HH now</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-navy/70">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-peri-500 inline-block" /> 20 years ago</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-teal-600 inline-block" /> today (shrinking)</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-coral-400 inline-block" /> today (growing)</span>
            </div>
          </div>

          <div className="mt-5">
            <ExportBar
              chartRef={chartRef}
              meta={meta}
              toolName="Livelihood Shift Mapping"
              filename="afsa-livelihood-shift"
              getTableHtml={tableHtml}
            />
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
