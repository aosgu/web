import { useRef } from "react";
import type { SVGProps } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { StickyScene, useBump, useRamp, useRange, Count, lerp, clamp01 } from "@/lib/scroll";
import { FRONT_DAYS, FRONT_KEYS, FRONT_NOTES, UNITS } from "@/data/content";

const W = 1000;
const H = 600;
const ROWS = 9;

function frontAt(t: number) {
  const f = clamp01(t) * (FRONT_KEYS.length - 1);
  const i = Math.min(Math.floor(f), FRONT_KEYS.length - 2);
  const k = f - i;
  return FRONT_KEYS[i].map((x, j) => lerp(x, FRONT_KEYS[i + 1][j], k));
}

function keyToD(keys: number[], edge?: number) {
  const spine =
    `M${keys[0]},-30 ` +
    keys.map((x, j) => `L${x},${((j * (H + 60)) / (ROWS - 1) - 30).toFixed(1)}`).join(" ");
  return edge === undefined ? spine : `${spine} L${edge},${H + 30} L${edge},-30 Z`;
}

const staticPath = (keys: number[], edge?: number) => keyToD(keys, edge);

/** Sets the `d` attribute directly from a motion value — no re-render, no interpolation guesswork. */
function MorphPath({
  mv,
  d0,
  ...rest
}: { mv: MotionValue<string>; d0: string } & SVGProps<SVGPathElement>) {
  const ref = useRef<SVGPathElement>(null);
  useMotionValueEvent(mv, "change", (v) => ref.current?.setAttribute("d", v));
  return <path ref={ref} d={d0} {...rest} />;
}

function trackAt(track: number[][], t: number) {
  const f = clamp01(t) * (track.length - 1);
  const i = Math.min(Math.floor(f), track.length - 2);
  const k = f - i;
  return [lerp(track[i][0], track[i + 1][0], k), lerp(track[i][1], track[i + 1][1], k)];
}

export default function SandTable() {
  return (
    <StickyScene id="sand" vh={560}>
      {(p) => (
        <div className="relative h-full w-full overflow-hidden bg-[#1a1a17]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(90% 70% at 30% 22%, rgba(255,236,180,0.22), transparent 65%), radial-gradient(70% 60% at 80% 85%, rgba(20,30,20,0.55), transparent 70%)",
            }}
          />
          <Table p={p} />
          <div className="sand-layer pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay" />
          <div className="pointer-events-none absolute inset-0 scan-lines opacity-25" />
          <Hud p={p} />
          <Scrubber p={p} />
        </div>
      )}
    </StickyScene>
  );
}

/* -------------------------------- the table ------------------------------- */

function Table({ p }: { p: MotionValue<number> }) {
  const xs = useTransform(p, frontAt);
  const frontD = useTransform(
    xs,
    (arr) => `M${arr[0]},-30 ` + arr.map((x, i) => `L${x.toFixed(1)},${((i * (H + 60)) / (ROWS - 1) - 30).toFixed(1)}`).join(" "),
  );
  const eastD = useTransform(frontD, (d) => `${d} L${W + 40},${H + 30} L${W + 40},-30 Z`);
  const westD = useTransform(frontD, (d) => `${d} L-40,${H + 30} L-40,-30 Z`);
  const tilt = useRange(p, 12, 4, 0, 1);

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        transform: useTransform(tilt, (deg) => `perspective(1700px) rotateX(${deg}deg) scale(1.12)`),
        transformOrigin: "50% 60%",
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <pattern id="sandgrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M50 0 L0 0 0 50" fill="none" stroke="rgba(24,26,18,0.22)" strokeWidth="0.7" />
          </pattern>
          <pattern id="heldhatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <rect width="9" height="9" fill="rgba(234,59,36,0.16)" />
            <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(234,59,36,0.55)" strokeWidth="1.6" />
          </pattern>
          <pattern id="pushhatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
            <rect width="9" height="9" fill="rgba(43,72,216,0.14)" />
            <line x1="0" y1="0" x2="0" y2="9" stroke="rgba(43,72,216,0.5)" strokeWidth="1.6" />
          </pattern>
          <filter id="tableShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="4" stdDeviation="3" floodColor="#0b0b0d" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* ground */}
        <rect width={W} height={H} fill="#c8bd97" />
        <rect width={W} height={H} fill="#b9ad86" opacity="0.5" />
        <Contours />
        <rect width={W} height={H} fill="url(#sandgrid)" />

        {/* rivers + roads + towns */}
        <path d="M-10,210 C160,240 260,180 420,232 C560,278 660,250 800,300 C900,336 960,330 1010,352" fill="none" stroke="#6d8fa0" strokeWidth="7" strokeLinecap="round" opacity="0.85" />
        <path d="M420,232 C470,300 470,380 520,470 C548,520 560,560 566,610" fill="none" stroke="#6d8fa0" strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
        <path d="M-10,470 C180,450 300,500 480,470 C660,440 820,470 1010,440" fill="none" stroke="rgba(60,52,34,0.55)" strokeWidth="2.4" strokeDasharray="14 8" />
        <path d="M240,-10 C250,160 300,300 330,610" fill="none" stroke="rgba(60,52,34,0.45)" strokeWidth="2" strokeDasharray="10 9" />
        <Towns />

        {/* ground held by each side, repainted as the line moves */}
        <MorphPath mv={westD} d0={staticPath(FRONT_KEYS[0], -40)} fill="url(#pushhatch)" />
        <MorphPath mv={eastD} d0={staticPath(FRONT_KEYS[0], W + 40)} fill="url(#heldhatch)" />

        {/* history of the line */}
        {FRONT_KEYS.map((k, i) => (
          <GhostFront key={i} keys={k} p={p} i={i} />
        ))}

        {/* the live front */}
        <MorphPath mv={frontD} d0={staticPath(FRONT_KEYS[0])} fill="none" stroke="#0b0b0d" strokeWidth={14} opacity={0.14} />
        <MorphPath mv={frontD} d0={staticPath(FRONT_KEYS[0])} fill="none" stroke="#1c1a12" strokeWidth={3.4} />
        <MorphPath
          mv={frontD}
          d0={staticPath(FRONT_KEYS[0])}
          fill="none"
          stroke="#ea3b24"
          strokeWidth={3.4}
          strokeDasharray="16 12"
          className="animate-dash"
        />

        <Arrows p={p} />

        {UNITS.map((u) => (
          <UnitChip key={u.id} u={u} p={p} />
        ))}
      </svg>
    </motion.div>
  );
}

