"use client";

import { useMemo, useRef, useState } from "react";
import { PRINCIPLES } from "@/data/principles";
import { SCORES, SCORE_THRESHOLD_LOW } from "@/data/khetlapur";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode, type Mode } from "@/components/Assess";

const KHETLAPUR = PRINCIPLES.map((p) => SCORES.find((s) => s.principleId === p.id)!.score);

const CX = 330, CY = 250, R = 165;
const N = PRINCIPLES.length;

function point(i: number, value: number, max = 4) {
  const angle = (Math.PI * 2 * i) / N - Math.PI / 2;
  const r = (value / max) * R;
  return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)] as const;
}

function polygon(values: number[]) {
  return values.map((v, i) => point(i, v).join(",")).join(" ");
}

function RadarChart({
  values,
  overlay,
  activeIdx,
  setActiveIdx,
}: {
  values: number[];
  overlay?: number[] | null;
  activeIdx: number | null;
  setActiveIdx: (i: number | null) => void;
}) {
  return (
    <svg viewBox="0 0 660 500" role="img" aria-label="Radar diagram of 13 agroecology principle scores" className="w-full">
      {[1, 2, 3, 4].map((ring) => (
        <polygon
          key={ring}
          points={polygon(Array(N).fill(ring))}
          fill="none"
          stroke={ring === 4 ? "#b8ccca" : "#e1ede8"}
          strokeWidth={ring === 4 ? 1.5 : 1}
        />
      ))}
      {PRINCIPLES.map((p, i) => {
        const [x, y] = point(i, 4);
        const [lx, ly] = point(i, 4.85);
        const low = values[i] <= SCORE_THRESHOLD_LOW;
        const active = activeIdx === i;
        return (
          <g key={p.id} onMouseEnter={() => setActiveIdx(i)} onMouseLeave={() => setActiveIdx(null)} className="cursor-default">
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="#e1ede8" strokeWidth={1} />
            <text
              x={lx}
              y={ly}
              textAnchor={lx < CX - 12 ? "end" : lx > CX + 12 ? "start" : "middle"}
              dominantBaseline={ly < CY ? "auto" : "hanging"}
              fontSize={11.5}
              fontWeight={active || low ? 700 : 500}
              fill={low ? "#c47b35" : active ? "#2e7573" : "#373f5a"}
            >
              {p.name.length > 22 ? p.name.slice(0, 20) + "…" : p.name}
            </text>
          </g>
        );
      })}
      {overlay && (
        <polygon points={polygon(overlay)} fill="none" stroke="#929cc5" strokeWidth={1.5} strokeDasharray="5 4" />
      )}
      <polygon points={polygon(values)} fill="#2e7573" fillOpacity={0.32} stroke="#2e7573" strokeWidth={2.5} strokeLinejoin="round" />
      {values.map((v, i) => {
        const [x, y] = point(i, v);
        const low = v <= SCORE_THRESHOLD_LOW;
        return (
          <circle key={i} cx={x} cy={y} r={activeIdx === i ? 7 : 5} fill={low ? "#f8ca7c" : "#2e7573"} stroke="white" strokeWidth={2} />
        );
      })}
      {[1, 2, 3, 4].map((ring) => (
        <text key={ring} x={CX + 4} y={CY - (ring / 4) * R - 3} fontSize={9.5} fill="#95b1af">{ring}</text>
      ))}
    </svg>
  );
}

