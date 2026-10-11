import { useMemo, useState } from "react";
import { useInView } from "../lib/hooks";
import { sfx } from "../lib/sound";

const DOT = 15;
const COL_H = 10;
const PITCH = 190; // fixed column pitch so age bands align across sexes
const ROW_H = 228;
const WIDTH = 900;
const HEIGHT = 770;
const FIRST_Y = 96;
const OX = 207.5; // centres the 485px-wide grid in the 900px viewBox

type Tone = "men" | "women" | "ctrl";

const ROWS: { title: string; tone: Tone; blocks: { label: string; n: number }[] }[] = [
  {
    title: "Men · training",
    tone: "men",
    blocks: [
      { label: "< 45 yrs", n: 61 },
      { label: "45–60 yrs", n: 55 },
      { label: "> 60 yrs", n: 67 },
    ],
  },
  {
    title: "Women · training",
    tone: "women",
    blocks: [
      { label: "< 45 yrs", n: 27 },
      { label: "45–60 yrs", n: 41 },
      { label: "> 60 yrs", n: 36 },
    ],
  },
  {
    title: "Non-training controls",
    tone: "ctrl",
    blocks: [
      { label: "Men", n: 53 },
      { label: "Women", n: 19 },
    ],
  },
];

const TONE_FILL: Record<Tone, string> = {
  men: "#3d63ff",
  women: "#c9d6ff",
  ctrl: "#8a90b0",
};

interface Dot {
  x: number;
  y: number;
  i: number;
}
interface Block {
  key: string;
  label: string;
  n: number;
  dots: Dot[];
  x: number;
  w: number;
}
interface BandLayout {
  title: string;
  tone: Tone;
  y: number;
  blocks: Block[];
}

/** Blocks sit on a shared column pitch, so "< 45 yrs" lines up for men and women. */
function buildLayout(): BandLayout[] {
  let idx = 0;
  return ROWS.map((row, ri) => ({
    title: row.title,
    tone: row.tone,
    y: FIRST_Y + ri * ROW_H,
    blocks: row.blocks.map((b, bi) => {
      const cols = Math.ceil(b.n / COL_H);
      const x = bi * PITCH;
      const dots: Dot[] = [];
      for (let k = 0; k < b.n; k++) {
        dots.push({ x: x + Math.floor(k / COL_H) * DOT, y: (k % COL_H) * DOT, i: idx++ });
      }
      return { key: `${ri}-${bi}`, label: b.label, n: b.n, dots, x, w: cols * DOT };
    }),
  }));
}

const GRID_W = 2 * PITCH + 7 * DOT; // widest row: men > 60 yrs is 7 columns

export default function PeopleGrid() {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  const layout = useMemo(() => buildLayout(), []);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const hovered = layout.flatMap((r) => r.blocks).find((b) => b.key === hoverKey) ?? null;

  const enter = (key: string) => {
    setHoverKey(key);
    sfx.hover(0.4 + Math.random() * 0.4);
  };

  return (
    <div ref={ref}>
      <div className="card overflow-x-auto p-4 md:p-8">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full min-w-[720px]"
          role="img"
          aria-label="359 participants: 183 men and 104 women in training, plus 72 non-training controls, grouped by sex and age band"
        >
          {/* faint column guides tie the age bands together down the page */}
          {[0, 1, 2].map((c) => (
            <line
              key={c}
              x1={OX + c * PITCH - 18}
              x2={OX + c * PITCH - 18}
              y1={FIRST_Y - 56}
              y2={FIRST_Y + 2 * ROW_H + COL_H * DOT + 22}
              stroke="rgba(141,152,196,0.12)"
              strokeDasharray="2 8"
            />
          ))}

          {layout.map((band) => (
            <g key={band.title} transform={`translate(${OX}, ${band.y})`}>
              <text x={0} y={-38} fontSize="12" letterSpacing="3" fill="#8d98c4" className="font-mono">
                {band.title.toUpperCase()}
              </text>
              <line x1={0} x2={GRID_W} y1={-24} y2={-24} stroke="rgba(141,152,196,0.22)" />

              {band.blocks.map((b) => {
                const dim = hoverKey !== null && hoverKey !== b.key;
                const on = hoverKey === b.key;
                const isCtrl = band.tone === "ctrl";
                return (
                  <g key={b.key} style={{ opacity: dim ? 0.22 : 1, transition: "opacity .4s ease" }}>
                    <rect
                      x={b.x - 12}
                      y={-14}
                      width={b.w + 24}
                      height={COL_H * DOT + 42}
                      rx={14}
                      fill={on ? "rgba(0,47,167,0.28)" : "transparent"}
                      onPointerEnter={() => enter(b.key)}
                      onPointerLeave={() => setHoverKey(null)}
                      style={{ cursor: "pointer", transition: "fill .3s ease" }}
                    />
                    {b.dots.map((d) => (
                      <g
                        key={d.i}
                        style={{
                          transformBox: "fill-box",
                          transformOrigin: "center",
                          transform: inView ? "scale(1)" : "scale(0)",
                          opacity: inView ? 1 : 0,
                          transition: `transform .7s cubic-bezier(.2,1.5,.4,1) ${d.i * 4}ms, opacity .5s ${d.i * 4}ms`,
                        }}
                      >
                        {isCtrl ? (
                          <circle
                            cx={d.x}
                            cy={d.y}
                            r={5}
                            fill="rgba(138,144,176,0.16)"
                            stroke={TONE_FILL.ctrl}
                            strokeWidth={1.3}
                          />
                        ) : (
                          <circle
                            cx={d.x}
                            cy={d.y}
                            r={5.2}
                            fill={TONE_FILL[band.tone]}
                            className="twinkle"
                            style={{ animationDelay: `${-((d.i % 13) * 0.33)}s` }}
                          />
                        )}
                      </g>
                    ))}
                    <text
                      x={b.x}
                      y={COL_H * DOT + 22}
                      fontSize="12"
                      fill={on ? "#ffffff" : "#aeb8e0"}
                      className="font-mono"
                      style={{ transition: "fill .3s ease" }}
                    >
                      {b.label} · n {b.n}
                    </text>
                  </g>
                );
              })}
            </g>
          ))}

          <text
            x={WIDTH / 2}
            y={HEIGHT - 18}
            textAnchor="middle"
            fontSize="11"
            fill="#8d98c4"
            className="font-mono"
            letterSpacing="2"
          >
            359 PARTICIPANTS · 287 TRAINEES · 72 CONTROLS
          </text>
        </svg>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <p className="body min-h-[4rem] text-white/90">
          {hovered ? (
            <>
              <span className="font-mono text-[var(--klein-glow)]">{hovered.label}</span> — {hovered.n} people in this
              cluster.
            </>
          ) : (
            "Hover a cluster to isolate it. Each dot is one participant; the layout shows the cell sizes exactly."
          )}
        </p>
        <p className="body text-sm">
          183 men and 104 women completed training across ten studies. A further 72 people (53 men, 19 women) were
          non-training controls, drawn hollow.
        </p>
      </div>
    </div>
  );
}
