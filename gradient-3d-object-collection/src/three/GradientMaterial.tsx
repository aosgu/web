import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { toneColor, useTheme } from "./theme";

type Props = {
  /** tone at `min` — 0 = deep accent, 0.5 = pale, 1 = white */
  low?: number;
  /** tone at `max` */
  high?: number;
  axis?: "x" | "y" | "z";
  min?: number;
  max?: number;
  roughness?: number;
  metalness?: number;
  envMapIntensity?: number;
  side?: THREE.Side;
  flatShading?: boolean;
};

/**
 * A MeshStandardMaterial that paints a smooth gradient along a local axis.
 * Colours come from the active palette and update live without recompiling.
 */
export function GradientMaterial({
  low = 0,
  high = 1,
  axis = "y",
  min = -1,
  max = 1,
  roughness = 0.4,
  metalness = 0.15,
  envMapIntensity = 1.0,
  side,
  flatShading = false,
}: Props) {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  const theme = useTheme();

  const uniforms = useMemo(
    () => ({
      uLow: { value: new THREE.Color() },
      uHigh: { value: new THREE.Color() },
      uMin: { value: min },
      uMax: { value: max },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // live colour updates
  useEffect(() => {
    toneColor(theme, low, uniforms.uLow.value);
    toneColor(theme, high, uniforms.uHigh.value);
    uniforms.uMin.value = min;
    uniforms.uMax.value = max;
  }, [theme, low, high, min, max, uniforms]);

  useLayoutEffect(() => {
    const mat = ref.current;
    if (!mat) return;
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uLow = uniforms.uLow;
      shader.uniforms.uHigh = uniforms.uHigh;
      shader.uniforms.uMin = uniforms.uMin;
      shader.uniforms.uMax = uniforms.uMax;
      shader.vertexShader =
        "varying vec3 vLocalPos;\n" +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          "#include <begin_vertex>\n  vLocalPos = position;"
        );
      shader.fragmentShader =
        "varying vec3 vLocalPos;\nuniform vec3 uLow;\nuniform vec3 uHigh;\nuniform float uMin;\nuniform float uMax;\n" +
        shader.fragmentShader.replace(
          "#include <color_fragment>",
          `#include <color_fragment>\n  float gFac = clamp((vLocalPos.${axis} - uMin) / (uMax - uMin), 0.0, 1.0);\n  gFac = smoothstep(0.0, 1.0, gFac);\n  diffuseColor.rgb = mix(uLow, uHigh, gFac);`
        );
    };
    mat.customProgramCacheKey = () => `gradient-${axis}`;
    mat.needsUpdate = true;
  }, [axis, uniforms]);

  return (
    <meshStandardMaterial
      ref={ref}
      roughness={roughness}
      metalness={metalness}
      envMapIntensity={envMapIntensity}
      side={side}
      flatShading={flatShading}
    />
  );
}

/** Dark matte material for recessed holes, tinted to the palette background. */
export function HoleMaterial() {
  const theme = useTheme();
  return <meshStandardMaterial color={theme.hole} roughness={0.9} />;
}
