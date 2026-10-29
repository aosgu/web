import { useMemo } from "react";
import * as THREE from "three";
import { GradientMaterial, HoleMaterial } from "./GradientMaterial";

/* ------------------------------------------------------------------ *
 *  Geometry helpers
 * ------------------------------------------------------------------ */

function roundedRectTubeGeometry(w: number, h: number, r: number, tube: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  const pts = s.getPoints(80).map((p) => new THREE.Vector3(p.x, p.y, 0));
  pts.pop();
  const curve = new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.1);
  return new THREE.TubeGeometry(curve, 220, tube, 28, true);
}

class HelixCurve extends THREE.Curve<THREE.Vector3> {
  turns: number;
  height: number;
  radius: number;
  constructor(turns: number, height: number, radius: number) {
    super();
    this.turns = turns;
    this.height = height;
    this.radius = radius;
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const a = t * this.turns * Math.PI * 2;
    return target.set(
      Math.cos(a) * this.radius,
      (t - 0.5) * this.height,
      Math.sin(a) * this.radius
    );
  }
}

class WaveCurve extends THREE.Curve<THREE.Vector3> {
  length: number;
  amp: number;
  freq: number;
  constructor(length: number, amp: number, freq: number) {
    super();
    this.length = length;
    this.amp = amp;
    this.freq = freq;
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const x = (t - 0.5) * this.length;
    const y = Math.sin(t * Math.PI * this.freq) * this.amp;
    return target.set(x, y, 0);
  }
}

function displacedSphere(
  radius: number,
  detail: number,
  fn: (n: THREE.Vector3, v: THREE.Vector3) => number
) {
  const g = new THREE.IcosahedronGeometry(radius, detail);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = v.clone().normalize();
    v.addScaledVector(n, fn(n, v));
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/* ------------------------------------------------------------------ *
 *  Shapes (each ~fits a unit sphere of radius ~1.2)
 * ------------------------------------------------------------------ */

// 1. Chain link (rounded-rectangle tube)
export function ChainLink() {
  const geo = useMemo(() => roundedRectTubeGeometry(2.1, 1.2, 0.55, 0.3), []);
  return (
    <mesh geometry={geo} rotation={[0.3, -0.4, 0.2]}>
      <GradientMaterial low={0.05} high={0.87} axis="x" min={-1.2} max={1.2} />
    </mesh>
  );
}

// 2. Smooth pebble / flat disc
export function Pebble() {
  return (
    <mesh scale={[1.15, 0.5, 1.15]}>
      <sphereGeometry args={[1, 96, 96]} />
      <GradientMaterial low={0} high={0.4} axis="z" min={-1} max={1} />
    </mesh>
  );
}

// 3. Elbow / bent pipe
export function Elbow() {
  return (
    <group rotation={[0.2, 0.3, 2.2]}>
      <mesh>
        <torusGeometry args={[0.75, 0.3, 32, 80, Math.PI * 0.95]} />
        <GradientMaterial low={0.3} high={0.92} axis="y" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 4. Torus ring
export function Ring() {
  return (
    <mesh rotation={[1.2, 0.2, 0]}>
      <torusGeometry args={[0.8, 0.33, 48, 120]} />
      <GradientMaterial low={0.6} high={0.97} axis="y" min={-1.1} max={1.1} />
    </mesh>
  );
}

// 5. S-wave ribbon (thick extruded wavy tile)
export function WaveRibbon() {
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 1.9;
    const amp = 0.42;
    const th = 0.5;
    const seg = 40;
    const top: THREE.Vector2[] = [];
    const bottom: THREE.Vector2[] = [];
    for (let i = 0; i <= seg; i++) {
      const t = i / seg;
      const x = (t - 0.5) * w;
      const y = Math.sin(t * Math.PI * 2) * amp;
      top.push(new THREE.Vector2(x, y + th / 2));
      bottom.push(new THREE.Vector2(x, y - th / 2));
    }
    shape.moveTo(top[0].x, top[0].y);
    top.forEach((p) => shape.lineTo(p.x, p.y));
    bottom.reverse().forEach((p) => shape.lineTo(p.x, p.y));
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.55,
      bevelEnabled: true,
      bevelThickness: 0.18,
      bevelSize: 0.18,
      bevelSegments: 8,
      curveSegments: 24,
    });
    g.center();
    return g;
  }, []);
  return (
    <mesh geometry={geo} rotation={[0.1, -0.4, 1.55]}>
      <GradientMaterial low={0} high={0.5} axis="x" min={-1} max={1} />
    </mesh>
  );
}

