import React, { useState } from 'react';
import { SheepData, SheepAction, WoolColor } from '../types';
import { ProjectedBoundingBox } from './ThreeCanvas';
import { soundManager } from '../utils/audio';
import {
  RotateCcw,
  RotateCw,
  Copy,
  Trash2,
  Volume2,
  Eye,
  Paintbrush,
  Heart,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SheepSelectionOverlayProps {
  selectedSheep: SheepData | null;
  box: ProjectedBoundingBox | null;
  onUpdateAction: (action: SheepAction) => void;
  onRotate: (deltaAngle: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onChangeColor: (color: WoolColor) => void;
  onToggleFollow: () => void;
  isFollowing: boolean;
}

const WOOL_COLOR_OPTIONS: { id: WoolColor; name: string; bg: string; border: string }[] = [
  { id: 'white', name: 'Cloud White', bg: '#fcfbf7', border: '#e5e7eb' },
  { id: 'cream', name: 'Warm Cream', bg: '#f5ecd8', border: '#fde68a' },
  { id: 'pink', name: 'Sakura Pink', bg: '#fbcfe8', border: '#f472b6' },
  { id: 'lavender', name: 'Soft Purple', bg: '#e9d5ff', border: '#c084fc' },
  { id: 'mint', name: 'Fresh Mint', bg: '#a7f3d0', border: '#34d399' },
  { id: 'golden', name: 'Golden Fleece', bg: '#fef08a', border: '#facc15' },
  { id: 'black', name: 'Midnight Black', bg: '#27272a', border: '#52525b' },
];

export const SheepSelectionOverlay: React.FC<SheepSelectionOverlayProps> = ({
  selectedSheep,
  box,
  onUpdateAction,
  onRotate,
  onDuplicate,
  onDelete,
  onChangeColor,
  onToggleFollow,
  isFollowing,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  if (!selectedSheep || !box) return null;

  const handleActionClick = (action: SheepAction) => {
    onUpdateAction(action);
    if (action === 'jump') {
      soundManager.playJump();
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { x: box.x / window.innerWidth, y: box.y / window.innerHeight },
        colors: ['#86efac', '#fbcfe8', '#fef08a'],
      });
    } else if (action === 'graze') {
      soundManager.playMunch();
    } else if (action === 'walk' || action === 'run') {
      soundManager.playStep();
    } else {
      soundManager.playSelect();
    }
  };

  const handleBaa = () => {
    soundManager.playBaa(selectedSheep.age === 'lamb' ? 1.4 : 1.0);
    confetti({
      particleCount: 15,
      spread: 30,
      origin: { x: box.x / window.innerWidth, y: (box.y - 30) / window.innerHeight },
      colors: ['#60a5fa', '#93c5fd'],
    });
  };

  // Dimensions formatted like the screenshot: 2.12 × 1.69 m · 60 m away
  const widthMeters = (selectedSheep.scale * 2.12 * 0.76).toFixed(2);
  const heightMeters = (selectedSheep.scale * 1.69 * 0.76).toFixed(2);
  const distanceStr = `${box.distance} m away`;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* 1. Crisp Blue Bounding Box */}
      <div
        className="pointer-events-none absolute transition-all duration-75 ease-out"
        style={{
          left: `${box.screenLeft}px`,
          top: `${box.screenTop}px`,
          width: `${box.width}px`,
          height: `${box.height}px`,
        }}
      >
        {/* Blue Outline */}
        <div className="absolute inset-0 border-2 border-[#2563eb] rounded-xs shadow-xs" />

        {/* 4 Corner Control Handles */}
        <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-2 border-[#2563eb] rounded-xs shadow-xs" />
        <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-2 border-[#2563eb] rounded-xs shadow-xs" />
        <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-2 border-[#2563eb] rounded-xs shadow-xs" />
        <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-2 border-[#2563eb] rounded-xs shadow-xs" />

        {/* 2. Blue Dimension & Distance Pill Badge */}
        <div className="absolute -bottom-7 left-0 flex items-center space-x-1.5 bg-[#2563eb] text-white text-[11px] font-medium tracking-wide px-2.5 py-0.5 rounded-md shadow-md whitespace-nowrap">
          <span>{`${widthMeters} × ${heightMeters} m · ${distanceStr}`}</span>
        </div>
      </div>

      {/* 3. Floating Action Island Bar (Positioned below the badge) */}
      <div
        className="pointer-events-auto absolute transition-all duration-75 ease-out flex flex-col items-start"
        style={{
          left: `${Math.max(12, Math.min(window.innerWidth - 596, box.screenLeft - 40))}px`,
          top: `${Math.max(96, Math.min(window.innerHeight - 178, box.screenBottom + 30))}px`,
        }}
      >
        <div className="flex flex-wrap items-center gap-y-1 space-x-0.5 sm:space-x-1 bg-white/95 backdrop-blur-md px-1.5 sm:px-2 py-1.5 rounded-2xl shadow-xl border border-gray-200/90 text-sm select-none max-w-[calc(100vw-32px)]">
          {/* Action: Idle */}
          <button
            onClick={() => handleActionClick('idle')}
            className={`px-3 py-1 rounded-xl font-medium transition-all ${
              selectedSheep.action === 'idle'
                ? 'bg-gray-100 text-gray-900 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Idle
          </button>

          {/* Action: Graze */}
          <button
            onClick={() => handleActionClick('graze')}
            className={`px-3 py-1 rounded-xl font-medium transition-all ${
              selectedSheep.action === 'graze'
                ? 'bg-gray-100 text-gray-900 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Graze
          </button>

          {/* Action: Walk */}
          <button
            onClick={() => handleActionClick('walk')}
            className={`px-3 py-1 rounded-xl font-medium transition-all ${
              selectedSheep.action === 'walk'
                ? 'bg-gray-200/90 text-gray-900 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Walk
          </button>

          {/* Action: Jump */}
          <button
            onClick={() => handleActionClick('jump')}
            className={`px-3 py-1 rounded-xl font-medium transition-all ${
              selectedSheep.action === 'jump'
                ? 'bg-blue-100 text-blue-700 font-semibold shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Jump
          </button>

          {/* More Actions Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
              title="More Actions (Run, Dance, Sleep)"
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown for Run, Dance, Sleep */}
            {showMoreActions && (
              <div className="absolute top-9 left-0 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-1.5 flex flex-col space-y-1 w-28 z-30">
                <button
                  onClick={() => {
                    handleActionClick('run');
                    setShowMoreActions(false);
                  }}
                  className={`px-2.5 py-1 text-left text-xs rounded-lg font-medium ${
                    selectedSheep.action === 'run' ? 'bg-amber-100 text-amber-800' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  🏃 Run
                </button>
                <button
                  onClick={() => {
                    handleActionClick('dance');
                    setShowMoreActions(false);
                  }}
                  className={`px-2.5 py-1 text-left text-xs rounded-lg font-medium ${
                    selectedSheep.action === 'dance' ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  💃 Dance
                </button>
                <button
                  onClick={() => {
                    handleActionClick('sleep');
                    setShowMoreActions(false);
                  }}
                  className={`px-2.5 py-1 text-left text-xs rounded-lg font-medium ${
                    selectedSheep.action === 'sleep' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  😴 Sleep
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200 mx-1" />

          {/* Rotate Counter-Clockwise ↺ */}
          <button
            onClick={() => onRotate(-Math.PI / 4)}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Rotate Left (↺)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Rotate Clockwise ↻ */}
          <button
            onClick={() => onRotate(Math.PI / 4)}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Rotate Right (↻)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Duplicate ⧉ */}
          <button
            onClick={onDuplicate}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Duplicate Sheep (⧉)"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Delete 🗑 */}
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Sheep (🗑)"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200 mx-1" />

          {/* Baaa Bleat Button 🔊 */}
          <button
            onClick={handleBaa}
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
            title="Bleat Baaa~ (🔊)"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Color Dye Wool Palette 🎨 */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors flex items-center"
              title="Dye Wool Color (🎨)"
            >
              <Paintbrush className="w-4 h-4" />
            </button>

            {/* Color Palette Popover */}
            {showColorPicker && (
              <div className="absolute top-9 left-0 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-2 flex items-center space-x-1.5 z-30">
                {WOOL_COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      onChangeColor(col.id);
                      setShowColorPicker(false);
                      soundManager.playBell();
                    }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      selectedSheep.woolColor === col.id ? 'ring-2 ring-blue-500 ring-offset-1 scale-110' : ''
                    }`}
                    style={{ backgroundColor: col.bg, borderColor: col.border }}
                    title={col.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Follow Camera Toggle */}
          <button
            onClick={onToggleFollow}
            className={`p-1.5 rounded-lg transition-colors ${
              isFollowing
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Follow this sheep with camera (👁)"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Small Sheep Name & Personality Tag */}
        <div className="mt-1.5 ml-1 flex items-center space-x-1 text-[11px] text-gray-600 font-medium bg-white/75 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/60 shadow-xs">
          <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
          <span>{selectedSheep.name}</span>
          <span>·</span>
          <span>{selectedSheep.personality}</span>
        </div>
      </div>
    </div>
  );
};
