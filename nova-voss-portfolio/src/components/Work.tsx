import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useBodyLock, useMediaQuery, useScrollProgress } from "@/lib/hooks";
import { cn } from "@/utils/cn";
import { ArrowUpRight, Cross, SectionLabel } from "./Motion";

type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  year: string;
  services: string[];
  description: string;
  note: string;
  tone: "paper" | "blue" | "ink" | "green";
  artwork: ReactNode;
};

function ApertureArt() {
  return (
    <svg viewBox="0 0 640 440" className="size-full" aria-hidden="true">
      <defs>
        <pattern id="apGrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="var(--paper)" strokeOpacity=".22" strokeWidth=".7" />
        </pattern>
        <clipPath id="apClip">
          <rect width="640" height="440" />
        </clipPath>
      </defs>
      <g clipPath="url(#apClip)">
        <rect width="640" height="440" fill="var(--green)" />
        <g className="art-rotate">
          <path d="M640 440H245a395 395 0 0 1 395-395Z" fill="var(--sky)" opacity=".85" />
          <path d="M640 440H320a320 320 0 0 1 320-320Z" fill="var(--paper)" />
          <path d="M640 440H410a230 230 0 0 1 230-230Z" fill="var(--navy)" />
          <path d="M640 440H500a140 140 0 0 1 140-140Z" fill="var(--blue)" />
        </g>
        <rect width="640" height="440" fill="url(#apGrid)" />
        <path d="M0 220h640M320 0v440" stroke="var(--paper)" strokeOpacity=".45" />
        <circle cx="320" cy="220" r="76" fill="none" stroke="var(--paper)" strokeOpacity=".7" />
        <circle cx="320" cy="220" r="5" fill="var(--paper)" />
        <g className="art-shift" fill="var(--paper)" fontFamily="DM Mono, monospace" fontSize="9" letterSpacing="1.6">
          <text x="24" y="32">A STUDY OF OPENING</text>
          <text x="24" y="416">N° 001 / GENERATIVE FORM</text>
          <text x="510" y="32">2025</text>
        </g>
        <text x="26" y="280" fill="var(--paper)" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="150" opacity=".95">
          Aa
        </text>
      </g>
    </svg>
  );
}

function FieldArt() {
  return (
    <svg viewBox="0 0 640 440" className="size-full" aria-hidden="true">
      <defs>
        <pattern id="fieldGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--ink)" strokeOpacity=".12" strokeWidth=".7" />
        </pattern>
      </defs>
      <rect width="640" height="440" fill="var(--paper)" />
      <rect width="640" height="440" fill="url(#fieldGrid)" />
      <g className="art-shift-alt">
        <circle cx="535" cy="115" r="115" fill="var(--blue)" />
        <circle cx="535" cy="115" r="82" fill="var(--paper)" />
        <circle cx="535" cy="115" r="49" fill="var(--sky)" />
        <circle cx="535" cy="115" r="16" fill="var(--ink)" />
        <path d="M658 245a132 132 0 0 1-132 132" fill="none" stroke="var(--blue)" strokeWidth="1.2" />
        <path d="M686 245a160 160 0 0 1-160 160" fill="none" stroke="var(--blue)" strokeWidth="1.2" strokeOpacity=".5" />
      </g>
      <path d="M0 355h640" stroke="var(--ink)" strokeOpacity=".25" />
      <text x="28" y="184" fill="var(--ink)" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="500" fontSize="150" letterSpacing="-11">
        FIELD
      </text>
      <text x="34" y="298" fill="var(--blue)" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="140" letterSpacing="-3">
        notes
      </text>
      <g fill="var(--ink)" fontFamily="DM Mono, monospace" fontSize="9" letterSpacing="1.4" opacity=".7">
        <text x="30" y="32">AN ATLAS OF SMALL OBSERVATIONS</text>
        <text x="30" y="395">ART DIRECTION / IDENTITY</text>
        <text x="540" y="395">2024</text>
      </g>
      <g fill="var(--blue)">
        <circle cx="34" cy="330" r="4" />
        <circle cx="70" cy="330" r="4" opacity=".5" />
        <circle cx="106" cy="330" r="4" opacity=".25" />
      </g>
    </svg>
  );
}

