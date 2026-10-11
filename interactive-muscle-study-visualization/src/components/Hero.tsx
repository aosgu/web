import { useEffect, useMemo, useRef, useState } from "react";
import {
  COHORT,
  LOW_SIZE,
  LOW_STRENGTH,
  SIZE_DOMAIN,
  SIZE_STATS,
  STRENGTH_DOMAIN,
  STRENGTH_STATS,
  makePeople,
  mulberry32,
  pct,
} from "../lib/data";
import type { Band, Person } from "../lib/data";
import { sfx } from "../lib/sound";
import { useProgress } from "../lib/hooks";

type Mode = "cloud" | "correlation" | "size" | "strength";

const W = 640;
const H = 560;
const X0 = 60;
const X1 = W - 30;
const Y0 = 60;
const BASE = H - 92;
const STEP = 10.5;
const EMBER = "#ff6a3d";
const MEN = "#3d63ff";
const WOMEN = "#c9d6ff";

const MODES: { id: Mode; label: string }[] = [
  { id: "cloud", label: "Cluster" },
  { id: "correlation", label: "2D Scatter (Size vs Strength)" },
  { id: "size", label: "By muscle size" },
  { id: "strength", label: "By strength" },
];

const xScale = (v: number, [d0, d1]: [number, number]) => X0 + ((v - d0) / (d1 - d0)) * (X1 - X0);
const yScale = (v: number, [d0, d1]: [number, number]) => BASE - ((v - d0) / (d1 - d0)) * (BASE - Y0);

/** Wilkinson-style dot plot: one column per bin, dots stacked upward. */
function dotPlot(values: number[], binW: number, dom: [number, number]) {
  const stack = new Map<number, number>();
  return values.map((v) => {
    const b = Math.round(v / binW);
    const k = stack.get(b) ?? 0;
    stack.set(b, k + 1);
    return { x: xScale(b * binW, dom), y: BASE - k * STEP };
  });
}

const bandText = (b: Band) => `${b} yrs`;

