import { motion } from "framer-motion";
import { Reveal } from "@/lib/scroll";
import { CHAPTERS } from "@/data/content";
import { Marquee } from "@/components/Chrome";

const CREDITS = [
  ["MADE OF", "scroll position, SVG paths, and CSS"],
  ["FOOTAGE", "none. every frame is drawn at runtime"],
  ["DATA", "invented, but internally consistent"],
  ["RUNTIME", "as long as you take to read it"],
];

export default function EndCard({ onJump }: { onJump: (i: number) => void }) {
  return (
    <section id="end" className="relative overflow-hidden bg-ink pt-[8vh] pb-14">
      <div className="absolute inset-0 text-paper/[0.045] halftone" />
      <Marquee
        className="border-y-[3px] border-yolk py-3 font-display text-[clamp(2rem,6vw,4.6rem)] leading-none text-yolk uppercase"
        items={["end of tape", "no sources were harmed", "scroll back up", "scene index below"]}
      />

      <div className="scene-pad relative z-10 mx-auto mt-10 max-w-[1240px]">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[10px] tracking-[0.34em] text-yolk uppercase">
                Scene index — click to jump
              </span>
              <h2 className="mt-2 font-display text-[clamp(2.2rem,7vw,5.4rem)] leading-[0.86] text-paper uppercase">
                Ten scenes,
                <br />
                <span className="text-outline">one scroll position</span>
              </h2>
            </div>
            <motion.button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ scale: 1.04, rotate: -1.5 }}
              whileTap={{ scale: 0.97 }}
              className="group flex cursor-pointer items-center gap-3 border-[3px] border-paper bg-paper px-5 py-3 text-ink paper-shadow-yolk"
            >
              <span className="grid h-7 w-7 place-items-center bg-ink text-yolk">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 11V1M6 1L1.5 5.5M6 1l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className="font-display text-lg tracking-wide uppercase">Run it again</span>
            </motion.button>
          </div>
        </Reveal>

        <ul className="mt-10 border-t border-paper/15">
          {CHAPTERS.map((c, i) => (
            <li key={c.id}>
              <motion.button
                type="button"
                onClick={() => onJump(i)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45, delay: i * 0.03 }}
                whileHover="hover"
                className="group relative flex w-full cursor-pointer items-center gap-4 border-b border-paper/15 px-1 py-3.5 text-left sm:gap-6 sm:px-3"
              >
                <motion.span
                  variants={{ hover: { backgroundColor: "#ffd400", color: "#0b0b0d" } }}
                  className="grid h-9 w-9 shrink-0 place-items-center bg-paper/10 font-mono text-[11px] text-paper transition-colors"
                >
                  {c.n}
                </motion.span>
                <motion.span
                  variants={{ hover: { x: 8 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="min-w-0 flex-1"
                >
                  <span className="block font-mono text-[9.5px] tracking-[0.26em] text-yolk uppercase">
                    {c.kicker}
                  </span>
                  <span className="mt-0.5 block truncate font-display text-[clamp(1.05rem,2.4vw,1.75rem)] leading-tight text-paper uppercase">
                    {c.title}
                  </span>
                </motion.span>
                <span className="hidden shrink-0 font-mono text-[10px] tracking-[0.2em] text-paper/40 sm:block">
                  {["00:14", "01:02", "00:48", "00:37", "00:29", "00:41", "00:22", "00:33", "00:26", "—:—"][i]}
                </span>
                <motion.span
                  variants={{ hover: { x: 0, opacity: 1 }, }}
                  initial={false}
                  className="shrink-0 text-yolk opacity-30 transition-opacity group-hover:opacity-100"
                >
                  →
                </motion.span>
                <motion.span
                  variants={{ hover: { scaleX: 1 } }}
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-yolk"
                />
              </motion.button>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {CREDITS.map(([k, v]) => (
            <div key={k} className="border-t-2 border-paper/25 pt-3">
              <div className="font-mono text-[9px] tracking-[0.26em] text-paper/40 uppercase">{k}</div>
              <div className="mt-1 font-sans text-[13px] leading-snug font-semibold text-paper/85">{v}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-5 font-mono text-[9.5px] tracking-[0.2em] text-paper/35 uppercase">
          <span>The Explainer Unit · a fictional production</span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-blink rounded-full bg-flare" />
            tape stopped
          </span>
          <span>Built with scroll, SVG and stubbornness</span>
        </div>
      </div>
    </section>
  );
}
