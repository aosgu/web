import { createContext, useContext } from "react";
import * as THREE from "three";

export type Palette = {
  id: string;
  name: string;
  /** page background */
  bg: string;
  /** saturated accent used at tone 0 */
  deep: string;
  /** pale tint used at tone 0.5 */
  pale: string;
  /** near-white used at tone 1 */
  white: string;
  /** colour inside recessed holes */
  hole: string;
  /** background glow blobs */
  glowA: string;
  glowB: string;
  glowC: string;
  /** tints for environment light panels */
  envA: string;
  envB: string;
};

export const PALETTES: Palette[] = [
  {
    id: "indigo",
    name: "Indigo",
    bg: "#1e1230",
    deep: "#3f61f2",
    pale: "#b6c4ff",
    white: "#f8f8ff",
    hole: "#241c38",
    glowA: "#4f6ef5",
    glowB: "#a94fd6",
    glowC: "#5b3fa0",
    envA: "#aeb9ff",
    envB: "#e2cdff",
  },
  {
    id: "coral",
    name: "Coral",
    bg: "#2b1114",
    deep: "#f2543d",
    pale: "#ffbfae",
    white: "#fff6f1",
    hole: "#2b1114",
    glowA: "#ff6a3d",
    glowB: "#d63b6e",
    glowC: "#8a2f3c",
    envA: "#ffd2c2",
    envB: "#ffe7dc",
  },
  {
    id: "mint",
    name: "Mint",
    bg: "#0c201d",
    deep: "#16b48b",
    pale: "#a9ecd5",
    white: "#f1fff9",
    hole: "#0c201d",
    glowA: "#20c997",
    glowB: "#1f7aa8",
    glowC: "#135b4c",
    envA: "#c3f3e2",
    envB: "#e0fff4",
  },
  {
    id: "amber",
    name: "Amber",
    bg: "#23160a",
    deep: "#f59e0b",
    pale: "#fde3a7",
    white: "#fffaf0",
    hole: "#23160a",
    glowA: "#f59e0b",
    glowB: "#e0533a",
    glowC: "#7a4a12",
    envA: "#ffe7b8",
    envB: "#fff3dc",
  },
  {
    id: "orchid",
    name: "Orchid",
    bg: "#230f2a",
    deep: "#d946ef",
    pale: "#f1b8f7",
    white: "#fdf2ff",
    hole: "#230f2a",
    glowA: "#d946ef",
    glowB: "#7c3aed",
    glowC: "#5b1a63",
    envA: "#f3cdf9",
    envB: "#fbe7ff",
  },
];

export const ThemeContext = createContext<Palette>(PALETTES[0]);
export const useTheme = () => useContext(ThemeContext);

const _a = new THREE.Color();
const _b = new THREE.Color();

/** Map a tone (0 → deep, 0.5 → pale, 1 → white) to a colour in the given palette. */
export function toneColor(p: Palette, t: number, target = new THREE.Color()): THREE.Color {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  if (x <= 0.5) {
    _a.set(p.deep);
    _b.set(p.pale);
    return target.copy(_a).lerp(_b, x / 0.5);
  }
  _a.set(p.pale);
  _b.set(p.white);
  return target.copy(_a).lerp(_b, (x - 0.5) / 0.5);
}
