import { useEffect, useRef, useState, type ReactNode } from "react";
import Horn, { type Corner } from "./Horn";
import SectionLabel from "./SectionLabel";
import { useLoopTime, useScrollProgress } from "../hooks/useScroll";
import { COLORS } from "../lib/palette";

/* ---------- Mini visuals ---------- */

function KineticGrid() {
  const colors = [COLORS.green, COLORS.blue, COLORS.navy, COLORS.sky];
  return (
    <div className="grid h-full w-full grid-cols-6 grid-rows-4 gap-[2px] bg-ink">
      {Array.from({ length: 24 }).map((_, i) => {
        const r = Math.floor(i / 6);
        const c = i % 6;
        return (
          <div key={i} className="flex items-center justify-center bg-paper">
            <span
              className="anim-pulse block h-full w-full"
              style={{ background: colors[(r + c) % 4], animationDelay: `${(r + c) * 0.14}s` }}
            />
          </div>
        );
      })}
    </div>
  );
}

function ArcSystem() {
  const t = useLoopTime();
  const corners: Corner[] = ["tl", "tr", "br", "bl"];
  const fills = [COLORS.green, COLORS.sky, COLORS.navy, COLORS.blue];
  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[2px] bg-ink">
      {corners.map((c, i) => {
        const s = 0.22 + 0.78 * (0.5 + 0.5 * Math.sin(t * 1.6 + i * (Math.PI / 2)));
        return (
          <div key={c} className="relative bg-paper">
            <Horn corner={c} fill={fills[i]} scale={s} transition="none" className="absolute inset-0 h-full w-full" />
          </div>
        );
      })}
    </div>
  );
}

function StrokeChoreo() {
  const rings = [100, 76, 52, 28];
  const cols = [COLORS.green, COLORS.blue, COLORS.navy, COLORS.ink];
  return (
    <div className="grid-paper h-full w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
        {rings.map((R, i) => (
          <path
            key={R}
            pathLength={1}
            d={`M ${100 - R} 100 A ${R} ${R} 0 0 1 100 ${100 - R}`}
            fill="none"
            stroke={cols[i]}
            strokeWidth={2.2}
            className="anim-draw"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

function OrbitRings() {
  return (
    <div className="grid-paper h-full w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <g className="anim-spin-cw">
          <circle cx="50" cy="50" r="44" fill="none" stroke={COLORS.green} strokeWidth="1.2" strokeDasharray="6 4" />
          <circle cx="50" cy="6" r="3" fill={COLORS.green} />
        </g>
        <g className="anim-spin-ccw">
          <circle cx="50" cy="50" r="28" fill="none" stroke={COLORS.blue} strokeWidth="1.6" />
          <circle cx="50" cy="22" r="2.6" fill={COLORS.blue} />
          <circle cx="78" cy="50" r="2.6" fill={COLORS.blue} />
        </g>
        <rect x="41" y="41" width="18" height="18" fill={COLORS.navy} transform="rotate(45 50 50)" />
      </svg>
    </div>
  );
}

/* ---------- Case studies ---------- */

const cards: { no: string; title: string; tags: string; desc: string; visual: ReactNode }[] = [
  {
    no: "01",
    title: "Kinetic Grid",
    tags: "Layout · Keyframes",
    desc: "A modular field where every cell breathes on its own phase, forming waves across a plain grid.",
    visual: <KineticGrid />,
  },
  {
    no: "02",
    title: "Arc System",
    tags: "Vector · Loop",
    desc: "Four quarter-disc tiles pulsing in sequence. One geometry rule, endless variations.",
    visual: <ArcSystem />,
  },
  {
    no: "03",
    title: "Stroke Choreography",
    tags: "SVG · Path",
    desc: "Concentric arcs drawn and erased in a staggered loop using stroke-dashoffset.",
    visual: <StrokeChoreo />,
  },
  {
    no: "04",
    title: "Orbit Study",
    tags: "Rotation · Timing",
    desc: "Counter-rotating rings at different speeds, anchored by a single navy square.",
    visual: <OrbitRings />,
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);
  const p = useScrollProgress(sectionRef, "pinned");

  useEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (!t) return;
      setOverflow(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const current = Math.min(cards.length, Math.floor(p * cards.length) + 1);

  return (
    <section id="motion" ref={sectionRef} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="flex items-end justify-between gap-8 px-6 md:px-12">
          <div>
            <SectionLabel index="05" title="Motion" />
            <h2 className="mt-6 text-[clamp(2.6rem,6vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.04em]">
              Scroll, sequenced.
            </h2>
          </div>
          <div className="hidden font-mono text-xs uppercase tracking-[0.18em] md:block">
            {String(current).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-12 flex w-max gap-6 px-6 will-change-transform md:px-12"
          style={{ transform: `translate3d(${-p * overflow}px, 0, 0)` }}
        >
          {cards.map((c) => (
            <article
              key={c.no}
              data-hover
              className="group flex h-[56vh] w-[min(78vw,560px)] shrink-0 flex-col border border-ink bg-paper"
            >
              <header className="flex justify-between border-b border-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.16em]">
                <span>Study {c.no}</span>
                <span>{c.tags}</span>
              </header>
              <div className="relative flex-1 overflow-hidden">
                <div className="absolute inset-0">{c.visual}</div>
              </div>
              <footer className="flex items-end justify-between gap-6 border-t border-ink p-5">
                <div>
                  <h3 className="text-3xl font-medium tracking-[-0.03em]">{c.title}</h3>
                  <p className="mt-2 max-w-[40ch] text-sm leading-relaxed opacity-75">{c.desc}</p>
                </div>
                <span className="text-2xl transition-transform duration-500 group-hover:-rotate-45">↗</span>
              </footer>
            </article>
          ))}
        </div>

        <div className="relative mx-6 mt-12 h-px bg-ink/20 md:mx-12">
          <div className="absolute inset-y-0 left-0 bg-blue" style={{ width: `${p * 100}%` }} />
        </div>
      </div>
    </section>
  );
}
