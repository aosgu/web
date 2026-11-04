import { useState } from "react";
import { Arrow, Eyebrow, Monogram, SectionHead, SheetTag, Spec, pad2 } from "./ui";
import fibre from "./assets/plate-fibre.jpg";
import tidal from "./assets/plate-tidal.jpg";
import pavilion from "./assets/plate-pavilion.jpg";
import press from "./assets/plate-press.jpg";

/* ════════════════════════════════════════════════════════
   00 · COVER
   ════════════════════════════════════════════════════════ */

const WAVE_PTS: [number, number][] = (() => {
  const pts: [number, number][] = [];
  for (let x = 24; x <= 696; x += 3) {
    const t = (x - 24) / 672;
    const amp = 122 * (1 - 0.84 * t) + 6;
    pts.push([x, 360 + Math.sin(x / 26) * amp]);
  }
  return pts;
})();

const WAVE_D = "M" + WAVE_PTS.map(([x, y]) => `${x},${y.toFixed(2)}`).join(" L");

const PEN_PTS = WAVE_PTS.filter((_, i) => i % 3 === 0);
const PEN_VALUES = PEN_PTS.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(";");
const PEN_KEYS = PEN_PTS.map((_, i) => (i / (PEN_PTS.length - 1)).toFixed(4)).join(";");

const RING_TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = ((i * 5 - 90) * Math.PI) / 180;
  const long = i % 6 === 0;
  const r1 = long ? 264 : 280;
  const r2 = 296;
  return {
    x1: 360 + Math.cos(a) * r1,
    y1: 360 + Math.sin(a) * r1,
    x2: 360 + Math.cos(a) * r2,
    y2: 360 + Math.sin(a) * r2,
    long,
  };
});

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function HeroDrawing() {
  const reduced = prefersReduced();
  return (
    <svg
      viewBox="0 0 720 720"
      aria-hidden
      focusable="false"
      className="pointer-events-none absolute right-[2%] top-1/2 hidden max-h-[74vh] w-[min(50vw,700px)] -translate-y-1/2 mix-blend-multiply lg:block"
    >
      {/* registration corners */}
      {[
        [24, 24],
        [696, 24],
        [24, 696],
        [696, 696],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} stroke="#0E1512" strokeWidth="1" fill="none" opacity="0.55">
          <path d={`M${x - 14} ${y}h28M${x} ${y - 14}v28`} />
          <rect x={x - 7} y={y - 7} width="14" height="14" />
        </g>
      ))}

      {/* crosshair */}
      <path d="M360 44V676M44 360H676" stroke="#C6C2B2" strokeWidth="1" />

      {/* outer dial */}
      <circle
        cx="360"
        cy="360"
        r="296"
        fill="none"
        stroke="#0E1512"
        strokeWidth="1.2"
        pathLength={1}
        strokeDasharray={1}
        data-hero-draw
      />
      <g stroke="#0E1512" strokeWidth="1" opacity="0.65">
        {RING_TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            strokeWidth={t.long ? 1.6 : 0.8}
            pathLength={1}
            strokeDasharray={1}
            data-hero-draw
          />
        ))}
      </g>

      {/* inner green circle */}
      <circle
        cx="360"
        cy="360"
        r="212"
        fill="none"
        stroke="#0A7A52"
        strokeWidth="1.4"
        pathLength={1}
        strokeDasharray={1}
        data-hero-draw
      />
      {/* quarter arc, pen green */}
      <path
        d="M76 360A284 284 0 0 1 360 76"
        fill="none"
        stroke="#0A7A52"
        strokeWidth="3"
        pathLength={1}
        strokeDasharray={1}
        data-hero-draw
      />
      {/* quarter arc, cobalt */}
      <path
        d="M644 360A284 284 0 0 1 360 644"
        fill="none"
        stroke="#123C8C"
        strokeWidth="3"
        pathLength={1}
        strokeDasharray={1}
        data-hero-draw
      />

      {/* the plotted signal */}
      <path
        id="cover-wave"
        d={WAVE_D}
        fill="none"
        stroke="#123C8C"
        strokeWidth="1.8"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        data-hero-draw
      />

      {/* plotter pen head travelling the signal */}
      <g>
        {!reduced && (
          <animateTransform
            attributeName="transform"
            type="translate"
            dur="11s"
            repeatCount="indefinite"
            calcMode="linear"
            values={PEN_VALUES}
            keyTimes={PEN_KEYS}
          />
        )}
        <circle r="9" fill="#EFEBE1" stroke="#0A7A52" strokeWidth="1.4" />
        <path
          d="M-17 0H-5M5 0H17M0 -17V-5M0 5V17"
          stroke="#0A7A52"
          strokeWidth="1.2"
          fill="none"
        />
        <circle r="1.8" fill="#C93C24" />
      </g>

      {/* annotation */}
      <g
        fill="#6B7268"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="11"
        letterSpacing="1.6"
      >
        <text x="44" y="34">
          PEN 02 / GREEN
        </text>
        <text x="676" y="34" textAnchor="end">
          N 51.92° E 4.48°
        </text>
        <text x="44" y="700">
          SCALE 1:1
        </text>
        <text x="676" y="700" textAnchor="end">
          Ø 592 · 72 DIV
        </text>
        <text x="360" y="330" textAnchor="middle" fill="#0A7A52">
          SIGNAL / DECAY 0.84
        </text>
      </g>
    </svg>
  );
}