function Contours() {
  const paths: string[] = [];
  for (let i = 0; i < 16; i++) {
    const base = 20 + i * 38;
    let d = `M-20,${base}`;
    for (let x = 0; x <= 1040; x += 40) {
      const y = base + 16 * Math.sin(x / 150 + i * 0.55) + 9 * Math.sin(x / 53 + i * 1.7);
      d += ` L${x},${y.toFixed(1)}`;
    }
    paths.push(d);
  }
  return (
    <g opacity="0.5">
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={i % 4 === 0 ? "rgba(70,60,36,0.42)" : "rgba(70,60,36,0.2)"} strokeWidth={i % 4 === 0 ? 1.3 : 0.7} />
      ))}
    </g>
  );
}

function Towns() {
  const towns = [
    [190, 180, "KESSA"],
    [390, 330, "ORDYN"],
    [560, 148, "VELL"],
    [700, 420, "MARNE"],
    [860, 250, "TOLBA"],
    [300, 520, "S. RIVE"],
    [760, 545, "ESTWICK"],
  ];
  return (
    <g>
      {towns.map(([x, y, n]) => (
        <g key={n as string}>
          <rect x={(x as number) - 3.5} y={(y as number) - 3.5} width="7" height="7" fill="#2b2a20" />
          <text x={(x as number) + 8} y={(y as number) + 3.5} fontSize="9" letterSpacing="1.2" fill="rgba(28,26,18,0.75)" fontFamily="IBM Plex Mono, monospace">
            {n as string}
          </text>
        </g>
      ))}
    </g>
  );
}

function GhostFront({ keys, p, i }: { keys: number[]; p: MotionValue<number>; i: number }) {
  const d = `M${keys[0]},-30 ` + keys.map((x, j) => `L${x},${((j * (H + 60)) / (ROWS - 1) - 30).toFixed(1)}`).join(" ");
  const o = useTransform(p, (v) => (v * (FRONT_KEYS.length - 1) > i ? 0.3 : 0));
  return <motion.path d={d} fill="none" stroke="rgba(28,26,18,0.55)" strokeWidth="1.2" strokeDasharray="4 5" style={{ opacity: o }} />;
}

function Arrows({ p }: { p: MotionValue<number> }) {
  const shots = [
    { d: "M150,150 C260,150 330,168 430,168", from: 0.1, to: 0.34, color: "#2b48d8", w: 12, head: [430, 168] as number[], dir: 1 },
    { d: "M140,300 C250,296 330,306 420,300", from: 0.28, to: 0.52, color: "#2b48d8", w: 16, head: [420, 300] as number[], dir: 1 },
    { d: "M170,455 C270,452 340,458 415,450", from: 0.46, to: 0.7, color: "#2b48d8", w: 12, head: [415, 450] as number[], dir: 1 },
    { d: "M640,270 C580,262 520,268 470,266", from: 0.62, to: 0.86, color: "#ea3b24", w: 13, head: [470, 266] as number[], dir: -1 },
  ];
  return (
    <g>
      {shots.map((s, i) => (
        <Arrow key={i} s={s} p={p} />
      ))}
    </g>
  );
}

