import { motion } from "framer-motion";
import { ChapterCard } from "@/components/Chrome";

/* deterministic pseudo-random so the panel looks plotted, not generated */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type Panel = {
  t: string;
  sub: string;
  kind: "bars" | "line" | "area" | "dots" | "steps" | "donut" | "heat" | "stack" | "slope";
  seed: number;
  color: string;
  read: string;
};

const PANELS: Panel[] = [
  { t: "OUTPUT PER MILL", sub: "index, 1400 = 100", kind: "bars", seed: 11, color: "#ffd400", read: "×38 by 1800" },
  { t: "RAG PRICE", sub: "per hundredweight", kind: "line", seed: 23, color: "#ea3b24", read: "falls, then flat" },
  { t: "SHARES IN PRINT", sub: "cumulative", kind: "area", seed: 37, color: "#4d6bff", read: "0.4% → 61%" },
  { t: "MILLS PER RIVER", sub: "count by reach", kind: "dots", seed: 51, color: "#0f9d63", read: "clusters, not spread" },
  { t: "TIME TO COPY", sub: "days per folio", kind: "steps", seed: 63, color: "#f28c28", read: "6 steps down" },
  { t: "WHO PAID", sub: "share of orders", kind: "donut", seed: 71, color: "#ffd400", read: "church 44%" },
  { t: "SURVIVAL RATE", sub: "copies still extant", kind: "heat", seed: 89, color: "#7ad0e6", read: "1 in 40 sheets" },
  { t: "FORMAT MIX", sub: "folio / quarto / octavo", kind: "stack", seed: 97, color: "#ea3b24", read: "smaller over time" },
  { t: "CITY RANKS", sub: "1500 → 1700", kind: "slope", seed: 103, color: "#4d6bff", read: "two cross over" },
];

