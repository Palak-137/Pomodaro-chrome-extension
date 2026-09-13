import React, { useState } from 'react';
import { X, Volume2, VolumeX, RotateCcw, Plus, Minus } from 'lucide-react';
import type { PomodoroSettings } from '../types';
import { DEFAULT_SETTINGS } from '../hooks/useTimer';
import { audioService } from '../services/audioService';

interface SettingsModalProps {
  settings: PomodoroSettings;
  onSave: (newSettings: PomodoroSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  // String state allows free backspacing and typing without premature coercion
  const [focusInput, setFocusInput] = useState(String(settings.focusTime));
  const [shortBreakInput, setShortBreakInput] = useState(String(settings.shortBreakTime));
  const [longBreakInput, setLongBreakInput] = useState(String(settings.longBreakTime));
  const [longBreakInterval, setLongBreakInterval] = useState(settings.longBreakInterval);
  const [autoStartBreaks, setAutoStartBreaks] = useState(settings.autoStartBreaks);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(settings.autoStartPomodoros);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [volume, setVolume] = useState(settings.volume);

  const stepValue = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    delta: number,
    min: number,
    max: number
  ) => {
    setter((prev) => {
      const current = parseInt(prev) || min;
      const next = Math.max(min, Math.min(max, current + delta));
      return String(next);
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSettings: PomodoroSettings = {
      focusTime: Math.max(1, Math.min(180, parseInt(focusInput) || 25)),
      shortBreakTime: Math.max(1, Math.min(60, parseInt(shortBreakInput) || 5)),
      longBreakTime: Math.max(1, Math.min(90, parseInt(longBreakInput) || 15)),
      longBreakInterval: Math.max(1, Math.min(12, longBreakInterval)),
      autoStartBreaks,
      autoStartPomodoros,
      soundEnabled,
      volume,
    };
    onSave(cleanSettings);
    onClose();
  };

  const handleResetDefaults = () => {
    setFocusInput(String(DEFAULT_SETTINGS.focusTime));
    setShortBreakInput(String(DEFAULT_SETTINGS.shortBreakTime));
    setLongBreakInput(String(DEFAULT_SETTINGS.longBreakTime));
    setLongBreakInterval(DEFAULT_SETTINGS.longBreakInterval);
    setAutoStartBreaks(DEFAULT_SETTINGS.autoStartBreaks);
    setAutoStartPomodoros(DEFAULT_SETTINGS.autoStartPomodoros);
    setSoundEnabled(DEFAULT_SETTINGS.soundEnabled);
    setVolume(DEFAULT_SETTINGS.volume);
  };

  const handleTestAudio = () => {
    if (soundEnabled) {
      audioService.playChime(volume);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-800">
          <div>
            <h2 className="text-base font-bold tracking-tight">Edit Timer Durations</h2>
            <p className="text-[11px] text-neutral-400">Set minutes or tap quick presets</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Phase 1: Focus */}
          <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-400">🍅 Focus Duration</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => stepValue(setFocusInput, -5, 1, 180)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
                >
                  <Minus size={13} />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={focusInput}
                  onChange={(e) => setFocusInput(e.target.value.replace(/\D/g, ''))}
                  className="w-12 bg-neutral-900 border border-neutral-700/80 rounded-lg py-1 text-center text-sm font-bold font-mono text-rose-400 focus:outline-none focus:border-rose-500"
                />
                <span className="text-[11px] text-neutral-400 font-mono">m</span>
                <button
                  type="button"
                  onClick={() => stepValue(setFocusInput, 5, 1, 180)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
            {/* Presets */}
            <div className="flex gap-1.5">
              {[15, 20, 25, 45, 50, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setFocusInput(String(mins))}
                  className={`flex-1 text-[11px] py-1 rounded-lg font-mono transition-all cursor-pointer ${
                    focusInput === String(mins)
                      ? 'bg-rose-500 text-white font-bold shadow-sm'
                      : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Phase 2: Short Break */}
          <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-teal-400">💧 Short Break</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => stepValue(setShortBreakInput, -1, 1, 60)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
                >
                  <Minus size={13} />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={shortBreakInput}
                  onChange={(e) => setShortBreakInput(e.target.value.replace(/\D/g, ''))}
                  className="w-12 bg-neutral-900 border border-neutral-700/80 rounded-lg py-1 text-center text-sm font-bold font-mono text-teal-400 focus:outline-none focus:border-teal-500"
                />
                <span className="text-[11px] text-neutral-400 font-mono">m</span>
                <button
                  type="button"
                  onClick={() => stepValue(setShortBreakInput, 1, 1, 60)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
            {/* Presets */}
            <div className="flex gap-1.5">
              {[3, 5, 10, 15].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setShortBreakInput(String(mins))}
                  className={`flex-1 text-[11px] py-1 rounded-lg font-mono transition-all cursor-pointer ${
                    shortBreakInput === String(mins)
                      ? 'bg-teal-500 text-white font-bold shadow-sm'
                      : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Phase 3: Long Break */}
          <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800/90">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-indigo-400">💤 Long Break</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => stepValue(setLongBreakInput, -5, 1, 90)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
                >
                  <Minus size={13} />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={longBreakInput}
                  onChange={(e) => setLongBreakInput(e.target.value.replace(/\D/g, ''))}
                  className="w-12 bg-neutral-900 border border-neutral-700/80 rounded-lg py-1 text-center text-sm font-bold font-mono text-indigo-400 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[11px] text-neutral-400 font-mono">m</span>
                <button
                  type="button"
                  onClick={() => stepValue(setLongBreakInput, 5, 1, 90)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
            {/* Presets */}
            <div className="flex gap-1.5">
              {[10, 15, 20, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setLongBreakInput(String(mins))}
                  className={`flex-1 text-[11px] py-1 rounded-lg font-mono transition-all cursor-pointer ${
                    longBreakInput === String(mins)
                      ? 'bg-indigo-500 text-white font-bold shadow-sm'
                      : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Long Break Interval */}
          <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-2xl border border-neutral-800/90">
            <div>
              <p className="text-xs font-medium text-white">Long Break Interval</p>
              <p className="text-[10px] text-neutral-400">Rounds before long break</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLongBreakInterval((prev) => Math.max(1, prev - 1))}
                className="w-6 h-6 flex items-center justify-center rounded bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
              >
                <Minus size={11} />
              </button>
              <span className="w-7 text-center font-mono font-bold text-xs text-rose-400">
                {longBreakInterval}
              </span>
              <button
                type="button"
                onClick={() => setLongBreakInterval((prev) => Math.min(12, prev + 1))}
                className="w-6 h-6 flex items-center justify-center rounded bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
              >
                <Plus size={11} />
              </button>
            </div>
          </div>

          {/* Audio Chime Test */}
          <div className="flex items-center justify-between p-3 bg-neutral-950 rounded-2xl border border-neutral-800/90">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundEnabled((prev) => !prev)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                {soundEnabled ? <Volume2 size={16} className="text-rose-400" /> : <VolumeX size={16} />}
              </button>
              <span className="text-xs font-medium">Sound Chimes</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                disabled={!soundEnabled}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 accent-rose-500 cursor-pointer disabled:opacity-30"
              />
              <button
                type="button"
                onClick={handleTestAudio}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
              >
                Test
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/90">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors cursor-pointer shadow-md shadow-rose-500/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
