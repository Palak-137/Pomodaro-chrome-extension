import React from 'react';
import { Sliders } from 'lucide-react';
import type { Timermode, TimerStatus } from '../types';
import { ToonScene } from './ToonScene';

interface TimerDisplayProps {
  timeLeft: number;
  progress: number;
  mode: Timermode;
  status: TimerStatus;
  cycleCount: number;
  longBreakInterval: number;
  onOpenSettings?: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  progress,
  mode,
  status,
  cycleCount,
  longBreakInterval,
  onOpenSettings,
}) => {
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const radius = 142;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(1, Math.max(0, progress)));

  const modeConfig: Record<
    Timermode,
    { ringColor: string; glowColor: string; label: string }
  > = {
    pomodoro: {
      ringColor: 'stroke-rose-500',
      glowColor: 'drop-shadow-[0_0_24px_rgba(244,63,94,0.35)]',
      label: `Focusing • Round #${(cycleCount % longBreakInterval) + 1} of ${longBreakInterval}`,
    },
    shortBreak: {
      ringColor: 'stroke-teal-400',
      glowColor: 'drop-shadow-[0_0_24px_rgba(45,212,191,0.35)]',
      label: 'Hydrate & Relax',
    },
    longBreak: {
      ringColor: 'stroke-indigo-400',
      glowColor: 'drop-shadow-[0_0_24px_rgba(129,140,248,0.35)]',
      label: 'Deep Rest & Sleep',
    },
  };

  const current = modeConfig[mode];

  return (
    <div className="relative flex flex-col items-center justify-center my-3 select-none">
      <div
        className={`relative w-76 h-76 sm:w-80 sm:h-80 flex items-center justify-center transition-all duration-700 ${current.glowColor}`}
      >
        {/* Circular Progress Ring */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 310 310">
          {/* Background Track */}
          <circle
            cx="155"
            cy="155"
            r={radius}
            className="stroke-neutral-800/80"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Progress Indicator */}
          <circle
            cx="155"
            cy="155"
            r={radius}
            className={`transition-all duration-300 ease-linear ${current.ringColor}`}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Central Display: Animated Toon Scene + Countdown */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          {/* Animated Toon Character */}
          <div className="scale-85 sm:scale-95 -mt-3 transform transition-transform duration-300 pointer-events-none">
            <ToonScene mode={mode} status={status} />
          </div>

          {/* Clickable Countdown Numbers to Edit Timing */}
          <button
            type="button"
            onClick={onOpenSettings}
            title="Click to edit timer duration"
            className="group flex flex-col items-center justify-center text-center -mt-2 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white tabular-nums drop-shadow-md group-hover:text-rose-300 transition-colors">
                {minutes}:{seconds}
              </span>
              <Sliders size={16} className="text-neutral-500 group-hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <span className="mt-1 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-900/90 border border-neutral-800 group-hover:border-neutral-600 transition-colors">
              {current.label}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
