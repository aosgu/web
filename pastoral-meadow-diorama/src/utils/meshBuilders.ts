import * as THREE from 'three';
import { WoolColor } from '../types';

export const WOOL_COLORS: Record<WoolColor, string> = {
  white: '#fcfbf7',
  cream: '#f5ecd8',
  pink: '#fbcfe8',
  lavender: '#e9d5ff',
  mint: '#a7f3d0',
  golden: '#fef08a',
  black: '#27272a',
};

/** Small sheep read better against the wide painted dioramas. */
export const SHEEP_SCALE_FACTOR = 0.76;

// Cache geometries & shared materials to optimize performance
const sphereGeoSmall = new THREE.SphereGeometry(0.35, 12, 10);
const sphereGeoMedium = new THREE.SphereGeometry(0.55, 12, 10);
const sphereGeoLarge = new THREE.SphereGeometry(0.75, 14, 12);
const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.45, 8);
const earGeo = new THREE.ConeGeometry(0.12, 0.35, 8);

export interface SheepMeshParts {
  group: THREE.Group;
  woolGroup: THREE.Group;
  woolMeshes: THREE.Mesh[];
  headGroup: THREE.Group;
  leftEar: THREE.Mesh;
  rightEar: THREE.Mesh;
  legFL: THREE.Group;
  legFR: THREE.Group;
  legBL: THREE.Group;
  legBR: THREE.Group;
  tail: THREE.Mesh;
  shadowMesh: THREE.Mesh;
  actionSignGroup?: THREE.Group;
}

