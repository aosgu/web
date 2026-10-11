import { motion, useTransform, type MotionValue } from "framer-motion";
import { StickyScene, useRamp, useRange, Count } from "@/lib/scroll";
import { CURVE_NOTES, CURVE_PRINT, CURVE_SCRIPT, CURVE_YEARS } from "@/data/content";
import { smoothPath } from "@/data/world";
import { ChapterCard } from "@/components/Chrome";

const W = 960;
const H = 430;
const L = 58;
const R = 26;
const T = 26;
const B = 46;
const Y0 = 1450;
const Y1 = 1800;
const VMAX = 21;

const sx = (year: number) => L + ((year - Y0) / (Y1 - Y0)) * (W - L - R);
const sy = (v: number) => H - B - (v / VMAX) * (H - T - B);

const series = (vals: number[]) => smoothPath(vals.map((v, i) => [sx(CURVE_YEARS[i]), sy(v)]));
const PRINT_D = series(CURVE_PRINT);
const SCRIPT_D = series(CURVE_SCRIPT);
const AREA_D =
  `${PRINT_D} L${sx(Y1)},${H - B} L${sx(Y0)},${H - B} Z`;

const valueAt = (vals: number[], year: number) => {
  const t = Math.max(0, Math.min(1, (year - Y0) / (Y1 - Y0))) * (vals.length - 1);
  const i = Math.min(Math.floor(t), vals.length - 2);
  return vals[i] + (vals[i + 1] - vals[i]) * (t - i);
};

export default function LineChart() {
  return (
    <StickyScene id="curve" vh={380}>
      {(p) => (
        <div className="relative h-full w-full overflow-hidden bg-ink">
          <div className="absolute inset-0 text-paper/[0.045] halftone" />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(70% 60% at 28% 30%, rgba(255,212,0,0.10), transparent 70%)" }}
          />
          <Stage p={p} />
        </div>
      )}
    </StickyScene>
  );
}

