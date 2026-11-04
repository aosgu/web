import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Arrow, Lens, Mark, Pill, css, type Hue, type Rim } from "./Glass";
import { useScrollProgress } from "../hooks/useScroll";

const rising: { hue: Hue; height: number; depth: number }[] = [
  { hue: "gold", height: 74, depth: 46 },
  { hue: "rose", height: 92, depth: 62 },
  { hue: "prism", height: 66, depth: 38 },
  { hue: "dusk", height: 84, depth: 70 },
  { hue: "azure", height: 96, depth: 54 },
  { hue: "tide", height: 70, depth: 42 },
  { hue: "sun", height: 88, depth: 66 },
  { hue: "volt", height: 78, depth: 50 },
];

const panes: { seam: number; bottom: number; height: number; rim: Rim; depth: number }[] = [
  { seam: 25, bottom: 18, height: 46, rim: "warm", depth: 84 },
  { seam: 50, bottom: 34, height: 40, rim: "cool", depth: 96 },
  { seam: 75, bottom: 12, height: 52, rim: "rose", depth: 90 },
];

const clock = () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date());

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [time, setTime] = useState(clock);

  useScrollProgress(sectionRef, (progress) => sectionRef.current?.style.setProperty("--cp", progress.toFixed(4)), "enter");

  useEffect(() => {
    const timer = window.setInterval(() => setTime(clock()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const attract = (event: PointerEvent<HTMLAnchorElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    button.style.transform = `translate(${x * 0.16}px, ${y * 0.28}px)`;
  };
  const release = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.transform = "";
  };

  return (
    <section id="contact" ref={sectionRef} className="contact">
      <div className="contact__pills" aria-hidden="true">
        {rising.map((pill, index) => (
          <div
            key={pill.hue}
            className="contact__pill"
            style={css({ left: `${index * 12.5}%`, height: `${pill.height}%`, "--d": String(pill.depth) })}
          >
            <Pill hue={pill.hue} className="fill" />
          </div>
        ))}
        {panes.map((pane, index) => (
          <div
            key={index}
            className="contact__pane"
            style={css({ left: `${pane.seam - 6.8}%`, bottom: `${pane.bottom}%`, height: `${pane.height}%`, "--d": String(pane.depth) })}
          >
            <Lens rim={pane.rim} className="fill" />
          </div>
        ))}
      </div>

      <div className="contact__inner" data-reveal="">
        <p className="kicker">05 — Open for select commissions, 2026</p>
        <h2 className="contact__title">
          <span className="line"><span>Let&rsquo;s make</span></span>
          <span className="line"><span style={css({ "--d": ".12s" })}><em className="serif-i grad">light.</em></span></span>
        </h2>
        <a className="cta rim" href="mailto:hello@flare-06.studio" onPointerMove={attract} onPointerLeave={release}>
          <span>hello@flare-06.studio</span>
          <span className="cta__orb"><Arrow /></span>
        </a>
      </div>

      <footer className="contact__footer rim">
        <a href="#top" className="contact__brand"><Mark /> Flare<em className="serif-i">/06</em></a>
        <span>Local time {time}</span>
        <nav aria-label="Elsewhere">
          <a href="#top">Instagram</a>
          <a href="#top">Are.na</a>
          <a href="#top">Read.cv</a>
        </nav>
        <span>© 2026 — All light reserved</span>
      </footer>
    </section>
  );
}
