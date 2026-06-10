import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const display = Figtree({ variable: "--font-disp", subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const body = Inter({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AFSA Interactive Toolkit · Agroecological Food System Assessment",
  description:
    "An interactive companion to the AFSA guidebook — assess your landscape's food system as a living system, through 13 agroecology principles, participatory tools and a worked example.",
};

const NAV = [
  { href: "/framework", label: "The Framework" },
  { href: "/journey", label: "The Journey" },
  { href: "/tools/scorecard", label: "Scorecard" },
  { href: "/tools/causal-loop", label: "Causal Loops" },
  { href: "/resources", label: "Resources" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-teal-50 bg-white/85 backdrop-blur sticky top-0 z-40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <Image src="/cat-logo.svg" alt="Consortium for Agroecological Transformations" width={128} height={38} priority />
              <span className="hidden md:inline-block border-l border-teal-200 pl-3 text-[13px] leading-tight font-semibold text-teal-600">
                AFSA Interactive<br />Toolkit
              </span>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2 text-[13px] sm:text-sm font-medium text-navy overflow-x-auto">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="px-2.5 py-1.5 rounded-full hover:bg-teal-50 hover:text-teal-600 whitespace-nowrap transition-colors">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="mt-20 border-t border-teal-50 bg-teal-900 text-teal-50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3 text-sm">
            <div>
              <p className="font-display font-bold text-white mb-2">AFSA Interactive Toolkit</p>
              <p className="text-teal-200 leading-relaxed">
                An interactive companion to the Agroecological Food System Assessment guidebook, for organizations
                taking a landscape approach to food system transformation.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">The Guidebook</p>
              <p className="text-teal-200 leading-relaxed">
                Developed by Anshuman Das and Divya Veluguri, adapted from Welthungerhilfe&apos;s Food System
                Transformation Framework, with inputs from WHH, WASSAN, Pragati, LI-BIRD, ANSAB, FIVDB and WAVE
                Foundation — and community members across South Asia.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Note</p>
              <p className="text-teal-200 leading-relaxed">
                &ldquo;Khetlapur&rdquo;, the worked example used across this toolkit, is a fictional composite landscape
                assembled for learning. It is not a real place.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
