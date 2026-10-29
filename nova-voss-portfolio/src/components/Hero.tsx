import type { CSSProperties } from "react";
import { ArrowUpRight, Asterisk, Cross } from "./Motion";
import { cn } from "@/utils/cn";

export function HeroSpecimen({ className }: { className?: string }) {
  return (
    <div className={cn("hero-specimen group relative w-full", className)}>
      <div className="mb-3 flex items-center justify-between border-b border-ink/25 pb-2">
        <span className="mono flex items-center gap-2">
          <span className="size-1.5 bg-blue" />
          Specimen 001
        </span>
        <span className="mono opacity-50">Grid / Arc / Field</span>
      </div>

      <div className="specimen-shadow relative aspect-square overflow-hidden border border-ink/60 bg-paper">
        <svg viewBox="0 0 480 480" className="size-full" role="img" aria-label="Abstract four-quadrant study in green, blue, cream and navy">
          <defs>
            <pattern id="heroGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="var(--ink)" strokeOpacity=".16" strokeWidth=".7" />
            </pattern>
            <pattern id="heroGridMajor" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M80 0H0V80" fill="none" stroke="var(--ink)" strokeOpacity=".22" strokeWidth="1" />
            </pattern>
            <clipPath id="hero-frame">
              <rect width="480" height="480" />
            </clipPath>
          </defs>

          <g clipPath="url(#hero-frame)">
            <rect width="480" height="480" fill="var(--paper)" />
            <rect width="240" height="240" fill="var(--green)" />
            <rect x="240" y="240" width="240" height="240" fill="var(--blue)" />

            <g className="transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.035]">
              <path d="M240 240 240 92 A148 148 0 0 0 92 240 Z" fill="var(--sky)" />
              <path d="M240 240 240 84 A156 156 0 0 1 396 240 Z" fill="var(--green)" opacity=".92" />
              <path d="M240 240 240 72 A168 168 0 0 0 72 240 Z" fill="var(--navy)" />
              <path d="M240 240 240 96 A144 144 0 0 1 384 240 Z" fill="var(--paper)" />
            </g>

            <rect width="480" height="480" fill="url(#heroGrid)" />
            <rect width="480" height="480" fill="url(#heroGridMajor)" />

            <path d="M0 240h480M240 0v480" stroke="var(--ink)" strokeOpacity=".3" strokeWidth="1" />
            <circle cx="240" cy="240" r="52" fill="none" stroke="var(--paper)" strokeOpacity=".55" />
            <circle cx="240" cy="240" r="7" fill="var(--ink)" />
            <circle cx="240" cy="240" r="2.5" fill="var(--paper)" />

            <g
              className="spin-slow"
              style={{ transformOrigin: "240px 240px", transformBox: "view-box" }}
            >
              <circle cx="240" cy="30" r="5" fill="var(--paper)" />
              <path d="M240 30v32" stroke="var(--paper)" strokeOpacity=".55" />
            </g>

            <path d="M20 20h22M20 20v22M460 20h-22M460 20v22" stroke="var(--paper)" strokeWidth="1.2" />
            <path d="M20 460h22M20 460v-22M460 460h-22M460 460v-22" stroke="var(--paper)" strokeWidth="1.2" />

            <g fill="var(--paper)" fontFamily="DM Mono, monospace" fontSize="7.5" letterSpacing="1.8">
              <text x="28" y="52">FORM / FIELD</text>
              <text x="378" y="52">N.V. — 026</text>
              <text x="28" y="438">FOUR QUADRANTS</text>
            </g>
          </g>
        </svg>

        <a
          href="mailto:hello@novavoss.studio"
          className="arc-button absolute bottom-3 left-3 z-10 flex size-14 items-center justify-center rounded-full bg-blue text-paper md:size-16"
          aria-label="Say hello by email"
        >
          <span className="flex flex-col items-center gap-1">
            <ArrowUpRight className="size-4" />
            <span className="font-mono text-[7px] uppercase tracking-[0.08em]">Say hi</span>
          </span>
        </a>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end p-4 text-paper mix-blend-difference">
          <span className="serif text-4xl italic leading-none md:text-5xl">Aa</span>
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        <p className="mono max-w-[230px] leading-relaxed opacity-60">
          A rotating study in tension, proportion &amp; negative space.
        </p>
        <span className="mono whitespace-nowrap opacity-50">48° 51′ N</span>
      </div>
    </div>
  );
}

function OrbitBadge() {
  return (
    <div className="relative hidden size-[clamp(74px,8.4vw,124px)] shrink-0 items-center justify-center md:flex">
      <svg viewBox="0 0 120 120" className="spin-slower absolute inset-0 size-full" fill="none" aria-hidden="true">
        <defs>
          <path id="badgePath" d="M60 11a49 49 0 1 1-0.1 0" />
        </defs>
        <text fill="var(--ink)" fontFamily="DM Mono, monospace" fontSize="8" letterSpacing="2.1">
          <textPath href="#badgePath">OPEN FOR SELECT PROJECTS · 2026 ·</textPath>
        </text>
      </svg>
      <svg viewBox="0 0 100 100" className="size-[48%]" fill="none" aria-hidden="true">
        <circle cx="50" cy="50" r="48" fill="var(--green)" />
        <path d="M30 62 50 32l20 30H30Z" fill="var(--paper)" />
        <circle cx="50" cy="57" r="5" fill="var(--ink)" />
      </svg>
    </div>
  );
}

