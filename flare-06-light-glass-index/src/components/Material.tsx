import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Pill, css, type Hue } from "./Glass";
import { useScrollProgress } from "../hooks/useScroll";

const disciplines: { label: string; hue: Hue }[] = [
  { label: "Art direction", hue: "gold" },
  { label: "Interaction design", hue: "rose" },
  { label: "Motion systems", hue: "azure" },
  { label: "Brand identity", hue: "sun" },
  { label: "Creative coding", hue: "ice" },
  { label: "Editorial", hue: "prism" },
  { label: "Spatial interfaces", hue: "volt" },
  { label: "Type design", hue: "dusk" },
];

export function Chips() {
  const items = [...disciplines, ...disciplines];
  return (
    <section className="chips" aria-label="Disciplines">
      <div className="chips__glow" aria-hidden="true" />
      <div className="chips__track">
        {items.map((item, index) => (
          <span key={index} className="chip-glass rim" aria-hidden={index >= disciplines.length}>
            <i className={`g-${item.hue}`} />
            {item.label}
          </span>
        ))}
      </div>
    </section>
  );
}

function EmitIcon() {
  return (
    <svg viewBox="0 0 72 72" className="note-icon" aria-hidden="true">
      <rect x="29" y="14" width="14" height="44" rx="7" />
      {[-60, -30, 0, 30, 60, 120, 150, 180, 210, 240].map((angle) => (
        <path key={angle} d="M36 4v5" transform={`rotate(${angle} 36 36)`} />
      ))}
    </svg>
  );
}

function RefractIcon() {
  return (
    <svg viewBox="0 0 72 72" className="note-icon" aria-hidden="true">
      <rect x="24" y="8" width="24" height="56" rx="12" />
      <path d="M36 10v52" strokeDasharray="2 3" />
      <path d="M4 26l20 8M48 38l20 6M48 34l20-2" />
    </svg>
  );
}

function DiffuseIcon() {
  return (
    <svg viewBox="0 0 72 72" className="note-icon" aria-hidden="true">
      <circle cx="36" cy="36" r="6" />
      <circle cx="36" cy="36" r="15" strokeDasharray="1 4" />
      <circle cx="36" cy="36" r="25" strokeDasharray="1 6" />
      <circle cx="36" cy="36" r="33" strokeDasharray="1 9" />
    </svg>
  );
}

const notes: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: "Emit",
    text: "Colour starts as a source, never a fill. Every surface is lit from the inside and allowed to spill onto its surroundings.",
    icon: <EmitIcon />,
  },
  {
    title: "Refract",
    text: "Glass interrupts the light and splits the reading in two: one half sharp, one half soft, always a seam of white between.",
    icon: <RefractIcon />,
  },
  {
    title: "Diffuse",
    text: "Grain, blur and bloom turn a digital gradient into something that feels photographed rather than rendered.",
    icon: <DiffuseIcon />,
  },
];

const swatches: { name: string; hex: string; hue: Hue }[] = [
  { name: "Lemon", hex: "#FFE600", hue: "gold" },
  { name: "Ember", hex: "#FF7A00", hue: "sun" },
  { name: "Heat", hex: "#FF3D00", hue: "coral" },
  { name: "Rose", hex: "#FF2D7A", hue: "rose" },
  { name: "Volt", hex: "#0055FF", hue: "azure" },
  { name: "Ice", hex: "#00C8F0", hue: "ice" },
];

const backdrop: { left: number; hue: Hue; speed: number }[] = [
  { left: 2, hue: "sun", speed: 30 },
  { left: 19, hue: "rose", speed: -22 },
  { left: 36, hue: "dusk", speed: 38 },
  { left: 54, hue: "azure", speed: -30 },
  { left: 71, hue: "volt", speed: 26 },
  { left: 88, hue: "gold", speed: -34 },
];

function TiltCard({ index, title, text, icon }: { index: number; title: string; text: string; icon: ReactNode }) {
  const tilt = (event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
    card.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
  };
  const reset = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <div data-reveal="lift" style={css({ "--d": `${index * 0.12}s` })}>
      <article className="glass-card rim" onPointerMove={tilt} onPointerLeave={reset}>
        <span className="glass-card__spec" aria-hidden="true" />
        <div className="glass-card__top">
          {icon}
          <span className="kicker">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <h3 className="serif-i">{title}</h3>
        <p>{text}</p>
      </article>
    </div>
  );
}

export function Material() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useScrollProgress(sectionRef, (progress) => sectionRef.current?.style.setProperty("--mp", progress.toFixed(4)), "pass");

  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => undefined);
    setCopied(hex);
    window.setTimeout(() => setCopied((current) => (current === hex ? null : current)), 1400);
  };

  return (
    <section id="material" ref={sectionRef} className="material">
      <div className="material__light" aria-hidden="true">
        {backdrop.map((item) => (
          <Pill key={item.left} hue={item.hue} className="mat-pill" style={css({ left: `${item.left}%`, "--sp": String(item.speed) })} />
        ))}
      </div>
      <div className="material__veil" aria-hidden="true" />

      <div className="material__inner">
        <div className="material__head" data-reveal="">
          <p className="kicker">04 — Material</p>
          <h2>
            <span className="line"><span>A material,</span></span>
            <span className="line"><span className="serif-i" style={css({ "--d": ".1s" })}>not a palette.</span></span>
          </h2>
        </div>

        <div className="material__grid">
          {notes.map((note, index) => (
            <TiltCard key={note.title} index={index} {...note} />
          ))}
        </div>

        <div className="swatches" data-reveal="fade">
          <span className="kicker">Flare spectrum — click to copy</span>
          <div className="swatches__row">
            {swatches.map((swatch) => (
              <button key={swatch.hex} type="button" className="swatch" onClick={() => copy(swatch.hex)}>
                <Pill hue={swatch.hue} className="swatch__pill" />
                <span className="swatch__name">{swatch.name}</span>
                <span className="swatch__hex">{copied === swatch.hex ? "Copied" : swatch.hex}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