export default function SmallMultiples() {
  return (
    <section id="multiples" className="relative overflow-hidden bg-[#0e0e12] py-[9vh]">
      <div className="absolute inset-0 text-paper/[0.05] halftone" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(60% 45% at 78% 12%, rgba(77,107,255,0.16), transparent 70%)" }}
      />
      <div className="scene-pad relative z-10 mx-auto max-w-[1240px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <ChapterCard n="06" kicker="The multiples" title="The same story, nine ways" />
          <p className="max-w-[34ch] font-serif text-[13.5px] leading-[1.6] text-paper/60">
            A grid is an argument. Nine small charts, one scale each, no axis worth trusting —
            which is exactly why they are laid out side by side.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {PANELS.map((p, i) => (
            <Card key={p.t} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ p, i }: { p: Panel; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: (i % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border border-paper/15 bg-[#12131a] p-3 transition-colors duration-300 hover:border-yolk/70 sm:p-4"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-sans text-[11px] font-extrabold tracking-[0.12em] text-paper uppercase">
          {p.t}
        </span>
        <span className="font-mono text-[8.5px] tracking-[0.18em] text-paper/35">
          {String(i + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-0.5 font-mono text-[9px] tracking-[0.16em] text-paper/40 uppercase">{p.sub}</div>

      <div className="relative mt-3 h-[104px] w-full overflow-hidden">
        <Viz p={p} i={i} />
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-paper/10 pt-2">
        <span className="font-mono text-[9.5px] tracking-[0.14em] text-paper/45">{p.read}</span>
        <span
          className="font-mono text-[9.5px] tracking-[0.14em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ color: p.color }}
        >
          INSPECT →
        </span>
      </div>
    </motion.div>
  );
}

function Viz({ p, i }: { p: Panel; i: number }) {
  const r = rng(p.seed);
  const W = 220;
  const H = 104;
  const delay = (i % 3) * 0.07;

  const common = {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 1.1, delay: delay + 0.15, ease: [0.33, 1, 0.68, 1] as const },
  };

  if (p.kind === "bars") {
    const bars = Array.from({ length: 11 }, (_, k) => 6 + Math.pow(k / 10, 2.1) * 86 + r() * 5);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
        {bars.map((b, k) => (
          <motion.rect
            key={k}
            x={4 + k * 19.4}
            width="13"
            y={H - b}
            height={b}
            fill={p.color}
            initial={{ scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: delay + k * 0.045, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
          />
        ))}
        <line x1="0" y1={H - 0.5} x2={W} y2={H - 0.5} stroke="rgba(238,233,220,0.3)" />
      </svg>
    );
  }

  if (p.kind === "line" || p.kind === "area") {
    const pts: number[][] = [];
    let v = p.kind === "line" ? 74 : 8;
    for (let k = 0; k <= 16; k++) {
      v += (p.kind === "line" ? -3.1 : 4.4) + (r() - 0.5) * 9;
      pts.push([4 + (k * (W - 10)) / 16, Math.max(8, Math.min(H - 8, v))]);
    }
    const d = pts.map((pt, k) => `${k ? "L" : "M"}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(" ");
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" y1={H * g} x2={W} y2={H * g} stroke="rgba(238,233,220,0.1)" strokeDasharray="2 5" />
        ))}
        {p.kind === "area" && (
          <motion.path d={`${d} L${W - 6},${H} L4,${H} Z`} fill={p.color} initial={{ opacity: 0 }} whileInView={{ opacity: 0.22 }} viewport={{ once: true }} transition={{ duration: 1, delay: delay + 0.4 }} />
        )}
        <motion.path d={d} fill="none" stroke={p.color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" {...common} />
        <motion.circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3.6" fill={p.color} initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: delay + 1.1, type: "spring", stiffness: 320 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      </svg>
    );
  }

  if (p.kind === "dots") {
    const dots = Array.from({ length: 46 }, () => [6 + r() * (W - 12), 8 + r() * (H - 16), 1.6 + r() * 3.4]);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
        {dots.map((d, k) => (
          <motion.circle
            key={k}
            cx={d[0]}
            cy={d[1]}
            r={d[2]}
            fill={p.color}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.85, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: delay + k * 0.012 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
      </svg>
    );
  }

  if (p.kind === "steps") {
    const ys = [14, 28, 40, 58, 74, 90].map((y) => H - y);
    let d = `M4,${ys[0]}`;
    ys.forEach((y, k) => {
      const x0 = 4 + (k * (W - 10)) / 6;
      const x1 = 4 + ((k + 1) * (W - 10)) / 6;
      d += ` L${x1.toFixed(1)},${y.toFixed(1)} L${x1.toFixed(1)},${ys[Math.min(k + 1, 5)].toFixed(1)}`;
      void x0;
    });
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
        <motion.path d={d} fill="none" stroke={p.color} strokeWidth="2.6" strokeLinejoin="miter" {...common} />
        {ys.map((y, k) => (
          <motion.rect key={k} x={4 + (k * (W - 10)) / 6 - 2} y={y - 2} width="4" height="4" fill="#0e0e12" stroke={p.color} strokeWidth="1.4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: delay + 0.2 + k * 0.08 }} />
        ))}
      </svg>
    );
  }

  if (p.kind === "donut") {
    const segs = [0.44, 0.23, 0.18, 0.15];
    const C = 2 * Math.PI * 34;
    let acc = 0;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
        <g transform={`translate(${W / 2}, ${H / 2}) rotate(-90)`}>
          {segs.map((s, k) => {
            const el = (
              <motion.circle
                key={k}
                r="34"
                fill="none"
                stroke={k === 0 ? p.color : "rgba(238,233,220,0.28)"}
                strokeWidth={k === 0 ? 15 : 11}
                strokeDasharray={`${(s * C).toFixed(1)} ${C.toFixed(1)}`}
                strokeDashoffset={-acc * C}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: delay + k * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            );
            acc += s;
            return el;
          })}
        </g>
        <text x={W / 2} y={H / 2 + 4} textAnchor="middle" fontSize="13" fill="#eee9dc" fontFamily="Anton, sans-serif">
          44%
        </text>
      </svg>
    );
  }

  if (p.kind === "heat") {
    const cells: number[] = Array.from({ length: 7 * 12 }, () => r());
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
        {cells.map((c, k) => {
          const col = k % 12;
          const row = Math.floor(k / 12);
          return (
            <motion.rect
              key={k}
              x={4 + col * 17.6}
              y={6 + row * 13.4}
              width="15"
              height="11"
              fill={p.color}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.08 + c * 0.9 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.35, delay: delay + (col + row) * 0.022 }}
            />
          );
        })}
      </svg>
    );
  }

  if (p.kind === "stack") {
    const cols = 9;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
        {Array.from({ length: cols }).map((_, k) => {
          const a = 18 + r() * 22;
          const b = 14 + r() * 20;
          const c = H - 8 - a - b;
          const x = 6 + k * 23.4;
          return (
            <g key={k}>
              <motion.rect x={x} y={H - 8 - a} width="16" height={a} fill={p.color} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay + k * 0.05 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }} />
              <motion.rect x={x} y={H - 8 - a - b} width="16" height={b} fill="rgba(238,233,220,0.5)" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay + 0.1 + k * 0.05 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }} />
              <motion.rect x={x} y={8} width="16" height={Math.max(2, c)} fill="rgba(238,233,220,0.2)" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: delay + 0.2 + k * 0.05 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }} />
            </g>
          );
        })}
        <line x1="0" y1={H - 8} x2={W} y2={H - 8} stroke="rgba(238,233,220,0.3)" />
      </svg>
    );
  }

  // slope chart
  const names = ["VENICE", "PARIS", "LONDON", "AMST."];
  const left = [8, 30, 62, 46];
  const right = [40, 14, 20, 74];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
      <line x1="42" y1="6" x2="42" y2={H - 6} stroke="rgba(238,233,220,0.25)" />
      <line x1={W - 46} y1="6" x2={W - 46} y2={H - 6} stroke="rgba(238,233,220,0.25)" />
      {names.map((n, k) => (
        <g key={n}>
          <motion.line
            x1="42"
            y1={left[k]}
            x2={W - 46}
            y2={right[k]}
            stroke={k === 2 || k === 0 ? p.color : "rgba(238,233,220,0.4)"}
            strokeWidth={k === 2 || k === 0 ? 2.6 : 1.4}
            {...common}
          />
          <text x="36" y={left[k] + 3.5} textAnchor="end" fontSize="8" fill="rgba(238,233,220,0.7)" fontFamily="IBM Plex Mono, monospace">
            {n}
          </text>
          <text x={W - 40} y={right[k] + 3.5} fontSize="8" fill="rgba(238,233,220,0.7)" fontFamily="IBM Plex Mono, monospace">
            {n}
          </text>
        </g>
      ))}
    </svg>
  );
}