type Shot = { d: string; from: number; to: number; color: string; w: number; head: number[]; dir: number };

function Arrow({ s, p }: { s: Shot; p: MotionValue<number> }) {
  const draw = useRamp(p, s.from, s.to);
  const fade = useBump(p, s.from, s.to + 0.06, 0.05);
  const headOn = useTransform(draw, (v) => (v > 0.86 ? 1 : 0));
  const d = s.dir;
  const tri = `M0,0 L${-20 * d},${-13} L${-20 * d},${13} Z`;
  return (
    <motion.g style={{ opacity: fade }}>
      <motion.path d={s.d} fill="none" stroke="rgba(11,11,13,0.35)" strokeWidth={s.w + 4} strokeLinecap="round" style={{ pathLength: draw }} />
      <motion.path d={s.d} fill="none" stroke={s.color} strokeWidth={s.w} strokeLinecap="round" style={{ pathLength: draw }} />
      <motion.path d={s.d} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={Math.max(2, s.w - 7)} strokeLinecap="round" style={{ pathLength: draw }} />
      <motion.path d={tri} fill={s.color} style={{ x: s.head[0], y: s.head[1], opacity: headOn, scale: headOn }} />
    </motion.g>
  );
}

function UnitChip({ u, p }: { u: (typeof UNITS)[number]; p: MotionValue<number> }) {
  const t = useTransform(p, (v) => trackAt(u.track, v));
  const x = useTransform(t, (a) => a[0]);
  const y = useTransform(t, (a) => a[1]);
  const fill = u.side === "a" ? "#e8edff" : "#ffe6df";
  const stroke = u.side === "a" ? "#1b2a6b" : "#8c1c0c";
  const s = 34 * (u.size ?? 1);
  const h = 20 * (u.size ?? 1);

  return (
    <motion.g style={{ x, y }}>
      <g
        className="cursor-pointer transition-transform duration-200 ease-out hover:scale-125"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
      <title>{`${u.label} — ${u.side === "a" ? "attacker" : "defender"}`}</title>
      <rect x={-s / 2 + 3} y={-h / 2 + 4} width={s} height={h} fill="rgba(11,11,13,0.35)" />
      <rect x={-s / 2} y={-h / 2} width={s} height={h} fill={fill} stroke={stroke} strokeWidth="2" />
      {u.kind === "inf" && (
        <path d={`M${-s / 2},${-h / 2} L${s / 2},${h / 2} M${s / 2},${-h / 2} L${-s / 2},${h / 2}`} stroke={stroke} strokeWidth="1.6" />
      )}
      {u.kind === "arm" && <ellipse cx="0" cy="0" rx={s / 2 - 3} ry={h / 2 - 3} fill="none" stroke={stroke} strokeWidth="1.6" />}
      {u.kind === "arty" && <circle cx="0" cy="0" r="3.4" fill={stroke} />}
      <text x="0" y={-h / 2 - 5} fontSize="9.5" textAnchor="middle" letterSpacing="0.8" fill="#1c1a12" fontFamily="IBM Plex Mono, monospace" fontWeight="600">
        {u.label}
      </text>
      </g>
    </motion.g>
  );
}

/* ---------------------------------- HUD ---------------------------------- */

