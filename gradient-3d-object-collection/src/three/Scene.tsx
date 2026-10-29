import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { SHAPES, type ShapeDef } from "./shapes";
import { ThemeContext, type Palette } from "./theme";

function SpinningShape({ def, seed }: { def: ShapeDef; seed: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += def.spin[0] * delta;
    ref.current.rotation.y += def.spin[1] * delta;
    ref.current.rotation.z += def.spin[2] * delta;
  });
  const { Comp } = def;
  return (
    <Float
      speed={1.1 + (seed % 5) * 0.12}
      rotationIntensity={0}
      floatIntensity={0.55}
      floatingRange={[-0.14, 0.14]}
    >
      <group ref={ref} scale={def.scale} rotation={[seed * 0.5, seed * 0.9, seed * 0.2]}>
        <Comp />
      </group>
    </Float>
  );
}

function Grid() {
  const cols = 5;
  const gapX = 3.15;
  const gapY = 3.15;
  const offsetX = ((cols - 1) * gapX) / 2;
  const rows = Math.ceil(SHAPES.length / cols);
  const offsetY = ((rows - 1) * gapY) / 2;

  return (
    <group>
      {SHAPES.map((def, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = col * gapX - offsetX;
        const y = -(row * gapY - offsetY);
        return (
          <group key={def.name} position={[x, y, 0]}>
            <SpinningShape def={def} seed={i + 1} />
          </group>
        );
      })}
    </group>
  );
}

export function Scene({ palette }: { palette: Palette }) {
  return (
    <Canvas
      shadows={false}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ position: [0, 0, 19], fov: 42 }}
    >
      <ThemeContext.Provider value={palette}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 6]} intensity={2.1} color="#ffffff" />
        <directionalLight position={[-6, -4, 4]} intensity={0.8} color={palette.envA} />
        <pointLight position={[0, 0, 10]} intensity={0.6} color={palette.envB} />

        <group position={[0, 0.45, 0]}>
          <Grid />
        </group>

        <Environment resolution={256} environmentIntensity={0.85}>
          <Lightformer intensity={2.4} position={[0, 4, 3]} scale={[10, 8, 1]} color="#ffffff" />
          <Lightformer intensity={1.3} position={[-5, 1, 3]} scale={[6, 8, 1]} color={palette.envA} />
          <Lightformer intensity={1.0} position={[5, -2, 2]} scale={[6, 6, 1]} color={palette.envB} />
          <Lightformer intensity={0.8} position={[0, -4, -4]} scale={[10, 6, 1]} color={palette.pale} />
        </Environment>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2 - 0.5}
          maxPolarAngle={Math.PI / 2 + 0.5}
          minAzimuthAngle={-0.5}
          maxAzimuthAngle={0.5}
          rotateSpeed={0.4}
        />
      </ThemeContext.Provider>
    </Canvas>
  );
}
