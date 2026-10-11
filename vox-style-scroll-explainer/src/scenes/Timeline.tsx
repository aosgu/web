import { motion, useTransform, type MotionValue } from "framer-motion";
import { StickyScene, useRamp, useRange } from "@/lib/scroll";
import { EVENTS } from "@/data/content";
import { ChapterCard } from "@/components/Chrome";

const PLAYHEAD = 0.3; // fraction of the viewport where the head sits
const TRACK = 2.6; // track width in viewport units
const PAN_A = 0.4773;
const PAN_B = 2.9545;

/** progress at which a track position reaches the playhead */
const activation = (q: number) => (TRACK * q + PAN_A - PLAYHEAD) / PAN_B;

export default function Timeline() {
  return (
    <StickyScene id="timeline" vh={360}>
      {(p) => (
        <div className="relative h-full w-full overflow-hidden bg-[#0c1020]">
          <div className="absolute inset-0 text-paper/[0.05] halftone" />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(65% 55% at 30% 50%, rgba(43,72,216,0.28), transparent 70%)" }}
          />
          <div className="scene-pad absolute inset-x-0 top-[64px] z-30">
            <ChapterCard n="09" kicker="The timeline" title="Then, and then, and then" />
          </div>
          <Ruler p={p} />
          <div className="absolute bottom-6 left-[clamp(1rem,4vw,4rem)] z-30 font-mono text-[9.5px] tracking-[0.22em] text-paper/40">
            SEQUENCE, NOT TO SCALE · SEVEN MARKERS · 105 → 1803
          </div>
        </div>
      )}
    </StickyScene>
  );
}

function Ruler({ p }: { p: MotionValue<number> }) {
  const inP = useRamp(p, 0, 0.08);
  return (
    <motion.div className="absolute inset-0 z-10 overflow-hidden" style={{ opacity: inP }}>
      {/* the moving track */}
      <motion.div
        className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2"
        style={{ width: `${TRACK * 100}%`, x: useTransform(p, (v) => `${((PAN_A - PAN_B * v) / TRACK) * 100}%`) }}
      >
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-paper/25" />
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between">
          {Array.from({ length: 105 }).map((_, i) => (
            <span key={i} className={`block w-[1px] ${i % 5 === 0 ? "h-3 bg-paper/35" : "h-[6px] bg-paper/18"}`} />
          ))}
        </div>
        {EVENTS.map((e, i) => (
          <Event key={e.year} e={e} p={p} i={i} />
        ))}
      </motion.div>

      {/* fixed playhead */}
      <div className="pointer-events-none absolute inset-y-0 z-20" style={{ left: `${PLAYHEAD * 100}%` }}>
        <div className="relative h-full w-[2px] bg-yolk">
          <span className="absolute top-1/2 -left-[7px] h-4 w-4 -translate-y-1/2 rotate-45 border-2 border-yolk bg-ink" />
          <motion.span
            className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yolk/40"
            animate={{ scale: [0.7, 1.25], opacity: [0.7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
        </div>
        <div className="absolute top-[calc(50%-72px)] left-1/2 -translate-x-1/2">
          <NowYear p={p} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-[2px] bg-gradient-to-r from-[#0c1020] via-transparent to-[#0c1020]" />
    </motion.div>
  );
}

function NowYear({ p }: { p: MotionValue<number> }) {
  const idx = useTransform(p, (v) => {
    let best = 0;
    EVENTS.forEach((e, i) => {
      if (v >= activation(e.pos) - 0.02) best = i;
    });
    return best;
  });
  const label = useTransform(idx, (i) => EVENTS[i].year);
  const color = useTransform(idx, (i) => EVENTS[i].color);
  return (
    <div className="border border-paper/20 bg-ink px-3 py-1 text-center">
      <div className="font-mono text-[8px] tracking-[0.3em] text-paper/45">NOW</div>
      <motion.div className="font-display text-[26px] leading-none" style={{ color }}>
        {label}
      </motion.div>
    </div>
  );
}

function Event({ e, p, i }: { e: (typeof EVENTS)[number]; p: MotionValue<number>; i: number }) {
  const act = activation(e.pos);
  const t = useRamp(p, act, act + 0.05);
  const passed = useTransform(p, (v) => (v > act + 0.05 ? 0.55 : 1));
  const active = useTransform(p, (v) => (Math.abs(v - act) < 0.045 ? 1 : 0));
  const cardO = useTransform(p, (v) => {
    if (v < act) return 0;
    return Math.min(1, (v - act) / 0.05) * (v > act + 0.05 ? 0.66 : 1);
  });
  const up = e.up;

  return (
    <div className="absolute top-0" style={{ left: `${e.pos * 100}%` }}>
      {/* stem */}
      <motion.div
        className="absolute left-1/2 w-[2px] -translate-x-1/2"
        style={{
          height: 54,
          top: up ? -54 : 0,
          backgroundColor: e.color,
          scaleY: t,
          transformOrigin: up ? "bottom" : "top",
          opacity: 0.7,
        }}
      />
      {/* dot on the ruler */}
      <motion.span
        className="absolute top-1/2 left-1/2 block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2"
        style={{ backgroundColor: useTransform(active, (a) => (a > 0.5 ? e.color : "#0c1020")), borderColor: e.color, scale: useRange(t, 0, 1), opacity: passed }}
      />

      {/* card */}
      <motion.div
        className="absolute w-[186px] border-[2.5px] border-ink bg-paper p-2.5 text-ink shadow-[5px_6px_0_rgba(11,11,13,0.5)]"
        style={{
          left: -93,
          bottom: up ? 58 : undefined,
          top: up ? undefined : 58,
          opacity: cardO,
          y: useRange(t, up ? 26 : -26, 0),
          rotate: useRange(t, up ? 3 : -3, i % 2 ? 0.8 : -0.8),
          scale: useRange(t, 0.9, 1),
        }}
      >
        <span className="absolute -top-[11px] left-3 h-[10px] w-[46px] tape" />
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[26px] leading-none" style={{ color: e.color === "#ffd400" ? "#b58900" : e.color }}>
            {e.year}
          </span>
          <span className="font-mono text-[8px] tracking-[0.2em] text-ink/45">MARKER {String(i + 1).padStart(2, "0")}</span>
        </div>
        <div className="mt-1 font-sans text-[11.5px] leading-tight font-extrabold tracking-[0.04em] uppercase">
          {e.title}
        </div>
        <p className="mt-1 font-serif text-[11.5px] leading-[1.45] text-ink/70">{e.body}</p>
      </motion.div>
    </div>
  );
}
