import { motion } from "framer-motion";
import type { Pathway } from "../data/pathways";
import { PathwayIllustration } from "./illustrations/PathwayIllustrations";

export function PathwaySection({ pathway, flip }: { pathway: Pathway; flip: boolean }) {
  const { accent, accentSoft } = pathway;

  return (
    <section id={pathway.id} className="relative py-20 sm:py-28">
      {/* soft accent backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(60% 50% at ${flip ? "80%" : "20%"} 40%, ${accentSoft}, transparent 70%)`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* index + title row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className={`flex items-end gap-6 ${flip ? "flex-row-reverse text-right" : ""}`}
        >
          <div
            className="font-mono text-6xl font-semibold leading-none sm:text-7xl"
            style={{ color: accent }}
          >
            {pathway.index}
          </div>
          <div className={flip ? "" : ""}>
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">
              {pathway.subtitle}
            </div>
            <h2 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
              {pathway.title}
            </h2>
          </div>
        </motion.div>

        {/* main grid */}
        <div
          className={`mt-12 grid items-center gap-10 lg:grid-cols-2 ${
            flip ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div
              className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-4"
              style={{ boxShadow: `0 0 80px -30px ${pathway.glow}` }}
            >
              {/* corner ticks */}
              <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-white/20" />
              <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-white/20" />
              <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-white/20" />
              <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-white/20" />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest text-white/25 [writing-mode:vertical-rl]">
                FIG. {pathway.index}
              </div>
              <PathwayIllustration icon={pathway.icon} color={accent} soft={accentSoft} />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* stat */}
            <div className="inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3">
              <span className="font-display text-4xl font-bold" style={{ color: accent }}>
                {pathway.stat.value}
              </span>
              <span className="max-w-[200px] text-sm leading-snug text-white/60">
                {pathway.stat.label}
              </span>
            </div>

            {/* mechanisms */}
            <ul className="space-y-4">
              {pathway.mechanisms.map((m, i) => (
                <motion.li
                  key={m.name}
                  initial={{ opacity: 0, x: flip ? -16 : 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  className="group relative rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-base font-semibold text-white">{m.name}</h3>
                    <span
                      className="shrink-0 font-mono text-[10px] uppercase tracking-wider"
                      style={{ color: accent }}
                    >
                      {m.tag}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{m.detail}</p>
                </motion.li>
              ))}
            </ul>

            {/* takeaway */}
            <div
              className="rounded-xl border-l-2 bg-white/[0.03] py-3 pl-4 pr-3"
              style={{ borderColor: accent }}
            >
              <p className="text-sm leading-relaxed text-white/70">
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
                  Key finding ·{" "}
                </span>
                {pathway.takeaway}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
