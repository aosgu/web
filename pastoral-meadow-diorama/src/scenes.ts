import { SceneTheme, TimeOfDay } from './types';

export type Vec2 = [number, number];

export interface SceneBoundsRect {
  kind: 'rect';
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface SceneBoundsCircle {
  kind: 'circle';
  center: Vec2;
  radius: number;
}

export interface SceneObstacle {
  center: Vec2;
  radius: number;
}

export interface SceneConfig {
  id: SceneTheme;
  name: string;
  nameZh: string;
  tagline: string;
  emoji: string;
  accent: string;
  swatch: string;
  backgrounds: Record<TimeOfDay, string>;
  bounds: SceneBoundsRect | SceneBoundsCircle;
  obstacles: SceneObstacle[];
  spawnSlots: Vec2[];
}

export const SCENE_CONFIGS: Record<SceneTheme, SceneConfig> = {
  meadow: {
    id: 'meadow',
    name: 'Pastoral Meadow',
    nameZh: '草原牧场',
    tagline: 'Rolling green field & a winding stream',
    emoji: '🌿',
    accent: '#65a30d',
    swatch: 'linear-gradient(145deg, #d9f3bc 0%, #9fd866 48%, #64a9ee 58%, #3d8ce8 72%, #9ad161 76%)',
    backgrounds: {
      day: '#f6f3eb',
      sunset: '#fae8d8',
      night: '#1e2337',
    },
    bounds: { kind: 'rect', minX: -6.9, maxX: 7.0, minZ: -6.5, maxZ: 6.5 },
    obstacles: [
      // The winding stream on the west side
      { center: [-5.8, -5.2], radius: 1.7 },
      { center: [-5.1, -2.4], radius: 1.75 },
      { center: [-5.3, 0.6], radius: 1.8 },
      { center: [-5.9, 3.4], radius: 1.75 },
      { center: [-6.6, 6.1], radius: 1.8 },
    ],
    spawnSlots: [
      [-2.2, -2.5],
      [0.2, -3.2],
      [2.2, -4.8],
      [-0.2, -0.8],
      [4.8, -1.8],
      [0.8, 1.2],
      [-2.5, 2.0],
      [0.2, 4.2],
      [1.8, 3.2],
      [4.2, 2.3],
      [-1.0, 4.8],
      [5.6, 4.7],
    ],
  },
  desert: {
    id: 'desert',
    name: 'Desert Oasis',
    nameZh: '沙漠绿洲',
    tagline: 'Golden dunes, palms & a hidden waterhole',
    emoji: '🌵',
    accent: '#d97706',
    swatch: 'linear-gradient(145deg, #f7e0a9 0%, #ebc577 48%, #5ec8c1 56%, #2aa6a8 72%, #e5bd6a 76%)',
    backgrounds: {
      day: '#faf0df',
      sunset: '#f7ddc2',
      night: '#272133',
    },
    bounds: { kind: 'rect', minX: -7.0, maxX: 7.0, minZ: -6.1, maxZ: 6.2 },
    obstacles: [
      // The oasis lagoon
      { center: [-3.05, 1.15], radius: 2.45 },
      // The big sun-baked boulders
      { center: [5.6, -3.3], radius: 0.7 },
      { center: [-2.0, -5.0], radius: 0.5 },
    ],
    spawnSlots: [
      [0.8, -2.4],
      [3.0, -3.5],
      [4.9, -0.6],
      [1.8, 0.3],
      [-0.4, 0.6],
      [2.9, 3.6],
      [-0.7, 4.2],
      [5.6, 2.4],
      [-2.2, -3.0],
      [4.1, 5.1],
      [0.1, -4.8],
      [-4.4, -3.1],
    ],
  },
  island: {
    id: 'island',
    name: 'Tropical Isle',
    nameZh: '热带海岛',
    tagline: 'A palm-fringed hideaway in a turquoise sea',
    emoji: '🏝️',
    accent: '#0891b2',
    swatch: 'linear-gradient(145deg, #d8f0dc 0%, #f8ecc7 36%, #8be0cc 50%, #29b6c4 66%, #4fd7d1 100%)',
    backgrounds: {
      day: '#eef8f4',
      sunset: '#fbe9dd',
      night: '#172b3a',
    },
    bounds: { kind: 'circle', center: [0, 0.1], radius: 5.7 },
    obstacles: [
      // A tiny palm-ringed lagoon
      { center: [1.9, 1.7], radius: 0.8 },
      // Beach boulders
      { center: [-3.9, -2.7], radius: 0.55 },
      { center: [4.4, -2.1], radius: 0.5 },
    ],
    spawnSlots: [
      [-1.0, -1.8],
      [1.2, -2.5],
      [3.0, -0.6],
      [-2.9, 0.5],
      [-0.5, 0.8],
      [1.2, 3.3],
      [-2.2, 3.3],
      [3.8, 1.8],
      [-3.4, -0.4],
      [0.0, 4.0],
      [-1.6, -4.2],
      [4.1, 3.4],
    ],
  },
};

export const SCENE_ORDER: SceneTheme[] = ['meadow', 'desert', 'island'];

export function getSpawnPosition(theme: SceneTheme, index: number): Vec2 {
  const slots = SCENE_CONFIGS[theme].spawnSlots;
  return slots[index % slots.length];
}

/** Keeps dragged sheep on the land / inside the current diorama. */
export function clampToScene(theme: SceneTheme, x: number, z: number): Vec2 {
  const cfg = SCENE_CONFIGS[theme];
  let nextX = x;
  let nextZ = z;

  if (cfg.bounds.kind === 'rect') {
    nextX = Math.max(cfg.bounds.minX, Math.min(cfg.bounds.maxX, nextX));
    nextZ = Math.max(cfg.bounds.minZ, Math.min(cfg.bounds.maxZ, nextZ));
  } else {
    const [cx, cz] = cfg.bounds.center;
    const dx = nextX - cx;
    const dz = nextZ - cz;
    const dist = Math.hypot(dx, dz);
    if (dist > cfg.bounds.radius) {
      nextX = cx + (dx / dist) * cfg.bounds.radius;
      nextZ = cz + (dz / dist) * cfg.bounds.radius;
    }
  }

  // Nudge dropped sheep out of ponds and boulders.
  cfg.obstacles.forEach((obstacle) => {
    const dx = nextX - obstacle.center[0];
    const dz = nextZ - obstacle.center[1];
    const dist = Math.hypot(dx, dz);
    const safeRadius = obstacle.radius + 0.35;
    if (dist < safeRadius) {
      const nx = dist === 0 ? 1 : dx / dist;
      const nz = dist === 0 ? 0 : dz / dist;
      nextX = obstacle.center[0] + nx * safeRadius;
      nextZ = obstacle.center[1] + nz * safeRadius;
    }
  });

  return [nextX, nextZ];
}
