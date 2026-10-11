import { useState } from "react";
import { BOTH_LOW, SIZE_STATS, STRENGTH_STATS } from "../lib/data";
import { useInView, useProgress } from "../lib/hooks";
import { sfx } from "../lib/sound";

type Region = "size" | "strength" | "both";

/** Area of intersection of two circles with radii r1, r2 at centre distance d. */
function lensArea(r1: number, r2: number, d: number) {
  if (d >= r1 + r2) return 0;
  if (d <= Math.abs(r1 - r2)) return Math.PI * Math.min(r1, r2) ** 2;
  const a = r1 * r1 * Math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1));
  const b = r2 * r2 * Math.acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2));
  const c = 0.5 * Math.sqrt((-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2));
  return a + b - c;
}

/** Area-proportional two-circle Venn: circle area ∝ head-count, overlap area ∝ both. */
function computeVenn() {
  const RA = 150;
  const unit = (Math.PI * RA * RA) / SIZE_STATS.lowN; // px² per person
  const RB = Math.sqrt((STRENGTH_STATS.lowN * unit) / Math.PI);
  const target = BOTH_LOW.n * unit;

  let lo = Math.abs(RA - RB);
  let hi = RA + RB;
  for (let i = 0; i < 90; i++) {
    const mid = (lo + hi) / 2;
    if (lensArea(RA, RB, mid) > target) lo = mid;
    else hi = mid;
  }
  const D = (lo + hi) / 2;

  const span = RA + D + RB;
  const xA = 380 - span / 2 + RA;
  const xB = xA + D;
  const yc = 262;

  const a = (RA * RA - RB * RB + D * D) / (2 * D);
  const h = Math.sqrt(Math.max(0, RA * RA - a * a));
  const x1 = xA + a;
  const lensX = (xB - RB + (xA + RA)) / 2;
  const path = `M ${x1} ${yc - h} A ${RA} ${RA} 0 ${a < 0 ? 1 : 0} 1 ${x1} ${yc + h} A ${RB} ${RB} 0 ${D - a < 0 ? 1 : 0} 1 ${x1} ${yc - h} Z`;

  return { RA, RB, xA, xB, yc, lensX, lensTop: yc - h, path };
}

const GEO = computeVenn();

const READOUT: Record<Region | "idle", { title: string; body: string }> = {
  size: {
    title: "Low for muscle size",
    body: "84 of 287 trainees (29.3%) gained less than +1.6%, the upper 95% limit of the no-training controls. Another 39 (14.6%) showed no gain or a loss.",
  },
  strength: {
    title: "Low for strength",
    body: "19 of 283 trainees (6.7%) gained less than +5.0% in leg-press 1RM. Low strength responses were far rarer than low size responses.",
  },
  both: {
    title: "Low on both",
    body: "Only 9 people (3.2% of 283) were low responders for both size and strength. Most low responders for one trait responded on the other.",
  },
  idle: {
    title: "Hover a region",
    body: "Circle areas are drawn in proportion to head-count, so the overlap is to scale. Low responders are defined against non-training controls.",
  },
};

