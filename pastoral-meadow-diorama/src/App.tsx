import React, { useState, useCallback } from 'react';
import { SheepData, SheepAction, WoolColor, TimeOfDay, WeatherEffect, SceneTheme } from './types';
import { ThreeCanvas, ProjectedBoundingBox } from './components/ThreeCanvas';
import { SheepSelectionOverlay } from './components/SheepSelectionOverlay';
import { HeaderControls } from './components/HeaderControls';
import { SceneSwitcher } from './components/SceneSwitcher';
import { SCENE_CONFIGS, getSpawnPosition, clampToScene } from './scenes';
import { soundManager } from './utils/audio';
import confetti from 'canvas-confetti';

const INITIAL_FLOCK: SheepData[] = [
  {
    id: 'sheep-1',
    name: 'Cloudy (朵朵)',
    position: [-2.2, 0, -2.5],
    rotation: 1.4,
    action: 'walk',
    woolColor: 'white',
    scale: 1.0,
    speed: 1.1,
    actionTimer: 6,
    age: 'adult',
    personality: 'Adventurous Explorer',
    favoriteFood: 'Sweet Clover',
  },
  {
    id: 'sheep-2',
    name: 'Marshmallow (棉花糖)',
    position: [0.2, 0, -3.2],
    rotation: 1.2,
    action: 'idle',
    woolColor: 'white',
    scale: 1.05,
    speed: 1.0,
    actionTimer: 4,
    age: 'adult',
    personality: 'Gentle Daydreamer',
    favoriteFood: 'Wild Chamomile',
  },
  {
    id: 'sheep-3',
    name: 'Cotton (小棉球)',
    position: [2.2, 0, -4.8],
    rotation: 2.1,
    action: 'graze',
    woolColor: 'white',
    scale: 0.95,
    speed: 1.2,
    actionTimer: 5,
    age: 'adult',
    personality: 'Trail Pathfinder',
    favoriteFood: 'Tender Green Sprouts',
  },
  {
    id: 'sheep-4',
    name: 'Mochi (糯米糍)',
    position: [-0.2, 0, -0.8],
    rotation: -1.8,
    action: 'idle',
    woolColor: 'white',
    scale: 0.85,
    speed: 1.1,
    actionTimer: 3,
    age: 'lamb',
    personality: 'Playful Little Lamb',
    favoriteFood: 'Morning Dew Drops',
  },
  {
    id: 'sheep-5',
    name: 'Snowball (雪球)',
    position: [4.8, 0, -1.8],
    rotation: -1.2,
    action: 'walk',
    woolColor: 'white',
    scale: 1.08,
    speed: 1.05,
    actionTimer: 8,
    age: 'adult',
    personality: 'Friendly Flock Leader',
    favoriteFood: 'Golden Hay',
  },
  {
    id: 'sheep-6',
    name: 'Buttercup (小黄花)',
    position: [0.8, 0, 1.2],
    rotation: 0.3,
    action: 'graze',
    woolColor: 'white',
    scale: 0.98,
    speed: 0.95,
    actionTimer: 7,
    age: 'adult',
    personality: 'Peaceful Foodie',
    favoriteFood: 'Golden Dandelions',
  },
  {
    id: 'sheep-7',
    name: 'Biscuit (小饼干)',
    position: [-2.5, 0, 2.0],
    rotation: -0.6,
    action: 'walk',
    woolColor: 'white',
    scale: 0.82,
    speed: 1.3,
    actionTimer: 5,
    age: 'lamb',
    personality: 'Energetic Hopper',
    favoriteFood: 'Pink Blossom Petals',
  },
  {
    id: 'sheep-8',
    name: 'Boba (波霸)',
    position: [0.2, 0, 4.2],
    rotation: -2.4,
    action: 'graze',
    woolColor: 'white',
    scale: 1.02,
    speed: 1.0,
    actionTimer: 4,
    age: 'adult',
    personality: 'Curious Sniffer',
    favoriteFood: 'Juicy Meadow Apples',
  },
  {
    id: 'sheep-9',
    name: 'Pudding (布丁)',
    position: [1.8, 0, 3.2],
    rotation: 0.8,
    action: 'idle',
    woolColor: 'white',
    scale: 0.92,
    speed: 1.05,
    actionTimer: 6,
    age: 'adult',
    personality: 'Sunny Meadow Napper',
    favoriteFood: 'Crisp Wheat Grains',
  },
];

