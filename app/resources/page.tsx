import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS } from "@/data/tools";
import { phaseById } from "@/data/phases";

export const metadata: Metadata = {
  title: "Resources & Credits · AFSA Toolkit",
  description: "Field templates, source links and acknowledgements for the AFSA Interactive Toolkit.",
};

const LINKS = [
  { name: "Diet Quality Questionnaire — India", url: "https://www.dietquality.org/countries/ind" },
  { name: "Diet Quality Questionnaire — Bangladesh", url: "https://www.dietquality.org/countries/bgd" },
  { name: "Diet Quality Questionnaire — Nepal", url: "https://www.dietquality.org/countries/npl" },
  { name: "FAO TAPE — the scoring basis for the Principles Scorecard", url: "https://www.fao.org/agroecology/tools-tape/en/" },
];

export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <p className="text-sm font-semibold tracking-wide uppercase text-teal-600">Resources</p>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-teal-900 mt-2">Take it to the field</h1>
      <p className="mt-5 max-w-3xl text-lg text-navy/80 leading-relaxed">
        Every tool page in this toolkit prints to a clean, photocopy-friendly field template — open the tool and
        use the print button. The full guidebook holds the complete questionnaires and rubrics.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-teal-900">All field templates</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="rounded-(--radius-soft) border border-teal-50 bg-white p-4 hover:border-teal-600 transition-colors group">
              <p className="text-[11px] font-bold text-navy/50">{phaseById(t.phaseId).name.toUpperCase()}</p>
              <p className="font-semibold text-teal-900 group-hover:text-teal-600 transition-colors mt-1">{t.num}. {t.name}</p>
              <p className="text-xs text-navy/65 mt-1.5 leading-relaxed">{t.oneLiner}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-teal-900">External references</h2>
        <ul className="mt-5 space-y-2.5">
          {LINKS.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 font-medium hover:underline">
                {l.name} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-(--radius-soft) bg-teal-50 border border-teal-200 p-6 sm:p-8 max-w-3xl">
        <h2 className="text-xl font-bold text-teal-900">Credits & acknowledgement</h2>
        <div className="mt-3 space-y-3 text-sm text-navy/85 leading-relaxed">
          <p>
            This toolkit is an interactive companion to the <strong>Agroecological Food System Assessment (AFSA)
            Guidebook and Toolbox</strong> for CAT landscape-level transformation, developed by{" "}
            <strong>Anshuman Das and Divya Veluguri</strong>, adapted from Welthungerhilfe&apos;s Food System
            Transformation Framework.
          </p>
          <p>
            With expert input from Welthungerhilfe, WASSAN, Pragati, LI-BIRD (Nepal), ANSAB (Nepal), FIVDB
            (Bangladesh), WAVE Foundation (Bangladesh) and community members. Supported by Welthungerhilfe.
          </p>
          <p>
            The worked example, <strong>Khetlapur</strong>, is a fictional composite landscape created for
            learning purposes. Scores, actors and quotes illustrate the method, not any real assessment.
          </p>
        </div>
      </section>
    </main>
  );
}
