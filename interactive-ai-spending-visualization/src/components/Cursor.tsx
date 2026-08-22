import { useEffect, useState } from "react";

export default function Cursor() {
  const [pos, setPos] = useState({ x: -80, y: -80 });
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setOn(true);
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!on) return null;

  return (
    <div
      className="pointer-events-none fixed z-[90] hidden mix-blend-screen md:block"
      style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
    >
      <div className="h-8 w-8 rounded-full border border-gold/50" />
      <div className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-2" />
    </div>
  );
}
