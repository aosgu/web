import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { layers } from "../data/flow";

export default function River() {
  const [active, setActive] = useState(layers[0].id);
  const current = layers.find((l) => l.id === active) ?? layers[0];
  const rail = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: rail, offset: ["start 70%", "end 30%"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="river" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] tracking-[0.4em] text-gold uppercase">03 / The River</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl font-bold md:text-6xl">
          十一条河床。
          <span className="gold-text">越往上，越硬。</span>
        </h2>
        <p className="mt-5 max-w-2xl text-paper-dim">
          从聊天窗口走到地壳。点选每一层，看谁在截留，谁只是通道，谁在默默付出生理学与地质学的代价。
        </p>

        <div ref={rail} className="mt-14 grid gap-10 lg:grid-cols-[220px_1fr]">
          <div className="relative">
            <div className="sticky top-24">
              <div className="absolute top-2 bottom-2 left-[15px] w-px bg-white/10" />
              <motion.div
                style={{ height }}
                className="absolute top-2 left-[15px] w-px bg-gradient-to-b from-gold-2 via-ember to-cyan"
              />
              <div className="space-y-1">
                {layers.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActive(l.id)}
                    className={`relative flex w-full items-center gap-3 py-2 pl-9 text-left ${
                      active === l.id ? "text-gold-2" : "text-mute hover:text-paper"
                    }`}
                  >
                    <span
                      className={`absolute left-[9px] h-[13px] w-[13px] rounded-full border ${
                        active === l.id
                          ? "border-gold bg-gold shadow-[0_0_12px_rgba(212,175,55,0.8)]"
                          : "border-white/30 bg-ink"
                      }`}
                    />
                    <span className="font-mono text-[10px]">{l.no}</span>
                    <span className="font-serif text-sm">{l.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.article
            key={current.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[28px] border border-white/10 bg-ink-2"
          >
            <div className="relative h-64 md:h-80">
              <img src={current.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/20 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
                <div>
                  <div className="font-mono text-[11px] tracking-[0.35em] text-gold-2">{current.en}</div>
                  <h3 className="mt-1 font-serif text-4xl font-bold md:text-5xl">{current.title}</h3>
                </div>
                <div className="text-right">
                  <div className="font-display text-3xl text-gold-2 md:text-4xl">{current.stat}</div>
                  <div className="font-mono text-[10px] tracking-widest text-paper-dim">
                    {current.statLabel}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
              <div>
                <p className="text-lg leading-[1.9] text-paper-dim">{current.insight}</p>
                <ul className="mt-6 space-y-3">
                  {current.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm leading-7 text-paper/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                  <div className="font-mono text-[10px] tracking-widest text-mute">WHO</div>
                  <div className="mt-2 font-serif text-lg">{current.who}</div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                  <div className="font-mono text-[10px] tracking-widest text-mute">CAPTURE</div>
                  <div className="mt-2 font-serif text-lg">{current.capture}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {current.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-gold/25 px-3 py-1 font-mono text-[10px] tracking-widest text-gold-2 uppercase"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
