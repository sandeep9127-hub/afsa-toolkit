import type { Metadata } from "next";
import Link from "next/link";
import { PHASES } from "@/data/phases";
import { TOOLS, toolBySlug } from "@/data/tools";
import SamplingCalculator from "@/components/interactives/SamplingCalculator";

export const metadata: Metadata = {
  title: "The Journey · AFSA Toolkit",
  description: "Pre-phase to visioning: the AFSA phases, tools and timelines at a glance.",
};

const PHASE_TONES: Record<string, { dot: string; band: string; chip: string }> = {
  "pre-phase": { dot: "bg-peri-300", band: "border-peri-300", chip: "bg-peri-100/60 border-peri-200 text-navy" },
  scoping: { dot: "bg-peri-500", band: "border-peri-500", chip: "bg-peri-100/60 border-peri-300 text-navy" },
  diagnosing: { dot: "bg-teal-600", band: "border-teal-600", chip: "bg-teal-50 border-teal-200 text-teal-900" },
  visioning: { dot: "bg-rose-400", band: "border-rose-400", chip: "bg-rose-400/10 border-rose-400/40 text-navy" },
};

const TEAM = [
  { role: "1 Facilitator", note: "fluent in the local language, experienced in PRA exercises" },
  { role: "2 Documenters", note: "note everything, assist, run KIIs and individual surveys" },
  { role: "1 Photographer", note: "with an audio recorder alongside the camera" },
  { role: "2–3 Volunteers", note: "from or close to the community" },
  { role: "≥2–3 women", note: "across the team — non-negotiable" },
];

const BOUNDARY = [
  { name: "Agroecological coherence", desc: "A contiguous region with similar agroecology — evidence of a shared cropping pattern, farm system, dietary diversity and ecosystem services." },
  { name: "Governance coherence", desc: "Aligns with an existing governance unit (Gram Sabha, palika) with active development bodies, local champions, and institutions that can act on findings." },
  { name: "Social coherence", desc: "Inclusion of marginalized groups, willingness to co-create, and presence of youth groups, SHGs, producer collectives and local innovators." },
];

export default function JourneyPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <p className="text-sm font-semibold tracking-wide uppercase text-teal-600">The Journey</p>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-teal-900 mt-2 max-w-3xl">
        From preparation to vision in three months
      </h1>
      <p className="mt-5 max-w-3xl text-lg text-navy/80 leading-relaxed">
        AFSA unfolds across a pre-phase and three phases. They can be treated non-linearly and adapted to local
        needs — if scoping has already been done by another program, start where your landscape actually is.
      </p>

      {/* Timeline */}
      <div className="mt-12 relative">
        <div className="absolute left-4 sm:left-5 top-2 bottom-2 w-0.5 bg-teal-200" aria-hidden />
        <div className="space-y-10">
          {PHASES.map((ph) => {
            const tone = PHASE_TONES[ph.id];
            return (
              <section key={ph.id} id={ph.id} className="relative pl-12 sm:pl-16 scroll-mt-24">
                <span className={`absolute left-1.5 sm:left-2.5 top-1 size-5 rounded-full ring-4 ring-white ${tone.dot}`} aria-hidden />
                <p className="text-xs font-bold text-navy/60">PHASE {ph.num} · {ph.timeline}</p>
                <h2 className="text-2xl font-bold text-teal-900 mt-1">{ph.name}</h2>
                <p className="text-navy/75 mt-1">{ph.tagline}</p>

                <div className={`mt-4 rounded-(--radius-soft) border-l-4 ${tone.band} bg-white border border-teal-50 p-5`}>
                  <p className="text-xs font-bold text-navy/60 mb-2">OBJECTIVES</p>
                  <ul className="grid gap-1.5 sm:grid-cols-2 text-sm text-navy/85">
                    {ph.objectives.map((o) => (
                      <li key={o} className="flex gap-2"><span className="text-teal-600 font-bold">·</span>{o}</li>
                    ))}
                  </ul>
                  <p className="text-xs font-bold text-navy/60 mt-4 mb-2">TOOLS IN THIS PHASE</p>
                  <div className="flex flex-wrap gap-2">
                    {ph.toolSlugs.map((slug) => {
                      const t = toolBySlug(slug);
                      return (
                        <Link key={slug} href={`/tools/${slug}`} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium hover:shadow-sm transition-shadow ${tone.chip}`}>
                          {t.num}. {t.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {ph.id === "pre-phase" && (
                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <div className="rounded-(--radius-soft) border border-peri-200 bg-white p-5">
                      <p className="font-bold text-teal-900">Defining the landscape boundary</p>
                      <p className="text-sm text-navy/70 mt-1">Coherence accelerates transformation. Look for three kinds:</p>
                      <ul className="mt-3 space-y-2.5 text-sm">
                        {BOUNDARY.map((b) => (
                          <li key={b.name}>
                            <span className="font-semibold text-peri-700">{b.name}.</span>{" "}
                            <span className="text-navy/80">{b.desc}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 border-t border-teal-50 pt-4">
                        <p className="font-bold text-teal-900 text-sm">The field team</p>
                        <ul className="mt-2 space-y-1.5 text-sm text-navy/85">
                          {TEAM.map((t) => (
                            <li key={t.role}><span className="font-semibold">{t.role}</span> — {t.note}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <SamplingCalculator />
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <div className="mt-16 rounded-(--radius-soft) bg-teal-50 border border-teal-200 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-teal-900">Before the first exercise</h2>
        <p className="mt-2 text-navy/80 text-sm leading-relaxed max-w-3xl">
          Visit the village beforehand to fix a date, time and gathering place with the community. Ask them to bring
          local seeds and crops for an exhibition that day, and to cook a meal only from local ingredients — the
          exercises begin with the food itself.
        </p>
        <Link href={`/tools/${TOOLS[0].slug}`} className="inline-block mt-4 rounded-full bg-teal-600 px-5 py-2.5 text-white text-sm font-semibold hover:bg-teal-900 transition-colors">
          Begin with Tool 1: Stakeholder Mapping →
        </Link>
      </div>
    </main>
  );
}
