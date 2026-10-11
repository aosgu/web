import { useEffect, useState } from "react";
import { sfx, setSound } from "../lib/sound";

export const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "spread", label: "The spread" },
  { id: "responders", label: "Low responders" },
  { id: "sex-age", label: "Sex & age" },
  { id: "gains", label: "Gains by group" },
  { id: "people", label: "The sample" },
  { id: "source", label: "Source" },
];

function useScrollState() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      let idx = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) idx = i;
      });
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { progress, active };
}

function SoundToggle() {
  const [on, setOn] = useState(true);

  const toggle = () => {
    const next = !on;
    setOn(next);
    if (next) {
      setSound(true);
      sfx.select();
    } else {
      sfx.tick();
      setSound(false);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      className="fixed right-5 top-5 z-50 flex items-center gap-3 rounded-full border border-white/10 bg-[#03040b]/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--paper)] backdrop-blur transition-colors hover:border-[var(--klein-hi)]"
    >
      <span className={`eq ${on ? "" : "eq-paused"} text-[var(--klein-glow)]`}>
        <span />
        <span />
        <span />
        <span />
      </span>
      Sound {on ? "on" : "off"}
    </button>
  );
}

export default function Chrome() {
  const { progress, active } = useScrollState();

  const go = (id: string) => {
    sfx.tick();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="fixed left-0 top-0 z-50 h-[2px] w-full bg-white/5">
        <div
          className="h-full bg-[var(--klein-hi)] shadow-[0_0_12px_var(--klein-hi)]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <nav aria-label="Sections" className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 xl:flex">
        {SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => go(s.id)} className="group flex items-center gap-3 text-left">
            <span
              className={`block h-2 rounded-full transition-all duration-500 ${
                i === active
                  ? "w-8 bg-[var(--klein-hi)] shadow-[0_0_14px_var(--klein-hi)]"
                  : "w-2 bg-white/25 group-hover:bg-white/60"
              }`}
            />
            <span
              className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-opacity duration-300 ${
                i === active ? "text-white opacity-100" : "text-[var(--mist)] opacity-0 group-hover:opacity-80"
              }`}
            >
              {s.label}
            </span>
          </button>
        ))}
      </nav>

      <SoundToggle />
    </>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-[var(--klein-hi)]/30 bg-[var(--klein)] py-6">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span
            key={i}
            className="font-display flex items-center whitespace-nowrap px-8 text-[clamp(1.6rem,3.2vw,2.6rem)] italic text-white"
          >
            {t}
            <span className="ml-8 not-italic text-[var(--ice)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
