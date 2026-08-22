import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { id: "cognition", label: "Cognition", color: "#a78bfa" },
  { id: "depression", label: "Mood", color: "#38bdf8" },
  { id: "falls", label: "Balance", color: "#fbbf24" },
  { id: "cardiovascular", label: "Cardiac", color: "#fb7185" },
  { id: "isolation", label: "Isolation", color: "#2dd4bf" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/10 bg-black/70 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
            <path
              d="M22 6c-5 0-9 4-9 9 0 2-1 3-3 3-2 0-3 1-3 2 0 4 5 6 9 6 7 0 13-6 13-13S29 6 22 6Z"
              stroke="white"
              strokeWidth="1.6"
            />
            <path d="M21 11c-2.5 0-4.5 2-4.5 4.5" stroke="white" strokeWidth="1.4" opacity="0.5" />
          </svg>
          <span className="font-display text-sm font-semibold tracking-tight text-white">
            Auditory<span className="text-white/40">Risk</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="group relative rounded-full px-3.5 py-1.5 text-sm text-white/55 transition-colors hover:text-white"
            >
              <span
                className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                style={{ background: l.color }}
              />
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#intervention"
          className="hidden rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/5 md:inline-block"
        >
          The Fix
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white md:hidden"
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden border-t border-white/10 bg-black/95 md:hidden"
        >
          <div className="flex flex-col px-6 py-3">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 py-2.5 text-sm text-white/70"
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: l.color }} />
                {l.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
