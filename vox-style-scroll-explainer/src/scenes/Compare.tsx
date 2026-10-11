import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/lib/scroll";
import { IMG } from "@/data/content";
import { ChapterCard } from "@/components/Chrome";

export default function Compare() {
  return (
    <section id="compare" className="relative overflow-hidden bg-paper py-[10vh] text-ink">
      <div className="absolute inset-0 text-ink/[0.05] halftone" />
      <div className="absolute -bottom-32 -left-24 h-[380px] w-[380px] -rotate-12 bg-cobalt/12" />
      <div className="scene-pad relative z-10 mx-auto max-w-[1240px]">
        <Reveal>
          <ChapterCard n="11" kicker="The compare" title="Same place, one hundred and fifty years apart" tone="light" />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
            <Slider />
            <aside className="flex flex-col gap-4">
              <div className="border-[3px] border-ink bg-yolk p-3 paper-shadow-sm">
                <div className="font-mono text-[9px] tracking-[0.24em] text-ink/60">HOW TO READ IT</div>
                <p className="mt-1.5 font-serif text-[13.5px] leading-[1.5] text-ink">
                  Drag the handle. Left is the charted coast as it was drawn from a deck; right is
                  the same water photographed from four hundred kilometres up.
                </p>
              </div>
              <div className="border-[3px] border-ink bg-paper p-3">
                <div className="font-mono text-[9px] tracking-[0.24em] text-ink/50">WHAT CHANGED</div>
                <ul className="mt-2 space-y-2 font-sans text-[12.5px] leading-snug font-semibold">
                  {[
                    ["Shoreline", "unchanged"],
                    ["Pier count", "4 → 31"],
                    ["Water colour", "silt → diesel"],
                    ["Who can see it", "the harbour master → everyone"],
                  ].map(([k, v]) => (
                    <li key={k} className="flex items-baseline justify-between gap-3 border-b border-dashed border-ink/25 pb-1.5">
                      <span className="font-mono text-[10px] tracking-wider text-ink/55 uppercase">{k}</span>
                      <span className="text-right">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto hidden font-mono text-[9.5px] leading-relaxed tracking-[0.16em] text-ink/45 lg:block">
                THE ONLY SCENE ON THIS PAGE THAT ASKS YOU TO DO SOMETHING.
              </div>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Slider() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0.46);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = (cx: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(1, Math.max(0, (cx - r.left) / r.width)));
  };

  return (
    <div
      ref={boxRef}
      className="@container relative aspect-[16/10] w-full cursor-ew-resize overflow-hidden border-[3px] border-ink bg-ink select-none paper-shadow"
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture?.(e.pointerId);
        setDragging(true);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging && setFromClientX(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      {/* right plate — modern */}
      <img src={IMG.istanbul} alt="The same strait photographed from orbit" className="absolute inset-0 h-full w-full object-cover duotone contrast-[1.3]" />
      <span className="mix-yolk absolute inset-0 bg-cobalt opacity-[0.16]" />

      {/* left plate — archive, clipped to the handle position */}
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos * 100}%` }}>
        <img
          src={IMG.oldmap}
          alt="A hand-charted coast, 1750"
          className="absolute inset-y-0 left-0 h-full w-[100cqw] object-cover sepia-[0.55] contrast-[1.1]"
        />
        <span className="absolute inset-y-0 left-0 h-full w-[100cqw] bg-[#e8d9a8]/25 mix-blend-multiply" />
      </div>

      <span className="halftone pointer-events-none absolute inset-0 text-ink/20" />

      {/* labels */}
      <div className="pointer-events-none absolute top-3 left-3 bg-ink px-2 py-1 font-mono text-[9.5px] tracking-[0.22em] text-yolk">
        PLATE A · CHARTED 1750
      </div>
      <div className="pointer-events-none absolute top-3 right-3 bg-yolk px-2 py-1 font-mono text-[9.5px] tracking-[0.22em] text-ink">
        PLATE B · IMAGED NOW
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 font-display text-[clamp(2rem,6vw,4rem)] leading-none text-paper mix-blend-difference">
        THEN
      </div>
      <div className="pointer-events-none absolute right-3 bottom-3 font-display text-[clamp(2rem,6vw,4rem)] leading-none text-paper mix-blend-difference">
        NOW
      </div>

      {/* handle */}
      <div className="pointer-events-none absolute inset-y-0 z-20 w-[3px] bg-yolk" style={{ left: `${pos * 100}%` }}>
        <motion.button
          type="button"
          aria-label="Drag to compare the two plates"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((v) => Math.max(0, v - 0.04));
            if (e.key === "ArrowRight") setPos((v) => Math.min(1, v + 0.04));
          }}
          className="pointer-events-auto absolute top-1/2 left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border-[3px] border-ink bg-yolk text-ink shadow-[0_4px_0_rgba(11,11,13,0.6)]"
          whileHover={{ scale: 1.1 }}
          animate={{ scale: dragging ? 1.14 : 1 }}
        >
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
            <path d="M8 1 L2 7 L8 13 M14 1 L20 7 L14 13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-ink/40">
        <div className="h-full bg-yolk" style={{ width: `${pos * 100}%` }} />
      </div>
    </div>
  );
}
