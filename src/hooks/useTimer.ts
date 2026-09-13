import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { Timermode, TimerStatus, PomodoroSettings, PersistedTimerSession } from '../types';
import { audioService } from '../services/audioService';
import { notificationService } from '../services/notificationService';
import { storageService } from '../services/storageService';

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  volume: 0.7,
};

const SESSION_STORAGE_KEY = 'pomodoro_session';

interface UseTimerOptions {
  settings?: PomodoroSettings;
  onFocusComplete?: () => void;
  onBreakComplete?: () => void;
}

interface InitialTimerState {
  mode: Timermode;
  status: TimerStatus;
  cycleCount: number;
  endTime: number | null;
  activeRemainingTime: number | null;
  completedWhileClosed: boolean;
}

function getInitialTimerState(settings: PomodoroSettings): InitialTimerState {
  const saved = storageService.get<PersistedTimerSession | null>(SESSION_STORAGE_KEY, null);

  if (!saved) {
    return {
      mode: 'pomodoro',
      status: 'idle',
      cycleCount: 0,
      endTime: null,
      activeRemainingTime: null,
      completedWhileClosed: false,
    };
  }

  if (saved.status === 'running' && saved.endTime) {
    const remaining = Math.round((saved.endTime - Date.now()) / 1000);
    if (remaining > 0) {
      return {
        mode: saved.mode,
        status: 'running',
        cycleCount: saved.cycleCount,
        endTime: saved.endTime,
        activeRemainingTime: remaining,
        completedWhileClosed: false,
      };
    } else {
      const isPomodoro = saved.mode === 'pomodoro';
      const nextCycle = saved.cycleCount + (isPomodoro ? 1 : 0);
      const nextMode: Timermode = isPomodoro
        ? nextCycle % settings.longBreakInterval === 0
          ? 'longBreak'
          : 'shortBreak'
        : 'pomodoro';

      storageService.set(SESSION_STORAGE_KEY, {
        status: 'idle',
        mode: nextMode,
        endTime: null,
        activeRemainingTime: null,
        cycleCount: nextCycle,
      });

      return {
        mode: nextMode,
        status: 'idle',
        cycleCount: nextCycle,
        endTime: null,
        activeRemainingTime: null,
        completedWhileClosed: isPomodoro,
      };
    }
  }

  if (saved.status === 'paused') {
    return {
      mode: saved.mode,
      status: 'paused',
      cycleCount: saved.cycleCount,
      endTime: null,
      activeRemainingTime: saved.activeRemainingTime,
      completedWhileClosed: false,
    };
  }

  return {
    mode: saved.mode,
    status: 'idle',
    cycleCount: saved.cycleCount,
    endTime: null,
    activeRemainingTime: null,
    completedWhileClosed: false,
  };
}

