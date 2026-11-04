import { useEffect, useRef, useState } from "react";
import { Mark } from "./Glass";

const links = [
  { id: "forms", label: "Forms" },
  { id: "type", label: "Type" },
  { id: "work", label: "Work" },
  { id: "material", label: "Material" },
];

const labels: Record<string, string> = {
  top: "Index",
  forms: "Forms",
  type: "Type",
  work: "Work",
  material: "Material",
  contact: "Contact",
};

export function Chrome() {
  const [active, setActive] = useState("top");
  const fillRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const span = document.documentElement.scrollHeight - window.innerHeight;
      const progress = span > 0 ? window.scrollY / span : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`;
      if (numRef.current) numRef.current.textContent = String(Math.round(progress * 100)).padStart(3, "0");
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    Object.keys(labels).forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="nav">
        <a href="#top" className="nav__brand" aria-label="Flare 06, back to top">
          <Mark />
          <span>Flare<em>/06</em></span>
        </a>
        <nav className="nav__links" aria-label="Sections">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} className={active === link.id ? "is-active" : ""}>
              {link.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="nav__cta">Say hello</a>
      </header>

      <div className="rail" aria-hidden="true">
        <span className="rail__label">{labels[active]}</span>
        <span className="rail__track"><span ref={fillRef} className="rail__fill" /></span>
        <span ref={numRef} className="rail__num">000</span>
      </div>
    </>
  );
}