export default function ScorecardRadar() {
  const [mode, setMode] = useMode();
  const [exampleValues, setExampleValues] = useState<number[]>([...KHETLAPUR]);
  const [yourValues, setYourValues] = useLocalState<number[]>("afsa.scorecard.values", Array(N).fill(2));
  const [yourNotes, setYourNotes] = useLocalState<string[]>("afsa.scorecard.notes", Array(N).fill(""));
  const [meta, setMeta] = useMeta();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const yours = mode === "yours";
  const values = yours ? yourValues : exampleValues;
  const setValue = (i: number, v: number) => {
    if (yours) setYourValues(yourValues.map((x, j) => (j === i ? v : x)));
    else setExampleValues(exampleValues.map((x, j) => (j === i ? v : x)));
  };

  const isKhetlapur = !yours && values.every((v, i) => v === KHETLAPUR[i]);
  const avg = useMemo(() => values.reduce((a, b) => a + b, 0) / N, [values]);

  const tableHtml = () =>
    rowsToTable(
      ["Principle", "Score (0–4)", "On what account good / poor"],
      PRINCIPLES.map((p, i) => [`${p.num}. ${p.name}`, yourValues[i], yourNotes[i] || "—"])
    );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
        {yours && <span className="text-xs text-navy/60">Score each principle with your community, note why, then export.</span>}
      </div>

      {yours && (
        <div className="mb-5 rounded-(--radius-soft) border border-coral-400/50 bg-coral-400/8 p-4">
          <MetaFields meta={meta} setMeta={setMeta} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[6fr_5fr] items-start">
        <div className="lg:sticky lg:top-24">
          <div ref={chartRef} className="rounded-(--radius-soft) border border-teal-200 bg-white p-4 sm:p-6">
            {yours && <ChartCaption meta={meta} toolName="Agroecology Principles Scorecard" />}
            <RadarChart
              values={values}
              overlay={!yours && !isKhetlapur ? KHETLAPUR : null}
              activeIdx={activeIdx}
              setActiveIdx={setActiveIdx}
            />
            <div className="flex items-center justify-between flex-wrap gap-2 px-1">
              <div className="flex items-center gap-4 text-xs text-navy/70">
                <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-amber-300 inline-block" /> at/below {SCORE_THRESHOLD_LOW} — diagnosis entry point</span>
                {!yours && !isKhetlapur && <span className="flex items-center gap-1.5"><span className="inline-block w-5 border-t-2 border-dashed border-peri-500" /> Khetlapur actual</span>}
              </div>
              <p className="text-xs font-bold text-teal-600">System health: {avg.toFixed(1)} / 4</p>
            </div>
          </div>
          {!yours && !isKhetlapur && (
            <button
              onClick={() => setExampleValues([...KHETLAPUR])}
              className="mt-3 rounded-full bg-teal-600 text-white text-sm font-semibold px-5 py-2 hover:bg-teal-900 transition-colors"
            >
              Reset to Khetlapur
            </button>
          )}
          {yours && (
            <div className="mt-4">
              <ExportBar
                chartRef={chartRef}
                meta={meta}
                toolName="Agroecology Principles Scorecard"
                filename="afsa-scorecard"
                getTableHtml={tableHtml}
              />
            </div>
          )}
        </div>

        <div className="space-y-2.5">
          {PRINCIPLES.map((p, i) => {
            const score = SCORES.find((s) => s.principleId === p.id)!;
            const low = values[i] <= SCORE_THRESHOLD_LOW;
            return (
              <div
                key={p.id}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                className={`rounded-xl border p-3.5 transition-colors ${
                  low ? "border-amber-300 bg-amber-300/15" : "border-teal-50 bg-white"
                } ${activeIdx === i ? "ring-2 ring-teal-200" : ""}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-teal-900">{p.num}. {p.name}</p>
                  <span className={`text-sm font-bold tabular-nums ${low ? "text-[#c47b35]" : "text-teal-600"}`}>
                    {values[i].toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={4}
                  step={0.5}
                  value={values[i]}
                  onChange={(e) => setValue(i, Number(e.target.value))}
                  className="mt-2 w-full accent-teal-600"
                  aria-label={`Score for ${p.name}`}
                />
                {yours ? (
                  <input
                    type="text"
                    value={yourNotes[i]}
                    placeholder="On what account good/poor? (goes into the report)"
                    onChange={(e) => setYourNotes(yourNotes.map((n, j) => (j === i ? e.target.value : n)))}
                    className="mt-2 w-full rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-xs focus:outline-none focus:border-teal-600"
                  />
                ) : (
                  activeIdx === i && (
                    <p className="mt-2 text-xs text-navy/75 leading-relaxed">
                      <span className="font-bold text-peri-700">Why Khetlapur scored {score.score}: </span>
                      {score.why}
                    </p>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