export function useTimer({
  settings = DEFAULT_SETTINGS,
  onFocusComplete,
  onBreakComplete,
}: UseTimerOptions = {}) {
  // Initialize state directly from persistent storage
  const [initial] = useState<InitialTimerState>(() => getInitialTimerState(settings));
  const [mode, setMode] = useState<Timermode>(initial.mode);
  const [status, setStatus] = useState<TimerStatus>(initial.status);
  const [cycleCount, setCycleCount] = useState<number>(initial.cycleCount);
  const [activeRemainingTime, setActiveRemainingTime] = useState<number | null>(
    initial.activeRemainingTime
  );

  const endTimeRef = useRef<number | null>(initial.endTime);

  const getDurationForMode = useCallback(
    (m: Timermode) => {
      switch (m) {
        case 'pomodoro':
          return Math.max(1, settings.focusTime) * 60;
        case 'shortBreak':
          return Math.max(1, settings.shortBreakTime) * 60;
        case 'longBreak':
          return Math.max(1, settings.longBreakTime) * 60;
      }
    },
    [settings.focusTime, settings.shortBreakTime, settings.longBreakTime]
  );

  const timeLeft =
    status === 'idle'
      ? getDurationForMode(mode)
      : (activeRemainingTime ?? getDurationForMode(mode));

  // Helper to persist state to storage and background worker
  const persistState = useCallback(
    (
      newStatus: TimerStatus,
      newMode: Timermode,
      newEndTime: number | null,
      newRemaining: number | null,
      newCycle: number
    ) => {
      const sessionData: PersistedTimerSession = {
        status: newStatus,
        mode: newMode,
        endTime: newEndTime,
        activeRemainingTime: newRemaining,
        cycleCount: newCycle,
      };

      storageService.set(SESSION_STORAGE_KEY, sessionData);

      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.set({
          timer_session: {
            status: newStatus,
            mode: newMode,
            endTime: newEndTime,
            timeLeft: newRemaining ?? getDurationForMode(newMode),
            cycleCount: newCycle,
          },
        });
      }
    },
    [getDurationForMode]
  );

  // Switch mode manually
  const switchMode = useCallback(
    (newMode: Timermode) => {
      setMode(newMode);
      setStatus('idle');
      setActiveRemainingTime(null);
      endTimeRef.current = null;
      persistState('idle', newMode, null, null, cycleCount);
    },
    [cycleCount, persistState]
  );

  // Complete current timer interval
  const handleComplete = useCallback(() => {
    endTimeRef.current = null;

    if (settings.soundEnabled) {
      audioService.playChime(settings.volume);
    }

    if (mode === 'pomodoro') {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fb7185', '#fda4af', '#fbbf24', '#34d399'],
        });
      } catch {
        // Confetti optional
      }

      notificationService.notify(
        '🍅 Pomodoro Finished!',
        'Great work staying focused! Time to recharge.'
      );

      onFocusComplete?.();

      const nextCycle = cycleCount + 1;
      setCycleCount(nextCycle);

      const nextMode: Timermode =
        nextCycle % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';

      setMode(nextMode);
      const nextDuration = getDurationForMode(nextMode);

      if (settings.autoStartBreaks) {
        const nextEndTime = Date.now() + nextDuration * 1000;
        endTimeRef.current = nextEndTime;
        setActiveRemainingTime(nextDuration);
        setStatus('running');
        persistState('running', nextMode, nextEndTime, nextDuration, nextCycle);
      } else {
        setActiveRemainingTime(null);
        setStatus('idle');
        persistState('idle', nextMode, null, null, nextCycle);
      }
    } else {
      notificationService.notify(
        '☕ Break Complete!',
        'Break time is over. Ready to start your next focus session?'
      );

      onBreakComplete?.();

      setMode('pomodoro');
      const nextDuration = getDurationForMode('pomodoro');

      if (settings.autoStartPomodoros) {
        const nextEndTime = Date.now() + nextDuration * 1000;
        endTimeRef.current = nextEndTime;
        setActiveRemainingTime(nextDuration);
        setStatus('running');
        persistState('running', 'pomodoro', nextEndTime, nextDuration, cycleCount);
      } else {
        setActiveRemainingTime(null);
        setStatus('idle');
        persistState('idle', 'pomodoro', null, null, cycleCount);
      }
    }
  }, [
    cycleCount,
    getDurationForMode,
    mode,
    onBreakComplete,
    onFocusComplete,
    persistState,
    settings.autoStartBreaks,
    settings.autoStartPomodoros,
    settings.longBreakInterval,
    settings.soundEnabled,
    settings.volume,
  ]);

  // Handle focus completion callback if timer expired while popup was closed
  useEffect(() => {
    if (initial.completedWhileClosed) {
      onFocusComplete?.();
    }
  }, [initial.completedWhileClosed, onFocusComplete]);

  // Start / Pause toggle
  const togglePlayPause = useCallback(() => {
    if (status === 'running') {
      const remainingSeconds = timeLeft;
      setStatus('paused');
      endTimeRef.current = null;
      setActiveRemainingTime(remainingSeconds);
      persistState('paused', mode, null, remainingSeconds, cycleCount);
    } else {
      notificationService.requestPermission();
      const currentSeconds = timeLeft;
      const targetEndTime = Date.now() + currentSeconds * 1000;
      endTimeRef.current = targetEndTime;
      setActiveRemainingTime(currentSeconds);
      setStatus('running');
      persistState('running', mode, targetEndTime, currentSeconds, cycleCount);
    }
  }, [status, timeLeft, mode, cycleCount, persistState]);

  // Reset timer to full duration
  const resetTimer = useCallback(() => {
    setStatus('idle');
    setActiveRemainingTime(null);
    endTimeRef.current = null;
    persistState('idle', mode, null, null, cycleCount);
  }, [mode, cycleCount, persistState]);

  // Skip to next stage
  const skipTimer = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  // Drift-free ticker using timestamp comparison
  useEffect(() => {
    if (status !== 'running') return;

    const interval = setInterval(() => {
      if (!endTimeRef.current) return;
      const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      setActiveRemainingTime(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleComplete();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [status, handleComplete]);

  // Sync document title with current countdown
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');
    const label =
      mode === 'pomodoro'
        ? 'Focus'
        : mode === 'shortBreak'
        ? 'Short Break'
        : 'Long Break';

    document.title = `${mins}:${secs} - ${label} | Pomodoro`;
  }, [timeLeft, mode]);

  // When idle and settings change, sync new duration to storage
  useEffect(() => {
    if (status === 'idle') {
      const dur = getDurationForMode(mode);
      storageService.set(SESSION_STORAGE_KEY, {
        status: 'idle',
        mode,
        endTime: null,
        activeRemainingTime: null,
        cycleCount,
      });
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.set({
          timer_session: {
            status: 'idle',
            mode,
            endTime: null,
            timeLeft: dur,
            cycleCount,
          },
        });
      }
    }
  }, [settings, mode, status, cycleCount, getDurationForMode]);

  const totalDuration = getDurationForMode(mode);
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;

  return {
    mode,
    status,
    timeLeft,
    progress,
    cycleCount,
    switchMode,
    togglePlayPause,
    resetTimer,
    skipTimer,
  };
}
