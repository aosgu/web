import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { CHAPTERS } from "@/data/content";

/* ------------------------------- film grain ------------------------------- */

export function Grain() {
  return (
    <>
      <div
        aria-hidden
        className="grain-layer animate-grain pointer-events-none fixed -inset-[15%] z-[95] opacity-[0.13] mix-blend-overlay"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[94]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, transparent 42%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </>
  );
}

/* --------------------------------- top bar -------------------------------- */

export function TopBar({ activeIndex }: { activeIndex: number }) {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  const pct = useTransform(scrollYProgress, (v: number) => `${Math.round(v * 100)}%`);
  const ch = CHAPTERS[activeIndex] ?? CHAPTERS[0];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[90]">
      <motion.div
        className="h-[3px] w-full origin-left bg-yolk"
        style={{ scaleX: bar }}
      />
      <div className="flex items-stretch justify-between border-b border-paper/15 bg-ink/85 backdrop-blur-[2px]">
        <div className="flex items-center gap-2.5 px-3 py-2 sm:gap-3 sm:px-5">
          <span className="grid h-[22px] w-[22px] -rotate-3 place-items-center bg-yolk text-[11px] leading-none font-black text-ink">
            ◈
          </span>
          <span className="font-sans text-[11px] leading-none font-extrabold tracking-[0.22em] text-paper uppercase sm:text-[12px]">
            The Explainer Unit
          </span>
          <span className="hidden font-mono text-[10px] tracking-widest text-paper/40 md:inline">
            / NON-FICTIONAL SCENES
          </span>
        </div>
        <div className="flex items-center gap-3 px-3 sm:gap-6 sm:px-5">
          <div key={ch.id} className="flex items-baseline gap-2 overflow-hidden">
            <motion.span
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="font-mono text-[10px] tracking-[0.2em] text-yolk"
            >
              {ch.n}
            </motion.span>
            <motion.span
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.04 }}
              className="max-w-[22ch] truncate font-mono text-[10px] tracking-[0.2em] text-paper/70 uppercase"
            >
              {ch.kicker}
            </motion.span>
          </div>
          <motion.span className="font-mono text-[10px] tracking-widest text-paper/45 tabular-nums">
            {pct}
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- chapter rail ------------------------------ */

export function ChapterRail({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <nav className="pointer-events-auto fixed top-1/2 right-2 z-[88] hidden -translate-y-1/2 lg:block">
      <ul className="flex flex-col items-end gap-[7px]">
        {CHAPTERS.map((c, i) => {
          const on = i === activeIndex;
          return (
            <li key={c.id}>
              <button
                onClick={() => onSelect(i)}
                className="group flex cursor-pointer items-center justify-end gap-2"
                aria-label={c.title}
              >
                <span
                  className={`font-mono text-[9px] tracking-widest transition-all duration-300 ${
                    on
                      ? "text-yolk opacity-100"
                      : "text-paper/40 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {c.kicker}
                </span>
                <span
                  className={`block transition-all duration-300 ${
                    on ? "h-[2px] w-8 bg-yolk" : "h-[2px] w-3.5 bg-paper/30 group-hover:w-6 group-hover:bg-paper/70"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* --------------------------------- marquee -------------------------------- */

export function Marquee({
  items,
  className = "",
  speed = "animate-marquee",
}: {
  items: string[];
  className?: string;
  speed?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={`relative flex overflow-hidden ${className}`}>
      <div className={`flex shrink-0 ${speed}`}>
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-6 pr-6 whitespace-nowrap">
            {t}
            <span className="text-yolk">◈</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ chapter card ------------------------------ */

export function ChapterCard({
  n,
  kicker,
  title,
  tone = "dark",
  align = "left",
  className = "",
}: {
  n: string;
  kicker: string;
  title: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={`${align === "center" ? "items-center text-center" : "items-start text-left"} flex flex-col gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`block h-[3px] w-16 origin-left ${dark ? "bg-yolk" : "bg-ink"}`}
        />
        <span
          className={`font-mono text-[10px] font-semibold tracking-[0.34em] uppercase ${
            dark ? "text-yolk" : "text-ink/70"
          }`}
        >
          Scene {n} — {kicker}
        </span>
      </div>
      <motion.h2
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
        className={`font-display text-[clamp(2.1rem,5.6vw,4.6rem)] leading-[0.9] tracking-[-0.01em] uppercase ${
          dark ? "text-paper" : "text-ink"
        }`}
      >
        {title}
      </motion.h2>
    </div>
  );
}
