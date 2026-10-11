import { useState } from "react";
import { GROUPS, GROUP_COLOR, groupName, pct } from "../lib/data";
import { useInView, useProgress, useTween } from "../lib/hooks";
import { sfx } from "../lib/sound";

const CX = 260;
const CY = 260;
const MAX = 45; // % at full sweep
const RINGS = [208, 178, 148, 118, 88, 58];
const SWEEP = 270;

const toDeg = (v: number) => (Math.max(0, v) / MAX) * SWEEP;

function pt(r: number, a: number): [number, number] {
  const t = (a * Math.PI) / 180;
  return [CX + r * Math.sin(t), CY - r * Math.cos(t)];
}

/** Arc clockwise from 12 o'clock, angles in degrees. */
function arc(r: number, a0: number, a1: number) {
  const [x0, y0] = pt(r, a0);
  const [x1, y1] = pt(r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

export default function RadialGains() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const p = useProgress(inView, 2000, 150);
  const [active, setActive] = useState<string>("f3");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const g = GROUPS.find((x) => x.id === active) ?? GROUPS[0];
  const shown = useTween(g.gain, 600);

  const focus = (id: string) => {
    setActive(id);
    setHoverId(id);
    sfx.hover(id.startsWith("f") ? 0.7 : 0.35);
  };
  const unfocus = () => setHoverId(null);

  return (
    <div ref={ref} className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
      <div className="card relative p-4 md:p-8">
        <svg viewBox="0 0 520 520" className="h-auto w-full" role="img" aria-label="Radial bars of mean 1RM gain by sex and age band">
          {GROUPS.map((x, i) => {
            const r = RINGS[i];
            const color = GROUP_COLOR[x.id];
            const isOn = active === x.id;
            const dim = hoverId !== null && hoverId !== x.id;
            const meanDeg = toDeg(x.gain) * p;
            const sdLo = toDeg(x.gain - (x.gainSd ?? 0));
            const sdHi = toDeg(x.gain + (x.gainSd ?? 0));
            return (
              <g
                key={x.id}
                style={{ opacity: dim ? 0.25 : 1, transition: "opacity .45s ease" }}
              >
                {/* track */}
                <path d={arc(r, 0, SWEEP)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={16} strokeLinecap="round" />
                {/* ±1 SD halo */}
                {x.gainSd !== null && (
                  <path
                    d={arc(r, Math.max(0.5, sdLo), Math.min(SWEEP - 0.5, sdHi))}
                    fill="none"
                    stroke={color}
                    strokeWidth={16}
                    strokeLinecap="butt"
                    opacity={0.22 * p}
                  />
                )}
                {/* mean arc */}
                <path
                  d={arc(r, 0, Math.max(0.5, meanDeg))}
                  fill="none"
                  stroke={color}
                  strokeWidth={isOn ? 18 : 14}
                  strokeLinecap="round"
                  style={{ filter: isOn ? `drop-shadow(0 0 8px ${color})` : undefined, transition: "stroke-width .3s ease" }}
                />
                {/* label at the start of each track */}
                <text x={CX - 10} y={CY - r + 4} textAnchor="end" fontSize="11" fill={isOn ? "#fff" : "#8d98c4"} className="font-mono">
                  {groupName(x)}
                </text>
                {/* hit area */}
                <path
                  d={arc(r, 0, SWEEP)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={26}
                  style={{ cursor: "pointer" }}
                  onPointerEnter={() => focus(x.id)}
                  onPointerLeave={unfocus}
                />
              </g>
            );
          })}

          <text x={CX} y={CY - 2} textAnchor="middle" fontSize="44" className="font-display" fill="#ffffff">
            {shown.toFixed(1)}%
          </text>
          <text x={CX} y={CY + 22} textAnchor="middle" fontSize="10" letterSpacing="2" fill="#8d98c4" className="font-mono">
            {groupName(g).toUpperCase()}
          </text>
        </svg>
      </div>

      <div>
        <div className="space-y-3">
          {GROUPS.map((x) => {
            const on = active === x.id;
            return (
              <button
                key={x.id}
                onPointerEnter={() => focus(x.id)}
                onPointerLeave={unfocus}
                onFocus={() => setActive(x.id)}
                onClick={() => sfx.select()}
                className={`card flex w-full items-center gap-5 p-4 text-left transition-all duration-300 ${
                  on ? "translate-x-2 border-[var(--klein-hi)]/60" : ""
                }`}
              >
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: GROUP_COLOR[x.id], boxShadow: on ? `0 0 14px ${GROUP_COLOR[x.id]}` : "none" }} />
                <span className="w-36 shrink-0 font-mono text-[12px] text-white/90">{groupName(x)}</span>
                <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${(x.gain / 45) * 100 * p}%`,
                      background: GROUP_COLOR[x.id],
                      transition: "width .3s ease",
                    }}
                  />
                </span>
                <span className="w-24 shrink-0 text-right font-mono text-[12px] text-white">
                  {pct(x.gain)}
                  <span className="text-[var(--mist)]"> ±{x.gainSd}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 space-y-5">
          <p className="body text-sm">
            Mean individual change in leg-press 1RM. The thin halo marks ±1 SD. Women's relative gains were larger
            overall (24.2% vs 19.4%).
          </p>
          <p className="body text-sm">
            Within each sex the three age bands gained similar amounts. The sex × age interaction was not statistically
            significant.
          </p>
        </div>
      </div>
    </div>
  );
}