function Hud({ p }: { p: MotionValue<number> }) {
  const day = useTransform(p, (v) => v * 9);
  const inP = useRamp(p, 0.0, 0.05);
  const lossesA = useRange(p, 0, 74, 0.05, 0.95);
  const lossesB = useRange(p, 0, 61, 0.05, 0.95);

  return (
    <>
      <motion.div className="absolute top-[68px] left-[clamp(1rem,4vw,4rem)] z-20 max-w-[min(24rem,80vw)]" style={{ opacity: inP }}>
        <div className="border-l-[3px] border-flare bg-ink/85 px-4 py-3">
          <div className="font-mono text-[9.5px] tracking-[0.28em] text-flare">SIMULATION · TABLE 2</div>
          <h3 className="mt-1 font-display text-[clamp(1.5rem,3vw,2.3rem)] leading-[0.92] text-paper uppercase">
            Nine days on the Kessa ridge
          </h3>
          <div className="mt-3 flex items-end gap-3">
            <div className="font-display text-[2.6rem] leading-none text-yolk tabular-nums">
              <Count value={day} decimals={0} />
            </div>
            <div className="mb-1 font-mono text-[10px] tracking-[0.2em] text-paper/50">
              DAYS
              <br />
              ELAPSED
            </div>
          </div>
        </div>
        <div className="relative mt-2 h-[74px]">
          {FRONT_NOTES.map((n, i) => (
            <Note key={i} n={n} p={p} i={i} />
          ))}
        </div>
      </motion.div>

      <motion.div className="absolute top-[68px] right-[clamp(1rem,4vw,4rem)] z-20 w-[168px] border border-paper/15 bg-ink/85 p-3" style={{ opacity: inP }}>
        <div className="font-mono text-[9px] tracking-[0.24em] text-paper/45">ATTRITION INDEX</div>
        <Meter label="ATTACKER" color="#2b48d8" v={lossesA} />
        <Meter label="DEFENDER" color="#ea3b24" v={lossesB} />
        <div className="mt-3 grid grid-cols-2 gap-1 font-mono text-[9px] tracking-wider text-paper/50">
          <span>SCALE</span><span className="text-right text-paper">1:50 000</span>
          <span>TERRAIN</span><span className="text-right text-paper">ROLLING</span>
          <span>WEATHER</span><span className="text-right text-paper">DRY</span>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute right-[clamp(1rem,4vw,4rem)] bottom-[19%] z-20 hidden text-paper/70 md:block">
        <svg width="62" height="62" viewBox="0 0 62 62" fill="none">
          <circle cx="31" cy="31" r="24" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <path d="M31 5 L36 31 L31 26 L26 31 Z" fill="#ffd400" />
          <path d="M31 57 L26 31 L31 36 L36 31 Z" fill="currentColor" opacity="0.5" />
          <text x="31" y="16" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="IBM Plex Mono, monospace">N</text>
        </svg>
      </div>
    </>
  );
}

function Note({ n, p, i }: { n: string; p: MotionValue<number>; i: number }) {
  const seg = 1 / FRONT_NOTES.length;
  const o = useBump(p, i * seg, (i + 1) * seg, 0.04);
  return (
    <motion.div
      className="absolute inset-x-0 top-0 border border-paper/12 bg-ink/70 p-3 font-serif text-[13px] leading-snug text-paper/80"
      style={{ opacity: o, y: useRange(o, 10, 0) }}
    >
      <span className="mr-2 font-mono text-[9px] tracking-widest text-yolk">{FRONT_DAYS[i]}</span>
      {n}
    </motion.div>
  );
}

function Meter({ label, color, v }: { label: string; color: string; v: MotionValue<number> }) {
  return (
    <div className="mt-2">
      <div className="flex justify-between font-mono text-[9px] tracking-wider text-paper/55">
        <span>{label}</span>
        <motion.span className="text-paper tabular-nums">
          <Count value={v} />
        </motion.span>
      </div>
      <div className="mt-1 h-[7px] w-full bg-paper/12">
        <motion.div className="h-full origin-left" style={{ backgroundColor: color, scaleX: useTransform(v, (x) => x / 100) }} />
      </div>
    </div>
  );
}

function Scrubber({ p }: { p: MotionValue<number> }) {
  const x = useTransform(p, [0, 1], ["0%", "100%"]);
  const day = useTransform(p, (v) => `DAY ${(v * 9).toFixed(1)}`);
  return (
    <div className="absolute inset-x-[clamp(1rem,4vw,4rem)] bottom-[7%] z-20">
      <div className="mb-2 flex items-end justify-between font-mono text-[9.5px] tracking-[0.22em] text-paper/45">
        <span>TIMELINE SCRUB</span>
        <motion.span className="text-yolk">{day}</motion.span>
      </div>
      <div className="relative h-[26px] border border-paper/15 bg-ink/70">
        <div className="absolute inset-0 flex">
          {FRONT_DAYS.map((d) => (
            <div key={d} className="relative flex-1 border-r border-paper/12 last:border-r-0">
              <span className="absolute bottom-1 left-2 font-mono text-[8.5px] tracking-widest text-paper/40">{d}</span>
            </div>
          ))}
        </div>
        <motion.div className="absolute inset-y-0 left-0 w-[2px] bg-yolk" style={{ left: x }}>
          <span className="absolute -top-[7px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[7px] border-x-transparent border-t-yolk" />
        </motion.div>
        <motion.div className="absolute inset-y-0 left-0 bg-yolk/12" style={{ width: x }} />
      </div>
    </div>
  );
}