export default function ResponderVenn() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const p = useProgress(inView, 1500, 150);
  const [region, setRegion] = useState<Region | null>(null);
  const { RA, RB, xA, xB, yc, lensX, lensTop, path } = GEO;

  const enter = (r: Region) => {
    setRegion(r);
    sfx.hover(r === "size" ? 0.25 : r === "strength" ? 0.6 : 0.9);
  };

  const text = READOUT[region ?? "idle"];

  const tiles = [
    { v: "29.3%", l: "low, size", s: "84 of 287" },
    { v: "6.7%", l: "low, strength", s: "19 of 283" },
    { v: "3.2%", l: "low on both", s: "9 of 283" },
    { v: "12.2%", l: "high, size", s: "35 of 287 · >1 SD" },
  ];

  return (
    <div ref={ref} className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="card p-4 md:p-8">
        <svg
          viewBox="0 0 760 490"
          className="h-auto w-full"
          role="img"
          aria-label="Area-proportional Venn diagram of low responders for size and strength"
        >
          <defs>
            <filter id="venn-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="venn-a" cx="0.35" cy="0.35" r="0.8">
              <stop offset="0" stopColor="#4d75ff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#002fa7" stopOpacity="0.28" />
            </radialGradient>
          </defs>

          {/* Circle A: low for size */}
          <g
            onPointerEnter={() => enter("size")}
            onPointerLeave={() => setRegion(null)}
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={xA}
              cy={yc}
              r={RA}
              fill="url(#venn-a)"
              stroke="#6f8cff"
              strokeWidth={1.5}
              style={{
                transform: `scale(${p})`,
                transformOrigin: `${xA}px ${yc}px`,
                opacity: region === "strength" ? 0.55 : 1,
                transition: "opacity .4s ease",
              }}
            />
          </g>

          {/* Circle B: low for strength */}
          <g
            onPointerEnter={() => enter("strength")}
            onPointerLeave={() => setRegion(null)}
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={xB}
              cy={yc}
              r={RB}
              fill="rgba(201,214,255,0.16)"
              stroke="#c9d6ff"
              strokeWidth={1.5}
              style={{
                transform: `scale(${p})`,
                transformOrigin: `${xB}px ${yc}px`,
                opacity: region === "size" ? 0.55 : 1,
                transition: "opacity .4s ease",
              }}
            />
          </g>

          {/* Overlap lens */}
          <path
            d={path}
            fill="#ff6a3d"
            filter="url(#venn-glow)"
            opacity={(region === "both" ? 0.95 : 0.7) * p}
            style={{ cursor: "pointer", transition: "opacity .4s ease" }}
            onPointerEnter={() => {
              setRegion("both");
              sfx.chime();
            }}
            onPointerLeave={() => setRegion(null)}
          />

          {/* Labels */}
          <g opacity={p} style={{ pointerEvents: "none" }}>
            <text
              x={(xA - RA + (xB - RB)) / 2}
              y={yc + 20}
              textAnchor="middle"
              fontSize="78"
              className="font-display"
              fill="#ffffff"
            >
              84
            </text>
            <text
              x={(xA - RA + (xB - RB)) / 2}
              y={yc + 48}
              textAnchor="middle"
              fontSize="11"
              letterSpacing="2"
              fill="#c3cbec"
              className="font-mono"
            >
              LOW · SIZE
            </text>

            <text
              x={(xA + RA + xB + RB) / 2}
              y={yc + 12}
              textAnchor="middle"
              fontSize="44"
              className="font-display"
              fill="#ffffff"
            >
              19
            </text>
            <text
              x={(xA + RA + xB + RB) / 2}
              y={yc + 34}
              textAnchor="middle"
              fontSize="10"
              letterSpacing="1"
              fill="#c3cbec"
              className="font-mono"
            >
              STRENGTH
            </text>

            {/* leader to the lens */}
            <line x1={lensX} x2={lensX} y1={lensTop - 2} y2={92} stroke="#ff6a3d" strokeWidth={1} />
            <text x={lensX} y={80} textAnchor="middle" fontSize="13" fill="#ff8a66" className="font-mono">
              9 · both
            </text>
          </g>

          <text x={380} y={466} textAnchor="middle" fontSize="11" fill="#8d98c4" className="font-mono">
            low = below the upper 95% limit of controls · size &lt; +1.6% · strength &lt; +5.0%
          </text>
        </svg>
      </div>

      <div className="space-y-6">
        <div className="card min-h-[11rem] p-7">
          <div className="kicker">{text.title}</div>
          <p className="body mt-4 text-[15px] text-white/90">{text.body}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {tiles.map((t) => (
            <div key={t.l} className="card p-5">
              <div className="font-display text-4xl text-white">{t.v}</div>
              <div className="kicker mt-2 text-[10px]">{t.l}</div>
              <div className="mt-1 font-mono text-[11px] text-[var(--mist)]">{t.s}</div>
            </div>
          ))}
        </div>

        <p className="body text-sm">
          Muscle size and strength responses varied extensively between people regardless of age or sex. Nearly all
          trainees benefited on at least one measure.
        </p>
      </div>
    </div>
  );
}