// 6. Asterisk — radial rounded tubes
export function Asterisk() {
  const arms = 8;
  return (
    <group rotation={[0.4, 0.2, 0]}>
      {Array.from({ length: arms }).map((_, i) => {
        const a = (i / arms) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0]}
            rotation={[0, 0, a + Math.PI / 2]}
          >
            <capsuleGeometry args={[0.16, 0.7, 12, 24]} />
            <GradientMaterial low={0} high={0.4} axis="y" min={-0.6} max={0.6} />
          </mesh>
        );
      })}
      <mesh>
        <sphereGeometry args={[0.28, 48, 48]} />
        <GradientMaterial low={0.05} high={0.6} />
      </mesh>
    </group>
  );
}

// 7. Fluted cylinder with hole
export function FlutedCylinder() {
  const flutes = 18;
  return (
    <group rotation={[0.35, 0.5, 0.1]}>
      <mesh>
        <cylinderGeometry args={[0.85, 0.85, 1.5, 64]} />
        <GradientMaterial low={0.35} high={0.93} axis="y" min={-0.9} max={0.9} />
      </mesh>
      {Array.from({ length: flutes }).map((_, i) => {
        const a = (i / flutes) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.85, 0, Math.sin(a) * 0.85]}>
            <capsuleGeometry args={[0.1, 1.5, 8, 16]} />
            <GradientMaterial low={0.35} high={0.97} axis="y" min={-0.9} max={0.9} />
          </mesh>
        );
      })}
      {/* rim + hole */}
      <mesh position={[0, 0.76, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.14, 24, 48]} />
        <GradientMaterial low={0.33} high={0.86} axis="z" min={-0.5} max={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 1.1, 48]} />
        <HoleMaterial />
      </mesh>
    </group>
  );
}

// 8. Puffy flower (ring of soft bumps)
export function PuffyFlower() {
  const bumps = 8;
  return (
    <group rotation={[0.3, 0.2, 0]}>
      {Array.from({ length: bumps }).map((_, i) => {
        const a = (i / bumps) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.68, Math.sin(a) * 0.68, 0]}
            scale={[1, 1, 0.75]}
          >
            <sphereGeometry args={[0.46, 48, 48]} />
            <GradientMaterial low={0.5} high={0.94} axis="y" min={-0.9} max={0.9} />
          </mesh>
        );
      })}
      <mesh scale={[1, 1, 0.8]}>
        <sphereGeometry args={[0.6, 48, 48]} />
        <GradientMaterial low={0.6} high={0.97} axis="y" min={-0.7} max={0.7} />
      </mesh>
    </group>
  );
}

// 9. Ribbed ball (horizontal grooves)
export function RibbedBall() {
  const geo = useMemo(
    () =>
      displacedSphere(0.95, 48, (n) => 0.11 * Math.sin(Math.asin(THREE.MathUtils.clamp(n.y, -1, 1)) * 9)),
    []
  );
  return (
    <mesh geometry={geo} rotation={[0.2, 0.3, 0.1]}>
      <GradientMaterial low={0.1} high={0.82} axis="y" min={-1} max={1} />
    </mesh>
  );
}

