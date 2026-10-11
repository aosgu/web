import { useState } from "react";
import { CONTROLS, GROUPS, GROUP_COLOR, groupName, pct } from "../lib/data";
import type { Group } from "../lib/data";
import { useInView, useProgress, useTween } from "../lib/hooks";
import { sfx } from "../lib/sound";

const W = 900;
const H = 470;
const Y = (kg: number) => 390 - ((kg - 80) / 140) * 320; // 80 kg → y 390, 220 kg → y 70
const XS = {
  M: { pre: 170, post: 370 },
  F: { pre: 530, post: 730 },
} as const;

const ALL: Group[] = [...GROUPS, ...CONTROLS];

function linkPath(x0: number, y0: number, x1: number, y1: number) {
  const mx = (x0 + x1) / 2;
  return `M ${x0} ${y0} C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
}

function spreadY<T extends { y: number }>(items: T[], gap = 18): T[] {
  const s = [...items].sort((a, b) => a.y - b.y);
  for (let i = 1; i < s.length; i++) {
    if (s[i].y - s[i - 1].y < gap) s[i].y = s[i - 1].y + gap;
  }
  return s;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="kicker text-[10px]">{label}</div>
      <div className="font-mono mt-2 text-[15px] text-white">{value}</div>
    </div>
  );
}

export default function SlopeChart() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const p = useProgress(inView, 1900, 200);
  const [sel, setSel] = useState<string>("f1");
  const [hover, setHover] = useState<string | null>(null);

  const activeId = hover ?? sel;
  const g = ALL.find((x) => x.id === activeId) ?? GROUPS[0];
  const gain = useTween(g.gain, 700);

  const labelsFor = (sex: "M" | "F") => {
    const list = ALL.filter((x) => x.sex === sex).map((x) => ({
      id: x.id,
      y: Y(x.rm[1]),
      text: x.band === "Control" ? `controls · ${x.rm[1].toFixed(1)}` : `${x.band} · ${x.rm[1].toFixed(1)}`,
    }));
    return spreadY(list);
  };

  const labelsM = labelsFor("M");
  const labelsF = labelsFor("F");

  return (
    <div ref={ref}>
      <div className="card p-4 md:p-8">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Pre and post leg-press 1RM by sex and age band, with control lines"
        >
          {/* grid */}
          {[100, 140, 180, 220].map((kg) => (
            <g key={kg}>
              <line x1={100} x2={W - 30} y1={Y(kg)} y2={Y(kg)} stroke="rgba(141,152,196,0.13)" />
              <text x={88} y={Y(kg) + 4} textAnchor="end" fontSize="11" fill="#8d98c4" className="font-mono">
                {kg}
              </text>
            </g>
          ))}
          <text x={88} y={44} textAnchor="end" fontSize="11" fill="#8d98c4" className="font-mono">
            1RM kg
          </text>

          {/* panel titles */}
          <text x={(XS.M.pre + XS.M.post) / 2} y={44} textAnchor="middle" fontSize="38" className="font-display" fill="#eef2ff">
            Men
          </text>
          <text x={(XS.F.pre + XS.F.post) / 2} y={44} textAnchor="middle" fontSize="38" className="font-display" fill="#eef2ff">
            Women
          </text>

          {/* column labels */}
          {(["M", "F"] as const).flatMap((sex) =>
            (["pre", "post"] as const).map((k) => (
              <text
                key={sex + k}
                x={XS[sex][k]}
                y={H - 22}
                textAnchor="middle"
                fontSize="11"
                letterSpacing="3"
                fill="#8d98c4"
                className="font-mono"
              >
                {k.toUpperCase()}
              </text>
            ))
          )}

          {/* lines */}
          {ALL.map((x) => {
            const isCtrl = x.band === "Control";
            const x0 = XS[x.sex].pre;
            const x1 = XS[x.sex].post;
            const d = linkPath(x0, Y(x.rm[0]), x1, Y(x.rm[1]));
            const color = GROUP_COLOR[x.id];
            const dim = activeId !== x.id;
            return (
              <g key={x.id} style={{ opacity: dim ? 0.22 : 1, transition: "opacity .4s ease" }}>
                <path
                  d={d}
                  pathLength={1}
                  fill="none"
                  stroke={color}
                  strokeWidth={isCtrl ? 2 : 3}
                  strokeLinecap="round"
                  strokeDasharray={isCtrl ? "0.025 0.035" : "1"}
                  strokeDashoffset={isCtrl ? 0 : 1 - p}
                  opacity={isCtrl ? p : 1}
                  style={{ filter: isCtrl ? undefined : `drop-shadow(0 0 6px ${color})` }}
                />
                {/* generous hit area */}
                <path
                  d={d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={22}
                  style={{ cursor: "pointer" }}
                  onPointerEnter={() => {
                    setHover(x.id);
                    sfx.hover(x.sex === "M" ? 0.35 : 0.7);
                  }}
                  onPointerLeave={() => setHover(null)}
                  onClick={() => {
                    setSel(x.id);
                    sfx.select();
                  }}
                />
                <circle cx={x0} cy={Y(x.rm[0])} r={isCtrl ? 3 : 5} fill={color} opacity={p} />
                <circle cx={x1} cy={Y(x.rm[1])} r={isCtrl ? 3 : 5.5} fill={color} opacity={p} />
              </g>
            );
          })}

          {/* post-side labels, nudged apart */}
          {[
            { items: labelsM, x: XS.M.post + 14 },
            { items: labelsF, x: XS.F.post + 14 },
          ].map(({ items, x }) =>
            items.map((it) => {
              const on = activeId === it.id;
              return (
                <text
                  key={it.id}
                  x={x}
                  y={it.y + 4}
                  fontSize="12"
                  fill={on ? "#ffffff" : "#aeb8e0"}
                  opacity={p * (activeId && !on ? 0.4 : 1)}
                  className="font-mono"
                  style={{ transition: "opacity .4s ease" }}
                >
                  {it.text}
                </text>
              );
            })
          )}
        </svg>
      </div>

      <div className="card mt-8 grid gap-8 p-6 md:p-8 lg:grid-cols-[1.25fr_1fr_1fr]">
        <div>
          <div className="kicker">{groupName(g)}</div>
          <div className="font-display mt-3 text-7xl leading-none text-white">
            {g.band === "Control" ? pct(gain) : `+${gain.toFixed(1)}%`}
          </div>
          <p className="body mt-4 text-sm">
            {g.band === "Control"
              ? "Change in 1RM across the same period, computed from the group means."
              : `Mean individual change in leg-press 1RM${g.gainSd !== null ? ` (± ${g.gainSd} SD)` : ""}.`}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 self-start">
          <Stat label="participants" value={`n = ${g.n}`} />
          <Stat label="age" value={`${g.age} ± ${g.ageSd} y`} />
          <Stat label="body mass" value={`${g.bm[0]} → ${g.bm[1]} kg`} />
          <Stat label="relative 1RM" value={`${g.rel[0].toFixed(1)} → ${g.rel[1].toFixed(1)}`} />
        </div>
        <div className="self-start">
          <Stat label="1RM (group mean)" value={`${g.rm[0].toFixed(1)} → ${g.rm[1].toFixed(1)} kg`} />
          <p className="body mt-6 text-sm">
            Hover a line to preview a group. Click to pin it. Relative 1RM is 1RM divided by body mass (kg/kg).
          </p>
        </div>
      </div>
    </div>
  );
}
