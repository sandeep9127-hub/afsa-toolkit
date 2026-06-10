"use client";

import { useMemo, useState } from "react";
import { CLD_NODES, CLD_EDGES, CLD_LOOPS, LEVERAGE_EXPLANATION } from "@/data/khetlapur";

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

export default function CausalLoopDiagram() {
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

  return (
    <div>
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
