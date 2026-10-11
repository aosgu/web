import { motion, useTransform, type MotionValue } from "framer-motion";
import { StickyScene, useRamp, useRange } from "@/lib/scroll";
import { COLLAGE } from "@/data/content";
import { ChapterCard } from "@/components/Chrome";

const SCRAPS = [
  { t: "PLATE 88\nUNFILED", x: 74, y: 12, rot: 6 },
  { t: "SEE ALSO:\nFOLIO 212", x: 8, y: 44, rot: -5 },
  { t: "CROP LATER", x: 82, y: 72, rot: -3 },
];

export default function Collage() {
  return (
    <StickyScene id="collage" vh={320}>
      {(p) => (
        <div className="relative h-full w-full overflow-hidden bg-[#131318]">
          <div className="absolute inset-0 text-paper/[0.05] halftone" />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(60% 50% at 70% 30%, rgba(234,59,36,0.16), transparent 70%)" }}
          />
          <BigWord p={p} />
          <div className="scene-pad absolute inset-x-0 top-[64px] z-30">
            <ChapterCard n="08" kicker="The collage" title="Everything, at once" />
          </div>
          <Scatter p={p} />
          {SCRAPS.map((s, i) => (
            <Scrap key={i} s={s} p={p} i={i} />
          ))}
          <motion.div
            className="absolute bottom-6 left-[clamp(1rem,4vw,4rem)] z-30 max-w-[26rem] border-l-[3px] border-yolk pl-3 font-serif text-[13px] leading-relaxed text-paper/70"
            style={{ opacity: useRamp(p, 0.5, 0.6) }}
          >
            The board is not a metaphor. Every explainer ends up here: six pictures that cannot
            be in the same frame, pinned until one of them explains the other five.
          </motion.div>
        </div>
      )}
    </StickyScene>
  );
}

function BigWord({ p }: { p: MotionValue<number> }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 grid place-items-center"
      style={{ y: useRange(p, 60, -80, 0, 1), scale: useRange(p, 1.1, 1.3, 0, 1) }}
    >
      <div className="text-center font-display text-[clamp(4rem,19vw,17rem)] leading-[0.78] tracking-[-0.02em] text-paper/[0.055] uppercase">
        contact
        <br />
        sheet
      </div>
    </motion.div>
  );
}

function Scatter({ p }: { p: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 z-10">
      {COLLAGE.map((c, i) => (
        <Print key={c.tag} c={c} p={p} i={i} />
      ))}
    </div>
  );
}

function Print({ c, p, i }: { c: (typeof COLLAGE)[number]; p: MotionValue<number>; i: number }) {
  const s = 0.08 + i * 0.075;
  const e = s + 0.2;
  const enter = useRamp(p, s, e);
  const dx0 = (50 - c.x) * 9;
  const dy0 = (52 - c.y) * 6;
  const drift = (i % 2 === 0 ? -1 : 1) * (18 + i * 9);

  return (
    <motion.figure
      className="group absolute bg-paper p-[6px] pb-[26px] shadow-[0_18px_44px_rgba(0,0,0,0.55)] transition-shadow duration-300 hover:shadow-[0_28px_60px_rgba(0,0,0,0.7)]"
      style={{
        left: `${c.x}%`,
        top: `${c.y}%`,
        width: `${c.w}%`,
        zIndex: c.z,
        opacity: enter,
        x: useTransform(p, [s, e, 1], [dx0, 0, drift * 0.4]),
        y: useTransform(p, [s, e, 1], [dy0, 0, drift]),
        rotate: useTransform(p, [s, e, 1], [c.rot * 3.5, c.rot, c.rot * 1.25]),
        scale: useTransform(p, [s, e, 1], [0.86, 1, 1.03]),
      }}
    >
      <span className="tape absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2" />
      <div className="group relative aspect-[4/3] overflow-hidden bg-ink">
        <img src={c.src} alt={c.cap} loading="lazy" className="kb h-full w-full object-cover duotone" />
        <span className="mix-yolk absolute inset-0 bg-yolk opacity-[0.18]" />
        <span className="halftone absolute inset-0 text-ink/25" />
        <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
        <span className="absolute top-1.5 left-1.5 bg-ink px-1.5 py-[2px] font-mono text-[8.5px] tracking-[0.2em] text-yolk">
          {c.tag}
        </span>
      </div>
      <figcaption className="absolute bottom-[7px] left-[7px] font-mono text-[9px] tracking-[0.18em] text-ink/70">
        {c.cap}
      </figcaption>
    </motion.figure>
  );
}

function Scrap({ s, p, i }: { s: (typeof SCRAPS)[number]; p: MotionValue<number>; i: number }) {
  const t = useRamp(p, 0.44 + i * 0.08, 0.58 + i * 0.08);
  return (
    <motion.div
      className="absolute z-20 border border-ink/20 bg-yolk px-3 py-2 font-mono text-[9.5px] leading-[1.4] tracking-[0.08em] whitespace-pre-line text-ink shadow-[4px_5px_0_rgba(11,11,13,0.45)]"
      style={{
        left: `${s.x}%`,
        top: `${s.y}%`,
        rotate: s.rot,
        opacity: t,
        scale: useRange(t, 0.7, 1),
      }}
    >
      {s.t}
    </motion.div>
  );
}
