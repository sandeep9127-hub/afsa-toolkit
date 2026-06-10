"use client";

import { useRef, useState } from "react";
import { SERVICES, type Service } from "@/data/khetlapur";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode, type Mode } from "@/components/Assess";

const W = 680, H = 420, CX = 340, CY = 210;

type YourService = { name: string; distanceKm: number; satisfaction: number; note: string };

const STARTER: YourService[] = [
  { name: "PDS ration shop", distanceKm: 1, satisfaction: 3, note: "" },
  { name: "Agriculture extension", distanceKm: 5, satisfaction: 3, note: "" },
  { name: "Weekly market", distanceKm: 3, satisfaction: 3, note: "" },
];

function RadialMap({
  services,
  sel,
  setSel,
}: {
  services: { name: string; distanceKm: number; satisfaction: number }[];
  sel: string | null;
  setSel: (s: string | null) => void;
}) {
  const maxKm = Math.max(15, ...services.map((s) => s.distanceKm));
  const rings = [Math.round(maxKm / 3), Math.round((maxKm * 2) / 3), maxKm];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-120" role="img" aria-label="Service map by distance and satisfaction">
      {rings.map((km) => (
        <g key={km}>
          <circle cx={CX} cy={CY} r={(km / maxKm) * 190} fill="none" stroke="#e1ede8" strokeWidth={1} strokeDasharray="3 4" />
          <text x={CX + (km / maxKm) * 190 + 4} y={CY - 4} fontSize={9} fill="#95b1af">{km} km</text>
        </g>
      ))}
      <circle cx={CX} cy={CY} r={26} fill="#2e7573" />
      <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontWeight={800} fill="white">VILLAGE</text>
      {services.map((s, i) => {
        const angle = (Math.PI * 2 * i) / services.length - Math.PI / 2;
        const r = Math.max(40, (s.distanceKm / maxKm) * 190);
        const x = CX + r * Math.cos(angle);
        const y = CY + r * Math.sin(angle);
        const size = 8 + s.satisfaction * 5;
        const isSel = sel === s.name;
        const tone = s.satisfaction >= 4 ? "#2e7573" : s.satisfaction >= 3 ? "#929cc5" : "#f8ca7c";
        return (
          <g key={`${s.name}-${i}`} onClick={() => setSel(isSel ? null : s.name)} className="cursor-pointer">
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="#e1ede8" strokeWidth={1} />
            <circle cx={x} cy={y} r={size} fill={tone} opacity={isSel ? 1 : 0.85} stroke={isSel ? "#373f5a" : "white"} strokeWidth={2} />
            <text x={x} y={y + size + 12} textAnchor="middle" fontSize={10.5} fontWeight={isSel ? 800 : 600} fill="#373f5a">
              {s.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ServiceMap() {
  const [mode, setMode] = useMode();
  const [sel, setSel] = useState<string | null>(null);
  const [yourServices, setYourServices] = useLocalState<YourService[]>("afsa.services.rows", STARTER);
  const [meta, setMeta] = useMeta();
  const chartRef = useRef<HTMLDivElement>(null);
  const yours = mode === "yours";

  const active: Service | undefined = SERVICES.find((s) => s.name === sel);
  const update = (i: number, patch: Partial<YourService>) =>
    setYourServices(yourServices.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const tableHtml = () =>
    rowsToTable(
      ["Service", "Distance (km)", "Satisfaction (1–5)", "Notes / expectations"],
      yourServices.filter((s) => s.name.trim()).map((s) => [s.name, s.distanceKm, s.satisfaction, s.note || "—"])
    );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
        {yours && <span className="text-xs text-navy/60">Circle size = satisfaction; distance from centre = real distance.</span>}
      </div>

      {yours ? (
        <div>
          <div className="mb-5 rounded-(--radius-soft) border border-coral-400/50 bg-coral-400/8 p-4">
            <MetaFields meta={meta} setMeta={setMeta} />
          </div>

          <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-bold text-navy/60">
                  <th className="py-1.5 pr-2">SERVICE</th>
                  <th className="py-1.5 px-1 text-center">DISTANCE KM</th>
                  <th className="py-1.5 px-1 text-center">SATISFACTION 1–5</th>
                  <th className="py-1.5 px-1">NOTES</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {yourServices.map((s, i) => (
                  <tr key={i} className="border-t border-teal-50">
                    <td className="py-2 pr-2">
                      <input
                        type="text"
                        value={s.name}
                        placeholder="e.g. Veterinary hospital"
                        onChange={(e) => update(i, { name: e.target.value })}
                        className="w-full min-w-36 rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:border-teal-600"
                      />
                    </td>
                    <td className="py-2 px-1 text-center">
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        value={s.distanceKm || ""}
                        placeholder="0"
                        aria-label="distance in km"
                        onChange={(e) => update(i, { distanceKm: Math.max(0, Number(e.target.value) || 0) })}
                        className="w-20 rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-sm text-center focus:outline-none focus:border-teal-600"
                      />
                    </td>
                    <td className="py-2 px-1 text-center">
                      <select
                        value={s.satisfaction}
                        aria-label="satisfaction 1 to 5"
                        onChange={(e) => update(i, { satisfaction: Number(e.target.value) })}
                        className="rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:border-teal-600"
                      >
                        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </td>
                    <td className="py-2 px-1">
                      <input
                        type="text"
                        value={s.note}
                        placeholder="expectations, gaps…"
                        onChange={(e) => update(i, { note: e.target.value })}
                        className="w-full min-w-32 rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-xs focus:outline-none focus:border-teal-600"
                      />
                    </td>
                    <td className="py-2 pl-1">
                      <button
                        onClick={() => setYourServices(yourServices.filter((_, j) => j !== i))}
                        className="text-navy/40 hover:text-coral-400 font-bold px-1.5"
                        aria-label={`Remove ${s.name || "row"}`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setYourServices([...yourServices, { name: "", distanceKm: 1, satisfaction: 3, note: "" }])}
              className="mt-3 rounded-full border border-teal-200 px-4 py-1.5 text-sm font-semibold text-teal-600 hover:border-teal-600 transition-colors"
            >
              + Add service
            </button>
          </div>

          <div ref={chartRef} className="mt-4 rounded-(--radius-soft) border border-teal-200 bg-white p-4">
            <ChartCaption meta={meta} toolName="Service Mapping & Ranking" />
            <div className="overflow-x-auto">
              <RadialMap services={yourServices.filter((s) => s.name.trim())} sel={sel} setSel={setSel} />
            </div>
            <p className="px-1 text-[11px] text-navy/60">amber = low satisfaction · periwinkle = medium · teal = satisfied</p>
          </div>

          <div className="mt-5">
            <ExportBar
              chartRef={chartRef}
              meta={meta}
              toolName="Service Mapping & Ranking"
              filename="afsa-service-map"
              getTableHtml={tableHtml}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-(--radius-soft) border border-teal-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <RadialMap services={SERVICES} sel={sel} setSel={setSel} />
          </div>
          <div className="border-t border-teal-50 p-4 text-sm min-h-16 flex items-center justify-between gap-3 flex-wrap">
            {active ? (
              <p className="text-navy/85 leading-relaxed">
                <span className="font-bold text-teal-900">{active.name}</span> · {active.distanceKm} km ·
                satisfaction {active.satisfaction}/5 — {active.note}
              </p>
            ) : (
              <p className="text-navy/65">
                Circle size = satisfaction; distance from centre = real distance. Click a service. The community
                drew extension and veterinary care small and far — exactly the services agroecology needs most.
              </p>
            )}
            <span className="text-[11px] text-navy/60 shrink-0">amber = community flagged for action</span>
          </div>
        </div>
      )}
    </div>
  );
}
