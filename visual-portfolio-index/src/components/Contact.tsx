import { useRef, type MouseEvent, type ReactNode } from "react";
import Horn from "./Horn";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import { useScrollProgress } from "../hooks/useScroll";
import { COLORS } from "../lib/palette";

/** Each letter lifts and turns green on hover, with a slight stagger. */
function HoverWord({ text }: { text: string }) {
  return (
    <span className="inline-block">
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="inline-block transition-[transform,color] duration-500 ease-out hover:-translate-y-3 hover:text-green"
          style={{ transitionDelay: `${i * 18}ms` }}
        >
          {ch === " " ? "\u00a0" : ch}
        </span>
      ))}
    </span>
  );
}

/** A CTA that gently follows the pointer. */
function MagneticLink({ href, children }: { href: string; children: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <a
      ref={ref}
      href={href}
      data-hover
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-flex items-center gap-4 rounded-full bg-paper px-8 py-5 text-lg font-medium text-ink transition-transform duration-300 ease-out"
    >
      {children}
    </a>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const p = useScrollProgress(sectionRef);

  const links = ["Layout", "Vector / SVG", "Motion", "Interaction", "Typography"];

  return (
    <section id="contact" ref={sectionRef} className="relative min-h-screen overflow-hidden bg-blue text-paper">
      {/* Decorative horn, grows as it enters the viewport */}
      <div className="pointer-events-none absolute -bottom-[8vw] -right-[6vw] aspect-square w-[46vw]">
        <Horn
          corner="bl"
          fill={COLORS.navy}
          discFill={COLORS.green}
          scale={0.55 + p * 0.45}
          transition="none"
          className="h-full w-full"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-between px-6 pb-10 pt-32 md:px-12">
        <Reveal>
          <SectionLabel index="07" title="Contact" invert />
          <h2 className="mt-10 text-[clamp(3.4rem,11vw,12rem)] font-medium leading-[0.9] tracking-[-0.05em]">
            <span className="block">
              <HoverWord text="Let's make" />
            </span>
            <span className="block pl-[8vw]">
              <HoverWord text="something" />
            </span>
            <span className="block">
              <HoverWord text="move." />
            </span>
          </h2>
        </Reveal>

        <Reveal delay={150} className="mt-16">
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
            <MagneticLink href="mailto:hello@example.com">
              hello@example.com <span className="text-xl">→</span>
            </MagneticLink>
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 font-mono text-xs uppercase tracking-[0.16em] sm:grid-cols-3">
              {links.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        <footer className="mt-16 flex flex-wrap justify-between gap-4 border-t border-paper/40 pt-6 font-mono text-xs uppercase tracking-[0.16em]">
          <span>© 2026 — Portfolio</span>
          <span className="opacity-70">Built with React · SVG · Scroll</span>
          <a href="#top" data-hover className="transition-opacity hover:opacity-60">
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
