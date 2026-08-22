/**
 * Generates the SVG path of a "folder front flap":
 * a rounded rectangle whose top edge has a raised tab on the left
 * that steps down (with a concave rounded corner) to the right side.
 */
export function folderFlapPath(
  w: number,
  h: number,
  tabW: number,
  step: number,
  r = 22,
  sr = 16,
): string {
  return [
    `M ${r} 0`,
    `L ${tabW - sr} 0`,
    `A ${sr} ${sr} 0 0 1 ${tabW} ${sr}`,
    `L ${tabW} ${step - sr}`,
    `A ${sr} ${sr} 0 0 0 ${tabW + sr} ${step}`,
    `L ${w - r} ${step}`,
    `A ${r} ${r} 0 0 1 ${w} ${step + r}`,
    `L ${w} ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `L ${r} ${h}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    'Z',
  ].join(' ');
}

/** Rounded rectangle path (used for the back sheet outline). */
export function roundedRectPath(w: number, h: number, r = 22): string {
  return [
    `M ${r} 0`,
    `L ${w - r} 0`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `L ${w} ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `L ${r} ${h}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    'Z',
  ].join(' ');
}
