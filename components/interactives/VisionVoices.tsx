"use client";

import { useRef, useState } from "react";
import { VISIONS, VISION_ACTIONS } from "@/data/khetlapur";
import { useLocalState } from "@/lib/useLocalState";
import { rowsToTable } from "@/lib/exportReport";
import { ModeTabs, MetaFields, ChartCaption, ExportBar, useMeta, useMode } from "@/components/Assess";

const TONES: Record<string, { active: string; quote: string }> = {
  coral: { active: "bg-coral-400 text-white border-coral-400", quote: "border-coral-400 bg-coral-400/10" },
  rose: { active: "bg-rose-400 text-white border-rose-400", quote: "border-rose-400 bg-rose-400/10" },
  peri: { active: "bg-peri-700 text-white border-peri-700", quote: "border-peri-500 bg-peri-100/50" },
};
const GROUP_COLORS = ["coral", "rose", "peri"];

type YourVisions = { groups: { name: string; text: string }[]; actions: string };

const STARTER: YourVisions = {
  groups: [
    { name: "Youth", text: "" },
    { name: "Women (35+)", text: "" },
    { name: "Men (35+)", text: "" },
  ],
  actions: "",
};

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

export default function VisionVoices() {
  const [mode, setMode] = useMode();
  const [idx, setIdx] = useState(0);
  const [yourV, setYourV] = useLocalState<YourVisions>("afsa.visions.data", STARTER);
  const [meta, setMeta] = useMeta();
  const chartRef = useRef<HTMLDivElement>(null);
  const yours = mode === "yours";

  const v = VISIONS[idx];
  const tone = TONES[v.color];

  const tableHtml = () =>
    rowsToTable(
      ["Group", "Vision statements (present tense)"],
      yourV.groups.filter((g) => lines(g.text).length).map((g) => [g.name, lines(g.text).map((l) => `"${l}"`).join("  ·  ")])
    ) +
    (lines(yourV.actions).length
      ? `<h2 style="font-size:15px;color:#2e7573;margin:18px 0 8px">Agreed actions around the leverage point</h2><ol>${lines(yourV.actions)
          .map((a) => `<li>${a.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</li>`)
          .join("")}</ol>`
      : "");

  const inputCls = "w-full rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:border-teal-600";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <ModeTabs mode={mode} setMode={setMode} />
        {yours && <span className="text-xs text-navy/60">One statement per line, written in the present tense — as if already true.</span>}
      </div>

      {yours ? (
        <div>
          <div className="mb-5 rounded-(--radius-soft) border border-coral-400/50 bg-coral-400/8 p-4">
            <MetaFields meta={meta} setMeta={setMeta} />
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {yourV.groups.map((g, i) => (
              <div key={i} className="rounded-(--radius-soft) border border-teal-50 bg-white p-3.5">
                <input type="text" value={g.name} aria-label="group name"
                  onChange={(e) => setYourV({ ...yourV, groups: yourV.groups.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) })}
                  className={`${inputCls} font-semibold mb-2`} />
                <textarea value={g.text} rows={6}
                  placeholder={"Our ponds hold water through summer.\nThe market committee gives local producers the centre stalls."}
                  onChange={(e) => setYourV({ ...yourV, groups: yourV.groups.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })}
                  className={`${inputCls} text-xs leading-relaxed`} />
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-(--radius-soft) border border-teal-50 bg-white p-3.5">
            <p className="text-[11px] font-bold text-navy/60 mb-1.5">AGREED ACTIONS AROUND THE LEVERAGE POINT — one per line</p>
            <textarea value={yourV.actions} rows={3}
              placeholder={"Register a producer collective anchored in the SHG federation.\nTake the scorecard and vision to the Gram Panchayat for the annual plan."}
              onChange={(e) => setYourV({ ...yourV, actions: e.target.value })}
              className={`${inputCls} text-xs leading-relaxed`} />
          </div>

          <div ref={chartRef} className="mt-4 rounded-(--radius-soft) border border-teal-200 bg-white p-5">
            <ChartCaption meta={meta} toolName="Community Vision — three circles" />
            <div className="grid gap-3 lg:grid-cols-3">
              {yourV.groups.map((g, i) => {
                const gt = TONES[GROUP_COLORS[i % 3]];
                const ls = lines(g.text);
                return (
                  <div key={i}>
                    <p className="text-xs font-bold text-teal-900 mb-2">{g.name.toUpperCase()}</p>
                    <div className="space-y-2">
                      {ls.length ? ls.map((l, li) => (
                        <blockquote key={li} className={`rounded-xl border-l-4 ${gt.quote} p-3 text-navy/90 leading-relaxed text-xs`}>
                          &ldquo;{l}&rdquo;
                        </blockquote>
                      )) : <p className="text-xs text-navy/40 italic">no statements yet</p>}
                    </div>
                  </div>
                );
              })}
            </div>
            {lines(yourV.actions).length > 0 && (
              <div className="mt-5 border-t border-teal-50 pt-4">
                <p className="text-xs font-bold text-navy/60 mb-2">AGREED ACTIONS</p>
                <ol className="space-y-1.5 text-sm text-navy/85">
                  {lines(yourV.actions).map((a, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="shrink-0 size-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="leading-relaxed text-xs sm:text-sm">{a}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <div className="mt-5">
            <ExportBar chartRef={chartRef} meta={meta} toolName="Community Visioning & Narratives" filename="afsa-community-vision" getTableHtml={tableHtml} />
          </div>
        </div>
      ) : (
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

          <div key={idx} className="mt-5 grid gap-3 sm:grid-cols-2 swap">
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
      )}
    </div>
  );
}
