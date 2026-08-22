import { motion } from "framer-motion";

const links = [
  { href: "#audit", label: "审计" },
  { href: "#drop", label: "投币" },
  { href: "#river", label: "溯流" },
  { href: "#map", label: "地图" },
  { href: "#capture", label: "沉淀" },
  { href: "#heat", label: "终局" },
];

export default function Nav({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 right-0 left-0 z-50">
      <div className="h-[2px] bg-white/5">
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-amber-200 via-yellow-500 to-orange-600"
          style={{ scaleX: progress }}
        />
      </div>
      <nav className="flex items-center justify-between px-5 py-4 md:px-10">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-300/40 text-[10px] tracking-[0.2em] text-amber-200">
            溯
          </span>
          <span className="font-display text-[11px] tracking-[0.35em] text-paper/80 uppercase">
            Upstream
          </span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-display text-[11px] tracking-[0.28em] text-paper-dim/80 uppercase transition hover:text-gold-2"
            >
              {l.label}
            </a>
          ))}
        </div>
        <span className="font-mono text-[10px] tracking-widest text-mute">AUDIT / 2026</span>
      </nav>
    </div>
  );
}
