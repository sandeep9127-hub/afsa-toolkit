import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOLS } from "@/data/tools";
import { phaseById } from "@/data/phases";
import { principleById } from "@/data/principles";
import ToolInteractive from "@/components/ToolInteractive";
import PrintButton from "@/components/PrintButton";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  return {
    title: tool ? `${tool.name} · AFSA Toolkit` : "Tool · AFSA Toolkit",
    description: tool?.oneLiner,
  };
}

const PHASE_TONES: Record<string, { band: string; chip: string; text: string }> = {
  "pre-phase": { band: "bg-peri-300", chip: "bg-peri-100/70 text-navy", text: "text-peri-700" },
  scoping: { band: "bg-peri-500", chip: "bg-peri-100/70 text-navy", text: "text-peri-700" },
  diagnosing: { band: "bg-teal-600", chip: "bg-teal-50 text-teal-900", text: "text-teal-600" },
  visioning: { band: "bg-rose-400", chip: "bg-rose-400/15 text-navy", text: "text-rose-400" },
};

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = TOOLS.findIndex((t) => t.slug === slug);
  if (idx === -1) notFound();
  const tool = TOOLS[idx];
  const phase = phaseById(tool.phaseId);
  const tone = PHASE_TONES[tool.phaseId];
  const prev = TOOLS[idx - 1];
  const next = TOOLS[idx + 1];

  return (
    <main className="pb-16">
      {/* Phase band */}
      <div className={`${tone.band} no-print`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-white text-xs sm:text-sm font-semibold">
          <Link href={`/journey#${phase.id}`} className="hover:underline">← {phase.name}</Link>
          <span className="opacity-90">Tool {tool.num} of {TOOLS.length}</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-teal-900">{tool.name}</h1>
            <p className={`mt-2 text-lg font-medium ${tone.text}`}>{tool.oneLiner}</p>
          </div>
          <PrintButton />
        </div>

        {/* Facts strip */}
        <div className="no-print mt-6 grid gap-3 sm:grid-cols-3 text-sm">
          <div className="rounded-xl border border-teal-50 bg-white p-3.5">
            <p className="text-[11px] font-bold text-navy/60">TIME REQUIRED</p>
            <p className="font-semibold text-teal-900 mt-0.5">{tool.time}</p>
          </div>
          <div className="rounded-xl border border-teal-50 bg-white p-3.5">
            <p className="text-[11px] font-bold text-navy/60">MATERIALS</p>
            <p className="font-semibold text-teal-900 mt-0.5">{tool.materials}</p>
          </div>
          <div className="rounded-xl border border-teal-50 bg-white p-3.5">
            <p className="text-[11px] font-bold text-navy/60">PRACTICED WITH</p>
            <p className="font-semibold text-teal-900 mt-0.5">{tool.practicedWith}</p>
          </div>
        </div>

        {/* Principles served */}
        <div className="no-print mt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-navy/60 mr-1">SPEAKS TO PRINCIPLES:</span>
          {tool.principleIds.map((pid) => {
            const p = principleById(pid);
            return (
              <Link key={pid} href={`/framework#${pid}`} className={`text-xs rounded-full px-3 py-1 font-medium border border-transparent hover:border-current transition-colors ${tone.chip}`}>
                {p.num}. {p.name}
              </Link>
            );
          })}
        </div>

        {/* Purpose */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[7fr_5fr]">
          <div>
            <h2 className="text-xl font-bold text-teal-900">Why this tool</h2>
            <p className="mt-2 text-navy/85 leading-relaxed">{tool.purpose}</p>
            <ul className="mt-4 space-y-2 text-sm text-navy/85">
              {tool.purposePoints.map((p) => (
                <li key={p} className="flex gap-2.5">
                  <span className={`mt-1.5 size-2 rounded-full shrink-0 ${tone.band}`} />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-(--radius-soft) border border-teal-50 bg-teal-50/40 p-5 self-start">
            <h3 className="font-bold text-teal-900 text-sm">Discussion to facilitate</h3>
            <ul className="mt-3 space-y-2 text-sm text-navy/85">
              {tool.discussion.map((d) => (
                <li key={d} className="leading-relaxed">— {d}</li>
              ))}
            </ul>
            {tool.facilitatorNotes && (
              <div className="mt-4 border-t border-teal-200 pt-3 space-y-1.5">
                {tool.facilitatorNotes.map((n) => (
                  <p key={n} className="text-xs text-navy/75 leading-relaxed">{n}</p>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Method */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-teal-900">How to run it</h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-2">
            {tool.steps.map((s, i) => (
              <li key={s} className="rounded-(--radius-soft) border border-teal-50 bg-white p-4 flex gap-3.5">
                <span className={`shrink-0 size-7 rounded-full ${tone.band} text-white text-sm font-bold flex items-center justify-center`}>{i + 1}</span>
                <span className="text-sm text-navy/85 leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Interactive */}
        <section className="mt-12 no-print">
          <div className="flex items-center gap-2.5">
            <span className="rounded-full bg-coral-400 text-white text-[11px] font-bold px-3 py-1">TRY IT · KHETLAPUR</span>
            <h2 className="text-xl font-bold text-teal-900">See the tool in action</h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-navy/75 leading-relaxed">{tool.interactiveIntro}</p>
          <div className="mt-5">
            <ToolInteractive id={tool.interactive} />
          </div>
        </section>

        {/* Print template (visible on screen as preview, full on print) */}
        {(tool.templateCols || tool.templateRows) && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-teal-900 no-print">Field template</h2>
            <p className="no-print mt-1 text-sm text-navy/70">
              Print this page — the template below prints clean on its own, ready for chart paper transcription or a clipboard.
            </p>
            <div className="print-only mb-4">
              <h1 style={{ fontSize: "16pt", marginBottom: 4 }}>AFSA Field Template · {tool.name}</h1>
              <p style={{ fontSize: "10pt" }}>
                Time: {tool.time} · Materials: {tool.materials} · With: {tool.practicedWith}
              </p>
            </div>
            <div className="mt-4 overflow-x-auto rounded-(--radius-soft) border border-teal-200 bg-white print:border-0">
              <table className="print-table w-full text-sm border-collapse">
                <thead>
                  <tr>
                    {(tool.templateCols ?? []).map((c) => (
                      <th key={c} className="text-left p-3 text-xs font-bold text-teal-900 border-b border-teal-200 bg-teal-50/60">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(tool.templateRows ?? Array(6).fill("")).map((r, i) => (
                    <tr key={i} className="border-b border-teal-50">
                      <td className="p-3 text-sm font-medium text-navy/85 h-11">{r}</td>
                      {Array(Math.max(1, (tool.templateCols?.length ?? 2) - 1)).fill(0).map((_, j) => (
                        <td key={j} className="p-3 h-11" />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="print-only mt-4" style={{ fontSize: "9pt" }}>
              <p>Discussion prompts: {tool.discussion.join(" · ")}</p>
              <p style={{ marginTop: 6 }}>AFSA Interactive Toolkit · Consortium for Agroecological Transformations</p>
            </div>
          </section>
        )}

        {/* Prev / next */}
        <nav className="no-print mt-14 flex items-stretch justify-between gap-3 border-t border-teal-50 pt-6">
          {prev ? (
            <Link href={`/tools/${prev.slug}`} className="group max-w-[45%]">
              <p className="text-[11px] font-bold text-navy/50">← PREVIOUS TOOL</p>
              <p className="font-semibold text-teal-900 group-hover:text-teal-600 transition-colors text-sm mt-0.5">{prev.num}. {prev.name}</p>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/tools/${next.slug}`} className="group text-right max-w-[45%] ml-auto">
              <p className="text-[11px] font-bold text-navy/50">NEXT TOOL →</p>
              <p className="font-semibold text-teal-900 group-hover:text-teal-600 transition-colors text-sm mt-0.5">{next.num}. {next.name}</p>
            </Link>
          ) : (
            <Link href="/resources" className="group text-right ml-auto">
              <p className="text-[11px] font-bold text-navy/50">YOU&apos;VE COMPLETED THE JOURNEY →</p>
              <p className="font-semibold text-teal-900 group-hover:text-teal-600 transition-colors text-sm mt-0.5">Resources & credits</p>
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