export function Hero({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[68px] md:pt-[76px]">
      <div className="page-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-ink/15 md:right-[41.666%]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-px bg-blue md:h-48" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1720px] flex-1 flex-col px-5 md:px-10">
        <div className="enter flex items-center justify-between gap-4 border-b border-ink/20 py-3" style={{ "--enter-delay": "950ms" } as CSSProperties}>
          <span className="mono flex items-center gap-2.5">
            <Asterisk className="size-2.5 text-green" />
            Portfolio — Vol. 04
          </span>
          <span className="mono hidden opacity-55 sm:block">Selected experiments · 2022—2026</span>
          <span className="mono flex items-center gap-2 opacity-65">
            <span className="hidden sm:inline">Scroll</span>
            <svg viewBox="0 0 12 18" className="size-3" fill="none" aria-hidden="true">
              <path d="M6 0v15m0 0 4-4m-4 4L2 11" stroke="currentColor" />
            </svg>
          </span>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-x-10 gap-y-10 py-7 md:grid-cols-12 md:items-center md:py-10">
          <div className="md:col-span-8 lg:col-span-7">
            <div className="enter mb-4 flex items-center gap-3 md:mb-6" style={{ "--enter-delay": "1050ms" } as CSSProperties}>
              <span className="flex size-2 items-center justify-center rounded-full border border-ink/60">
                <span className="size-1 rounded-full bg-blue" />
              </span>
              <span className="mono opacity-70">Designer &amp; creative developer</span>
              <span className="mono hidden text-ink/40 sm:inline">London / Worldwide</span>
            </div>

            <h1 className="display hero-display relative" aria-label="Form is a verb">
              <span className="enter-line hero-line">
                <span style={{ "--enter-delay": "1100ms" } as CSSProperties}>
                  FORM<span className="ml-[0.08em] align-top font-mono text-[0.12em] font-normal tracking-normal opacity-55">®</span>
                </span>
              </span>
              <span className="flex items-end gap-3 md:gap-5">
                <span className="enter-line hero-line flex-1">
                  <span style={{ "--enter-delay": "1200ms" } as CSSProperties}>
                    IS <span className="serif font-normal italic tracking-[-0.055em]">a</span>
                  </span>
                </span>
                <span className="mb-[0.35em] hidden items-center gap-2 sm:flex">
                  <span className="mono rotate-[-90deg] whitespace-nowrap opacity-50">not a noun</span>
                  <span className="h-[1px] w-8 bg-ink/35" />
                </span>
              </span>
              <span className="flex items-end justify-between gap-4">
                <span className="enter-line hero-line">
                  <span style={{ "--enter-delay": "1300ms" } as CSSProperties}>
                    VERB<span className="text-blue">.</span>
                  </span>
                </span>
                <OrbitBadge />
              </span>
            </h1>

            <div className="enter mt-7 grid gap-x-8 gap-y-5 border-t border-ink/25 pt-4 sm:grid-cols-[1fr_1.25fr] md:mt-9" style={{ "--enter-delay": "1450ms" } as CSSProperties}>
              <div className="flex items-center gap-4">
                <span className="flex size-9 items-center justify-center rounded-full border border-ink/30">
                  <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" />
                  </svg>
                </span>
                <button onClick={() => onNavigate("work")} className="mono border-b border-ink/40 pb-1 transition-colors hover:border-blue hover:text-blue">
                  Explore the studies
                </button>
              </div>
              <p className="body-copy max-w-[410px] text-ink/80">
                I make digital things that reward a closer look — identities, interfaces, and kinetic
                type systems built with equal parts logic and instinct.
              </p>
            </div>
          </div>

          <div className="enter relative md:col-span-4 lg:col-span-5 lg:pl-[7%]" style={{ "--enter-delay": "1350ms" } as CSSProperties}>
            <div className="mb-3 flex items-center justify-between">
              <span className="mono opacity-50">Fig. 01</span>
              <span className="mono flex items-center gap-2">
                Language of curves <Cross className="size-2.5 text-green" />
              </span>
            </div>
            <div className="ml-auto w-[88%] md:w-full">
              <HeroSpecimen />
            </div>

          </div>
        </div>

        <div className="enter flex items-end justify-between border-t border-ink/20 py-3.5" style={{ "--enter-delay": "1550ms" } as CSSProperties}>
          <div className="flex items-center gap-3">
            <span className="mono opacity-45">Scroll to explore</span>
            <span className="relative h-8 w-px overflow-hidden bg-ink/20">
              <span className="absolute inset-x-0 top-0 h-3 animate-[scrollLine_1.8s_cubic-bezier(.76,0,.24,1)_infinite] bg-blue" />
            </span>
          </div>
          <div className="mono flex items-center gap-6 opacity-50">
            <span className="hidden sm:inline">51.5072° N / 0.1276° W</span>
            <span className="hidden md:inline">CLICK / DRAG / SCROLL</span>
            <span className="size-1.5 rounded-full bg-green" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          55%, 100% { transform: translateY(280%); }
        }
      `}</style>
    </section>
  );
}
