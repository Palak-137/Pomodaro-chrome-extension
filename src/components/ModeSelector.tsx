import React from 'react';
import type { Timermode } from '../types';

interface ModeSelectorProps {
  mode: Timermode;
  onSelectMode: (mode: Timermode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onSelectMode }) => {
  const modes: { key: Timermode; label: string; activeClass: string }[] = [
    {
      key: 'pomodoro',
      label: 'Pomodoro',
      activeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      key: 'shortBreak',
      label: 'Short Break',
      activeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    },
    {
      key: 'longBreak',
      label: 'Long Break',
      activeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
  ];

  return (
    <div className="flex items-center bg-neutral-900/90 p-1.5 rounded-2xl gap-1 border border-neutral-800 backdrop-blur-md shadow-inner">
      {modes.map((m) => {
        const isActive = mode === m.key;
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => onSelectMode(m.key)}
            className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 border cursor-pointer ${
              isActive
                ? `${m.activeClass} shadow-md`
                : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
            }`}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
};
