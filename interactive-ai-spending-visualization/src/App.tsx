import { useEffect, useState } from "react";
import Cursor from "./components/Cursor";
import Entropy from "./components/Entropy";
import Footer from "./components/Footer";
import Geography from "./components/Geography";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import River from "./components/River";
import Sankey from "./components/Sankey";
import Simulator from "./components/Simulator";
import Thesis from "./components/Thesis";
import Travelogue from "./components/Travelogue";
import Winners from "./components/Winners";

export default function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-ink text-paper">
      <div className="grain" />
      <div className="vignette" />
      <Cursor />
      <Nav progress={progress} />
      <div className="pointer-events-none fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 font-serif text-[11px] tracking-[0.65em] text-gold/30 [writing-mode:vertical-rl] lg:block">
        钱往上游走 · 热往宇宙去
      </div>
      <Hero />
      <div className="overflow-hidden border-y border-gold/15 bg-black py-3">
        <div
          className="flex w-max gap-12 whitespace-nowrap font-mono text-[11px] tracking-[0.35em] text-gold-2/80 uppercase"
          style={{ animation: "marquee 36s linear infinite" }}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-12 pr-12">
              <span>User → Lab → Cloud → NVIDIA → TSMC → ASML → Mine → Heat</span>
              <span>订阅不是资产</span>
              <span>毛利在收费站</span>
              <span>终局是熵</span>
              <span>User → Lab → Cloud → NVIDIA → TSMC → ASML → Mine → Heat</span>
              <span>订阅不是资产</span>
              <span>毛利在收费站</span>
              <span>终局是熵</span>
            </span>
          ))}
        </div>
      </div>
      <Thesis />
      <Simulator />
      <Travelogue />
      <River />
      <Sankey />
      <Geography />
      <Winners />
      <Entropy />
      <Footer />
    </div>
  );
}