function Stage({ p }: { p: MotionValue<number> }) {
  const draw = useRamp(p, 0.08, 0.62);
  const draw2 = useRamp(p, 0.14, 0.55);
  const scrubY = useTransform(p, (v) => Y0 + Math.min(1, Math.max(0, (v - 0.2) / 0.62)) * (Y1 - Y0));
  const scrubX = useTransform(scrubY, (y) => sx(y));
  const val = useTransform(scrubY, (y) => valueAt(CURVE_PRINT, y));
  const valY = useTransform(val, (v) => sy(v));
  const inP = useRamp(p, 0.0, 0.07);
  const insetIn = useRamp(p, 0.66, 0.76);

  return (
    <div className="scene-pad relative z-10 flex h-full flex-col justify-center gap-4 pt-[64px] pb-5">
      <motion.div className="flex flex-wrap items-end justify-between gap-4" style={{ opacity: inP }}>
        <ChapterCard n="05" kicker="The curve" title="One line, three centuries" />
        <Readout year={scrubY} val={val} />
      </motion.div>

      <motion.div
        className="relative border border-paper/15 bg-[#0f1015] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.55)] sm:p-4"
        style={{ opacity: inP, y: useRange(inP, 30, 0) }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto max-h-[56vh] w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffd400" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#ffd400" stopOpacity="0.02" />
            </linearGradient>
            <clipPath id="reveal">
              <motion.rect
                x="0"
                y="0"
                width={W}
                height={H}
                style={{ scaleX: draw, transformOrigin: "left center", transformBox: "fill-box" }}
              />
            </clipPath>
          </defs>

          {/* plot frame */}
          <rect x={L} y={T} width={W - L - R} height={H - T - B} fill="#12141b" stroke="rgba(238,233,220,0.16)" />
          {[5, 10, 15, 20].map((g) => (
            <g key={g}>
              <line x1={L} y1={sy(g)} x2={W - R} y2={sy(g)} stroke="rgba(238,233,220,0.12)" strokeDasharray="3 5" />
              <text x={L - 9} y={sy(g) + 4} textAnchor="end" fontSize="11" fill="rgba(238,233,220,0.5)" fontFamily="IBM Plex Mono, monospace">
                {g}
              </text>
            </g>
          ))}
          {[1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800].map((yr) => (
            <g key={yr}>
              <line x1={sx(yr)} y1={H - B} x2={sx(yr)} y2={H - B + 5} stroke="rgba(238,233,220,0.4)" />
              <text x={sx(yr)} y={H - B + 20} textAnchor="middle" fontSize="11" fill="rgba(238,233,220,0.55)" fontFamily="IBM Plex Mono, monospace">
                {yr}
              </text>
            </g>
          ))}
          <text x={L - 40} y={T + 6} fontSize="10" letterSpacing="1.6" fill="rgba(238,233,220,0.45)" fontFamily="IBM Plex Mono, monospace">
            M COPIES
          </text>
          <text x={W - R} y={T + 6} textAnchor="end" fontSize="10" letterSpacing="1.6" fill="rgba(238,233,220,0.45)" fontFamily="IBM Plex Mono, monospace">
            PER YEAR, ALL FORMATS
          </text>

          {/* area + curves */}
          <g clipPath="url(#reveal)">
            <path d={AREA_D} fill="url(#areaGrad)" />
          </g>
          <motion.path d={SCRIPT_D} fill="none" stroke="rgba(238,233,220,0.55)" strokeWidth="1.8" strokeDasharray="5 5" style={{ pathLength: draw2 }} />
          <motion.path d={PRINT_D} fill="none" stroke="#ffd400" strokeWidth="10" opacity="0.14" strokeLinecap="round" style={{ pathLength: draw }} />
          <motion.path d={PRINT_D} fill="none" stroke="#ffd400" strokeWidth="3.4" strokeLinecap="round" style={{ pathLength: draw }} />

          {/* scrubber */}
          <motion.line x1={0} y1={T} x2={0} y2={H - B} stroke="#ea3b24" strokeWidth="1.4" style={{ x: scrubX }} />
          <motion.g style={{ x: scrubX, y: valY }}>
            <circle r="10" fill="#ea3b24" opacity="0.22" />
            <circle r="4.6" fill="#ea3b24" stroke="#0b0b0d" strokeWidth="1.6" />
          </motion.g>

          {CURVE_NOTES.map((n, i) => (
            <Annotation key={n.year} n={n} p={p} i={i} />
          ))}

          {/* inset: the first 75 years, magnified */}
          <motion.g style={{ opacity: insetIn }}>
            <rect x={L + 12} y={T + 14} width={228} height={126} fill="#0b0b0d" stroke="#ffd400" strokeWidth="1.4" />
            <text x={L + 22} y={T + 34} fontSize="10" letterSpacing="1.4" fill="#ffd400" fontFamily="IBM Plex Mono, monospace">
              INSET · 1450–1525 · ×24
            </text>
            {CURVE_YEARS.slice(0, 4).map((yr, i) => {
              const v = CURVE_PRINT[i];
              const px = L + 22 + ((yr - Y0) / 75) * 208;
              const py = T + 130 - (v / 0.75) * 88;
              return <circle key={yr} cx={px} cy={py} r="3" fill="#ffd400" />;
            })}
            <path
              d={smoothPath(
                CURVE_YEARS.slice(0, 4).map((yr, i) => [
                  L + 22 + ((yr - Y0) / 75) * 208,
                  T + 130 - (CURVE_PRINT[i] / 0.75) * 88,
                ]),
              )}
              fill="none"
              stroke="#ffd400"
              strokeWidth="2.4"
            />
            <text x={L + 24} y={T + 136} fontSize="9" fill="rgba(238,233,220,0.55)" fontFamily="IBM Plex Mono, monospace">
              0.02M
            </text>
            <text x={L + 200} y={T + 56} fontSize="9" fill="rgba(238,233,220,0.55)" fontFamily="IBM Plex Mono, monospace">
              0.70M
            </text>
          </motion.g>

          {/* legend */}
          <g transform={`translate(${W - R - 250}, ${T + 14})`}>
            <rect x="0" y="0" width="248" height="52" fill="#0b0b0d" stroke="rgba(238,233,220,0.18)" />
            <line x1="12" y1="18" x2="40" y2="18" stroke="#ffd400" strokeWidth="3.4" />
            <text x="48" y="22" fontSize="11" fill="#eee9dc" letterSpacing="1" fontFamily="IBM Plex Mono, monospace">
              PRINTED SHEETS
            </text>
            <line x1="12" y1="37" x2="40" y2="37" stroke="rgba(238,233,220,0.6)" strokeWidth="1.8" strokeDasharray="5 5" />
            <text x="48" y="41" fontSize="11" fill="rgba(238,233,220,0.7)" letterSpacing="1" fontFamily="IBM Plex Mono, monospace">
              COPIED BY HAND
            </text>
          </g>
        </svg>
      </motion.div>

      <motion.p
        className="max-w-[64ch] font-serif text-[13.5px] leading-relaxed text-paper/60"
        style={{ opacity: inP }}
      >
        The dashed line is the old world: it barely moves, because a scribe's hand does not
        compound. Everything else on this page is the gap between the two.
      </motion.p>
    </div>
  );
}

function Annotation({ n, p, i }: { n: (typeof CURVE_NOTES)[number]; p: MotionValue<number>; i: number }) {
  const t = useRamp(p, 0.34 + i * 0.14, 0.44 + i * 0.14);
  const x = sx(n.year);
  const y = sy(valueAt(CURVE_PRINT, n.year));
  const boxW = 186;
  const bx = Math.min(W - R - boxW, x + 26);
  const by = Math.max(T + 8, y - 92);
  return (
    <motion.g style={{ opacity: t }}>
      <motion.line x1={x} y1={y} x2={bx + 8} y2={by + boxW * 0 + 34} stroke="#ea3b24" strokeWidth="1.4" style={{ pathLength: t }} />
      <motion.g style={{ y: useRange(t, 12, 0) }}>
        <rect x={bx} y={by} width={boxW} height="46" fill="#0b0b0d" stroke="#ea3b24" strokeWidth="1.4" />
        {n.text.split("\n").map((line, k) => (
          <text key={k} x={bx + 10} y={by + 18 + k * 15} fontSize="10.5" letterSpacing="0.6" fill="#eee9dc" fontFamily="IBM Plex Mono, monospace">
            {line}
          </text>
        ))}
      </motion.g>
    </motion.g>
  );
}

function Readout({ year, val }: { year: MotionValue<number>; val: MotionValue<number> }) {
  return (
    <div className="flex items-end gap-4">
      <div className="border border-paper/15 bg-[#0f1015] px-4 py-2 text-right">
        <div className="font-mono text-[9px] tracking-[0.28em] text-paper/45">YEAR</div>
        <motion.div className="font-display text-[2.2rem] leading-none text-paper tabular-nums">
          <Count value={year} />
        </motion.div>
      </div>
      <div className="border border-yolk bg-yolk px-4 py-2 text-right text-ink">
        <div className="font-mono text-[9px] tracking-[0.28em] opacity-70">M COPIES / YR</div>
        <motion.div className="font-display text-[2.2rem] leading-none tabular-nums">
          <Count value={val} decimals={2} />
        </motion.div>
      </div>
    </div>
  );
}
