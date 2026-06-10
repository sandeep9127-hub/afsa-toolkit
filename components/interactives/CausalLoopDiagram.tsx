"use client";

import { useMemo, useRef, useState } from "react";
import { CLD_NODES, CLD_EDGES, CLD_LOOPS, LEVERAGE_EXPLANATION } from "@/data/khetlapur";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode } from "@/components/Assess";

const W = 810, H = 560;
const NODE_W = 168, NODE_H = 54;

function center(id: string) {
  const n = CLD_NODES.find((n) => n.id === id)!;
  return { x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 };
}

// curved edge between two node centres, trimmed to node borders
function edgePath(fromId: string, toId: string, bend = 0.18) {
  const a = center(fromId), b = center(toId);
  const dx = b.x - a.x, dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1;
  // unit + normal
  const ux = dx / dist, uy = dy / dist;
  const nx = -uy, ny = ux;
  // trim ends so arrows meet node edges, not centres
  const trimA = 40, trimB = 46;
  const sx = a.x + ux * trimA, sy = a.y + uy * trimA;
  const ex = b.x - ux * trimB, ey = b.y - uy * trimB;
  const mx = (sx + ex) / 2 + nx * dist * bend;
  const my = (sy + ey) / 2 + ny * dist * bend;
  return { d: `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`, labelX: (sx + ex) / 2 + nx * dist * bend * 0.55, labelY: (sy + ey) / 2 + ny * dist * bend * 0.55 };
}

// ——— Your-landscape CLD builder ———
type YourEdge = { from: number; to: number; sign: "+" | "-" };
type YourCld = { variables: string[]; edges: YourEdge[] };

const CLD_STARTER: YourCld = { variables: [], edges: [] };