export default function Hero() {
  const people = useMemo(() => makePeople(), []);

  const cloudPts = useMemo(() => {
    const rand = mulberry32(99);
    return people.map(() => {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * 235;
      return { x: W / 2 + Math.cos(a) * r * 1.08, y: H / 2 + Math.sin(a) * r * 0.92 };
    });
  }, [people]);

  const sizePts = useMemo(
    () => dotPlot(people.map((p) => p.size), 1, SIZE_DOMAIN),
    [people]
  );
  const strengthPts = useMemo(
    () => dotPlot(people.map((p) => p.strength), 2, STRENGTH_DOMAIN),
    [people]
  );
  const correlationPts = useMemo(
    () =>
      people.map((p) => ({
        x: xScale(p.size, SIZE_DOMAIN),
        y: yScale(p.strength, STRENGTH_DOMAIN),
      })),
    [people]
  );

  const [mode, setMode] = useState<Mode>("cloud");
  const [hover, setHover] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const lastSound = useRef(0);
  const prog = useProgress(ready, 1800, 300);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 150);
    return () => window.clearTimeout(t);
  }, []);

  const pts =
    mode === "cloud"
      ? cloudPts
      : mode === "correlation"
      ? correlationPts
      : mode === "size"
      ? sizePts
      : strengthPts;

  const dom = mode === "strength" ? STRENGTH_DOMAIN : SIZE_DOMAIN;
  const ticks =
    mode === "strength" ? [-10, 0, 10, 20, 30, 40, 50, 60] : [-10, -5, 0, 5, 10, 15, 20, 25, 30];
  const cut = mode === "strength" ? LOW_STRENGTH : LOW_SIZE;
  const axisOn = mode === "size" || mode === "strength";
  const scatterOn = mode === "correlation";
  
  const isLow = (p: Person) => {
    if (mode === "strength") return p.strength < LOW_STRENGTH;
    if (mode === "size") return p.size < LOW_SIZE;
    if (mode === "correlation") return p.size < LOW_SIZE || p.strength < LOW_STRENGTH;
    return false;
  };

  const choose = (m: Mode) => {
    if (m === mode) return;
    setMode(m);
    setHover(null);
    sfx.select();
  };

  const enter = (i: number) => {
    setHover(i);
    const now = performance.now();
    if (now - lastSound.current < 70) return;
    lastSound.current = now;
    const p = people[i];
    const v = mode === "strength" ? (p.strength + 8) / 68 : (p.size + 11) / 41;
    sfx.hover(Math.min(1, Math.max(0, v)));
  };

  const hp = hover !== null ? people[hover] : null;
  const hpos = hover !== null ? pts[hover] : null;

  const stats = [
    { v: String(Math.round(COHORT.trainees * prog)), l: "trainees" },
    { v: `+${(SIZE_STATS.mean * prog).toFixed(1)}%`, l: "mean muscle size" },
    { v: `+${(STRENGTH_STATS.mean * prog).toFixed(1)}%`, l: "mean leg strength" },
    { v: `${(SIZE_STATS.lowPct * prog).toFixed(1)}%`, l: "low responders, size" },
  ];

  return (
    <section id="intro" data-section className="relative isolate overflow-hidden px-6 pb-20 pt-28 md:px-16 lg:px-24">
      <div className="blob -left-40 top-20 h-[44rem] w-[44rem] opacity-60" />
      <div className="blob -right-40 bottom-0 h-[30rem] w-[30rem] opacity-30" style={{ animationDelay: "-9s" }} />

      <div className="relative z-10 grid items-center gap-12 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div>
          <p className="kicker">Ahtiainen et al. · AGE 38:10 · 2016</p>
          <h1 className="display mt-7">
            One program.
            <br />
            <em>287</em> different bodies.
          </h1>
          <p className="body mt-8 max-w-md">
            Pooled data from ten supervised 20–24-week resistance-training studies in previously untrained men and
            women aged {COHORT.ageMin} to {COHORT.ageMax}. Every dot is one trainee, placed by how much their muscle
            size and strength changed.
          </p>

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l}>
                <dt className="kicker text-[10px]">{s.l}</dt>
                <dd className="font-display mt-2 text-4xl text-white">{s.v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-10 max-w-md text-xs leading-relaxed text-[var(--mist)]">
            Dots are simulated from the paper's reported means and standard deviations, so the cloud shows the spread
            the paper describes, not the study's raw records.
          </p>
        </div>

        <div className="relative">
          <div className="mb-5 flex flex-wrap gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                className={`pill ${mode === m.id ? "is-on" : ""}`}
                onClick={() => choose(m.id)}
                aria-pressed={mode === m.id}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="h-auto w-full overflow-visible"
              role="img"
              aria-label="Dot plot of 287 simulated trainees by change in muscle size and strength"
            >
              <defs>
                <filter id="hx-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* decorative rings behind the cloud */}
              <circle
                cx={W / 2}
                cy={H / 2}
                r={250}
                fill="none"
                stroke="rgba(61,99,255,0.35)"
                strokeWidth={1}
                className="ring"
                style={{ opacity: scatterOn ? 0.05 : 1, transition: "opacity 0.7s ease" }}
              />
              <circle
                cx={W / 2}
                cy={H / 2}
                r={190}
                fill="none"
                stroke="rgba(138,163,255,0.25)"
                strokeWidth={1}
                strokeDasharray="2 8"
                className="ring"
                style={{
                  animationDelay: "-2.4s",
                  opacity: scatterOn ? 0.05 : 1,
                  transition: "opacity 0.7s ease",
                }}
              />

              {/* 2D Scatter Plot Axes, Grid & Quadrants */}
              <g className="transition-opacity duration-700" style={{ opacity: scatterOn ? 1 : 0 }}>
                {/* Quadrant vertical split (Size cut-off) */}
                <line
                  x1={xScale(LOW_SIZE, SIZE_DOMAIN)}
                  x2={xScale(LOW_SIZE, SIZE_DOMAIN)}
                  y1={Y0}
                  y2={BASE}
                  stroke={EMBER}
                  strokeOpacity={0.5}
                  strokeDasharray="4 4"
                />
                {/* Quadrant horizontal split (Strength cut-off) */}
                <line
                  x1={X0}
                  x2={X1}
                  y1={yScale(LOW_STRENGTH, STRENGTH_DOMAIN)}
                  y2={yScale(LOW_STRENGTH, STRENGTH_DOMAIN)}
                  stroke={EMBER}
                  strokeOpacity={0.5}
                  strokeDasharray="4 4"
                />

                {/* 2D Axis lines */}
                <line x1={X0} x2={X1} y1={BASE} y2={BASE} stroke="rgba(141,152,196,0.5)" />
                <line x1={X0} x2={X0} y1={Y0} y2={BASE} stroke="rgba(141,152,196,0.5)" />

                {/* 2D X-Axis Ticks (Size) */}
                {[-10, 0, 10, 20, 30].map((t) => (
                  <g key={`x-${t}`}>
                    <line x1={xScale(t, SIZE_DOMAIN)} x2={xScale(t, SIZE_DOMAIN)} y1={BASE} y2={BASE + 6} stroke="rgba(141,152,196,0.4)" />
                    <text
                      x={xScale(t, SIZE_DOMAIN)}
                      y={BASE + 20}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#8d98c4"
                      className="font-mono"
                    >
                      {t > 0 ? `+${t}` : t}%
                    </text>
                  </g>
                ))}
                <text x={(X0 + X1) / 2} y={BASE + 36} textAnchor="middle" fontSize="11" fill="#eef2ff" className="font-mono tracking-wider">
                  SIZE CHANGE →
                </text>

                {/* 2D Y-Axis Ticks (Strength) */}
                {[-10, 0, 20, 40, 60].map((t) => (
                  <g key={`y-${t}`}>
                    <line x1={X0 - 6} x2={X0} y1={yScale(t, STRENGTH_DOMAIN)} y2={yScale(t, STRENGTH_DOMAIN)} stroke="rgba(141,152,196,0.4)" />
                    <text
                      x={X0 - 12}
                      y={yScale(t, STRENGTH_DOMAIN) + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="#8d98c4"
                      className="font-mono"
                    >
                      {t > 0 ? `+${t}` : t}%
                    </text>
                  </g>
                ))}
                <text
                  x={X0 - 38}
                  y={(Y0 + BASE) / 2}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#eef2ff"
                  className="font-mono tracking-wider"
                  transform={`rotate(-90, ${X0 - 38}, ${(Y0 + BASE) / 2})`}
                >
                  STRENGTH CHANGE →
                </text>

                {/* Quadrant Helper Annotations */}
                <text x={X1 - 10} y={Y0 + 20} textAnchor="end" fontSize="10" fill="rgba(238,242,255,0.4)" className="font-mono">
                  Double Responders
                </text>
                <text x={X0 + 15} y={BASE - 15} textAnchor="start" fontSize="10" fill={EMBER} className="font-mono">
                  Double Non-Responders
                </text>
              </g>

              {/* axis for 1D dot-plot modes */}
              <g className="transition-opacity duration-700" style={{ opacity: axisOn ? 1 : 0 }}>
                <line x1={X0} x2={X1} y1={H - 78} y2={H - 78} stroke="rgba(141,152,196,0.5)" />
                {ticks.map((t) => (
                  <g key={t}>
                    <line x1={xScale(t, dom)} x2={xScale(t, dom)} y1={H - 78} y2={H - 72} stroke="rgba(141,152,196,0.6)" />
                    <text
                      x={xScale(t, dom)}
                      y={H - 54}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#8d98c4"
                      className="font-mono"
                    >
                      {t > 0 ? `+${t}` : t}%
                    </text>
                  </g>
                ))}
                <line
                  x1={xScale(0, dom)}
                  x2={xScale(0, dom)}
                  y1={60}
                  y2={H - 78}
                  stroke="rgba(238,242,255,0.5)"
                  strokeDasharray="2 6"
                />
                <line
                  x1={xScale(cut, dom)}
                  x2={xScale(cut, dom)}
                  y1={60}
                  y2={H - 78}
                  stroke={EMBER}
                  strokeOpacity={0.7}
                  strokeDasharray="6 6"
                />
                <text x={xScale(cut, dom) + 8} y={74} fontSize="11" fill={EMBER} className="font-mono">
                  low-responder cut-off
                </text>
              </g>

              <g filter="url(#hx-glow)">
                {people.map((p, i) => {
                  const pos = pts[i];
                  const low = isLow(p);
                  const hot = hover === i;
                  return (
                    <g
                      key={p.id}
                      className="dot"
                      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                      onPointerEnter={() => enter(i)}
                      onPointerLeave={() => setHover(null)}
                    >
                      <circle r={12} fill="transparent" />
                      <circle
                        className="dot-inner"
                        r={hot ? 7.5 : 4.6}
                        fill={low ? EMBER : p.sex === "M" ? MEN : WOMEN}
                        opacity={low ? 1 : 0.92}
                        style={{ animationDelay: `${-((i % 9) * 0.7)}s` }}
                      />
                    </g>
                  );
                })}
              </g>
            </svg>

            {hp && hpos && (
              <div
                className="pointer-events-none absolute z-10 w-60 -translate-x-1/2 -translate-y-full rounded-xl border border-white/10 bg-[#03040b]/90 p-3 font-mono text-[11px] leading-relaxed text-white backdrop-blur"
                style={{
                  left: `${(hpos.x / W) * 100}%`,
                  top: `${(hpos.y / H) * 100}%`,
                  marginTop: -16,
                }}
              >
                <div className="text-[var(--klein-glow)]">
                  TRAINEE {String(hp.id + 1).padStart(3, "0")} · {hp.sex === "M" ? "MEN" : "WOMEN"} ·{" "}
                  {bandText(hp.band)}
                </div>
                <div className="mt-1">
                  size {pct(hp.size)} · strength {pct(hp.strength)}
                </div>
                {isLow(hp) && (
                  <div className="mt-1 text-[var(--ember)]">
                    low responder ({mode === "strength" ? "strength" : "size"})
                  </div>
                )}
                <div className="mt-1 text-[10px] text-[var(--mist)]">simulated</div>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--mist)]">
            <span className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: MEN }} /> Men
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: WOMEN }} /> Women
            </span>
            <span className="flex items-center gap-2 text-[var(--ember)]">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: EMBER }} /> Low responder
              · {mode === "strength" ? "strength" : "size"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
