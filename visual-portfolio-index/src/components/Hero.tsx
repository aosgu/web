import { useEffect, useRef } from "react";
import Horn from "./Horn";
import { useScrollProgress } from "../hooks/useScroll";
import { COLORS } from "../lib/palette";

const services = ["Layout", "Vector / SVG", "Motion", "Interaction"];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(sectionRef, "pinned");

  // Subtle parallax of the horn tiles against the pointer.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      if (tilesRef.current) {
        tilesRef.current.style.transform = `translate3d(${x * -28}px, ${y * -28}px, 0)`;
      }
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // As you scroll, the arcs collapse toward flat squares and the type fades out.
  const scale = 1 - p * 0.94;
  const fade = Math.max(0, 1 - p * 2.2);

  return (
    <section id="top" ref={sectionRef} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 2×2 quadrant field: green / grid / grid / blue */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div className="bg-green" />
          <div className="grid-paper" />
          <div className="grid-paper" />
          <div className="bg-blue" />
        </div>

        {/* Horn tiles centred on the seam */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ ["--s" as string]: "min(19vw, 34vh)" }}
        >
          <div
            ref={tilesRef}
            className="relative will-change-transform"
            style={{ width: "calc(var(--s) * 2)", height: "calc(var(--s) * 2)" }}
          >
            <div className="absolute left-0 top-0" style={{ width: "var(--s)", height: "var(--s)" }}>
              <Horn corner="br" fill={COLORS.sky} discFill={COLORS.green} scale={scale} transition="none" className="h-full w-full" />
            </div>
            <div className="absolute left-[var(--s)] top-0" style={{ width: "var(--s)", height: "var(--s)" }}>
              <Horn corner="bl" fill={COLORS.sky} scale={scale} transition="none" className="h-full w-full" />
            </div>
            <div className="absolute left-0 top-[var(--s)]" style={{ width: "var(--s)", height: "var(--s)" }}>
              <Horn corner="tr" fill={COLORS.navy} scale={scale} transition="none" className="h-full w-full" />
            </div>
            <div className="absolute left-[var(--s)] top-[var(--s)]" style={{ width: "var(--s)", height: "var(--s)" }}>
              <Horn corner="tl" fill={COLORS.navy} scale={scale} transition="none" className="h-full w-full" />
            </div>
          </div>
        </div>

        {/* Top-left: label + headline on green */}
        <div className="absolute left-[3vw] top-[14vh] font-mono text-xs uppercase tracking-[0.18em] text-paper" style={{ opacity: fade }}>
          Portfolio — Vol. 01
        </div>
        <h1
          className="absolute left-[3vw] font-medium leading-[0.86] tracking-[-0.05em] text-paper text-[clamp(3rem,6.6vw,8.5rem)]"
          style={{ bottom: "calc(50% + 4vh)", opacity: fade, transform: `translateY(${p * -80}px)` }}
        >
          {["Form", "in", "motion."].map((w, i) => (
            <span key={w} className="block overflow-hidden pb-[0.04em]">
              <span className="reveal-line" style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                {w}
              </span>
            </span>
          ))}
        </h1>

        {/* Top-right: grey quadrant services list */}
        <ol className="absolute right-[3vw] top-[14vh] space-y-1 text-right font-mono text-xs uppercase tracking-[0.16em]" style={{ opacity: fade }}>
          {services.map((s, i) => (
            <li key={s}>
              0{i + 1} — {s}
            </li>
          ))}
        </ol>

        {/* Bottom-left: scroll cue */}
        <div className="absolute bottom-[6vh] left-[3vw] flex items-end gap-4 font-mono text-xs uppercase tracking-[0.18em]">
          <span className="relative block h-16 w-px overflow-hidden bg-ink/30">
            <span className="cue-line absolute inset-0 bg-blue" />
          </span>
          <span className="leading-relaxed">
            Scroll to explore
            <br />
            <span className="tabular-nums opacity-60">{String(Math.round(p * 100)).padStart(3, "0")} / 100</span>
          </span>
        </div>

        {/* Bottom-right: blue quadrant intro */}
        <p
          className="absolute bottom-[6vh] right-[3vw] w-[min(22rem,80vw)] text-base leading-relaxed text-paper"
          style={{ opacity: fade }}
        >
          A visual index of layout, vector shapes, scroll choreography and interaction — built on three colours:
          green, blue and grey.
        </p>
      </div>
    </section>
  );
}
