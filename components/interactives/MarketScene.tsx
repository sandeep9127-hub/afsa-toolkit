"use client";

import { useRef, useState } from "react";
import { MARKET } from "@/data/khetlapur";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { XIcon, PlusIcon } from "@/components/Icons";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode } from "@/components/Assess";

type Obs = { type: string; finding: string };

const STARTER: Obs[] = [
  { type: "Vegetable rows", finding: "" },
  { type: "Grain & dal traders", finding: "" },
  { type: "Snacks & processed", finding: "" },
  { type: "Who sells", finding: "" },
];

export default function MarketScene() {
  const [mode, setMode] = useMode();
  const [open, setOpen] = useState<string | null>(MARKET[0].type);
  const [obs, setObs] = useLocalState<Obs[]>("afsa.market.rows", STARTER);
  const [meta, setMeta] = useMeta();
  const chartRef = useRef<HTMLDivElement>(null);
  const yours = mode === "yours";

  const update = (i: number, patch: Partial<Obs>) =>
    setObs(obs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const tableHtml = () =>
    rowsToTable(
      ["Observation", "Finding"],
      obs.filter((o) => o.type.trim()).map((o) => [o.type, o.finding || "—"])
    );

  const inputCls = "rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:border-teal-600";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
        {yours && <span className="text-xs text-navy/60">One row per section of the market — what you saw, in plain words.</span>}
      </div>

      {yours ? (
        <div>
          <div className="mb-5 rounded-(--radius-soft) border border-coral-400/50 bg-coral-400/8 p-4">
            <MetaFields meta={meta} setMeta={setMeta} />
          </div>

          <div className="space-y-2.5">
            {obs.map((o, i) => (
              <div key={i} className="flex flex-wrap gap-2.5 rounded-(--radius-soft) border border-teal-50 bg-white p-3">
                <input type="text" value={o.type} placeholder="Section — e.g. Dry fish & meat"
                  onChange={(e) => update(i, { type: e.target.value })} className={`${inputCls} w-52 font-semibold`} />
                <textarea value={o.finding} rows={1} placeholder="What did you observe? Sources, prices, freshness, who sells…"
                  onChange={(e) => update(i, { finding: e.target.value })} className={`${inputCls} flex-1 min-w-48 text-xs`} />
                <button onClick={() => setObs(obs.filter((_, j) => j !== i))}
                  className="grid place-items-center size-7 rounded-md text-navy/40 hover:text-coral-400 hover:bg-coral-400/10 active:scale-90 transition-all outline-none focus-visible:ring-2 focus-visible:ring-coral-400" aria-label="Remove observation"><XIcon className="size-4" /></button>
              </div>
            ))}
            <button onClick={() => setObs([...obs, { type: "", finding: "" }])}
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 px-4 py-1.5 text-sm font-semibold text-teal-600 hover:border-teal-600 hover:bg-teal-50 active:translate-y-px transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-400"><PlusIcon className="size-4" /> Add observation</button>
          </div>

          <div ref={chartRef} className="mt-4 rounded-(--radius-soft) border border-teal-200 bg-white p-5">
            <ChartCaption meta={meta} toolName="Market Walk — observations" />
            <div className="space-y-2.5">
              {obs.filter((o) => o.type.trim() && o.finding.trim()).map((o, i) => (
                <div key={i} className="rounded-xl border-l-4 border-peri-500 bg-peri-100/30 p-3.5">
                  <p className="text-xs font-bold text-peri-700">{o.type.toUpperCase()}</p>
                  <p className="mt-1 text-sm text-navy/85 leading-relaxed">{o.finding}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <ExportBar chartRef={chartRef} meta={meta} toolName="Market Walk" filename="afsa-market-walk" getTableHtml={tableHtml} />
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
