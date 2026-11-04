import type { RefObject } from "react";
import { Monogram, SHEETS, pad2 } from "./ui";

type Props = {
  sheet: number;
  fracs: number[];
  onGo: (i: number) => void;
  penRef: RefObject<HTMLDivElement | null>;
  barRef: RefObject<HTMLDivElement | null>;
  coordRef: RefObject<HTMLDivElement | null>;
  coordTextRef: RefObject<HTMLSpanElement | null>;
};

const TICKS = {
  backgroundImage:
    "repeating-linear-gradient(90deg,#C6C2B2 0 1px,transparent 1px 16px),repeating-linear-gradient(90deg,#0E1512 0 1px,transparent 1px 80px)",
  backgroundSize: "100% 7px, 100% 13px",
  backgroundPosition: "left bottom, left bottom",
  backgroundRepeat: "repeat-x, repeat-x",
};

export function Chrome({ sheet, fracs, onGo, penRef, barRef, coordRef, coordTextRef }: Props) {
  const active = SHEETS[sheet] ?? SHEETS[0];

  return (
    <>
      {/* drafting frame */}
      <div className="sheet-frame" aria-hidden />

      {/* ── ruler / navigation ─────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-50 h-11 select-none">
        <div className="flex h-full items-stretch border-b border-ink bg-vellum/95 backdrop-blur-[2px]">
          <div className="hidden w-[212px] shrink-0 items-center gap-2.5 border-r border-ink px-3.5 sm:flex">
            <Monogram className="h-[22px] w-[22px] text-ink" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
              Iris Halden
            </span>
            <span className="ml-auto font-mono text-[9px] tracking-[0.14em] text-ash">06</span>
          </div>

          <div className="relative min-w-0 flex-1">
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-[13px] opacity-80" style={TICKS} />

            {/* travelling pen carriage */}
            <div
              ref={penRef}
              aria-hidden
              className="absolute bottom-0 left-0 h-full w-0 transition-none"
            >
              <div className="absolute bottom-0 left-0 h-full w-px -translate-x-1/2 bg-pen" />
              <div className="absolute bottom-0 left-0 -translate-x-1/2 border-x-[5px] border-t-[7px] border-x-transparent border-t-pen" />
            </div>

            {/* scroll progress */}
            <div
              ref={barRef}
              aria-hidden
              className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-pen"
              style={{ transform: "scaleX(0)" }}
            />

            <nav aria-label="Sheet navigation" className="absolute inset-0">
              {fracs.map((f, i) => {
                const shift = i === 0 ? "translateX(0)" : i === fracs.length - 1 ? "translateX(-100%)" : "translateX(-50%)";
                const on = i === sheet;
                return (
                  <button
                    key={SHEETS[i]?.id ?? i}
                    onClick={() => onGo(i)}
                    aria-current={on ? "true" : undefined}
                    aria-label={`Go to sheet ${pad2(i)} — ${SHEETS[i]?.title ?? ""}`}
                    className="group absolute top-0 h-full w-0"
                    style={{ left: `${f * 100}%` }}
                  >
                    <span
                      aria-hidden
                      className={`absolute bottom-0 left-0 h-[13px] w-px -translate-x-1/2 ${
                        on ? "bg-pen" : "bg-ink/45 group-hover:bg-ink"
                      }`}
                    />
                    <span
                      className={`absolute left-0 top-1.5 whitespace-nowrap px-1.5 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors ${
                        on ? "text-pen" : "text-ash group-hover:text-ink"
                      }`}
                      style={{ transform: shift }}
                    >
                      <span className="hidden sm:inline">{SHEETS[i]?.nav ?? pad2(i)}</span>
                      <span className="sm:hidden">{pad2(i)}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="hidden w-[96px] shrink-0 items-center justify-end gap-1 border-l border-ink px-3 sm:flex">
            <span data-pct className="tnum font-mono text-[11px] font-medium text-ink">
              00.0
            </span>
            <span className="font-mono text-[10px] text-ash">%</span>
          </div>
        </div>
      </div>

      {/* ── title block ────────────────────────────────────────── */}
      <div className="fixed bottom-4 right-4 z-50 hidden w-[272px] border border-ink bg-vellum/97 shadow-[4px_4px_0_rgba(14,21,18,0.10)] md:block">
        <div className="flex items-center gap-2 border-b border-ink px-3 py-2">
          <Monogram className="h-[15px] w-[15px] text-ink" />
          <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-ink">
            Drawing · Portfolio
          </span>
          <span className="ml-auto font-mono text-[9px] tracking-[0.14em] text-redline">REV. A</span>
        </div>
        <div className="font-mono text-[10px]">
          <TitleRow k="Sheet" v={`${pad2(sheet)} / 06`} strong />
          <TitleRow k="Title" v={active.title} />
          <TitleRow k="Scale" v="1:1 · A1 · mm" />
          <TitleRow k="Drawn" v="I. Halden · Rotterdam" last />
        </div>
      </div>

      {/* ── mobile status strip ────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex h-9 items-center justify-between border-t border-ink bg-vellum/96 px-4 font-mono text-[10px] uppercase tracking-[0.16em] md:hidden">
        <span className="text-pen">{pad2(sheet)} / 06</span>
        <span className="truncate pl-3 text-ash">{active.title}</span>
        <span className="tnum ml-auto text-ink">
          <span data-pct>00.0</span>%
        </span>
      </div>

      {/* ── pointer coordinate readout ─────────────────────────── */}
      <div
        ref={coordRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
        style={{ transform: "translate3d(-200px,-200px,0)" }}
      >
        <div className="relative">
          <div className="absolute -left-[8px] -top-px h-px w-[17px] bg-pen" />
          <div className="absolute -left-px -top-[8px] h-[17px] w-px bg-pen" />
          <div className="absolute left-3.5 top-3.5 whitespace-nowrap border border-ink/25 bg-vellum/85 px-1.5 py-[3px] font-mono text-[9px] tracking-[0.1em] text-ash">
            <span ref={coordTextRef} className="tnum">
              X 0000 · Y 0000
            </span>
          </div>
        </div>
      </div>

      {/* ── paper grain ────────────────────────────────────────── */}
      <div
        aria-hidden
        className="grain pointer-events-none fixed inset-0 z-[70] opacity-[0.055] mix-blend-multiply"
      />
    </>
  );
}

function TitleRow({ k, v, strong, last }: { k: string; v: string; strong?: boolean; last?: boolean }) {
  return (
    <div className={`flex ${last ? "" : "border-b border-rule"}`}>
      <div className="w-[68px] shrink-0 border-r border-rule bg-vellum-deep/50 px-3 py-[7px] uppercase tracking-[0.16em] text-ash">
        {k}
      </div>
      <div
        className={`flex-1 truncate px-3 py-[7px] tracking-[0.06em] ${
          strong ? "font-medium text-pen" : "text-ink"
        }`}
      >
        {v}
      </div>
    </div>
  );
}
