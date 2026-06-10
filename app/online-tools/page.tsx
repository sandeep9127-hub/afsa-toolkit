import type { Metadata } from "next";
import Link from "next/link";
import { PencilIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Online Tools · AFSA Toolkit",
  description:
    "All digital instruments for running an AFSA in one place — in-toolkit entry tools with PNG/report export, and external platforms like KoboToolbox and the DQQ.",
};

const ENTRY_TOOLS = [
  {
    name: "Stakeholder Mapping",
    href: "/tools/stakeholder-mapping#enter",
    enter: "Actors with their interest, power and role",
    output: "Power × interest grid PNG + actor table report",
    phase: "Pre-phase",
  },
  {
    name: "Village Selection Matrix",
    href: "/tools/village-selection#enter",
    enter: "Villages × criteria ticks, mark your selection",
    output: "Matrix PNG + coverage report",
    phase: "Pre-phase",
  },
  {
    name: "Transect Walk",
    href: "/tools/transect-walk#enter",
    enter: "Each niche you walked: soil, observations, 20-year change",
    output: "Transect strip PNG + niche table report",
    phase: "Scoping",
  },
  {
    name: "Diet Quality — indicators",
    href: "/tools/dqq#enter",
    enter: "Aggregated DQQ indicators computed from your Kobo export",
    output: "Benchmark comparison PNG (vs India) + report",
    phase: "Scoping",
  },
  {
    name: "Key Informants' Interviews",
    href: "/tools/kii#enter",
    enter: "Each interview: informant, insight, telling quote",
    output: "Voices board PNG + interview table report",
    phase: "Scoping",
  },
  {
    name: "Seasonal Calendar of Food",
    href: "/tools/seasonal-calendar#enter",
    enter: "Tap each food group × season: scarce, partial or abundant",
    output: "Calendar grid PNG + season-by-season report",
    phase: "Diagnosing",
  },
  {
    name: "Service Mapping & Ranking",
    href: "/tools/service-mapping#enter",
    enter: "Each service with its distance and a 1–5 satisfaction rating",
    output: "Radial service map PNG + ranked services report",
    phase: "Diagnosing",
  },
  {
    name: "Livelihood Shift Mapping",
    href: "/tools/livelihood-shift#enter",
    enter: "Households per livelihood — today vs 20 years ago, with incomes",
    output: "Then-vs-now bars PNG + shift table report",
    phase: "Diagnosing",
  },
  {
    name: "Rapid Survey — snapshot",
    href: "/tools/rapid-survey#enter",
    enter: "Key household shares computed from your Kobo export",
    output: "Snapshot bars PNG + findings report",
    phase: "Diagnosing",
  },
  {
    name: "Track a Food",
    href: "/tools/track-a-food#enter",
    enter: "Each value-chain step: actor, technology, waste, value per unit",
    output: "Chain + value bars PNG + step table report",
    phase: "Diagnosing",
  },
  {
    name: "Market Walk",
    href: "/tools/market-walk#enter",
    enter: "Observations per market section",
    output: "Observation board PNG + findings report",
    phase: "Diagnosing",
  },
  {
    name: "Agroecology Principles Scorecard",
    href: "/tools/scorecard#enter",
    enter: "Score the 13 principles 0–4 with your community and note why",
    output: "Radar diagram PNG + scorecard report",
    phase: "Diagnosing",
  },
  {
    name: "Causal Loop Diagram builder",
    href: "/tools/causal-loop#enter",
    enter: "Your system's variables and +/− links between them",
    output: "Loop diagram PNG with auto-detected leverage point + report",
    phase: "Diagnosing",
  },
  {
    name: "Community Visioning",
    href: "/tools/visioning#enter",
    enter: "Present-tense vision statements from the three circles + agreed actions",
    output: "Vision board PNG + statements & actions report",
    phase: "Visioning",
  },
];

