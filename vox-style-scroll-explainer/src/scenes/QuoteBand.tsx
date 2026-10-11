import { motion, useTransform, type MotionValue } from "framer-motion";
import { StickyScene, useRamp, useRange, clamp01 } from "@/lib/scroll";
import { Marquee } from "@/components/Chrome";

type W = { t: string; em?: "yolk" | "flare" | "box" };

const LINE1: W[] = [
  { t: "A" }, { t: "technique" }, { t: "does" }, { t: "not" }, { t: "travel" },
  { t: "because", em: "yolk" }, { t: "it" }, { t: "is" }, { t: "clever." },
];
const LINE2: W[] = [
  { t: "It" }, { t: "travels" }, { t: "because", em: "flare" },
  { t: "somebody", em: "box" }, { t: "along" }, { t: "the" }, { t: "road" },
];
const LINE3: W[] = [
  { t: "already" }, { t: "had" }, { t: "a" }, { t: "reason", em: "yolk" },
  { t: "to" }, { t: "carry" }, { t: "it." },
];

const ALL = [...LINE1, ...LINE2, ...LINE3];

export default function QuoteBand() {
  return (
    <StickyScene id="quote" vh={230}>
      {(p) => (
        <div className="relative flex h-full w-full flex-col justify-center overflow-hidden bg-ink">
          <div className="absolute inset-0 text-paper/[0.05] halftone-lg" />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 45% at 30% 45%, rgba(255,212,0,0.16), transparent 70%)",
              opacity: useRange(p, 0, 1, 0.1, 0.6),
            }}
          />
          <motion.div
            className="pointer-events-none absolute top-1/2 left-[6%] -translate-y-1/2 font-display text-[clamp(10rem,34vw,28rem)] leading-none text-paper/[0.05]"
            style={{ y: useRange(p, 60, -60, 0, 1) }}
          >
            “
          </motion.div>

          <Marquee
            className="absolute inset-x-0 top-[62px] border-y border-paper/12 py-1.5 font-mono text-[10px] tracking-[0.3em] text-paper/35 uppercase"
            items={["interstitial", "no footage", "type only", "hold 4 seconds", "interstitial"]}
            speed="animate-marquee-slow"
          />

          <div className="scene-pad relative z-10 mx-auto w-full max-w-[1180px]">
            <p className="font-display text-[clamp(1.7rem,5.6vw,4.4rem)] leading-[1.02] tracking-[-0.01em] text-paper uppercase">
              {[LINE1, LINE2, LINE3].map((line, li) => (
                <span key={li} className="block">
                  {line.map((w) => (
                    <Word key={`${li}-${w.t}`} w={w} p={p} />
                  ))}
                </span>
              ))}
            </p>

            <motion.div
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2"
              style={{ opacity: useRamp(p, 0.82, 0.92) }}
            >
              <span className="block h-[3px] w-14 bg-yolk" />
              <span className="font-mono text-[10px] tracking-[0.24em] text-paper/55 uppercase">
                Held for four seconds · no narration · then cut to the numbers
              </span>
            </motion.div>
          </div>

          <div className="absolute bottom-5 left-[clamp(1rem,4vw,4rem)] z-10 font-mono text-[9.5px] tracking-[0.22em] text-paper/35">
            CARD 07 / 12 — TYPOGRAPHY ONLY
          </div>
        </div>
      )}
    </StickyScene>
  );
}

function Word({ w, p }: { w: W; p: MotionValue<number> }) {
  const idx = ALL.indexOf(w);
  const start = 0.06 + (idx / ALL.length) * 0.66;
  const t = useRamp(p, start, start + 0.05);

  const color = useTransform(t, (v) =>
    w.em === "box" ? (v > 0.5 ? "#0b0b0d" : "rgba(238,233,220,0.22)") : v > 0.5 ? "#eee9dc" : "rgba(238,233,220,0.22)",
  );

  return (
    <span className="relative mr-[0.24em] inline-block">
      {w.em === "yolk" && (
        <motion.span
          aria-hidden
          className="absolute -inset-x-[4px] bottom-[0.06em] -z-0 h-[0.42em] origin-left skew-x-[-12deg] bg-yolk"
          style={{ scaleX: useTransform(t, (v) => clamp01((v - 0.35) / 0.65)) }}
        />
      )}
      {w.em === "flare" && (
        <motion.span
          aria-hidden
          className="absolute -inset-x-[4px] bottom-[0.06em] -z-0 h-[0.42em] origin-left skew-x-[-12deg] bg-flare"
          style={{ scaleX: useTransform(t, (v) => clamp01((v - 0.35) / 0.65)) }}
        />
      )}
      {w.em === "box" && (
        <motion.span
          aria-hidden
          className="absolute -inset-x-[6px] -inset-y-[2px] -z-0 bg-paper"
          style={{ scale: useTransform(t, (v) => (v > 0.5 ? 1 : 0)), transformOrigin: "left center" }}
        />
      )}
      <motion.span className="relative z-[1]" style={{ color, y: useRange(t, 14, 0) }}>
        {w.t}
      </motion.span>
    </span>
  );
}
