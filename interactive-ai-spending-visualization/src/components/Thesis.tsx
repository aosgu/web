import { motion } from "framer-motion";
import { stats } from "../data/flow";

export default function Thesis() {
  return (
    <section id="audit" className="relative overflow-hidden px-6 py-28 md:px-10 md:py-36">
      <div className="pointer-events-none absolute top-24 -left-10 font-serif text-[28vw] leading-none font-black text-white/[0.03] select-none">
        审
      </div>
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="font-mono text-[11px] tracking-[0.4em] text-gold uppercase">01 / Manifesto</p>
          <h2 className="mt-4 font-serif text-4xl leading-tight font-bold md:text-6xl">
            这不是产品评测。
            <br />
            <span className="gold-text">这是一次逆流审计。</span>
          </h2>
          <div className="mt-8 space-y-5 text-base leading-[1.9] text-paper-dim md:text-lg">
            <p>
              公开市场喜欢讨论谁更聪明：参数、榜单、发布会。更安静、也更硬的事实是——智能是一种被高度组织过的能耗。钱从聊天窗口出发，几乎不会停在会讲故事的那一层。
            </p>
            <p>
              模型公司收下订阅，转手把最大的一笔交给云；云把最大的一笔交给加速卡；加速卡把制造交给台积电，把带宽交给海力士，把光交给 ASML，把瓦特交给电网，把伤口留给矿坑。
            </p>
            <p>
              越往上游，卖的东西越不像软件，越像物理、垄断与时间。越往下游，叙事越华丽，利润越薄。这不是道德指控，是一张被故意画得太短的价值链。
            </p>
          </div>
          <p className="mt-8 border-l border-gold/50 pl-5 font-mono text-xs leading-7 text-mute">
            下列拆分是基于公开报道、行业毛利率与资本开支指引的教育性推演，不是任何公司的官方成本会计。数字用于看清结构，而非精确到分。
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {stats.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card-glass hairline rounded-2xl p-5"
            >
              <div className="font-mono text-[10px] tracking-[0.28em] text-mute uppercase">{s.k}</div>
              <div className="mt-2 font-display text-3xl text-gold-2">{s.v}</div>
              <div className="mt-2 text-sm text-paper-dim">{s.d}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
