"use client";

import { useState } from "react";
import { STAKEHOLDERS } from "@/data/khetlapur";

const QUADRANTS = [
  { label: "Keep satisfied", hint: "high power · low interest", x: 0, y: 0 },
  { label: "Manage closely", hint: "high power · high interest", x: 1, y: 0 },
  { label: "Monitor", hint: "low power · low interest", x: 0, y: 1 },
  { label: "Keep informed", hint: "low power · high interest", x: 1, y: 1 },
];

const DOMAIN_COLOR: Record<string, string> = {
  Producers: "#2e7573",
  Market: "#f8a07b",
  Governance: "#5e6990",
  Support: "#929cc5",
  Consumers: "#c68f95",
};

export default function StakeholderGrid() {
  const [sel, setSel] = useState<string | null>(STAKEHOLDERS[3].name);
  const active = STAKEHOLDERS.find((s) => s.name === sel);

  return (
    <div>
      <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-4 sm:p-5">
        <div className="relative">
          <svg viewBox="0 0 600 420" className="w-full" role="img" aria-label="Stakeholder power and interest grid">
            {/* quadrant shading */}
            <rect x={40} y={10} width={270} height={190} fill="#d0daef" opacity={0.35} />
            <rect x={310} y={10} width={270} height={190} fill="#e1ede8" opacity={0.7} />
            <rect x={40} y={200} width={270} height={190} fill="#fdfdfc" />
            <rect x={310} y={200} width={270} height={190} fill="#d0daef" opacity={0.2} />
            {/* axes */}
            <line x1={40} y1={200} x2={580} y2={200} stroke="#95b1af" strokeWidth={1} strokeDasharray="4 4" />
            <line x1={310} y1={10} x2={310} y2={390} stroke="#95b1af" strokeWidth={1} strokeDasharray="4 4" />
            <text x={46} y={26} fontSize={11} fontWeight={700} fill="#5e6990">KEEP SATISFIED</text>
            <text x={574} y={26} fontSize={11} fontWeight={700} fill="#2e7573" textAnchor="end">MANAGE CLOSELY</text>
            <text x={46} y={382} fontSize={11} fontWeight={700} fill="#95b1af">MONITOR</text>
            <text x={574} y={382} fontSize={11} fontWeight={700} fill="#5e6990" textAnchor="end">KEEP INFORMED</text>
            {/* axis labels */}
            <text x={310} y={412} fontSize={11} fill="#373f5a" textAnchor="middle">Interest in the transformation →</text>
            <text x={18} y={200} fontSize={11} fill="#373f5a" textAnchor="middle" transform="rotate(-90 18 200)">Power to influence →</text>
            {/* dots */}
            {STAKEHOLDERS.map((s) => {
              const x = 40 + (s.interest / 100) * 540;
              const y = 390 - (s.power / 100) * 380;
              const isSel = sel === s.name;
              return (
                <g key={s.name} onClick={() => setSel(isSel ? null : s.name)} className="cursor-pointer">
                  <circle cx={x} cy={y} r={isSel ? 11 : 8} fill={DOMAIN_COLOR[s.domain]} stroke="white" strokeWidth={2} opacity={sel && !isSel ? 0.45 : 1} />
                  {isSel && (
                    <text x={x} y={y - 16} fontSize={11.5} fontWeight={700} fill="#373f5a" textAnchor="middle">{s.name}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-navy/70">
          {Object.entries(DOMAIN_COLOR).map(([d, c]) => (
            <span key={d} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full inline-block" style={{ background: c }} /> {d}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-(--radius-soft) border border-peri-200 bg-peri-100/30 p-4 sm:p-5 text-sm min-h-20">
        {active ? (
          <p className="text-navy/85 leading-relaxed">
            <span className="font-bold text-teal-900">{active.name}</span>{" "}
            <span className="text-xs font-semibold text-peri-700">({active.domain})</span> — {active.role}
          </p>
        ) : (
          <p className="text-navy/70">Click any dot to read that actor&apos;s role in Khetlapur&apos;s food system.</p>
        )}
      </div>
    </div>
  );
}
