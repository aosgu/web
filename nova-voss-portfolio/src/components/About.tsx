import { useRef } from "react";
import { useScrollProgress } from "@/lib/hooks";
import { cn } from "@/utils/cn";
import { Reveal, RevealLine, SectionLabel, Asterisk, ArrowUpRight } from "./Motion";

type Token = { text: string; accent?: "serif" | "blue" | "green" };

const statement: Token[] = [
  { text: "I" },
  { text: "build" },
  { text: "visual" },
  { text: "systems" },
  { text: "that" },
  { text: "know" },
  { text: "when" },
  { text: "to" },
  { text: "behave", accent: "serif" },
  { text: "—" },
  { text: "and" },
  { text: "when" },
  { text: "to" },
  { text: "break.", accent: "blue" },
  { text: "Type," },
  { text: "code," },
  { text: "and" },
  { text: "motion," },
  { text: "arranged" },
  { text: "until" },
  { text: "the" },
  { text: "idea" },
  { text: "feels" },
  { text: "inevitable.", accent: "serif" },
];

const principles = [
  {
    index: "01",
    title: "Structure, then surprise",
    body: "A strong grid is not a cage. I build clear systems, then find the exact point where they can loosen.",
  },
  {
    index: "02",
    title: "Type that behaves",
    body: "Words are material. Scale, rhythm, contrast and a little friction are how a page learns to speak.",
  },
  {
    index: "03",
    title: "Motion with meaning",
    body: "Nothing moves for decoration. Every transition should explain a relationship or reward attention.",
  },
];

const stats = [
  { value: "09", label: "Years in practice" },
  { value: "28", label: "Products & identities" },
  { value: "04", label: "Custom typefaces" },
  { value: "∞", label: "Unfinished studies" },
];

export function About({ onNavigate }: { onNavigate: (id: string) => void }) {
  const railRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(railRef);
  const activeCount = Math.ceil(progress * 1.5 * statement.length);

  return (
    <section id="about" className="relative border-t border-ink/25 bg-paper">
      <div className="page-grid pointer-events-none absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-[1720px] px-5 pt-16 md:px-10 md:pt-24">
        <SectionLabel index="01" label="A point of view" />

        <div className="mt-8 flex flex-col justify-between gap-6 border-b border-ink/20 pb-8 md:mt-10 md:flex-row md:items-end">
          <Reveal>
            <p className="mono mb-4 opacity-50">A short statement / not a manifesto</p>
            <h2 className="display-tight max-w-[13ch] text-[clamp(2.8rem,5.4vw,6rem)]">
              Signal over
              <br />
              <span className="serif italic text-green">noise.</span>
            </h2>
          </Reveal>
          <div className="flex max-w-[330px] flex-col gap-5 md:items-end md:text-right">
            <p className="body-copy text-ink/70">
              Nova Voss is an independent designer and creative developer working between
              identity, digital product and the moving image.
            </p>
            <button
              onClick={() => onNavigate("motion")}
              className="mono flex items-center gap-2 border-b border-ink/40 pb-1 transition-colors hover:border-blue hover:text-blue"
            >
              Read the approach <ArrowUpRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div ref={railRef} className="relative z-10 md:h-[155vh]">
        <div className="mx-auto flex w-full max-w-[1720px] flex-col justify-center px-5 py-14 md:sticky md:top-0 md:h-screen md:px-10 md:py-0">
          <div className="grid gap-8 md:grid-cols-12 md:gap-6">
            <aside className="md:col-span-3 lg:col-span-2">
              <div className="sticky top-28">
                <Asterisk className="spin-slow size-16 text-green md:size-20" />
                <p className="mono mt-5 max-w-[150px] leading-relaxed opacity-55">
                  A decentered practice. Built across places, tools and time zones.
                </p>
                <div className="mono mt-8 hidden items-center gap-2 opacity-45 md:flex">
                  <span className="h-px w-8 bg-ink/40" />
                  Keep scrolling
                </div>
              </div>
            </aside>

            <div className="md:col-span-9 md:pt-[6vh] lg:col-span-10">
              <p className="max-w-[15.8ch] font-sans text-[clamp(2.2rem,5.6vw,6.6rem)] font-medium leading-[0.98] tracking-[-0.065em] md:max-w-none">
                {statement.map((token, index) => (
                  <span
                    key={`${token.text}-${index}`}
                    className={cn(
                      "word mr-[0.21em] max-md:!opacity-100",
                      index < activeCount && "is-on",
                      token.accent === "serif" && "serif font-normal italic",
                      token.accent === "blue" && "text-blue",
                      token.accent === "green" && "text-green"
                    )}
                  >
                    {token.text}
                  </span>
                ))}
              </p>

              <div className="mt-10 grid gap-6 border-t border-ink/25 pt-5 sm:grid-cols-2 md:mt-16 md:pl-[26%]">
                <p className="mono opacity-45">
                  The work is equal parts editor and engineer: choosing what belongs, then building
                  the behavior that makes it feel alive.
                </p>
                <p className="body-copy max-w-[380px] text-sm leading-relaxed text-ink/65 md:col-start-2 md:row-start-1">
                  Currently taking on select collaborations for 2026. Typography, motion, interaction
                  and the spaces in between.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1720px] px-5 pb-16 md:px-10 md:pb-24">
        <RevealLine />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <span className="mono opacity-50">Working principles</span>
              <span className="mono opacity-40">01—03</span>
            </div>
            <div className="border-t border-ink/25">
              {principles.map((principle, index) => (
                <Reveal key={principle.index} delay={index * 90}>
                  <div className="group grid grid-cols-[36px_1fr] gap-4 border-b border-ink/20 py-5 md:grid-cols-[50px_1fr_1.1fr] md:gap-6 md:py-6">
                    <span className="mono pt-1 opacity-45 transition-colors group-hover:text-blue group-hover:opacity-100">
                      {principle.index}
                    </span>
                    <h3 className="text-lg font-medium tracking-[-0.035em] transition-transform duration-500 group-hover:translate-x-1 md:text-2xl">
                      {principle.title}
                    </h3>
                    <p className="col-start-2 max-w-[350px] text-sm leading-relaxed text-ink/60 transition-colors group-hover:text-ink/80 md:col-start-3">
                      {principle.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 self-end border-l border-t border-ink/25">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "group relative flex min-h-[130px] flex-col justify-between border-b border-r border-ink/25 p-4 transition-colors duration-500 hover:bg-green hover:text-paper md:min-h-[155px] md:p-5",
                  index === 2 && "border-l-0"
                )}
              >
                <span className="mono opacity-45 group-hover:opacity-70">N° {index + 1}</span>
                <div className="flex items-end justify-between gap-2">
                  <span className="font-sans text-[clamp(2.4rem,4.2vw,4.6rem)] font-medium leading-none tracking-[-0.07em]">
                    {stat.value}
                  </span>
                  <span className="mono max-w-[86px] text-right opacity-55 group-hover:opacity-75">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
