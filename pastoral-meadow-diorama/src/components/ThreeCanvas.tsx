import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { SheepData, SheepAction, TimeOfDay, WeatherEffect, SceneTheme } from '../types';
import { generateSceneTexture } from '../utils/textureGenerator';
import {
  createSheepMesh,
  createTreeMesh,
  createCloudMesh,
  createPalmMesh,
  createCactusMesh,
  createRockMesh,
  createTropicalBushMesh,
  SheepMeshParts,
  SHEEP_SCALE_FACTOR,
  WOOL_COLORS,
} from '../utils/meshBuilders';
import { SCENE_CONFIGS, clampToScene } from '../scenes';
import { soundManager } from '../utils/audio';

export interface ProjectedBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  distance: number;
  screenLeft: number;
  screenTop: number;
  screenRight: number;
  screenBottom: number;
  worldPos: [number, number, number];
}

interface ThreeCanvasProps {
  sheepList: SheepData[];
  selectedSheepId: string | null;
  hoveredSheepId: string | null;
  onSelectSheep: (id: string | null) => void;
  onHoverSheep: (id: string | null) => void;
  onUpdateSheep: (id: string, updates: Partial<SheepData>) => void;
  onBoxCalculated: (box: ProjectedBoundingBox | null) => void;
  timeOfDay: TimeOfDay;
  weather: WeatherEffect;
  theme: SceneTheme;
  cameraPreset: 'isometric' | 'topdown' | 'follow' | null;
  onCameraPresetHandled: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  sheepList,
  selectedSheepId,
  hoveredSheepId,
  onSelectSheep,
  onHoverSheep,
  onUpdateSheep,
  onBoxCalculated,
  timeOfDay,
  weather,
  theme,
  cameraPreset,
  onCameraPresetHandled,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // References to keep track of 3D objects
  const sheepMeshesMap = useRef<Map<string, SheepMeshParts>>(new Map());
  const environmentRef = useRef<THREE.Group | null>(null);
  const cloudsRef = useRef<{ group: THREE.Group; shadow: THREE.Mesh; speed: number }[]>([]);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambLightRef = useRef<THREE.AmbientLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  // Raycaster & interaction state
  const raycaster = useRef(new THREE.Raycaster());
  const isDraggingGround = useRef(false);
  const isDraggingSheep = useRef(false);
  const draggedSheepId = useRef<string | null>(null);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const dragIntersection = useRef(new THREE.Vector3());
  const dragOffset = useRef(new THREE.Vector3());
  const lastMousePos = useRef({ x: 0, y: 0 });
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const cameraPosition = useRef(new THREE.Vector3(18.8, 20.2, 18.8));
  const isMouseDown = useRef(false);
  const clickStartPos = useRef({ x: 0, y: 0 });

  // Animation frame
  const animFrameId = useRef<number | null>(null);
  const clock = useRef(new THREE.Clock());

  // Clickable marker / Clover ripple
  const clickRipples = useRef<{ mesh: THREE.Mesh; life: number }[]>([]);

