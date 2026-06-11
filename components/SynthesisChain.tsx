import { ChevronRightIcon, ArrowRightIcon, FlagIcon } from "@/components/Icons";

// The six-step synthesis, flowing left-to-right in the phase gradient
// (periwinkle scoping -> teal diagnosing -> coral leverage -> rose visioning),
// landing on the payoff: a community-owned action plan.
const STEPS = [
  { n: 1, label: "Listen with the tools", sub: "Walks, calendars, surveys, interviews", bg: "bg-peri-500" },
  { n: 2, label: "Score 13 principles", sub: "Every tool feeds the scorecard", bg: "bg-peri-700" },
  { n: 3, label: "Read the radar", sub: "One picture of food system health", bg: "bg-teal-600" },
  { n: 4, label: "Trace the loops", sub: "Low scores become causal stories", bg: "bg-teal-900" },
  { n: 5, label: "Find the leverage point", sub: "The node that moves the system", bg: "bg-coral-400" },
  { n: 6, label: "Vision the future", sub: "Youth and women at the centre", bg: "bg-rose-400" },
];

function Tile({ step, i, className = "" }: { step: (typeof STEPS)[number]; i: number; className?: string }) {
  return (
    <div className={`reveal ${step.bg} rounded-(--radius-soft) p-4 text-white ${className}`} style={{ "--i": i } as React.CSSProperties}>
      <span className="text-xs font-bold opacity-70">STEP {step.n}</span>
      <p className="font-semibold leading-snug mt-1">{step.label}</p>
      <p className="text-xs mt-1.5 opacity-85 leading-relaxed">{step.sub}</p>
    </div>
  );
}

function Connector() {
  return (
    <span aria-hidden className="reveal shrink-0 self-center grid place-items-center size-7 rounded-full bg-white border border-teal-200 text-teal-600 shadow-sm">
      <ChevronRightIcon className="size-4" />
    </span>
  );
}

function Payoff({ i }: { i: number }) {
  // Outer element owns the entrance (.reveal); inner owns the pulse ring
  // (.payoff-pulse) — they can't share one element, as both set `animation`.
  return (
    <div className="reveal mx-auto max-w-2xl" style={{ "--i": i } as React.CSSProperties}>
      <div className="payoff-pulse relative rounded-(--radius-soft) border-2 border-teal-600 bg-teal-50/70 p-5 sm:p-6 flex items-start gap-4">
        <span className="shrink-0 grid place-items-center size-11 rounded-full bg-teal-600 text-white">
          <FlagIcon className="size-5" />
        </span>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wide text-teal-600">The payoff</span>
          <p className="font-bold text-teal-900 text-lg leading-snug">A community-owned action plan</p>
          <p className="text-sm text-navy/70 mt-1 leading-relaxed">
            Built around the leverage point — ready to take to the Gram Panchayat, with report-ready figures behind it.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SynthesisChain() {
  return (
    <div aria-label="The AFSA synthesis: six steps leading to a community action plan">
      {/* The six steps */}
      {/* Desktop / tablet: one continuous horizontal flow with visible connectors */}
      <div className="hidden lg:flex items-stretch gap-2">
        {STEPS.map((step, i) => (
          <div key={step.n} className="contents">
            <Tile step={step} i={i} className="flex-1" />
            {i < STEPS.length - 1 && <Connector />}
          </div>
        ))}
      </div>

      {/* Mobile: stacked steps */}
      <div className="lg:hidden grid sm:grid-cols-2 gap-3">
        {STEPS.map((step, i) => (
          <Tile key={step.n} step={step} i={i} />
        ))}
      </div>

      {/* …all leading to the payoff */}
      <div className="mt-4 flex flex-col items-center">
        <span aria-hidden className="reveal flex flex-col items-center text-coral-400" style={{ "--i": 6 } as React.CSSProperties}>
          <span className="w-0.5 h-4 rounded-full bg-gradient-to-b from-rose-400 to-coral-400" />
          <ArrowRightIcon className="size-6 rotate-90 -mt-1" />
        </span>
      </div>
      <div className="mt-3">
        <Payoff i={7} />
      </div>
    </div>
  );
}
