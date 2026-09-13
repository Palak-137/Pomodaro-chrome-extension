import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import type { TimerStatus, Timermode } from '../types';
import { audioService } from '../services/audioService';

interface TimerControlsProps {
  status: TimerStatus;
  mode: Timermode;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  status,
  mode,
  onToggle,
  onReset,
  onSkip,
}) => {
  const isRunning = status === 'running';

  const modeTheme: Record<Timermode, { buttonBg: string; hoverBg: string }> = {
    pomodoro: {
      buttonBg: 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20',
      hoverBg: 'hover:bg-rose-500/10 hover:text-rose-400',
    },
    shortBreak: {
      buttonBg: 'bg-teal-500 hover:bg-teal-400 text-white shadow-teal-500/20',
      hoverBg: 'hover:bg-teal-500/10 hover:text-teal-400',
    },
    longBreak: {
      buttonBg: 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/20',
      hoverBg: 'hover:bg-indigo-500/10 hover:text-indigo-400',
    },
  };

  const handleAction = (cb: () => void) => {
    audioService.playClick();
    cb();
  };

  return (
    <div className="flex items-center gap-5 my-2">
      {/* Reset Button */}
      <button
        type="button"
        onClick={() => handleAction(onReset)}
        title="Reset Session"
        className={`p-3.5 text-neutral-400 bg-neutral-900/80 border border-neutral-800 rounded-full transition-all duration-200 cursor-pointer ${modeTheme[mode].hoverBg} hover:scale-105 active:scale-95`}
      >
        <RotateCcw size={20} />
      </button>

      {/* Main Play/Pause Button */}
      <button
        type="button"
        onClick={() => handleAction(onToggle)}
        title={isRunning ? 'Pause (Space)' : 'Start (Space)'}
        className={`px-10 py-4 font-bold rounded-2xl flex items-center gap-3 text-lg shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ${modeTheme[mode].buttonBg}`}
      >
        {isRunning ? (
          <>
            <Pause size={22} className="fill-current" />
            <span className="tracking-wide">PAUSE</span>
          </>
        ) : (
          <>
            <Play size={22} className="fill-current ml-0.5" />
            <span className="tracking-wide">START</span>
          </>
        )}
      </button>

      {/* Skip Button */}
      <button
        type="button"
        onClick={() => handleAction(onSkip)}
        title="Skip to Next Stage"
        className={`p-3.5 text-neutral-400 bg-neutral-900/80 border border-neutral-800 rounded-full transition-all duration-200 cursor-pointer ${modeTheme[mode].hoverBg} hover:scale-105 active:scale-95`}
      >
        <SkipForward size={20} />
      </button>
    </div>
  );
};
