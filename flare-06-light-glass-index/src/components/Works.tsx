import { useEffect, useRef, useState } from "react";
import { Arrow, Lens, Pill, css, type Hue, type Rim } from "./Glass";
import { useScrollProgress } from "../hooks/useScroll";

type Variant = "arch" | "columns" | "orbit" | "bars";

type Work = {
  index: string;
  title: string;
  sub: string;
  year: string;
  role: string;
  text: string;
  variant: Variant;
};

const works: Work[] = [
  {
    index: "01",
    title: "Halo",
    sub: "Systems",
    year: "2026",
    role: "Identity · Spatial lighting",
    text: "A living identity for an architectural lighting studio. The mark is a sunrise of capsules that re-fans itself for every project it signs.",
    variant: "arch",
  },
  {
    index: "02",
    title: "Night",
    sub: "Transit",
    year: "2025",
    role: "Wayfinding · Motion",
    text: "Wayfinding for a 24-hour metro line. Coloured columns encode the routes; panes of glass carry live arrivals across them.",
    variant: "columns",
  },
  {
    index: "03",
    title: "Signal",
    sub: "Bloom",
    year: "2025",
    role: "Campaign · Generative",
    text: "A generative campaign in which every listener grows a unique ring of light. 1.2 million rings were drawn and no two match.",
    variant: "orbit",
  },
  {
    index: "04",
    title: "Prism",
    sub: "Ledger",
    year: "2024",
    role: "Data · Editorial",
    text: "An annual report that renders figures as luminous columns, read through a sliding lens of annotation.",
    variant: "bars",
  },
];

const archAngles = [-54, 54, -36, 36, -18, 18, 0];
const archHues: Hue[] = ["dusk", "volt", "prism", "tide", "rose", "gold", "sun"];

const columnSegments: { left: number; top: number; height: number; hue: Hue }[] = [
  { left: 44, top: 8, height: 46, hue: "gold" },
  { left: 44, top: 56, height: 38, hue: "violet" },
  { left: 51.5, top: 6, height: 62, hue: "rose" },
  { left: 51.5, top: 70, height: 24, hue: "coral" },
  { left: 59, top: 10, height: 40, hue: "azure" },
  { left: 59, top: 52, height: 42, hue: "volt" },
  { left: 66.5, top: 7, height: 56, hue: "cobalt" },
  { left: 66.5, top: 65, height: 29, hue: "sun" },
  { left: 74, top: 9, height: 85, hue: "ice" },
  { left: 81.5, top: 6, height: 30, hue: "tide" },
  { left: 81.5, top: 38, height: 56, hue: "prism" },
];
const columnLenses: { left: number; top: number; height: number; rim: Rim }[] = [
  { left: 47.6, top: 14, height: 48, rim: "warm" },
  { left: 62.6, top: 36, height: 50, rim: "cool" },
  { left: 77.6, top: 12, height: 30, rim: "rose" },
];

const orbitHues: Hue[] = ["sun", "rose", "prism", "azure", "ice", "gold"];
const barHeights = [42, 64, 52, 80, 58, 88, 66, 74];
const barHues: Hue[] = ["violet", "dusk", "azure", "cobalt", "tide", "volt", "gold", "sun"];

function Art({ variant }: { variant: Variant }) {
  if (variant === "arch") {
    return (
      <>
        {archAngles.map((angle, index) => (
          <Pill key={angle} hue={archHues[index]} className="wp-arch" style={css({ "--a": `${angle}deg` })} />
        ))}
        <Lens rim="warm" className="wl-arch" />
      </>
    );
  }

  if (variant === "columns") {
    return (
      <>
        {columnSegments.map((segment, index) => (
          <Pill
            key={index}
            hue={segment.hue}
            className="wp-col"
            style={css({ left: `${segment.left}%`, top: `${segment.top}%`, height: `${segment.height}%`, "--i": String(index) })}
          />
        ))}
        {columnLenses.map((lens, index) => (
          <Lens key={index} rim={lens.rim} className="wl-col" style={css({ left: `${lens.left}%`, top: `${lens.top}%`, height: `${lens.height}%` })} />
        ))}
      </>
    );
  }

  if (variant === "orbit") {
    return (
      <>
        <div className="w-orbit">
          {Array.from({ length: 12 }, (_, index) => (
            <Pill key={index} hue={orbitHues[index % orbitHues.length]} className="wp-orbit" style={css({ "--a": `${index * 30}deg` })} />
          ))}
        </div>
        <Lens rim="rose" className="lens--orb wl-orb" />
      </>
    );
  }

  return (
    <>
      {barHeights.map((height, index) => (
        <Pill
          key={index}
          hue={barHues[index]}
          className="wp-bar"
          style={css({ left: `${38 + index * 7.2}%`, height: `${height}%`, "--i": String(index) })}
        />
      ))}
      <Lens rim="cool" className="wl-bar">
        <span className="wl-bar__label">+38.2% luminance</span>
      </Lens>
    </>
  );
}

export function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const distance = useRef(0);
  const [active, setActive] = useState(1);

  useEffect(() => {
    const size = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      distance.current = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + distance.current}px`;
    };
    size();
    document.fonts?.ready.then(size).catch(() => undefined);
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, []);

  useScrollProgress(sectionRef, (progress) => {
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${-progress * distance.current}px, 0, 0)`;
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    setActive(Math.min(works.length, Math.floor(progress * works.length * 0.999) + 1));
  });

  return (
    <section id="work" ref={sectionRef} className="work">
      <div className="work__sticky">
        <div className="work__head" data-reveal="">
          <div>
            <p className="kicker">03 — Selected work</p>
            <h2>
              <span className="line"><span>Four <em className="serif-i">studies</em></span></span>
              <span className="line"><span style={css({ "--d": ".1s" })}>in emitted colour.</span></span>
            </h2>
          </div>
          <span className="work__count"><b>{String(active).padStart(2, "0")}</b> / {String(works.length).padStart(2, "0")}</span>
        </div>

        <div ref={trackRef} className="work__track">
          {works.map((work) => (
            <article key={work.index} className={`work-card work-card--${work.variant}`}>
              <div className="work-card__wall" aria-hidden="true" />
              <div className="work-card__art" aria-hidden="true"><Art variant={work.variant} /></div>
              <div className="work-card__top">
                <span className="kicker">Case {work.index}</span>
                <span className="kicker">{work.year}</span>
              </div>
              <div className="work-card__info rim">
                <h3>{work.title} <em className="serif-i">{work.sub}</em></h3>
                <p>{work.text}</p>
                <div className="work-card__meta">
                  <span>{work.role}</span>
                  <a href="#contact" className="chip">View case <Arrow /></a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="work__bar" aria-hidden="true"><span ref={barRef} /></div>
      </div>
    </section>
  );
}
