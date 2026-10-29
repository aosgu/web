import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import { COLORS } from "../lib/palette";

const COLS = 24;
const ROWS = 12;
const TOTAL = COLS * ROWS;

const TOOLS = [
  { label: "Green", value: COLORS.green },
  { label: "Blue", value: COLORS.blue },
  { label: "Navy", value: COLORS.navy },
  { label: "Sky", value: COLORS.sky },
  { label: "Erase", value: "" },
];

export default function PaintGrid() {
  const [toolIndex, setToolIndex] = useState(0);
  const [cells, setCells] = useState<Record<number, string>>({});
  const [painting, setPainting] = useState(false);
  const tool = TOOLS[toolIndex];

  useEffect(() => {
    const up = () => setPainting(false);
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, []);

  const paint = (i: number) => {
    setCells((prev) => {
      const next = { ...prev };
      if (tool.value) next[i] = tool.value;
      else delete next[i];
      return next;
    });
  };

  const scatter = () => {
    const pool = [COLORS.green, COLORS.blue, COLORS.navy, COLORS.sky];
    const next: Record<number, string> = {};
    for (let i = 0; i < TOTAL; i++) {
      if (Math.random() < 0.22) next[i] = pool[Math.floor(Math.random() * pool.length)];
    }
    setCells(next);
  };

  const count = Object.keys(cells).length;

  return (
    <section id="play" className="grid-paper relative px-6 py-28 md:px-12">
      <Reveal>
        <SectionLabel index="06" title="Interaction" />
        <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <h2 className="text-[clamp(2.6rem,6vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.04em]">
            Paint the grid.
          </h2>
          <p className="max-w-sm text-sm leading-relaxed opacity-75">
            Pick a colour, then press and drag across the field. Hover any cell to see its target. Choose Erase to
            clear.
          </p>
        </div>
      </Reveal>

      <Reveal delay={120} className="mt-12">
        <div className="flex flex-wrap items-center gap-2">
          {TOOLS.map((t, i) => {
            const active = i === toolIndex;
            return (
              <button
                key={t.label}
                data-hover
                onClick={() => setToolIndex(i)}
                className={`flex items-center gap-2 border border-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                  active ? "bg-ink text-paper" : "bg-transparent hover:bg-ink/10"
                }`}
              >
                <span
                  className="inline-block h-3 w-3 border border-current"
                  style={{ background: t.value || "transparent" }}
                />
                {t.label}
              </button>
            );
          })}
          <span className="mx-2 hidden h-6 w-px bg-ink/30 md:block" />
          <button
            data-hover
            onClick={scatter}
            className="border border-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors hover:bg-blue hover:text-paper"
          >
            Scatter
          </button>
          <button
            data-hover
            onClick={() => setCells({})}
            className="border border-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-paper"
          >
            Clear
          </button>
          <span className="ml-auto font-mono text-xs uppercase tracking-[0.14em] tabular-nums opacity-70">
            {count} / {TOTAL} painted
          </span>
        </div>
      </Reveal>

      <Reveal delay={200} className="mt-6">
        <div
          className="grid select-none border border-ink bg-paper/50"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          onPointerLeave={() => setPainting(false)}
        >
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              onPointerDown={(e) => {
                e.preventDefault();
                setPainting(true);
                paint(i);
              }}
              onPointerEnter={() => {
                if (painting) paint(i);
              }}
              className="group relative flex aspect-square cursor-crosshair items-center justify-center border-[0.5px] border-ink/20 transition-colors duration-300"
              style={{ background: cells[i] }}
            >
              <span
                className={`block h-1 w-1 rounded-full bg-ink transition-transform duration-300 group-hover:scale-[4] ${
                  cells[i] ? "opacity-0" : "opacity-60"
                }`}
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