export function createSheepMesh(color: WoolColor = 'white', scale: number = 1.0): SheepMeshParts {
  const group = new THREE.Group();
  group.name = 'sheep_root';

  const woolHex = WOOL_COLORS[color] || WOOL_COLORS.white;
  const woolMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(woolHex),
    roughness: 0.85,
    metalness: 0.05,
    flatShading: false,
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1c1917'),
    roughness: 0.7,
    metalness: 0.1,
  });

  const eyeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.2,
  });

  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

  // 1. Wool Body (Cluster of puffy cloud spheres)
  const woolGroup = new THREE.Group();
  woolGroup.position.set(0, 0.7, 0);
  const woolMeshes: THREE.Mesh[] = [];

  // Main center body
  const centerBody = new THREE.Mesh(sphereGeoLarge, woolMat);
  centerBody.scale.set(1.1, 0.95, 1.35);
  centerBody.castShadow = true;
  centerBody.receiveShadow = true;
  woolGroup.add(centerBody);
  woolMeshes.push(centerBody);

  // Side and top wool puffs for cloudy puffy texture
  const puffPositions = [
    { pos: [0.45, 0.15, 0.2], s: [0.8, 0.8, 0.8] },
    { pos: [-0.45, 0.15, 0.2], s: [0.8, 0.8, 0.8] },
    { pos: [0.4, 0.1, -0.35], s: [0.75, 0.75, 0.75] },
    { pos: [-0.4, 0.1, -0.35], s: [0.75, 0.75, 0.75] },
    { pos: [0, 0.45, 0], s: [0.85, 0.75, 0.9] },
    { pos: [0, 0.2, 0.65], s: [0.75, 0.75, 0.75] }, // Front shoulder
    { pos: [0, 0.25, -0.65], s: [0.8, 0.8, 0.8] }, // Rear rump
  ];

  puffPositions.forEach(({ pos, s }) => {
    const puff = new THREE.Mesh(sphereGeoMedium, woolMat);
    puff.position.set(pos[0], pos[1], pos[2]);
    puff.scale.set(s[0], s[1], s[2]);
    puff.castShadow = true;
    woolGroup.add(puff);
    woolMeshes.push(puff);
  });

  group.add(woolGroup);

  // 2. Head Group (Positioned at front +Z)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.8, 0.85);

  // Head face sphere/capsule
  const faceMesh = new THREE.Mesh(sphereGeoSmall, skinMat);
  faceMesh.scale.set(0.9, 0.85, 1.15);
  faceMesh.position.set(0, 0, 0.15);
  faceMesh.rotation.x = 0.2;
  faceMesh.castShadow = true;
  headGroup.add(faceMesh);

  // Little wool cap on top of head
  const headWool = new THREE.Mesh(sphereGeoSmall, woolMat);
  headWool.scale.set(0.65, 0.45, 0.65);
  headWool.position.set(0, 0.25, 0.05);
  headGroup.add(headWool);
  woolMeshes.push(headWool);

  // Ears
  const leftEar = new THREE.Mesh(earGeo, skinMat);
  leftEar.position.set(-0.32, 0.05, 0.05);
  leftEar.rotation.z = Math.PI * 0.45;
  leftEar.rotation.x = 0.15;
  headGroup.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, skinMat);
  rightEar.position.set(0.32, 0.05, 0.05);
  rightEar.rotation.z = -Math.PI * 0.45;
  rightEar.rotation.x = 0.15;
  headGroup.add(rightEar);

  // Eyes
  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), eyeMat);
  leftEye.position.set(-0.16, 0.1, 0.38);
  const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), pupilMat);
  leftPupil.position.set(0, 0, 0.04);
  leftEye.add(leftPupil);
  headGroup.add(leftEye);

  const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), eyeMat);
  rightEye.position.set(0.16, 0.1, 0.38);
  const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), pupilMat);
  rightPupil.position.set(0, 0, 0.04);
  rightEye.add(rightPupil);
  headGroup.add(rightEye);

  group.add(headGroup);

  // 3. Legs with pivot points
  function createLeg(x: number, z: number): THREE.Group {
    const pivot = new THREE.Group();
    pivot.position.set(x, 0.45, z);
    const legMesh = new THREE.Mesh(legGeo, skinMat);
    legMesh.position.set(0, -0.22, 0);
    legMesh.castShadow = true;
    pivot.add(legMesh);

    // Little hoof
    const hoof = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), skinMat);
    hoof.position.set(0, -0.42, 0);
    hoof.scale.set(1, 0.6, 1.1);
    pivot.add(hoof);

    return pivot;
  }

  const legFL = createLeg(-0.32, 0.42);
  const legFR = createLeg(0.32, 0.42);
  const legBL = createLeg(-0.32, -0.42);
  const legBR = createLeg(0.32, -0.42);

  group.add(legFL);
  group.add(legFR);
  group.add(legBL);
  group.add(legBR);

  // 4. Little Tail
  const tail = new THREE.Mesh(sphereGeoSmall, woolMat);
  tail.scale.set(0.35, 0.35, 0.45);
  tail.position.set(0, 0.7, -0.9);
  group.add(tail);
  woolMeshes.push(tail);

  // 5. Soft Ground Shadow Plane
  const shadowGeo = new THREE.PlaneGeometry(1.8, 2.2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x1f3d10,
    transparent: true,
    opacity: 0.38,
    depthWrite: false,
  });

  // Soft circular shadow alpha gradient texture
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sCtx = shadowCanvas.getContext('2d');
  if (sCtx) {
    const radG = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
    radG.addColorStop(0, 'rgba(0,0,0,0.8)');
    radG.addColorStop(0.6, 'rgba(0,0,0,0.4)');
    radG.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = radG;
    sCtx.fillRect(0, 0, 128, 128);
    shadowMat.map = new THREE.CanvasTexture(shadowCanvas);
  }

  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, 0.02, 0);
  group.add(shadowMesh);

  // Apply scale
  const finalScale = scale * SHEEP_SCALE_FACTOR;
  group.scale.set(finalScale, finalScale, finalScale);

  return {
    group,
    woolGroup,
    woolMeshes,
    headGroup,
    leftEar,
    rightEar,
    legFL,
    legFR,
    legBL,
    legBR,
    tail,
    shadowMesh,
  };
}

