import { motion } from "framer-motion";
import { CascadeDiagram } from "./illustrations/CascadeDiagram";
import { OrganOfCorti } from "./illustrations/OrganOfCorti";
import heroAnatomy from "../assets/hero-anatomy.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

/* ============================== HERO ============================== */
export function Hero() {
  return (
    <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* background grid + glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
        }}
      />

      {/* anatomical hero image (glow blends through) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <img
          src={heroAnatomy}
          alt=""
          className="h-[120%] w-[120%] object-cover opacity-50 mix-blend-screen"
          style={{
            maskImage:
              "radial-gradient(ellipse 75% 75% at 50% 45%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 75% at 50% 45%, black 30%, transparent 75%)",
          }}
        />
      </div>
      {/* darken center so text stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_45%,rgba(0,0,0,0.85),transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
          A Clinical Atlas · Mechanisms of Disease
        </div>

        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-7xl">
          When Hearing Fades,
          <br />
          <span className="bg-gradient-to-r from-violet-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">
            the Body Follows
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-white/60">
          Hearing loss is rarely just an ear problem. A damaged cochlea sends ripples through the
          brain, the heart, the balance system, and the immune system. This atlas traces each
          biological pathway — from a single hair cell to systemic disease.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#cognition"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105"
          >
            Explore the pathways
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#basis"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
          >
            Start with the cell
          </a>
        </div>

        {/* hero stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
          {[
            { v: "1.6B", l: "people live with hearing loss (WHO)" },
            { v: "8%", l: "of global dementia attributable" },
            { v: "#1", l: "modifiable dementia risk factor" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl font-bold text-white sm:text-4xl">{s.v}</div>
              <div className="mt-1 text-xs leading-snug text-white/45">{s.l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30"
      >
        scroll
      </motion.div>
    </header>
  );
}

/* ============================== OVERVIEW ============================== */
export function Overview() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">
            The Map of Harm
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            One organ, five cascades
          </h2>
          <p className="mt-5 text-white/55">
            The cochlea sits at the center of an anatomical and neurological web. Damage there does
            not stay there. Follow the spokes to see how sensory deprivation becomes systemic disease.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-8 max-w-2xl"
        >
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-10">
            <CascadeDiagram />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================== CELLULAR BASIS ============================== */
export function CellularBasis() {
  return (
    <section id="basis" className="relative py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(50% 50% at 20% 50%, rgba(255,255,255,0.05), transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <motion.div {...fadeUp} className="order-2 lg:order-1">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-4">
            <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-white/20" />
            <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-white/20" />
            <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-white/20" />
            <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-white/20" />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest text-white/25 [writing-mode:vertical-rl]">
              FIG. 00
            </div>
            <OrganOfCorti color="#a78bfa" soft="rgba(167,139,250,0.12)" />
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="order-1 lg:order-2">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300/70">
            The Cellular Origin
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            Why the damage is permanent
          </h2>
          <div className="mt-6 space-y-4 text-white/60">
            <p>
              Inside the spiral of the cochlea, roughly{" "}
              <span className="text-white">15,000 hair cells</span> convert vibration into the
              electrical language of the nervous system. Microscopic stereocilia bend with sound,
              opening ion channels that release glutamate onto the auditory nerve.
            </p>
            <p>
              Here is the catch:{" "}
              <span className="text-violet-200">
                mammalian hair cells do not regenerate
              </span>
              . A lifetime of noise, aging (presbycusis), and ototoxic drugs silently kills them —
              and the neurons they once fed can retract too, a hidden loss beneath a normal audiogram.
            </p>
            <p>
              Every pathway that follows begins with this one, irreversible cellular injury.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Noise", "Aging (presbycusis)", "Ototoxic drugs", "Genetics"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-xs text-white/55"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================== INTERVENTION ============================== */
export function Intervention() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          {...fadeUp}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-10 text-center sm:p-16"
        >
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-teal-300/30 bg-teal-300/10 text-2xl">
            ✚
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-300/70">
            The Reversing Evidence
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
            Hearing is modifiable — and so is the harm
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-white/60">
            Because hearing loss sits at the root of the cascade, restoring input can slow the
            downstream damage. In the randomized{" "}
            <span className="text-white">ACHIEVE trial (2023)</span>, a hearing intervention reduced
            three-year cognitive decline by{" "}
            <span className="text-teal-300">48%</span> in older adults at elevated risk.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { v: "−19%", l: "long-term cognitive decline with hearing aids" },
              { v: "48%", l: "slowing of decline in high-risk adults (ACHIEVE)" },
              { v: "Lower", l: "mortality among hearing-aid users vs. non-users" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <div className="font-display text-3xl font-bold text-teal-300">{s.v}</div>
                <div className="mt-2 text-xs leading-snug text-white/50">{s.l}</div>
              </div>
            ))}
          </div>
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
            Early screening · Amplification · Protection · Rehab
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================== FOOTER / REFERENCES ============================== */
export function References() {
  const refs = [
    "The Lancet Commission on Dementia Prevention (2020, 2023) — hearing loss as the largest modifiable risk factor.",
    "Lin FR et al. (2011) Archives of Neurology — hearing loss and incident dementia.",
    "Lin FR et al. (2014) Neuroimage — sensory deprivation and accelerated brain atrophy.",
    "Lin FR & Ferrucci L (2012) JAMA Internal Medicine — hearing loss and falls (10 dB → 1.4× risk).",
    "Deal JA et al. (2023) — ACHIEVE randomized controlled trial of hearing intervention.",
    "Holt-Lunstad J et al. (2015) — meta-analysis of social isolation, loneliness, and mortality.",
    "Friedland DR et al. (2009) — audiometric patterns and cardiovascular disease.",
  ];
  return (
    <footer className="relative border-t border-white/10 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-xl font-bold text-white">Atlas of Hearing Loss</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/45">
              An educational synthesis of the biomedical evidence linking sensorineural hearing loss
              to systemic disease. This page is for general scientific literacy and is not medical
              advice.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
              © 2026 · Mechanisms of Disease
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">
              Selected Sources
            </h4>
            <ul className="mt-4 space-y-3">
              {refs.map((r, i) => (
                <li key={i} className="flex gap-3 text-xs leading-relaxed text-white/40">
                  <span className="font-mono text-white/25">{String(i + 1).padStart(2, "0")}</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
