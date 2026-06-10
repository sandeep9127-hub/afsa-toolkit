"use client";

import { useMemo, useRef, useState } from "react";
import { DQQ_ITEMS, DQQ_INDIA, DQQ_KHETLAPUR, type DqqBenchmark } from "@/data/khetlapur";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode } from "@/components/Assess";

const FOOD_ITEMS = DQQ_ITEMS.filter((i) => !i.risk);
const RISK_ITEMS = DQQ_ITEMS.filter((i) => i.risk);

const INDICATORS: { key: keyof DqqBenchmark; label: string; max: number; pct?: boolean; lowerBetter?: boolean }[] = [
  { key: "dds", label: "Dietary diversity (of 10)", max: 10 },
  { key: "mdd", label: "MDD — % with ≥5 groups", max: 100, pct: true },
  { key: "all5", label: "All-5 — % with all five", max: 100, pct: true },
  { key: "protect", label: "NCD-Protect (of 9)", max: 9 },
  { key: "risk", label: "NCD-Risk (of 9)", max: 9, lowerBetter: true },
  { key: "gdr", label: "GDR score (of 18)", max: 18 },
  { key: "zeroVegFruit", label: "Zero veg or fruit — %", max: 100, pct: true, lowerBetter: true },
];

const EMPTY_RESULTS: DqqBenchmark = { dds: 0, mdd: 0, all5: 0, protect: 0, risk: 0, gdr: 9, zeroVegFruit: 0 };

