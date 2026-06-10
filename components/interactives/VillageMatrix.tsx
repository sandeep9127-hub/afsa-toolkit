"use client";

import { useRef, useState } from "react";
import { VILLAGES, VILLAGE_CRITERIA } from "@/data/khetlapur";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode } from "@/components/Assess";

type YourData = { criteria: string[]; villages: { name: string; flags: boolean[]; selected: boolean }[] };

const STARTER: YourData = {
  criteria: [...VILLAGE_CRITERIA],
  villages: [
    { name: "", flags: Array(VILLAGE_CRITERIA.length).fill(false), selected: false },
    { name: "", flags: Array(VILLAGE_CRITERIA.length).fill(false), selected: false },
  ],
};

export default function VillageMatrix() {
  const [mode, setMode] = useMode();
  const [activeCriteria, setActiveCriteria] = useState<boolean[]>(VILLAGE_CRITERIA.map(() => true));
  const [yours, setYours] = useLocalState<YourData>("afsa.villages.data", STARTER);
  const [meta, setMeta] = useMeta();
  const chartRef = useRef<HTMLDivElement>(null);
  const isYours = mode === "yours";

  const toggle = (i: number) => setActiveCriteria((prev) => prev.map((v, j) => (j === i ? !v : v)));

  const selected = VILLAGES.slice(0, 4);
  const coverage = VILLAGE_CRITERIA.map((_, ci) => selected.some((v) => v.flags[ci]));

  // ——— your-data helpers ———
  const setVillage = (i: number, patch: Partial<YourData["villages"][number]>) =>
    setYours({ ...yours, villages: yours.villages.map((v, j) => (j === i ? { ...v, ...patch } : v)) });
  const flipFlag = (vi: number, ci: number) =>
    setVillage(vi, { flags: yours.villages[vi].flags.map((f, j) => (j === ci ? !f : f)) });
  const named = yours.villages.filter((v) => v.name.trim());
  const chosen = named.filter((v) => v.selected);
  const yourCoverage = yours.criteria.map((_, ci) => chosen.some((v) => v.flags[ci]));
  const fullCover = chosen.length > 0 && yourCoverage.every(Boolean);

  const tableHtml = () =>
    rowsToTable(
      ["Village", "Selected", ...yours.criteria, "Criteria met"],
      named.map((v) => [v.name, v.selected ? "✓ YES" : "—", ...v.flags.map((f) => (f ? "✓" : "—")), v.flags.filter(Boolean).length])
    );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
        {isYours && <span className="text-xs text-navy/60">Tick criteria per village, then mark your selection — coverage is checked live.</span>}
      </div>

      {isYours ? (
        <div>
          <div className="mb-5 rounded-(--radius-soft) border border-coral-400/50 bg-coral-400/8 p-4">
            <MetaFields meta={meta} setMeta={setMeta} />
          </div>

          <div ref={chartRef} className="rounded-(--radius-soft) border border-teal-200 bg-white p-4">
            <ChartCaption meta={meta} toolName="Village Selection Matrix" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-140">
                <thead>
                  <tr className="text-left text-xs text-navy/60">
                    <th className="p-2 font-bold">Village</th>
                    <th className="p-2 font-bold text-center">Select?</th>
                    {yours.criteria.map((c, ci) => (
                      <th key={ci} className="p-2 font-semibold text-center align-bottom">
                        <span className={yourCoverage[ci] || chosen.length === 0 ? "" : "text-[#c47b35]"}>{c}</span>
                      </th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {yours.villages.map((v, vi) => (
                    <tr key={vi} className={`border-t border-teal-50 ${v.selected ? "bg-teal-50/50" : ""}`}>
                      <td className="p-2">
                        <input type="text" value={v.name} placeholder="Village name"
                          onChange={(e) => setVillage(vi, { name: e.target.value })}
                          className="w-full min-w-28 rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:border-teal-600" />
                      </td>
                      <td className="p-2 text-center">
                        <input type="checkbox" checked={v.selected} aria-label={`select ${v.name || "village"}`}
                          onChange={(e) => setVillage(vi, { selected: e.target.checked })}
                          className="size-4 accent-teal-600" />
                      </td>
                      {v.flags.map((f, ci) => (
                        <td key={ci} className="p-2 text-center">
                          <button onClick={() => flipFlag(vi, ci)} aria-label={`${yours.criteria[ci]}: ${f ? "yes" : "no"}`}
                            className={`size-6 rounded-md border text-xs font-bold transition-colors ${f ? "bg-teal-600 border-teal-600 text-white" : "bg-white border-teal-200 text-teal-200 hover:border-teal-600"}`}>
                            {f ? "✓" : "·"}
                          </button>
                        </td>
                      ))}
                      <td className="p-2">
                        <button onClick={() => setYours({ ...yours, villages: yours.villages.filter((_, j) => j !== vi) })}
                          className="text-navy/40 hover:text-coral-400 font-bold px-1" aria-label="Remove village">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={`mt-3 px-1 text-xs font-semibold ${fullCover ? "text-teal-600" : "text-[#c47b35]"}`}>
              {chosen.length === 0
                ? "Mark the villages you select — at least one selected village should represent each criterion."
                : fullCover
                ? `✓ Your ${chosen.length} selected village${chosen.length > 1 ? "s" : ""} cover every criterion.`
                : "Some criteria (amber) are not yet covered by any selected village."}
            </p>
          </div>

          <button onClick={() => setYours({ ...yours, villages: [...yours.villages, { name: "", flags: Array(yours.criteria.length).fill(false), selected: false }] })}
            className="mt-3 rounded-full border border-teal-200 px-4 py-1.5 text-sm font-semibold text-teal-600 hover:border-teal-600 transition-colors">
            + Add village
          </button>

          <div className="mt-5">
            <ExportBar chartRef={chartRef} meta={meta} toolName="Village Selection Matrix" filename="afsa-village-selection" getTableHtml={tableHtml} />
          </div>
        </div>
      ) : (
        <div className="rounded-(--radius-soft) border border-teal-200 bg-white overflow-hidden">
          <div className="p-4 flex flex-wrap gap-2 border-b border-teal-50">
            {VILLAGE_CRITERIA.map((c, i) => (
              <button key={c} onClick={() => toggle(i)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
                  activeCriteria[i] ? "bg-peri-700 text-white border-peri-700" : "bg-white text-navy/50 border-teal-200"
                }`}>
                {c}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-140">
              <thead>
                <tr className="text-left text-xs text-navy/60">
                  <th className="p-3 font-bold">Village</th>
                  {VILLAGE_CRITERIA.map((c, i) => (activeCriteria[i] ? <th key={c} className="p-3 font-semibold text-center">{c}</th> : null))}
                  <th className="p-3 font-bold text-center">Criteria met</th>
                </tr>
              </thead>
              <tbody>
                {VILLAGES.map((v, vi) => {
                  const met = v.flags.filter((f, i) => f && activeCriteria[i]).length;
                  const isChosen = vi < 4;
                  return (
                    <tr key={v.name} className={`border-t border-teal-50 ${isChosen ? "bg-teal-50/50" : ""}`}>
                      <td className="p-3 font-semibold text-teal-900 whitespace-nowrap">
                        {v.name} {isChosen && <span className="text-[10px] font-bold text-teal-600 align-middle ml-1">SELECTED</span>}
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
      )}
    </div>
  );
}
