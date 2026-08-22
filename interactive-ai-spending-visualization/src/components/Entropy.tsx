import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Entropy() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const [sec, setSec] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const burned = 23000 * Math.max(sec, 1);

  return (
    <section id="heat" ref={ref} className="relative overflow-hidden">
      <motion.img
        style={{ y }}
        src="/images/entropy.jpg"
        alt=""
        className="absolute inset-0 h-[120%] w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />

      <div className="relative mx-auto max-w-5xl px-6 py-32 md:px-10 md:py-44">
        <p className="font-mono text-[11px] tracking-[0.4em] text-ember uppercase">07 / Terminal</p>
        <h2 className="mt-4 font-serif text-5xl leading-[1.05] font-bold md:text-7xl">
          钱的终局
          <br />
          <span className="gold-text">是热。</span>
        </h2>
        <div className="mt-10 max-w-2xl space-y-5 text-lg leading-[1.95] text-paper-dim">
          <p>
            把一枚代币逆流拆到不能再拆，你会失去所有品牌名。剩下的是石英、铜、水、铀或天然气，以及一条物理定律：擦除信息必须付能量税。
          </p>
          <p>
            利润会再变成资本开支，资本开支再变成芯片，芯片再变成下一次回答。循环看起来像繁荣，热力学看起来像单向阀。
          </p>
          <p>
            所以，严肃的结论很冷：用户购买的是暂时被组织起来的低熵；上游出售的是垄断、产能与瓦特；地球收下无法在财报里出现的高熵。智能是真的。账单也是真的。热更是真的。
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            ["兰道尔", "kT ln2", "一比特不可逆操作的下限"],
            ["杰文斯", "更高效 → 更常用", "省下来的电，会被更多问题吃掉"],
            ["会计", "外部成本", "矿坑与河流很少出现在毛利率里"],
          ].map(([a, b, c]) => (
            <div key={a} className="rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="font-mono text-[10px] tracking-widest text-mute">{a}</div>
              <div className="mt-2 font-serif text-2xl text-gold-2">{b}</div>
              <div className="mt-2 text-sm text-paper-dim">{c}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[28px] border border-ember/30 bg-black/40 p-8 text-center">
          <div className="font-mono text-[10px] tracking-[0.4em] text-mute">
            若以 2026 年约 $725B 资本开支粗算
          </div>
          <div className="mt-3 font-display text-4xl text-ember md:text-6xl">
            ${burned.toLocaleString()}
          </div>
          <div className="mt-2 text-sm text-paper-dim">你停留在此页期间，上游大约又投下这些钱。</div>
        </div>
      </div>
    </section>
  );
}
