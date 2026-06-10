"use client";

import { useRef, useState } from "react";
import { FOOD_CHAIN } from "@/data/khetlapur";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { XIcon, PlusIcon } from "@/components/Icons";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode } from "@/components/Assess";

type Step = { stage: string; form: string; actor: string; tech: string; waste: string; valuePerKg: number; challenge: string };

const STARTER: Step[] = [
  { stage: "Production", form: "", actor: "", tech: "", waste: "", valuePerKg: 0, challenge: "" },
  { stage: "Processing", form: "", actor: "", tech: "", waste: "", valuePerKg: 0, challenge: "" },
  { stage: "Retail", form: "", actor: "", tech: "", waste: "", valuePerKg: 0, challenge: "" },
];

export default function FoodChain() {
  const [mode, setMode] = useMode();
  const [idx, setIdx] = useState(0);
  const [yourFood, setYourFood] = useLocalState<string>("afsa.trackfood.name", "");
  const [steps, setSteps] = useLocalState<Step[]>("afsa.trackfood.steps", STARTER);
  const [meta, setMeta] = useMeta();
  const chartRef = useRef<HTMLDivElement>(null);
  const yours = mode === "yours";

  const step = FOOD_CHAIN[idx];
  const maxVal = Math.max(...FOOD_CHAIN.map((s) => s.valuePerKg));
  const named = steps.filter((s) => s.stage.trim());
  const yourMax = Math.max(1, ...named.map((s) => s.valuePerKg));

  const update = (i: number, patch: Partial<Step>) =>
    setSteps(steps.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const tableHtml = () =>
    rowsToTable(
      ["Step", "Form of product", "Actor", "Technology & energy", "Waste & its use", "Value/unit (₹)", "Gaps & challenges"],
      named.map((s) => [s.stage, s.form || "—", s.actor || "—", s.tech || "—", s.waste || "—", s.valuePerKg || "—", s.challenge || "—"])
    );

  const inputCls = "rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:border-teal-600";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
        {yours && <span className="text-xs text-navy/60">One card per step, from input to consumer — value per unit draws the chain.</span>}
      </div>

      {yours ? (
        <div>
          <div className="mb-5 rounded-(--radius-soft) border border-coral-400/50 bg-coral-400/8 p-4">
            <MetaFields meta={meta} setMeta={setMeta} />
            <label className="block mt-3">
              <span className="text-[11px] font-bold text-navy/60">FOOD BEING TRACKED</span>
              <input type="text" value={yourFood} placeholder="e.g. Paddy → rice, black gram → dal"
                onChange={(e) => setYourFood(e.target.value)}
                className="mt-1 w-full max-w-sm rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-teal-600" />
            </label>
          </div>

          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="rounded-(--radius-soft) border border-teal-50 bg-white p-3.5">
                <div className="flex flex-wrap gap-2.5">
                  <input type="text" value={s.stage} placeholder={`Step ${i + 1} — e.g. Aggregation`}
                    onChange={(e) => update(i, { stage: e.target.value })} className={`${inputCls} flex-1 min-w-36 font-semibold`} />
                  <input type="text" value={s.form} placeholder="Form of product"
                    onChange={(e) => update(i, { form: e.target.value })} className={`${inputCls} w-40`} />
                  <span className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-navy/60">₹</span>
                    <input type="number" min={0} value={s.valuePerKg || ""} placeholder="0" aria-label="value per unit"
                      onChange={(e) => update(i, { valuePerKg: Math.max(0, Number(e.target.value) || 0) })}
                      className={`${inputCls} w-24 text-center`} />
                    <span className="text-[10px] text-navy/55">/unit</span>
                  </span>
                  <button onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                    className="grid place-items-center size-7 rounded-md text-navy/40 hover:text-coral-400 hover:bg-coral-400/10 active:scale-90 transition-all outline-none focus-visible:ring-2 focus-visible:ring-coral-400" aria-label="Remove step"><XIcon className="size-4" /></button>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <input type="text" value={s.actor} placeholder="Actor doing this step"
                    onChange={(e) => update(i, { actor: e.target.value })} className={`${inputCls} text-xs`} />
                  <input type="text" value={s.tech} placeholder="Technology & energy"
                    onChange={(e) => update(i, { tech: e.target.value })} className={`${inputCls} text-xs`} />
                  <input type="text" value={s.waste} placeholder="Waste & its use"
                    onChange={(e) => update(i, { waste: e.target.value })} className={`${inputCls} text-xs`} />
                  <input type="text" value={s.challenge} placeholder="Gaps & challenges"
                    onChange={(e) => update(i, { challenge: e.target.value })} className={`${inputCls} text-xs`} />
                </div>
              </div>
            ))}
            <button onClick={() => setSteps([...steps, { stage: "", form: "", actor: "", tech: "", waste: "", valuePerKg: 0, challenge: "" }])}
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 px-4 py-1.5 text-sm font-semibold text-teal-600 hover:border-teal-600 hover:bg-teal-50 active:translate-y-px transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-400"><PlusIcon className="size-4" /> Add step</button>
          </div>

          <div ref={chartRef} className="mt-4 rounded-(--radius-soft) border border-teal-200 bg-white p-5">
            <ChartCaption meta={meta} toolName={`Track a Food${yourFood ? ` — ${yourFood}` : ""}`} />
            <div className="flex items-stretch gap-1.5 overflow-x-auto pb-1">
              {named.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 shrink-0">
                  <div className="rounded-xl border border-teal-200 bg-teal-50/60 px-3 py-2 min-w-24 text-center">
                    <p className="text-xs font-bold text-teal-900">{s.stage}</p>
                    {s.form && <p className="text-[10px] mt-0.5 text-navy/60">{s.form}</p>}
                  </div>
                  {i < named.length - 1 && <span className="text-teal-400 font-bold">→</span>}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs font-bold text-navy/60 mb-1.5">VALUE PER UNIT ALONG THE CHAIN</p>
            <div className="flex items-end gap-1.5 h-20">
              {named.map((s, i) => (
                <div key={i} className="flex-1 rounded-t-md bg-teal-400" title={`${s.stage}: ₹${s.valuePerKg}`}
                  style={{ height: `${Math.max(6, (s.valuePerKg / yourMax) * 100)}%` }} />
              ))}
            </div>
            <div className="flex gap-1.5 text-[10px] text-navy/60 tabular-nums">
              {named.map((s, i) => (
                <span key={i} className="flex-1 text-center">{s.valuePerKg ? `₹${s.valuePerKg}` : "—"}</span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <ExportBar chartRef={chartRef} meta={meta} toolName="Track a Food" filename="afsa-track-a-food" getTableHtml={tableHtml} />
          </div>
        </div>
      ) : (
        <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-5 sm:p-6">
          <p className="text-sm font-semibold text-teal-900">Black gram → dal, through Khetlapur&apos;s value chain</p>

          <div className="mt-4 flex items-stretch gap-1.5 overflow-x-auto pb-2">
            {FOOD_CHAIN.map((s, i) => (
              <div key={s.stage} className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setIdx(i)}
                  className={`rounded-xl border px-3 py-2.5 min-w-24 text-center transition-colors ${
                    i === idx ? "bg-teal-600 text-white border-teal-600" : "bg-white border-teal-200 text-teal-900 hover:border-teal-600"
                  }`}
                >
                  <p className="text-xs font-bold">{s.stage}</p>
                  <p className={`text-[10px] mt-0.5 ${i === idx ? "text-teal-50" : "text-navy/60"}`}>{s.form}</p>
                </button>
                {i < FOOD_CHAIN.length - 1 && <span className="text-teal-400 font-bold">→</span>}
              </div>
            ))}
          </div>

          <div className="mt-3">
            <p className="text-xs font-bold text-navy/60 mb-1.5">VALUE PER KG ALONG THE CHAIN</p>
            <div className="flex items-end gap-1.5 h-20">
              {FOOD_CHAIN.map((s, i) => (
                <button
                  key={s.stage}
                  onClick={() => setIdx(i)}
                  className={`flex-1 rounded-t-md transition-all ${i === idx ? "bg-coral-400" : "bg-teal-200 hover:bg-teal-400"}`}
                  style={{ height: `${Math.max(6, (s.valuePerKg / maxVal) * 100)}%` }}
                  title={`${s.stage}: ₹${s.valuePerKg}/kg`}
                  aria-label={`${s.stage}: ${s.valuePerKg} rupees per kg`}
                />
              ))}
            </div>
            <div className="flex gap-1.5 text-[10px] text-navy/60 tabular-nums">
              {FOOD_CHAIN.map((s) => (
                <span key={s.stage} className="flex-1 text-center">{s.valuePerKg ? `₹${s.valuePerKg}` : "—"}</span>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-lg bg-teal-50/70 border border-teal-200 p-3.5 space-y-1.5">
              <p><span className="font-bold text-xs text-navy/60">ACTOR · </span><span className="text-navy/90">{step.actor}</span></p>
              <p><span className="font-bold text-xs text-navy/60">TECHNOLOGY & ENERGY · </span><span className="text-navy/90">{step.tech}</span></p>
              <p><span className="font-bold text-xs text-navy/60">WASTE & ITS USE · </span><span className="text-navy/90">{step.waste}</span></p>
            </div>
            <div className="rounded-lg bg-amber-300/20 border border-amber-300/60 p-3.5">
              <p className="font-bold text-xs text-navy mb-1">GAP / CHALLENGE AT THIS STEP</p>
              <p className="text-navy/90 leading-relaxed">{step.challenge}</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-navy/85 border-t border-teal-50 pt-3.5 leading-relaxed">
            The farmer sells whole grain at <strong>₹62/kg</strong>; the village buys its own black gram back as dal at{" "}
            <strong>₹130/kg</strong>. The milling — and the margin — happens 18 km away. That gap is what the youth
            group&apos;s dal-mill vision is aimed at.
          </p>
        </div>
      )}
    </div>
  );
}