function YourCldBuilder() {
  const [cld, setCld] = useLocalState<YourCld>("afsa.cld.data", CLD_STARTER);
  const [meta, setMeta] = useMeta();
  const [draft, setDraft] = useState("");
  const [edgeFrom, setEdgeFrom] = useState(0);
  const [edgeTo, setEdgeTo] = useState(0);
  const [edgeSign, setEdgeSign] = useState<"+" | "-">("+");
  const chartRef = useRef<HTMLDivElement>(null);

  const W2 = 810, H2 = 540, NW = 150, NH = 48;
  const n = cld.variables.length;
  const pos = (i: number) => {
    const a = (Math.PI * 2 * i) / Math.max(1, n) - Math.PI / 2;
    return { x: W2 / 2 + 295 * Math.cos(a) - NW / 2, y: H2 / 2 + 205 * Math.sin(a) - NH / 2 };
  };
  const centerOf = (i: number) => ({ x: pos(i).x + NW / 2, y: pos(i).y + NH / 2 });

  const degree = useMemo(() => {
    const d: Record<number, number> = {};
    cld.edges.forEach((e) => {
      d[e.from] = (d[e.from] || 0) + 1;
      d[e.to] = (d[e.to] || 0) + 1;
    });
    return d;
  }, [cld.edges]);
  const maxDeg = Math.max(0, ...Object.values(degree));
  const leverageIdx = maxDeg >= 2 ? Number(Object.keys(degree).find((k) => degree[Number(k)] === maxDeg)) : -1;

  const addVariable = () => {
    const v = draft.trim();
    if (!v) return;
    setCld((prev) => (prev.variables.includes(v) ? prev : { ...prev, variables: [...prev.variables, v] }));
    setDraft("");
  };
  const removeVariable = (i: number) =>
    setCld({
      variables: cld.variables.filter((_, j) => j !== i),
      edges: cld.edges
        .filter((e) => e.from !== i && e.to !== i)
        .map((e) => ({ ...e, from: e.from > i ? e.from - 1 : e.from, to: e.to > i ? e.to - 1 : e.to })),
    });
  const addEdge = () => {
    if (edgeFrom === edgeTo || n < 2) return;
    setCld((prev) =>
      prev.edges.some((e) => e.from === edgeFrom && e.to === edgeTo)
        ? prev
        : { ...prev, edges: [...prev.edges, { from: edgeFrom, to: edgeTo, sign: edgeSign }] }
    );
  };

  const curved = (e: YourEdge) => {
    const a = centerOf(e.from), b = centerOf(e.to);
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1;
    const ux = dx / dist, uy = dy / dist, nx = -uy, ny = ux;
    const sx = a.x + ux * 40, sy = a.y + uy * 40;
    const ex = b.x - ux * 46, ey = b.y - uy * 46;
    const mx = (sx + ex) / 2 + nx * dist * 0.16, my = (sy + ey) / 2 + ny * dist * 0.16;
    return { d: `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`, lx: (sx + ex) / 2 + nx * dist * 0.09, ly: (sy + ey) / 2 + ny * dist * 0.09 };
  };

  const tableHtml = () =>
    rowsToTable(
      ["Influencing variable", "Direction", "Influenced variable"],
      cld.edges.map((e) => [cld.variables[e.from], e.sign === "+" ? "+ (move together)" : "− (inverse)", cld.variables[e.to]])
    ) +
    (leverageIdx >= 0
      ? `<p style="margin-top:10px"><strong>Leverage point:</strong> "${cld.variables[leverageIdx]}" — ${maxDeg} connections, the most linked variable in the system.</p>`
      : "");

  const selCls = "rounded-lg border border-teal-200 bg-white px-2.5 py-1.5 text-sm focus:outline-none focus:border-teal-600 max-w-44";

  return (
    <div>
      <div className="mb-5 rounded-(--radius-soft) border border-coral-400/50 bg-coral-400/8 p-4">
        <MetaFields meta={meta} setMeta={setMeta} />
      </div>

      <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-4">
        <p className="text-[11px] font-bold text-navy/60">1 · VARIABLES (patterns of behaviour, not events — start from your low-scoring principles)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            type="text" value={draft} placeholder="e.g. Dependence on purchased inputs"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addVariable()}
            className="rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:border-teal-600 min-w-64"
          />
          <button onClick={addVariable} className="rounded-full bg-teal-600 px-4 py-1.5 text-white text-sm font-semibold hover:bg-teal-900 transition-colors">
            + Add variable
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {cld.variables.map((v, i) => (
            <span key={i} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${i === leverageIdx ? "bg-coral-400 border-coral-400 text-white" : "bg-teal-50 border-teal-200 text-teal-900"}`}>
              {v}
              <button onClick={() => removeVariable(i)} className="font-bold opacity-60 hover:opacity-100" aria-label={`Remove ${v}`}>✕</button>
            </span>
          ))}
        </div>

        {n >= 2 && (
          <div className="mt-4 border-t border-teal-50 pt-3">
            <p className="text-[11px] font-bold text-navy/60">2 · LINKS — &lsquo;+&rsquo; if they move together, &lsquo;−&rsquo; if one rises as the other falls</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <select value={edgeFrom} aria-label="from variable" onChange={(e) => setEdgeFrom(Number(e.target.value))} className={selCls}>
                {cld.variables.map((v, i) => <option key={i} value={i}>{v}</option>)}
              </select>
              <button onClick={() => setEdgeSign(edgeSign === "+" ? "-" : "+")}
                className={`size-8 rounded-full border-2 font-bold text-base ${edgeSign === "+" ? "border-teal-600 text-teal-600" : "border-coral-400 text-coral-400"}`}
                aria-label="toggle sign">
                {edgeSign === "+" ? "+" : "−"}
              </button>
              <span className="text-teal-400 font-bold">→</span>
              <select value={edgeTo} aria-label="to variable" onChange={(e) => setEdgeTo(Number(e.target.value))} className={selCls}>
                {cld.variables.map((v, i) => <option key={i} value={i}>{v}</option>)}
              </select>
              <button onClick={addEdge} className="rounded-full border-2 border-teal-600 px-4 py-1 text-teal-600 text-sm font-semibold hover:bg-teal-50 transition-colors">
                Link
              </button>
            </div>
            {cld.edges.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {cld.edges.map((e, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-peri-100/60 border border-peri-200 px-3 py-1 text-xs text-navy">
                    {cld.variables[e.from]} <strong className={e.sign === "+" ? "text-teal-600" : "text-[#c2602e]"}>{e.sign === "+" ? "+" : "−"}→</strong> {cld.variables[e.to]}
                    <button onClick={() => setCld({ ...cld, edges: cld.edges.filter((_, j) => j !== i) })} className="font-bold opacity-60 hover:opacity-100" aria-label="Remove link">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {n >= 2 && cld.edges.length > 0 && (
        <div ref={chartRef} className="mt-4 rounded-(--radius-soft) border border-teal-200 bg-white p-4">
          <ChartCaption meta={meta} toolName="Causal Loop Diagram" />
          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${W2} ${H2}`} className="w-full min-w-160" role="img" aria-label="Your causal loop diagram">
              <defs>
                <marker id="your-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#5e6990" />
                </marker>
              </defs>
              {cld.edges.map((e, i) => {
                const { d, lx, ly } = curved(e);
                return (
                  <g key={i}>
                    <path d={d} fill="none" stroke="#929cc5" strokeWidth={1.8} markerEnd="url(#your-arrow)" />
                    <circle cx={lx} cy={ly} r={10} fill="white" stroke={e.sign === "+" ? "#2e7573" : "#f8a07b"} strokeWidth={1.5} />
                    <text x={lx} y={ly + 1} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={800} fill={e.sign === "+" ? "#2e7573" : "#c2602e"}>
                      {e.sign === "+" ? "+" : "−"}
                    </text>
                  </g>
                );
              })}
              {cld.variables.map((v, i) => {
                const p = pos(i);
                const isLev = i === leverageIdx;
                return (
                  <g key={i}>
                    {isLev && (
                      <rect x={p.x - 5} y={p.y - 5} width={NW + 10} height={NH + 10} rx={14} fill="none" stroke="#f8a07b" strokeWidth={3} className="animate-pulse-soft" />
                    )}
                    <rect x={p.x} y={p.y} width={NW} height={NH} rx={11} fill={isLev ? "#f8a07b" : "#fdfdfc"} stroke={isLev ? "#f8a07b" : "#929cc5"} strokeWidth={1.5} />
                    <text x={p.x + NW / 2} y={p.y + NH / 2} textAnchor="middle" dominantBaseline="middle" fontSize={10.5} fontWeight={600} fill="#373f5a">
                      {wrap(v, 24).slice(0, 3).map((line, li, arr) => (
                        <tspan key={li} x={p.x + NW / 2} dy={li === 0 ? `${-(arr.length - 1) * 0.55}em` : "1.1em"}>{line}</tspan>
                      ))}
                    </text>
                    {degree[i] && (
                      <text x={p.x + NW - 6} y={p.y + 12} textAnchor="end" fontSize={9} fontWeight={700} fill={isLev ? "#7c4a2d" : "#95b1af"}>
                        {degree[i]} links
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          {leverageIdx >= 0 && (
            <p className="px-1 text-xs text-navy/75 leading-relaxed">
              <span className="font-bold text-[#c2602e]">Leverage point: </span>
              <strong>{cld.variables[leverageIdx]}</strong> holds {maxDeg} connections — the most linked variable.
              Design actions around it, and prefer leverage that can shift within 2–3 years.
            </p>
          )}
        </div>
      )}

      <div className="mt-5">
        <ExportBar chartRef={chartRef} meta={meta} toolName="Causal Loop Diagram & Leverage Point" filename="afsa-causal-loop" getTableHtml={tableHtml} />
      </div>
    </div>
  );
}

export default function CausalLoopDiagram() {
  const [mode, setMode] = useMode();
  const [selected, setSelected] = useState<string | null>(null);
  const [activeLoop, setActiveLoop] = useState<string | null>(null);

  const linkCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of CLD_EDGES) {
      counts[e.from] = (counts[e.from] || 0) + 1;
      counts[e.to] = (counts[e.to] || 0) + 1;
    }
    return counts;
  }, []);

  const loop = CLD_LOOPS.find((l) => l.id === activeLoop) || null;
  const loopEdgeSet = useMemo(() => {
    if (!loop) return new Set<string>();
    const ids = loop.path;
    const set = new Set<string>();
    for (const e of CLD_EDGES) {
      if (ids.includes(e.from) && ids.includes(e.to)) set.add(`${e.from}→${e.to}`);
    }
    return set;
  }, [loop]);

  const isEdgeLit = (e: (typeof CLD_EDGES)[number]) => {
    if (loop) return loopEdgeSet.has(`${e.from}→${e.to}`);
    if (selected) return e.from === selected || e.to === selected;
    return false;
  };

  const anyFocus = !!selected || !!loop;
  const selectedNode = CLD_NODES.find((n) => n.id === selected);

  if (mode === "yours") {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <ModeTabs mode={mode} setMode={setMode} />
          <span className="text-xs text-navy/60">Add variables from your low scores, link them, and the leverage point emerges.</span>
        </div>
        <YourCldBuilder />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-bold text-navy/60 mr-1">TRACE A LOOP:</span>
        {CLD_LOOPS.map((l) => (
          <button
            key={l.id}
            onClick={() => { setActiveLoop(activeLoop === l.id ? null : l.id); setSelected(null); }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
              activeLoop === l.id
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white border-teal-200 text-teal-900 hover:border-teal-600"
            }`}
          >
            {l.id} · {l.label}
          </button>
        ))}
        {(selected || activeLoop) && (
          <button onClick={() => { setSelected(null); setActiveLoop(null); }} className="text-xs font-semibold text-navy/60 hover:text-teal-600 ml-1">
            ✕ clear
          </button>
        )}
      </div>

      <div className="rounded-(--radius-soft) border border-teal-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-160" role="img" aria-label="Causal loop diagram of Khetlapur's food system">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#5e6990" />
              </marker>
              <marker id="arrow-lit" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7.5" markerHeight="7.5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#2e7573" />
              </marker>
            </defs>

            {/* edges */}
            {CLD_EDGES.map((e) => {
              const { d, labelX, labelY } = edgePath(e.from, e.to);
              const lit = isEdgeLit(e);
              const dim = anyFocus && !lit;
              return (
                <g key={`${e.from}-${e.to}`} opacity={dim ? 0.18 : 1}>
                  <path d={d} fill="none" stroke={lit ? "#2e7573" : "#929cc5"} strokeWidth={lit ? 3 : 1.8} markerEnd={`url(#${lit ? "arrow-lit" : "arrow"})`} />
                  <circle cx={labelX} cy={labelY} r={10} fill="white" stroke={e.sign === "+" ? "#2e7573" : "#f8a07b"} strokeWidth={1.5} />
                  <text x={labelX} y={labelY + 1} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={800} fill={e.sign === "+" ? "#2e7573" : "#c2602e"}>
                    {e.sign === "+" ? "+" : "−"}
                  </text>
                </g>
              );
            })}

            {/* nodes */}
            {CLD_NODES.map((n) => {
              const lit = selected === n.id || (loop ? loop.path.includes(n.id) : false);
              const dim = anyFocus && !lit && !n.leverage;
              return (
                <g
                  key={n.id}
                  opacity={dim ? 0.38 : 1}
                  onClick={() => { setSelected(selected === n.id ? null : n.id); setActiveLoop(null); }}
                  className="cursor-pointer"
                >
                  {n.leverage && (
                    <rect
                      x={n.x - 5} y={n.y - 5} width={NODE_W + 10} height={NODE_H + 10} rx={14}
                      fill="none" stroke="#f8a07b" strokeWidth={3}
                      className="animate-pulse-soft"
                    />
                  )}
                  <rect
                    x={n.x} y={n.y} width={NODE_W} height={NODE_H} rx={11}
                    fill={n.leverage ? "#f8a07b" : lit ? "#2e7573" : "#fdfdfc"}
                    stroke={n.leverage ? "#f8a07b" : lit ? "#2e7573" : "#929cc5"}
                    strokeWidth={1.5}
                  />
                  <text x={n.x + NODE_W / 2} y={n.y + NODE_H / 2} textAnchor="middle" dominantBaseline="middle" fontSize={11.5} fontWeight={600} fill={n.leverage ? "#373f5a" : lit ? "white" : "#373f5a"}>
                    {wrap(n.label, 26).map((line, i, arr) => (
                      <tspan key={i} x={n.x + NODE_W / 2} dy={i === 0 ? `${-(arr.length - 1) * 0.55}em` : "1.1em"}>{line}</tspan>
                    ))}
                  </text>
                  <text x={n.x + NODE_W - 8} y={n.y + 13} textAnchor="end" fontSize={9.5} fontWeight={700} fill={n.leverage ? "#7c4a2d" : "#95b1af"}>
                    {linkCounts[n.id]} links
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="border-t border-teal-50 p-4 sm:p-5 text-sm min-h-24">
          {loop ? (
            <p className="text-navy/85 leading-relaxed">
              <span className={`font-bold ${loop.kind === "reinforcing" ? "text-teal-600" : "text-[#c2602e]"}`}>
                {loop.id}: {loop.label} ({loop.kind})
              </span>{" "}
              — {loop.story}
            </p>
          ) : selectedNode ? (
            <p className="text-navy/85 leading-relaxed">
              <span className="font-bold text-teal-900">{selectedNode.label}</span> has{" "}
              <strong>{linkCounts[selectedNode.id]} connections</strong> — the lit arrows show what it influences
              and what influences it. {selectedNode.leverage && <span className="font-semibold text-[#c2602e]">This is the leverage point.</span>}
            </p>
          ) : (
            <p className="text-navy/70 leading-relaxed">
              <span className="font-bold">Click any variable</span> to trace its connections, or use the loop
              buttons above. <span className="font-semibold">+</span> means the variables move together;{" "}
              <span className="font-semibold text-[#c2602e]">−</span> means one rises as the other falls. The
              node with the orange pulse holds the most links — Khetlapur&apos;s leverage point.
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-(--radius-soft) border-l-4 border-coral-400 bg-coral-400/10 p-5 text-sm text-navy/85 leading-relaxed">
        <p className="font-bold text-teal-900 mb-1">Why this leverage point?</p>
        {LEVERAGE_EXPLANATION}
      </div>
    </div>
  );
}

function wrap(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars) {
      if (line) lines.push(line.trim());
      line = w;
    } else {
      line += " " + w;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}
