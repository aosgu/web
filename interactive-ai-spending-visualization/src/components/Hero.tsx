import { motion } from "framer-motion";
import ParticleField from "./ParticleField";

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <img
        src="/images/hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/55 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.18),transparent_42%)]" />
      <ParticleField density={90} />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28 md:px-10 md:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-mono text-[11px] tracking-[0.42em] text-gold-2/80 uppercase"
        >
          Follow the money · against the current
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mt-5 max-w-5xl font-serif text-[18vw] leading-[0.86] font-black tracking-tight text-paper sm:text-[12vw] md:text-[9.4vw]"
        >
          <span className="gold-text">溯流</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-paper-dim md:text-2xl"
        >
          你付给 AI 的每一分钱，正在逆流而上。
          <br className="hidden md:block" />
          穿过模型公司、云、芯片、光刻机、矿山，最终变成废热。
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center gap-6"
        >
          <a
            href="#drop"
            className="animate-pulse-gold group inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink"
          >
            <span className="h-2 w-2 rounded-full bg-ink" />
            投入二十美元
            <span className="transition group-hover:translate-x-1">↑</span>
          </a>
          <a
            href="#audit"
            className="font-mono text-[11px] tracking-[0.32em] text-mute uppercase hover:text-gold-2"
          >
            先读审计声明
          </a>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 md:grid-cols-4">
          {[
            ["$725B+", "2026 云资本开支量级"],
            ["70%+", "收费站的毛利"],
            ["1 家", "EUV 光刻垄断"],
            ["kT ln2", "一比特的物理税"],
          ].map(([a, b]) => (
            <div key={a}>
              <div className="font-display text-2xl text-gold-2 md:text-3xl">{a}</div>
              <div className="mt-1 font-mono text-[10px] tracking-widest text-mute uppercase">{b}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="font-mono text-[9px] tracking-[0.4em] text-mute">SCROLL UPSTREAM</span>
        <span className="h-10 w-px bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
