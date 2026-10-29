import { useCallback, useEffect, useState } from "react";
import { Cursor, Header, Loader, Menu } from "./components/Chrome";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Work } from "./components/Work";
import { MotionStudy } from "./components/MotionStudy";
import { Playground } from "./components/Playground";
import { TypeLab } from "./components/TypeLab";
import { Contact } from "./components/Contact";
import { Ticker } from "./components/Motion";
import { scrollToId, useBodyLock, usePageScroll } from "./lib/hooks";
import { cn } from "./utils/cn";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const progress = usePageScroll();

  useEffect(() => {
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 120 : 1250;
    const timeout = window.setTimeout(() => setIntroDone(true), delay);
    return () => window.clearTimeout(timeout);
  }, []);

  useBodyLock(menuOpen || !introDone);

  const navigate = useCallback(
    (id: string) => {
      const wasOpen = menuOpen;
      setMenuOpen(false);
      window.setTimeout(() => scrollToId(id), wasOpen ? 430 : 30);
    },
    [menuOpen]
  );

  const onMenu = useCallback(() => setMenuOpen(true), []);
  const onClose = useCallback(() => setMenuOpen(false), []);

  return (
    <div className={cn("relative min-h-screen bg-paper text-ink", !introDone && "overflow-hidden")}>
      <Loader done={introDone} />
      <Cursor />
      <Header
        progress={progress}
        onMenu={onMenu}
        onNavigate={navigate}
        menuOpen={menuOpen}
      />
      <Menu open={menuOpen} onClose={onClose} onNavigate={navigate} />

      <a
        href="#work"
        className="sr-only z-[120] bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to selected work
      </a>

      <main id="main">
        <Hero onNavigate={navigate} />

        <Ticker
          items={[
            "Typography",
            "Interaction",
            "SVG systems",
            "Art direction",
            "Kinetic type",
            "Creative code",
          ]}
          className="border-green bg-green text-paper"
          fast
        />

        <About onNavigate={navigate} />
        <Work />
        <MotionStudy />
        <Playground />
        <TypeLab />
        <Contact onNavigate={navigate} />
      </main>

      <div className="pointer-events-none fixed inset-0 z-[80]">
        <div className="grain absolute inset-0" />
      </div>
    </div>
  );
}
