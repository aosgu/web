import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CHAPTERS } from "@/data/content";
import { ChapterRail, Grain, TopBar } from "@/components/Chrome";
import ColdOpen from "@/scenes/ColdOpen";
import RouteMap from "@/scenes/RouteMap";
import SandTable from "@/scenes/SandTable";
import Paper from "@/scenes/Paper";
import BarRace from "@/scenes/BarRace";
import LineChart from "@/scenes/LineChart";
import Collage from "@/scenes/Collage";
import Timeline from "@/scenes/Timeline";
import Numbers from "@/scenes/Numbers";
import Compare from "@/scenes/Compare";
import EndCard from "@/scenes/EndCard";

export default function App() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ids = CHAPTERS.map((c) => c.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = ids.indexOf(e.target.id);
          if (i >= 0) setActive(i);
        });
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (i: number) => {
    const el = document.getElementById(CHAPTERS[i]?.id ?? "open");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen bg-ink">
      <TopBar activeIndex={active} />
      <ChapterRail activeIndex={active} onSelect={jump} />

      <main>
        <ColdOpen />
        <CutBar label="01 — the route" />
        <RouteMap />
        <CutBar label="02 — the sand table" />
        <SandTable />
        <CutBar label="03 — the document" />
        <Paper />
        <CutBar label="04 — the race" />
        <BarRace />
        <CutBar label="05 — the curve" />
        <LineChart />
        <CutBar label="06 — the collage" />
        <Collage />
        <CutBar label="07 — the timeline" />
        <Timeline />
        <CutBar label="08 — the numbers" />
        <Numbers />
        <Compare />
        <EndCard onJump={jump} />
      </main>

      <Grain />
    </div>
  );
}

function CutBar({ label }: { label: string }) {
  return (
    <div className="relative flex h-[13vh] min-h-[86px] items-center justify-center overflow-hidden bg-ink">
      <div
        className="absolute inset-y-0 left-0 w-[22%] opacity-45"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #ffd400 0 9px, #0b0b0d 9px 18px)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[22%] opacity-45"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #ffd400 0 9px, #0b0b0d 9px 18px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, letterSpacing: "0.1em" }}
        whileInView={{ opacity: 1, letterSpacing: "0.34em" }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex items-center gap-3 bg-ink px-4 font-mono text-[10px] tracking-[0.34em] text-paper/55 uppercase"
      >
        <span className="h-[1px] w-8 bg-paper/30" />
        cut to {label}
        <span className="h-[1px] w-8 bg-paper/30" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 scan-lines opacity-40" />
    </div>
  );
}
