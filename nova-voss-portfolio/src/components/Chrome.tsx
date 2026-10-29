import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/utils/cn";
import { useClock, usePrefersReducedMotion } from "@/lib/hooks";
import { ArrowUpRight, Asterisk, Cross } from "./Motion";

const sections = [
  { id: "work", label: "Selected work", index: "01" },
  { id: "about", label: "Approach", index: "02" },
  { id: "motion", label: "Motion study", index: "03" },
  { id: "playground", label: "Playground", index: "04" },
  { id: "type", label: "Type lab", index: "05" },
  { id: "contact", label: "Contact", index: "06" },
];

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={cn("group inline-flex items-center gap-2.5", light ? "text-paper" : "text-ink")}>
      <svg viewBox="0 0 30 30" className="size-[26px] shrink-0" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="28" height="28" stroke="currentColor" strokeWidth="1" />
        <path d="M6 24V7l12 17V7" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="23" cy="23" r="3" fill={light ? "var(--sky)" : "var(--green)"} />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-sans text-[15px] font-semibold tracking-[-0.03em]">NOVA VOSS</span>
        <span className="mono-sm mt-1 opacity-55">Independent practice</span>
      </span>
    </span>
  );
}

type HeaderProps = {
  progress: number;
  onMenu: () => void;
  onNavigate: (id: string) => void;
  menuOpen: boolean;
};

