"use client";

import { useState } from "react";
import { TRANSECT } from "@/data/khetlapur";

// stylised elevation profile: x spans 0..760, heights per niche
const PROFILE: Record<string, { h: number; fill: string }> = {
  forest: { h: 150, fill: "#2e7573" },
  upland: { h: 110, fill: "#95b1af" },
  "upper-paddy": { h: 85, fill: "#b8ccca" },
  "lower-paddy": { h: 55, fill: "#e1ede8" },
  pond: { h: 38, fill: "#929cc5" },
  homestead: { h: 70, fill: "#c68f95" },
  commons: { h: 95, fill: "#f8ca7c" },
};

export default function TransectStrip() {
  const [sel, setSel] = useState(TRANSECT[0].id);
  const active = TRANSECT.find((t) => t.id === sel)!;
  const W = 760, H = 210, base = 195;
  const bandW = W / TRANSECT.length;

  return (
    <div className="rounded-(--radius-soft) border border-teal-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-130" role="img" aria-label="Transect of Khetlapur from ridge forest to lowland">
          {TRANSECT.map((t, i) => {
            const p = PROFILE[t.id];
            const x = i * bandW;
            const isSel = sel === t.id;
            return (
              <g key={t.id} onClick={() => setSel(t.id)} className="cursor-pointer">
                <rect x={x} y={base - p.h} width={bandW} height={p.h} fill={p.fill} opacity={isSel ? 1 : 0.55} stroke="white" strokeWidth={1.5} rx={3} />
                <text
                  x={x + bandW / 2}
                  y={base - p.h - 8}
                  textAnchor="middle"
                  fontSize={10.5}
                  fontWeight={isSel ? 800 : 600}
                  fill={isSel ? "#2e7573" : "#373f5a"}
                >
                  {t.name.split(" ").length > 2 ? t.name.split(" ").slice(0, 2).join(" ") : t.name}
                </text>
                {isSel && <circle cx={x + bandW / 2} cy={base + 8} r={4} fill="#f8a07b" />}
              </g>
            );
          })}
          <line x1={0} y1={base} x2={W} y2={base} stroke="#373f5a" strokeWidth={1.5} />
          <text x={6} y={H - 1} fontSize={9.5} fill="#95b1af">ridge → lowland → homestead → commons: the walking route (never a straight line)</text>
        </svg>
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
  );
}
