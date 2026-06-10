"use client";

import { useState } from "react";
import { PRINCIPLES, CLUSTERS, type Principle } from "@/data/principles";
import { TOOLS } from "@/data/tools";
import { SCORES } from "@/data/khetlapur";
import Link from "next/link";

const CLUSTER_TONES: Record<Principle["cluster"], string> = {
  diversity: "bg-teal-600",
  circularity: "bg-teal-900",
  interconnection: "bg-peri-700",
  adaptation: "bg-peri-500",
  solidarity: "bg-rose-400",
};

export default function PrinciplesExplorer() {
  const [activeId, setActiveId] = useState<string>(PRINCIPLES[0].id);
  const active = PRINCIPLES.find((p) => p.id === activeId)!;
  const score = SCORES.find((s) => s.principleId === activeId);

  return (
    <div className="grid gap-6 lg:grid-cols-[5fr_7fr]">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 content-start">
        {PRINCIPLES.map((p, i) => (
          <button
            key={p.id}
            id={p.id}
            onClick={() => setActiveId(p.id)}
            style={{ "--i": i } as React.CSSProperties}
            className={`reveal text-left rounded-(--radius-soft) px-3.5 py-3 border transition-colors scroll-mt-24 ${
              p.id === activeId
                ? `${CLUSTER_TONES[p.cluster]} text-white border-transparent shadow-md`
                : "bg-white border-teal-200 text-teal-900 hover:border-teal-600"
            }`}
          >
            <span className={`text-[11px] font-bold ${p.id === activeId ? "opacity-70" : "text-teal-600"}`}>
              {p.num}
            </span>
            <p className="text-sm font-semibold leading-tight mt-0.5">{p.name}</p>
          </button>
        ))}
      </div>

      <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-6 sm:p-8 self-start lg:sticky lg:top-24">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`${CLUSTER_TONES[active.cluster]} text-white text-xs font-bold rounded-full px-3 py-1`}>
            {CLUSTERS[active.cluster]}
          </span>
          <span className="text-xs font-semibold text-navy/60">Principle {active.num} of 13</span>
        </div>
        <h3 className="text-2xl font-bold text-teal-900 mt-3">{active.name}</h3>
        <p className="text-navy/80 mt-2 leading-relaxed">{active.description}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-lg bg-amber-300/25 border border-amber-300 p-3.5">
            <p className="font-bold text-navy text-xs mb-1">SCORE 0 LOOKS LIKE</p>
            <p className="text-navy/85 leading-relaxed">{active.anchor0}</p>
          </div>
          <div className="rounded-lg bg-teal-50 border border-teal-200 p-3.5">
            <p className="font-bold text-teal-900 text-xs mb-1">SCORE 4 LOOKS LIKE</p>
            <p className="text-navy/85 leading-relaxed">{active.anchor4}</p>
          </div>
        </div>

        {score && (
          <div className="mt-4 rounded-lg border border-peri-200 bg-peri-100/40 p-3.5 text-sm">
            <p className="font-bold text-peri-700 text-xs mb-1">
              KHETLAPUR SCORED {score.score} / 4
            </p>
            <p className="text-navy/85 leading-relaxed">{score.why}</p>
          </div>
        )}

        <div className="mt-5">
          <p className="text-xs font-bold text-navy/60 mb-2">ASSESSED THROUGH</p>
          <div className="flex flex-wrap gap-1.5">
            {active.tools.map((slug) => {
              const t = TOOLS.find((t) => t.slug === slug);
              return t ? (
                <Link
                  key={slug}
                  href={`/tools/${slug}`}
                  className="text-xs rounded-full bg-teal-50 border border-teal-200 px-3 py-1.5 font-medium text-teal-900 hover:bg-teal-600 hover:text-white transition-colors"
                >
                  {t.name}
                </Link>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
