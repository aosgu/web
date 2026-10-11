import { useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { StickyScene, useBump, useRamp, useRange, Count, lerp, clamp01 } from "@/lib/scroll";
import { BARS, BAR_STAGES } from "@/data/content";
import { ChapterCard } from "@/components/Chrome";

const PITCH = 52;
const MAX = 30;
const STAGE_NOTES = [
  "Two regions hold almost everything. Europe is a rounding error.",
  "Nothing moves. This is the century the numbers forget.",
  "The western edge starts to compound: mills, contracts, ledgers.",
  "Compounding shows up as a straight line for about eighty years.",
  "The crossover. Nobody at the top of this chart in 1000 is here now.",
];

const valAt = (vals: number[], f: number) => {
  const i = Math.min(Math.floor(f), vals.length - 2);
  return lerp(vals[i], vals[i + 1], clamp01(f - i));
};

export default function BarRace() {
  return (
    <StickyScene id="bars" vh={380}>
      {(p) => (
        <div className="relative h-full w-full overflow-hidden bg-[#e6e2d6] text-ink">
          <div className="absolute inset-0 text-ink/[0.055] halftone" />
          <div className="absolute -top-24 -right-24 h-[420px] w-[420px] rotate-12 bg-yolk/25" />
          <Stage p={p} />
        </div>
      )}
    </StickyScene>
  );
}

function Stage({ p }: { p: MotionValue<number> }) {
  const stageF = useTransform(p, (v) => clamp01((v - 0.14) / 0.66) * (BAR_STAGES.length - 1));
  const [stage, setStage] = useState(0);
  useMotionValueEvent(stageF, "change", (v) => {
    const s = Math.min(BAR_STAGES.length - 1, Math.round(v));
    setStage((prev) => (prev === s ? prev : s));
  });

  const order = useMemo(() => {
    return BARS.map((b, i) => ({ i, v: b.values[stage] }))
      .sort((a, b) => b.v - a.v)
      .map((o) => o.i);
  }, [stage]);

  const inP = useRamp(p, 0.0, 0.08);

  return (
    <div className="scene-pad relative z-10 grid h-full grid-cols-1 items-center gap-6 pt-[70px] pb-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      {/* ---- left: title + stage readout ---- */}
      <motion.div style={{ opacity: inP }} className="max-w-[34rem]">
        <ChapterCard n="04" kicker="The race" title="Who was producing what" tone="light" />
        <p className="mt-4 max-w-[42ch] font-serif text-[15px] leading-[1.65] text-ink/75">
          Estimated share of world output, five snapshots across eight centuries. The bars move
          continuously; the ranking only changes when one region overtakes another.
        </p>

        <div className="mt-7 flex items-end gap-5">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={stage}
              initial={{ y: 34, opacity: 0, rotate: -2 }}
              animate={{ y: 0, opacity: 1, rotate: -1.5 }}
              exit={{ y: -34, opacity: 0, rotate: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-ink px-4 py-2 font-display text-[clamp(2.4rem,6vw,4.2rem)] leading-none text-yolk"
            >
              {BAR_STAGES[stage]}
            </motion.div>
          </AnimatePresence>
          <div className="mb-2 font-mono text-[10px] leading-relaxed tracking-[0.2em] text-ink/50">
            SNAPSHOT
            <br />
            {String(stage + 1).padStart(2, "0")} / {String(BAR_STAGES.length).padStart(2, "0")}
          </div>
        </div>

        <div className="relative mt-5 h-[64px]">
          {STAGE_NOTES.map((n, i) => (
            <NoteLine key={i} n={n} p={p} i={i} />
          ))}
        </div>
      </motion.div>

      {/* ---- right: the chart ---- */}
      <motion.div
        className="relative origin-top scale-[0.82] border-[3px] border-ink bg-paper p-4 paper-shadow sm:scale-90 lg:scale-100"
        style={{ opacity: inP, y: useRange(inP, 26, 0) }}
      >
        <div className="mb-3 flex items-baseline justify-between border-b-2 border-ink pb-2">
          <span className="font-display text-lg tracking-wide uppercase">Share of world output</span>
          <span className="font-mono text-[9.5px] tracking-[0.2em] text-ink/55">PER CENT · EST.</span>
        </div>

        <div className="relative" style={{ height: PITCH * BARS.length }}>
          {/* gridlines */}
          <div className="pointer-events-none absolute inset-0 ml-[190px]">
            {[10, 20, 30].map((g) => (
              <div key={g} className="absolute inset-y-0" style={{ left: `${(g / MAX) * 100}%` }}>
                <span className="block h-full border-l border-dashed border-ink/20" />
                <span className="absolute -bottom-5 -left-3 font-mono text-[9px] text-ink/45">{g}</span>
              </div>
            ))}
          </div>

          {BARS.map((b, i) => (
            <Row key={b.name} item={b} index={i} rank={order.indexOf(i)} p={p} stageF={stageF} />
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between font-mono text-[9px] tracking-[0.18em] text-ink/45">
          <span>SOURCE: A COMPOSITE OF THREE ESTIMATES, ARGUED ABOUT EVER SINCE</span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 animate-blink rounded-full bg-flare" />
            LIVE
          </span>
        </div>

        <Callout p={p} />
      </motion.div>
    </div>
  );
}

function Row({
  item,
  rank,
  p,
  stageF,
}: {
  item: (typeof BARS)[number];
  index: number;
  rank: number;
  p: MotionValue<number>;
  stageF: MotionValue<number>;
}) {
  const v = useTransform(stageF, (f) => valAt(item.values, f));
  const w = useTransform(v, (x) => `${Math.max(1.5, (x / MAX) * 100)}%`);
  const enter = useRamp(p, 0.02 + rank * 0.004, 0.12);

  return (
    <motion.div
      className="absolute inset-x-0 grid grid-cols-[26px_160px_minmax(0,1fr)] items-center gap-2"
      style={{ height: PITCH - 8, opacity: enter }}
      animate={{ y: rank * PITCH }}
      transition={{ y: { type: "spring", stiffness: 190, damping: 24, mass: 0.7 } }}
    >
      <span className="font-display text-[22px] leading-none text-ink/35 tabular-nums">{rank + 1}</span>
      <span className="truncate font-sans text-[11.5px] font-extrabold tracking-[0.06em] text-ink uppercase">
        {item.name}
      </span>
      <div className="relative h-[30px] w-full bg-ink/[0.06]">
        <motion.div
          className="absolute inset-y-0 left-0 border-r-[3px] border-ink"
          style={{ backgroundColor: item.color, width: w }}
        >
          <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.35),transparent_55%)]" />
        </motion.div>
        <motion.span
          className="absolute top-1/2 ml-2 -translate-y-1/2 bg-ink px-1.5 py-[2px] font-mono text-[10px] font-semibold text-paper tabular-nums"
          style={{ left: w }}
        >
          <Count value={v} decimals={1} />
        </motion.span>
      </div>
    </motion.div>
  );
}

function NoteLine({ n, p, i }: { n: string; p: MotionValue<number>; i: number }) {
  const seg = 1 / STAGE_NOTES.length;
  const o = useBump(p, 0.14 + i * seg * 0.66, 0.14 + (i + 1) * seg * 0.66, 0.03);
  return (
    <motion.div
      className="absolute inset-x-0 top-0 flex gap-2 border-l-[3px] border-flare pl-3 font-mono text-[11px] leading-[1.5] tracking-[0.06em] text-ink/75 uppercase"
      style={{ opacity: o, y: useRange(o, 10, 0) }}
    >
      <span className="text-flare">▸</span>
      {n}
    </motion.div>
  );
}

function Callout({ p }: { p: MotionValue<number> }) {
  const t = useRamp(p, 0.72, 0.84);
  return (
    <motion.div
      className="pointer-events-none absolute -top-4 -left-6 hidden items-center gap-2 lg:flex"
      style={{ opacity: t, rotate: -6, scale: useRange(t, 0.8, 1) }}
    >
      <span className="border-[3px] border-ink bg-flare px-3 py-1 font-display text-sm tracking-wide text-paper uppercase">
        the crossover
      </span>
      <svg width="70" height="46" viewBox="0 0 70 46" fill="none">
        <motion.path
          d="M4 6 C26 4 44 18 52 34 C56 41 62 43 66 41"
          stroke="#0b0b0d"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ pathLength: t }}
        />
        <motion.path d="M66 41 L54 38 M66 41 L60 30" stroke="#0b0b0d" strokeWidth="3" strokeLinecap="round" style={{ opacity: t }} />
      </svg>
    </motion.div>
  );
}
