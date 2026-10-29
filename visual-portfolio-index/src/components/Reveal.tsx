import { useRef, type ReactNode } from "react";
import { useInView } from "../hooks/useScroll";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Fades and lifts its children in the first time they scroll into view. */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ${
        inView ? "translate-y-0 opacity-100 blur-0" : "translate-y-14 opacity-0 blur-[3px]"
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </div>
  );
}
