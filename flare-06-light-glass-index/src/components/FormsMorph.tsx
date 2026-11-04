import { useRef, useState } from "react";
import { Lens, Pill, css, type Hue, type Rim } from "./Glass";
import { clamp, ease, lerp, useScrollProgress } from "../hooks/useScroll";

/** Pill pose: x, y (container %), rotation (deg), uniform scale. */
type Pose = [number, number, number, number];
/** Lens pose: x, y (container %), rotation (deg), width, height (container %). */
type LensPose = [number, number, number, number, number];

type Layout = { name: string; text: string; pills: Pose[]; lenses: LensPose[] };

/** Same column order and colour story as the original piece. */
const hues: Hue[] = ["gold", "rose", "prism", "dusk", "azure", "tide", "sun", "volt"];
const rims: Rim[] = ["warm", "cool", "rose", "cool"];
const order = [0, 1, 2, 3, 4, 5, 6, 7];
const stagger = [-3, 1, -1, 2, -2, 0, 3, -1];
const radians = (deg: number) => (deg * Math.PI) / 180;

const column = (i: number): Pose => [(i - 3.5) * 11.6, stagger[i], 0, 1.18];
const fan = (i: number): Pose => {
  const angle = (i - 3.5) * 13;
  return [Math.sin(radians(angle)) * 34, 34 - Math.cos(radians(angle)) * 34, angle, 1];
};
const orbit = (i: number): Pose => {
  const angle = i * 45;
  return [Math.sin(radians(angle)) * 30, -Math.cos(radians(angle)) * 30, angle, 0.55];
};
const strata = (i: number): Pose => [[-10, 8, -4, 12, -12, 6, -6, 10][i], (i - 3.5) * 9.2, 90, 0.82];
const monolith = (i: number): Pose => [(i - 3.5) * 0.9, 0, 0, 1.25];

const layouts: Layout[] = [
  {
    name: "Column",
    text: "The original grammar. Eight capsules of emitted colour, four panes of glass sitting exactly on the seams.",
    pills: order.map(column),
    lenses: [[-34.8, -6, 0, 11.6, 46], [-11.6, -14, 0, 11.6, 30], [11.6, 6, 0, 11.6, 38], [34.8, -8, 0, 11.6, 44]],
  },
  {
    name: "Fan",
    text: "Release the base and the columns become rays. The glass follows the angle of the light it sits on.",
    pills: order.map(fan),
    lenses: [[-17.5, -2, -26, 11, 34], [0, -6, 0, 11, 34], [17.5, -2, 26, 11, 34], [0, 33, 90, 9, 34]],
  },
  {
    name: "Orbit",
    text: "Bend the sequence into a loop. The panes gather at the centre and turn into a star of frosted glass.",
    pills: order.map(orbit),
    lenses: [0, 45, 90, 135].map((angle): LensPose => [0, 0, angle, 9, 24]),
  },
  {
    name: "Strata",
    text: "Turn ninety degrees. Light becomes landscape and the glass stands up as a row of windows.",
    pills: order.map(strata),
    lenses: [[-27, 0, 0, 12, 56], [-9, 5, 0, 12, 44], [9, -5, 0, 12, 50], [27, 3, 0, 12, 40]],
  },
  {
    name: "Monolith",
    text: "Compress everything into one body that still remembers every colour, wrapped in four nested lenses.",
    pills: order.map(monolith),
    lenses: [[0, 0, 0, 20, 78], [0, 0, 0, 23, 82], [0, 0, 0, 26, 86], [0, 0, 0, 29, 90]],
  },
];

export function FormsMorph() {
  const sectionRef = useRef<HTMLElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lensRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useScrollProgress(sectionRef, (progress) => {
    const last = layouts.length - 1;
    const position = progress * last;
    const from = Math.min(Math.floor(position), last - 1);
    // Hold each form for a beat, then travel between them.
    const t = ease(clamp((position - from - 0.2) / 0.6));
    const a = layouts[from];
    const b = layouts[from + 1];

    pillRefs.current.forEach((element, i) => {
      if (!element) return;
      const [x0, y0, r0, s0] = a.pills[i];
      const [x1, y1, r1, s1] = b.pills[i];
      element.style.transform =
        `translate(-50%, -50%) translate(${lerp(x0, x1, t)}cqw, ${lerp(y0, y1, t)}cqh) ` +
        `rotate(${lerp(r0, r1, t)}deg) scale(${lerp(s0, s1, t)})`;
    });

    lensRefs.current.forEach((element, i) => {
      if (!element) return;
      const [x0, y0, r0, w0, h0] = a.lenses[i];
      const [x1, y1, r1, w1, h1] = b.lenses[i];
      element.style.width = `${lerp(w0, w1, t)}cqw`;
      element.style.height = `${lerp(h0, h1, t)}cqh`;
      element.style.transform =
        `translate(-50%, -50%) translate(${lerp(x0, x1, t)}cqw, ${lerp(y0, y1, t)}cqh) rotate(${lerp(r0, r1, t)}deg)`;
    });

    sectionRef.current?.style.setProperty("--mp", progress.toFixed(4));
    setActive(Math.round(position));
  });

  const goTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const span = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (index / (layouts.length - 1)) * span, behavior: "smooth" });
  };

  return (
    <section id="forms" ref={sectionRef} className="forms">
      <div className="forms__sticky">
        <div className="forms__glow" aria-hidden="true" />

        <div className="forms__copy" data-reveal="">
          <p className="kicker">01 — Forms</p>
          <h2 className="forms__heading">
            <span className="line"><span>One grammar,</span></span>
            <span className="line"><span className="serif-i" style={css({ "--d": ".1s" })}>five bodies.</span></span>
          </h2>
          <div className="forms__states" aria-live="polite">
            {layouts.map((layout, index) => (
              <div key={layout.name} className={`forms__state ${index === active ? "is-on" : ""}`} aria-hidden={index !== active}>
                <span className="forms__num">{String(index + 1).padStart(2, "0")} / {String(layouts.length).padStart(2, "0")}</span>
                <h3 className="serif-i">{layout.name}</h3>
                <p>{layout.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="forms__stage" aria-label={`Light sculpture, form ${layouts[active].name}`} role="img">
          {hues.map((hue, index) => (
            <div key={hue} ref={(element) => { pillRefs.current[index] = element; }} className="morph__pill">
              <Pill hue={hue} className="fill" />
            </div>
          ))}
          {rims.map((rim, index) => (
            <div key={index} ref={(element) => { lensRefs.current[index] = element; }} className="morph__lens">
              <Lens rim={rim} className="fill" />
            </div>
          ))}
        </div>

        <ol className="forms__steps" aria-label="Jump to a form">
          {layouts.map((layout, index) => (
            <li key={layout.name} className={index === active ? "is-on" : ""}>
              <button type="button" onClick={() => goTo(index)} aria-current={index === active}>
                <i />
                <span>{layout.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
