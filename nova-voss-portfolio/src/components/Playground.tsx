import { useRef, useState, type CSSProperties } from "react";
import { cn } from "@/utils/cn";
import { ArrowUpRight, Cross, SectionLabel } from "./Motion";

const palettes = [
  {
    name: "Field",
    primary: "#0f8a45",
    second: "#7cc4ec",
    deep: "#142c44",
    base: "#e9e4d8",
  },
  {
    name: "Cobalt",
    primary: "#2455f4",
    second: "#7cc4ec",
    deep: "#0f8a45",
    base: "#e9e4d8",
  },
  {
    name: "Signal",
    primary: "#142c44",
    second: "#0f8a45",
    deep: "#2455f4",
    base: "#e9e4d8",
  },
];

const modes = [
  { name: "Quarter", title: "Nested field", note: "Four corners, one center" },
  { name: "Split", title: "Soft divide", note: "A line with a memory" },
  { name: "Orbit", title: "Outer ring", note: "Gravity, drawn" },
  { name: "Fold", title: "Counter fold", note: "The diagonal resists" },
];

type Pointer = { x: number; y: number };

function StageDrawing({
  mode,
  palette,
  pointer,
  tension,
  invert,
}: {
  mode: number;
  palette: (typeof palettes)[number];
  pointer: Pointer;
  tension: number;
  invert: boolean;
}) {
  const cx = 300 + (pointer.x - 0.5) * 120;
  const cy = 300 + (pointer.y - 0.5) * 120;
  const radius = 112 + tension * 1.25;
  const bend = 30 + tension;
  const base = invert ? palette.deep : palette.base;
  const deep = invert ? palette.base : palette.deep;
  const line = invert ? "var(--paper)" : "var(--ink)";

  return (
    <svg viewBox="0 0 600 600" className="size-full" fill="none" aria-hidden="true">
      <defs>
        <pattern id="playGrid" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M25 0H0V25" stroke={line} strokeOpacity=".13" strokeWidth=".7" />
        </pattern>
        <pattern id="playGridMajor" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M100 0H0V100" stroke={line} strokeOpacity=".18" strokeWidth=".9" />
        </pattern>
      </defs>

      <rect width="600" height="600" fill={base} />

      {mode === 0 && (
        <g className="stage-draw">
          <rect width="300" height="300" fill={palette.primary} />
          <rect x="300" y="300" width="300" height="300" fill={palette.deep} />
          <path d={`M600 0H300V300A300 300 0 0 1 600 0Z`} fill={palette.second} opacity=".9" />
          <circle cx={cx} cy={cy} r={radius} fill={base} />
          <circle cx={cx} cy={cy} r={radius * 0.64} fill={palette.second} />
          <circle cx={cx} cy={cy} r={radius * 0.28} fill={palette.primary} />
          <path d={`M${cx} 0v600M0 ${cy}h600`} stroke={line} strokeOpacity=".28" />
          <circle cx={cx} cy={cy} r="4" fill={base} />
        </g>
      )}

      {mode === 1 && (
        <g className="stage-draw">
          <path
            d={`M${cx} 0C${cx + bend} 170 ${cx - bend} 390 ${cx} 600H0V0Z`}
            fill={palette.primary}
          />
          <path
            d={`M${cx} 0C${cx + bend} 170 ${cx - bend} 390 ${cx} 600`}
            stroke={deep}
            strokeWidth="1.5"
          />
          <circle cx={cx + radius * 0.44} cy={cy} r={radius * 0.66} fill={palette.second} />
          <circle cx={cx + radius * 0.44} cy={cy} r={radius * 0.34} fill={base} />
          <path d={`M0 ${cy}h600`} stroke={line} strokeOpacity=".24" strokeDasharray="2 6" />
          <path d={`M${cx} 0v600`} stroke={base} strokeOpacity=".35" />
          <circle cx={cx} cy="600" r="9" fill={deep} />
        </g>
      )}

      {mode === 2 && (
        <g className="stage-draw">
          <rect width="600" height="600" fill={palette.deep} />
          <circle cx={cx} cy={cy} r={radius} fill={palette.primary} />
          <circle cx={cx} cy={cy} r={radius * 1.32} stroke={palette.second} strokeWidth="2" strokeDasharray="2 9" />
          <circle cx={cx} cy={cy} r={radius * 0.64} stroke={base} strokeWidth="18" strokeOpacity=".85" />
          <circle cx={cx} cy={cy} r={radius * 0.32} fill={palette.second} />
          <path d={`M${cx} 20v560M20 ${cy}h560`} stroke={base} strokeOpacity=".25" />
          <circle cx={cx} cy={cy} r="5" fill={base} />
          <circle cx={Math.min(560, cx + radius * 1.32)} cy={cy} r="7" fill={base} />
        </g>
      )}

      {mode === 3 && (
        <g className="stage-draw">
          <rect width="600" height="600" fill={palette.primary} />
          <path d={`M0 600L${cx} 0H600V600Z`} fill={base} />
          <path d={`M${cx} 0H600V600L${cx} 0Z`} fill={palette.second} />
          <path d={`M0 600L${cx} 0`} stroke={palette.deep} strokeWidth="2" />
          <circle cx={cx + (600 - cx) * 0.42} cy={cy + 100} r={radius * 0.58} fill={palette.deep} />
          <circle cx={cx + (600 - cx) * 0.42} cy={cy + 100} r={radius * 0.2} fill={palette.primary} />
          <path d={`M${cx} 0v600`} stroke={palette.deep} strokeOpacity=".5" strokeDasharray="3 7" />
        </g>
      )}

      <rect width="600" height="600" fill="url(#playGrid)" />
      <rect width="600" height="600" fill="url(#playGridMajor)" />
      <path d="M0 300h600M300 0v600" stroke={line} strokeOpacity=".18" />
      <path d={`M${pointer.x * 600} 0v600M0 ${pointer.y * 600}h600`} stroke={line} strokeOpacity=".38" strokeDasharray="1 5" />
      <circle cx={pointer.x * 600} cy={pointer.y * 600} r="4" fill={line} />

      <path
        d="M18 18h20M18 18v20M582 18h-20M582 18v20M18 582h20M18 582v-20M582 582h-20M582 582v-20"
        stroke={line}
        strokeOpacity=".65"
      />
      <g fill={line} fontFamily="DM Mono, monospace" fontSize="8.5" letterSpacing="1.5">
        <text x="24" y="48" opacity=".65">INSTRUMENT / {String(mode + 1).padStart(2, "0")}</text>
        <text x="448" y="48" opacity=".65">X {Math.round(pointer.x * 100)} — Y {Math.round(pointer.y * 100)}</text>
        <text x="24" y="566" opacity=".65">{modes[mode].name.toUpperCase()} / {palettes.findIndex((p) => p.name === palette.name) + 1}</text>
        <text x="458" y="566" opacity=".65">BEND {tension}</text>
      </g>
      <circle cx="300" cy="300" r="2.5" fill={line} opacity=".7" />
    </svg>
  );
}

