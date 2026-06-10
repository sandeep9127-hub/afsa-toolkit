"use client";

import { useRef, useState } from "react";
import { STAKEHOLDERS } from "@/data/khetlapur";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { XIcon, PlusIcon } from "@/components/Icons";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode } from "@/components/Assess";

const DOMAIN_COLOR: Record<string, string> = {
  Producers: "#2e7573",
  Market: "#f8a07b",
  Governance: "#5e6990",
  Support: "#929cc5",
  Consumers: "#c68f95",
};
const DOMAINS = Object.keys(DOMAIN_COLOR);

type Actor = { name: string; domain: string; power: number; interest: number; role: string };

const STARTER: Actor[] = [
  { name: "Small farmers", domain: "Producers", power: 25, interest: 85, role: "" },
  { name: "Gram Panchayat", domain: "Governance", power: 80, interest: 45, role: "" },
];

function Grid({ actors, sel, setSel }: { actors: Actor[]; sel: string | null; setSel: (s: string | null) => void }) {
  return (
    <svg viewBox="0 0 600 420" className="w-full" role="img" aria-label="Stakeholder power and interest grid">
      <rect x={40} y={10} width={270} height={190} fill="#d0daef" opacity={0.35} />
      <rect x={310} y={10} width={270} height={190} fill="#e1ede8" opacity={0.7} />
      <rect x={40} y={200} width={270} height={190} fill="#fdfdfc" />
      <rect x={310} y={200} width={270} height={190} fill="#d0daef" opacity={0.2} />
      <line x1={40} y1={200} x2={580} y2={200} stroke="#95b1af" strokeWidth={1} strokeDasharray="4 4" />
      <line x1={310} y1={10} x2={310} y2={390} stroke="#95b1af" strokeWidth={1} strokeDasharray="4 4" />
      <text x={46} y={26} fontSize={11} fontWeight={700} fill="#5e6990">KEEP SATISFIED</text>
      <text x={574} y={26} fontSize={11} fontWeight={700} fill="#2e7573" textAnchor="end">MANAGE CLOSELY</text>
      <text x={46} y={382} fontSize={11} fontWeight={700} fill="#95b1af">MONITOR</text>
      <text x={574} y={382} fontSize={11} fontWeight={700} fill="#5e6990" textAnchor="end">KEEP INFORMED</text>
      <text x={310} y={412} fontSize={11} fill="#373f5a" textAnchor="middle">Interest in the transformation →</text>
      <text x={18} y={200} fontSize={11} fill="#373f5a" textAnchor="middle" transform="rotate(-90 18 200)">Power to influence →</text>
      {actors.map((s) => {
        const x = 40 + (s.interest / 100) * 540;
        const y = 390 - (s.power / 100) * 380;
        const isSel = sel === s.name;
        return (
          <g key={s.name} onClick={() => setSel(isSel ? null : s.name)} className="cursor-pointer">
            <circle cx={x} cy={y} r={isSel ? 11 : 8} fill={DOMAIN_COLOR[s.domain] || "#2e7573"} stroke="white" strokeWidth={2} opacity={sel && !isSel ? 0.45 : 1} />
            {isSel && <text x={x} y={y - 16} fontSize={11.5} fontWeight={700} fill="#373f5a" textAnchor="middle">{s.name}</text>}
          </g>
        );
      })}
    </svg>
  );
}

const DomainLegend = () => (
  <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-navy/70">
    {Object.entries(DOMAIN_COLOR).map(([d, c]) => (
      <span key={d} className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full inline-block" style={{ background: c }} /> {d}
      </span>
    ))}
  </div>
);