function YourDqqResults() {
  const [results, setResults] = useLocalState<DqqBenchmark>("afsa.dqq.results", EMPTY_RESULTS);
  const [meta, setMeta] = useMeta();
  const chartRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof DqqBenchmark, v: number) => setResults({ ...results, [key]: v });

  const tableHtml = () =>
    rowsToTable(
      ["Indicator", meta.landscape || "Your landscape", "Khetlapur (fictional)", "India national (2021)"],
      INDICATORS.map((ind) => [
        ind.label,
        `${results[ind.key]}${ind.pct ? "%" : ""}`,
        `${DQQ_KHETLAPUR[ind.key]}${ind.pct ? "%" : ""}`,
        `${DQQ_INDIA[ind.key]}${ind.pct ? "%" : ""}`,
      ])
    );

  return (
    <div>
      <div className="mb-5 rounded-(--radius-soft) border border-coral-400/50 bg-coral-400/8 p-4">
        <MetaFields meta={meta} setMeta={setMeta} />
        <p className="mt-3 text-xs text-navy/70 leading-relaxed">
          Collect the DQQ itself in <strong>KoboToolbox</strong>; compute the indicators from its export, then
          enter the aggregated values here to generate a comparison figure for your report.
        </p>
      </div>

      <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INDICATORS.map((ind) => (
            <label key={ind.key} className="block">
              <span className="text-[11px] font-bold text-navy/60 leading-tight block">{ind.label.toUpperCase()}</span>
              <input
                type="number" min={0} max={ind.max} step={ind.pct ? 1 : 0.1}
                value={results[ind.key] || ""}
                placeholder="0"
                onChange={(e) => set(ind.key, Math.max(0, Math.min(ind.max, Number(e.target.value) || 0)))}
                className="mt-1 w-full rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-teal-600"
              />
            </label>
          ))}
        </div>
      </div>

      <div ref={chartRef} className="mt-4 rounded-(--radius-soft) border border-teal-200 bg-white p-5">
        <ChartCaption meta={meta} toolName="Diet Quality — DQQ indicators vs benchmarks" />
        <div className="space-y-3.5">
          {INDICATORS.map((ind) => {
            const rows = [
              { label: meta.landscape || "Your landscape", v: results[ind.key], cls: "bg-coral-400" },
              { label: "Khetlapur", v: DQQ_KHETLAPUR[ind.key], cls: "bg-teal-400" },
              { label: "India", v: DQQ_INDIA[ind.key], cls: "bg-peri-500" },
            ];
            return (
              <div key={ind.key}>
                <p className="text-xs font-semibold text-teal-900">{ind.label}{ind.lowerBetter ? " · lower is better" : ""}</p>
                <div className="mt-1 space-y-1">
                  {rows.map((r) => (
                    <div key={r.label} className="flex items-center gap-2">
                      <span className="w-28 shrink-0 text-[11px] text-navy/60 truncate">{r.label}</span>
                      <div className="flex-1 h-3 rounded-full bg-teal-50 overflow-hidden">
                        <div className={`h-full rounded-full ${r.cls}`} style={{ width: `${Math.min(100, (r.v / ind.max) * 100)}%` }} />
                      </div>
                      <span className="w-12 text-right text-[11px] font-bold tabular-nums text-navy/80">{r.v}{ind.pct ? "%" : ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <ExportBar chartRef={chartRef} meta={meta} toolName="Diet Quality Questionnaire — Indicators" filename="afsa-dqq-indicators" getTableHtml={tableHtml} />
      </div>
    </div>
  );
}

export default function DqqQuiz() {
  const [mode, setMode] = useMode();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const r = useMemo(() => {
    const sel = DQQ_ITEMS.filter((i) => checked.has(i.id));
    const mddGroups = new Set(sel.filter((i) => i.mddGroup).map((i) => i.mddGroup));
    const all5cats = new Set(sel.map((i) => i.all5).filter(Boolean));
    const protect = sel.filter((i) => i.protect).length;
    const risk = sel.filter((i) => i.risk).length;
    return {
      dds: mddGroups.size,
      mdd: mddGroups.size >= 5,
      all5: (["staple", "veg", "fruit", "pulse", "asf"] as const).every((c) => all5cats.has(c)),
      protect,
      risk,
      gdr: protect - risk + 9,
      zeroVegFruit: !sel.some((i) => i.all5 === "veg" || i.all5 === "fruit"),
    };
  }, [checked]);

  const touched = checked.size > 0;
  const yoursMode = mode === "yours";

  const Row = ({ label, you, khet, india, max, good }: { label: string; you: string; khet: string; india: string; max?: string; good?: boolean | null }) => (
    <tr className="border-t border-peri-200/60">
      <td className="py-2 pr-2 font-medium text-navy/85">{label}{max && <span className="text-navy/45"> {max}</span>}</td>
      <td className={`py-2 pr-2 text-center font-bold tabular-nums ${!touched ? "text-navy/30" : good === false ? "text-[#c47b35]" : "text-teal-600"}`}>{touched ? you : "—"}</td>
      <td className="py-2 pr-2 text-center tabular-nums text-navy/70">{khet}</td>
      <td className="py-2 text-center tabular-nums text-navy/70">{india}</td>
    </tr>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
        {yoursMode && <span className="text-xs text-navy/60">Enter the indicators computed from your KoboToolbox collection.</span>}
      </div>
      {yoursMode ? (
        <YourDqqResults />
      ) : (
    <div className="grid gap-5 lg:grid-cols-[7fr_5fr]">
      <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-4 sm:p-5">
        <p className="text-sm font-semibold text-teal-900 mb-3">
          Yesterday — from waking up through the night — did you eat or drink any…
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {FOOD_ITEMS.map((g) => (
            <button
              key={g.id}
              onClick={() => toggle(g.id)}
              className={`text-left rounded-xl border px-3.5 py-2.5 transition-colors ${
                checked.has(g.id) ? "bg-teal-600 border-teal-600 text-white" : "bg-white border-teal-200 text-teal-900 hover:border-teal-600"
              }`}
            >
              <p className="text-sm font-semibold">{checked.has(g.id) ? "✓ " : ""}{g.label}</p>
              <p className={`text-xs mt-0.5 ${checked.has(g.id) ? "text-teal-50" : "text-navy/60"}`}>{g.examples}</p>
            </button>
          ))}
        </div>
        <p className="text-sm font-semibold text-teal-900 mt-5 mb-3">…and any of these snacks, sweets and drinks?</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {RISK_ITEMS.map((g) => (
            <button
              key={g.id}
              onClick={() => toggle(g.id)}
              className={`text-left rounded-xl border px-3.5 py-2.5 transition-colors ${
                checked.has(g.id) ? "bg-coral-400 border-coral-400 text-white" : "bg-white border-amber-300/80 text-teal-900 hover:border-coral-400"
              }`}
            >
              <p className="text-sm font-semibold">{checked.has(g.id) ? "✓ " : ""}{g.label}</p>
              <p className={`text-xs mt-0.5 ${checked.has(g.id) ? "text-white/85" : "text-navy/60"}`}>{g.examples}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-(--radius-soft) border border-peri-200 bg-peri-100/30 p-5 self-start">
        <p className="text-xs font-bold text-navy/60">YOUR DQQ INDICATORS</p>
        <div className="mt-2 flex items-end gap-6">
          <div>
            <p className="text-[11px] font-bold text-navy/55">DIETARY DIVERSITY</p>
            <p className="text-4xl font-extrabold text-teal-600">{r.dds}<span className="text-base text-navy/50 font-bold"> / 10</span></p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-navy/55">GDR SCORE</p>
            <p className={`text-4xl font-extrabold ${touched ? "text-peri-700" : "text-navy/30"}`}>{touched ? r.gdr : "—"}<span className="text-base text-navy/50 font-bold"> / 18</span></p>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-bold">
          <span className={`rounded-full px-2.5 py-1 ${r.mdd ? "bg-teal-600 text-white" : "bg-white border border-peri-200 text-navy/60"}`}>
            MDD {r.mdd ? "✓ met" : "below 5 groups"}
          </span>
          <span className={`rounded-full px-2.5 py-1 ${r.all5 ? "bg-teal-600 text-white" : "bg-white border border-peri-200 text-navy/60"}`}>
            All-5 {r.all5 ? "✓" : "✗"}
          </span>
          {touched && r.zeroVegFruit && (
            <span className="rounded-full px-2.5 py-1 bg-amber-300/60 text-navy">zero vegetables or fruit</span>
          )}
        </div>

        <table className="mt-4 w-full text-xs">
          <thead>
            <tr className="text-[10px] font-bold text-navy/55">
              <th className="text-left pb-1.5">INDICATOR</th>
              <th className="pb-1.5 px-1">YOU</th>
              <th className="pb-1.5 px-1">KHETLAPUR</th>
              <th className="pb-1.5 px-1">INDIA</th>
            </tr>
          </thead>
          <tbody>
            <Row label="Dietary diversity" max="(of 10)" you={`${r.dds}`} khet={`${DQQ_KHETLAPUR.dds}`} india={`${DQQ_INDIA.dds}`} good={r.dds >= 5 ? true : touched ? false : null} />
            <Row label="NCD-Protect" max="(of 9)" you={`${r.protect}`} khet={`${DQQ_KHETLAPUR.protect}`} india={`${DQQ_INDIA.protect}`} good={r.protect >= 4} />
            <Row label="NCD-Risk" max="(lower is better)" you={`${r.risk}`} khet={`${DQQ_KHETLAPUR.risk}`} india={`${DQQ_INDIA.risk}`} good={r.risk <= 1} />
            <Row label="GDR score" max="(of 18)" you={`${r.gdr}`} khet={`${DQQ_KHETLAPUR.gdr}`} india={`${DQQ_INDIA.gdr}`} good={r.gdr >= 11} />
            <Row label="MDD (≥5 groups)" you={r.mdd ? "yes" : "no"} khet={`${DQQ_KHETLAPUR.mdd}%`} india={`${DQQ_INDIA.mdd}%`} good={r.mdd} />
            <Row label="All-5" you={r.all5 ? "yes" : "no"} khet={`${DQQ_KHETLAPUR.all5}%`} india={`${DQQ_INDIA.all5}%`} good={r.all5} />
            <Row label="Zero veg or fruit" you={r.zeroVegFruit ? "yes" : "no"} khet={`${DQQ_KHETLAPUR.zeroVegFruit}%`} india={`${DQQ_INDIA.zeroVegFruit}%`} good={touched ? !r.zeroVegFruit : null} />
          </tbody>
        </table>

        <div className="mt-4 border-t border-peri-200 pt-3 text-xs text-navy/75 leading-relaxed space-y-2">
          <p>
            <strong>Reading Khetlapur:</strong> its GDR ({DQQ_KHETLAPUR.gdr}) sits near the national average ({DQQ_INDIA.gdr}) —
            but only because very low junk-food intake (NCD-Risk {DQQ_KHETLAPUR.risk}) masks very low protective-food intake
            (NCD-Protect {DQQ_KHETLAPUR.protect}). Always read GDR alongside its two halves.
          </p>
          <p>
            GDR = NCD-Protect − NCD-Risk + 9. This is a learning adaptation of the 29-item DQQ; the field version
            (dietquality.org) is country-adapted, and AFSA adds a <strong>source column</strong> per food — own farm,
            market, gathered, or support — to read market dependence. India values: Global Diet Quality Project, 2021.
          </p>
        </div>
      </div>
    </div>
      )}
    </div>
  );
}
