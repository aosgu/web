export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 font-serif text-gold-2">
              溯
            </span>
            <span className="font-display tracking-[0.3em] text-paper/80 uppercase">Upstream</span>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-8 text-mute">
            本页是一次可视化审计实验。拆分比例依据公开报道的算力开支结构、云与半导体毛利率、设备与能源常识推演，用于理解“钱往哪走”，不构成投资建议，也不等于任何公司的成本核算。
          </p>
          <p className="mt-4 max-w-xl text-sm leading-8 text-mute">
            参考量级来自 2024–2026 年间关于超大规模厂商资本开支、OpenAI 基础设施承诺、NVIDIA 数据中心利润、台积电与 ASML 供给约束的公开讨论。终局一节是物理学，不是隐喻。
          </p>
        </div>
        <div className="space-y-4 font-mono text-[11px] tracking-widest text-mute uppercase">
          <div>00 你 · 01 模型公司 · 02 云</div>
          <div>03 收费站 · 04 显存 · 05 代工</div>
          <div>06 光刻 · 07 材料 · 08 电</div>
          <div>09 地壳 · 10 废热</div>
          <a href="#top" className="mt-6 inline-block text-gold-2 hover:text-paper">
            回到水面 ↑
          </a>
        </div>
      </div>
      <div className="mx-auto mt-14 max-w-6xl paper-rule" />
      <div className="mx-auto mt-6 flex max-w-6xl flex-wrap justify-between gap-3 font-mono text-[10px] tracking-[0.25em] text-mute uppercase">
        <span>Money flows uphill. Heat does not return.</span>
        <span>溯流 / 审计底稿</span>
      </div>
    </footer>
  );
}