  // 1. Initialize Scene, Camera, Renderer
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f6f3eb'); // Warm cream background
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 120);
    camera.position.copy(cameraPosition.current);
    camera.lookAt(cameraTarget.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- Lighting ---
    const ambLight = new THREE.AmbientLight(0xfff8ea, 0.95);
    scene.add(ambLight);
    ambLightRef.current = ambLight;

    const hemiLight = new THREE.HemisphereLight(0xdcfce7, 0xfef3c7, 0.45);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfff2d6, 1.45);
    dirLight.position.set(14, 24, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 60;
    const d = 19;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Soft cyan fill light
    const fillLight = new THREE.DirectionalLight(0xbbe1fa, 0.35);
    fillLight.position.set(-12, 10, -12);
    scene.add(fillLight);

    // Land, trees and scene props are created by the landscape effect below.

    // --- Floating Clouds ---
    const cloud1 = createCloudMesh(1.1);
    cloud1.group.position.set(2.5, 7.8, -4.5);
    cloud1.shadow.position.set(2.5, 0.03, -4.5);
    scene.add(cloud1.group);
    scene.add(cloud1.shadow);
    cloudsRef.current.push({ group: cloud1.group, shadow: cloud1.shadow, speed: 0.25 });

    const cloud2 = createCloudMesh(0.85);
    cloud2.group.position.set(-6.5, 8.5, 2.5);
    cloud2.shadow.position.set(-6.5, 0.03, 2.5);
    scene.add(cloud2.group);
    scene.add(cloud2.shadow);
    cloudsRef.current.push({ group: cloud2.group, shadow: cloud2.shadow, speed: 0.18 });

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
      cloudsRef.current = [];
      sheepMeshesMap.current.clear();
      sceneRef.current = null;
    };
  }, []);

  // 2. Build the active landscape (land texture + theme-specific 3D props)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const environment = new THREE.Group();
    environment.name = 'landscape';
    environmentRef.current = environment;
    scene.add(environment);

    // Shared diorama ground
    const groundGeo = new THREE.PlaneGeometry(21.5, 19.5, 32, 32);
    const texture = new THREE.CanvasTexture(generateSceneTexture(theme));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    const groundMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
      metalness: 0.01,
      transparent: true,
      alphaTest: 0.01,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    groundMesh.name = 'ground';
    environment.add(groundMesh);

    const addProp = (prop: THREE.Object3D, x: number, z: number, y = 0, rotation = 0) => {
      prop.position.set(x, y, z);
      prop.rotation.y = rotation;
      environment.add(prop);
    };

    if (theme === 'meadow') {
      const treeConfigs: { pos: [number, number, number]; type: 'green' | 'light_green' | 'pink'; s: number }[] = [
        { pos: [-6.6, 0, -6.2], type: 'green', s: 1.15 },
        { pos: [-3.2, 0, -6.6], type: 'light_green', s: 0.95 },
        { pos: [0.8, 0, -7.2], type: 'light_green', s: 1.0 },
        { pos: [6.6, 0, -6.4], type: 'green', s: 1.1 },
        { pos: [-7.2, 0, 3.2], type: 'pink', s: 1.25 },
        { pos: [-4.2, 0, 5.8], type: 'light_green', s: 1.05 },
        { pos: [7.2, 0, 5.2], type: 'green', s: 1.2 },
      ];
      treeConfigs.forEach(({ pos, type, s }) => {
        addProp(createTreeMesh(type, s), pos[0], pos[2], pos[1]);
      });
      // A few tiny wildflower tufts at the very edges
      addProp(createTropicalBushMesh(0.55), 4.2, -5.6, 0);
      addProp(createTropicalBushMesh(0.45), 6.8, 3.0, 0);
    }

    if (theme === 'desert') {
      const palms: [number, number, number, number][] = [
        [-6.0, 0.1, 0.9, 0.35],
        [-0.2, 2.7, 0.86, -0.4],
        [-2.4, 4.0, 0.76, 0.2],
        [-5.7, 2.9, 0.68, -0.25],
        [4.7, 4.7, 0.62, 0.45],
      ];
      palms.forEach(([x, z, s, rot]) => addProp(createPalmMesh(s, 0.45), x, z, 0, rot));

      const cacti: [number, number, number][] = [
        [5.2, -4.6, 1.0],
        [3.9, 4.5, 0.86],
        [-5.3, -4.3, 1.12],
        [6.2, 1.6, 0.74],
        [-1.9, -5.1, 0.66],
        [1.6, 5.1, 0.58],
      ];
      cacti.forEach(([x, z, s]) => addProp(createCactusMesh(s), x, z));

      addProp(createRockMesh(1.1, 'desert'), 5.6, -3.3, 0, 0.4);
      addProp(createRockMesh(0.65, 'desert'), -1.9, -5.0, 0, 1.2);
      addProp(createRockMesh(0.55, 'desert'), 4.4, 0.9, 0, 0.1);
      addProp(createRockMesh(0.45, 'desert'), -5.4, 5.2, 0, 2.1);
      addProp(createTropicalBushMesh(0.55), -0.9, -4.3, 0);
      addProp(createTropicalBushMesh(0.45), 2.8, -5.5, 0);
    }

    if (theme === 'island') {
      const palms: [number, number, number, number][] = [
        [-4.2, -3.3, 0.92, 0.4],
        [-4.3, 2.6, 0.82, -0.6],
        [4.3, -3.2, 0.88, 0.9],
        [4.2, 2.6, 0.7, -0.2],
        [0.0, -5.0, 0.65, 0.2],
        [-1.4, 4.8, 0.72, 1.5],
      ];
      palms.forEach(([x, z, s, rot]) => addProp(createPalmMesh(s, 0.42), x, z, 0, rot));

      addProp(createRockMesh(0.8, 'island'), -3.9, -2.7, 0, 0.7);
      addProp(createRockMesh(0.7, 'island'), 4.4, -2.1, 0, 1.4);
      addProp(createRockMesh(0.55, 'island'), 3.0, 4.2, 0, 0.2);
      addProp(createRockMesh(0.4, 'island'), -4.8, 0.8, 0, 1.9);
      addProp(createTropicalBushMesh(0.85), 2.6, -0.3, 0);
      addProp(createTropicalBushMesh(0.68), -2.2, 2.1, 0);
      addProp(createTropicalBushMesh(0.58), 2.2, 3.8, 0);
      addProp(createTropicalBushMesh(0.52), -1.3, -3.3, 0);

      // Soft, broken surf lines around the shore
      const createSurfLine = (radiusX: number, radiusZ: number, thickness: number, phase: number) => {
        const points: THREE.Vector3[] = [];
        const steps = 96;
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          const wobble =
            1 +
            Math.sin(angle * 4 + phase) * 0.035 +
            Math.sin(angle * 7 + phase * 1.7) * 0.022 +
            Math.cos(angle * 11 + phase * 0.6) * 0.012;
          points.push(new THREE.Vector3(Math.cos(angle) * radiusX * wobble, 0, Math.sin(angle) * radiusZ * wobble));
        }
        const curve = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);
        const geometry = new THREE.TubeGeometry(curve, 180, thickness, 5, true);
        geometry.scale(1, 0.12, 1);
        return geometry;
      };

      const surfOuter = new THREE.Mesh(
        createSurfLine(7.0, 6.4, 0.1, 0.4),
        new THREE.MeshBasicMaterial({ color: 0xf4fffb, transparent: true, opacity: 0.55, depthWrite: false })
      );
      surfOuter.position.y = 0.045;
      environment.add(surfOuter);

      const surfInner = new THREE.Mesh(
        createSurfLine(6.55, 5.95, 0.06, 2.1),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.36, depthWrite: false })
      );
      surfInner.position.y = 0.04;
      environment.add(surfInner);
    }

    cameraTarget.current.set(0, 0, 0);
    cameraPosition.current.set(18.8, 20.2, 18.8);

    return () => {
      scene.remove(environment);
      environment.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
          child.geometry.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            if ('map' in material && material.map instanceof THREE.Texture) material.map.dispose();
            material.dispose();
          });
        }
      });
      if (environmentRef.current === environment) environmentRef.current = null;
    };
  }, [theme]);

  // 3. Weather Particles (Petals, Dandelions, Fireflies)
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    if (particleSystemRef.current) {
      scene.remove(particleSystemRef.current);
      particleSystemRef.current.geometry.dispose();
      particleSystemRef.current = null;
    }

    if (weather === 'clear') return;

    const count = weather === 'fireflies' ? 120 : 250;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = Math.random() * 8 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      if (weather === 'petals') {
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.72;
        colors[i * 3 + 2] = 0.84;
      } else if (weather === 'dandelion') {
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.98;
        colors[i * 3 + 2] = 0.92;
      } else {
        // fireflies
        colors[i * 3] = 0.75;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.35;
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: weather === 'fireflies' ? 0.22 : 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particles = new THREE.Points(geo, pMat);
    scene.add(particles);
    particleSystemRef.current = particles;
  }, [weather]);

  // 3. Time of Day Lighting adjustments
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !ambLightRef.current || !hemiLightRef.current) return;
    const scene = sceneRef.current;
    const dir = dirLightRef.current;
    const amb = ambLightRef.current;
    const hemi = hemiLightRef.current;

    scene.background = new THREE.Color(SCENE_CONFIGS[theme].backgrounds[timeOfDay]);

    if (timeOfDay === 'day') {
      dir.color.setHex(theme === 'desert' ? 0xfff0cf : 0xfff2d6);
      dir.intensity = theme === 'desert' ? 1.55 : 1.45;
      amb.color.setHex(0xfff8ea);
      amb.intensity = 0.95;
      hemi.color.setHex(theme === 'island' ? 0xd9fff7 : theme === 'desert' ? 0xfef3c7 : 0xdcfce7);
      hemi.groundColor.setHex(0xfef3c7);
    } else if (timeOfDay === 'sunset') {
      dir.color.setHex(0xff9944);
      dir.intensity = 1.6;
      amb.color.setHex(0xfde2c2);
      amb.intensity = 0.8;
      hemi.color.setHex(0xfecdd3);
      hemi.groundColor.setHex(0xfde047);
    } else if (timeOfDay === 'night') {
      dir.color.setHex(0x7391c8);
      dir.intensity = 0.55;
      amb.color.setHex(0x2d3a5e);
      amb.intensity = 0.45;
      hemi.color.setHex(0x1e293b);
      hemi.groundColor.setHex(0x0f172a);
    }
  }, [timeOfDay, theme]);

  // 4. Synchronize Sheep Meshes with React State
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    const currentMeshMap = sheepMeshesMap.current;

    // Remove meshes that are no longer in sheepList
    const existingIds = new Set(sheepList.map((s) => s.id));
    currentMeshMap.forEach((parts, id) => {
      if (!existingIds.has(id)) {
        scene.remove(parts.group);
        currentMeshMap.delete(id);
      }
    });

    // Add or update sheep meshes
    sheepList.forEach((s) => {
      let parts = currentMeshMap.get(s.id);
      if (!parts) {
        parts = createSheepMesh(s.woolColor, s.scale);
        parts.group.userData = { sheepId: s.id };
        scene.add(parts.group);
        currentMeshMap.set(s.id, parts);
      }

      // Update wool color if changed
      const targetHex = WOOL_COLORS[s.woolColor] || WOOL_COLORS.white;
      parts.woolMeshes.forEach((mesh) => {
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.color.set(targetHex);
        }
      });

      // Update scale
      const visualScale = s.scale * SHEEP_SCALE_FACTOR;
      parts.group.scale.set(visualScale, visualScale, visualScale);
    });
  }, [sheepList]);

  // 5. Handle Camera Presets
  useEffect(() => {
    if (!cameraPreset || !cameraRef.current) return;

    if (cameraPreset === 'isometric') {
      cameraTarget.current.set(0, 0, 0);
      cameraPosition.current.set(18.8, 20.2, 18.8);
    } else if (cameraPreset === 'topdown') {
      cameraTarget.current.set(0, 0, 0);
      cameraPosition.current.set(0.1, 36, 0.1);
    }

    onCameraPresetHandled();
  }, [cameraPreset, onCameraPresetHandled]);

  // 6. Main Animation Loop
  useEffect(() => {
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      const delta = clock.current.getDelta();
      const elapsedTime = clock.current.getElapsedTime();

      // --- Update Clouds Floating ---
      cloudsRef.current.forEach((cloud) => {
        cloud.group.position.x += delta * cloud.speed;
        cloud.shadow.position.x = cloud.group.position.x;
        if (cloud.group.position.x > 14) {
          cloud.group.position.x = -14;
          cloud.shadow.position.x = -14;
        }
        // Gentle bobbing
        cloud.group.position.y = 7.8 + Math.sin(elapsedTime * 0.8 + cloud.group.position.x) * 0.2;
      });

      // --- Update Weather Particles ---
      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length / 3; i++) {
          if (weather === 'petals' || weather === 'dandelion') {
            positions[i * 3 + 1] -= delta * 0.8;
            positions[i * 3] += Math.sin(elapsedTime + i) * delta * 0.4;
            positions[i * 3 + 2] += Math.cos(elapsedTime + i) * delta * 0.3;
            if (positions[i * 3 + 1] < 0.1) {
              positions[i * 3 + 1] = 8;
            }
          } else if (weather === 'fireflies') {
            positions[i * 3 + 1] += Math.sin(elapsedTime * 2 + i) * delta * 0.3;
            positions[i * 3] += Math.cos(elapsedTime * 1.5 + i) * delta * 0.3;
          }
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // --- Update Click Ripples / Clover markers ---
      for (let i = clickRipples.current.length - 1; i >= 0; i--) {
        const r = clickRipples.current[i];
        r.life -= delta * 1.8;
        r.mesh.scale.addScalar(delta * 2.2);
        if (r.mesh.material instanceof THREE.MeshBasicMaterial) {
          r.mesh.material.opacity = r.life;
        }
        if (r.life <= 0) {
          if (sceneRef.current) sceneRef.current.remove(r.mesh);
          clickRipples.current.splice(i, 1);
        }
      }

      // --- Update Sheep Physics, Animations, and Autonomous Movement ---
      sheepList.forEach((s) => {
        const parts = sheepMeshesMap.current.get(s.id);
        if (!parts) return;

        const isSelected = s.id === selectedSheepId;
        const isHovered = s.id === hoveredSheepId;
        const isHeld = s.isHeld || (isDraggingSheep.current && draggedSheepId.current === s.id);

        let [x, y, z] = s.position;
        let rot = s.rotation;

        // Autonomous wandering AI when not held and in walking/running mode
        if (!isHeld) {
          if (s.action === 'walk' || s.action === 'run') {
            const moveSpeed = s.action === 'run' ? s.speed * 1.8 : s.speed;

            // Move in forward direction
            const forwardX = Math.sin(rot) * moveSpeed * delta;
            const forwardZ = Math.cos(rot) * moveSpeed * delta;

            x += forwardX;
            z += forwardZ;

            const sceneCfg = SCENE_CONFIGS[theme];

            // Keep the flock on dry land and inside the diorama
            if (sceneCfg.bounds.kind === 'rect') {
              const { minX, maxX, minZ, maxZ } = sceneCfg.bounds;
              if (x < minX || x > maxX || z < minZ || z > maxZ) {
                x = Math.max(minX, Math.min(maxX, x));
                z = Math.max(minZ, Math.min(maxZ, z));
                rot = Math.atan2(-x, -z) + (Math.random() - 0.5) * 0.6;
              }
            } else {
              const [cx, cz] = sceneCfg.bounds.center;
              const dx = x - cx;
              const dz = z - cz;
              const distance = Math.hypot(dx, dz);
              if (distance > sceneCfg.bounds.radius) {
                x = cx + (dx / distance) * sceneCfg.bounds.radius;
                z = cz + (dz / distance) * sceneCfg.bounds.radius;
                rot = Math.atan2(cx - x, cz - z) + (Math.random() - 0.5) * 0.6;
              }
            }

            // Waterholes, boulders and other obstacle avoidance
            sceneCfg.obstacles.forEach((obstacle) => {
              const dx = x - obstacle.center[0];
              const dz = z - obstacle.center[1];
              const distance = Math.hypot(dx, dz);
              const safeRadius = obstacle.radius + 0.25;
              if (distance < safeRadius) {
                const nx = distance === 0 ? 1 : dx / distance;
                const nz = distance === 0 ? 0 : dz / distance;
                x = obstacle.center[0] + nx * safeRadius;
                z = obstacle.center[1] + nz * safeRadius;
                rot = Math.atan2(nx, nz) + (Math.random() - 0.5) * 0.5;
              }
            });

            // Occasional gentle random course adjustment
            if (Math.random() < 0.015) {
              rot += (Math.random() - 0.5) * 0.8;
            }

            // Sync updated position & rotation
            onUpdateSheep(s.id, { position: [x, y, z], rotation: rot });
          } else if (s.action === 'idle' || s.action === 'graze') {
            // Periodic random action switch if not specifically locked by user
            if (s.actionTimer > 0) {
              onUpdateSheep(s.id, { actionTimer: s.actionTimer - delta });
            } else if (!isSelected) {
              const rand = Math.random();
              const nextAct: SheepAction = rand < 0.45 ? 'walk' : rand < 0.8 ? 'graze' : 'idle';
              const nextRot = rot + (Math.random() - 0.5) * 1.2;
              onUpdateSheep(s.id, { action: nextAct, rotation: nextRot, actionTimer: 4 + Math.random() * 6 });
            }
          }
        }

        // --- Procedural Mesh Bone/Part Animations ---
        const t = elapsedTime * 4 + s.id.charCodeAt(s.id.length - 1);

        if (isHeld) {
          // Being picked up by hand
          parts.group.position.set(x, y + 1.2 + Math.sin(t * 3) * 0.1, z);
          parts.group.rotation.set(0.15, rot, Math.sin(t * 4) * 0.1);
          // Legs dangling and paddling
          parts.legFL.rotation.x = Math.sin(t * 8) * 0.6;
          parts.legFR.rotation.x = -Math.sin(t * 8) * 0.6;
          parts.legBL.rotation.x = Math.cos(t * 8) * 0.6;
          parts.legBR.rotation.x = -Math.cos(t * 8) * 0.6;
          parts.headGroup.rotation.x = -0.2;
          parts.shadowMesh.scale.setScalar(0.65);
        } else if (s.action === 'walk') {
          // Walking waddle
          const walkFreq = 7;
          parts.group.position.set(x, y + Math.abs(Math.sin(t * walkFreq)) * 0.12, z);
          parts.group.rotation.set(0, rot, Math.sin(t * walkFreq) * 0.06);

          parts.legFL.rotation.x = Math.sin(t * walkFreq) * 0.55;
          parts.legFR.rotation.x = -Math.sin(t * walkFreq) * 0.55;
          parts.legBL.rotation.x = -Math.sin(t * walkFreq) * 0.55;
          parts.legBR.rotation.x = Math.sin(t * walkFreq) * 0.55;

          parts.headGroup.rotation.x = Math.sin(t * walkFreq) * 0.08;
          parts.leftEar.rotation.z = Math.PI * 0.45 + Math.sin(t * walkFreq) * 0.08;
          parts.rightEar.rotation.z = -Math.PI * 0.45 - Math.sin(t * walkFreq) * 0.08;
          parts.tail.rotation.y = Math.sin(t * walkFreq * 2) * 0.3;
          parts.shadowMesh.scale.setScalar(1.0);
        } else if (s.action === 'run') {
          // Fast trotting
          const runFreq = 14;
          parts.group.position.set(x, y + Math.abs(Math.sin(t * runFreq)) * 0.2, z);
          parts.group.rotation.set(0.08, rot, Math.sin(t * runFreq) * 0.1);

          parts.legFL.rotation.x = Math.sin(t * runFreq) * 0.85;
          parts.legFR.rotation.x = -Math.sin(t * runFreq) * 0.85;
          parts.legBL.rotation.x = -Math.sin(t * runFreq) * 0.85;
          parts.legBR.rotation.x = Math.sin(t * runFreq) * 0.85;

          parts.headGroup.rotation.x = -0.15 + Math.sin(t * runFreq) * 0.1;
          parts.shadowMesh.scale.setScalar(0.95);
        } else if (s.action === 'graze') {
          // Head lowered to grass, munching
          parts.group.position.set(x, y, z);
          parts.group.rotation.set(0, rot, 0);

          parts.headGroup.position.set(0, 0.45, 0.95);
          parts.headGroup.rotation.x = 0.65 + Math.sin(t * 4) * 0.08; // Munching bob
          parts.woolGroup.position.y = 0.65;

          parts.legFL.rotation.x = -0.1;
          parts.legFR.rotation.x = -0.1;
          parts.legBL.rotation.x = 0.1;
          parts.legBR.rotation.x = 0.1;
          parts.shadowMesh.scale.setScalar(1.0);
        } else if (s.action === 'jump') {
          // Joyful leap arc
          const jumpPhase = (t * 2) % (Math.PI * 2);
          const jumpHeight = Math.max(0, Math.sin(jumpPhase) * 1.6);

          parts.group.position.set(x, y + jumpHeight, z);
          parts.group.rotation.set(Math.sin(jumpPhase) * 0.25, rot, Math.sin(jumpPhase * 2) * 0.1);

          // Legs kicking out happily
          parts.legFL.rotation.x = -0.6;
          parts.legFR.rotation.x = -0.6;
          parts.legBL.rotation.x = 0.6;
          parts.legBR.rotation.x = 0.6;

          parts.headGroup.rotation.x = -0.3;
          parts.leftEar.rotation.z = Math.PI * 0.35;
          parts.rightEar.rotation.z = -Math.PI * 0.35;

          // Shadow scales down as sheep jumps high
          const shadowScale = Math.max(0.4, 1.0 - jumpHeight * 0.35);
          parts.shadowMesh.scale.setScalar(shadowScale);
        } else if (s.action === 'dance') {
          // Cute 360 spin & hop
          const spinRot = rot + t * 4;
          const hopY = Math.abs(Math.sin(t * 6)) * 0.4;
          parts.group.position.set(x, y + hopY, z);
          parts.group.rotation.set(0, spinRot, Math.sin(t * 8) * 0.15);

          parts.legFL.rotation.x = Math.sin(t * 8) * 0.7;
          parts.legFR.rotation.x = -Math.sin(t * 8) * 0.7;
          parts.legBL.rotation.x = Math.cos(t * 8) * 0.7;
          parts.legBR.rotation.x = -Math.cos(t * 8) * 0.7;
          parts.headGroup.rotation.y = Math.sin(t * 6) * 0.3;
        } else if (s.action === 'sleep') {
          // Curled down on ground
          parts.group.position.set(x, y - 0.25, z);
          parts.group.rotation.set(0, rot, 0.1);
          parts.headGroup.position.set(0, 0.35, 0.75);
          parts.headGroup.rotation.x = 0.4;
          parts.legFL.rotation.x = 0.7;
          parts.legFR.rotation.x = 0.7;
          parts.legBL.rotation.x = -0.7;
          parts.legBR.rotation.x = -0.7;
        } else {
          // Idle breathing
          parts.group.position.set(x, y, z);
          parts.group.rotation.set(0, rot, 0);
          parts.headGroup.position.set(0, 0.8, 0.85);
          parts.headGroup.rotation.x = Math.sin(t * 1.5) * 0.05;
          parts.headGroup.rotation.y = Math.sin(t * 0.8) * 0.15; // Looking around

          parts.woolGroup.scale.y = 1.0 + Math.sin(t * 2) * 0.03; // Gentle breathing

          parts.legFL.rotation.set(0, 0, 0);
          parts.legFR.rotation.set(0, 0, 0);
          parts.legBL.rotation.set(0, 0, 0);
          parts.legBR.rotation.set(0, 0, 0);
          parts.shadowMesh.scale.setScalar(1.0);
        }

        // Slight hover bounce effect
        if (isHovered && !isSelected) {
          parts.group.position.y += Math.sin(t * 6) * 0.05;
        }
      });

      // --- Follow Camera logic if following a selected sheep ---
      if (selectedSheepId && cameraPreset === 'follow') {
        const selectedParts = sheepMeshesMap.current.get(selectedSheepId);
        if (selectedParts) {
          const targetPos = selectedParts.group.position;
          cameraTarget.current.lerp(targetPos, 0.05);
          const desiredCamPos = new THREE.Vector3(targetPos.x + 8, targetPos.y + 9, targetPos.z + 8);
          cameraPosition.current.lerp(desiredCamPos, 0.05);
        }
      }

      // Smooth camera interpolation
      if (cameraRef.current) {
        cameraRef.current.position.lerp(cameraPosition.current, 0.08);
        cameraRef.current.lookAt(cameraTarget.current);
      }

      // --- Render Scene ---
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      // --- Calculate 2D Screen Bounding Box for Selected Sheep ---
      if (selectedSheepId && cameraRef.current && containerRef.current) {
        const selectedParts = sheepMeshesMap.current.get(selectedSheepId);
        if (selectedParts) {
          const sheepRoot = selectedParts.group;
          const container = containerRef.current;
          const width = container.clientWidth;
          const height = container.clientHeight;

          // Compute 3D bounding box
          const bbox = new THREE.Box3().setFromObject(selectedParts.woolGroup);
          // Expand slightly to include head
          bbox.expandByObject(selectedParts.headGroup);

          // Get the 8 corners of the 3D bounding box
          const corners = [
            new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.min.z),
            new THREE.Vector3(bbox.min.x, bbox.min.y, bbox.max.z),
            new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.min.z),
            new THREE.Vector3(bbox.min.x, bbox.max.y, bbox.max.z),
            new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.min.z),
            new THREE.Vector3(bbox.max.x, bbox.min.y, bbox.max.z),
            new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.min.z),
            new THREE.Vector3(bbox.max.x, bbox.max.y, bbox.max.z),
          ];

          let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;

          corners.forEach((c) => {
            c.project(cameraRef.current!);
            const screenX = ((c.x + 1) * width) / 2;
            const screenY = ((-c.y + 1) * height) / 2;
            minX = Math.min(minX, screenX);
            maxX = Math.max(maxX, screenX);
            minY = Math.min(minY, screenY);
            maxY = Math.max(maxY, screenY);
          });

          // Add padding
          const pad = 8;
          minX -= pad;
          maxX += pad;
          minY -= pad;
          maxY += pad;

          const boxWidth = Math.max(40, maxX - minX);
          const boxHeight = Math.max(40, maxY - minY);

          const distance = cameraRef.current.position.distanceTo(sheepRoot.position);

          onBoxCalculated({
            x: (minX + maxX) / 2,
            y: (minY + maxY) / 2,
            width: boxWidth,
            height: boxHeight,
            screenLeft: minX,
            screenTop: minY,
            screenRight: maxX,
            screenBottom: maxY,
            distance: Math.round(distance * 1.9), // scaled for realistic meters
            worldPos: [sheepRoot.position.x, sheepRoot.position.y, sheepRoot.position.z],
          });
        }
      } else {
        onBoxCalculated(null);
      }
    };

    animFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [sheepList, selectedSheepId, hoveredSheepId, cameraPreset, onUpdateSheep, onBoxCalculated, weather, theme]);

  // 7. Raycasting Helpers
  const getIntersectedSheepId = useCallback((event: React.MouseEvent): string | null => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    // Collect all sheep meshes
    const candidates: THREE.Object3D[] = [];
    sheepMeshesMap.current.forEach((parts) => {
      candidates.push(parts.group);
    });

    const intersects = raycaster.current.intersectObjects(candidates, true);
    if (intersects.length > 0) {
      let obj: THREE.Object3D | null = intersects[0].object;
      while (obj && !obj.userData.sheepId && obj.parent) {
        obj = obj.parent;
      }
      return obj?.userData.sheepId || null;
    }
    return null;
  }, []);

  // 8. Mouse Events (Hover, Click, Drag Sheep, Orbit Ground)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    isMouseDown.current = true;
    clickStartPos.current = { x: e.clientX, y: e.clientY };
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    const hitSheepId = getIntersectedSheepId(e);

    if (hitSheepId) {
      // Pick up sheep for dragging
      isDraggingSheep.current = true;
      draggedSheepId.current = hitSheepId;
      onSelectSheep(hitSheepId);
      soundManager.playSelect();

      // Setup drag plane at sheep position
      const parts = sheepMeshesMap.current.get(hitSheepId);
      if (parts && cameraRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.current.setFromCamera(new THREE.Vector2(normX, normY), cameraRef.current);
        if (raycaster.current.ray.intersectPlane(dragPlane.current, dragIntersection.current)) {
          dragOffset.current.copy(parts.group.position).sub(dragIntersection.current);
        }
      }
    } else {
      // Dragging ground (camera orbit)
      isDraggingGround.current = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !cameraRef.current) return;

    // Check hover
    if (!isMouseDown.current) {
      const hitSheepId = getIntersectedSheepId(e);
      onHoverSheep(hitSheepId);
    }

    // Dragging sheep
    if (isDraggingSheep.current && draggedSheepId.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(new THREE.Vector2(normX, normY), cameraRef.current);

      if (raycaster.current.ray.intersectPlane(dragPlane.current, dragIntersection.current)) {
        const newPos = dragIntersection.current.clone().add(dragOffset.current);
        // Keep dropped sheep out of the sea, ponds and boulders
        const [clampedX, clampedZ] = clampToScene(theme, newPos.x, newPos.z);

        onUpdateSheep(draggedSheepId.current, {
          position: [clampedX, 0, clampedZ],
          isHeld: true,
        });
      }
      return;
    }

    // Dragging ground (Camera Orbit / Pan)
    if (isDraggingGround.current && isMouseDown.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      // Orbit camera around target
      const offset = cameraPosition.current.clone().sub(cameraTarget.current);
      const radius = offset.length();
      let theta = Math.atan2(offset.x, offset.z);
      let phi = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));

      theta -= dx * 0.006;
      phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, phi + dy * 0.006));

      offset.x = radius * Math.sin(phi) * Math.sin(theta);
      offset.y = radius * Math.cos(phi);
      offset.z = radius * Math.sin(phi) * Math.cos(theta);

      cameraPosition.current.copy(cameraTarget.current).add(offset);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    isMouseDown.current = false;

    // Check if it was a quick click without much drag distance
    const dist = Math.hypot(e.clientX - clickStartPos.current.x, e.clientY - clickStartPos.current.y);

    if (isDraggingSheep.current && draggedSheepId.current) {
      onUpdateSheep(draggedSheepId.current, { isHeld: false });
      isDraggingSheep.current = false;
      draggedSheepId.current = null;
    }

    if (isDraggingGround.current) {
      isDraggingGround.current = false;

      // A simple click on empty land dismisses the current selection.
      if (dist < 5) {
        onSelectSheep(null);

        if (containerRef.current && cameraRef.current && sceneRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.current.setFromCamera(new THREE.Vector2(normX, normY), cameraRef.current);

          const groundMesh = sceneRef.current.getObjectByName('ground');
          if (groundMesh) {
            const intersects = raycaster.current.intersectObject(groundMesh);
            if (intersects.length > 0) {
              const hitPoint = intersects[0].point;

              // Leave a small landscape-colored ripple where the paper was tapped.
              const ripGeo = new THREE.RingGeometry(0.1, 0.35, 16);
              const ripMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(SCENE_CONFIGS[theme].accent),
                transparent: true,
                opacity: 0.65,
                side: THREE.DoubleSide,
              });
              const ripple = new THREE.Mesh(ripGeo, ripMat);
              ripple.rotation.x = -Math.PI / 2;
              ripple.position.set(hitPoint.x, 0.05, hitPoint.z);
              sceneRef.current.add(ripple);
              clickRipples.current.push({ mesh: ripple, life: 1.0 });
            }
          }
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
    const offset = cameraPosition.current.clone().sub(cameraTarget.current);
    const newLen = Math.max(12, Math.min(58, offset.length() * zoomFactor));
    offset.setLength(newLen);
    cameraPosition.current.copy(cameraTarget.current).add(offset);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const hitSheepId = getIntersectedSheepId(e);
    if (hitSheepId) {
      onUpdateSheep(hitSheepId, { action: 'jump', actionTimer: 2 });
      soundManager.playJump();
    } else {
      // Another quick shortcut for clearing the current selection.
      onSelectSheep(null);
    }
  };

  // Escape is a keyboard shortcut for "deselect everything".
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onSelectSheep(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectSheep]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none cursor-grab active:cursor-grabbing overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
    />
  );
};
