import type { Metadata } from "next";
import PrinciplesExplorer from "@/components/PrinciplesExplorer";
import ToolMatrix from "@/components/ToolMatrix";

export const metadata: Metadata = {
  title: "The Framework · AFSA Toolkit",
  description: "The 13 agroecology principles as analytical lenses and a transformation compass.",
};

export default function FrameworkPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <p className="text-sm font-semibold tracking-wide uppercase text-teal-600">The Framework</p>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-teal-900 mt-2 max-w-3xl">
        Thirteen principles, one compass
      </h1>
      <p className="mt-5 max-w-3xl text-lg text-navy/80 leading-relaxed">
        AFSA is grounded in the <strong>13 principles of agroecology</strong> defined by the High Level Panel of
        Experts (HLPE). They serve as both analytical lenses and normative foundations — ensuring food systems are
        approached not as technical arrangements, but as living, relational systems embedded in ecological, social
        and cultural contexts.
      </p>
      <p className="mt-3 max-w-3xl text-navy/70 leading-relaxed">
        Click any principle to see what it means, what a 0 and a 4 look like on the scorecard, which tools assess
        it — and how the worked example, Khetlapur, scored. Teams may layer additional context lenses (such as
        climate) on top of their analysis, but the principle set itself is these thirteen.
      </p>

      <div className="mt-10">
        <PrinciplesExplorer />
      </div>

      <section className="mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">How the tools triangulate</h2>
        <p className="mt-2 max-w-3xl text-navy/75 leading-relaxed">
          No principle relies on a single tool. Each is read through several exercises, so what the seasonal
          calendar suggests, the rapid survey verifies and the transect walk witnesses.
        </p>
        <div className="mt-8">
          <ToolMatrix />
        </div>
      </section>
    </main>
  );
}
