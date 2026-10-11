import { useRef } from "react";
import { motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { StickyScene, useBump, useRamp, useRange, clamp01 } from "@/lib/scroll";
import { LANDMASSES, NODES, ROUTES, smoothPath } from "@/data/world";

const STEPS = [
  {
    n: "01",
    h: "A CRAFT WITH AN ADDRESS",
    b: "It starts somewhere wet: a valley with fast water, mulberry bark, and a bureaucracy that needed a lighter surface than bamboo. Everything after this is logistics.",
    stat: "ORIGIN · 105 CE",
  },
  {
    n: "02",
    h: "THE ROAD ALREADY EXISTED",
    b: "The technique did not build a route. It joined one — the same corridor that moved tax grain, silk and bad news between garrisons, at the speed of a laden animal.",
    stat: "OVERLAND · 4,000 MI",
  },
  {
    n: "03",
    h: "THEN IT TOOK THE WATER",
    b: "Monsoon sailing is a timetable, not an adventure. One departure window a year in each direction, which is why the maritime branch moves in jumps of twelve months.",
    stat: "SEA ROUTE · 11 STOPS",
  },
  {
    n: "04",
    h: "AND INTO THE LEDGER",
    b: "The last leg is the least romantic: a mill, a river, a contract. By the time the craft reaches a European chancery it is a line item, not a discovery.",
    stat: "WESTERN BRANCH · 1400",
  },
];

export default function RouteMap() {
  return (
    <StickyScene id="route" vh={460}>
      {(p) => (
        <div className="relative h-full w-full bg-[#0d1226]">
          <div className="absolute inset-0 text-paper/[0.04] halftone" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(75% 65% at 62% 42%, rgba(43,72,216,0.20), transparent 70%), radial-gradient(45% 40% at 18% 78%, rgba(255,212,0,0.10), transparent 70%)",
            }}
          />
          <MapStage p={p} />
          <StepColumn p={p} />
          <YearHud p={p} />
          <Legend p={p} />
        </div>
      )}
    </StickyScene>
  );
}

/* --------------------------------- the map -------------------------------- */

function MapStage({ p }: { p: MotionValue<number> }) {
  const zoom = useRange(p, 1.0, 1.16, 0, 1);
  const panX = useRange(p, 0, -60, 0, 1);
  const panY = useRange(p, 10, -20, 0, 1);

  return (
    <>
      {/* desktop: whole world, contained */}
      <div className="absolute inset-0 hidden md:block">
        <motion.svg
          viewBox="0 -10 1000 540"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
          style={{ scale: zoom, x: panX, y: panY }}
        >
          <MapBody p={p} />
        </motion.svg>
      </div>
      {/* mobile: cropped to the corridor, filled */}
      <div className="absolute inset-0 md:hidden">
        <motion.svg
          viewBox="380 40 620 330"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
          style={{ scale: zoom, x: panX, y: panY }}
        >
          <MapBody p={p} />
        </motion.svg>
      </div>
      <div className="pointer-events-none absolute inset-0 scan-lines opacity-[0.35]" />
    </>
  );
}

function MapBody({ p }: { p: MotionValue<number> }) {
  return (
    <g>
      <defs>
        <pattern id="landdots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.15" fill="rgba(238,233,220,0.22)" />
        </pattern>
        <pattern id="grat" width="27.78" height="34.67" patternUnits="userSpaceOnUse">
          <path d="M27.78 0 L0 0 0 34.67" fill="none" stroke="rgba(238,233,220,0.10)" strokeWidth="0.5" />
        </pattern>
        <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="-10" width="1000" height="540" fill="url(#grat)" />
      <line x1="0" y1="312" x2="1000" y2="312" stroke="rgba(238,233,220,0.22)" strokeWidth="0.8" strokeDasharray="6 5" />
      <text x="12" y="306" fill="rgba(238,233,220,0.4)" fontSize="8" fontFamily="IBM Plex Mono, monospace">
        EQUATOR
      </text>

      {LANDMASSES.map((l) => (
        <path
          key={`s-${l.id}`}
          d={l.d}
          fill="#151d38"
          stroke="rgba(238,233,220,0.55)"
          strokeWidth={l.major ? 1.1 : 0.7}
          strokeLinejoin="round"
        />
      ))}
      {LANDMASSES.map((l) => (
        <path key={`d-${l.id}`} d={l.d} fill="url(#landdots)" stroke="none" />
      ))}

      {ROUTES.map((r) => (
        <RouteLine key={r.id} route={r} p={p} />
      ))}

      {NODES.map((n) => (
        <NodeDot key={n.name} node={n} p={p} />
      ))}
    </g>
  );
}

