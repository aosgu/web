import React, { useState } from 'react';
import { TimeOfDay, WeatherEffect } from '../types';
import { soundManager } from '../utils/audio';
import {
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  Plus,
  RefreshCw,
  Heart,
  HelpCircle,
} from 'lucide-react';

interface HeaderControlsProps {
  sheepCount: number;
  sceneName: string;
  sceneNameZh: string;
  sceneEmoji: string;
  timeOfDay: TimeOfDay;
  onTimeChange: (time: TimeOfDay) => void;
  weather: WeatherEffect;
  onWeatherChange: (weather: WeatherEffect) => void;
  onAddSheep: () => void;
  onResetFlock: () => void;
  onResetCamera: () => void;
  onTopDownCamera: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  sheepCount,
  sceneName,
  sceneNameZh,
  sceneEmoji,
  timeOfDay,
  onTimeChange,
  weather,
  onWeatherChange,
  onAddSheep,
  onResetFlock,
  onResetCamera,
  onTopDownCamera,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [showHelp, setShowHelp] = useState(false);

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      {/* Top Floating Glass Navigation Bar */}
      <header className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-30 pointer-events-none flex flex-wrap items-start justify-between gap-2">
        {/* Left: Branding & Status */}
        <div className="pointer-events-auto flex items-center space-x-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-gray-200/80">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-lg">
            {sceneEmoji}
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight flex items-center space-x-1.5">
              <span>{sceneName}</span>
              <span className="hidden sm:inline text-xs font-normal text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/60">
                {sceneNameZh}
              </span>
            </h1>
            <p className="text-[11px] text-gray-500 flex items-center space-x-1.5">
              <span>Flock: {sheepCount} sheep</span>
              <span>·</span>
              <span className="flex items-center text-pink-500 font-medium">
                <Heart className="w-3 h-3 fill-pink-400 mr-0.5" /> 100% Cozy
              </span>
            </p>
          </div>
        </div>

        {/* Right: Quick Tools & Controls */}
        <div className="pointer-events-auto flex items-center space-x-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-gray-200/80 text-xs">
          {/* Add Sheep Button */}
          <button
            onClick={onAddSheep}
            className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Spawn a new sheep in the meadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Sheep</span>
          </button>

          {/* Time of Day Switcher */}
          <div className="hidden sm:flex items-center bg-gray-100 p-0.5 rounded-xl">
            <button
              onClick={() => onTimeChange('day')}
              className={`p-1.5 rounded-lg transition-colors ${
                timeOfDay === 'day' ? 'bg-white shadow-xs text-amber-500' : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Sunny Day"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onTimeChange('sunset')}
              className={`p-1.5 rounded-lg transition-colors ${
                timeOfDay === 'sunset' ? 'bg-white shadow-xs text-orange-500' : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Golden Sunset"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onTimeChange('night')}
              className={`p-1.5 rounded-lg transition-colors ${
                timeOfDay === 'night' ? 'bg-white shadow-xs text-indigo-500' : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Peaceful Night"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Weather Effect Selector */}
          <div className="hidden md:flex items-center bg-gray-100 p-0.5 rounded-xl">
            <button
              onClick={() => onWeatherChange(weather === 'clear' ? 'petals' : weather === 'petals' ? 'dandelion' : weather === 'dandelion' ? 'fireflies' : 'clear')}
              className={`p-1.5 rounded-lg transition-colors flex items-center space-x-1 ${
                weather !== 'clear' ? 'bg-white shadow-xs text-pink-500' : 'text-gray-500 hover:text-gray-800'
              }`}
              title={`Weather: ${weather.toUpperCase()}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Camera View Switcher */}
          <div className="hidden sm:flex items-center bg-gray-100 p-0.5 rounded-xl">
            <button
              onClick={onResetCamera}
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
              title="Reset to Isometric Reference View"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onTopDownCamera}
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
              title="Top-Down Plan View"
            >
              <span className="text-[10px] font-bold px-0.5">2D</span>
            </button>
          </div>

          {/* Reset Flock */}
          <button
            onClick={onResetFlock}
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            title="Reset Meadow Flock to Default"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-xl transition-colors ${
              isMuted ? 'text-gray-400 hover:text-gray-600' : 'text-blue-600 hover:bg-blue-50'
            }`}
            title={isMuted ? 'Unmute Nature & Sheep Audio' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Help Button */}
          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            title="Interactive Guide & Controls"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Help & Guide Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌿</span>
                <h3 className="font-bold text-gray-800 text-lg">Meadow Interaction Guide</h3>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-gray-600 leading-relaxed">
              <div className="flex items-start space-x-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-base">🐑</span>
                <div>
                  <p className="font-semibold text-gray-800">Select & Command Sheep</p>
                  <p>Click on any sheep to open the interactive action toolbar (Idle, Graze, Walk, Jump, Run, Dance, Sleep, Rotate, Dye Wool, Baaa bleat).</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                <span className="text-base">🖐️</span>
                <div>
                  <p className="font-semibold text-gray-800">Pick Up & Drag</p>
                  <p>Click and hold any sheep to lift it up into the air with kicking legs, then drop it anywhere on the grass or paths!</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                <span className="text-base">🌍</span>
                <div>
                  <p className="font-semibold text-gray-800">Switch Landscapes · 切换场景</p>
                  <p>Use the Landscape panel to travel between the classic meadow, the desert oasis and the tropical isle. Your flock comes along and safely settles into its new home.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 bg-sky-50/60 p-2.5 rounded-xl border border-sky-100">
                <span className="text-base">🍀</span>
                <div>
                  <p className="font-semibold text-gray-800">Clear the Selection</p>
                  <p>Click any blank part of the landscape or press <kbd className="px-1 py-0.5 rounded bg-white border border-gray-200 text-[10px]">Esc</kbd> to dismiss the selection box and action menu.</p>
                </div>
              </div>

              <div className="flex items-start space-x-2 bg-purple-50/60 p-2.5 rounded-xl border border-purple-100">
                <span className="text-base">🎥</span>
                <div>
                  <p className="font-semibold text-gray-800">3D Camera Controls</p>
                  <p>Left-click and drag the background to orbit. Scroll wheel to zoom in/out. Double-click any sheep to make it jump!</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-xs transition-colors"
              >
                Got it, let&apos;s play!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
