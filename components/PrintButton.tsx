"use client";

import { PrinterIcon } from "@/components/Icons";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-full border-2 border-teal-600 px-5 py-2.5 text-teal-600 text-sm font-semibold hover:bg-teal-50 active:translate-y-px transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400"
    >
      <PrinterIcon className="size-4" /> Print the field template
    </button>
  );
}
