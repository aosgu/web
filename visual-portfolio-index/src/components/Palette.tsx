import { useState } from "react";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import { COLORS, hexToRgb } from "../lib/palette";

const primary = [
  { name: "Field Green", hex: COLORS.green, role: "Primary field", bg: "bg-green", ink: "text-paper" },
  { name: "Signal Blue", hex: COLORS.blue, role: "Secondary field", bg: "bg-blue", ink: "text-paper" },
  { name: "Grid Grey", hex: COLORS.grey, role: "Ground & grid", bg: "bg-paper", ink: "text-ink" },
];

const derived = [
  { name: "Sky", hex: COLORS.sky, note: "Light arc", bg: "bg-sky", ink: "text-ink" },
  { name: "Navy", hex: COLORS.navy, note: "Shadowed horn", bg: "bg-navy", ink: "text-paper" },
];

function Swatch({ c, index }: { c: (typeof primary)[number]; index: number }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(c.hex);
    } catch {
      /* clipboard may be unavailable; still show feedback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      onClick={copy}
      data-hover
      aria-label={`Copy ${c.name} ${c.hex}`}
      className={`group relative flex min-h-[60vh] flex-1 flex-col justify-between overflow-hidden p-6 text-left transition-[flex] duration-700 ease-out hover:flex-[2.4] md:p-8 ${c.bg} ${c.ink}`}
    >
      <div className="flex items-start justify-between font-mono text-xs uppercase tracking-[0.18em]">
        <span>0{index + 1}</span>
        <span className={`transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"}`}>Copied ✓</span>
      </div>

      <div>
        <div className="text-[clamp(2.2rem,4.2vw,4.6rem)] font-medium leading-none tracking-[-0.04em]">{c.name}</div>
        <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-[0.14em]">
          <span className="opacity-60">HEX</span>
          <span>{c.hex.toUpperCase()}</span>
          <span className="opacity-60">RGB</span>
          <span>{hexToRgb(c.hex)}</span>
          <span className="opacity-60">Role</span>
          <span>{c.role}</span>
        </div>
      </div>
    </button>
  );
}

export default function Palette() {
  return (
    <section id="palette" className="relative px-6 py-28 md:px-12">
      <Reveal>
        <SectionLabel index="02" title="Palette" />
        <h2 className="mt-6 max-w-[16ch] text-[clamp(2.6rem,6vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.04em]">
          Three colours, pulled from one frame.
        </h2>
      </Reveal>

      <Reveal delay={150} className="mt-16">
        <div className="flex flex-col border border-ink md:flex-row">
          {primary.map((c, i) => (
            <div key={c.name} className={`flex flex-1 ${i > 0 ? "border-t border-ink md:border-l md:border-t-0" : ""}`}>
              <Swatch c={c} index={i} />
            </div>
          ))}
        </div>

        {/* Proportion of the frame */}
        <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-60">Proportion in frame (approx.)</p>
            <div className="mt-4 flex h-14 w-full overflow-hidden border border-ink">
              <div className="flex items-center bg-paper px-4 font-mono text-xs" style={{ width: "50%" }}>
                Grey 50%
              </div>
              <div className="flex items-center bg-green px-4 font-mono text-xs text-paper" style={{ width: "25%" }}>
                Green 25%
              </div>
              <div className="flex items-center bg-blue px-4 font-mono text-xs text-paper" style={{ width: "25%" }}>
                Blue 25%
              </div>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-60">Derived tints</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {derived.map((d) => (
                <div key={d.name} className={`flex h-14 items-center justify-between px-4 font-mono text-xs uppercase tracking-[0.14em] ${d.bg} ${d.ink}`}>
                  <span>{d.name}</span>
                  <span className="opacity-80">{d.hex.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
