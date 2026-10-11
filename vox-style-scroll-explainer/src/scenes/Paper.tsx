import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { StickyScene, useRamp, useRange } from "@/lib/scroll";
import { DOC_NOTES, DOC_PARAS } from "@/data/content";
import { ChapterCard } from "@/components/Chrome";

const MARKS: Record<string, { from: number; to: number; color: string }> = {
  "hl-a": { from: 0.12, to: 0.24, color: "#ffd400" },
  "hl-b": { from: 0.36, to: 0.48, color: "#ffd400" },
  "hl-c": { from: 0.58, to: 0.7, color: "#7ad0e6" },
};

export default function Paper() {
  return (
    <StickyScene id="doc" vh={420}>
      {(p) => (
        <div className="relative h-full w-full overflow-hidden bg-[#101013]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 55% at 50% 38%, rgba(255,238,200,0.16), transparent 70%)",
            }}
          />
          <div className="absolute inset-0 text-paper/[0.05] halftone" />
          <div className="scene-pad absolute inset-0 z-30 grid grid-cols-1 items-center gap-5 pt-[66px] pb-6 lg:grid-cols-[minmax(0,0.66fr)_minmax(0,1.34fr)]">
            <div className="pointer-events-none hidden lg:block">
              <ChapterCard n="03" kicker="The document" title="The sentence that carries the argument" />
              <div className="mt-5 max-w-[30ch] border-l-[3px] border-flare pl-3 font-serif text-[13.5px] leading-[1.6] text-paper/70">
                Nothing here moves except the reading. Scroll and the page is marked up the way a
                producer marks up a script: one yellow swipe per idea that has to survive the cut.
              </div>
              <div className="mt-4 flex flex-wrap gap-2 font-mono text-[9px] tracking-[0.2em] text-paper/45 uppercase">
                <span className="border border-paper/20 px-2 py-1">3 highlights</span>
                <span className="border border-paper/20 px-2 py-1">3 margin notes</span>
                <span className="border border-paper/20 px-2 py-1">1 circled number</span>
                <span className="border border-flare/50 px-2 py-1 text-flare">1 stamp</span>
              </div>
            </div>
            <div className="relative h-full min-h-0 overflow-hidden">
              <Desk p={p} />
            </div>
          </div>
          <div className="absolute bottom-6 left-[clamp(1rem,4vw,4rem)] z-40 font-mono text-[9.5px] tracking-[0.24em] text-paper/40">
            FIG. 3 — ANNOTATED COPY, READING ROOM · FOLIO 212
          </div>
        </div>
      )}
    </StickyScene>
  );
}

function Desk({ p }: { p: MotionValue<number> }) {
  const camY = useTransform(p, [0.02, 0.26, 0.5, 0.74, 0.96], [0, -70, -150, -235, -300]);
  const camS = useTransform(p, [0.02, 0.3, 0.7, 0.98], [0.94, 1, 1.05, 1.1]);
  const inP = useRamp(p, 0.0, 0.06);
  const markerY = useRange(p, 12, 88, 0.08, 0.76);

  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden">
      {/* sheets behind */}
      <motion.div
        className="absolute h-[132%] w-[min(46rem,88vw)] rotate-[-2.2deg] bg-paper-dim/70 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        style={{ opacity: inP }}
      />
      <motion.div
        className="absolute h-[130%] w-[min(46rem,88vw)] rotate-[1.6deg] bg-paper/85"
        style={{ opacity: inP }}
      />

      <motion.div
        className="relative h-[128%] w-[min(46rem,88vw)] bg-paper text-ink shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
        style={{ y: camY, scale: camS, opacity: inP }}
      >
        <div className="paper-layer pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply" />
        <div className="pointer-events-none absolute -top-6 -left-10 h-40 w-40 rounded-full border-[9px] border-[#8a6a3c]/25 blur-[1px]" />
        <div className="pointer-events-none absolute top-[9%] -right-[2px] h-[82%] w-[3px] bg-ink/15">
          <motion.div
            className="absolute -left-[13px] h-[26px] w-[26px] -rotate-[35deg] bg-yolk shadow-[2px_3px_0_rgba(11,11,13,0.5)]"
            style={{ top: useTransform(markerY, (v) => `${v}%`) }}
          >
            <span className="absolute -top-1 left-1/2 h-3 w-[2px] -translate-x-1/2 bg-ink/60" />
          </motion.div>
        </div>

        <div className="relative h-full w-full px-[13%] py-[9%]">
          <div className="flex items-baseline justify-between border-b border-ink/25 pb-2 font-mono text-[9.5px] tracking-[0.26em] text-ink/55 uppercase">
            <span>Translation · vol. iv</span>
            <span>Folio 212 · recto</span>
          </div>

          <h3 className="mt-5 font-serif text-[clamp(1.5rem,2.6vw,2.15rem)] leading-[1.05] font-bold text-ink">
            On the conveyance of a craft, being an account of the years 751 to 1400
          </h3>
          <div className="mt-2 font-mono text-[10px] tracking-[0.2em] text-ink/45 uppercase">
            Anonymous · copied three times · one copy survives
          </div>

          <div className="mt-7 space-y-6 font-serif text-[clamp(0.95rem,1.35vw,1.08rem)] leading-[1.72] text-ink/88">
            {DOC_PARAS.map((para, i) => (
              <p key={i}>
                {para.text.map((seg, j) => {
                  if (typeof seg === "string") return <span key={j}>{seg}</span>;
                  const m = MARKS[seg.hl];
                  return <Mark key={j} p={p} cfg={m}>
                    {seg.t}
                  </Mark>;
                })}
              </p>
            ))}
          </div>

          <div className="mt-8 flex items-end justify-between border-t border-ink/20 pt-3">
            <CircleNumber p={p} />
            <div className="font-mono text-[9.5px] tracking-[0.22em] text-ink/45">— 212 —</div>
          </div>

          {DOC_NOTES.map((n, i) => (
            <MarginNote key={i} n={n} p={p} i={i} />
          ))}

          <Stamp p={p} />
          <Paperclip />
        </div>
      </motion.div>
    </div>
  );
}

