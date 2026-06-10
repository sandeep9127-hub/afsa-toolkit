"use client";

import { toPng } from "html-to-image";

export async function nodeToPng(node: HTMLElement): Promise<string> {
  return toPng(node, { pixelRatio: 2.5, backgroundColor: "#ffffff", cacheBust: true });
}

export async function downloadPng(node: HTMLElement, filename: string) {
  const dataUrl = await nodeToPng(node);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  a.click();
}

const esc = (s: string | number) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export type ReportOptions = {
  toolName: string;
  landscape: string;
  date: string;
  facilitator?: string;
  imgDataUrl?: string;
  tableHtml: string;
  notesHtml?: string;
};

// Opens a clean, print-optimized report in a new tab (via a Blob URL — all
// dynamic content is HTML-escaped). The user prints it / saves as PDF.
export function openReport(o: ReportOptions) {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(o.toolName)} — ${esc(o.landscape || "AFSA Report")}</title>
<style>
  body { font-family: Inter, -apple-system, "Segoe UI", sans-serif; color: #1c2a29; margin: 40px auto; max-width: 760px; padding: 0 24px; }
  header { border-bottom: 3px solid #2e7573; padding-bottom: 12px; margin-bottom: 20px; }
  .kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: #2e7573; text-transform: uppercase; }
  h1 { font-size: 24px; margin: 4px 0 2px; color: #334b4a; }
  .meta { font-size: 13px; color: #555; }
  img.chart { width: 100%; border: 1px solid #dde8e4; border-radius: 10px; margin: 18px 0; }
  h2 { font-size: 15px; color: #2e7573; margin: 22px 0 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  th, td { border: 1px solid #b8ccca; padding: 7px 9px; text-align: left; vertical-align: top; }
  th { background: #e1ede8; color: #334b4a; }
  footer { margin-top: 28px; padding-top: 10px; border-top: 1px solid #dde8e4; font-size: 11px; color: #888; }
  @media print { body { margin: 0 auto; } }
</style></head><body>
<header>
  <p class="kicker">Agroecological Food System Assessment</p>
  <h1>${esc(o.toolName)}</h1>
  <p class="meta">${esc(o.landscape || "—")}${o.date ? " · " + esc(o.date) : ""}${o.facilitator ? " · Facilitated by " + esc(o.facilitator) : ""}</p>
</header>
${o.imgDataUrl ? `<img class="chart" src="${o.imgDataUrl}" alt="${esc(o.toolName)} visualisation" />` : ""}
<h2>Data</h2>
${o.tableHtml}
${o.notesHtml ? `<h2>Notes</h2>${o.notesHtml}` : ""}
<footer>Generated with the AFSA Interactive Toolkit · afsa-toolkit.vercel.app · Consortium for Agroecological Transformations</footer>
<script>window.onload = () => setTimeout(() => window.print(), 400);</script>
</body></html>`;

  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const w = window.open(url, "_blank");
  if (!w) alert("Please allow pop-ups to download the report.");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function rowsToTable(headers: string[], rows: (string | number)[][]): string {
  return `<table><thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
}