const EXTERNAL = [
  {
    name: "KoboToolbox",
    url: "https://www.kobotoolbox.org",
    used: "Diet Quality Questionnaire · Rapid Survey",
    why: "The two per-respondent surveys are collected here — offline mobile data collection by multiple enumerators, with aggregation and export built in. Set the forms up in Kobo before going to the field.",
  },
  {
    name: "DQQ questionnaires (dietquality.org)",
    url: "https://www.dietquality.org/countries/ind",
    used: "Diet Quality Questionnaire",
    why: "Country-adapted, local-language versions of the DQQ — India, Bangladesh and Nepal — plus national benchmark values (GDR, NCD-Protect, NCD-Risk, MDD) to compare your landscape against.",
    links: [
      { label: "India", url: "https://www.dietquality.org/countries/ind" },
      { label: "Bangladesh", url: "https://www.dietquality.org/countries/bgd" },
      { label: "Nepal", url: "https://www.dietquality.org/countries/npl" },
    ],
  },
  {
    name: "FAO TAPE",
    url: "https://www.fao.org/agroecology/tools-tape/en/",
    used: "Agroecology Principles Scorecard",
    why: "The Tool for Agroecology Performance Evaluation — the methodological basis for the scorecard's 0–4 rubrics. Useful as the reference when adapting rubric anchors to your context.",
  },
];

export default function OnlineToolsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <p className="text-sm font-semibold tracking-wide uppercase text-teal-600">Online Tools</p>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-teal-900 mt-2 max-w-3xl">
        The digital instruments, in one place
      </h1>
      <p className="mt-5 max-w-3xl text-lg text-navy/80 leading-relaxed">
        Most AFSA exercises happen on the ground, with chart paper and a community. The digital layer sits
        around them: enter the results of the participatory exercises here and download report-ready outputs —
        and run the two individual surveys in KoboToolbox.
      </p>

      {/* In-toolkit entry tools */}
      <section className="mt-12">
        <div className="flex items-center gap-2.5">
          <span className="rounded-full bg-coral-400 text-white text-[11px] font-bold px-3 py-1">IN THIS TOOLKIT</span>
          <h2 className="text-2xl font-bold text-teal-900">Enter data, download clean outputs</h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-navy/75 leading-relaxed">
          Each opens directly in <strong>&ldquo;Your landscape&rdquo;</strong> entry mode. Everything stays on your
          device — nothing is uploaded — and every chart exports as a high-resolution PNG plus a print-ready PDF
          report for your assessment write-up.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {ENTRY_TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group rounded-(--radius-soft) border border-teal-200 bg-white p-5 hover:border-coral-400 hover:shadow-md transition-all"
            >
              <p className="text-[11px] font-bold text-navy/50">{t.phase.toUpperCase()}</p>
              <h3 className="font-bold text-teal-900 mt-1 group-hover:text-teal-600 transition-colors">{t.name}</h3>
              <p className="text-sm text-navy/75 mt-2 leading-relaxed"><span className="font-semibold text-navy/55">You enter:</span> {t.enter}</p>
              <p className="text-sm text-navy/75 mt-1 leading-relaxed"><span className="font-semibold text-navy/55">You download:</span> {t.output}</p>
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-coral-400 mt-3">
                <PencilIcon className="size-4" /> Open in entry mode
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* External platforms */}
      <section className="mt-14">
        <div className="flex items-center gap-2.5">
          <span className="rounded-full bg-peri-700 text-white text-[11px] font-bold px-3 py-1">EXTERNAL PLATFORMS</span>
          <h2 className="text-2xl font-bold text-teal-900">Survey collection & references</h2>
        </div>
        <div className="mt-6 space-y-4">
          {EXTERNAL.map((e) => (
            <div key={e.name} className="rounded-(--radius-soft) border border-peri-200 bg-white p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="font-bold text-teal-900 hover:text-teal-600 transition-colors">
                  {e.name} ↗
                </a>
                <span className="text-xs font-semibold text-peri-700">Used for: {e.used}</span>
              </div>
              <p className="mt-2 text-sm text-navy/80 leading-relaxed">{e.why}</p>
              {e.links && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {e.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs rounded-full bg-peri-100/60 border border-peri-200 px-3 py-1 font-medium text-navy hover:border-peri-500 transition-colors"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-14 rounded-(--radius-soft) bg-teal-50 border border-teal-200 p-6 max-w-3xl">
        <h2 className="text-lg font-bold text-teal-900">How this fits the journey</h2>
        <p className="mt-2 text-sm text-navy/85 leading-relaxed">
          The field methodology lives in <Link href="/journey" className="text-teal-600 font-semibold hover:underline">The Journey</Link> —
          this page is just the digital toolbox you bring along: Kobo forms ready before Phase 1, and the entry
          tools above after each Phase 2 exercise, so the chart-paper results become report-ready figures the
          same evening.
        </p>
      </div>
    </main>
  );
}
