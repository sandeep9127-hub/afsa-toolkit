"use client";

import { useState } from "react";
import { DQQ_GROUPS, DQQ_AVG } from "@/data/khetlapur";

export default function DqqQuiz() {
  const [checked, setChecked] = useState<boolean[]>(DQQ_GROUPS.map(() => false));
  const [touched, setTouched] = useState(false);

  const score = checked.filter(Boolean).length;
  const toggle = (i: number) => {
    setTouched(true);
    setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)));
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[7fr_5fr]">
      <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-4 sm:p-5">
        <p className="text-sm font-semibold text-teal-900 mb-3">
          Yesterday — from waking up through the night — did you eat any…
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {DQQ_GROUPS.map((g, i) => (
            <button
              key={g.group}
              onClick={() => toggle(i)}
              className={`text-left rounded-xl border px-3.5 py-2.5 transition-colors ${
                checked[i] ? "bg-teal-600 border-teal-600 text-white" : "bg-white border-teal-200 text-teal-900 hover:border-teal-600"
              }`}
            >
              <p className="text-sm font-semibold">{checked[i] ? "✓ " : ""}{g.group}</p>
              <p className={`text-xs mt-0.5 ${checked[i] ? "text-teal-50" : "text-navy/60"}`}>{g.examples}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-(--radius-soft) border border-peri-200 bg-peri-100/30 p-5 self-start">
        <p className="text-xs font-bold text-navy/60">YOUR DIETARY DIVERSITY</p>
        <p className="text-5xl font-extrabold text-teal-600 mt-1">{score}<span className="text-xl text-navy/50 font-bold"> / 10</span></p>
        <div className="mt-3 h-2.5 rounded-full bg-white overflow-hidden border border-peri-200">
          <div className="h-full bg-teal-600 transition-all" style={{ width: `${score * 10}%` }} />
        </div>
        <div className="mt-4 text-sm text-navy/85 leading-relaxed space-y-2">
          <p>
            <strong>Khetlapur&apos;s average: {DQQ_AVG} groups</strong> — dipping to ~3 in the summer lean season.
          </p>
          {touched && (
            <p>
              {score >= 5
                ? "Five or more food groups is the global benchmark for minimum dietary diversity. Now imagine answering this in May in Khetlapur, when own pulses ran out in March."
                : score > 0
                ? "Below five food groups signals risk of micronutrient inadequacy — the situation for a large share of Khetlapur's households in summer."
                : "Tick what you ate yesterday to compare."}
            </p>
          )}
        </div>
        <div className="mt-4 border-t border-peri-200 pt-3 text-xs text-navy/70 leading-relaxed">
          The real DQQ also records the <strong>source</strong> of each food — own farm, market, gathered, or
          support — revealing market dependence, and includes processed-food questions that estimate unhealthy
          consumption. Each share below shows how many Khetlapur respondents consumed the group:
        </div>
        <div className="mt-3 space-y-1">
          {DQQ_GROUPS.map((g) => (
            <div key={g.group} className="flex items-center gap-2 text-[11px] text-navy/75">
              <span className="w-32 shrink-0 truncate">{g.group}</span>
              <div className="flex-1 h-1.5 rounded-full bg-white border border-peri-200 overflow-hidden">
                <div className="h-full bg-peri-500" style={{ width: `${g.khetlapur}%` }} />
              </div>
              <span className="w-8 text-right tabular-nums">{g.khetlapur}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
