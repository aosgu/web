import { Nav } from "./components/Nav";
import { Hero, Overview, CellularBasis, Intervention, References } from "./components/sections";
import { PathwaySection } from "./components/PathwaySection";
import { pathways } from "./data/pathways";

export default function App() {
  return (
    <div id="top" className="grain relative min-h-screen bg-black">
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Overview />
        <CellularBasis />

        {/* pathway divider label */}
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/30">
              The Pathways
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
          </div>
        </div>

        {pathways.map((p, i) => (
          <PathwaySection key={p.id} pathway={p} flip={i % 2 === 1} />
        ))}

        <div id="intervention">
          <Intervention />
        </div>

        <References />
      </main>
    </div>
  );
}
