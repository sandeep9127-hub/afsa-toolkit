"use client";

import { useRef, useState } from "react";
import { CALENDAR, SEASONS } from "@/data/khetlapur";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode, type Mode } from "@/components/Assess";

const LEVELS = [
  { label: "Scarce / market-dependent", cls: "bg-amber-300/35 text-[#8a5a1e]" },
  { label: "Partial / supplemented", cls: "bg-teal-50 text-teal-900" },
  { label: "Abundant from own & local", cls: "bg-teal-600 text-white" },
];
const LEVEL_TEXT = ["Scarce", "Partial", "Abundant"];

type YourRow = { group: string; values: [number, number, number]; note: string };

const EMPTY_ROWS: YourRow[] = CALENDAR.map((r) => ({
  group: r.group,
  values: [0, 0, 0],
  note: "",
}));

export default function SeasonalGrid() {
  const [mode, setMode] = useMode();
  const [active, setActive] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [yourRows, setYourRows] = useLocalState<YourRow[]>("afsa.calendar.rows", EMPTY_ROWS);
  const [meta, setMeta] = useMeta();
  const chartRef = useRef<HTMLDivElement>(null);
  const yours = mode === "yours";

  const toggleGroup = (g: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });

  const cycleCell = (ri: number, si: number) =>
    setYourRows((prev) =>
      prev.map((r, i) =>
        i === ri ? { ...r, values: r.values.map((v, j) => (j === si ? (v + 1) % 3 : v)) as [number, number, number] } : r
      )
    );

  const tableHtml = () =>
    rowsToTable(
      ["Food group", ...SEASONS.map(String), "Notes"],
      yourRows.map((r) => [r.group, ...r.values.map((v) => LEVEL_TEXT[v]), r.note || "—"])
    );

  const activeRow = CALENDAR.find((r) => r.group === active);
  const visible = CALENDAR.filter((r) => !hidden.has(r.group));

  const Legend = () => (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-navy/70">
      {LEVELS.map((l) => (
        <span key={l.label} className="flex items-center gap-1.5">
          <span className={`inline-block size-3 rounded ${l.cls.split(" ")[0]} border border-teal-200`} /> {l.label}
        </span>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
        {yours && <span className="text-xs text-navy/60">Tap a cell to cycle scarce → partial → abundant, as the community maps it.</span>}
      </div>

      {yours ? (
        <div>
          <div className="mb-5 rounded-(--radius-soft) border border-coral-400/50 bg-coral-400/8 p-4">
            <MetaFields meta={meta} setMeta={setMeta} />
          </div>
          <div ref={chartRef} className="rounded-(--radius-soft) border border-teal-200 bg-white p-4">
            <ChartCaption meta={meta} toolName="Seasonal Calendar of Food" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-120">
                <thead>
                  <tr className="text-left text-xs text-navy/60">
                    <th className="p-2.5 font-bold">Food group</th>
                    {SEASONS.map((s) => (
                      <th key={s} className="p-2.5 font-bold text-center">{s}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {yourRows.map((r, ri) => (
                    <tr key={r.group} className="border-t border-teal-50">
                      <td className="p-2.5 font-semibold text-teal-900 whitespace-nowrap">{r.group}</td>
                      {r.values.map((v, si) => (
                        <td key={si} className="p-1.5">
                          <button
                            onClick={() => cycleCell(ri, si)}
                            className={`w-full rounded-lg px-2 py-2 text-center text-[11px] font-bold transition-colors ${LEVELS[v].cls} hover:ring-2 hover:ring-teal-400`}
                            aria-label={`${r.group}, ${SEASONS[si]}: ${LEVEL_TEXT[v]} — tap to change`}
                          >
                            {v === 2 ? "●●●" : v === 1 ? "●●○" : "●○○"}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 px-1">
              <Legend />
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {yourRows.map((r, ri) => (
              <div key={r.group} className="flex items-center gap-2">
                <span className="w-36 shrink-0 text-xs font-semibold text-teal-900">{r.group}</span>
                <input
                  type="text"
                  value={r.note}
                  placeholder="Notes — coping, market dependence, change over time…"
                  onChange={(e) => setYourRows(yourRows.map((x, i) => (i === ri ? { ...x, note: e.target.value } : x)))}
                  className="flex-1 rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-xs focus:outline-none focus:border-teal-600"
                />
              </div>
            ))}
          </div>
          <div className="mt-5">
            <ExportBar
              chartRef={chartRef}
              meta={meta}
              toolName="Seasonal Calendar of Food"
              filename="afsa-seasonal-calendar"
              getTableHtml={tableHtml}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-(--radius-soft) border border-teal-200 bg-white overflow-hidden">
          <div className="p-3.5 flex flex-wrap gap-1.5 border-b border-teal-50">
            {CALENDAR.map((r) => (
              <button
                key={r.group}
                onClick={() => toggleGroup(r.group)}
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
          <div className="border-t border-teal-50 p-3.5">
            <Legend />
          </div>
          <div className="border-t border-teal-50 p-4 text-sm text-navy/85 min-h-16">
            {activeRow ? (
              <p><span className="font-bold text-teal-900">{activeRow.group}: </span>{activeRow.note}</p>
            ) : (
              <p className="text-navy/65">Click a row for Khetlapur&apos;s story. Notice the column of pale cells in summer — that is the lean season the calendar exists to expose.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