export function Header({ progress, onMenu, onNavigate, menuOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={cn(
        "nav-shell fixed inset-x-0 top-0 z-50 border-b",
        scrolled && !menuOpen
          ? "border-ink/20 bg-paper/90 text-ink backdrop-blur-md"
          : "border-transparent bg-transparent text-ink",
        menuOpen && "border-transparent bg-transparent text-transparent"
      )}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-[1720px] items-center justify-between px-5 md:h-[76px] md:px-10">
        <button
          onClick={() => onNavigate("top")}
          className="group text-left"
          aria-label="Nova Voss — back to top"
        >
          <Wordmark />
        </button>

        <nav className="mono hidden items-center gap-8 lg:flex" aria-label="Primary">
          {sections.slice(0, 3).map((section) => (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className="nav-link opacity-70 transition-opacity hover:opacity-100"
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-6">
          <span className="mono hidden items-center gap-2 opacity-65 sm:flex">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-green" />
            </span>
            Available Q3
          </span>
          <button
            onClick={onMenu}
            className="group flex items-center gap-2 border border-ink/30 px-3.5 py-2.5 transition-colors hover:bg-ink hover:text-paper"
            aria-expanded={menuOpen}
            aria-controls="menu-panel"
          >
            <span className="mono">Menu</span>
            <span className="flex w-3.5 flex-col gap-[3px]">
              <span className="h-px w-full bg-current transition-transform group-hover:translate-x-1" />
              <span className="h-px w-2/3 self-end bg-current transition-transform group-hover:-translate-x-1" />
            </span>
          </button>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-ink/15">
        <div
          className="h-full bg-blue transition-[width] duration-150 ease-out"
          style={{ width: `${Math.max(progress * 100, 0.4)}%` }}
        />
      </div>
    </header>
  );
}

type MenuProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
};

export function Menu({ open, onClose, onNavigate }: MenuProps) {
  const clock = useClock();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      id="menu-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      className={cn(
        "menu-panel fixed inset-0 z-[90] flex h-[100svh] flex-col overflow-hidden bg-green text-paper",
        open && "is-open"
      )}
    >
      <div className="grid-major absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-[12vw] top-1/2 hidden aspect-square w-[48vw] -translate-y-1/2 md:block"
        aria-hidden="true"
      >
        <svg viewBox="0 0 600 600" fill="none" className="size-full">
          <circle cx="300" cy="300" r="299" stroke="var(--paper)" strokeOpacity=".22" />
          <circle cx="300" cy="300" r="218" stroke="var(--paper)" strokeOpacity=".16" />
          <path d="M300 82a218 218 0 0 1 0 436" stroke="var(--sky)" strokeOpacity=".65" />
          <circle cx="300" cy="82" r="7" fill="var(--paper)" />
          <circle cx="300" cy="518" r="7" fill="var(--sky)" />
        </svg>
      </div>

      <div className="relative z-10 flex h-[68px] shrink-0 items-center justify-between border-b border-paper/25 px-5 md:h-[76px] md:px-10">
        <span className="mono opacity-65">Index — {String(sections.length).padStart(2, "0")} chapters</span>
        <button
          onClick={onClose}
          className="group flex items-center gap-3 border border-paper/35 px-3.5 py-2.5 transition-colors hover:bg-paper hover:text-green"
          tabIndex={open ? 0 : -1}
        >
          <span className="mono">Close</span>
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
            <path
              d="m3 3 10 10M13 3 3 13"
              stroke="currentColor"
              className="transition-transform duration-500 group-hover:rotate-90"
            />
          </svg>
        </button>
      </div>

      <div className="relative z-10 grid flex-1 grid-cols-1 content-center gap-10 px-5 py-8 md:grid-cols-[1fr_auto] md:px-10 md:py-10 lg:gap-20">
        <nav aria-label="Menu">
          <div className="mono mb-4 opacity-60 md:mb-6">Navigate the study</div>
          <ul>
            {sections.map((section, index) => (
              <li
                key={section.id}
                className="menu-item overflow-hidden border-b border-paper/20"
                style={{ "--item-index": index } as CSSProperties}
              >
                <button
                  onClick={() => onNavigate(section.id)}
                  tabIndex={open ? 0 : -1}
                  className="group flex w-full items-baseline justify-between gap-5 py-2.5 text-left md:py-3"
                >
                  <span className="flex items-baseline gap-3 md:gap-6">
                    <span className="mono w-5 opacity-55">{section.index}</span>
                    <span className="display-tight text-[clamp(2.3rem,5.6vw,5.5rem)] transition-transform duration-500 group-hover:translate-x-3 group-hover:text-sky">
                      {section.label}
                    </span>
                  </span>
                  <ArrowUpRight className="mr-1 size-5 shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:size-7" />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <aside className="menu-item flex flex-col justify-end gap-7 md:w-[280px] md:border-l md:border-paper/20 md:pl-8">
          <div>
            <span className="mono opacity-60">New business</span>
            <a
              href="mailto:hello@novavoss.studio"
              className="footer-link mt-2 block font-sans text-lg tracking-[-0.03em] md:text-xl"
              tabIndex={open ? 0 : -1}
            >
              hello@novavoss.studio
              <ArrowUpRight className="size-4" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <span className="mono opacity-60">Studio</span>
              <p className="mt-2 text-sm leading-relaxed">
                London, UK
                <br />
                51.5072° N
              </p>
            </div>
            <div>
              <span className="mono opacity-60">Local time</span>
              <p className="mt-2 font-mono text-sm">{clock || "—:—"}</p>
            </div>
          </div>
          <div>
            <span className="mono opacity-60">Follow</span>
            <div className="mono mt-2 flex flex-wrap gap-x-5 gap-y-2">
              {["Instagram", "Are.na", "Read.cv"].map((platform) => (
                <a
                  key={platform}
                  href="#contact"
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate("contact");
                  }}
                  className="footer-link"
                  tabIndex={open ? 0 : -1}
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-paper/20 pt-4 opacity-60">
            <Asterisk className="size-3" />
            <span className="mono">Designing since 2017</span>
          </div>
        </aside>
      </div>

      <div className="relative z-10 flex shrink-0 items-center justify-between border-t border-paper/25 px-5 py-3 md:px-10">
        <span className="mono-sm opacity-60">Nova Voss — Portfolio, Vol. 04</span>
        <span className="mono-sm hidden opacity-60 sm:block">Type / SVG / Motion / Interaction</span>
        <Cross className="size-3 opacity-60" color="var(--paper)" />
      </div>
    </div>
  );
}

export function Loader({ done }: { done: boolean }) {
  const [count, setCount] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setCount(100);
      return;
    }
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - started;
      setCount(Math.min(100, Math.round((elapsed / 1050) * 100)));
      if (elapsed < 1100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <div
      className={cn(
        "preloader fixed inset-0 z-[200] flex flex-col overflow-hidden bg-green text-paper",
        done && "is-done"
      )}
      aria-hidden="true"
    >
      <div className="grid-major absolute inset-0 opacity-50" />
      <div className="relative z-10 flex h-full flex-col p-5 md:p-10">
        <div className="flex items-start justify-between">
          <Wordmark light />
          <span className="mono-sm max-w-[150px] text-right opacity-60">
            An exercise in type,
            <br />
            shape &amp; motion
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-[min(62vw,440px)] aspect-square">
            <svg viewBox="0 0 400 400" fill="none" className="size-full">
              <circle cx="200" cy="200" r="198" stroke="var(--paper)" strokeOpacity=".25" />
              <circle cx="200" cy="200" r="140" stroke="var(--paper)" strokeOpacity=".18" />
              <path
                d="M200 60a140 140 0 0 1 0 280V200h140"
                stroke="var(--sky)"
                strokeWidth="1.5"
              />
              <path d="M200 60v280M60 200h280" stroke="var(--paper)" strokeOpacity=".35" />
              <circle cx="200" cy="200" r="6" fill="var(--paper)" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="serif text-[clamp(7rem,20vw,13rem)] italic leading-none">Nv</span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="mono opacity-60">Loading the field notes</div>
            <div className="mt-2 h-px w-[min(50vw,420px)] bg-paper/30">
              <div className="preloader-bar h-full bg-sky" />
            </div>
          </div>
          <div className="font-mono text-[clamp(2.6rem,7vw,5rem)] leading-none tracking-[-0.08em]">
            {String(count).padStart(3, "0")}
            <span className="ml-1 text-sm text-sky">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return;

    document.body.classList.add("has-custom-cursor");
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let frame = 0;
    let active = false;

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!active) {
        active = true;
        ringX = pointerX;
        ringY = pointerY;
        if (dot.current) dot.current.style.opacity = "1";
        if (ring.current) ring.current.style.opacity = "1";
      }
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      }
    };

    const isInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(target.closest("a, button, input, [role='button']"));
    };

    const onOver = (event: PointerEvent) => {
      if (ring.current) ring.current.classList.toggle("is-hover", isInteractive(event.target));
    };
    const onDown = () => ring.current?.classList.add("is-down");
    const onUp = () => ring.current?.classList.remove("is-down");

    const render = () => {
      ringX += (pointerX - ringX) * 0.16;
      ringY += (pointerY - ringY) * 0.16;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      frame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    frame = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot opacity-0" aria-hidden="true" />
      <div ref={ring} className="cursor-ring opacity-0" aria-hidden="true" />
    </>
  );
}
