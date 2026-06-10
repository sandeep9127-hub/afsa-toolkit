"use client";

import { useState } from "react";

export default function SamplingCalculator() {
  const [small, setSmall] = useState(55);
  const [medium, setMedium] = useState(25);
  const [large, setLarge] = useState(20);

  const total = small + medium + large;
  const sampleTotal = Math.max(1, Math.round(total * 0.2));
  const strata = [
    { name: "Small farmers", n: small },
    { name: "Medium farmers", n: medium },
    { name: "Large farmers", n: large },
  ].map((s) => {
    const sample = total ? Math.max(s.n > 0 ? 1 : 0, Math.round((s.n / total) * sampleTotal)) : 0;
    const q = Math.floor(sample / 4);
    const r = sample % 4;
    // distribute remainder across the four gender×age cells
    const cells = [q, q, q, q].map((v, i) => v + (i < r ? 1 : 0));
    return { ...s, sample, cells };
  });

  const Field = ({ label, value, set }: { label: string; value: number; set: (n: number) => void }) => (
    <label className="block">
      <span className="text-xs font-bold text-navy/70">{label}</span>
      <input
        type="number"
        min={0}
        max={5000}
        value={value}
        onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))}
        className="mt-1 w-full rounded-lg border border-teal-200 px-3 py-2 text-sm focus:outline-none focus:border-teal-600 bg-white"
      />
    </label>
  );

  return (
    <div className="rounded-(--radius-soft) border border-peri-200 bg-white p-5 sm:p-6">
      <p className="font-bold text-teal-900">Stratified sample calculator</p>
      <p className="text-sm text-navy/70 mt-1">
        Enter households by land-size stratum. AFSA suggests a ~20% sample with equal gender and age (25–40 / 40+)
        representation within each stratum.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Field label="Small-farmer HHs" value={small} set={setSmall} />
        <Field label="Medium-farmer HHs" value={medium} set={setMedium} />
        <Field label="Large-farmer HHs" value={large} set={setLarge} />
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs text-navy/60">
              <th className="py-2 pr-3 font-bold">Stratum</th>
              <th className="py-2 pr-3 font-bold">Households</th>
              <th className="py-2 pr-3 font-bold">Sample</th>
              <th className="py-2 font-bold">Gender × age split (M&lt;40 · F&lt;40 · M40+ · F40+)</th>
            </tr>
          </thead>
          <tbody>
            {strata.map((s) => (
              <tr key={s.name} className="border-t border-teal-50">
                <td className="py-2.5 pr-3 font-medium text-teal-900">{s.name}</td>
                <td className="py-2.5 pr-3">{s.n}</td>
                <td className="py-2.5 pr-3 font-bold text-teal-600">{s.sample}</td>
                <td className="py-2.5 text-navy/80">{s.cells.join(" · ")}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-teal-200 font-bold text-teal-900">
              <td className="py-2.5 pr-3">Total</td>
              <td className="py-2.5 pr-3">{total}</td>
              <td className="py-2.5 pr-3 text-teal-600">{strata.reduce((a, s) => a + s.sample, 0)}</td>
              <td className="py-2.5 text-xs font-normal text-navy/60">~20% of the village, every voice strata represented</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
