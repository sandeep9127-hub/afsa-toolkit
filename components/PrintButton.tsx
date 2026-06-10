"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print rounded-full border-2 border-teal-600 px-5 py-2.5 text-teal-600 text-sm font-semibold hover:bg-teal-50 transition-colors"
    >
      🖨 Print the field template
    </button>
  );
}
