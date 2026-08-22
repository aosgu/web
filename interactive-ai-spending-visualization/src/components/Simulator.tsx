import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { money, products, splits, type ProductId, type SplitNode } from "../data/flow";

function Branch({
  nodes,
  parent,
  depth,
  open,
  onToggle,
}: {
  nodes: SplitNode[];
  parent: number;
  depth: number;
  open: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {nodes.map((n) => {
        const abs = parent * n.pct;
        const expanded = open.has(n.id);
        return (
          <motion.div
            key={n.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]"
          >
            <button
              onClick={() => onToggle(n.id)}
              className="flex w-full items-center gap-4 px-4 py-4 text-left md:px-5"
            >
              <span
                className="h-9 w-1.5 shrink-0 rounded-full"
                style={{ background: n.color, boxShadow: `0 0 16px ${n.color}55` }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <div className="font-serif text-lg text-paper">{n.label}</div>
                    <div className="mt-1 text-xs leading-6 text-mute">{n.hint}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl text-gold-2">{money(abs)}</div>
                    <div className="font-mono text-[10px] tracking-widest text-mute">
                      {(n.pct * 100).toFixed(0)}% · L{depth}
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(n.pct * 100, 4)}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: n.color }}
                  />
                </div>
              </div>
              {n.children && (
                <span className="font-mono text-[10px] text-gold-2">{expanded ? "−" : "+"}</span>
              )}
            </button>
            <AnimatePresence>
              {expanded && n.children && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/6 px-3 pt-3 pb-4 md:px-6"
                >
                  <Branch
                    nodes={n.children}
                    parent={abs}
                    depth={depth + 1}
                    open={open}
                    onToggle={onToggle}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function Simulator() {
  const [pid, setPid] = useState<ProductId>("plus");
  const [dropped, setDropped] = useState(false);
  const [open, setOpen] = useState<Set<string>>(new Set(["compute", "gpu"]));
  const product = products.find((p) => p.id === pid)!;
  const tree = splits[pid];

  const topGold = useMemo(() => {
    const find = (nodes: SplitNode[], parent: number): number => {
      let s = 0;
      for (const n of nodes) {
        const abs = parent * n.pct;
        if (n.id.includes("profit") || n.id === "residual" || n.id === "nvda-profit") s += abs;
        if (n.children) s += find(n.children, abs);
      }
      return s;
    };
    return find(tree, product.price);
  }, [tree, product.price]);

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="drop" className="relative px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] tracking-[0.4em] text-gold uppercase">02 / The Drop</p>
            <h2 className="mt-3 font-serif text-4xl font-bold md:text-6xl">
              把一笔钱
              <span className="gold-text">投进上游</span>
            </h2>
            <p className="mt-4 max-w-xl text-paper-dim">
              选择一张账单，观察它如何在每一层被截留、转手、摊销。点击色条可继续往上拆。
            </p>
          </div>
          <div className="font-mono text-xs tracking-widest text-mute uppercase">
            教育性推演 · 非官方财报
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPid(p.id);
                setDropped(false);
                setOpen(new Set(["compute", "gpu"]));
              }}
              className={`rounded-2xl border p-5 text-left transition ${
                pid === p.id
                  ? "border-gold/50 bg-gold/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="font-mono text-[10px] tracking-widest text-mute uppercase">{p.en}</div>
              <div className="mt-2 font-serif text-xl">{p.name}</div>
              <div className="mt-3 font-display text-3xl text-gold-2">
                ${p.price}
                <span className="ml-1 font-mono text-xs text-mute">{p.unit}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 card-glass relative overflow-hidden rounded-[28px] p-6 md:p-10">
          <div className="absolute inset-0 opacity-30">
            <img src="/images/gold-coin.jpg" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/70" />
          </div>

          <div className="relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="text-center lg:text-left">
              <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-b from-amber-200 to-yellow-700 shadow-[0_0_60px_rgba(212,175,55,0.28)] lg:mx-0">
                <div>
                  <div className="font-display text-4xl text-ink">${product.price}</div>
                  <div className="font-mono text-[9px] tracking-widest text-ink/70">TOKEN FEE</div>
                </div>
              </div>
              <p className="mt-6 text-sm leading-7 text-paper-dim">{product.note}</p>
              <button
                onClick={() => setDropped(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm text-ink"
              >
                {dropped ? "已投入，继续拆解" : "投入上游"}
                <span>↑</span>
              </button>
              {dropped && (
                <div className="mt-6 grid grid-cols-2 gap-4 text-left">
                  <div>
                    <div className="font-mono text-[10px] tracking-widest text-mute">利润池合计</div>
                    <div className="font-display text-2xl text-gold-2">{money(topGold)}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-widest text-mute">物理层去向</div>
                    <div className="font-display text-2xl text-cyan">电 / 硅 / 热</div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <AnimatePresence mode="wait">
                {!dropped ? (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[280px] items-center justify-center border border-dashed border-white/15 text-center"
                  >
                    <div>
                      <div className="font-serif text-2xl text-paper/70">钱还停在你的口袋里</div>
                      <div className="mt-2 font-mono text-xs tracking-widest text-mute">
                        DROP TO SPLIT
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key={pid} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <Branch
                      nodes={tree}
                      parent={product.price}
                      depth={1}
                      open={open}
                      onToggle={toggle}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
