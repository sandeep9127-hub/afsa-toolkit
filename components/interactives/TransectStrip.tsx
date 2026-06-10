"use client";

import { useRef, useState } from "react";
import { TRANSECT } from "@/data/khetlapur";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode } from "@/components/Assess";

// stylised elevation profile: heights/colors per Khetlapur niche
const PROFILE: Record<string, { h: number; fill: string }> = {
  forest: { h: 150, fill: "#2e7573" },
  upland: { h: 110, fill: "#95b1af" },
  "upper-paddy": { h: 85, fill: "#b8ccca" },
  "lower-paddy": { h: 55, fill: "#e1ede8" },
  pond: { h: 38, fill: "#929cc5" },
  homestead: { h: 70, fill: "#c68f95" },
  commons: { h: 95, fill: "#f8ca7c" },
};
// palette cycle for user-defined niches (descending then varied, like a real walk)
const USER_PROFILE = [
  { h: 150, fill: "#2e7573" }, { h: 115, fill: "#95b1af" }, { h: 88, fill: "#b8ccca" },
  { h: 58, fill: "#e1ede8" }, { h: 40, fill: "#929cc5" }, { h: 72, fill: "#c68f95" },
  { h: 98, fill: "#f8ca7c" }, { h: 64, fill: "#afbadc" },
];

type Niche = { name: string; soil: string; observations: string; change20: string };

const STARTER: Niche[] = [
  { name: "Forest / ridge", soil: "", observations: "", change20: "" },
  { name: "Upland fields", soil: "", observations: "", change20: "" },
  { name: "Lowland fields", soil: "", observations: "", change20: "" },
  { name: "Homesteads", soil: "", observations: "", change20: "" },
];

function Strip({ niches, sel, setSel }: {
  niches: { name: string; h: number; fill: string; id: string }[];
  sel: string; setSel: (id: string) => void;
}) {
  const W = 760, H = 210, base = 195;
  const bandW = W / Math.max(1, niches.length);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-130" role="img" aria-label="Transect elevation strip">
      {niches.map((t, i) => {
        const x = i * bandW;
        const isSel = sel === t.id;
        return (
          <g key={t.id} onClick={() => setSel(t.id)} className="cursor-pointer">
            <rect x={x} y={base - t.h} width={bandW} height={t.h} fill={t.fill} opacity={isSel ? 1 : 0.55} stroke="white" strokeWidth={1.5} rx={3} />
            <text x={x + bandW / 2} y={base - t.h - 8} textAnchor="middle" fontSize={10.5}
              fontWeight={isSel ? 800 : 600} fill={isSel ? "#2e7573" : "#373f5a"}>
              {t.name.split(" ").slice(0, 2).join(" ")}
            </text>
            {isSel && <circle cx={x + bandW / 2} cy={base + 8} r={4} fill="#f8a07b" />}
          </g>
        );
      })}
      <line x1={0} y1={base} x2={W} y2={base} stroke="#373f5a" strokeWidth={1.5} />
      <text x={6} y={H - 1} fontSize={9.5} fill="#95b1af">the walking route — never a straight line</text>
    </svg>
  );
}

export default function TransectStrip() {
  const [mode, setMode] = useMode();
  const [sel, setSel] = useState(TRANSECT[0].id);
  const [yourSel, setYourSel] = useState("0");
  const [niches, setNiches] = useLocalState<Niche[]>("afsa.transect.niches", STARTER);
  const [meta, setMeta] = useMeta();
  const chartRef = useRef<HTMLDivElement>(null);
  const yours = mode === "yours";

  const active = TRANSECT.find((t) => t.id === sel)!;
  const update = (i: number, patch: Partial<Niche>) =>
    setNiches(niches.map((n, j) => (j === i ? { ...n, ...patch } : n)));

  const tableHtml = () =>
    rowsToTable(
      ["Niche", "Soil type", "Observations", "Change in 20 years"],
      niches.filter((n) => n.name.trim()).map((n) => [n.name, n.soil || "—", n.observations || "—", n.change20 || "—"])
    );

  const inputCls = "w-full rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:border-teal-600";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
        {yours && <span className="text-xs text-navy/60">One row per ecological niche, in the order you walked them.</span>}
      </div>

      {yours ? (
        <div>
          <div className="mb-5 rounded-(--radius-soft) border border-coral-400/50 bg-coral-400/8 p-4">
            <MetaFields meta={meta} setMeta={setMeta} />
          </div>

          <div ref={chartRef} className="rounded-(--radius-soft) border border-teal-200 bg-white p-4">
            <ChartCaption meta={meta} toolName="Transect Walk" />
            <div className="overflow-x-auto">
              <Strip
                niches={niches.filter((n) => n.name.trim()).map((n, i) => ({
                  id: String(i), name: n.name, ...USER_PROFILE[i % USER_PROFILE.length],
                }))}
                sel={yourSel}
                setSel={setYourSel}
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {niches.map((n, i) => (
              <div key={i} className="rounded-(--radius-soft) border border-teal-50 bg-white p-3.5">
                <div className="flex flex-wrap gap-2.5">
                  <input type="text" value={n.name} placeholder="Niche — e.g. Upper paddy terraces"
                    onChange={(e) => update(i, { name: e.target.value })} className={`${inputCls} flex-1 min-w-44 font-semibold`} />
                  <input type="text" value={n.soil} placeholder="Soil type"
                    onChange={(e) => update(i, { soil: e.target.value })} className={`${inputCls} w-40`} />
                  <button onClick={() => setNiches(niches.filter((_, j) => j !== i))}
                    className="text-navy/40 hover:text-coral-400 font-bold px-1.5" aria-label="Remove niche">✕</button>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <textarea value={n.observations} rows={2}
                    placeholder="Observations — food/fodder grown, water, waste, wildlife, problems…"
                    onChange={(e) => update(i, { observations: e.target.value })} className={`${inputCls} text-xs`} />
                  <textarea value={n.change20} rows={2}
                    placeholder="Change in the last 20 years…"
                    onChange={(e) => update(i, { change20: e.target.value })} className={`${inputCls} text-xs`} />
                </div>
              </div>
            ))}
            <button onClick={() => setNiches([...niches, { name: "", soil: "", observations: "", change20: "" }])}
              className="rounded-full border border-teal-200 px-4 py-1.5 text-sm font-semibold text-teal-600 hover:border-teal-600 transition-colors">
              + Add niche
            </button>
          </div>

          <div className="mt-5">
            <ExportBar chartRef={chartRef} meta={meta} toolName="Transect Walk" filename="afsa-transect-walk" getTableHtml={tableHtml} />
          </div>
        </div>
      ) : (
        <div className="rounded-(--radius-soft) border border-teal-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Strip
              niches={TRANSECT.map((t) => ({ id: t.id, name: t.name, ...PROFILE[t.id] }))}
              sel={sel}
              setSel={setSel}
            />
          </div>
          <div className="border-t border-teal-50 p-4 sm:p-5">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <h4 className="font-bold text-teal-900">{active.name}</h4>
              <span className="text-xs text-navy/60">Soil: {active.soil}</span>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-navy/85">
              {active.observations.map((o) => (
                <li key={o} className="flex gap-2"><span className="text-teal-600 font-bold shrink-0">·</span>{o}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm rounded-lg bg-amber-300/20 border border-amber-300/60 p-3 text-navy/85">
              <span className="font-bold text-xs">CHANGE IN 20 YEARS: </span>{active.change20}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
