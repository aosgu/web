// Colours extracted from the reference image.
// Primary: green, blue, grey (grid paper). Derived tints: sky (light arc), navy (shadowed horn).
export const COLORS = {
  green: "#17974a",
  blue: "#1f62e0",
  grey: "#ebeae1",
  ink: "#141412",
  navy: "#1e4a74",
  sky: "#5cb5ee",
} as const;

export function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}
