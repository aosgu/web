import { useRef, useState } from "react";
import Horn, { type Corner } from "./Horn";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import { useScrollProgress } from "../hooks/useScroll";
import { COLORS } from "../lib/palette";

const cardBase =
  "grid-paper relative flex aspect-square flex-col justify-between overflow-hidden border border-ink p-5";

const cardHeader = "flex justify-between font-mono text-xs uppercase tracking-[0.16em]";

/** A: radius is bound directly to the card's position in the viewport. */
function RadiusCard() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(ref);
  const s = 0.12 + p * 0.88;

  return (
    <div ref={ref} className={cardBase}>
      <div className={cardHeader}>
        <span>A — Radius</span>
        <span className="tabular-nums">r = {Math.round(s * 100)}%</span>
      </div>
      <div className="absolute left-1/2 top-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2">
        <Horn corner="br" fill={COLORS.green} discFill={COLORS.sky} scale={s} transition="none" className="h-full w-full" />
      </div>
      <span className="font-mono text-xs uppercase tracking-[0.16em] opacity-60">Scroll-bound</span>
    </div>
  );
}

/** B: concentric arcs drawn with stroke-dashoffset, driven by scroll. */
function StrokeCard() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(ref);
  const rings = [
    { R: 100, color: COLORS.green },
    { R: 72, color: COLORS.blue },
    { R: 44, color: COLORS.navy },
  ];

  return (
    <div ref={ref} className={cardBase}>
      <div className={cardHeader}>
        <span>B — Stroke</span>
        <span className="tabular-nums">{Math.round(p * 100)}%</span>
      </div>
      <svg viewBox="0 0 100 100" className="absolute left-1/2 top-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 overflow-visible">
        <line x1="0" y1="100" x2="100" y2="100" stroke={COLORS.ink} strokeWidth="0.4" />
        <line x1="100" y1="0" x2="100" y2="100" stroke={COLORS.ink} strokeWidth="0.4" />
        {rings.map((r, i) => {
          const start = i * 0.14;
          const len = Math.min(1, Math.max(0, (p - start) / 0.6));
          return (
            <path
              key={r.R}
              pathLength={1}
              d={`M ${100 - r.R} 100 A ${r.R} ${r.R} 0 0 1 100 ${100 - r.R}`}
              fill="none"
              stroke={r.color}
              strokeWidth={2.2}
              strokeDasharray="1 1"
              strokeDashoffset={1 - len}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <span className="font-mono text-xs uppercase tracking-[0.16em] opacity-60">Stroke draw</span>
    </div>
  );
}

/** C: hover morphs the disc to a small corner; leave to restore. */
function HoverCard() {
  const [hover, setHover] = useState(false);

  return (
    <div
      data-hover
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cardBase}
    >
      <div className={cardHeader}>
        <span>C — Morph</span>
        <span className="tabular-nums">{hover ? "r = 30%" : "r = 100%"}</span>
      </div>
      <div className="absolute left-1/2 top-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2">
        <Horn corner="tl" fill={COLORS.navy} discFill={COLORS.sky} scale={hover ? 0.3 : 1} className="h-full w-full" />
      </div>
      <span className="font-mono text-xs uppercase tracking-[0.16em] opacity-60">Hover to morph</span>
    </div>
  );
}

/** Row of eight tiles, each on its own phase of a sine wave tied to scroll. */
function ArcSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(ref);
  const corners: Corner[] = ["tl", "tr", "br", "bl"];
  const fills = [COLORS.green, COLORS.blue, COLORS.navy, COLORS.sky];

  return (
    <div ref={ref} className="mt-6 grid grid-cols-4 border-l border-t border-ink md:grid-cols-8">
      {Array.from({ length: 8 }).map((_, i) => {
        const s = 0.5 + 0.5 * Math.sin(p * Math.PI * 3 + i * 0.75);
        return (
          <div key={i} className="relative aspect-square border-b border-r border-ink">
            <Horn
              corner={corners[i % 4]}
              fill={fills[i % 4]}
              scale={s}
              transition="none"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        );
      })}
    </div>
  );
}

export default function ShapeLab() {
  return (
    <section id="shapes" className="relative px-6 py-28 md:px-12">
      <Reveal>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel index="04" title="Shapes" />
            <h2 className="mt-6 max-w-[14ch] text-[clamp(2.6rem,6vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.04em]">
              Arcs, squares, one rule.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed opacity-75">
            Every shape is a square with a disc removed from one corner. Radius, stroke and rotation are the only
            variables — and each one is wired to scroll or the pointer.
          </p>
        </div>
      </Reveal>

      <Reveal delay={120} className="mt-16">
        <div className="grid gap-0 md:grid-cols-3">
          <RadiusCard />
          <StrokeCard />
          <HoverCard />
        </div>
        <ArcSequence />
      </Reveal>
    </section>
  );
}
