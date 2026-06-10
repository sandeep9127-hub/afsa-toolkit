"use client";

import { useRef, useState } from "react";
import { HOUSEHOLDS } from "@/data/khetlapur";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { XIcon, PlusIcon } from "@/components/Icons";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode } from "@/components/Assess";

type Finding = { indicator: string; valuePct: number; note: string };

const STARTER: Finding[] = [
  { indicator: "Households using synthetic fertilizer", valuePct: 0, note: "" },
  { indicator: "Households keeping own seed", valuePct: 0, note: "" },
  { indicator: "Households with a kitchen garden", valuePct: 0, note: "" },
  { indicator: "Households with an outstanding loan", valuePct: 0, note: "" },
];

export default function HouseholdCards() {
  const [mode, setMode] = useMode();
  const [idx, setIdx] = useState(0);
  const [findings, setFindings] = useLocalState<Finding[]>("afsa.rapidsurvey.findings", STARTER);
  const [meta, setMeta] = useMeta();
  const chartRef = useRef<HTMLDivElement>(null);
  const yours = mode === "yours";

  const hh = HOUSEHOLDS[idx];
  const update = (i: number, patch: Partial<Finding>) =>
    setFindings(findings.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const tableHtml = () =>
    rowsToTable(
      ["Indicator (from the Kobo export)", "% of households", "Note"],
      findings.filter((f) => f.indicator.trim()).map((f) => [f.indicator, `${f.valuePct}%`, f.note || "—"])
    );

  const inputCls = "rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:border-teal-600";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
        {yours && <span className="text-xs text-navy/60">Summarise the household survey you collected in KoboToolbox.</span>}
      </div>

      {yours ? (
        <div>
          <div className="mb-5 rounded-(--radius-soft) border border-coral-400/50 bg-coral-400/8 p-4">
            <MetaFields meta={meta} setMeta={setMeta} />
            <p className="mt-3 text-xs text-navy/70 leading-relaxed">
              The survey itself runs in <strong>KoboToolbox</strong>. From its export, compute the shares that
              matter for your scorecard discussion and enter them here as a validation snapshot.
            </p>
          </div>

          <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-4">
            {findings.map((f, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2.5 py-2 border-b border-teal-50 last:border-0">
                <input type="text" value={f.indicator} placeholder="Indicator — e.g. Households burning crop residue"
                  onChange={(e) => update(i, { indicator: e.target.value })} className={`${inputCls} flex-1 min-w-52`} />
                <span className="flex items-center gap-1.5">
                  <input type="number" min={0} max={100} value={f.valuePct || ""} placeholder="0" aria-label="percent of households"
                    onChange={(e) => update(i, { valuePct: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                    className={`${inputCls} w-20 text-center`} />
                  <span className="text-xs font-bold text-navy/60">%</span>
                </span>
                <input type="text" value={f.note} placeholder="note…"
                  onChange={(e) => update(i, { note: e.target.value })} className={`${inputCls} flex-1 min-w-36 text-xs`} />
                <button onClick={() => setFindings(findings.filter((_, j) => j !== i))}
                  className="grid place-items-center size-7 rounded-md text-navy/40 hover:text-coral-400 hover:bg-coral-400/10 active:scale-90 transition-all outline-none focus-visible:ring-2 focus-visible:ring-coral-400" aria-label="Remove indicator"><XIcon className="size-4" /></button>
              </div>
            ))}
            <button onClick={() => setFindings([...findings, { indicator: "", valuePct: 0, note: "" }])}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-teal-200 px-4 py-1.5 text-sm font-semibold text-teal-600 hover:border-teal-600 hover:bg-teal-50 active:translate-y-px transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-400"><PlusIcon className="size-4" /> Add indicator</button>
          </div>

          <div ref={chartRef} className="mt-4 rounded-(--radius-soft) border border-teal-200 bg-white p-5">
            <ChartCaption meta={meta} toolName="Rapid Survey — household snapshot" />
            <div className="space-y-2.5">
              {findings.filter((f) => f.indicator.trim()).map((f, i) => (
                <div key={i} className="grid grid-cols-[minmax(140px,2fr)_3fr_auto] items-center gap-3 text-sm">
                  <span className="font-medium text-teal-900 leading-tight text-xs sm:text-sm">{f.indicator}</span>
                  <div className="h-4.5 rounded-full bg-teal-50 overflow-hidden">
                    <div className={`h-full rounded-full ${f.valuePct >= 60 ? "bg-teal-600" : f.valuePct >= 30 ? "bg-peri-500" : "bg-amber-300"}`}
                      style={{ width: `${f.valuePct}%` }} />
                  </div>
                  <span className="tabular-nums font-bold text-navy/80 w-12 text-right">{f.valuePct}%</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-navy/55">share of surveyed households</p>
          </div>

          <div className="mt-5">
            <ExportBar chartRef={chartRef} meta={meta} toolName="Rapid Survey" filename="afsa-rapid-survey" getTableHtml={tableHtml} />
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
