import { useState } from "react";
import { cn } from "@/utils/cn";
import { ArrowRight, ArrowUpRight, Cross, SectionLabel, Ticker } from "./Motion";

const faces = [
  {
    id: "grotesk",
    name: "Bricolage",
    full: "Bricolage Grotesque",
    descriptor: "A little irregular, on purpose. Display / interface.",
    family: '"Bricolage Grotesque", sans-serif',
    style: "normal",
    weight: 500,
  },
  {
    id: "serif",
    name: "Instrument",
    full: "Instrument Serif",
    descriptor: "An editorial voice with a soft, human cadence.",
    family: '"Instrument Serif", serif',
    style: "italic",
    weight: 400,
  },
  {
    id: "mono",
    name: "DM Mono",
    full: "DM Mono",
    descriptor: "The quiet system beneath every loud decision.",
    family: '"DM Mono", monospace',
    style: "normal",
    weight: 400,
  },
] as const;

const words = ["POSSIBLE", "VARIABLE", "PECULIAR", "MOMENTUM"];

export function TypeLab() {
  const [faceIndex, setFaceIndex] = useState(0);
  const [weight, setWeight] = useState(500);
  const [tracking, setTracking] = useState(-5);
  const [scale, setScale] = useState(100);
  const [baseline, setBaseline] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const face = faces[faceIndex];
  const word = words[wordIndex];

  const effectiveWeight = face.id === "grotesk" ? weight : face.weight;

  const copyPairing = async () => {
    try {
      await navigator.clipboard.writeText(
        `${face.full} + Instrument Serif Italic + DM Mono — set by Nova Voss`
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="type" className="relative overflow-hidden border-t border-ink/25 bg-paper">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-ink/15 lg:right-[30%]" aria-hidden="true" />

      <div className="mx-auto w-full max-w-[1720px] px-5 pt-16 md:px-10 md:pt-24">
        <SectionLabel index="05" label="A living type specimen" />

        <div className="mt-8 flex flex-col justify-between gap-6 border-b border-ink/25 pb-7 md:mt-10 md:flex-row md:items-end">
          <h2 className="display-tight text-[clamp(2.9rem,6.4vw,7.2rem)]">
            Type, <span className="serif italic text-green">with a pulse.</span>
          </h2>
          <div className="flex max-w-[310px] flex-col gap-4 md:items-end md:text-right">
            <p className="body-copy text-sm text-ink/65">
              A specimen is not a museum object. Change its weight, loosen its tracking, put it under
              pressure.
            </p>
            <span className="mono flex items-center gap-2 text-ink/45">
              <span className="size-1.5 animate-pulse rounded-full bg-blue" />
              Controls are live
            </span>
          </div>
        </div>

        <div className="mt-5 border border-ink/30 bg-paper-deep">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/25 px-3 py-2.5 md:px-5">
            <div className="mono flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-green" />
                Specimen 05
              </span>
              <span className="hidden text-ink/35 sm:inline">/</span>
              <span className="hidden text-ink/50 sm:inline">Interactive type setting</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBaseline((value) => !value)}
                aria-pressed={baseline}
                className={cn(
                  "mono border px-2.5 py-1.5 transition-colors",
                  baseline
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/25 hover:border-ink/60"
                )}
              >
                Baseline
              </button>
              <button
                onClick={() => setWordIndex((index) => (index + 1) % words.length)}
                className="mono flex items-center gap-2 border border-ink/25 px-2.5 py-1.5 transition-colors hover:border-ink/60 hover:bg-paper"
                aria-label="Cycle the specimen word"
              >
                Next word <ArrowRight className="size-3" />
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_30%]">
            <div className={cn("relative min-h-[300px] overflow-hidden p-3 md:min-h-[470px] md:p-6", baseline && "lab-baseline")}>
              <div className="flex items-start justify-between gap-4">
                <div className="mono flex items-center gap-2 text-ink/50">
                  <Cross className="size-2.5 text-blue" />
                  {face.full}
                </div>
                <div className="mono text-right text-ink/40">
                  Vol. 04
                  <br />
                  {wordIndex + 1} / {words.length}
                </div>
              </div>

              <div className="flex min-h-[215px] flex-col justify-center md:min-h-[350px]">
                <div
                  key={`${word}-${face.id}`}
                  className="flex w-full items-baseline whitespace-nowrap"
                  aria-label={word}
                  style={{
                    fontFamily: face.family,
                    fontStyle: face.style,
                    fontWeight: effectiveWeight,
                    letterSpacing: `${tracking / 100}em`,
                    fontSize: `clamp(${(3.15 * scale) / 100}rem, ${(12.2 * scale) / 100}vw, ${(12.8 * scale) / 100}rem)`,
                    lineHeight: 0.92,
                    transition:
                      "font-family .3s ease, font-weight .2s ease, letter-spacing .2s ease, font-size .2s ease",
                  }}
                >
                  {word.split("").map((letter, index) => (
                    <span
                      key={`${letter}-${index}`}
                      aria-hidden="true"
                      className="lab-word inline-block"
                      style={{
                        animation: `type-in .65s cubic-bezier(.16,1,.3,1) ${index * 32}ms both`,
                        color: index === 2 ? "var(--blue)" : undefined,
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/20 pt-3">
                  <p
                    className="max-w-[38ch] text-sm leading-snug tracking-[-0.015em] md:text-base"
                    style={{ fontFamily: face.family, fontStyle: face.id === "serif" ? "italic" : "normal" }}
                  >
                    A good letterform knows how to hold a room.
                  </p>
                  <span className="mono text-ink/40">Hover a letter →</span>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-10 right-3 hidden opacity-45 lg:block">
                <span
                  className="block leading-none"
                  style={{
                    fontFamily: face.family,
                    fontStyle: face.style,
                    fontWeight: effectiveWeight,
                    fontSize: "8.5rem",
                    letterSpacing: "-0.08em",
                  }}
                >
                  <span className="text-green">A</span>
                  <span className="text-blue">a</span>
                </span>
              </div>
            </div>

            <aside className="flex flex-col border-t border-ink/25 bg-paper p-4 md:p-5 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between border-b border-ink/20 pb-3">
                <span className="mono">Type selector</span>
                <span className="mono text-ink/40">03 faces</span>
              </div>

              <div className="py-3">
                {faces.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setFaceIndex(index);
                      setWeight(item.weight);
                    }}
                    aria-pressed={faceIndex === index}
                    className={cn(
                      "group flex w-full items-center justify-between gap-3 border-b border-ink/15 py-3 text-left transition-colors last:border-b-0",
                      faceIndex === index ? "text-ink" : "text-ink/50 hover:text-ink"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full border text-xs transition-colors",
                          faceIndex === index ? "border-green bg-green text-paper" : "border-ink/25"
                        )}
                      >
                        Aa
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium tracking-[-0.02em]">{item.name}</span>
                        <span className="mono mt-0.5 text-[8px] opacity-55">{item.full}</span>
                      </span>
                    </span>
                    <span
                      className={cn(
                        "size-1.5 rounded-full border border-ink/40 transition-colors",
                        faceIndex === index && "bg-blue"
                      )}
                    />
                  </button>
                ))}
              </div>

              <div className="mt-2 space-y-5 border-t border-ink/20 pt-4">
                <label className="block">
                  <span className="mono mb-3 flex items-center justify-between text-ink/55">
                    <span>Weight</span>
                    <span className="tabular-nums text-ink">{effectiveWeight}</span>
                  </span>
                  <input
                    type="range"
                    min="200"
                    max="800"
                    step="10"
                    value={weight}
                    onChange={(event) => setWeight(Number(event.target.value))}
                    className="lab-range"
                    aria-label="Font weight"
                    disabled={face.id !== "grotesk"}
                  />
                </label>

                <label className="block">
                  <span className="mono mb-3 flex items-center justify-between text-ink/55">
                    <span>Tracking</span>
                    <span className="tabular-nums text-ink">{tracking / 100 > 0 ? "+" : ""}{tracking / 100}em</span>
                  </span>
                  <input
                    type="range"
                    min="-9"
                    max="8"
                    step="1"
                    value={tracking}
                    onChange={(event) => setTracking(Number(event.target.value))}
                    className="lab-range"
                    aria-label="Letter spacing"
                  />
                </label>

                <label className="block">
                  <span className="mono mb-3 flex items-center justify-between text-ink/55">
                    <span>Scale</span>
                    <span className="tabular-nums text-ink">{scale}%</span>
                  </span>
                  <input
                    type="range"
                    min="70"
                    max="112"
                    step="1"
                    value={scale}
                    onChange={(event) => setScale(Number(event.target.value))}
                    className="lab-range"
                    aria-label="Specimen scale"
                  />
                </label>
              </div>

              <div className="mt-auto pt-6">
                <p className="mono leading-relaxed text-ink/45">{face.descriptor}</p>
                <button
                  onClick={copyPairing}
                  className="mt-4 flex w-full items-center justify-between gap-3 border border-ink/30 px-3 py-2.5 transition-colors hover:bg-green hover:text-paper"
                >
                  <span className="mono">{copied ? "Pairing copied" : "Copy this pairing"}</span>
                  {copied ? <Cross className="size-3" /> : <ArrowUpRight className="size-3.5" />}
                </button>
              </div>
            </aside>
          </div>

          <div className="flex items-center gap-2 overflow-hidden border-t border-ink/25 px-3 py-3 md:px-5" aria-hidden="true">
            <span className="mono mr-3 shrink-0 border-r border-ink/20 pr-3 text-ink/40">Glyphs</span>
            <div className="flex flex-1 justify-between gap-1 overflow-hidden">
              {["A", "a", "B", "b", "G", "g", "Q", "q", "R", "r", "S", "s", "&", "?", "!", "↗"].map(
                (glyph, index) => (
                  <span
                    key={`${glyph}-${index}`}
                    className="lab-word select-none text-[clamp(1.2rem,2.6vw,2.4rem)] leading-none text-ink/60"
                    style={{
                      fontFamily: face.family,
                      fontStyle: index % 3 === 0 ? "italic" : face.style,
                      fontWeight: effectiveWeight,
                    }}
                  >
                    {glyph}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-20">
        <Ticker
          items={["Aa", "Bricolage", "Instrument", "DM Mono", "Ampersand &", "Set in motion"]}
          reverse
          className="border-ink/25 bg-paper"
        />
      </div>

      <div className="mx-auto grid w-full max-w-[1720px] gap-px px-5 py-8 md:grid-cols-3 md:px-10 md:py-10">
        {[
          ["01 / Pairing", "Grotesque + Italic serif + Mono. A structure, a voice, a set of instructions."],
          ["02 / Principle", "Type should feel set, not styled. Contrast is a material, not an effect."],
          ["03 / Practice", "Custom lettering, editorial systems, responsive type behaviour and motion."],
        ].map(([title, copy], index) => (
          <div
            key={title}
            className={cn(
              "border-t border-ink/25 py-4 md:px-5",
              index === 0 && "md:pl-0",
              index === 1 && "md:border-l",
              index === 2 && "md:border-l"
            )}
          >
            <span className="mono text-ink/45">{title}</span>
            <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-ink/65">{copy}</p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes type-in {
          from { opacity: 0; transform: translateY(.35em) rotate(2deg); }
          to { opacity: 1; transform: translateY(0) rotate(0); }
        }
      `}</style>
    </section>
  );
}
