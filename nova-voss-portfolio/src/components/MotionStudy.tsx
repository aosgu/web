import { useRef } from "react";
import { useScrollProgress } from "@/lib/hooks";
import { Asterisk, SectionLabel } from "./Motion";

const labels = ["Perception", "Transition", "Rhythm", "Response"];

export function MotionStudy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(sectionRef);
  const eased = Math.min(1, Math.max(0, (progress - 0.08) / 0.84));
  const rotation = eased * 210;
  const stageLabel =
    eased < 0.25 ? "Stillness" : eased < 0.5 ? "Tension" : eased < 0.78 ? "Release" : "Return";

  return (
    <section id="motion" className="relative border-t border-paper/25 bg-green-deep text-paper">
      <div ref={sectionRef} className="relative h-[190vh] md:h-[240vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          <div className="grid-major pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="grain pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-paper/15" aria-hidden="true" />

          <div className="relative z-10 mx-auto w-full max-w-[1720px] px-5 pt-[84px] md:px-10 md:pt-[96px]">
            <SectionLabel index="03" label="A study in motion" dark />
            <div className="mt-3 flex items-center justify-between gap-4 border-b border-paper/20 pb-3">
              <span className="mono text-paper/55">Study N° 03 — One path, four states</span>
              <span className="mono hidden items-center gap-2 text-paper/55 sm:flex">
                <span className="size-1.5 rounded-full bg-sky" />
                Scroll position as a timeline
              </span>
            </div>
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-[1720px] flex-1 grid-cols-1 content-center gap-4 px-5 py-3 md:grid-cols-[1.05fr_.95fr] md:items-center md:gap-10 md:px-10 md:py-5">
            <div>
              <div
                className="mb-4 flex items-center gap-3"
                style={{ transform: `translateX(${(eased - 0.5) * 22}px)` }}
              >
                <span className="mono text-sky">Motion</span>
                <span className="h-px w-12 bg-paper/30" />
                <span className="mono text-paper/45">is a form of care</span>
              </div>

              <h2 className="display text-[clamp(3rem,9.2vw,10.5rem)]" aria-label="Everything moves">
                <span
                  className="block transition-transform duration-100 ease-out"
                  style={{ transform: `translateX(${(eased - 0.5) * -30}px)` }}
                >
                  EVERY
                  <span className="text-sky">—</span>
                </span>
                <span className="block pl-[9%]">
                  THING
                </span>
                <span className="serif block font-normal italic text-sky">
                  moves.
                </span>
              </h2>

              <div className="mt-4 flex max-w-[440px] flex-col gap-4 border-t border-paper/25 pt-3 sm:flex-row sm:gap-8 md:mt-6 md:pt-4">
                <p className="body-copy hidden text-sm text-paper/65 sm:block">
                  An exercise in scroll-linked choreography. One curve, drawn by your attention, never
                  by a clock.
                </p>
                <span className="mono whitespace-nowrap text-paper/45">
                  {String(Math.round(eased * 100)).padStart(3, "0")}
                  <span className="text-sky"> / </span>
                  100
                </span>
              </div>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[260px] sm:max-w-[360px] md:max-w-[560px]">
              <div className="absolute inset-0 border border-paper/20">
                <svg viewBox="0 0 600 600" className="size-full" fill="none" role="img" aria-label={`Animated arc study at ${stageLabel} stage`}>
                  <defs>
                    <pattern id="motionGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M25 0H0V25" stroke="var(--paper)" strokeOpacity=".1" strokeWidth=".7" />
                    </pattern>
                  </defs>
                  <rect width="600" height="600" fill="url(#motionGrid)" />
                  <path d="M0 300h600M300 0v600" stroke="var(--paper)" strokeOpacity=".24" />
                  <circle cx="300" cy="300" r="245" stroke="var(--paper)" strokeOpacity=".16" strokeDasharray="1 7" />
                  <circle cx="300" cy="300" r="190" stroke="var(--paper)" strokeOpacity=".13" />

                  <g transform={`translate(300 300) rotate(${rotation}) translate(-300 -300)`}>
                    <path
                      d="M300 55A245 245 0 0 1 545 300"
                      stroke="var(--sky)"
                      strokeWidth="2"
                      strokeOpacity=".8"
                    />
                    <circle cx="300" cy="55" r="6" fill="var(--sky)" />
                    <line x1="300" y1="300" x2="300" y2="55" stroke="var(--sky)" strokeOpacity=".3" />
                  </g>

                  <g transform={`translate(300 300) rotate(${-rotation * 0.62}) translate(-300 -300)`}>
                    <path
                      d="M300 300V105a195 195 0 0 1 195 195Z"
                      fill="var(--blue)"
                      fillOpacity=".9"
                    />
                    <path d="M495 300a195 195 0 0 1-195 195" stroke="var(--paper)" strokeWidth="1.4" />
                    <circle cx="495" cy="300" r="5" fill="var(--paper)" />
                  </g>

                  <circle
                    cx="300"
                    cy="300"
                    r={34 + eased * 86}
                    stroke="var(--paper)"
                    strokeOpacity=".75"
                    strokeWidth="1.25"
                  />
                  <circle cx="300" cy="300" r="6" fill="var(--paper)" />
                  <circle
                    cx="300"
                    cy="300"
                    r="80"
                    stroke="var(--sky)"
                    strokeOpacity=".45"
                    strokeDasharray="2 8"
                  />

                  <g transform={`translate(${300 + Math.cos(eased * Math.PI * 2) * 245} ${300 + Math.sin(eased * Math.PI * 2) * 245})`}>
                    <circle r="9" fill="var(--green)" stroke="var(--paper)" />
                    <circle r="3" fill="var(--paper)" />
                  </g>

                  <path d="M18 18h18M18 18v18M582 18h-18M582 18v18M18 582h18M18 582v-18M582 582h-18M582 582v-18" stroke="var(--paper)" strokeOpacity=".65" />
                  <g fill="var(--paper)" fontFamily="DM Mono, monospace" fontSize="9" letterSpacing="1.5">
                    <text x="24" y="48" opacity=".6">FIG. 03 / ARC IN TRANSIT</text>
                    <text x="452" y="48" opacity=".6">R — 245</text>
                    <text x="24" y="570" opacity=".6">STATE — {stageLabel.toUpperCase()}</text>
                    <text x="444" y="570" opacity=".6">Ø {String(Math.round(rotation)).padStart(3, "0")}°</text>
                  </g>
                  <path d="M300 24v18M300 558v18M24 300h18M558 300h18" stroke="var(--sky)" strokeOpacity=".7" />
                </svg>
              </div>
              <div className="absolute -bottom-3 -right-3 flex items-center gap-2 bg-green px-3 py-2 md:-bottom-4 md:-right-4">
                <Asterisk className="size-2.5 text-paper" />
                <span className="mono text-paper">{stageLabel} / {String(Math.round(eased * 100)).padStart(2, "0")}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1720px] px-5 pb-4 md:px-10">
            <div className="flex items-center gap-4 border-t border-paper/25 pt-3">
              <div className="hidden grow grid-cols-4 gap-4 md:grid">
                {labels.map((label, index) => (
                  <span
                    key={label}
                    className={`mono transition-opacity duration-300 ${
                      eased > index * 0.24 ? "text-paper" : "text-paper/30"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")} — {label}
                  </span>
                ))}
              </div>
              <div className="h-px grow bg-paper/20">
                <div className="h-full bg-sky" style={{ width: `${Math.max(eased * 100, 0.5)}%` }} />
              </div>
              <span className="mono shrink-0 text-paper/50">AUTOPLAY: OFF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
