import React from 'react';
import { SceneTheme } from '../types';
import { SCENE_CONFIGS, SCENE_ORDER } from '../scenes';
import { Layers, Check } from 'lucide-react';

interface SceneSwitcherProps {
  current: SceneTheme;
  onChange: (theme: SceneTheme) => void;
}

export const SceneSwitcher: React.FC<SceneSwitcherProps> = ({ current, onChange }) => {
  return (
    <aside className="absolute left-2.5 right-2.5 top-[118px] sm:left-4 sm:right-auto sm:top-[88px] z-30 pointer-events-auto">
      <div className="bg-white/92 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/80 p-1.5 sm:p-2.5">
        <div className="hidden sm:flex items-center justify-between px-1 pb-1.5">
          <span className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
            <Layers className="w-3 h-3 text-emerald-600" />
            <span>Landscape</span>
          </span>
          <span className="text-[10px] font-medium text-gray-400">场景</span>
        </div>

        <div className="grid grid-cols-3 gap-1 sm:flex sm:flex-col sm:gap-1">
          {SCENE_ORDER.map((id) => {
            const config = SCENE_CONFIGS[id];
            const active = current === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                aria-pressed={active}
                className={`group relative flex flex-col sm:flex-row items-center sm:space-x-2 rounded-xl px-1 py-1.5 sm:px-2 sm:py-2 transition-all text-left ${
                  active
                    ? 'bg-gray-50 ring-1 ring-gray-900/10 shadow-xs'
                    : 'hover:bg-gray-50/80'
                }`}
                title={`${config.nameZh} · ${config.name}`}
              >
                <span
                  className={`relative h-7 w-full sm:h-9 sm:w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/5 transition-transform ${
                    active ? 'scale-100' : 'group-hover:scale-105'
                  }`}
                  style={{ background: config.swatch }}
                >
                  <span className="absolute inset-x-0 bottom-0 h-1/3 bg-white/10" />
                  <span className="absolute bottom-0.5 right-1 text-[13px] leading-none drop-shadow-sm">
                    {config.emoji}
                  </span>
                  {active && (
                    <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/90 shadow-xs">
                      <Check className="h-2.5 w-2.5 text-gray-900" strokeWidth={3} />
                    </span>
                  )}
                </span>

                <span className="min-w-0 w-full sm:w-auto pr-0 sm:pr-1 text-center sm:text-left">
                  <span
                    className={`block text-[11px] sm:text-xs font-semibold leading-tight ${
                      active ? 'text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {config.nameZh}
                  </span>
                  <span className="block text-[8px] sm:text-[10px] text-gray-400 leading-tight truncate max-w-full sm:max-w-[96px]">
                    {config.name}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden sm:block mt-1.5 px-1.5 pt-1.5 border-t border-gray-100">
          <p className="text-[10px] leading-relaxed text-gray-400">
            {SCENE_CONFIGS[current].tagline}
          </p>
        </div>
      </div>
    </aside>
  );
};
