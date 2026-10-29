import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { useClock } from "@/lib/hooks";
import { ArrowUpRight, Asterisk, Cross, SectionLabel } from "./Motion";
import { Wordmark } from "./Chrome";

function MagneticHello() {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
    element.style.setProperty("--mx", `${x}px`);
    element.style.setProperty("--my", `${y}px`);
  };

  const onLeave = () => {
    ref.current?.style.setProperty("--mx", "0px");
    ref.current?.style.setProperty("--my", "0px");
  };

  return (
    <a
      ref={ref}
      href="mailto:hello@novavoss.studio"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="magnetic group relative flex size-[144px] shrink-0 items-center justify-center rounded-full bg-paper text-ink md:size-[190px]"
      aria-label="Say hello by email"
    >
      <svg viewBox="0 0 160 160" className="spin-slow absolute inset-0 size-full" fill="none" aria-hidden="true">
        <defs>
          <path id="contactCircle" d="M80 13a67 67 0 1 1-.1 0" />
        </defs>
        <text fill="currentColor" fontFamily="DM Mono, monospace" fontSize="9.5" letterSpacing="2.4">
          <textPath href="#contactCircle">SAY HELLO · START SOMETHING · SAY HELLO ·</textPath>
        </text>
        <circle cx="80" cy="80" r="44" stroke="currentColor" strokeOpacity=".22" />
      </svg>
      <span className="flex flex-col items-center gap-1.5 transition-transform duration-500 group-hover:rotate-45">
        <ArrowUpRight className="size-8 md:size-10" />
        <span className="mono text-[8px]">Write to me</span>
      </span>
    </a>
  );
}

export function Contact({ onNavigate }: { onNavigate: (id: string) => void }) {
  const clock = useClock();

  return (
    <section id="contact" className="relative overflow-hidden bg-green text-paper">
      <div className="grain pointer-events-none absolute inset-0 z-0 opacity-25" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-[22vw] -top-[20vw] size-[65vw] rounded-full border border-paper/15" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-[12vw] -top-[10vw] size-[45vw] rounded-full border border-paper/20" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-[2vw] top-0 size-[25vw] rounded-full bg-sky/90" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1720px] flex-col px-5 pt-16 md:px-10 md:pt-24">
        <SectionLabel index="06" label="New business & collaborations" dark />

        <div className="grid flex-1 content-center gap-9 py-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:py-16">
          <div>
            <p className="mono mb-7 flex items-center gap-3 text-paper/65">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-sky" />
              </span>
              Currently booking selected projects for Q3 — 2026
            </p>

            <a href="mailto:hello@novavoss.studio" className="group block" aria-label="Email Nova Voss">
              <h2 className="display text-[clamp(4.2rem,12.4vw,13.5rem)]">
                <span className="block overflow-hidden">
                  <span
                    className="block transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-3"
                    style={{ animation: "contact-rise 1.1s cubic-bezier(.16,1,.3,1) .1s both" }}
                  >
                    LET&apos;S MAKE
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span
                    className="flex items-center gap-[.14em] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-8"
                    style={{ animation: "contact-rise 1.1s cubic-bezier(.16,1,.3,1) .2s both" }}
                  >
                    GOOD
                    <span className="mt-[.2em] hidden size-[.33em] rounded-full bg-blue md:inline-block" />
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span
                    className="block font-serif font-normal italic tracking-[-0.055em] text-sky transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-12"
                    style={{ animation: "contact-rise 1.1s cubic-bezier(.16,1,.3,1) .3s both" }}
                  >
                    trouble.
                  </span>
                </span>
              </h2>
            </a>

            <div className="mt-8 max-w-[570px] border-t border-paper/25 pt-5">
              <a
                href="mailto:hello@novavoss.studio"
                className="footer-link font-sans text-[clamp(1rem,1.5vw,1.35rem)] tracking-[-0.03em]"
              >
                hello@novavoss.studio <ArrowUpRight className="size-4" />
              </a>
              <p className="mt-4 max-w-[420px] text-sm leading-relaxed text-paper/75">
                Tell me what you are making, what is getting in the way, and when it needs to exist.
                A paragraph, a link, a rough idea — I&apos;ll bring the questions.
              </p>
              <span className="mono mt-4 block text-paper/45">Replies within two working days</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-8 lg:flex-col lg:items-end">
            <span className="mono hidden text-right text-paper/55 md:block lg:mb-6">
              A good place
              <br />
              to start
            </span>
            <MagneticHello />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-7 border-t border-paper/25 py-7 md:grid-cols-4 md:gap-8">
          <div>
            <span className="mono text-paper/45">Studio</span>
            <p className="mt-2.5 text-sm leading-relaxed">
              London, UK
              <br />
              Working worldwide
            </p>
          </div>
          <div>
            <span className="mono text-paper/45">Local time</span>
            <p className="mt-2.5 flex items-center gap-2 font-mono text-sm">
              <span className="size-1.5 rounded-full bg-sky" />
              {clock || "—:—"} GMT
            </p>
          </div>
          <div>
            <span className="mono text-paper/45">Services</span>
            <p className="mt-2.5 text-sm leading-relaxed">
              Identity &amp; art direction
              <br />
              Digital design &amp; build
            </p>
          </div>
          <div>
            <span className="mono text-paper/45">Follow the process</span>
            <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
              {["Instagram", "Are.na", "Read.cv"].map((platform) => (
                <a
                  key={platform}
                  href="mailto:hello@novavoss.studio?subject=Say%20hello"
                  className="footer-link mono normal-case tracking-normal"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-paper/25 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="mono flex items-center gap-1.5 text-paper/55">
              <Asterisk className="size-2.5 text-sky" /> N.V. / 2026
            </span>
            <span className="mono hidden text-paper/35 sm:inline">Designed &amp; built with intent.</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => onNavigate("top")}
              className="group flex items-center gap-2 text-paper/60 transition-colors hover:text-paper"
            >
              <span className="mono">Back to top</span>
              <span className="flex size-7 items-center justify-center rounded-full border border-paper/30 transition-transform duration-500 group-hover:-translate-y-1">
                <ArrowUpRight className="size-3 -rotate-45" />
              </span>
            </button>
            <Cross className="hidden size-3 text-paper/35 sm:block" color="var(--paper)" />
          </div>
        </div>
      </div>

      <footer className="relative z-10 border-t border-paper/25">
        <div className="mx-auto flex w-full max-w-[1720px] flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-10">
          <Wordmark light />
          <div className="mono flex flex-wrap items-center gap-x-5 gap-y-2 text-paper/50">
            <span>Type set in Bricolage, Instrument &amp; DM Mono</span>
            <span className="hidden size-1 rounded-full bg-sky/60 sm:block" />
            <span>No cookies, just curves.</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes contact-rise {
          from { transform: translateY(105%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
