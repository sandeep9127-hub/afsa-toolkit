"use client";

import { useState } from "react";
import { VISIONS, VISION_ACTIONS } from "@/data/khetlapur";

const TONES: Record<string, { active: string; quote: string }> = {
  coral: { active: "bg-coral-400 text-white border-coral-400", quote: "border-coral-400 bg-coral-400/10" },
  rose: { active: "bg-rose-400 text-white border-rose-400", quote: "border-rose-400 bg-rose-400/10" },
  peri: { active: "bg-peri-700 text-white border-peri-700", quote: "border-peri-500 bg-peri-100/50" },
};

export default function VisionVoices() {
  const [idx, setIdx] = useState(0);
  const v = VISIONS[idx];
  const tone = TONES[v.color];

  return (
    <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap gap-2">
        {VISIONS.map((g, n) => (
          <button
            key={g.group}
            onClick={() => setIdx(n)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold border transition-colors ${
              n === idx ? TONES[g.color].active : "bg-white border-teal-200 text-navy hover:border-teal-600"
            }`}
          >
            {g.group}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {v.statements.map((s) => (
          <blockquote key={s} className={`rounded-xl border-l-4 ${tone.quote} p-4 text-navy/90 leading-relaxed text-sm`}>
            &ldquo;{s}&rdquo;
          </blockquote>
        ))}
      </div>

      <div className="mt-6 border-t border-teal-50 pt-5">
        <p className="text-xs font-bold text-navy/60 mb-2">WHAT THE THREE CIRCLES AGREED TO DO — AROUND THE LEVERAGE POINT</p>
        <ol className="space-y-2 text-sm text-navy/85">
          {VISION_ACTIONS.map((a, i) => (
            <li key={a} className="flex gap-3">
              <span className="shrink-0 size-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span className="leading-relaxed">{a}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