export default function StakeholderGrid() {
  const [mode, setMode] = useMode();
  const [sel, setSel] = useState<string | null>(STAKEHOLDERS[3].name);
  const [yourActors, setYourActors] = useLocalState<Actor[]>("afsa.stakeholders.rows", STARTER);
  const [meta, setMeta] = useMeta();
  const chartRef = useRef<HTMLDivElement>(null);
  const yours = mode === "yours";

  const active = STAKEHOLDERS.find((s) => s.name === sel);
  const update = (i: number, patch: Partial<Actor>) =>
    setYourActors(yourActors.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const tableHtml = () =>
    rowsToTable(
      ["Stakeholder", "Domain", "Interest (0–100)", "Power (0–100)", "Role & notes"],
      yourActors.filter((a) => a.name.trim()).map((a) => [a.name, a.domain, a.interest, a.power, a.role || "—"])
    );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
        {yours && <span className="text-xs text-navy/60">List actors, set their interest and power — the grid places them.</span>}
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
                  <th className="py-1.5 pr-2">STAKEHOLDER</th>
                  <th className="py-1.5 px-1">DOMAIN</th>
                  <th className="py-1.5 px-1 text-center">INTEREST</th>
                  <th className="py-1.5 px-1 text-center">POWER</th>
                  <th className="py-1.5 px-1">ROLE / NOTES</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {yourActors.map((a, i) => (
                  <tr key={i} className="border-t border-teal-50">
                    <td className="py-2 pr-2">
                      <input type="text" value={a.name} placeholder="e.g. Input dealer"
                        onChange={(e) => update(i, { name: e.target.value })}
                        className="w-full min-w-32 rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:border-teal-600" />
                    </td>
                    <td className="py-2 px-1">
                      <select value={a.domain} aria-label="domain" onChange={(e) => update(i, { domain: e.target.value })}
                        className="rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-sm focus:outline-none focus:border-teal-600">
                        {DOMAINS.map((d) => <option key={d}>{d}</option>)}
                      </select>
                    </td>
                    {(["interest", "power"] as const).map((k) => (
                      <td key={k} className="py-2 px-1 text-center">
                        <input type="range" min={0} max={100} value={a[k]} aria-label={k}
                          onChange={(e) => update(i, { [k]: Number(e.target.value) } as Partial<Actor>)}
                          className="w-24 accent-teal-600 align-middle" />
                        <span className="ml-1.5 text-xs tabular-nums text-navy/60 w-7 inline-block">{a[k]}</span>
                      </td>
                    ))}
                    <td className="py-2 px-1">
                      <input type="text" value={a.role} placeholder="who they are, why they matter…"
                        onChange={(e) => update(i, { role: e.target.value })}
                        className="w-full min-w-36 rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-xs focus:outline-none focus:border-teal-600" />
                    </td>
                    <td className="py-2 pl-1">
                      <button onClick={() => setYourActors(yourActors.filter((_, j) => j !== i))}
                        className="grid place-items-center size-7 rounded-md text-navy/40 hover:text-coral-400 hover:bg-coral-400/10 active:scale-90 transition-all outline-none focus-visible:ring-2 focus-visible:ring-coral-400" aria-label={`Remove ${a.name || "row"}`}><XIcon className="size-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setYourActors([...yourActors, { name: "", domain: "Producers", power: 50, interest: 50, role: "" }])}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-teal-200 px-4 py-1.5 text-sm font-semibold text-teal-600 hover:border-teal-600 hover:bg-teal-50 active:translate-y-px transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-400"><PlusIcon className="size-4" /> Add stakeholder</button>
          </div>

          <div ref={chartRef} className="mt-4 rounded-(--radius-soft) border border-teal-200 bg-white p-4">
            <ChartCaption meta={meta} toolName="Stakeholder Mapping — power × interest" />
            <Grid actors={yourActors.filter((a) => a.name.trim())} sel={sel} setSel={setSel} />
            <DomainLegend />
          </div>

          <div className="mt-5">
            <ExportBar chartRef={chartRef} meta={meta} toolName="Stakeholder Mapping" filename="afsa-stakeholder-map" getTableHtml={tableHtml} />
          </div>
        </div>
      ) : (
        <div>
          <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-4 sm:p-5">
            <Grid actors={STAKEHOLDERS} sel={sel} setSel={setSel} />
            <DomainLegend />
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
      )}
    </div>
  );
}