function RouteLine({ route, p }: { route: (typeof ROUTES)[number]; p: MotionValue<number> }) {
  const d = smoothPath(route.pts);
  const draw = useRamp(p, route.from, route.to);
  const ref = useRef<SVGPathElement>(null);
  const hx = useMotionValue(route.pts[0][0]);
  const hy = useMotionValue(route.pts[0][1]);

  useMotionValueEvent(draw, "change", (v) => {
    const el = ref.current;
    if (!el) return;
    const pt = el.getPointAtLength(clamp01(v) * el.getTotalLength());
    hx.set(pt.x);
    hy.set(pt.y);
  });

  const headOpacity = useTransform(draw, (v) => (v > 0.001 && v < 0.999 ? 1 : 0));

  return (
    <g>
      <path d={d} fill="none" stroke={route.color} strokeWidth="7" opacity={0.1} strokeLinecap="round" />
      <motion.path
        ref={ref}
        d={d}
        fill="none"
        stroke={route.color}
        strokeWidth="1.8"
        strokeLinecap="round"
        style={{ pathLength: draw }}
        filter="url(#glow)"
      />
      <motion.path
        d={d}
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeDasharray="2 14"
        strokeLinecap="round"
        className="animate-dash"
        style={{ opacity: useTransform(draw, (v) => (v > 0.02 ? 0.5 : 0)) }}
      />
      <motion.g style={{ x: hx, y: hy, opacity: headOpacity }}>
        <circle r="7" fill={route.color} opacity="0.28" />
        <circle r="3" fill="#fff" />
        <circle r="3" fill={route.color} opacity="0.9">
          <animate attributeName="r" values="3;9;3" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0;0.9" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </motion.g>
    </g>
  );
}

function NodeDot({ node, p }: { node: (typeof NODES)[number]; p: MotionValue<number> }) {
  const t = useRamp(p, node.at, node.at + 0.05);
  const left = node.anchor === "left";
  const label = node.name;
  const w = label.length * 5.3 + 34;
  const bx = left ? node.x - w - 8 : node.x + 8;

  return (
    <motion.g style={{ opacity: t }}>
      <motion.g style={{ scale: useRange(t, 2.4, 1), transformOrigin: `${node.x}px ${node.y}px` }}>
        <circle cx={node.x} cy={node.y} r="9" fill="none" stroke="#ffd400" strokeWidth="0.8" opacity="0.45" />
        <circle cx={node.x} cy={node.y} r="3.4" fill="#ffd400" />
        <circle cx={node.x} cy={node.y} r="1.4" fill="#0b0b0d" />
      </motion.g>
      <motion.g style={{ x: useRange(t, left ? 14 : -14, 0) }}>
        <line
          x1={node.x}
          y1={node.y}
          x2={left ? node.x - 8 : node.x + 8}
          y2={node.y}
          stroke="rgba(238,233,220,0.5)"
          strokeWidth="0.7"
        />
        <rect x={bx} y={node.y - 8} width={w} height={16} fill="#0b0b0d" stroke="rgba(238,233,220,0.28)" strokeWidth="0.6" />
        <rect x={bx} y={node.y - 8} width="2.5" height={16} fill="#ffd400" />
        <text
          x={bx + 7}
          y={node.y + 3}
          fill="#eee9dc"
          fontSize="7.6"
          letterSpacing="0.6"
          fontFamily="IBM Plex Mono, monospace"
        >
          {label}
        </text>
        <text
          x={bx + w - 5}
          y={node.y + 3}
          fill="#ffd400"
          fontSize="7.6"
          textAnchor="end"
          fontFamily="IBM Plex Mono, monospace"
        >
          {node.year}
        </text>
      </motion.g>
    </motion.g>
  );
}

