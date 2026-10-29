import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { useInView } from "@/lib/hooks";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  clip?: boolean;
  as?: "div" | "span" | "p" | "h2";
};

export function Reveal({ children, className, delay = 0, clip = false, as = "div" }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={cn(clip ? "reveal-clip" : "reveal", inView && "is-in", className)}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

export function RevealLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div
      ref={ref}
      className={cn("reveal-line h-px w-full bg-current/20", inView && "is-in", className)}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    />
  );
}

export function ArrowUpRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("arrow-drift", className)}
    >
      <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function ArrowRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("arrow-drift", className)}
    >
      <path d="M2 10h15M12 5l5 5-5 5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function Cross({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={cn("size-3", className)}>
      <path d="M10 1v18M1 10h18" stroke={color} strokeWidth="1" />
    </svg>
  );
}

export function Asterisk({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={className}>
      <path d="M50 6v88M6 50h88M19 19l62 62M81 19 19 81" stroke="currentColor" strokeWidth="5" />
    </svg>
  );
}

export function SectionLabel({
  index,
  label,
  dark = false,
}: {
  index: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "mono flex items-center gap-3 border-t pt-3",
        dark ? "border-paper/30 text-paper/70" : "border-ink/25 text-ink/65"
      )}
    >
      <span className={cn("inline-block size-1.5 rounded-full", dark ? "bg-sky" : "bg-green")} />
      <span>{index}</span>
      <span className="opacity-40">/</span>
      <span>{label}</span>
    </div>
  );
}

type TickerProps = {
  items: string[];
  className?: string;
  dark?: boolean;
  fast?: boolean;
  reverse?: boolean;
};

export function Ticker({ items, className, dark = false, fast = false, reverse = false }: TickerProps) {
  const row = [...items, ...items];
  return (
    <div
      className={cn(
        "marquee relative select-none overflow-hidden border-y",
        dark ? "border-paper/25 bg-ink text-paper" : "border-ink/25 bg-paper text-ink",
        className
      )}
      aria-hidden="true"
    >
      <div className={cn("marquee-track", fast && "fast", reverse && "reverse")}>
        {row.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center">
            <span className="whitespace-nowrap px-5 py-3 font-sans text-[clamp(1.7rem,3.2vw,3.5rem)] font-medium leading-none tracking-[-0.055em]">
              {item}
            </span>
            <Asterisk className="size-3.5 shrink-0 opacity-70" />
          </div>
        ))}
      </div>
    </div>
  );
}