// 10. Caged sphere (core + orbiting rings)
export function CagedSphere() {
  const rings = [0, 1, 2, 3];
  return (
    <group rotation={[0.3, 0.4, 0.2]}>
      <mesh>
        <sphereGeometry args={[0.72, 64, 64]} />
        <GradientMaterial low={0.86} high={1} axis="y" min={-0.7} max={0.7} />
      </mesh>
      {rings.map((i) => (
        <mesh key={i} rotation={[0, (i / rings.length) * Math.PI, 0]}>
          <torusGeometry args={[0.93, 0.1, 20, 96]} />
          <GradientMaterial low={0} high={0.4} axis="y" min={-0.9} max={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// 11. Four-petal clover
export function CloverFour() {
  const petals = 4;
  return (
    <group rotation={[0.35, 0.2, 0]}>
      {Array.from({ length: petals }).map((_, i) => {
        const a = (i / petals) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0]}
            rotation={[0, 0, a]}
            scale={[0.55, 0.85, 0.42]}
          >
            <sphereGeometry args={[1, 48, 48]} />
            <GradientMaterial low={0} high={0.4} axis="x" min={-0.6} max={0.6} />
          </mesh>
        );
      })}
      <mesh>
        <sphereGeometry args={[0.28, 32, 32]} />
        <GradientMaterial low={0.05} high={0.6} />
      </mesh>
    </group>
  );
}

// 12. Star flower (6 rounded petals)
export function StarFlower() {
  const petals = 6;
  return (
    <group rotation={[0.3, 0.1, 0]}>
      {Array.from({ length: petals }).map((_, i) => {
        const a = (i / petals) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.6, Math.sin(a) * 0.6, 0]}
            rotation={[0, 0, a]}
            scale={[0.5, 0.8, 0.5]}
          >
            <sphereGeometry args={[1, 48, 48]} />
            <GradientMaterial low={0.3} high={0.94} axis="x" min={-0.6} max={0.6} />
          </mesh>
        );
      })}
      <mesh>
        <sphereGeometry args={[0.42, 48, 48]} />
        <GradientMaterial low={0.35} high={0.97} />
      </mesh>
    </group>
  );
}

// 13. Wavy / bumpy sphere
export function WavySphere() {
  const geo = useMemo(
    () =>
      displacedSphere(
        0.92,
        48,
        (n) => 0.1 * Math.sin(n.x * 6) * Math.sin(n.y * 6) * Math.sin(n.z * 6)
      ),
    []
  );
  return (
    <mesh geometry={geo} rotation={[0.3, 0.2, 0.1]}>
      <GradientMaterial low={0.58} high={0.97} axis="y" min={-1} max={1} />
    </mesh>
  );
}

// 14. Spring coil
export function SpringCoil() {
  const geo = useMemo(() => {
    const curve = new HelixCurve(5, 1.7, 0.6);
    return new THREE.TubeGeometry(curve, 300, 0.17, 20, false);
  }, []);
  return (
    <mesh geometry={geo} rotation={[0.2, 0.3, 0.25]}>
      <GradientMaterial low={0.35} high={0.92} axis="y" min={-0.95} max={0.95} />
    </mesh>
  );
}

// 15. Threaded screw
export function ThreadedScrew() {
  const thread = useMemo(() => {
    const curve = new HelixCurve(7, 1.6, 0.6);
    return new THREE.TubeGeometry(curve, 400, 0.12, 16, false);
  }, []);
  return (
    <group rotation={[0.25, 0.3, 0.15]}>
      <mesh>
        <cylinderGeometry args={[0.52, 0.52, 1.7, 48]} />
        <GradientMaterial low={0} high={0.42} axis="y" min={-0.9} max={0.9} />
      </mesh>
      <mesh geometry={thread}>
        <GradientMaterial low={0} high={0.62} axis="y" min={-0.9} max={0.9} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.52, 48, 48]} />
        <GradientMaterial low={0.3} high={0.87} axis="y" min={-0.4} max={0.4} />
      </mesh>
    </group>
  );
}

// 16. Honeycomb tube bundle
export function TubeBundle() {
  const positions = useMemo(() => {
    const pts: [number, number][] = [[0, 0]];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      pts.push([Math.cos(a) * 0.46, Math.sin(a) * 0.46]);
    }
    return pts;
  }, []);
  return (
    <group rotation={[0.3, 0.5, 0.2]}>
      {positions.map(([x, y], i) => (
        <group key={i} position={[x, y, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 1.3, 32]} />
            <GradientMaterial low={0} high={0.5} axis="y" min={-0.65} max={0.65} />
          </mesh>
          <mesh position={[0, 0, 0.66]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.5, 24]} />
            <HoleMaterial />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 17. Spiral soft-serve (stacked rings)
export function SpiralCone() {
  const layers = 9;
  return (
    <group rotation={[0.15, 0.3, 0]} position={[0, -0.1, 0]}>
      {Array.from({ length: layers }).map((_, i) => {
        const t = i / (layers - 1);
        const r = 0.85 * (1 - t) + 0.12;
        const y = t * 1.6 - 0.8;
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, t * Math.PI * 1.6]}>
            <torusGeometry args={[r, 0.16, 18, 64]} />
            <GradientMaterial low={0} high={0.84} axis="z" min={-r} max={r} />
          </mesh>
        );
      })}
    </group>
  );
}

