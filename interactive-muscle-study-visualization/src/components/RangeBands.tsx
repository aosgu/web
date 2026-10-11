import { useState } from "react";
import { SIZE_STATS, STRENGTH_STATS, pct } from "../lib/data";
import { useInView, useProgress } from "../lib/hooks";
import { sfx } from "../lib/sound";

type RowKey = "size" | "strength" | "control";

interface Row {
  key: RowKey;
  y: number;
  label: string;
  min: number;
  max: number;
  mean?: number;
  sd?: number;
  cut?: number;
  note: string;
}

const W = 900;
const H = 460;
const X = (v: number) => 70 + ((v + 15) / 80) * 760;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const fmt = (v: number) => pct(v, 0);

const ROWS: Row[] = [
  {
    key: "size",
    y: 130,
    label: "Muscle size",
    min: SIZE_STATS.min,
    max: SIZE_STATS.max,
    mean: SIZE_STATS.mean,
    sd: SIZE_STATS.sd,
    cut: SIZE_STATS.lowCut,
    note: "Quadriceps size changed by +4.8 ± 6.1% on average, from −11% (shrank) to +30%. One in seven trainees (14.6%) showed zero or negative change.",
  },
  {
    key: "strength",
    y: 262,
    label: "Strength",
    min: STRENGTH_STATS.min,
    max: STRENGTH_STATS.max,
    mean: STRENGTH_STATS.mean,
    sd: STRENGTH_STATS.sd,
    cut: STRENGTH_STATS.lowCut,
    note: "Leg-press 1RM rose +21.1 ± 11.5% on average, from −8% to +60%. Twelve percent were high responders, more than 1 SD above the mean.",
  },
  {
    key: "control",
    y: 380,
    label: "Controls",
    min: STRENGTH_STATS.controlMin,
    max: STRENGTH_STATS.controlMax,
    note: "Non-training controls drifted between −10% and +18% in strength over the same period. That natural noise is why low responders are judged against controls, not against zero.",
  },
];

export default function RangeBands() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const p = useProgress(inView, 1800, 200);
  const [active, setActive] = useState<RowKey | null>(null);

  const focus = (k: RowKey) => {
    setActive(k);
    sfx.hover(k === "size" ? 0.25 : k === "strength" ? 0.6 : 0.9);
  };

  const readout = ROWS.find((r) => r.key === active);

  return (
    <div ref={ref}>
      <div className="card p-4 md:p-8">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Ranges of muscle size and strength change, with mean and one standard deviation"
        >
          <defs>
            <linearGradient id="rb-grad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#002fa7" />
              <stop offset="1" stopColor="#5a80ff" />
            </linearGradient>
          </defs>

          {/* zero line */}
          <line x1={X(0)} x2={X(0)} y1={58} y2={414} stroke="rgba(238,242,255,0.45)" strokeDasharray="2 6" />
          <text x={X(0)} y={438} textAnchor="middle" fontSize="11" fill="#8d98c4" className="font-mono">
            0 · no change
          </text>

          {ROWS.map((row) => {
            const anchor = row.mean ?? (row.min + row.max) / 2;
            const dim = active !== null && active !== row.key;
            const left = lerp(X(anchor), X(row.min), p);
            const right = lerp(X(anchor), X(row.max), p);
            const hasSd = row.mean !== undefined && row.sd !== undefined;
            const sdL = hasSd ? lerp(X(row.mean!), X(row.mean! - row.sd!), p) : 0;
            const sdR = hasSd ? lerp(X(row.mean!), X(row.mean! + row.sd!), p) : 0;

            return (
              <g
                key={row.key}
                style={{ opacity: dim ? 0.3 : 1, transition: "opacity 0.5s ease" }}
                onPointerEnter={() => focus(row.key)}
                onPointerLeave={() => setActive(null)}
              >
                <rect
                  x={44}
                  y={row.y - 78}
                  width={W - 88}
                  height={158}
                  rx={18}
                  fill={active === row.key ? "rgba(0,47,167,0.22)" : "transparent"}
                  style={{ transition: "fill 0.4s ease" }}
                />

                <text x={70} y={row.y - 62} fontSize="12" letterSpacing="3" fill="#8d98c4" className="font-mono">
                  {row.label.toUpperCase()}
                </text>

                {/* full observed range */}
                <line
                  x1={left}
                  x2={right}
                  y1={row.y}
                  y2={row.y}
                  stroke="rgba(141,152,196,0.6)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray={row.key === "control" ? "2 6" : undefined}
                />

                {/* ±1 SD band */}
                {hasSd && (
                  <rect
                    x={sdL}
                    y={row.y - 13}
                    width={Math.max(0, sdR - sdL)}
                    height={26}
                    rx={13}
                    fill="url(#rb-grad)"
                    opacity={0.95}
                  />
                )}

                {/* range end caps */}
                <circle cx={left} cy={row.y} r={5} fill="#eef2ff" opacity={p} />
                <circle cx={right} cy={row.y} r={5} fill="#eef2ff" opacity={p} />
                <text
                  x={left}
                  y={row.y + 42}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#c3cbec"
                  opacity={p}
                  className="font-mono"
                >
                  {fmt(row.min)}
                </text>
                <text
                  x={right}
                  y={row.y + 42}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#c3cbec"
                  opacity={p}
                  className="font-mono"
                >
                  {fmt(row.max)}
                </text>

                {/* mean */}
                {row.mean !== undefined && (
                  <>
                    <line
                      x1={X(row.mean)}
                      x2={X(row.mean)}
                      y1={row.y - 24}
                      y2={row.y + 24}
                      stroke="#ffffff"
                      strokeWidth={2}
                      opacity={p}
                    />
                    <text
                      x={X(row.mean)}
                      y={row.y - 36}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#ffffff"
                      opacity={p}
                      className="font-mono"
                    >
                      mean {pct(row.mean)}
                    </text>
                  </>
                )}

                {/* low-responder cut-off */}
                {row.cut !== undefined && (
                  <>
                    <line
                      x1={X(row.cut)}
                      x2={X(row.cut)}
                      y1={row.y - 22}
                      y2={row.y + 22}
                      stroke="#ff6a3d"
                      strokeWidth={2}
                      strokeDasharray="3 4"
                      opacity={p}
                    />
                    <text
                      x={X(row.cut)}
                      y={row.y + 64}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#ff6a3d"
                      opacity={p}
                      className="font-mono"
                    >
                      cut-off {pct(row.cut)}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-8 min-h-[5.5rem] max-w-3xl">
        {readout ? (
          <p className="body text-white">{readout.note}</p>
        ) : (
          <p className="body">
            Hover a row to read it. The dashed centre line marks no change; ember ticks mark where a low responder
            begins.
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="card p-6">
          <div className="kicker">Age</div>
          <p className="font-display mt-3 text-3xl text-white">No effect</p>
          <p className="body mt-3 text-sm">Age and sex did not affect the training responses in size or strength.</p>
        </div>
        <div className="card p-6">
          <div className="kicker">Sex</div>
          <p className="font-display mt-3 text-3xl text-white">24.2% vs 19.4%</p>
          <p className="body mt-3 text-sm">
            Women's relative 1RM gain versus men's, the one sex difference the paper found in strength.
          </p>
        </div>
        <div className="card p-6">
          <div className="kicker">Spread</div>
          <p className="font-display mt-3 text-3xl text-white">−11% → +30%</p>
          <p className="body mt-3 text-sm">The full range of quadriceps size change across ages 19 to 78.</p>
        </div>
      </div>
    </div>
  );
}
