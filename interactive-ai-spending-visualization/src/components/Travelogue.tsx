import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const beats = [
  {
    t: "00:00",
    title: "点击订阅",
    body: "二十美元离开银行卡。界面只说：感谢你的支持。没有人告诉你，这张票的下一站不叫智能，叫应付账款。",
    tag: "用户",
  },
  {
    t: "00:01",
    title: "进入模型公司",
    body: "账上多了一笔经常性收入。公关把它写成热爱用户。财务把它写成：还能再买多少 GPU 小时。",
    tag: "实验室",
  },
  {
    t: "00:02",
    title: "转交给房东",
    body: "一半以上立刻变成云账单。微软、亚马逊或谷歌点头：集群还在，电表也在。",
    tag: "云",
  },
  {
    t: "00:03",
    title: "经过收费站",
    body: "加速卡按年折旧。CUDA 是关卡，HBM 是关卡，交货期也是关卡。过路费很贵，因为几乎无路可绕。",
    tag: "NVIDIA",
  },
  {
    t: "00:04",
    title: "走进无尘室",
    body: "图纸变成晶圆。黄光、超纯水、良率会议。一座岛上的工厂决定北美产品能不能按期聪明。",
    tag: "台积电",
  },
  {
    t: "00:05",
    title: "光被折成刀",
    body: "荷兰的机器，德国的镜子。没有它们，所谓先进制程只是形容词。",
    tag: "ASML",
  },
  {
    t: "00:06",
    title: "回到矿与河",
    body: "铜要挖，水要抽，电要从涡轮里来。这一段很少出现在发布会的渐变背景里。",
    tag: "地壳",
  },
  {
    t: "00:07",
    title: "变成热",
    body: "你的问题得到了回答。冷却塔把余热带走。宇宙的熵增加了一点点。收据到此为止。",
    tag: "终局",
  },
];

export default function Travelogue() {
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    if (!play) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % beats.length), 4200);
    return () => window.clearInterval(id);
  }, [play]);

  const beat = beats[i];

  return (
    <section className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-gold/20 bg-gradient-to-br from-[#16110a] to-black">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-white/10 p-8 md:p-12 lg:border-r lg:border-b-0">
            <p className="font-mono text-[11px] tracking-[0.4em] text-gold uppercase">Interlude</p>
            <h2 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
              二十美元的
              <span className="gold-text">旅行日记</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-paper-dim">
              自动翻页。也可以伸手打断它——钱的旅程本来就不会征求你同意。
            </p>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setPlay((p) => !p)}
                className="rounded-full bg-gold px-5 py-2 text-sm text-ink"
              >
                {play ? "暂停" : "继续旅行"}
              </button>
              <button
                onClick={() => setI((n) => (n + 1) % beats.length)}
                className="rounded-full border border-white/15 px-5 py-2 text-sm text-paper"
              >
                下一站
              </button>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              {beats.map((b, idx) => (
                <button
                  key={b.t}
                  onClick={() => {
                    setI(idx);
                    setPlay(false);
                  }}
                  className={`h-1.5 w-8 rounded-full ${idx === i ? "bg-gold" : "bg-white/15"}`}
                />
              ))}
            </div>
          </div>

          <div className="relative min-h-[360px] p-8 md:p-12">
            <div className="absolute top-8 right-8 font-display text-6xl text-white/5 md:text-8xl">
              {beat.t}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={beat.t}
                initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                transition={{ duration: 0.45 }}
              >
                <div className="font-mono text-[11px] tracking-[0.35em] text-gold-2 uppercase">
                  {beat.tag}
                </div>
                <h3 className="mt-4 font-serif text-3xl md:text-4xl">{beat.title}</h3>
                <p className="mt-6 max-w-lg text-lg leading-[1.9] text-paper-dim">{beat.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="absolute right-0 bottom-0 left-0 h-1 bg-white/5">
              <motion.div
                key={beat.t + play}
                initial={{ width: 0 }}
                animate={{ width: play ? "100%" : `${((i + 1) / beats.length) * 100}%` }}
                transition={{ duration: play ? 4.2 : 0.3, ease: "linear" }}
                className="h-full bg-gradient-to-r from-gold to-ember"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