// 18. Noodle wave (bent tube)
export function Noodle() {
  const geo = useMemo(() => {
    const curve = new WaveCurve(2.6, 0.55, 2.3);
    return new THREE.TubeGeometry(curve, 220, 0.26, 24, false);
  }, []);
  return (
    <group rotation={[0.2, -0.3, 0.1]}>
      <mesh geometry={geo}>
        <GradientMaterial low={0.7} high={0.98} axis="x" min={-1.3} max={1.3} />
      </mesh>
      <mesh position={[-1.3, Math.sin(0) * 0.55, 0]}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <GradientMaterial low={0.7} high={0.98} />
      </mesh>
      <mesh position={[1.3, Math.sin(Math.PI * 2.3) * 0.55, 0]}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <GradientMaterial low={0.7} high={0.98} />
      </mesh>
    </group>
  );
}

// 19. Extruded 5-point star
export function StarShape() {
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    const spikes = 5;
    const outer = 1.0;
    const inner = 0.45;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.22,
      bevelSize: 0.22,
      bevelSegments: 10,
      curveSegments: 24,
    });
    g.center();
    return g;
  }, []);
  return (
    <mesh geometry={geo} rotation={[0.2, 0.3, 0.1]}>
      <GradientMaterial low={0.6} high={1} axis="y" min={-1} max={1} />
    </mesh>
  );
}

// 20. Capsule / pill
export function Capsule() {
  return (
    <mesh rotation={[0.3, 0, 0.6]}>
      <capsuleGeometry args={[0.5, 1.1, 24, 48]} />
      <GradientMaterial low={0} high={0.87} axis="y" min={-1.05} max={1.05} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ *
 *  Registry
 * ------------------------------------------------------------------ */
export type ShapeDef = {
  Comp: () => React.JSX.Element;
  name: string;
  scale: number;
  spin: [number, number, number];
};

export const SHAPES: ShapeDef[] = [
  { Comp: Asterisk, name: "Asterisk", scale: 1, spin: [0, 0.3, 0] },
  { Comp: FlutedCylinder, name: "Fluted", scale: 0.95, spin: [0, 0.35, 0] },
  { Comp: StarShape, name: "Star", scale: 0.95, spin: [0.1, 0.4, 0] },
  { Comp: WavySphere, name: "Wavy Sphere", scale: 1.05, spin: [0, 0.3, 0.1] },
  { Comp: Ring, name: "Ring", scale: 1.05, spin: [0, 0.4, 0] },
  { Comp: PuffyFlower, name: "Puffy Flower", scale: 1, spin: [0, 0.25, 0.15] },
  { Comp: RibbedBall, name: "Ribbed Ball", scale: 1.05, spin: [0, 0.4, 0] },
  { Comp: CagedSphere, name: "Caged Sphere", scale: 1, spin: [0, 0.45, 0] },
  { Comp: CloverFour, name: "Clover", scale: 1.05, spin: [0, 0.3, 0.2] },
  { Comp: StarFlower, name: "Star Flower", scale: 1.05, spin: [0, 0.3, 0.15] },
  { Comp: ChainLink, name: "Chain Link", scale: 0.95, spin: [0.15, 0.35, 0] },
  { Comp: Pebble, name: "Pebble", scale: 1.05, spin: [0, 0.5, 0] },
  { Comp: Elbow, name: "Elbow", scale: 1.1, spin: [0, 0.4, 0.1] },
  { Comp: WaveRibbon, name: "Wave Ribbon", scale: 1, spin: [0.1, 0.4, 0] },
  { Comp: Capsule, name: "Capsule", scale: 1, spin: [0, 0.45, 0.1] },
  { Comp: Noodle, name: "Noodle", scale: 0.95, spin: [0.1, 0.35, 0] },
  { Comp: SpringCoil, name: "Spring", scale: 1.05, spin: [0, 0.4, 0] },
  { Comp: ThreadedScrew, name: "Screw", scale: 1.05, spin: [0, 0.45, 0] },
  { Comp: TubeBundle, name: "Tube Bundle", scale: 1.05, spin: [0, 0.4, 0.1] },
  { Comp: SpiralCone, name: "Spiral", scale: 1.05, spin: [0, 0.4, 0] },
];
