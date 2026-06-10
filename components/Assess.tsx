"use client";

import { useState, type RefObject } from "react";
import { useLocalState } from "@/lib/useLocalState";
import { downloadPng, nodeToPng, openReport } from "@/lib/exportReport";

export type Mode = "example" | "yours";

export function ModeTabs({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-teal-200 bg-white p-1 text-sm font-semibold">
      <button
        onClick={() => setMode("example")}
        className={`rounded-full px-4 py-1.5 transition-colors ${mode === "example" ? "bg-teal-600 text-white" : "text-navy/70 hover:text-teal-600"}`}
      >
        Khetlapur example
      </button>
      <button
        onClick={() => setMode("yours")}
        className={`rounded-full px-4 py-1.5 transition-colors ${mode === "yours" ? "bg-coral-400 text-white" : "text-navy/70 hover:text-coral-400"}`}
      >
        ✎ Your landscape
      </button>
    </div>
  );
}

export type Meta = { landscape: string; date: string; facilitator: string };

export function useMeta() {
  return useLocalState<Meta>("afsa.meta", { landscape: "", date: "", facilitator: "" });
}

export function MetaFields({ meta, setMeta }: { meta: Meta; setMeta: (m: Meta) => void }) {
  const Field = (key: keyof Meta, label: string, placeholder: string) => (
    <label className="block flex-1 min-w-36">
      <span className="text-[11px] font-bold text-navy/60">{label}</span>
      <input
        type={key === "date" ? "date" : "text"}
        value={meta[key]}
        placeholder={placeholder}
        onChange={(e) => setMeta({ ...meta, [key]: e.target.value })}
        className="mt-1 w-full rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-teal-600"
      />
    </label>
  );
  return (
    <div className="flex flex-wrap gap-3">
      {Field("landscape", "LANDSCAPE / VILLAGE", "e.g. Khetlapur cluster")}
      {Field("date", "DATE", "")}
      {Field("facilitator", "FACILITATOR / ORGANIZATION", "optional")}
    </div>
  );
}

export function ChartCaption({ meta, toolName }: { meta: Meta; toolName: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-teal-50 pb-2 mb-3">
      <p className="text-sm font-bold text-teal-900">
        {meta.landscape || "Your landscape"} <span className="font-medium text-navy/60">· {toolName}</span>
      </p>
      <p className="text-xs text-navy/55">{meta.date || ""}</p>
    </div>
  );
}

export function ExportBar({
  chartRef,
  meta,
  toolName,
  filename,
  getTableHtml,
  getNotesHtml,
}: {
  chartRef: RefObject<HTMLDivElement | null>;
  meta: Meta;
  toolName: string;
  filename: string;
  getTableHtml: () => string;
  getNotesHtml?: () => string | undefined;
}) {
  const [busy, setBusy] = useState<"png" | "report" | null>(null);

  const png = async () => {
    if (!chartRef.current) return;
    setBusy("png");
    try {
      await downloadPng(chartRef.current, `${filename}-${(meta.landscape || "afsa").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
    } finally {
      setBusy(null);
    }
  };

  const report = async () => {
    setBusy("report");
    try {
      const imgDataUrl = chartRef.current ? await nodeToPng(chartRef.current) : undefined;
      openReport({
        toolName,
        landscape: meta.landscape,
        date: meta.date,
        facilitator: meta.facilitator || undefined,
        imgDataUrl,
        tableHtml: getTableHtml(),
        notesHtml: getNotesHtml?.(),
      });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        onClick={png}
        disabled={busy !== null}
        className="rounded-full bg-teal-600 px-5 py-2.5 text-white text-sm font-semibold hover:bg-teal-900 transition-colors disabled:opacity-50"
      >
        {busy === "png" ? "Preparing…" : "⬇ Download PNG"}
      </button>
      <button
        onClick={report}
        disabled={busy !== null}
        className="rounded-full border-2 border-teal-600 px-5 py-2 text-teal-600 text-sm font-semibold hover:bg-teal-50 transition-colors disabled:opacity-50"
      >
        {busy === "report" ? "Preparing…" : "📄 Download report (PDF)"}
      </button>
      <span className="text-[11px] text-navy/55 leading-snug max-w-60">
        The report opens as a print page — choose &ldquo;Save as PDF&rdquo;. Data stays on this device only.
      </span>
    </div>
  );
}
