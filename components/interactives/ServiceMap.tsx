"use client";

import { useState } from "react";
import { SERVICES } from "@/data/khetlapur";

const W = 680, H = 420, CX = 340, CY = 210;
const MAX_KM = 15;

export default function ServiceMap() {
  const [sel, setSel] = useState<string | null>(null);
  const active = SERVICES.find((s) => s.name === sel);

  return (
    <div className="rounded-(--radius-soft) border border-teal-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-120" role="img" aria-label="Service map of Khetlapur by distance and satisfaction">
          {/* distance rings */}
          {[5, 10, 15].map((km) => (
            <g key={km}>
              <circle cx={CX} cy={CY} r={(km / MAX_KM) * 190} fill="none" stroke="#e1ede8" strokeWidth={1} strokeDasharray="3 4" />
              <text x={CX + (km / MAX_KM) * 190 + 4} y={CY - 4} fontSize={9} fill="#95b1af">{km} km</text>
            </g>
          ))}
          {/* community at centre */}
          <circle cx={CX} cy={CY} r={26} fill="#2e7573" />
          <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontWeight={800} fill="white">VILLAGE</text>
          {/* services */}
          {SERVICES.map((s, i) => {
            const angle = (Math.PI * 2 * i) / SERVICES.length - Math.PI / 2;
            const r = Math.max(40, (s.distanceKm / MAX_KM) * 190);
            const x = CX + r * Math.cos(angle);
            const y = CY + r * Math.sin(angle);
            const size = 8 + s.satisfaction * 5;
            const isSel = sel === s.name;
            const tone = s.satisfaction >= 4 ? "#2e7573" : s.satisfaction >= 3 ? "#929cc5" : "#f8ca7c";
            return (
              <g key={s.name} onClick={() => setSel(isSel ? null : s.name)} className="cursor-pointer">
                <line x1={CX} y1={CY} x2={x} y2={y} stroke="#e1ede8" strokeWidth={1} />
                <circle cx={x} cy={y} r={size} fill={tone} opacity={isSel ? 1 : 0.85} stroke={isSel ? "#373f5a" : "white"} strokeWidth={2} />
                <text x={x} y={y + size + 12} textAnchor="middle" fontSize={10.5} fontWeight={isSel ? 800 : 600} fill="#373f5a">
                  {s.name}
                </text>
              </g>
            );
          })}
        </svg>
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
  );
}