// Tree Builder (Volumetric spherical cluster trees)
export function createTreeMesh(
  type: 'green' | 'light_green' | 'pink' = 'green',
  scale: number = 1.0
): THREE.Group {
  const treeGroup = new THREE.Group();

  // Trunk
  const trunkMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#5c3a21'),
    roughness: 0.85,
  });
  const trunkGeo = new THREE.CylinderGeometry(0.2, 0.28, 1.4, 8);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 0.7;
  trunk.castShadow = true;
  treeGroup.add(trunk);

  // Foliage Cluster
  let foliageHex = '#5ca82b';
  if (type === 'light_green') foliageHex = '#84c83c';
  if (type === 'pink') foliageHex = '#e87ca5';

  const foliageMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(foliageHex),
    roughness: 0.75,
    metalness: 0.05,
    flatShading: false,
  });

  const puffCluster = [
    { pos: [0, 1.8, 0], s: 1.1 },
    { pos: [0.45, 1.5, 0.2], s: 0.85 },
    { pos: [-0.45, 1.5, -0.2], s: 0.85 },
    { pos: [0.2, 1.6, -0.4], s: 0.8 },
    { pos: [-0.2, 1.6, 0.4], s: 0.8 },
    { pos: [0, 2.2, 0], s: 0.75 },
  ];

  puffCluster.forEach(({ pos, s }) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(s, 12, 10), foliageMat);
    puff.position.set(pos[0], pos[1], pos[2]);
    puff.castShadow = true;
    treeGroup.add(puff);
  });

  // Tree shadow
  const treeShadowGeo = new THREE.PlaneGeometry(2.8, 2.8);
  const treeShadowMat = new THREE.MeshBasicMaterial({
    color: 0x1f3d10,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });

  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sCtx = shadowCanvas.getContext('2d');
  if (sCtx) {
    const radG = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
    radG.addColorStop(0, 'rgba(0,0,0,0.8)');
    radG.addColorStop(0.7, 'rgba(0,0,0,0.3)');
    radG.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = radG;
    sCtx.fillRect(0, 0, 128, 128);
    treeShadowMat.map = new THREE.CanvasTexture(shadowCanvas);
  }

  const treeShadow = new THREE.Mesh(treeShadowGeo, treeShadowMat);
  treeShadow.rotation.x = -Math.PI / 2;
  treeShadow.position.set(0.2, 0.02, 0.3);
  treeGroup.add(treeShadow);

  treeGroup.scale.set(scale, scale, scale);
  return treeGroup;
}

// Volumetric Puffy Cloud
export function createCloudMesh(scale: number = 1.0): { group: THREE.Group; shadow: THREE.Mesh } {
  const group = new THREE.Group();

  const cloudMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    roughness: 0.9,
    metalness: 0.0,
  });

  const puffs = [
    { pos: [0, 0, 0], s: [1.2, 0.8, 1.0] },
    { pos: [0.8, -0.1, 0.1], s: [0.9, 0.65, 0.8] },
    { pos: [-0.8, -0.1, -0.1], s: [0.9, 0.65, 0.8] },
    { pos: [0.3, 0.3, 0], s: [0.8, 0.6, 0.75] },
    { pos: [-0.3, 0.25, 0.1], s: [0.75, 0.55, 0.7] },
  ];

  puffs.forEach(({ pos, s }) => {
    const p = new THREE.Mesh(sphereGeoLarge, cloudMat);
    p.position.set(pos[0], pos[1], pos[2]);
    p.scale.set(s[0], s[1], s[2]);
    group.add(p);
  });

  // Cloud shadow on ground
  const shadowGeo = new THREE.PlaneGeometry(4.5, 3.2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x1f3d10,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  });

  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const sCtx = shadowCanvas.getContext('2d');
  if (sCtx) {
    const radG = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
    radG.addColorStop(0, 'rgba(0,0,0,0.6)');
    radG.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = radG;
    sCtx.fillRect(0, 0, 128, 128);
    shadowMat.map = new THREE.CanvasTexture(shadowCanvas);
  }

  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.03, 0);

  group.scale.set(scale, scale, scale);
  return { group, shadow };
}