export function Playground() {
  const [mode, setMode] = useState(0);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [tension, setTension] = useState(58);
  const [pointer, setPointer] = useState<Pointer>({ x: 0.56, y: 0.44 });
  const [invert, setInvert] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const didDrag = useRef(false);
  const palette = palettes[paletteIndex];

  const updatePointer = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    setPointer({ x, y });
    if (dragStart.current) {
      const dx = event.clientX - dragStart.current.x;
      const dy = event.clientY - dragStart.current.y;
      if (Math.hypot(dx, dy) > 7) didDrag.current = true;
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragStart.current = { x: event.clientX, y: event.clientY };
    didDrag.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePointer(event);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragStart.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const step = 0.06;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPointer((p) => ({ ...p, x: Math.max(0, p.x - step) }));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPointer((p) => ({ ...p, x: Math.min(1, p.x + step) }));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setPointer((p) => ({ ...p, y: Math.max(0, p.y - step) }));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setPointer((p) => ({ ...p, y: Math.min(1, p.y + step) }));
    }
  };

  return (
    <section
      id="playground"
      className="relative overflow-hidden border-t border-paper/30 bg-blue text-paper"
      style={{ "--stage": palette.primary } as CSSProperties}
    >
      <div className="grid-major pointer-events-none absolute inset-0 opacity-55" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-[12vw] top-[22%] aspect-square w-[40vw] rounded-full border border-paper/15" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-[6vw] top-[30%] aspect-square w-[28vw] rounded-full border border-sky/30" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1720px] px-5 py-16 md:px-10 md:py-24">
        <SectionLabel index="04" label="Interactive instrument" dark />

        <div className="mt-8 flex flex-col justify-between gap-6 pb-8 md:mt-10 lg:flex-row lg:items-end">
          <div>
            <p className="mono mb-4 flex items-center gap-2 text-sky">
              <Cross className="size-3" color="var(--sky)" /> No brief, no rules
            </p>
            <h2 className="display-tight max-w-[12ch] text-[clamp(3.2rem,7.3vw,8rem)]">
              Shapes that
              <br />
              <span className="serif italic text-sky">listen.</span>
            </h2>
          </div>
          <p className="body-copy max-w-[375px] pb-1 text-paper/70">
            A small generative machine. Move across the stage, pull the tension, switch the palette.
            Nothing here is precious — it is a place to test an instinct.
          </p>
        </div>

        <div className="grid gap-8 border-t border-paper/25 pt-7 lg:grid-cols-[.72fr_1.28fr] lg:gap-12">
          <div className="flex flex-col justify-between gap-9">
            <div>
              <div className="mono mb-3 flex items-center justify-between text-paper/50">
                <span>Choose a composition</span>
                <span>01—04</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {modes.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => setMode(index)}
                    aria-pressed={mode === index}
                    className={cn(
                      "mode-button group flex flex-col items-start border p-3.5 text-left md:p-4",
                      mode === index
                        ? "border-paper bg-paper text-blue"
                        : "border-paper/30 bg-blue/30 text-paper hover:border-paper/80 hover:bg-blue-deep"
                    )}
                  >
                    <span className="mono mb-6 flex w-full items-center justify-between opacity-60">
                      0{index + 1}
                      <span
                        className={cn(
                          "size-2 rounded-full transition-colors",
                          mode === index ? "bg-green" : "border border-paper/50"
                        )}
                      />
                    </span>
                    <span className="font-sans text-base font-medium leading-none tracking-[-0.04em] md:text-lg">
                      {item.title}
                    </span>
                    <span className="mono-sm mt-2 leading-relaxed opacity-55">{item.note}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <div className="mono mb-3 flex items-center justify-between text-paper/50">
                  <span>Color field</span>
                  <span>{palette.name}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {palettes.map((item, index) => (
                    <button
                      key={item.name}
                      onClick={() => setPaletteIndex(index)}
                      aria-label={`Use ${item.name} palette`}
                      aria-pressed={paletteIndex === index}
                      className={cn(
                        "swatch relative flex h-10 w-10 items-center justify-center rounded-full border-2",
                        paletteIndex === index ? "border-paper" : "border-transparent opacity-70 hover:opacity-100"
                      )}
                    >
                      <span
                        className="absolute inset-[3px] rounded-full border border-ink/20"
                        style={{ background: `linear-gradient(135deg, ${item.primary} 0 52%, ${item.second} 52% 100%)` }}
                      />
                    </button>
                  ))}
                  <button
                    onClick={() => setInvert((value) => !value)}
                    aria-pressed={invert}
                    className="mono ml-2 flex items-center gap-2 border border-paper/30 px-3 py-2.5 transition-colors hover:border-paper hover:bg-paper hover:text-blue"
                  >
                    <span className={cn("relative h-3 w-6 rounded-full border border-current/60 transition-colors", invert && "bg-sky")}>
                      <span
                        className={cn(
                          "absolute top-[2px] size-[7px] rounded-full bg-current transition-transform",
                          invert ? "left-[13px]" : "left-[2px]"
                        )}
                      />
                    </span>
                    Invert
                  </button>
                </div>
              </div>

              <div>
                <div className="mono mb-4 flex items-center justify-between text-paper/50">
                  <span>Tension</span>
                  <span className="tabular-nums">{tension}</span>
                </div>
                <div className="playground-range">
                  <input
                    type="range"
                    min="16"
                    max="130"
                    value={tension}
                    onChange={(event) => setTension(Number(event.target.value))}
                    className="lab-range"
                    aria-label="Shape tension"
                  />
                </div>
                <div className="mono mt-2 flex justify-between text-[8px] text-paper/35">
                  <span>Compressed</span>
                  <span>Expanded</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-paper/25 pt-4">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-paper/30">
                <Cross className="size-2.5" color="var(--sky)" />
              </span>
              <p className="mono leading-relaxed text-paper/55">
                Drag to move the center. Click the stage to cycle compositions. Use arrow keys for a
                slower look.
              </p>
            </div>
          </div>

          <div className="w-full lg:pl-4">
            <div className="mb-2 flex items-center justify-between text-paper/55">
              <span className="mono">The stage / {modes[mode].title}</span>
              <span className="mono hidden sm:block">Click to cycle →</span>
            </div>
            <div className="relative border border-paper/40 bg-paper p-2 md:p-3">
              <button
                type="button"
                onClick={() => {
                  if (didDrag.current) {
                    didDrag.current = false;
                    return;
                  }
                  setMode((value) => (value + 1) % modes.length);
                }}
                onPointerMove={updatePointer}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onKeyDown={onKeyDown}
                className="stage relative block aspect-square w-full cursor-crosshair overflow-hidden bg-paper text-ink"
                aria-label={`Interactive shape stage. Composition ${mode + 1} of 4: ${modes[mode].title}. Use arrow keys to move, press Enter to cycle.`}
              >
                <StageDrawing mode={mode} palette={palette} pointer={pointer} tension={tension} invert={invert} />
                <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 bg-ink px-2 py-1 text-paper">
                  <span className="size-1 rounded-full bg-sky" />
                  <span className="mono text-[8px]">Drag inside</span>
                </span>
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-paper/55">
              <span className="mono">Mode 0{mode + 1}</span>
              <span className="mono text-center">{pointer.x === 0.5 && pointer.y === 0.5 ? "Centered" : "Off-axis"}</span>
              <span className="mono text-right tabular-nums">
                X {Math.round(pointer.x * 100)} / Y {Math.round(pointer.y * 100)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-paper/25 pt-4 sm:flex-row sm:items-center">
          <span className="mono text-paper/45">Built with SVG, React &amp; stubborn curiosity.</span>
          <a href="#type" className="footer-link mono text-sky">
            Continue to the type lab <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>

      <style>{`
        .playground-range .lab-range { background: rgba(233, 228, 216, .32); }
        .playground-range .lab-range::-webkit-slider-thumb {
          background: var(--sky);
          border-color: var(--paper);
          box-shadow: 0 0 0 4px var(--blue);
        }
        .playground-range .lab-range::-moz-range-thumb {
          background: var(--sky);
          border-color: var(--paper);
        }
      `}</style>
    </section>
  );
}