export function Cover() {
  return (
    <section className="panel p-cover" id="cover" aria-label="Cover sheet">
      <SheetTag label="Sheet 00 — Cover" />
      <div className="relative mx-auto w-full max-w-[1680px]">
        <HeroDrawing />
        <div className="relative z-10">
          <div className="cover-in flex flex-wrap items-center gap-x-7 gap-y-3">
            <Eyebrow>Portfolio · Edition 06</Eyebrow>
            <Eyebrow tone="ash">Rotterdam NL · 51.92°N 4.48°E</Eyebrow>
            <Eyebrow tone="cobalt">Available Q3 2026</Eyebrow>
          </div>

          <h1 className="expanded mt-7 font-display text-[clamp(3.2rem,11vw,11.5rem)] font-black uppercase leading-[0.84] tracking-[-0.05em]">
            <span className="cover-ln block">Iris</span>
            <span className="cover-ln outline-type block">Halden</span>
          </h1>

          <p className="cover-serif mt-6 max-w-[22ch] font-serif text-[clamp(1.6rem,3vw,3rem)] italic leading-[1.06] text-cobalt">
            Designer <span className="not-italic text-pen">&amp;</span> creative technologist
          </p>

          <p className="cover-body mt-5 max-w-[46ch] text-[15px] leading-[1.68] text-ash md:text-[16.5px]">
            I build identity systems, editorial surfaces and interfaces that behave like instruments —
            a system first, then code until it moves the way it looks.
          </p>

          <div className="cover-foot mt-7 flex flex-wrap items-center gap-x-9 gap-y-3 border-t border-ink pt-4">
            <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink">
              Scroll to advance
              <Arrow className="h-3 w-6 text-pen" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
              06 sheets · 820vw of paper
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
              Independent since 2019
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ash md:inline">
              ← → to jump sheets
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   01 · STATEMENT
   ════════════════════════════════════════════════════════ */

export function Statement() {
  return (
    <section className="panel p-statement" id="statement" aria-label="Statement">
      <SheetTag label="Sheet 01 — Statement" />
      <div className="mx-auto w-full max-w-[1680px]">
        <SectionHead num="01" title="Statement of Intent" right="Rotterdam · est. 2019" />

        <div className="grid gap-x-12 gap-y-9 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <h2
              data-rise
              className="expanded font-display text-[clamp(2rem,4.6vw,4.6rem)] font-black uppercase leading-[0.92] tracking-[-0.045em]"
            >
              Systems that
              <br />
              draw{" "}
              <span className="font-serif text-[1.06em] font-normal italic lowercase tracking-[-0.01em] text-cobalt">
                themselves
              </span>
            </h2>

            <div className="mt-7 grid gap-x-9 gap-y-5 md:grid-cols-2">
              <p data-rise className="text-[15px] leading-[1.72] text-ink/85">
                I work out of a former printing house on the Delfshaven canal, mostly alone. Every
                job starts as a system — a grid, a type scale, a rule for how a mark is allowed to
                move — and ends as something you can hold, scroll or walk through.
              </p>
              <p data-rise className="text-[15px] leading-[1.72] text-ink/85">
                I care about the seam between editorial design and software: the moment a layout
                stops being a picture of an interface and starts behaving like one. Everything here
                was drawn, coded and set by hand, in that order.
              </p>
            </div>

            <div data-rise className="mt-8 border-l-2 border-pen pl-5">
              <p className="font-serif text-[clamp(1.15rem,1.7vw,1.6rem)] italic leading-[1.35] text-ink">
                “A grid is a promise. The interesting part is deciding which parts of it you are
                allowed to break.”
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
                — Lecture notes, TypeLab Amsterdam
              </p>
            </div>
          </div>

          <div className="xl:col-span-5">
            <div data-rise>
              <Eyebrow>Practice record</Eyebrow>
              <div className="mt-4">
                <Spec
                  rows={[
                    ["Base", "Vierhavensstraat 44, Rotterdam NL"],
                    ["Focus", "Identity · Editorial · Interface"],
                    ["Method", "Research → System → Artefact"],
                    ["Teaching", "Willem de Kooning Academie, guest tutor"],
                    ["Status", "Booking projects from Q3 2026"],
                  ]}
                />
              </div>
            </div>

            <div data-rise className="mt-7 flex items-end justify-between gap-6">
              <svg
                viewBox="0 0 240 74"
                className="h-[70px] w-[240px] text-ink"
                aria-label="Iris Halden, drawn signature"
                role="img"
              >
                <path
                  d="M6 56C22 8 30 66 44 34S66 6 78 50s18 22 34-14 22 30 40 6 22-38 44-16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  data-draw
                />
                <path
                  d="M14 68H226"
                  fill="none"
                  stroke="#0A7A52"
                  strokeWidth="1.4"
                  pathLength={1}
                  strokeDasharray={1}
                  data-draw
                />
                <circle cx="232" cy="20" r="4" fill="#C93C24" />
              </svg>
              <span className="pb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ash">
                Signed<br />2026.04.11
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   02 · SELECTED WORK
   ════════════════════════════════════════════════════════ */

const PROJECTS = [
  {
    no: "Plate 001",
    title: "Fibre Atlas",
    year: "2025",
    discipline: "Identity · Type system",
    img: fibre,
    alt: "Woven green and blue textile swatches fanned across warm drafting paper",
    detail:
      "A generative identity for an archive of 12,000 cloth samples. The wordmark re-weights itself from the weave density of whichever sample is on screen.",
    spec: [
      ["Role", "Art direction, type design, front-end"],
      ["Stack", "Glyphs · WebGL · Astro"],
      ["Team", "3 · 7 months"],
    ] as const,
    rev: "Rev. C — 2025.11",
  },
  {
    no: "Plate 002",
    title: "Tidal Grid",
    year: "2025",
    discipline: "Data interface",
    img: tidal,
    alt: "A pen-plotter drawing of dense blue and green tide curves on off-white paper",
    detail:
      "A live sea-level dashboard for the North Sea coast: 41 gauges, sixty years of record, and a colour system that reads at a glance from a harbour office wall.",
    spec: [
      ["Role", "Design lead, data art direction"],
      ["Stack", "D3 · Svelte · MapLibre"],
      ["Team", "5 · 14 months"],
    ] as const,
    rev: "Rev. B — 2025.06",
  },
  {
    no: "Plate 003",
    title: "Oko Pavilion",
    year: "2024",
    discipline: "Spatial · Motion",
    img: pavilion,
    alt: "Daylight view through a pavilion of aluminium ribs strung with green and blue thread",
    detail:
      "480 threaded aluminium ribs that tighten and slacken with the tide signal, so the pavilion's colour shifts over a 12-hour cycle. Programmed on site in four nights.",
    spec: [
      ["Role", "Motion system, on-site programming"],
      ["Stack", "TouchDesigner · Rust"],
      ["Team", "4 · 3 months"],
    ] as const,
    rev: "Rev. A — 2024.09",
  },
  {
    no: "Plate 004",
    title: "Press Play",
    year: "2023",
    discipline: "Editorial · Book",
    img: press,
    alt: "An open large-format book printed with green and blue geometric spreads",
    detail:
      "A 240-page survey of early web graphics, set in a two-column measure that collapses to a single spine of captions. Printed two-colour on a Riso F590.",
    spec: [
      ["Role", "Editor, designer"],
      ["Stack", "InDesign · Riso · 1,500 copies"],
      ["Team", "Solo · 9 months"],
    ] as const,
    rev: "Rev. D — 2023.05",
  },
];

function Plate({
  p,
  open,
  onToggle,
}: {
  p: (typeof PROJECTS)[number];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article data-rise className="group relative flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="block w-full cursor-pointer text-left"
      >
        <div className="mb-2.5 flex items-baseline justify-between border-b border-ink pb-1.5">
          <span className="font-mono text-[10px] tracking-[0.2em] text-pen">{p.no}</span>
          <span className="tnum font-mono text-[10px] tracking-[0.16em] text-ash">{p.year}</span>
        </div>

        <div className="relative overflow-hidden bg-vellum-deep">
          <img
            src={p.img}
            alt={p.alt}
            className="plate-media block aspect-[4/3] w-full object-cover md:max-h-[36vh]"
          />
          <span
            aria-hidden
            className="absolute left-2 top-2 h-5 w-5 border-l border-t border-pen opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span
            aria-hidden
            className="absolute bottom-2 right-2 h-5 w-5 border-b border-r border-pen opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="absolute bottom-2.5 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-vellum opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {open ? "close record" : "open record"}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 bg-blueprint/35 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          {/* record slides up over the plate — no layout shift */}
          <div
            className={`absolute inset-x-0 bottom-0 max-h-full overflow-hidden border-t border-ink bg-vellum/97 px-3.5 py-3 transition-transform duration-500 ${
              open ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
          >
            <p className="text-[13px] leading-[1.55] text-ink/90">{p.detail}</p>
            <div className="mt-2.5">
              <Spec rows={p.spec} />
            </div>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-redline">
              {p.rev}
            </p>
          </div>
        </div>

        <h3 className="expanded mt-3.5 font-display text-[clamp(1.15rem,1.7vw,1.75rem)] font-black uppercase leading-none tracking-[-0.035em] transition-colors duration-300 group-hover:text-pen">
          {p.title}
        </h3>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
          {p.discipline}
        </p>
      </button>
    </article>
  );
}

export function Work() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="panel p-work" id="work" aria-label="Selected work">
      <SheetTag label="Sheet 02 — Selected Work" />
      <div className="mx-auto w-full">
        <SectionHead num="02" title="Selected Work" right="04 plates · 2023–2026" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-7">
          {PROJECTS.map((p, i) => (
            <Plate
              key={p.title}
              p={p}
              open={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
        <div
          data-rise
          className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-rule pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ash"
        >
          <span className="text-pen">↳ Click a plate to open its record</span>
          <span>Full case studies on request</span>
          <span className="tnum">04 of 41 projects shown</span>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   03 · CAPABILITY INDEX
   ════════════════════════════════════════════════════════ */

const CAPS = [
  ["Brand systems", "12 programmes shipped", "Illustrator · Glyphs", "08", 0.94],
  ["Editorial & type", "Books, journals, specimens", "InDesign · Riso", "07", 0.86],
  ["Motion", "Identity motion, title sequences", "After Effects · Lottie", "06", 0.74],
  ["Creative code", "Installations, generative work", "WebGL · TouchDesigner", "05", 0.81],
  ["Data visualisation", "Dashboards, reports, maps", "D3 · Observable", "04", 0.68],
  ["Design systems", "Tokens, docs, governance", "Figma · Style Dictionary", "04", 0.77],
] as const;

const COLS =
  "grid grid-cols-[1fr_auto] md:grid-cols-[minmax(150px,1.15fr)_minmax(150px,1.25fr)_minmax(140px,1.1fr)_46px_minmax(80px,0.95fr)]";

export function Capability() {
  return (
    <section className="panel p-capability" id="capability" aria-label="Capability index">
      <SheetTag label="Sheet 03 — Capability" />
      <div className="mx-auto w-full max-w-[1680px]">
        <SectionHead num="03" title="Capability Index" right="06 disciplines · self-assessed" />

        <div className="grid gap-x-12 gap-y-9 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <div className={`${COLS} border-b border-ink pb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ash`}>
              <span>Discipline</span>
              <span className="hidden md:block">Detail</span>
              <span className="hidden md:block">Tooling</span>
              <span className="text-right md:text-left">Yrs</span>
              <span className="hidden md:block">Index</span>
            </div>

            {CAPS.map(([name, detail, tools, yrs, w]) => (
              <div
                key={name}
                data-rise
                className={`group ${COLS} items-center gap-x-4 gap-y-1 border-b border-rule py-3 transition-colors duration-200 hover:bg-vellum-deep/70`}
              >
                <span className="expanded font-display text-[clamp(0.95rem,1.15vw,1.15rem)] font-bold uppercase tracking-[-0.02em]">
                  {name}
                </span>
                <span className="hidden font-mono text-[10px] tracking-[0.06em] text-ash md:block">
                  {detail}
                </span>
                <span className="hidden font-mono text-[10px] tracking-[0.06em] text-ash md:block">
                  {tools}
                </span>
                <span className="tnum text-right font-mono text-[11px] text-ink md:text-left">
                  {yrs}
                </span>
                <span className="hidden md:block">
                  <span className="block h-[7px] w-full bg-rule/70">
                    <span
                      data-bar
                      className="meter block h-full bg-pen transition-colors duration-300 group-hover:bg-cobalt"
                      style={{ width: `${w * 100}%` }}
                    />
                  </span>
                </span>
                <span className="col-span-2 h-[6px] w-full bg-rule/70 md:hidden">
                  <span
                    className="meter block h-full bg-pen"
                    style={{ width: `${w * 100}%` }}
                  />
                </span>
              </div>
            ))}
          </div>

          <aside className="xl:col-span-4">
            <div data-rise>
              <Eyebrow tone="cobalt">Method</Eyebrow>
              <ol className="mt-4 space-y-3.5">
                {[
                  ["01", "Research", "Two weeks with the archive and the audience."],
                  ["02", "System", "Rules first: grid, type scale, motion grammar."],
                  ["03", "Artefact", "Ship it, then tune the edges for a month."],
                ].map(([n, t, d]) => (
                  <li key={n} className="flex gap-4 border-b border-rule pb-3.5">
                    <span className="tnum font-mono text-[11px] font-medium text-pen">{n}</span>
                    <span>
                      <span className="block font-display text-[14px] font-bold uppercase tracking-[0.02em]">
                        {t}
                      </span>
                      <span className="mt-1 block text-[13px] leading-[1.55] text-ash">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div data-rise className="mt-6">
              <Eyebrow>Also fluent in</Eyebrow>
              <p className="mt-3 font-mono text-[11px] leading-[1.8] tracking-[0.04em] text-ink">
                TypeScript · React · GSAP · Three.js · Python · Glyphs · InDesign · After Effects ·
                TouchDesigner · Figma · Riso
              </p>
            </div>

            <div data-rise className="mt-6 flex items-center gap-4 border-t border-ink pt-4">
              <svg viewBox="0 0 120 44" className="h-11 w-[120px]" aria-hidden>
                <path
                  d="M4 22h30M52 22h30M100 22h16"
                  stroke="#0E1512"
                  strokeWidth="1.2"
                  fill="none"
                  pathLength={1}
                  strokeDasharray={1}
                  data-draw
                />
                <rect x="36" y="8" width="16" height="28" fill="none" stroke="#0A7A52" strokeWidth="1.4" pathLength={1} strokeDasharray={1} data-draw />
                <rect x="84" y="14" width="16" height="16" fill="none" stroke="#123C8C" strokeWidth="1.4" pathLength={1} strokeDasharray={1} data-draw />
                <circle cx="118" cy="22" r="2.5" fill="#C93C24" />
              </svg>
              <span className="font-mono text-[10px] uppercase leading-[1.7] tracking-[0.16em] text-ash">
                Input → Rule → Output
                <br />
                <span className="text-pen">the only pipeline I trust</span>
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   04 · RECORD
   ════════════════════════════════════════════════════════ */

const RECORD = [
  { year: "2019", title: "BA Communication Design", org: "Willem de Kooning Academie, Rotterdam" },
  { year: "2021", title: "Practice founded", org: "One-person studio, Rotterdam NL" },
  { year: "2023", title: "Certificate of Typographic Excellence", org: "Type Directors Club, New York" },
  { year: "2024", title: "Site of the Day ×3", org: "Awwwards" },
  { year: "2025", title: "Silver — Identity", org: "European Design Awards, Tallinn" },
  { year: "2026", title: "Lecture: Systems that draw themselves", org: "TypeLab, Amsterdam · forthcoming" },
];

const STATS = [
  ["41", "projects delivered"],
  ["12", "identity programmes"],
  ["03", "books published"],
  ["09", "countries worked in"],
] as const;

export function Record() {
  return (
    <section className="panel p-record" id="record" aria-label="Recognition and record">
      <SheetTag label="Sheet 04 — Record" />
      <div className="mx-auto w-full max-w-[1680px]">
        <SectionHead num="04" title="Recognition & Record" right="2019 → 2026 · dimension in years" />

        <div className="mb-9 grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4">
          {STATS.map(([n, l]) => (
            <div key={l} data-rise className="border-t border-ink pt-3">
              <div className="tnum expanded font-display text-[clamp(2.2rem,4vw,4rem)] font-black leading-[0.85] tracking-[-0.05em] text-pen">
                {n}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
                {l}
              </div>
            </div>
          ))}
        </div>

        {/* dimension line */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {RECORD.map((r, i) => {
            const last = i === RECORD.length - 1;
            return (
              <div
                key={r.year}
                data-rise
                className={`relative ${last ? "pr-0" : "pr-5 md:pr-7"}`}
              >
                <div className="flex h-12 items-end pb-2.5">
                  <span className="tnum font-mono text-[13px] font-medium tracking-[0.1em] text-ash">
                    {r.year}
                  </span>
                  {last && (
                    <span className="ml-auto hidden font-mono text-[9px] tracking-[0.18em] text-pen xl:block">
                      NOW
                    </span>
                  )}
                </div>
                <div className="relative h-px w-full bg-ink">
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-3 w-px -translate-y-1/2 bg-ink"
                  />
                  {last && (
                    <svg
                      aria-hidden
                      viewBox="0 0 24 12"
                      preserveAspectRatio="none"
                      className="absolute right-0 top-0 h-3 w-3.5 -translate-y-1/2 text-ink"
                    >
                      <path d="M0 0L24 6L0 12Z" fill="currentColor" />
                    </svg>
                  )}
                </div>
                <div className={`pt-4 ${last ? "pr-0" : "pr-4"}`}>
                  <h3 className="font-display text-[clamp(0.9rem,1.05vw,1.05rem)] font-bold uppercase leading-[1.2] tracking-[-0.01em]">
                    {r.title}
                  </h3>
                  <p className="mt-1.5 font-mono text-[10px] leading-[1.6] tracking-[0.1em] text-ash">
                    {r.org}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          data-rise
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-rule pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ash"
        >
          <span className="text-pen">↳ Full CV, references and rates on request</span>
          <span>Jury work: European Design Awards 2026</span>
          <span className="tnum">Sheet 04 of 06</span>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   05 · CONTACT / COLOPHON
   ════════════════════════════════════════════════════════ */

const LINKS = [
  ["Are.na", "are.na/iris-halden"],
  ["Instagram", "@iris.halden"],
  ["GitHub", "github.com/irishalden"],
  ["LinkedIn", "in/irishalden"],
] as const;

export function Contact({ onTop }: { onTop: () => void }) {
  return (
    <section className="panel p-contact" id="contact" aria-label="Contact and colophon">
      <SheetTag label="Sheet 05 — Contact" />
      <div className="mx-auto w-full max-w-[1680px]">
        <SectionHead num="05" title="Contact" right="End of roll · 06 / 06" />

        <div className="grid gap-x-12 gap-y-9 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <p data-rise className="mb-5 font-mono text-[10px] uppercase tracking-[0.24em] text-ash">
              New work, teaching, lectures —
            </p>
            <a
              data-rise
              href="mailto:hello@irishalden.studio"
              className="contact-link block group"
            >
              <span className="expanded block font-display text-[clamp(1.9rem,5.6vw,5.4rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] transition-colors duration-300 group-hover:text-pen">
                hello@
              </span>
              <span className="outline-type expanded block font-display text-[clamp(1.9rem,5.6vw,5.4rem)] font-black uppercase leading-[0.9] tracking-[-0.05em]">
                irishalden
              </span>
              <span className="expanded block font-display text-[clamp(1.9rem,5.6vw,5.4rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] transition-colors duration-300 group-hover:text-cobalt">
                .studio
              </span>
            </a>

            <div data-rise className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {LINKS.map(([label, handle]) => (
                <a
                  key={label}
                  href="https://example.com"
                  onClick={(e) => e.preventDefault()}
                  className="group flex items-center justify-between border-b border-rule py-2.5 font-mono text-[11px] tracking-[0.08em] text-ink transition-colors hover:border-pen hover:text-pen"
                >
                  <span className="uppercase tracking-[0.16em]">{label}</span>
                  <span className="flex items-center gap-2 text-ash transition-colors group-hover:text-pen">
                    {handle}
                    <Arrow className="h-2.5 w-5" />
                  </span>
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={onTop}
              data-rise
              className="mt-7 inline-flex items-center gap-3 border border-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:bg-pen hover:text-vellum"
            >
              <Arrow className="h-3 w-5 rotate-180" />
              Rewind to sheet 00
            </button>
          </div>

          <div className="xl:col-span-5">
            <div data-rise>
              <Eyebrow tone="cobalt">Colophon</Eyebrow>
              <div className="mt-4">
                <Spec
                  rows={[
                    ["Typeface", "Archivo · Instrument Serif · IBM Plex Mono"],
                    ["Drawing", "SVG, hand-plotted paths, no illustration files"],
                    ["Motion", "GSAP ScrollTrigger, scrubbed, no easing tricks"],
                    ["Grid", "12 column, 820vw total, scale 1:1"],
                    ["Privacy", "No trackers, no cookies, no analytics"],
                    ["Rights", "© 2026 Iris Halden, Rotterdam NL"],
                  ]}
                />
              </div>
            </div>

            <div data-rise className="mt-7 flex items-end justify-between gap-6 border-t border-ink pt-5">
              <div className="flex items-center gap-4">
                <Monogram className="h-12 w-12 text-ink" />
                <div className="font-mono text-[10px] uppercase leading-[1.8] tracking-[0.18em] text-ash">
                  Drawn &amp; coded
                  <br />
                  <span className="text-ink">in Rotterdam</span>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] uppercase leading-[1.8] tracking-[0.18em] text-ash">
                <span className="tnum text-pen">{pad2(5)} / 06</span>
                <br />
                End of roll
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
