import { Suspense, useState } from "react";
import { Scene } from "./three/Scene";
import { PALETTES } from "./three/theme";

export default function App() {
  const [index, setIndex] = useState(0);
  const palette = PALETTES[index];

  return (
    <main
      className="relative h-screen w-screen overflow-hidden text-white transition-colors duration-700 ease-out"
      style={{ backgroundColor: palette.bg }}
    >
      {/* ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-30 blur-[140px] transition-colors duration-700"
          style={{ backgroundColor: palette.glowA }}
        />
        <div
          className="absolute bottom-[-20%] left-1/2 h-[560px] w-[760px] -translate-x-1/2 rounded-full opacity-30 blur-[150px] transition-colors duration-700"
          style={{ backgroundColor: palette.glowB }}
        />
        <div
          className="absolute left-[-10%] top-1/3 h-[420px] w-[420px] rounded-full opacity-25 blur-[140px] transition-colors duration-700"
          style={{ backgroundColor: palette.glowC }}
        />
      </div>

      {/* 3D canvas */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <Scene palette={palette} />
        </Suspense>
      </div>

      {/* drag hint */}
      <div className="pointer-events-none absolute right-6 top-6 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-white/70 backdrop-blur-md sm:right-10 sm:top-8">
        <span
          className="inline-block h-2 w-2 animate-pulse rounded-full transition-colors duration-500"
          style={{ backgroundColor: palette.pale }}
        />
        Drag to explore
      </div>

      {/* ---- Colour scheme picker ---- */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-6 sm:pb-8">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/45">
            Color scheme
          </span>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
            {PALETTES.map((p, i) => {
              const active = i === index;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={active}
                  aria-label={p.name}
                  className={`group relative flex items-center gap-2.5 rounded-full py-2 pl-2 pr-2 transition-all duration-300 sm:pr-4 ${
                    active ? "bg-white/12" : "hover:bg-white/8"
                  }`}
                >
                  {/* swatch */}
                  <span
                    className={`relative block h-8 w-8 rounded-full ring-2 transition-all duration-300 ${
                      active ? "ring-white scale-110" : "ring-white/15 group-hover:ring-white/40"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${p.deep} 0%, ${p.pale} 60%, ${p.white} 100%)`,
                      boxShadow: active ? `0 0 22px ${p.deep}99` : undefined,
                    }}
                  >
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 45%)",
                      }}
                    />
                  </span>
                  <span
                    className={`hidden text-sm font-bold tracking-tight transition-colors duration-300 sm:block ${
                      active ? "text-white" : "text-white/55 group-hover:text-white/80"
                    }`}
                  >
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