export const App: React.FC = () => {
  const [sheepList, setSheepList] = useState<SheepData[]>(INITIAL_FLOCK);
  const [selectedSheepId, setSelectedSheepId] = useState<string | null>('sheep-1'); // Default select sheep 1 matching screenshot
  const [hoveredSheepId, setHoveredSheepId] = useState<string | null>(null);
  const [projectedBox, setProjectedBox] = useState<ProjectedBoundingBox | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [weather, setWeather] = useState<WeatherEffect>('clear');
  const [sceneTheme, setSceneTheme] = useState<SceneTheme>('meadow');
  const [cameraPreset, setCameraPreset] = useState<'isometric' | 'topdown' | 'follow' | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Update specific sheep attributes
  const handleUpdateSheep = useCallback((id: string, updates: Partial<SheepData>) => {
    setSheepList((prev) =>
      prev.map((sheep) => (sheep.id === id ? { ...sheep, ...updates } : sheep))
    );
  }, []);

  // Swap landscapes while keeping the same flock, names and wool colors.
  const handleSceneChange = useCallback((nextTheme: SceneTheme) => {
    if (nextTheme === sceneTheme) return;
    setSceneTheme(nextTheme);
    setCameraPreset('isometric');
    setIsFollowing(false);
    setProjectedBox(null);

    setSheepList((prev) =>
      prev.map((sheep, index) => {
        const [x, z] = getSpawnPosition(nextTheme, index);
        return {
          ...sheep,
          position: [x, 0, z] as [number, number, number],
          rotation: index * 0.8 + Math.random() * 0.7,
          isHeld: false,
          action: index % 4 === 0 ? 'walk' : index % 4 === 1 ? 'idle' : 'graze',
          actionTimer: 3 + (index % 3),
        };
      })
    );

    soundManager.playBell();
  }, [sceneTheme]);

  const selectedSheep = sheepList.find((s) => s.id === selectedSheepId) || null;

  // Change action of selected sheep
  const handleUpdateAction = (action: SheepAction) => {
    if (!selectedSheepId) return;
    handleUpdateSheep(selectedSheepId, { action, actionTimer: 8 });
  };

  // Rotate selected sheep
  const handleRotate = (deltaAngle: number) => {
    if (!selectedSheepId || !selectedSheep) return;
    const newRot = selectedSheep.rotation + deltaAngle;
    handleUpdateSheep(selectedSheepId, { rotation: newRot });
    soundManager.playStep();
  };

  // Duplicate / Spawn mini lamb next to selected sheep
  const handleDuplicate = () => {
    if (!selectedSheep) return;
    const newId = `sheep-${Date.now()}`;
    const [safeX, safeZ] = clampToScene(
      sceneTheme,
      selectedSheep.position[0] + (Math.random() - 0.5) * 1.5,
      selectedSheep.position[2] + (Math.random() - 0.5) * 1.5
    );
    const newPos: [number, number, number] = [safeX, 0, safeZ];
    const newSheep: SheepData = {
      id: newId,
      name: `Baby ${selectedSheep.name.split(' ')[0]}`,
      position: newPos,
      rotation: Math.random() * Math.PI * 2,
      action: 'jump',
      woolColor: selectedSheep.woolColor,
      scale: 0.72,
      speed: 1.25,
      actionTimer: 4,
      age: 'lamb',
      personality: 'Cute Baby Lamb',
      favoriteFood: 'Tender Grass Buds',
    };
    setSheepList((prev) => [...prev, newSheep]);
    setSelectedSheepId(newId);
    soundManager.playBell();

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#a7f3d0', '#fbcfe8', '#fef08a'],
    });
  };

  // Delete selected sheep
  const handleDelete = () => {
    if (!selectedSheepId) return;
    setSheepList((prev) => prev.filter((s) => s.id !== selectedSheepId));
    setSelectedSheepId(null);
    setProjectedBox(null);
    soundManager.playSelect();
  };

  // Change wool color
  const handleChangeColor = (woolColor: WoolColor) => {
    if (!selectedSheepId) return;
    handleUpdateSheep(selectedSheepId, { woolColor });
  };

  // Add new sheep in meadow
  const handleAddSheep = () => {
    const newId = `sheep-${Date.now()}`;
    const names = ['Sunny', 'Peanut', 'Caramel', 'Lily', 'Oreo', 'Cocoa', 'Twinkle', 'Velvet'];
    const chosenName = names[Math.floor(Math.random() * names.length)];
    const colors: WoolColor[] = ['white', 'cream', 'pink', 'lavender', 'mint', 'golden'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    const [safeX, safeZ] = getSpawnPosition(sceneTheme, Math.floor(Math.random() * 12));
    const newSheep: SheepData = {
      id: newId,
      name: `${chosenName}`,
      position: [safeX, 0, safeZ],
      rotation: Math.random() * Math.PI * 2,
      action: 'jump',
      woolColor: chosenColor,
      scale: 0.8 + Math.random() * 0.35,
      speed: 0.95 + Math.random() * 0.35,
      actionTimer: 4,
      age: Math.random() > 0.4 ? 'adult' : 'lamb',
      personality:
        sceneTheme === 'desert'
          ? 'Sunny Dune Wanderer'
          : sceneTheme === 'island'
            ? 'Little Beachcomber'
            : 'Cheerful Meadow Explorer',
      favoriteFood:
        sceneTheme === 'desert'
          ? 'Prickly Pear Blossoms'
          : sceneTheme === 'island'
            ? 'Fresh Coconut Shavings'
            : 'Sweet Clover Petals',
    };

    setSheepList((prev) => [...prev, newSheep]);
    setSelectedSheepId(newId);
    soundManager.playBell();

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { x: 0.5, y: 0.4 },
    });
  };

  // Reset flock to its original attributes, placed safely in the current landscape.
  const handleResetFlock = () => {
    setSheepList(
      INITIAL_FLOCK.map((sheep, index) => {
        const [x, z] = getSpawnPosition(sceneTheme, index);
        return { ...sheep, position: [x, 0, z] as [number, number, number] };
      })
    );
    setSelectedSheepId('sheep-1');
    setCameraPreset('isometric');
    setIsFollowing(false);
    soundManager.playBell();
  };

  // Camera presets
  const handleResetCamera = () => {
    setCameraPreset('isometric');
    setIsFollowing(false);
  };

  const handleTopDownCamera = () => {
    setCameraPreset('topdown');
    setIsFollowing(false);
  };

  const handleToggleFollow = () => {
    if (!isFollowing) {
      setIsFollowing(true);
      setCameraPreset('follow');
    } else {
      setIsFollowing(false);
      setCameraPreset('isometric');
    }
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden font-sans antialiased select-none transition-colors duration-500"
      style={{ backgroundColor: SCENE_CONFIGS[sceneTheme].backgrounds[timeOfDay] }}
    >
      {/* 1. Header Navigation & Quick Tools */}
      <HeaderControls
        sheepCount={sheepList.length}
        sceneName={SCENE_CONFIGS[sceneTheme].name}
        sceneNameZh={SCENE_CONFIGS[sceneTheme].nameZh}
        sceneEmoji={SCENE_CONFIGS[sceneTheme].emoji}
        timeOfDay={timeOfDay}
        onTimeChange={setTimeOfDay}
        weather={weather}
        onWeatherChange={setWeather}
        onAddSheep={handleAddSheep}
        onResetFlock={handleResetFlock}
        onResetCamera={handleResetCamera}
        onTopDownCamera={handleTopDownCamera}
      />

      {/* 2. Landscape gallery: meadow, desert oasis and tropical island */}
      <SceneSwitcher current={sceneTheme} onChange={handleSceneChange} />

      {/* 3. Interactive Three.js 3D Diorama Canvas */}
      <ThreeCanvas
        sheepList={sheepList}
        selectedSheepId={selectedSheepId}
        hoveredSheepId={hoveredSheepId}
        onSelectSheep={setSelectedSheepId}
        onHoverSheep={setHoveredSheepId}
        onUpdateSheep={handleUpdateSheep}
        onBoxCalculated={setProjectedBox}
        timeOfDay={timeOfDay}
        weather={weather}
        theme={sceneTheme}
        cameraPreset={cameraPreset}
        onCameraPresetHandled={() => setCameraPreset(null)}
      />

      {/* 3. Pixel-Perfect Figma/Editor Style Selection Box & Action Island Menu */}
      <SheepSelectionOverlay
        selectedSheep={selectedSheep}
        box={projectedBox}
        onUpdateAction={handleUpdateAction}
        onRotate={handleRotate}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onChangeColor={handleChangeColor}
        onToggleFollow={handleToggleFollow}
        isFollowing={isFollowing}
      />

      {/* 4. Bottom Quick Flock Bar / Selector */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center space-x-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border border-gray-200/80 max-w-[90vw] overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-gray-500 px-1 whitespace-nowrap">Flock:</span>
        {sheepList.map((sheep) => {
          const isSelected = sheep.id === selectedSheepId;
          return (
            <button
              key={sheep.id}
              onClick={() => {
                setSelectedSheepId(sheep.id);
                soundManager.playSelect();
              }}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs scale-105'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span>{sheep.age === 'lamb' ? '🐑' : '🐑'}</span>
              <span>{sheep.name.split(' ')[0]}</span>
              <span className="text-[10px] opacity-75">({sheep.action})</span>
            </button>
          );
        })}
      </footer>

      {/* 5. Subtle Ambient Sound Prompt (Starts ambient on first click if allowed) */}
      <div className="absolute bottom-[66px] right-4 z-20 pointer-events-none hidden xl:block">
        <div className="bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-gray-200/60 text-[11px] text-gray-500 shadow-xs">
          💡 Click blank land to deselect · Drag a sheep to pick it up
        </div>
      </div>
    </div>
  );
};

export default App;
