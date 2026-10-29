export type SheepAction = 'idle' | 'graze' | 'walk' | 'jump' | 'run' | 'dance' | 'sleep';

export type WoolColor = 'white' | 'cream' | 'pink' | 'lavender' | 'mint' | 'golden' | 'black';

export interface SheepData {
  id: string;
  name: string;
  position: [number, number, number]; // [x, y, z] in 3D world
  rotation: number; // yaw angle in radians
  targetPosition?: [number, number, number];
  action: SheepAction;
  woolColor: WoolColor;
  scale: number;
  speed: number;
  actionTimer: number; // seconds remaining in current action
  isHeld?: boolean; // being dragged by user
  age: 'lamb' | 'adult';
  personality: string;
  favoriteFood: string;
}

export type TimeOfDay = 'day' | 'sunset' | 'night';
export type WeatherEffect = 'clear' | 'petals' | 'dandelion' | 'fireflies';
export type SceneTheme = 'meadow' | 'desert' | 'island';