function Mark({
  p,
  cfg,
  children,
}: {
  p: MotionValue<number>;
  cfg: { from: number; to: number; color: string };
  children: ReactNode;
}) {
  const t = useRamp(p, cfg.from, cfg.to);
  return (
    <span className="relative inline">
      <motion.span
        aria-hidden
        className="absolute -inset-x-[3px] -inset-y-[2px] -z-0 -skew-x-[9deg] mix-blend-multiply"
        style={{ backgroundColor: cfg.color, scaleX: t, transformOrigin: "left center", opacity: 0.82 }}
      />
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}

function CircleNumber({ p }: { p: MotionValue<number> }) {
  const t = useRamp(p, 0.46, 0.56);
  return (
    <div className="relative inline-flex items-center gap-3">
      <span className="relative inline-block">
        <span className="font-serif text-[1.6rem] leading-none font-bold text-ink">600 years</span>
        <svg viewBox="0 0 220 66" preserveAspectRatio="none" className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+16px)] w-[calc(100%+24px)]">
          <motion.path
            d="M112,10 C170,6 212,18 210,34 C208,52 150,60 96,58 C42,56 6,46 8,30 C10,16 58,8 116,10 C150,11 178,16 190,22"
            fill="none"
            stroke="#ea3b24"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ pathLength: t }}
          />
        </svg>
      </span>
      <motion.span
        className="font-mono text-[10px] leading-tight tracking-[0.14em] text-flare uppercase"
        style={{ opacity: useRange(t, 0, 1, 0.5, 1) }}
      >
        ← the number
        <br />
        nobody checks
      </motion.span>
    </div>
  );
}

function MarginNote({ n, p, i }: { n: (typeof DOC_NOTES)[number]; p: MotionValue<number>; i: number }) {
  const t = useRamp(p, n.at, n.at + 0.07);
  return (
    <motion.div
      className="absolute max-w-[11rem] border border-ink/20 bg-yolk px-2.5 py-1.5 font-mono text-[9.5px] leading-[1.45] tracking-[0.06em] whitespace-pre-line text-ink shadow-[3px_4px_0_rgba(11,11,13,0.35)]"
      style={{
        left: `${n.x}%`,
        top: `${n.y}%`,
        rotate: i === 2 ? -3.5 : 2.5,
        opacity: t,
        scale: useRange(t, 0.7, 1),
        y: useRange(t, 12, 0),
      }}
    >
      {n.text}
    </motion.div>
  );
}

function Stamp({ p }: { p: MotionValue<number> }) {
  const t = useRamp(p, 0.8, 0.87);
  return (
    <motion.div
      className="pointer-events-none absolute right-[6%] bottom-[13%] grid h-[124px] w-[124px] place-items-center rounded-full border-[3px] border-flare/70 text-flare/80"
      style={{ opacity: useRange(t, 0, 0.95, 0, 0.7), scale: useRange(t, 2.1, 1, 0, 0.75), rotate: -12 }}
    >
      <div className="text-center font-mono text-[8.5px] leading-[1.5] tracking-[0.18em]">
        READING ROOM
        <br />
        <span className="font-display text-[19px] tracking-normal">COPY 4</span>
        <br />
        DO NOT REMOVE
      </div>
      <span className="absolute inset-[7px] rounded-full border border-flare/40" />
    </motion.div>
  );
}

function Paperclip() {
  return (
    <svg viewBox="0 0 60 120" className="pointer-events-none absolute -top-6 left-[9%] h-28 w-14 text-ink/45" fill="none">
      <path
        d="M38 8 C50 8 54 18 54 30 L54 84 C54 100 44 108 34 108 C24 108 16 100 16 88 L16 34 C16 24 22 18 30 18 C38 18 42 24 42 32 L42 80"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}