/** Shared soft radial ground shadow. */
export function createSoftShadow(width: number, height: number, opacity = 0.32): THREE.Mesh {
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
    grad.addColorStop(0, `rgba(0,0,0,${opacity})`);
    grad.addColorStop(0.62, `rgba(0,0,0,${opacity * 0.55})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const map = new THREE.CanvasTexture(shadowCanvas);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.025;
  return mesh;
}

/** Curving tropical palm with broad, drooping fronds. */
export function createPalmMesh(scale = 1, lean = 0.35): THREE.Group {
  const palm = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#a7794a'), roughness: 0.92 });
  const ringMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#8c6138'), roughness: 1 });
  const trunkPoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(lean * 0.12, 0.6, 0),
    new THREE.Vector3(lean * 0.4, 1.2, 0.03),
    new THREE.Vector3(lean * 0.82, 1.78, 0.06),
    new THREE.Vector3(lean * 1.3, 2.3, 0.1),
    new THREE.Vector3(lean * 1.75, 2.65, 0.14),
  ];

  for (let i = 0; i < trunkPoints.length - 1; i++) {
    const a = trunkPoints[i];
    const b = trunkPoints[i + 1];
    const direction = b.clone().sub(a);
    const length = direction.length();
    const segment = new THREE.Mesh(new THREE.CylinderGeometry(0.17 - i * 0.018, 0.22 - i * 0.018, length, 8), trunkMat);
    segment.position.copy(a).addScaledVector(direction, 0.5);
    segment.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    segment.castShadow = true;
    palm.add(segment);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.19 - i * 0.018, 0.025, 5, 12), ringMat);
    ring.position.copy(a).addScaledVector(direction, 0.45);
    ring.quaternion.copy(segment.quaternion);
    ring.rotateX(Math.PI / 2);
    palm.add(ring);
  }

  const crown = trunkPoints[trunkPoints.length - 1];

  // A tapered, arching palm blade. Plane geometry is bent along its length so
  // each frond droops from the crown like a painted tropical leaf.
  const createFrondGeometry = (length: number, width: number, droop: number) => {
    const geo = new THREE.PlaneGeometry(width, length, 1, 16);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0, length / 2);
    const positions = geo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const t = Math.min(1, Math.max(0, z / length));
      const taper = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.04)), 0.55) * 0.92 + 0.08;
      positions.setX(i, x * taper);
      positions.setY(i, -Math.pow(t, 1.7) * droop);
    }
    geo.computeVertexNormals();
    return geo;
  };

  const frondGeometries = [createFrondGeometry(2.25, 0.62, 1.05), createFrondGeometry(2.05, 0.55, 0.85), createFrondGeometry(2.45, 0.7, 1.25)];
  const frondMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#4f9f38'), roughness: 0.78, side: THREE.DoubleSide });
  const frondMatLight = new THREE.MeshStandardMaterial({ color: new THREE.Color('#72bd4a'), roughness: 0.8, side: THREE.DoubleSide });
  const frondMatDeep = new THREE.MeshStandardMaterial({ color: new THREE.Color('#3d8a33'), roughness: 0.82, side: THREE.DoubleSide });
  const frondMaterials = [frondMat, frondMatLight, frondMatDeep];

  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 + (i % 2 === 0 ? 0.16 : 0);
    const frondGroup = new THREE.Group();
    frondGroup.position.copy(crown);
    frondGroup.rotation.y = angle;

    const tilt = new THREE.Group();
    tilt.rotation.x = -0.38 + (i % 4) * 0.13;
    tilt.rotation.z = (i % 3 - 1) * 0.08;

    const frond = new THREE.Mesh(frondGeometries[i % 3], frondMaterials[i % 3]);
    frond.rotation.y = (i % 2 === 0 ? 1 : -1) * 0.06;
    frond.castShadow = true;
    tilt.add(frond);

    // A shorter, upright center frond gives the crown volume from above.
    if (i % 3 === 0) {
      const inner = new THREE.Mesh(frondGeometries[1], frondMatLight);
      inner.scale.setScalar(0.7);
      inner.rotation.x = -0.62;
      inner.rotation.y = 0.35;
      tilt.add(inner);
    }

    frondGroup.add(tilt);
    palm.add(frondGroup);
  }

  // Hanging seed clusters under the crown
  const seedMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#c69a4b'), roughness: 0.9 });
  for (let i = 0; i < 4; i++) {
    const seed = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 5), seedMat);
    const angle = i * 1.6;
    seed.position.set(crown.x + Math.cos(angle) * 0.24, crown.y - 0.22, crown.z + Math.sin(angle) * 0.24);
    palm.add(seed);
  }

  const coconutMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#6d4a2c'), roughness: 0.9 });
  for (let i = 0; i < 3; i++) {
    const coconut = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 7), coconutMat);
    coconut.position.set(crown.x + Math.cos(i * 2.1) * 0.25, crown.y - 0.2, crown.z + Math.sin(i * 2.1) * 0.25);
    coconut.castShadow = true;
    palm.add(coconut);
  }

  palm.add(createSoftShadow(3.6, 3.2, 0.34));
  palm.scale.setScalar(scale);
  return palm;
}

/** Saguaro cactus with rounded arms and a tiny desert bloom. */
export function createCactusMesh(scale = 1): THREE.Group {
  const cactus = new THREE.Group();
  const green = new THREE.MeshStandardMaterial({ color: new THREE.Color('#5f9b4e'), roughness: 0.82 });
  const greenLight = new THREE.MeshStandardMaterial({ color: new THREE.Color('#7db365'), roughness: 0.82 });

  const createLimb = (x: number, z: number, height: number, radius: number) => {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.05, height, 9), green);
    body.position.set(x, height / 2, z);
    body.castShadow = true;
    cactus.add(body);

    const top = new THREE.Mesh(new THREE.SphereGeometry(radius, 9, 8), greenLight);
    top.position.set(x, height, z);
    top.castShadow = true;
    cactus.add(top);
    return { body, top };
  };

  createLimb(0, 0, 1.75, 0.28);

  const armMat = green;
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.62, 8), armMat);
  leftArm.rotation.z = Math.PI / 2;
  leftArm.position.set(-0.4, 1.0, 0);
  leftArm.castShadow = true;
  cactus.add(leftArm);
  createLimb(-0.68, 0, 1.0, 0.19);

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.5, 8), armMat);
  rightArm.rotation.z = Math.PI / 2;
  rightArm.position.set(0.35, 1.4, 0.02);
  rightArm.castShadow = true;
  cactus.add(rightArm);
  createLimb(0.6, 0.02, 1.15, 0.17);

  // Spines / ribs
  for (let i = 0; i < 14; i++) {
    const y = 0.22 + Math.random() * 1.3;
    const angle = Math.random() * Math.PI * 2;
    const spine = new THREE.Mesh(
      new THREE.ConeGeometry(0.018, 0.11, 4),
      new THREE.MeshStandardMaterial({ color: 0xe4d9bd, roughness: 1 })
    );
    spine.position.set(Math.cos(angle) * 0.29, y, Math.sin(angle) * 0.29);
    spine.rotation.z = Math.PI / 2;
    spine.rotation.y = -angle;
    cactus.add(spine);
  }

  const bloom = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 7, 6),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#f7a5b8'), roughness: 0.7 })
  );
  bloom.position.set(0, 1.95, 0);
  cactus.add(bloom);

  cactus.add(createSoftShadow(1.9, 1.7, 0.3));
  cactus.scale.setScalar(scale);
  return cactus;
}

/** Warm sandstone boulders, layered like painted clay. */
export function createRockMesh(scale = 1, tone: 'desert' | 'island' | 'grey' = 'desert'): THREE.Group {
  const rock = new THREE.Group();
  const hues = tone === 'desert' ? ['#c39a68', '#d2ad7b', '#b78b5a'] : tone === 'island' ? ['#99a49d', '#b5bcb2', '#7e8f8d'] : ['#9ca3af', '#b9beb8', '#7d878b'];
  const sizes = [
    { pos: [0, 0.27, 0], s: [1.0, 0.68, 0.9] },
    { pos: [0.5, 0.16, 0.16], s: [0.58, 0.43, 0.55] },
    { pos: [-0.4, 0.14, -0.2], s: [0.5, 0.4, 0.45] },
  ];

  sizes.forEach(({ pos, s }, i) => {
    const mesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.8, 0),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(hues[i]), roughness: 0.95, flatShading: true })
    );
    mesh.position.set(pos[0], pos[1], pos[2]);
    mesh.scale.set(s[0], s[1], s[2]);
    mesh.rotation.set(i * 0.5, i * 1.4, i * 0.3);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    rock.add(mesh);
  });

  rock.add(createSoftShadow(2.8, 2.2, 0.3));
  rock.scale.setScalar(scale);
  return rock;
}

/** Round tropical shrubs and flowering tufts for the island beach edge. */
export function createTropicalBushMesh(scale = 1): THREE.Group {
  const bush = new THREE.Group();
  const shades = ['#5ca345', '#79b953', '#4a913a'];
  const puffs = [
    { pos: [0, 0.42, 0], s: 0.52 },
    { pos: [0.42, 0.3, 0.14], s: 0.4 },
    { pos: [-0.35, 0.28, 0.2], s: 0.36 },
    { pos: [0.05, 0.33, -0.36], s: 0.37 },
  ];
  puffs.forEach(({ pos, s }, i) => {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(s, 10, 8),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(shades[i % shades.length]), roughness: 0.88 })
    );
    puff.position.set(pos[0], pos[1], pos[2]);
    puff.castShadow = true;
    bush.add(puff);
  });

  for (let i = 0; i < 5; i++) {
    const flower = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 6, 5),
      new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? '#fff1b0' : '#f6a7b9', roughness: 0.7 })
    );
    const angle = i * 1.7;
    flower.position.set(Math.cos(angle) * 0.4, 0.63 + (i % 2) * 0.1, Math.sin(angle) * 0.33);
    bush.add(flower);
  }
  bush.add(createSoftShadow(1.8, 1.6, 0.26));
  bush.scale.setScalar(scale);
  return bush;
}
