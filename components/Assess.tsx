"use client";

import { useEffect, useState, type RefObject } from "react";
import { useLocalState } from "@/lib/useLocalState";
import { downloadPng, nodeToPng, openReport } from "@/lib/exportReport";
import { DownloadIcon, FileIcon, PencilIcon, EyeIcon } from "@/components/Icons";

export type Mode = "example" | "yours";

// Mode state that honours a #enter hash (links from the Online Tools page
// open the tool directly in entry mode, scrolled to the interactive).
export function useMode(): [Mode, (m: Mode) => void] {
  const [mode, setMode] = useState<Mode>("example");
  useEffect(() => {
    if (window.location.hash === "#enter") {
      setMode("yours");
      setTimeout(() => document.getElementById("try-it")?.scrollIntoView({ block: "start" }), 100);
    }
  }, []);
  return [mode, setMode];
}

export function ModeTabs({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const tab = (active: boolean, activeCls: string) =>
    `inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-teal-400 ${
      active ? activeCls : "text-navy/60 hover:text-teal-700"
    }`;
  return (
    <div role="tablist" aria-label="Data source" className="inline-flex rounded-full border border-teal-200 bg-white p-1 text-sm font-semibold">
      <button role="tab" aria-selected={mode === "example"} onClick={() => setMode("example")} className={tab(mode === "example", "bg-teal-600 text-white shadow-sm")}>
        <EyeIcon className="size-4" /> Khetlapur example
      </button>
      <button role="tab" aria-selected={mode === "yours"} onClick={() => setMode("yours")} className={tab(mode === "yours", "bg-coral-400 text-white shadow-sm")}>
        <PencilIcon className="size-4" /> Your landscape
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

  const Spinner = () => (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        onClick={png}
        disabled={busy !== null}
        className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-white text-sm font-semibold hover:bg-teal-900 active:translate-y-px transition-all disabled:opacity-50 disabled:active:translate-y-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400"
      >
        {busy === "png" ? <><Spinner /> Preparing…</> : <><DownloadIcon className="size-4" /> Download PNG</>}
      </button>
      <button
        onClick={report}
        disabled={busy !== null}
        className="inline-flex items-center gap-2 rounded-full border-2 border-teal-600 px-5 py-2 text-teal-600 text-sm font-semibold hover:bg-teal-50 active:translate-y-px transition-all disabled:opacity-50 disabled:active:translate-y-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400"
      >
        {busy === "report" ? <><Spinner /> Preparing…</> : <><FileIcon className="size-4" /> Download report (PDF)</>}
      </button>
      <span className="text-[11px] text-navy/55 leading-snug max-w-60">
        The report opens as a print page — choose &ldquo;Save as PDF&rdquo;. Data stays on this device only.
      </span>
    </div>
  );
}
