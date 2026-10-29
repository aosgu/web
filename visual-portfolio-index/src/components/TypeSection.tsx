import { useEffect, useRef } from "react";
import SectionLabel from "./SectionLabel";
import { clamp, consumeScrollDelta, useScrollProgress } from "../hooks/useScroll";

const STATEMENT =
  "Good type stays quiet until the layout needs it to shout. We set rhythm on a grid, then break it with weight, scale and motion.";

const ACCENTS: Record<string, string> = {
  grid: "text-green",
  motion: "text-blue",
  weight: "text-navy",
};

const words = STATEMENT.split(" ");

/** Marquee whose base speed is constant and whose impulse follows scroll velocity. */
function VelocityMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const halfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let pos = 0;
    let last = performance.now();
    let width = 1;

    const measure = () => {
      width = halfRef.current?.offsetWidth || 1;
    };
    measure();
    window.addEventListener("resize", measure);

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const delta = clamp(consumeScrollDelta(), -120, 120);
      pos += 0.06 * dt + delta * 0.7;
      pos = ((pos % width) + width) % width;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-pos}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const phrase = (
    <>
      {Array.from({ length: 2 }).map((_, i) => (
        <span key={i} className="flex items-center whitespace-nowrap pr-[0.4em]">
          <span className="outline-text">Layout</span>
          <span className="mx-[0.35em] text-blue">/</span>
          <span className="outline-text">Vector</span>
          <span className="mx-[0.35em] text-green">/</span>
          <span className="outline-text">Motion</span>
          <span className="mx-[0.35em] text-navy">/</span>
          <span className="outline-text">Interaction</span>
          <span className="mx-[0.35em] text-blue">/</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden border-y border-ink py-6">
      <div ref={trackRef} className="flex w-max text-[clamp(4rem,11vw,12rem)] font-medium uppercase leading-none tracking-[-0.03em] will-change-transform">
        <div ref={halfRef} className="flex shrink-0">
          {phrase}
        </div>
        <div className="flex shrink-0" aria-hidden>
          {phrase}
        </div>
      </div>
    </div>
  );
}

const WEIGHTS = [300, 500, 700, 900];

export default function TypeSection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(pinRef, "pinned");

  return (
    <section id="type" className="relative">
      {/* Pinned statement: words light up as you scroll */}
      <div ref={pinRef} className="relative h-[300vh]">
        <div className="grid-paper sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6 md:px-12">
          <SectionLabel index="03" title="Typography" />
          <p className="mt-10 max-w-[1200px] text-[clamp(2.2rem,5vw,5.6rem)] font-medium leading-[1.02] tracking-[-0.035em]">
            {words.map((w, i) => {
              const threshold = (i / words.length) * 0.8;
              const reveal = clamp((p - threshold) / 0.12);
              const key = w.toLowerCase().replace(/[^a-z]/g, "");
              return (
                <span
                  key={i}
                  className={ACCENTS[key] ?? ""}
                  style={{ opacity: 0.1 + 0.9 * reveal, transition: "opacity 0.2s linear" }}
                >
                  {w}{" "}
                </span>
              );
            })}
          </p>
          <div className="mt-14 flex items-center gap-5 font-mono text-xs uppercase tracking-[0.18em]">
            <span className="block h-px w-56 bg-ink/20">
              <span className="block h-px bg-blue" style={{ width: `${p * 100}%` }} />
            </span>
            <span className="tabular-nums">{Math.round(p * 100)}%</span>
          </div>
        </div>
      </div>

      <VelocityMarquee />

      {/* Weight specimen */}
      <div className="grid grid-cols-2 border-b border-ink md:grid-cols-4">
        {WEIGHTS.map((w, i) => (
          <div
            key={w}
            data-hover
            className={`group flex aspect-square flex-col justify-between p-6 transition-colors duration-500 hover:bg-blue hover:text-paper md:p-8 ${
              i < WEIGHTS.length - 1 ? "border-r border-ink" : ""
            } ${i < 2 ? "border-b border-ink md:border-b-0" : ""}`}
          >
            <span className="font-mono text-xs uppercase tracking-[0.18em]">Weight {w}</span>
            <span
              className="text-[clamp(5rem,13vw,12rem)] leading-none tracking-[-0.06em] transition-transform duration-700 group-hover:-translate-y-2"
              style={{ fontWeight: w }}
            >
              Aa
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.18em] opacity-60">Inter Tight</span>
          </div>
        ))}
      </div>
    </section>
  );
}