const cellPattern = [0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 3, 0, 2, 0, 0, 0, 0, 0, 1, 0, 3, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 2, 0, 0, 3, 0, 0, 1, 0, 0, 0, 2, 0];

function GridArt() {
  return (
    <div className="group/grid relative size-full overflow-hidden bg-paper">
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
        {cellPattern.map((cell, index) => (
          <div
            key={index}
            className={cn(
              "border-b border-r border-ink/15 transition-all duration-700",
              cell === 1 && "bg-blue",
              cell === 2 && "bg-green",
              cell === 3 && "bg-sky",
              cell === 0 && "bg-transparent hover:bg-paper-deep",
              cell > 0 && "group-hover/grid:scale-[.76] group-hover/grid:rotate-[8deg] group-hover/grid:rounded-full"
            )}
            style={{ transitionDelay: `${(index % 8) * 22}ms` }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex size-[136px] flex-col items-center justify-center rounded-full border border-ink/55 bg-paper text-center shadow-[0_0_0_7px_rgba(233,228,216,.5)] transition-transform duration-700 group-hover/grid:scale-110">
          <Cross className="mb-2 size-3 text-green" />
          <span className="mono text-[8px] leading-tight opacity-60">Index of</span>
          <span className="font-serif text-4xl italic leading-none">small</span>
          <span className="mono text-[8px] opacity-60">grids</span>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <span className="mono">48 cells / 03 colors</span>
        <span className="mono opacity-40">N° 003</span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
        <span className="mono">Hover to disturb</span>
        <span className="mono opacity-40">2025</span>
      </div>
    </div>
  );
}

function MatterArt() {
  return (
    <div className="relative size-full overflow-hidden bg-ink">
      <div className="grid-major absolute inset-0 opacity-70" />
      <svg viewBox="0 0 640 440" className="relative z-10 size-full" aria-hidden="true">
        <defs>
          <clipPath id="matterCircle">
            <circle cx="410" cy="220" r="158" />
          </clipPath>
          <pattern id="matterLines" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M0 10 10 0" stroke="var(--ink)" strokeOpacity=".3" />
          </pattern>
        </defs>
        <g className="art-shift">
          <circle cx="290" cy="220" r="170" fill="var(--green)" opacity=".95" />
          <circle cx="420" cy="220" r="170" fill="var(--blue)" opacity=".9" />
          <g clipPath="url(#matterCircle)">
            <rect x="250" y="30" width="340" height="380" fill="url(#matterLines)" opacity=".45" />
          </g>
          <circle cx="355" cy="220" r="170" fill="none" stroke="var(--paper)" strokeOpacity=".4" />
          <circle cx="355" cy="220" r="205" fill="none" stroke="var(--paper)" strokeOpacity=".2" strokeDasharray="2 6" />
          <circle cx="355" cy="220" r="7" fill="var(--paper)" />
          <path d="M355 15v410" stroke="var(--paper)" strokeOpacity=".22" />
        </g>
        <g className="art-rotate" style={{ transformOrigin: "410px 220px" }}>
          <circle cx="410" cy="220" r="232" fill="none" stroke="var(--sky)" strokeOpacity=".55" strokeDasharray="1 8" />
          <circle cx="410" cy="62" r="5" fill="var(--sky)" />
        </g>
        <g fill="var(--paper)" fontFamily="DM Mono, monospace" fontSize="9" letterSpacing="1.5">
          <text x="26" y="32">MATTER / ANTI-MATTER</text>
          <text x="26" y="416">MOTION IDENTITY — SYSTEM 04</text>
          <text x="545" y="416">2023</text>
        </g>
        <text x="26" y="125" fill="var(--paper)" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="98">
          Opposites
        </text>
        <text x="26" y="200" fill="var(--sky)" fontFamily="DM Mono, monospace" fontSize="12" letterSpacing="2">
          ATT R ACT / REPEL
        </text>
      </svg>
    </div>
  );
}

const projects: Project[] = [
  {
    id: "aperture",
    index: "01",
    title: "Aperture",
    kicker: "Interaction / Identity",
    year: "2025",
    services: ["Creative direction", "Interaction", "SVG systems"],
    description:
      "A flexible identity built from one elegant gesture: the quarter circle. It opens, closes and recombines across screen and print without ever losing its silhouette.",
    note: "Built as a live web toy and a 72-page identity manual. The geometry is shared between both through a single generative path system.",
    tone: "green",
    artwork: <ApertureArt />,
  },
  {
    id: "field-notes",
    index: "02",
    title: "Field Notes",
    kicker: "Art direction / Editorial",
    year: "2024",
    services: ["Art direction", "Editorial design", "Type pairing"],
    description:
      "An annual journal about looking slowly. The visual language pairs an uncompromising grotesque with an italic serif that behaves like handwriting in a margin.",
    note: "The identity uses a strict four-column grid and a single blue accent. Every spread holds one unexpected interruption.",
    tone: "blue",
    artwork: <FieldArt />,
  },
  {
    id: "small-grids",
    index: "03",
    title: "Small Grids",
    kicker: "Creative coding",
    year: "2025",
    services: ["Concept", "Creative development", "Tool design"],
    description:
      "An index of forty-eight tiny compositions. Each cell begins from the same conditions and ends somewhere unexpected. A study in constraint and consequence.",
    note: "Hover any experiment to disturb its state. The piece is intentionally unfinished — the archive keeps growing.",
    tone: "paper",
    artwork: <GridArt />,
  },
  {
    id: "matter",
    index: "04",
    title: "Matter / Anti",
    kicker: "Motion identity",
    year: "2023",
    services: ["Motion direction", "Identity", "Sound design"],
    description:
      "A kinetic identity for a materials research studio. Two opposing forms orbit a shared center — one solid, one transparent, both necessary.",
    note: "Every asset is generated from the same orbital equation. At any moment the system can render a logotype, a transition or a still.",
    tone: "ink",
    artwork: <MatterArt />,
  },
];

const cardTone: Record<Project["tone"], string> = {
  green: "bg-green-deep text-paper",
  blue: "bg-blue text-paper",
  paper: "bg-paper-deep text-ink",
  ink: "bg-ink text-paper",
};

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <article
      className={cn(
        "project-card group flex shrink-0 flex-col border border-ink/35 p-3.5 md:p-4 lg:h-[calc(100svh-300px)] lg:min-h-[430px] lg:w-[39vw] lg:max-w-[620px] lg:p-4",
        cardTone[project.tone]
      )}
    >
      <header className="mb-3 flex items-start justify-between gap-4 border-b border-current/25 pb-3">
        <div className="flex items-center gap-3">
          <span className="mono opacity-60">{project.index}</span>
          <span className="mono">{project.kicker}</span>
        </div>
        <span className="mono opacity-55">{project.year}</span>
      </header>

      <div className="relative min-h-[220px] flex-1 overflow-hidden border border-current/20 lg:min-h-0">
        <div className="project-art absolute inset-0">{project.artwork}</div>
        <button
          onClick={onOpen}
          className="drag-hint absolute bottom-3 right-3 z-10 flex items-center gap-2 border border-current/40 bg-paper/90 px-3 py-2 text-ink backdrop-blur-sm"
          aria-label={`Open case study: ${project.title}`}
        >
          <span className="mono">Open study</span>
          <ArrowUpRight className="size-3.5" />
        </button>
      </div>

      <footer className="mt-3 flex items-end justify-between gap-6 md:mt-4">
        <div>
          <h3 className="font-sans text-[clamp(1.7rem,2.8vw,2.9rem)] font-medium leading-none tracking-[-0.06em]">
            {project.title}
          </h3>
          <p className="mt-2 max-w-[40ch] text-xs leading-relaxed opacity-60 md:text-[13px]">
            {project.description.split(".")[0]}.
          </p>
        </div>
        <span className="corner-mark flex size-10 shrink-0 items-center justify-center rounded-full border border-current/35 md:size-12">
          <ArrowUpRight className="size-4" />
        </span>
      </footer>
    </article>
  );
}

function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  useBodyLock(true);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-stretch justify-center bg-ink/50 p-0 backdrop-blur-sm md:p-6">
      <button className="absolute inset-0 h-full w-full cursor-default" onClick={onClose} aria-label="Close case study" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-title"
        className="case-panel relative z-10 grid h-[100svh] w-full max-w-[1280px] grid-rows-[auto_1fr] overflow-y-auto border-ink bg-paper text-ink md:h-full md:grid-cols-[1.15fr_.85fr] md:grid-rows-1 md:overflow-hidden md:border"
      >
        <div className="relative min-h-[260px] overflow-hidden border-b border-ink/25 md:min-h-0 md:border-b-0 md:border-r">
          <div className="absolute inset-0">{project.artwork}</div>
          <div className="absolute left-4 top-4 z-10 bg-paper px-3 py-1.5">
            <span className="mono">Case study / {project.index}</span>
          </div>
        </div>

        <div className="flex flex-col justify-between overflow-y-auto p-5 md:p-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="mono opacity-55">{project.kicker}</span>
              <button
                onClick={onClose}
                className="group flex items-center gap-2 border border-ink/30 px-3 py-2 transition-colors hover:bg-ink hover:text-paper"
              >
                <span className="mono">Close</span>
                <svg viewBox="0 0 16 16" className="size-3" fill="none" aria-hidden="true">
                  <path d="m3 3 10 10M13 3 3 13" stroke="currentColor" className="transition-transform duration-500 group-hover:rotate-90" />
                </svg>
              </button>
            </div>
            <h2 id="case-title" className="display-tight mt-8 text-[clamp(3.2rem,7vw,6rem)]">
              {project.title}
            </h2>
            <p className="mt-5 max-w-[44ch] text-[clamp(1rem,1.4vw,1.25rem)] leading-snug tracking-[-0.02em]">
              {project.description}
            </p>
            <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-ink/55">{project.note}</p>

            <div className="mt-8 grid grid-cols-2 gap-5 border-t border-ink/25 pt-5">
              <div>
                <span className="mono opacity-45">Year</span>
                <p className="mt-1.5 text-sm">{project.year}</p>
              </div>
              <div>
                <span className="mono opacity-45">Discipline</span>
                <ul className="mt-1.5 space-y-1 text-sm">
                  {project.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-ink/25 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <a href="mailto:hello@novavoss.studio?subject=Project%20enquiry" className="group flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-green text-paper transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
              <span className="mono">Discuss a similar project</span>
            </a>
            <span className="mono opacity-40">N.V. / 2026</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(sectionRef);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      setDistance(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };
    measure();
    const timeout = window.setTimeout(measure, 350);
    window.addEventListener("resize", measure);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (trackRef.current) observer?.observe(trackRef.current);
    if (viewportRef.current) observer?.observe(viewportRef.current);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [desktop]);

  const translate = desktop ? -distance * progress : 0;
  const counter = Math.min(projects.length, Math.floor(progress * projects.length) + 1);
  const activeProgress = desktop
    ? distance === 0
      ? 1
      : Math.min(1, Math.max(0, Math.round((-translate / distance) * 100) / 100))
    : progress;

  return (
    <section id="work" className="relative border-t border-ink/25 bg-paper-deep">
      <div ref={sectionRef} className="relative z-10 lg:h-[320vh]">
        <div className="flex flex-col lg:sticky lg:top-0 lg:h-[100svh] lg:overflow-hidden">
          <div className="border-b border-ink/25 px-5 pb-4 pt-8 md:px-10 lg:pt-[92px]">
            <SectionLabel index="02" label="Selected studies" />
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <h2 className="display-tight text-[clamp(2.4rem,4.5vw,4.8rem)]">
                Work, <span className="serif italic text-green">in motion.</span>
              </h2>
              <div className="mono flex items-center gap-5 pb-1 text-ink/60">
                <span className="hidden md:inline">Scroll down to pan right</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-px w-9 bg-ink/40" />
                  <span>0{counter} / 0{projects.length}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex flex-1 flex-col justify-center py-5">
            <div className="lg:grid lg:grid-cols-[minmax(250px,27%)_1fr] lg:items-stretch lg:gap-0">
              <div className="mx-5 mb-4 flex min-h-[280px] shrink-0 flex-col justify-between border-y border-ink/30 py-5 md:mx-10 lg:mx-0 lg:mb-0 lg:h-[calc(100svh-300px)] lg:min-h-[430px] lg:border-b-0 lg:border-r lg:border-t-0 lg:py-3 lg:pl-10 lg:pr-8">
                <div>
                  <span className="mono opacity-45">Field index — 2022 / 2026</span>
                  <p className="mt-7 font-sans text-[clamp(2rem,3.1vw,3rem)] font-medium leading-[0.98] tracking-[-0.06em]">
                    Four studies in
                    <br />
                    <span className="serif italic text-blue">form &amp; behaviour.</span>
                  </p>
                </div>
                <div>
                  <p className="max-w-[290px] text-sm leading-relaxed text-ink/60">
                    A selection of identities, editorial systems and digital experiments. Open a study
                    to read the thinking behind the surface.
                  </p>
                  <a
                    href="mailto:hello@novavoss.studio?subject=Full%20portfolio%20request"
                    className="mono mt-6 inline-flex items-center gap-2 border-b border-ink/40 pb-1 transition-colors hover:border-blue hover:text-blue"
                  >
                    Request full index <ArrowUpRight className="size-3.5" />
                  </a>
                  <div className="mono mt-8 hidden items-center gap-2 text-ink/40 lg:flex">
                    <span className="h-px w-8 bg-ink/30" />
                    Drag the scroll
                  </div>
                </div>
              </div>

              <div ref={viewportRef} className="relative lg:overflow-hidden">
                <div
                  ref={trackRef}
                  className="rail-track flex w-full flex-col gap-4 px-5 transition-transform duration-100 ease-linear md:px-10 lg:w-max lg:flex-row lg:gap-5 lg:px-0 lg:pl-5 lg:pr-10 lg:will-change-transform"
                  style={{ transform: `translate3d(${translate}px, 0, 0)` }}
                >
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} onOpen={() => setActive(project)} />
                  ))}

                  <div className="hidden w-[24vw] max-w-[340px] shrink-0 flex-col justify-between border-y border-ink/25 px-8 py-4 lg:flex lg:h-[calc(100svh-300px)] lg:min-h-[430px] lg:border-b-0 lg:border-t-0 lg:border-l">
                    <div className="flex items-center justify-between">
                      <span className="mono opacity-45">End of index</span>
                      <Cross className="size-3" />
                    </div>
                    <div>
                      <p className="font-serif text-[clamp(2.8rem,5vw,5rem)] italic leading-[0.9] text-ink/75">
                        More soon.
                      </p>
                      <a
                        href="mailto:hello@novavoss.studio"
                        className="mt-6 inline-flex size-20 items-center justify-center rounded-full bg-blue text-paper transition-transform duration-700 hover:rotate-45 hover:scale-105"
                        aria-label="Email Nova Voss"
                      >
                        <ArrowUpRight className="size-5" />
                      </a>
                    </div>
                    <span className="mono opacity-40">Thank you for looking slowly.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-3 border-t border-ink/25 px-10 py-3 lg:flex">
            <span className="mono whitespace-nowrap text-ink/50">Pan progress</span>
            <div className="h-px flex-1 bg-ink/20">
              <div className="h-full bg-blue" style={{ width: `${Math.max(activeProgress * 100, 1)}%` }} />
            </div>
            <span className="mono tabular-nums text-ink/50">{String(Math.round(activeProgress * 100)).padStart(2, "0")}%</span>
          </div>
        </div>
      </div>

      {active && <CaseStudy project={active} onClose={() => setActive(null)} />}
      <style>{`
        .case-panel { animation: case-in .65s cubic-bezier(.16,1,.3,1) both; }
        @keyframes case-in {
          from { opacity: 0; transform: translateY(28px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}
