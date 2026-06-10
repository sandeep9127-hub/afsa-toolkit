"use client";

import { useState } from "react";
import { INFORMANTS } from "@/data/khetlapur";
import { principleById } from "@/data/principles";

export default function KiiCards() {
  const [idx, setIdx] = useState(0);
  const inf = INFORMANTS[idx];

  return (
    <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap gap-2">
        {INFORMANTS.map((i, n) => (
          <button
            key={i.who}
            onClick={() => setIdx(n)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
              n === idx ? "bg-peri-700 text-white border-peri-700" : "bg-white border-teal-200 text-navy hover:border-peri-500"
            }`}
          >
            {i.who.split(",")[0].split("(")[0].trim()}
          </button>
        ))}
      </div>
      <div className="mt-5">
        <h4 className="font-bold text-teal-900">{inf.who}</h4>
        <blockquote className="mt-3 border-l-4 border-coral-400 bg-coral-400/10 rounded-r-lg p-4 text-navy/90 italic leading-relaxed">
          &ldquo;{inf.quote}&rdquo;
        </blockquote>
        <p className="mt-3 text-sm text-navy/85 leading-relaxed">{inf.insight}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <span className="text-[11px] font-bold text-navy/60 self-center mr-1">ILLUMINATES:</span>
          {inf.principleIds.map((pid) => {
            const p = principleById(pid);
            return (
              <span key={pid} className="text-xs rounded-full bg-teal-50 border border-teal-200 px-3 py-1 font-medium text-teal-900">
                {p.num}. {p.name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
