import { useRef } from "react";
import { Lens, Pill, css, type Rim } from "./Glass";
import { useScrollProgress } from "../hooks/useScroll";

/**
 * Re-measured from the source artwork (frame 1602 × 2136).
 * [column, top %, bottom %, gradient token, parallax speed]
 * Each column is split where the original capsule ends and the next begins.
 */
const segments: [number, number, number, string, number][] = [
  [0, 4.9, 49.4, "c1u", 4],
  [0, 50.8, 97.1, "c1l", 12],
  [1, 4.9, 66.7, "c2u", 8],
  [1, 66.9, 97.1, "c2l", 16],
  [2, 4.9, 46.8, "c3u", 3],
  [2, 47.0, 97.1, "c3l", 11],
  [3, 5.1, 50.1, "c4u", 6],
  [3, 51.5, 97.1, "c4l", 14],
  [4, 4.9, 63.4, "c5u", 5],
  [4, 63.7, 97.1, "c5l", 13],
  [5, 5.1, 73.3, "c6u", 9],
  [5, 73.5, 97.1, "c6l", 18],
  [6, 5.1, 34.9, "c7u", 2],
  [6, 35.2, 97.1, "c7l", 10],
  [7, 5.1, 50.6, "c8u", 7],
  [7, 50.8, 97.1, "c8l", 15],
];

/** [seam %, top %, bottom %, rim, parallax speed] — every lens straddles a column seam. */
const lenses: [number, number, number, Rim, number][] = [
  [12.5, 8.0, 60.6, "warm", 26],
  [37.5, 15.0, 44.0, "cool", 34],
  [62.5, 23.9, 70.7, "cool", 22],
  [87.5, 12.9, 63.7, "warm", 30],
  [37.5, 60.6, 91.5, "rose", 40],
  [87.5, 70.5, 93.2, "cool", 36],
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, (progress) => ref.current?.style.setProperty("--hp", progress.toFixed(4)), "exit");

  return (
    <section id="top" ref={ref} className="hero" data-reveal="">
      <div className="hero__art">
        <div className="hero__backlight" aria-hidden="true" />
        <div className="hero__cols">
          {segments.map(([column, top, bottom, token, speed], index) => (
            <div
              key={index}
              className="hero__seg"
              style={css({ left: `${column * 12.5}%`, top: `${top}%`, height: `${bottom - top}%`, "--sp": String(speed) })}
            >
              <Pill
                paint={`var(--${token})`}
                className="fill hero__pill"
                style={css({ "--delay": `${0.12 + column * 0.07 + (top > 30 ? 0.14 : 0)}s` })}
              />
            </div>
          ))}
          {lenses.map(([seam, top, bottom, rim, speed], index) => (
            <div
              key={index}
              className="hero__lens"
              style={css({ left: `${seam - 6.7}%`, top: `${top}%`, height: `${bottom - top}%`, "--sp": String(speed) })}
            >
              <Lens rim={rim} className="fill" style={css({ "--delay": `${0.85 + index * 0.09}s` })} />
            </div>
          ))}
        </div>
      </div>

      <div className="hero__vignette" aria-hidden="true" />

      <div className="hero__copy">
        <p className="kicker hero__kicker">
          <span className="live" /> Flare / 06 — Portfolio index 2021—2026
        </p>
        <h1 className="hero__title">
          <span className="line"><span style={css({ "--d": ".25s" })}>An index of</span></span>
          <span className="line"><span style={css({ "--d": ".35s" })}><em className="serif-i grad">light,</em> glass</span></span>
          <span className="line"><span style={css({ "--d": ".45s" })}>&amp; motion.</span></span>
        </h1>
      </div>

      <dl className="hero__side">
        <div><dt>Practice</dt><dd>Art direction, interaction &amp; motion</dd></div>
        <div><dt>Material</dt><dd>Emitted colour, frosted glass, grain</dd></div>
        <div><dt>Status</dt><dd><span className="live" /> Booking Q3 2026</dd></div>
      </dl>

      <a href="#forms" className="hero__scroll">
        <span className="hero__scroll-pill"><i /></span>
        <span>Scroll to advance</span>
      </a>
    </section>
  );
}
