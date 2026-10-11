import { motion, useTransform, type MotionValue } from "framer-motion";
import { StickyScene, useRamp, useRange, clamp01 } from "@/lib/scroll";
import { LANDMASSES, smoothPath } from "@/data/world";

const HEADLINE: { t: string; style: "plain" | "box" | "yolk" | "outline"; rot: number }[] = [
  { t: "HOW ONE", style: "plain", rot: -1.2 },
  { t: "INVENTION", style: "box", rot: 0.8 },
  { t: "WALKED", style: "plain", rot: -0.6 },
  { t: "4,000 MILES", style: "yolk", rot: 1.4 },
  { t: "WEST", style: "outline", rot: -1.8 },
];

const ARC = smoothPath([
  [803, 193], [760, 178], [711, 175], [660, 186], [623, 196], [583, 204], [528, 188], [487, 180],
]);

export default function ColdOpen() {
  return (
    <StickyScene id="open" vh={320}>
      {(p) => <Stage p={p} />}
    </StickyScene>
  );
}

function Stage({ p }: { p: MotionValue<number> }) {
  const mapIn = useRamp(p, 0.02, 0.18);
  const mapX = useRange(p, 6, -18, 0, 1);
  const mapY = useRange(p, 4, -10, 0, 1);
  const mapScale = useRange(p, 1.08, 1.26, 0, 1);
  const arcDraw = useRamp(p, 0.08, 0.42);
  const dotIn = useRamp(p, 0.0, 0.06);

  const words = useRange(p, 0, HEADLINE.length + 0.6, 0.16, 0.56);
  const swipe = useRamp(p, 0.44, 0.6);
  const kicker = useRamp(p, 0.56, 0.68);
  const out = useRamp(p, 0.86, 1);
  const wipe = useTransform(p, [0.84, 1], ["-110%", "110%"]);

  const tc = useRamp(p, 0, 1);

  return (
    <div className="relative h-full w-full bg-ink">
      {/* ---------- ambient halftone field ---------- */}
      <div className="absolute inset-0 text-paper/[0.055] halftone-lg" />
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 22% 68%, rgba(255,212,0,0.16), transparent 70%), radial-gradient(50% 45% at 82% 24%, rgba(43,72,216,0.22), transparent 70%)",
          opacity: mapIn,
        }}
      />

      {/* ---------- the map, fading up out of the dark ---------- */}
      <motion.div className="absolute inset-0" style={{ opacity: mapIn }}>
        <motion.svg
          viewBox="330 20 700 330"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          style={{ x: mapX, y: mapY, scale: mapScale }}
        >
          <defs>
            <pattern id="coldgrid" width="25" height="17.3" patternUnits="userSpaceOnUse">
              <path d="M25 0 L0 0 0 17.3" fill="none" stroke="rgba(238,233,220,0.09)" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect x="330" y="20" width="700" height="330" fill="url(#coldgrid)" />
          {LANDMASSES.map((l) => (
            <path
              key={l.id}
              d={l.d}
              fill="rgba(238,233,220,0.07)"
              stroke="rgba(238,233,220,0.4)"
              strokeWidth={l.major ? 1.1 : 0.7}
              strokeLinejoin="round"
            />
          ))}
          <motion.path
            d={ARC}
            fill="none"
            stroke="#ffd400"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="1 9"
            style={{ pathLength: arcDraw, opacity: arcDraw }}
          />
          <motion.path
            d={ARC}
            fill="none"
            stroke="#ffd400"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ pathLength: arcDraw, opacity: 0.16 }}
          />
          {/* origin blip */}
          <motion.g style={{ opacity: dotIn }}>
            <motion.circle
              cx={803}
              cy={193}
              r={4}
              fill="#ffd400"
              animate={{ r: [3.4, 5.4, 3.4], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              cx={803}
              cy={193}
              r={8}
              fill="none"
              stroke="#ffd400"
              strokeWidth="1"
              animate={{ r: [6, 30], opacity: [0.7, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
            />
          </motion.g>
        </motion.svg>
      </motion.div>

      {/* ---------- timecode slate ---------- */}
      <motion.div
        className="absolute top-[68px] left-[clamp(1rem,4vw,4rem)] flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-paper/60"
        style={{ opacity: useRange(p, 0, 1, 0.0, 0.04) }}
      >
        <span className="animate-blink inline-block h-2 w-2 rounded-full bg-flare" />
        <Timecode t={tc} />
        <span className="text-paper/30">·</span>
        <span>23.976 fps</span>
      </motion.div>

      {/* ---------- headline: cut-paper words ---------- */}
      <div className="scene-pad absolute inset-x-0 bottom-[16%] z-10">
        <h1 className="font-display text-[clamp(2.6rem,10.5vw,9.5rem)] leading-[0.82] tracking-[-0.02em] uppercase">
          {HEADLINE.map((w, i) => (
            <Word key={w.t} w={w} words={words} i={i} />
          ))}
        </h1>

        {/* yellow marker swipe under the last line */}
        <div className="relative mt-4 h-[10px] w-full max-w-[640px]">
          <motion.div
            className="h-full w-full origin-left skew-x-[-16deg] bg-flare"
            style={{ scaleX: swipe }}
          />
        </div>

        <motion.div
          className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.18em] text-paper/70 uppercase"
          style={{ opacity: kicker, y: useRange(kicker, 16, 0) }}
        >
          <span className="bg-yolk px-2 py-1 font-semibold text-ink">An explainer in nine scenes</span>
          <span>No sources were harmed</span>
          <span className="text-paper/40">Scroll to run the tape →</span>
        </motion.div>
      </div>

      {/* ---------- paper scrap ---------- */}
      <motion.div
        className="absolute right-[clamp(1rem,5vw,5rem)] bottom-[10%] z-10 rotate-[3deg] border border-ink/15 bg-paper px-4 py-3 text-ink paper-shadow"
        style={{ opacity: kicker, y: useRange(kicker, 24, 0) }}
      >
        <div className="font-mono text-[9px] tracking-[0.24em] opacity-60">SLATE</div>
        <div className="font-display text-2xl leading-none">SC 00</div>
        <div className="mt-1 font-mono text-[9px] tracking-widest opacity-60">TAKE 3 · PRINT</div>
      </motion.div>

      {/* ---------- everything leaves on a yellow wipe ---------- */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 flex"
        style={{ x: useRange(p, 0, 0, 0, 1), opacity: out }}
      >
        <div className="h-full w-full bg-ink" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[105%] bg-yolk"
        style={{ x: wipe }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-[105%] z-30 w-[10px] bg-ink"
        style={{ x: wipe }}
      />
    </div>
  );
}

function Word({
  w,
  words,
  i,
}: {
  w: (typeof HEADLINE)[number];
  words: MotionValue<number>;
  i: number;
}) {
  const prog = useTransform(words, (v) => clamp01(v - i));
  return (
    <span className="mr-[0.14em] inline-block overflow-hidden align-bottom">
      <motion.span
        className="inline-block"
        style={{
          y: useRange(prog, 130, 0),
          rotate: useRange(prog, w.rot * 6, w.rot),
          opacity: prog,
        }}
      >
        <span
          className={
            w.style === "box"
              ? "inline-block bg-paper px-[0.12em] text-ink paper-shadow"
              : w.style === "yolk"
                ? "inline-block bg-yolk px-[0.12em] text-ink paper-shadow-sm"
                : w.style === "outline"
                  ? "text-outline inline-block"
                  : "text-paper"
          }
        >
          {w.t}
        </span>
      </motion.span>
    </span>
  );
}

function Timecode({ t }: { t: MotionValue<number> }) {
  const text = useTransform(t, (v: number) => {
    const total = v * 482;
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = Math.floor(total % 60);
    const f = Math.floor((total % 1) * 24);
    return `TC ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
  });
  return <motion.span className="tabular-nums">{text}</motion.span>;
}
