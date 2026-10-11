import { useEffect } from "react";
import type { ReactNode } from "react";
import { useInView } from "../lib/hooks";
import { sfx } from "../lib/sound";

interface SectionProps {
  id: string;
  no: string;
  kicker: string;
  title: ReactNode;
  lede?: string;
  children: ReactNode;
}

export default function Section({ id, no, kicker, title, lede, children }: SectionProps) {
  const { ref, inView } = useInView<HTMLElement>(0.12);

  useEffect(() => {
    if (inView) sfx.whoosh();
  }, [inView]);

  return (
    <section ref={ref} id={id} data-section className="relative overflow-hidden px-6 py-28 md:px-16 lg:px-24">
      <header className={`reveal mb-16 max-w-4xl ${inView ? "is-in" : ""}`}>
        <div className="kicker flex items-center gap-4">
          <span className="font-mono text-[var(--ice)]">{no}</span>
          <span className="h-px w-14 bg-[var(--klein-glow)]/60" />
          <span>{kicker}</span>
        </div>
        <h2 className="h2 mt-6">{title}</h2>
        {lede && <p className="body mt-7 max-w-2xl">{lede}</p>}
      </header>
      {children}
    </section>
  );
}
