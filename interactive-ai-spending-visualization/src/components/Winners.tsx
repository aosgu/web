import { motion } from "framer-motion";
import { winners } from "../data/flow";

const tone: Record<string, string> = {
  gold: "from-amber-200 to-yellow-700",
  cyan: "from-teal-200 to-cyan-700",
  ember: "from-orange-300 to-orange-800",
  mute: "from-stone-300 to-stone-600",
};

export default function Winners() {
  return (
    <section id="capture" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] tracking-[0.4em] text-gold uppercase">06 / Capture</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl font-bold md:text-6xl">
          谁真正把钱
          <span className="gold-text">留下？</span>
        </h2>
        <p className="mt-5 max-w-2xl text-paper-dim">
          价值捕获不是看谁更智能，是看谁更不可替代、谁更靠近物理瓶颈。条越长，越像这条河上的收税官。
        </p>

        <div className="mt-14 space-y-4">
          {winners.map((w, i) => (
            <motion.div
              key={w.name}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="grid items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.025] p-4 md:grid-cols-[180px_1fr_88px] md:p-5"
            >
              <div>
                <div className="font-serif text-xl">{w.name}</div>
                <div className="font-mono text-[10px] tracking-widest text-mute uppercase">{w.role}</div>
              </div>
              <div>
                <div className="h-3 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${w.margin}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${tone[w.tone]}`}
                  />
                </div>
                <p className="mt-2 text-sm text-paper-dim">{w.why}</p>
              </div>
              <div className="font-display text-right text-2xl text-gold-2">{w.margin}</div>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 font-mono text-[10px] tracking-widest text-mute">
          指数为结构位置的相对评分，不是会计毛利率本身。
        </p>
      </div>
    </section>
  );
}
