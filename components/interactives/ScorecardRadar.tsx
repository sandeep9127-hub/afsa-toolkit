"use client";

import { useMemo, useState } from "react";
import { PRINCIPLES } from "@/data/principles";
import { SCORES, SCORE_THRESHOLD_LOW } from "@/data/khetlapur";

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

export default function ScorecardRadar() {
  const [values, setValues] = useState<number[]>([...KHETLAPUR]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const isKhetlapur = values.every((v, i) => v === KHETLAPUR[i]);
  const avg = useMemo(() => values.reduce((a, b) => a + b, 0) / N, [values]);

  const set = (i: number, v: number) =>
    setValues((prev) => prev.map((x, j) => (j === i ? v : x)));

  return (
    <div className="grid gap-6 lg:grid-cols-[6fr_5fr] items-start">
      {/* Radar */}
      <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-4 sm:p-6 lg:sticky lg:top-24">
        <svg viewBox="0 0 660 500" role="img" aria-label="Radar diagram of 13 agroecology principle scores" className="w-full">
          {/* grid rings */}
          {[1, 2, 3, 4].map((ring) => (
            <polygon
              key={ring}
              points={polygon(Array(N).fill(ring))}
              fill="none"
              stroke={ring === 4 ? "#b8ccca" : "#e1ede8"}
              strokeWidth={ring === 4 ? 1.5 : 1}
            />
          ))}
          {/* axes + labels */}
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
          {/* Khetlapur reference (when user has diverged) */}
          {!isKhetlapur && (
            <polygon points={polygon(KHETLAPUR)} fill="none" stroke="#929cc5" strokeWidth={1.5} strokeDasharray="5 4" />
          )}
          {/* score polygon */}
          <polygon points={polygon(values)} fill="#2e7573" fillOpacity={0.32} stroke="#2e7573" strokeWidth={2.5} strokeLinejoin="round" />
          {/* vertices */}
          {values.map((v, i) => {
            const [x, y] = point(i, v);
            const low = v <= SCORE_THRESHOLD_LOW;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={activeIdx === i ? 7 : 5}
                fill={low ? "#f8ca7c" : "#2e7573"}
                stroke="white"
                strokeWidth={2}
              />
            );
          })}
          {/* ring scale */}
          {[1, 2, 3, 4].map((ring) => (
            <text key={ring} x={CX + 4} y={CY - (ring / 4) * R - 3} fontSize={9.5} fill="#95b1af">{ring}</text>
          ))}
        </svg>
        <div className="flex items-center justify-between flex-wrap gap-2 px-1">
          <div className="flex items-center gap-4 text-xs text-navy/70">
            <span className="flex items-center gap-1.5"><span className="size-3 rounded-full bg-amber-300 inline-block" /> at/below {SCORE_THRESHOLD_LOW} — diagnosis entry point</span>
            {!isKhetlapur && <span className="flex items-center gap-1.5"><span className="inline-block w-5 border-t-2 border-dashed border-peri-500" /> Khetlapur actual</span>}
          </div>
          <p className="text-xs font-bold text-teal-600">System health: {avg.toFixed(1)} / 4</p>
        </div>
        {!isKhetlapur && (
          <button
            onClick={() => setValues([...KHETLAPUR])}
            className="mt-3 rounded-full bg-teal-600 text-white text-sm font-semibold px-5 py-2 hover:bg-teal-900 transition-colors"
          >
            Reset to Khetlapur
          </button>
        )}
      </div>

      {/* Sliders */}
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
                onChange={(e) => set(i, Number(e.target.value))}
                className="mt-2 w-full accent-teal-600"
                aria-label={`Score for ${p.name}`}
              />
              {activeIdx === i && (
                <p className="mt-2 text-xs text-navy/75 leading-relaxed">
                  <span className="font-bold text-peri-700">Why Khetlapur scored {score.score}: </span>
                  {score.why}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
