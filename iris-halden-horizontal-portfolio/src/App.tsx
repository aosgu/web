import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Chrome } from "./chrome";
import { Capability, Contact, Cover, Record, Statement, Work } from "./sections";
import { SHEETS } from "./ui";

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export default function App() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);
  const coordTextRef = useRef<HTMLSpanElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const sheetRef = useRef(0);
  const pctNodes = useRef<NodeListOf<HTMLElement> | null>(null);

  const [sheet, setSheet] = useState(0);
  const [fracs, setFracs] = useState<number[]>(() =>
    SHEETS.map((_, i) => i / (SHEETS.length - 1)),
  );

  const getPanels = useCallback(
    () =>
      trackRef.current
        ? Array.from(trackRef.current.querySelectorAll<HTMLElement>(".panel"))
        : [],
    [],
  );

  /* ── scroll → ruler, title block, active sheet ───────────── */
  const update = useCallback(() => {
    const st = stRef.current;
    let p: number;
    if (st) {
      p = (window.scrollY - st.start) / Math.max(1, st.end - st.start);
    } else {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      p = max > 0 ? window.scrollY / max : 0;
    }
    p = clamp01(p);

    if (penRef.current) penRef.current.style.left = `${(p * 100).toFixed(3)}%`;
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    const nodes = pctNodes.current;
    if (nodes) {
      const txt = (p * 100).toFixed(1).padStart(4, "0");
      for (let i = 0; i < nodes.length; i++) nodes[i].textContent = txt;
    }

    const horizontal = document.documentElement.dataset.mode === "horizontal";
    const panels = getPanels();
    const threshold = horizontal ? window.innerWidth * 0.34 : window.innerHeight * 0.45;
    let idx = 0;
    for (let i = 0; i < panels.length; i++) {
      const r = panels[i].getBoundingClientRect();
      if ((horizontal ? r.left : r.top) <= threshold) idx = i;
    }
    if (idx !== sheetRef.current) {
      sheetRef.current = idx;
      setSheet(idx);
    }
  }, [getPanels]);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const panels = Array.from(track.querySelectorAll<HTMLElement>(".panel"));
    const horizontal = document.documentElement.dataset.mode === "horizontal";
    const dist = Math.max(1, track.scrollWidth - window.innerWidth);
    const next = panels.map((p, i) =>
      horizontal ? Math.min(1, p.offsetLeft / dist) : i / Math.max(1, panels.length - 1),
    );
    setFracs(next);
    update();
  }, [update]);

  const goTo = useCallback(
    (i: number) => {
      const panels = getPanels();
      const target = panels[Math.max(0, Math.min(panels.length - 1, i))];
      if (!target) return;
      const st = stRef.current;
      if (st) {
        window.scrollTo({ top: st.start + target.offsetLeft, behavior: "smooth" });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [getPanels],
  );

  const rewind = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  /* ── setup ───────────────────────────────────────────────── */
  useEffect(() => {
    pctNodes.current = document.querySelectorAll<HTMLElement>("[data-pct]");
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1280px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)",
      () => {
      const track = trackRef.current;
      const wrap = wrapRef.current;
      if (!track || !wrap) return;

      document.documentElement.dataset.mode = "horizontal";
      const dist = () => Math.max(1, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      stRef.current = tween.scrollTrigger ?? null;

      const panels = gsap.utils.toArray<HTMLElement>(".panel");
      panels.forEach((panel) => {
        const mk = () => ({
          trigger: panel,
          containerAnimation: tween,
          start: "left 94%",
          end: "left 60%",
          scrub: 0.6,
        });
        const rise = panel.querySelectorAll("[data-rise]");
        if (rise.length) {
          gsap.from(rise, {
            y: 34,
            opacity: 0,
            duration: 1,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: mk(),
          });
        }
        const bars = panel.querySelectorAll("[data-bar]");
        if (bars.length) {
          gsap.from(bars, {
            scaleX: 0,
            duration: 1,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: mk(),
          });
        }
        const draws = panel.querySelectorAll("[data-draw]");
        if (draws.length) {
          gsap.fromTo(
            draws,
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: mk(),
            },
          );
        }
      });

      measure();
      ScrollTrigger.refresh();

      return () => {
        stRef.current = null;
        delete document.documentElement.dataset.mode;
        setFracs(SHEETS.map((_, i) => i / (SHEETS.length - 1)));
      };
    });

    /* cover: pen-plotter entrance */
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".cover-in > *", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 })
        .from(".cover-ln", { y: 72, opacity: 0, duration: 1.15, stagger: 0.1, ease: "power4.out" }, "-=0.35")
        .from(".cover-serif", { y: 26, opacity: 0, duration: 0.9 }, "-=0.75")
        .from(".cover-body", { y: 18, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")
        .from(".cover-foot", { opacity: 0, duration: 0.8 }, "-=0.45")
        .fromTo(
          "[data-hero-draw]",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.8, stagger: 0.018, ease: "power1.inOut" },
          0.3,
        );
    }

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts) fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => mm.revert();
  }, [measure]);

  /* ── listeners ───────────────────────────────────────────── */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };
    let movePending = false;
    const onMove = (e: MouseEvent) => {
      if (coordRef.current) {
        coordRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (movePending) return;
      movePending = true;
      requestAnimationFrame(() => {
        movePending = false;
        if (coordTextRef.current) {
          const x = String(Math.round(e.clientX)).padStart(4, "0");
          const y = String(Math.round(e.clientY)).padStart(4, "0");
          coordTextRef.current.textContent = `X ${x} · Y ${y}`;
        }
      });
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(input|textarea|select)$/i.test(t.tagName)) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goTo(sheetRef.current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goTo(sheetRef.current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(SHEETS.length - 1);
      }
    };
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measure();
        ScrollTrigger.refresh();
        update();
      }, 180);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
    };
  }, [update, measure, goTo]);

  return (
    <>
      <Chrome
        sheet={sheet}
        fracs={fracs}
        onGo={goTo}
        penRef={penRef}
        barRef={barRef}
        coordRef={coordRef}
        coordTextRef={coordTextRef}
      />
      <main>
        <div className="wrap" ref={wrapRef}>
          <div className="track" ref={trackRef}>
            <Cover />
            <Statement />
            <Work />
            <Capability />
            <Record />
            <Contact onTop={rewind} />
            <div className="tear" aria-hidden />
          </div>
        </div>
      </main>
    </>
  );
}
