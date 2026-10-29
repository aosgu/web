import { useEffect, useState } from "react";
import Horn from "./Horn";
import { COLORS } from "../lib/palette";

const links = [
  { label: "Palette", href: "#palette" },
  { label: "Type", href: "#type" },
  { label: "Shapes", href: "#shapes" },
  { label: "Motion", href: "#motion" },
  { label: "Interaction", href: "#play" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/15 bg-paper/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3.5 md:px-12">
        <a href="#top" className="flex items-center gap-3 font-medium tracking-tight" data-hover>
          <Horn corner="br" fill={COLORS.blue} discFill={COLORS.green} transition="none" className="h-6 w-6" />
          <span>
            Index<span className="text-blue">.</span>
          </span>
        </a>

        <nav className="hidden gap-7 font-mono text-xs uppercase tracking-[0.16em] md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-blue" data-hover>
              {l.label}
            </a>
          ))}
        </nav>

        <span className="font-mono text-xs tabular-nums">{String(Math.round(progress * 100)).padStart(3, "0")}%</span>
      </div>
      <div className="h-[2px] origin-left bg-blue" style={{ transform: `scaleX(${progress})` }} />
    </header>
  );
}
