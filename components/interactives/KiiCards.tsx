"use client";

import { useRef, useState } from "react";
import { INFORMANTS } from "@/data/khetlapur";
import { principleById } from "@/data/principles";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { XIcon, PlusIcon } from "@/components/Icons";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode } from "@/components/Assess";

type Interview = { who: string; insight: string; quote: string };

const STARTER: Interview[] = [
  { who: "Input dealer", insight: "", quote: "" },
  { who: "Women's SHG leader", insight: "", quote: "" },
];

export default function KiiCards() {
  const [mode, setMode] = useMode();
  const [idx, setIdx] = useState(0);
  const [interviews, setInterviews] = useLocalState<Interview[]>("afsa.kii.rows", STARTER);
  const [meta, setMeta] = useMeta();
  const chartRef = useRef<HTMLDivElement>(null);
  const yours = mode === "yours";

  const inf = INFORMANTS[idx];
  const update = (i: number, patch: Partial<Interview>) =>
    setInterviews(interviews.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const tableHtml = () =>
    rowsToTable(
      ["Informant", "Key insight", "Quote"],
      interviews.filter((r) => r.who.trim()).map((r) => [r.who, r.insight || "—", r.quote ? `"${r.quote}"` : "—"])
    );

  const inputCls = "w-full rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:border-teal-600";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
        {yours && <span className="text-xs text-navy/60">One card per interview — the quote board exports for your report.</span>}
      </div>

      {yours ? (
        <div>
          <div className="mb-5 rounded-(--radius-soft) border border-coral-400/50 bg-coral-400/8 p-4">
            <MetaFields meta={meta} setMeta={setMeta} />
          </div>

          <div className="space-y-3">
            {interviews.map((r, i) => (
              <div key={i} className="rounded-(--radius-soft) border border-teal-50 bg-white p-3.5">
                <div className="flex gap-2.5">
                  <input type="text" value={r.who} placeholder="Informant — e.g. Local extension worker"
                    onChange={(e) => update(i, { who: e.target.value })} className={`${inputCls} font-semibold`} />
                  <button onClick={() => setInterviews(interviews.filter((_, j) => j !== i))}
                    className="grid place-items-center size-7 rounded-md text-navy/40 hover:text-coral-400 hover:bg-coral-400/10 active:scale-90 transition-all outline-none focus-visible:ring-2 focus-visible:ring-coral-400" aria-label="Remove interview"><XIcon className="size-4" /></button>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <textarea value={r.insight} rows={2} placeholder="Key insight from the interview…"
                    onChange={(e) => update(i, { insight: e.target.value })} className={`${inputCls} text-xs`} />
                  <textarea value={r.quote} rows={2} placeholder="A telling quote, in their words…"
                    onChange={(e) => update(i, { quote: e.target.value })} className={`${inputCls} text-xs`} />
                </div>
              </div>
            ))}
            <button onClick={() => setInterviews([...interviews, { who: "", insight: "", quote: "" }])}
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 px-4 py-1.5 text-sm font-semibold text-teal-600 hover:border-teal-600 hover:bg-teal-50 active:translate-y-px transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-400"><PlusIcon className="size-4" /> Add interview</button>
          </div>

          <div ref={chartRef} className="mt-4 rounded-(--radius-soft) border border-teal-200 bg-white p-5">
            <ChartCaption meta={meta} toolName="Key Informants — voices from the landscape" />
            <div className="grid gap-3 sm:grid-cols-2">
              {interviews.filter((r) => r.who.trim() && (r.quote.trim() || r.insight.trim())).map((r, i) => (
                <div key={i} className="rounded-xl border-l-4 border-coral-400 bg-coral-400/10 p-4">
                  {r.quote.trim() && <p className="text-navy/90 italic leading-relaxed text-sm">&ldquo;{r.quote}&rdquo;</p>}
                  <p className="mt-2 text-xs font-bold text-teal-900">— {r.who}</p>
                  {r.insight.trim() && <p className="mt-1.5 text-xs text-navy/75 leading-relaxed">{r.insight}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <ExportBar chartRef={chartRef} meta={meta} toolName="Key Informants' Interviews" filename="afsa-kii-voices" getTableHtml={tableHtml} />
          </div>
        </div>
      ) : (
        <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {INFORMANTS.map((i, n) => (
              <button
                key={i.who}
                onClick={() => setIdx(n)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
                  n === idx ? "bg-peri-700 text-white border-peri-700" : "bg-white border-teal-200 text-navy hover:border-peri-500"
                }`}
              >
                {i.who.split(",")[0].split("(")[0].trim()}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <h4 className="font-bold text-teal-900">{inf.who}</h4>
            <blockquote className="mt-3 border-l-4 border-coral-400 bg-coral-400/10 rounded-r-lg p-4 text-navy/90 italic leading-relaxed">
              &ldquo;{inf.quote}&rdquo;
            </blockquote>
            <p className="mt-3 text-sm text-navy/85 leading-relaxed">{inf.insight}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="text-[11px] font-bold text-navy/60 self-center mr-1">ILLUMINATES:</span>
              {inf.principleIds.map((pid) => {
                const p = principleById(pid);
                return (
                  <span key={pid} className="text-xs rounded-full bg-teal-50 border border-teal-200 px-3 py-1 font-medium text-teal-900">
                    {p.num}. {p.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
