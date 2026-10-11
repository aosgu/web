import { motion, useTransform, type MotionValue } from "framer-motion";
import { StickyScene, useBump, useRamp, useRange, Count, clamp01 } from "@/lib/scroll";
import { NUMBERS } from "@/data/content";

const START = 0.06;
const END = 0.96;
const seg = (END - START) / NUMBERS.length;

export default function Numbers() {
  return (
    <StickyScene id="numbers" vh={340}>
      {(p) => (
        <div className="relative h-full w-full overflow-hidden bg-yolk text-ink">
          <div className="absolute inset-0 text-ink/[0.07] halftone-lg" />
          <Burst p={p} />
          <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 origin-top-right rotate-45 bg-ink" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-[46%] bg-ink" />
          <div className="scene-pad absolute inset-x-0 top-[64px] z-30 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="block h-[3px] w-16 bg-ink" />
                <span className="font-mono text-[10px] font-semibold tracking-[0.34em] text-ink/70 uppercase">
                  Scene 10 — The numbers
                </span>
              </div>
              <h2 className="mt-2 font-display text-[clamp(1.8rem,4.4vw,3.4rem)] leading-[0.9] uppercase">
                Five figures worth memorising
              </h2>
            </div>
            <Counter p={p} />
          </div>
          {NUMBERS.map((n, i) => (
            <Slam key={n.label} n={n} p={p} i={i} />
          ))}
          <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
            {NUMBERS.map((n, i) => (
              <Pip key={n.label} i={i} p={p} />
            ))}
          </div>
        </div>
      )}
    </StickyScene>
  );
}

function Burst({ p }: { p: MotionValue<number> }) {
  const rot = useRange(p, -8, 26, 0, 1);
  return (
    <motion.svg
      viewBox="-300 -300 600 600"
      className="pointer-events-none absolute top-1/2 left-1/2 h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.14]"
      style={{ rotate: rot }}
    >
      {Array.from({ length: 36 }).map((_, i) => (
        <line
          key={i}
          x1="0"
          y1="0"
          x2="0"
          y2="-300"
          stroke="#0b0b0d"
          strokeWidth={i % 3 === 0 ? 5 : 1.6}
          transform={`rotate(${i * 10})`}
        />
      ))}
      <circle r="120" fill="none" stroke="#0b0b0d" strokeWidth="2" />
      <circle r="210" fill="none" stroke="#0b0b0d" strokeWidth="1" strokeDasharray="6 8" />
    </motion.svg>
  );
}

function Slam({ n, p, i }: { n: (typeof NUMBERS)[number]; p: MotionValue<number>; i: number }) {
  const a = START + i * seg;
  const b = a + seg;
  const o = useBump(p, a, b, seg * 0.28);
  const slam = useRamp(p, a, a + seg * 0.3);
  const count = useRamp(p, a + seg * 0.05, a + seg * 0.5);
  const value = useTransform(count, (v) => n.value * clamp01(v));

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center px-[clamp(1rem,5vw,5rem)]"
      style={{ opacity: o }}
    >
      <div className="flex max-w-[min(58rem,92vw)] flex-col items-start gap-1">
        <motion.div
          className="flex items-end gap-3"
          style={{
            scale: useRange(slam, 1.9, 1),
            rotate: useRange(slam, i % 2 ? -3.5 : 3.5, i % 2 ? -1 : 1),
            y: useRange(slam, -40, 0),
          }}
        >
          <span className="bg-ink px-3 py-1 font-display text-[clamp(3.6rem,15vw,12rem)] leading-[0.78] text-yolk tabular-nums">
            <Count value={value} decimals={n.decimals} />
          </span>
          <span className="mb-2 font-display text-[clamp(1.6rem,5vw,4rem)] leading-none text-ink">
            {n.suffix}
          </span>
        </motion.div>
        <motion.div
          className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1"
          style={{ opacity: useRange(slam, 0, 1, 0.4, 1) }}
        >
          <span className="font-display text-[clamp(1rem,2.4vw,1.7rem)] tracking-[0.02em] text-ink uppercase">
            {n.label}
          </span>
          <span className="h-[2px] w-10 bg-ink/40" />
          <span className="font-mono text-[10.5px] tracking-[0.16em] text-ink/60 uppercase">{n.note}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Pip({ i, p }: { i: number; p: MotionValue<number> }) {
  const a = START + i * seg;
  const on = useTransform(p, (v) => (v >= a && v < a + seg ? 1 : v >= a + seg ? 0.4 : 0.15));
  return (
    <motion.span
      className="block h-[3px] bg-ink"
      style={{ width: 34, opacity: on, scaleY: useTransform(on, (v) => (v > 0.9 ? 2.2 : 1)) }}
    />
  );
}

function Counter({ p }: { p: MotionValue<number> }) {
  const idx = useTransform(p, (v) => Math.min(NUMBERS.length, Math.max(1, Math.ceil((v - START) / seg))));
  return (
    <div className="border-2 border-ink px-3 py-2 text-right">
      <div className="font-mono text-[9px] tracking-[0.26em] text-ink/55">FIGURE</div>
      <motion.div className="font-display text-[30px] leading-none tabular-nums">
        <Count value={idx} />
        <span className="text-ink/40">/{NUMBERS.length}</span>
      </motion.div>
    </div>
  );
}
