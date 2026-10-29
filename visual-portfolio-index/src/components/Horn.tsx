import { useId, type CSSProperties } from "react";

export type Corner = "tl" | "tr" | "bl" | "br";

// The disc is centred on a corner of the square; the arc bulges toward the opposite corner.
const CENTER: Record<Corner, { x: number; y: number }> = {
  tl: { x: 0, y: 0 },
  tr: { x: 100, y: 0 },
  bl: { x: 0, y: 100 },
  br: { x: 100, y: 100 },
};

interface HornProps {
  corner: Corner;
  /** Fill for the square area OUTSIDE the disc (the "horn"). */
  fill?: string;
  /** Fill for the disc area INSIDE the square. */
  discFill?: string;
  /** Multiplier of the disc radius. 1 = radius equals the side length. */
  scale?: number;
  transition?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * The quarter-disc motif from the reference image, as a pure SVG tile.
 * Built with a mask so the "hole" stays transparent over whatever sits behind it.
 */
export default function Horn({
  corner,
  fill,
  discFill,
  scale = 1,
  transition = "transform 900ms cubic-bezier(0.16,1,0.3,1)",
  className = "",
  style,
}: HornProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const maskId = `horn-${uid}`;
  const { x, y } = CENTER[corner];
  const groupStyle: CSSProperties = {
    transform: `scale(${scale})`,
    transformOrigin: `${x}px ${y}px`,
    transition,
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={`block overflow-hidden ${className}`}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="white" />
          <g style={groupStyle}>
            <circle cx={x} cy={y} r={100} fill="black" />
          </g>
        </mask>
      </defs>
      {fill && <rect width="100" height="100" fill={fill} mask={`url(#${maskId})`} />}
      {discFill && (
        <g style={groupStyle}>
          <circle cx={x} cy={y} r={100} fill={discFill} />
        </g>
      )}
    </svg>
  );
}
