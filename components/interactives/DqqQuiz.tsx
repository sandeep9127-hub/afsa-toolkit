"use client";

import { useMemo, useState } from "react";
import { DQQ_ITEMS, DQQ_INDIA, DQQ_KHETLAPUR } from "@/data/khetlapur";

const FOOD_ITEMS = DQQ_ITEMS.filter((i) => !i.risk);
const RISK_ITEMS = DQQ_ITEMS.filter((i) => i.risk);

export default function DqqQuiz() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const r = useMemo(() => {
    const sel = DQQ_ITEMS.filter((i) => checked.has(i.id));
    const mddGroups = new Set(sel.filter((i) => i.mddGroup).map((i) => i.mddGroup));
    const all5cats = new Set(sel.map((i) => i.all5).filter(Boolean));
    const protect = sel.filter((i) => i.protect).length;
    const risk = sel.filter((i) => i.risk).length;
    return {
      dds: mddGroups.size,
      mdd: mddGroups.size >= 5,
      all5: (["staple", "veg", "fruit", "pulse", "asf"] as const).every((c) => all5cats.has(c)),
      protect,
      risk,
      gdr: protect - risk + 9,
      zeroVegFruit: !sel.some((i) => i.all5 === "veg" || i.all5 === "fruit"),
    };
  }, [checked]);

  const touched = checked.size > 0;

  const Row = ({ label, you, khet, india, max, good }: { label: string; you: string; khet: string; india: string; max?: string; good?: boolean | null }) => (
    <tr className="border-t border-peri-200/60">
      <td className="py-2 pr-2 font-medium text-navy/85">{label}{max && <span className="text-navy/45"> {max}</span>}</td>
      <td className={`py-2 pr-2 text-center font-bold tabular-nums ${!touched ? "text-navy/30" : good === false ? "text-[#c47b35]" : "text-teal-600"}`}>{touched ? you : "—"}</td>
      <td className="py-2 pr-2 text-center tabular-nums text-navy/70">{khet}</td>
      <td className="py-2 text-center tabular-nums text-navy/70">{india}</td>
    </tr>
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[7fr_5fr]">
      <div className="rounded-(--radius-soft) border border-teal-200 bg-white p-4 sm:p-5">
        <p className="text-sm font-semibold text-teal-900 mb-3">
          Yesterday — from waking up through the night — did you eat or drink any…
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {FOOD_ITEMS.map((g) => (
            <button
              key={g.id}
              onClick={() => toggle(g.id)}
              className={`text-left rounded-xl border px-3.5 py-2.5 transition-colors ${
                checked.has(g.id) ? "bg-teal-600 border-teal-600 text-white" : "bg-white border-teal-200 text-teal-900 hover:border-teal-600"
              }`}
            >
              <p className="text-sm font-semibold">{checked.has(g.id) ? "✓ " : ""}{g.label}</p>
              <p className={`text-xs mt-0.5 ${checked.has(g.id) ? "text-teal-50" : "text-navy/60"}`}>{g.examples}</p>
            </button>
          ))}
        </div>
        <p className="text-sm font-semibold text-teal-900 mt-5 mb-3">…and any of these snacks, sweets and drinks?</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {RISK_ITEMS.map((g) => (
            <button
              key={g.id}
              onClick={() => toggle(g.id)}
              className={`text-left rounded-xl border px-3.5 py-2.5 transition-colors ${
                checked.has(g.id) ? "bg-coral-400 border-coral-400 text-white" : "bg-white border-amber-300/80 text-teal-900 hover:border-coral-400"
              }`}
            >
              <p className="text-sm font-semibold">{checked.has(g.id) ? "✓ " : ""}{g.label}</p>
              <p className={`text-xs mt-0.5 ${checked.has(g.id) ? "text-white/85" : "text-navy/60"}`}>{g.examples}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-(--radius-soft) border border-peri-200 bg-peri-100/30 p-5 self-start">
        <p className="text-xs font-bold text-navy/60">YOUR DQQ INDICATORS</p>
        <div className="mt-2 flex items-end gap-6">
          <div>
            <p className="text-[11px] font-bold text-navy/55">DIETARY DIVERSITY</p>
            <p className="text-4xl font-extrabold text-teal-600">{r.dds}<span className="text-base text-navy/50 font-bold"> / 10</span></p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-navy/55">GDR SCORE</p>
            <p className={`text-4xl font-extrabold ${touched ? "text-peri-700" : "text-navy/30"}`}>{touched ? r.gdr : "—"}<span className="text-base text-navy/50 font-bold"> / 18</span></p>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-bold">
          <span className={`rounded-full px-2.5 py-1 ${r.mdd ? "bg-teal-600 text-white" : "bg-white border border-peri-200 text-navy/60"}`}>
            MDD {r.mdd ? "✓ met" : "below 5 groups"}
          </span>
          <span className={`rounded-full px-2.5 py-1 ${r.all5 ? "bg-teal-600 text-white" : "bg-white border border-peri-200 text-navy/60"}`}>
            All-5 {r.all5 ? "✓" : "✗"}
          </span>
          {touched && r.zeroVegFruit && (
            <span className="rounded-full px-2.5 py-1 bg-amber-300/60 text-navy">zero vegetables or fruit</span>
          )}
        </div>

        <table className="mt-4 w-full text-xs">
          <thead>
            <tr className="text-[10px] font-bold text-navy/55">
              <th className="text-left pb-1.5">INDICATOR</th>
              <th className="pb-1.5 px-1">YOU</th>
              <th className="pb-1.5 px-1">KHETLAPUR</th>
              <th className="pb-1.5 px-1">INDIA</th>
            </tr>
          </thead>
          <tbody>
            <Row label="Dietary diversity" max="(of 10)" you={`${r.dds}`} khet={`${DQQ_KHETLAPUR.dds}`} india={`${DQQ_INDIA.dds}`} good={r.dds >= 5 ? true : touched ? false : null} />
            <Row label="NCD-Protect" max="(of 9)" you={`${r.protect}`} khet={`${DQQ_KHETLAPUR.protect}`} india={`${DQQ_INDIA.protect}`} good={r.protect >= 4} />
            <Row label="NCD-Risk" max="(lower is better)" you={`${r.risk}`} khet={`${DQQ_KHETLAPUR.risk}`} india={`${DQQ_INDIA.risk}`} good={r.risk <= 1} />
            <Row label="GDR score" max="(of 18)" you={`${r.gdr}`} khet={`${DQQ_KHETLAPUR.gdr}`} india={`${DQQ_INDIA.gdr}`} good={r.gdr >= 11} />
            <Row label="MDD (≥5 groups)" you={r.mdd ? "yes" : "no"} khet={`${DQQ_KHETLAPUR.mdd}%`} india={`${DQQ_INDIA.mdd}%`} good={r.mdd} />
            <Row label="All-5" you={r.all5 ? "yes" : "no"} khet={`${DQQ_KHETLAPUR.all5}%`} india={`${DQQ_INDIA.all5}%`} good={r.all5} />
            <Row label="Zero veg or fruit" you={r.zeroVegFruit ? "yes" : "no"} khet={`${DQQ_KHETLAPUR.zeroVegFruit}%`} india={`${DQQ_INDIA.zeroVegFruit}%`} good={touched ? !r.zeroVegFruit : null} />
          </tbody>
        </table>

        <div className="mt-4 border-t border-peri-200 pt-3 text-xs text-navy/75 leading-relaxed space-y-2">
          <p>
            <strong>Reading Khetlapur:</strong> its GDR ({DQQ_KHETLAPUR.gdr}) sits near the national average ({DQQ_INDIA.gdr}) —
            but only because very low junk-food intake (NCD-Risk {DQQ_KHETLAPUR.risk}) masks very low protective-food intake
            (NCD-Protect {DQQ_KHETLAPUR.protect}). Always read GDR alongside its two halves.
          </p>
          <p>
            GDR = NCD-Protect − NCD-Risk + 9. This is a learning adaptation of the 29-item DQQ; the field version
            (dietquality.org) is country-adapted, and AFSA adds a <strong>source column</strong> per food — own farm,
            market, gathered, or support — to read market dependence. India values: Global Diet Quality Project, 2021.
          </p>
        </div>
      </div>
    </div>
  );
}