/* ------------------------------ overlay chrome ----------------------------- */

function StepColumn({ p }: { p: MotionValue<number> }) {
  return (
    <div className="pointer-events-none absolute bottom-[10%] left-[clamp(1rem,4vw,4rem)] z-20 w-[min(25rem,86vw)]">
      {STEPS.map((s, i) => (
        <StepCard key={s.n} s={s} p={p} i={i} />
      ))}
    </div>
  );
}

function StepCard({ s, p, i }: { s: (typeof STEPS)[number]; p: MotionValue<number>; i: number }) {
  const seg = 1 / STEPS.length;
  const o = useBump(p, i * seg, (i + 1) * seg, 0.045);
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 border-l-[3px] border-yolk bg-ink/88 p-5 backdrop-blur-[1px]"
      style={{ opacity: o, y: useRange(o, 22, 0) }}
    >
      <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-yolk">
        <span>STEP {s.n}</span>
        <span className="text-paper/45">{s.stat}</span>
      </div>
      <h3 className="font-display text-[clamp(1.3rem,2.1vw,1.85rem)] leading-[0.95] text-paper uppercase">
        {s.h}
      </h3>
      <p className="mt-2.5 max-w-[38ch] font-serif text-[13.5px] leading-[1.6] text-paper/72">{s.b}</p>
    </motion.div>
  );
}

function Tick({ i, p }: { i: number; p: MotionValue<number> }) {
  const bg = useTransform(p, (v) => (v * 24 > i ? "#ffd400" : "rgba(238,233,220,0.2)"));
  return <motion.span className="block h-2 w-[3px]" style={{ backgroundColor: bg }} />;
}

function YearHud({ p }: { p: MotionValue<number> }) {
  const year = useTransform(p, (v) => Math.round(105 + (1400 - 105) * Math.pow(v, 0.85)));
  const shown = useTransform(year, (v) => v.toLocaleString("en-US"));
  const inP = useRamp(p, 0.02, 0.1);
  return (
    <motion.div
      className="absolute top-[70px] right-[clamp(1rem,4vw,4rem)] z-20 border border-paper/15 bg-ink/85 px-4 py-3 text-right"
      style={{ opacity: inP, y: useRange(inP, -16, 0) }}
    >
      <div className="font-mono text-[9px] tracking-[0.3em] text-paper/45">YEAR OF RECORD</div>
      <motion.div className="font-display text-[clamp(2.2rem,4.4vw,3.4rem)] leading-none text-yolk tabular-nums">
        {shown}
      </motion.div>
      <div className="mt-1 flex justify-end gap-[3px]">
        {Array.from({ length: 24 }).map((_, i) => (
          <Tick key={i} i={i} p={p} />
        ))}
      </div>
    </motion.div>
  );
}

function Legend({ p }: { p: MotionValue<number> }) {
  const inP = useRamp(p, 0.04, 0.12);
  return (
    <motion.div
      className="absolute right-[clamp(1rem,4vw,4rem)] bottom-[8%] z-20 hidden flex-col gap-1.5 md:flex"
      style={{ opacity: inP }}
    >
      {ROUTES.map((r) => (
        <LegendRow key={r.id} r={r} p={p} />
      ))}
      <div className="mt-2 flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-paper/40">
        <span className="block h-[2px] w-10 bg-paper/40" />
        <span>0</span>
        <span className="block h-[2px] w-10 bg-paper/40" />
        <span>1000 KM</span>
      </div>
    </motion.div>
  );
}

function LegendRow({ r, p }: { r: (typeof ROUTES)[number]; p: MotionValue<number> }) {
  const done = useRamp(p, r.from, r.to);
  return (
    <div className="flex items-center gap-2.5">
      <span className="block h-[3px] w-7" style={{ backgroundColor: r.color }} />
      <span className="font-mono text-[9.5px] tracking-[0.18em] text-paper/60">{r.label}</span>
      <span className="ml-auto block h-[3px] w-14 bg-paper/12">
        <motion.span className="block h-full origin-left" style={{ backgroundColor: r.color, scaleX: done }} />
      </span>
    </div>
  );
}
