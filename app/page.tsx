import Link from "next/link";
import { PRINCIPLES } from "@/data/principles";
import { PHASES } from "@/data/phases";
import SynthesisChain from "@/components/SynthesisChain";

const FEATURES = [
  {
    title: "Participatory & visual",
    body: "Transect walks, seasonal calendars, livelihood maps — methods communities draw on the ground, designed to include women, youth and marginalized voices.",
  },
  {
    title: "Systemic, not symptomatic",
    body: "AFSA links lived realities to landscape dynamics and policy structures — uncovering feedback loops and root causes, not isolated indicators.",
  },
  {
    title: "Action-oriented",
    body: "Outcomes feed community charters, local plans and advocacy — bridging analysis to strategy, voice to policy, knowledge to power.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50/70 to-transparent">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <p className="text-sm font-semibold tracking-wide uppercase text-teal-600 mb-4">
            Agroecological Food System Assessment
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-teal-900 max-w-3xl leading-[1.05]">
            Assess your food system as a <span className="text-teal-600">living system</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-navy/80 leading-relaxed">
            AFSA is a participatory methodology for community-led food system transformation — grounded in the
            13 principles of agroecology. This toolkit walks you through it, hands-on, with a complete worked
            example from a fictional landscape called <strong>Khetlapur</strong>.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/journey" className="rounded-full bg-teal-600 px-6 py-3 text-white font-semibold hover:bg-teal-900 transition-colors">
              Start the journey
            </Link>
            <Link href="/tools/scorecard" className="rounded-full border-2 border-teal-600 px-6 py-3 text-teal-600 font-semibold hover:bg-teal-50 transition-colors">
              Try the scorecard
            </Link>
          </div>
        </div>
      </section>

      {/* Synthesis chain */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">How AFSA fits together</h2>
        <p className="mt-2 max-w-2xl text-navy/75">
          Every exercise feeds one synthesis: evidence becomes scores, scores become a picture, the picture
          becomes a diagnosis, and the diagnosis becomes a community&apos;s plan.
        </p>
        <div className="mt-8">
          <SynthesisChain />
        </div>
      </section>

      {/* What makes it transformative */}
      <section className="bg-peri-100/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">More than a diagnostic</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="bg-white rounded-(--radius-soft) p-6 border border-peri-100 reveal" style={{ "--i": i } as React.CSSProperties}>
                <h3 className="font-bold text-peri-700">{f.title}</h3>
                <p className="mt-2 text-sm text-navy/80 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles preview */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">The 13 principles, as a compass</h2>
            <p className="mt-2 max-w-2xl text-navy/75">
              Not a checklist — analytical lenses and normative foundations, woven through every phase.
            </p>
          </div>
          <Link href="/framework" className="text-teal-600 font-semibold hover:underline whitespace-nowrap">
            Explore the framework →
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {PRINCIPLES.map((p) => (
            <Link
              key={p.id}
              href={`/framework#${p.id}`}
              className="rounded-full bg-teal-50 text-teal-900 border border-teal-200 px-4 py-2 text-sm font-medium hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-colors"
            >
              {p.num}. {p.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Phases preview */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">Three phases, one journey</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PHASES.map((ph, i) => {
            const tone =
              ph.id === "diagnosing" ? "border-teal-600 bg-teal-50/60" :
              ph.id === "visioning" ? "border-rose-400 bg-rose-400/10" :
              ph.id === "scoping" ? "border-peri-500 bg-peri-100/50" :
              "border-peri-300 bg-peri-100/30";
            return (
              <Link key={ph.id} href={`/journey#${ph.id}`} style={{ "--i": i } as React.CSSProperties} className={`reveal lift rounded-(--radius-soft) border-l-4 ${tone} p-5 hover:shadow-md`}>
                <p className="text-xs font-bold text-navy/60">PHASE {ph.num} · {ph.timeline}</p>
                <h3 className="font-bold text-teal-900 mt-1">{ph.name.replace(/^.*?: /, "")}</h3>
                <p className="text-sm mt-2 text-navy/75 leading-relaxed">{ph.tagline}</p>
                <p className="text-xs mt-3 font-semibold text-teal-600">{ph.toolSlugs.length} tool{ph.toolSlugs.length > 1 ? "s" : ""} →</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
