import React from 'react';
import type { Timermode, TimerStatus } from '../types';

interface ToonSceneProps {
  mode: Timermode;
  status: TimerStatus;
}

export const ToonScene: React.FC<ToonSceneProps> = ({ mode, status }) => {
  const isRunning = status === 'running';

  const imageMap: Record<Timermode, { src: string; alt: string }> = {
    pomodoro: {
      src: '/assets/toon-work.jpg',
      alt: 'Chibi girl working on laptop',
    },
    shortBreak: {
      src: '/assets/toon-drink.jpg',
      alt: 'Chibi girl drinking cold water',
    },
    longBreak: {
      src: '/assets/toon-sleep.jpg',
      alt: 'Chibi girl sleeping with chick plushie',
    },
  };

  const currentImage = imageMap[mode];

  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center select-none">
      {/* Container with circular crop and subtle shadow */}
      <div
        className={`relative w-full h-full rounded-full overflow-hidden border-4 transition-all duration-500 shadow-xl ${
          mode === 'pomodoro'
            ? 'border-rose-400/40 shadow-rose-950/40'
            : mode === 'shortBreak'
            ? 'border-teal-400/40 shadow-teal-950/40'
            : 'border-indigo-400/40 shadow-indigo-950/40'
        } ${
          isRunning
            ? mode === 'pomodoro'
              ? 'anim-head-bob'
              : mode === 'shortBreak'
              ? 'anim-drink-sip'
              : 'anim-sleep-breath'
            : ''
        }`}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="w-full h-full object-cover transform scale-105"
          draggable={false}
        />

        {/* Ambient Mode Overlay Glow */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            mode === 'pomodoro'
              ? 'bg-rose-500/10'
              : mode === 'shortBreak'
              ? 'bg-teal-500/10'
              : 'bg-indigo-500/10'
          }`}
        />
      </div>

      {/* Floating Animated Overlay Effects */}
      {isRunning && mode === 'longBreak' && (
        <div className="absolute -top-3 -right-2 pointer-events-none flex flex-col items-center">
          <span className="anim-zzz-1 text-sm font-bold text-indigo-300 font-mono drop-shadow">
            Z
          </span>
          <span className="anim-zzz-2 text-base font-bold text-indigo-400 font-mono drop-shadow -mt-1">
            z
          </span>
          <span className="anim-zzz-3 text-lg font-bold text-indigo-500 font-mono drop-shadow -mt-1">
            z
          </span>
        </div>
      )}

      {isRunning && mode === 'shortBreak' && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          <span className="anim-bubble-1 absolute top-4 left-6 text-sm">💧</span>
          <span className="anim-bubble-2 absolute top-2 right-8 text-base">✨</span>
          <span className="anim-bubble-3 absolute top-8 right-4 text-xs">🫧</span>
        </div>
      )}

      {isRunning && mode === 'pomodoro' && (
        <div className="absolute -top-1 right-6 pointer-events-none">
          <span className="anim-steam-1 absolute -top-1 left-0 text-xs">☕</span>
          <span className="anim-steam-2 absolute -top-3 left-3 text-xs opacity-75">✨</span>
        </div>
      )}

      {/* Paused Indicator Badge */}
      {status === 'paused' && (
        <div className="absolute bottom-2 bg-neutral-900/90 text-neutral-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-neutral-700 shadow-md">
          Paused
        </div>
      )}
    </div>
  );
};
