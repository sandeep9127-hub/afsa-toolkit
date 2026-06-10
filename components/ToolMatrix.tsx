"use client";

import { useState } from "react";
import Link from "next/link";
import { PRINCIPLES } from "@/data/principles";
import { TOOLS } from "@/data/tools";

// Tools that directly assess principles (excludes the two synthesis tools)
const MATRIX_TOOLS = TOOLS.filter((t) => !["scorecard", "causal-loop", "visioning"].includes(t.slug));

export default function ToolMatrix() {
  const [hoverTool, setHoverTool] = useState<string | null>(null);
  const [hoverPrinciple, setHoverPrinciple] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-(--radius-soft) border border-teal-200 bg-white">
      <table className="w-full text-xs border-collapse min-w-175">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white text-left p-3 font-bold text-teal-900 border-b border-teal-200 min-w-44">
              Principle ↓ &nbsp;·&nbsp; Tool →
            </th>
            {MATRIX_TOOLS.map((t) => (
              <th
                key={t.slug}
                onMouseEnter={() => setHoverTool(t.slug)}
                onMouseLeave={() => setHoverTool(null)}
                className={`p-2 border-b border-teal-200 align-bottom transition-colors ${
                  hoverTool === t.slug ? "bg-teal-50" : ""
                }`}
              >
                <Link
                  href={`/tools/${t.slug}`}
                  className="block font-semibold text-navy hover:text-teal-600 leading-tight [writing-mode:vertical-rl] rotate-180 mx-auto h-28"
                >
                  {t.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PRINCIPLES.map((p) => (
            <tr
              key={p.id}
              onMouseEnter={() => setHoverPrinciple(p.id)}
              onMouseLeave={() => setHoverPrinciple(null)}
              className={hoverPrinciple === p.id ? "bg-teal-50/70" : ""}
            >
              <td className="sticky left-0 bg-inherit backdrop-blur p-3 font-medium text-teal-900 border-b border-teal-50 whitespace-nowrap bg-white">
                {p.num}. {p.name}
              </td>
              {MATRIX_TOOLS.map((t) => {
                const hit = p.tools.includes(t.slug);
                const lit = hoverTool === t.slug || hoverPrinciple === p.id;
                return (
                  <td key={t.slug} className={`text-center border-b border-teal-50 transition-colors ${hoverTool === t.slug ? "bg-teal-50/70" : ""}`}>
                    {hit && (
                      <span
                        className={`inline-block size-3 rounded-full transition-all ${
                          lit ? "bg-teal-600 scale-125" : "bg-teal-400"
                        }`}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="p-3 text-[11px] text-navy/60 border-t border-teal-50">
        One principle is read through multiple tools, so triangulation and validation happen. Hover a row or
        column to trace the connections.
      </p>
    </div>
  );
}
